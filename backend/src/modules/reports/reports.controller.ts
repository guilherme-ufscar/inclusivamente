import { Request, Response } from 'express';
import { PrismaClient, TutorRecommendation } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

export const getReports = async (req: Request, res: Response) => {
    try {
        const { student_id } = req.query as any;
        const filter = student_id ? { student_id: String(student_id) } : {};

        const reports = await prisma.report.findMany({
            where: filter,
            orderBy: { generated_at: 'desc' },
            include: { student: { select: { name: true } } }
        });

        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const report = await prisma.report.findUnique({
            where: { id },
            include: { student: { select: { name: true } } }
        });

        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        return res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getStudentReports = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const reports = await prisma.report.findMany({
            where: { student_id: id },
            orderBy: { generated_at: 'desc' }
        });
        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const generateStudentReport = async (req: Request | any, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const { period_start, period_end, filter_type, activity_count } = req.body || {};
        const generated_by = req.user?.userId;

        // ─── BLOQUEIO: verificar avaliações de tutor ──────────────────────────
        // Pega as últimas 10 atividades com tutor concluídas do aluno
        const lastActivitiesWithTutor = await prisma.activityLog.findMany({
            where: { student_id: id, has_tutor: true, completed_at: { not: null } },
            orderBy: { completed_at: 'desc' },
            take: 10
        });

        const isAdmin = req.user?.role === 'admin';

        if (lastActivitiesWithTutor.length > 0 && !isAdmin) {
            const evaluated = lastActivitiesWithTutor.filter(l => l.autonomy_level !== null).length;
            const evaluationRate = evaluated / lastActivitiesWithTutor.length;

            if (evaluationRate < 0.7) {
                return res.status(403).json({
                    success: false,
                    message: `Relatório bloqueado: o tutor avaliou apenas ${Math.round(evaluationRate * 100)}% das últimas ${lastActivitiesWithTutor.length} atividades acompanhadas. É necessário avaliar pelo menos 70% antes de gerar o relatório.`,
                    evaluated_count: evaluated,
                    total_with_tutor: lastActivitiesWithTutor.length,
                    evaluation_rate: Math.round(evaluationRate * 100),
                    pending_evaluations: lastActivitiesWithTutor
                        .filter(l => l.autonomy_level === null)
                        .map(l => ({ log_id: l.id, activity_id: l.activity_id, completed_at: l.completed_at }))
                });
            }
        }

        // ─── CONSULTA DE ATIVIDADES DO PERÍODO ───────────────────────────────
        let queryOptions: any = {
            where: {
                student_id: id,
                completed_at: { not: null }
            },
            orderBy: { completed_at: 'desc' }
        };

        let start: Date;
        let end: Date;

        if (filter_type === 'quantity') {
            const takeCount = activity_count ? parseInt(activity_count, 10) : 5;
            queryOptions.take = takeCount;
            start = new Date();
            end = new Date();
        } else {
            start = period_start ? new Date(period_start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
            end = period_end ? new Date(period_end) : new Date();
            end.setHours(23, 59, 59, 999);
            queryOptions.where.completed_at = { gte: start, lte: end };
        }

        const logs = await prisma.activityLog.findMany(queryOptions);

        if (filter_type === 'quantity' && logs.length > 0) {
            start = logs[logs.length - 1].completed_at as Date;
            end = logs[0].completed_at as Date;
        }

        console.log(`[DEBUG] Generating report for student ${id}`);
        console.log(`[DEBUG] Found ${logs.length} completed activities based on filter ${filter_type || 'period'}.`);

        const activities_with_tutor_count = logs.filter(l => l.has_tutor).length;
        const activities_without_tutor_count = logs.length - activities_with_tutor_count;

        let autonomyScore = 0;
        let autonomyEntries = 0;
        logs.forEach(l => {
            if (l.autonomy_level) {
                if (l.autonomy_level === 'high') autonomyScore += 100;
                if (l.autonomy_level === 'medium') autonomyScore += 50;
                if (l.autonomy_level === 'low') autonomyScore += 0;
                autonomyEntries++;
            }
        });

        const autonomy_percentage = autonomyEntries > 0 ? (autonomyScore / autonomyEntries) :
            (activities_without_tutor_count / (logs.length || 1)) * 100;

        let tutorLevel: TutorRecommendation = 'sporadic';
        if (autonomy_percentage > 70) tutorLevel = 'not_needed';
        else if (autonomy_percentage < 30) tutorLevel = 'continuous';

        // ─── CRUZAMENTO BNCC ──────────────────────────────────────────────────
        // Coleta códigos BNCC únicos presentes nas atividades do período
        const bnccCodes = [...new Set(logs.map(l => l.bncc_codigo).filter(Boolean))] as string[];

        let bnccContext = '';
        if (bnccCodes.length > 0) {
            // Busca competências BNCC cadastradas
            const bnccCompetences = await prisma.bnccCompetence.findMany({
                where: { code: { in: bnccCodes } }
            });

            // Busca pílulas (chapters) cujo conteúdo referencia esses códigos BNCC
            const chaptersWithSubject = await prisma.chapter.findMany({
                where: {
                    OR: bnccCodes.map(code => ({ content: { contains: code } }))
                },
                include: { subject: true }
            });

            // Monta contexto BNCC enriquecido para o prompt da IA
            const bnccDetails = bnccCodes.map(code => {
                const competence = bnccCompetences.find(c => c.code === code);
                const chapters = chaptersWithSubject.filter(ch => ch.content?.includes(code));
                const logsForCode = logs.filter(l => l.bncc_codigo === code);
                const totalAcertos = logsForCode.reduce((acc, l) => acc + (l.correct_count || 0), 0);
                const totalErros = logsForCode.reduce((acc, l) => acc + (l.errors_count || 0), 0);

                let detail = `\n• Código BNCC: ${code}`;
                if (competence) {
                    detail += `\n  Habilidade: ${competence.title}`;
                    detail += `\n  Descrição: ${competence.description}`;
                    detail += `\n  Etapa: ${competence.stage} | Disciplina: ${competence.subject}`;
                }
                if (chapters.length > 0) {
                    const subjects = [...new Set(chapters.map(ch => ch.subject?.name).filter(Boolean))];
                    const pillNames = chapters.map(ch => ch.name).join(', ');
                    detail += `\n  Disciplinas relacionadas: ${subjects.join(', ')}`;
                    detail += `\n  Pílulas (conteúdo): ${pillNames}`;
                }
                detail += `\n  Desempenho neste código: ${totalAcertos} acertos / ${totalErros} erros (${logsForCode.length} atividade(s))`;
                return detail;
            }).join('\n');

            bnccContext = `\n\nCOMPETÊNCIAS BNCC TRABALHADAS NO PERÍODO:${bnccDetails}`;
        }

        // ─── GERAÇÃO DO RELATÓRIO ─────────────────────────────────────────────
        const count = logs.length;
        let generatedSummary = `O aluno completou ${count} atividades. `;

        if (count > 0) {
            const contextData = logs.map(l =>
                `Data: ${l.completed_at?.toLocaleDateString('pt-BR')} | BNCC: ${l.bncc_codigo || 'N/A'} | Acertos: ${l.correct_count} | Erros: ${l.errors_count} | Nível: ${l.difficulty_perceived || 'N/A'} | Autonomia: ${l.autonomy_level || 'N/A'} | Intervenção necessária: ${l.tutor_intervention_needed || 'N/A'} | Obs. tutor: ${l.tutor_observations || 'N/A'}`
            ).join('\n');

            if (process.env.GEMINI_API_KEY) {
                try {
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const prompt = `Atue como um especialista pedagogo de educação inclusiva brasileira (BNCC).
Analise o histórico de ${count} atividades do aluno e as competências BNCC trabalhadas abaixo.
Gere um relatório analítico em 2 a 3 parágrafos claros, abordando:
1. Desempenho geral: acertos, erros e dificuldades identificadas por competência BNCC;
2. Relação entre o conteúdo das pílulas/disciplinas e o desempenho observado;
3. Nível de autonomia, necessidade de intervenção e recomendação para o tutor, considerando as observações dos tutores.
Seja objetivo, pedagógico e baseie-se nos dados fornecidos.

HISTÓRICO DE ATIVIDADES:
${contextData}
${bnccContext}`;

                    const result = await model.generateContent(prompt);
                    generatedSummary = result.response.text();
                } catch (e) {
                    console.error('[GEMINI_ERROR] Failed to generate summary, falling back to heuristic:', e);
                    generatedSummary += getHeuristicSummary(autonomy_percentage, logs);
                    if (bnccContext) generatedSummary += ` Competências BNCC trabalhadas: ${bnccCodes.join(', ')}.`;
                }
            } else {
                generatedSummary += getHeuristicSummary(autonomy_percentage, logs);
                if (bnccContext) generatedSummary += ` Competências BNCC trabalhadas: ${bnccCodes.join(', ')}.`;
            }
        } else {
            generatedSummary = 'Nenhuma atividade registrada no período selecionado.';
            tutorLevel = 'not_needed';
        }

        const report = await prisma.report.create({
            data: {
                student_id: id,
                period_start: start,
                period_end: end,
                summary_text: generatedSummary,
                activities_with_tutor_count,
                activities_without_tutor_count,
                autonomy_percentage,
                tutor_recommendation: tutorLevel,
                generated_by
            }
        });

        return res.status(201).json({ success: true, data: report, message: 'Report generated successfully' });
    } catch (error) {
        console.error('[GENERATE_REPORT_ERROR]:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: String(error) });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { tutor_observations } = req.body;

        const report = await prisma.report.update({
            where: { id },
            data: { tutor_observations }
        });

        return res.status(200).json({ success: true, data: report, message: 'Report updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

function getHeuristicSummary(autonomy_percentage: number, logs: any[]) {
    let summary = '';
    const totalErrors = logs.reduce((acc, l) => acc + (l.errors_count || 0), 0);
    const tutorObs = logs.filter(l => l.tutor_observations).map(l => l.tutor_observations).join('; ');

    if (autonomy_percentage > 70) summary += 'Tem apresentado alto nível de autonomia e assertividade nas tarefas. ';
    else if (autonomy_percentage < 30) summary += 'Apresenta forte dependência e necessita de mediação constante. ';
    else summary += 'O desempenho é mediano, exigindo intervenções verbais pontuais na execução. ';

    if (totalErrors > logs.length * 3) summary += 'Foram notadas dificuldades que geraram alta taxa de erros. ';

    if (tutorObs.length > 0) summary += `Notas dos tutores destacam comportamentos importantes no período analisado.`;
    return summary;
}
