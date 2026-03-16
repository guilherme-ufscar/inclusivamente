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
        const anyLogs = logs as any[];
        const bnccCodes = [...new Set(anyLogs.map(l => l.bncc_codigo).filter(Boolean))] as string[];

        interface BnccEnriched {
            code: string;
            habilidade?: string;
            descricao?: string;
            etapa?: string;
            disciplina?: string;
            disciplinasRelacionadas: string[];
            pilulas: string[];
            acertos: number;
            erros: number;
            atividadesCount: number;
        }

        let bnccEnriched: BnccEnriched[] = [];
        if (bnccCodes.length > 0) {
            const bnccCompetences = await prisma.bnccCompetence.findMany({
                where: { code: { in: bnccCodes } }
            });
            const chaptersWithSubject = await prisma.chapter.findMany({
                where: { OR: bnccCodes.map(code => ({ content: { contains: code } })) },
                include: { subject: true }
            });

            bnccEnriched = bnccCodes.map(code => {
                const competence = bnccCompetences.find(c => c.code === code);
                const chapters = chaptersWithSubject.filter(ch => ch.content?.includes(code));
                const logsForCode = anyLogs.filter(l => l.bncc_codigo === code);
                return {
                    code,
                    habilidade: competence?.title ?? undefined,
                    descricao: competence?.description ?? undefined,
                    etapa: competence?.stage ?? undefined,
                    disciplina: competence?.subject ?? undefined,
                    disciplinasRelacionadas: [...new Set(chapters.map(ch => ch.subject?.name).filter(Boolean))] as string[],
                    pilulas: chapters.map(ch => ch.name),
                    acertos: logsForCode.reduce((acc, l) => acc + (l.correct_count || 0), 0),
                    erros: logsForCode.reduce((acc, l) => acc + (l.errors_count || 0), 0),
                    atividadesCount: logsForCode.length,
                };
            });
        }

        // ─── GERAÇÃO DO RELATÓRIO ─────────────────────────────────────────────
        const count = logs.length;
        let generatedSummary = '';

        if (count > 0) {
            generatedSummary = buildHeuristicReport(autonomy_percentage, logs, bnccEnriched);
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

interface BnccEnriched {
    code: string;
    habilidade?: string;
    descricao?: string;
    etapa?: string;
    disciplina?: string;
    disciplinasRelacionadas: string[];
    pilulas: string[];
    acertos: number;
    erros: number;
    atividadesCount: number;
}

function buildHeuristicReport(autonomy_percentage: number, logs: any[], bnccEnriched: BnccEnriched[]): string {
    const count = logs.length;
    const totalAcertos = logs.reduce((acc, l) => acc + (l.correct_count || 0), 0);
    const totalErros = logs.reduce((acc, l) => acc + (l.errors_count || 0), 0);
    const taxaAcerto = (totalAcertos + totalErros) > 0
        ? Math.round((totalAcertos / (totalAcertos + totalErros)) * 100)
        : null;
    const tutorObsList = logs.filter(l => l.tutor_observations).map(l => l.tutor_observations);
    const interventions = logs.filter(l => l.tutor_intervention_needed === true || l.tutor_intervention_needed === 'true').length;
    const highDiff = logs.filter(l => l.difficulty_perceived === 'high').length;

    // ── Parágrafo 1: desempenho geral + cruzamento BNCC ──────────────────────
    let p1 = `No período analisado, o aluno realizou ${count} atividade${count !== 1 ? 's' : ''}, totalizando ${totalAcertos} acerto${totalAcertos !== 1 ? 's' : ''} e ${totalErros} erro${totalErros !== 1 ? 's' : ''}`;
    if (taxaAcerto !== null) {
        p1 += ` (taxa de acerto de ${taxaAcerto}%)`;
    }
    p1 += '.';

    if (highDiff > 0) {
        p1 += ` Em ${highDiff} atividade${highDiff !== 1 ? 's' : ''} o nível de dificuldade percebida foi elevado, sinalizando conteúdos que requerem atenção pedagógica adicional.`;
    }

    if (bnccEnriched.length > 0) {
        p1 += ` As habilidades da Base Nacional Comum Curricular (BNCC) trabalhadas no período foram:`;
        bnccEnriched.forEach(b => {
            p1 += ` A competência ${b.code}`;
            if (b.habilidade) p1 += ` — "${b.habilidade}"`;
            if (b.disciplina || b.disciplinasRelacionadas.length > 0) {
                const disc = b.disciplina || b.disciplinasRelacionadas.join(', ');
                p1 += `, da disciplina de ${disc}`;
            }
            if (b.etapa) p1 += ` (${b.etapa})`;
            if (b.descricao) p1 += `, que propõe ${b.descricao.charAt(0).toLowerCase() + b.descricao.slice(1)}`;
            if (b.pilulas.length > 0) {
                const pilulasStr = b.pilulas.slice(0, 2).join(' e ');
                p1 += `, foi trabalhada por meio da${b.pilulas.length > 1 ? 's' : ''} pílula${b.pilulas.length > 1 ? 's' : ''} "${pilulasStr}"`;
            }
            const taxaB = (b.acertos + b.erros) > 0 ? Math.round((b.acertos / (b.acertos + b.erros)) * 100) : null;
            p1 += `, com ${b.acertos} acerto${b.acertos !== 1 ? 's' : ''} e ${b.erros} erro${b.erros !== 1 ? 's' : ''} em ${b.atividadesCount} atividade${b.atividadesCount !== 1 ? 's' : ''}`;
            if (taxaB !== null) p1 += ` (${taxaB}% de aproveitamento)`;
            p1 += '.';
        });
    } else {
        p1 += ' Não foram identificadas competências BNCC associadas às atividades do período.';
    }

    // ── Parágrafo 2: autonomia, intervenção e recomendação ───────────────────
    let p2: string;
    if (autonomy_percentage > 70) {
        p2 = `Quanto à autonomia, o aluno demonstrou desempenho independente ao longo do período (${autonomy_percentage.toFixed(0)}% de autonomia), executando as tarefas com assertividade e com mínima necessidade de mediação externa.`;
    } else if (autonomy_percentage < 30) {
        p2 = `Quanto à autonomia, o aluno apresentou forte dependência de mediação ao longo do período (${autonomy_percentage.toFixed(0)}% de autonomia), necessitando de suporte constante para a realização das atividades.`;
    } else {
        p2 = `Quanto à autonomia, o aluno apresentou nível intermediário de independência (${autonomy_percentage.toFixed(0)}% de autonomia), com variações conforme o tipo de atividade e a complexidade do conteúdo.`;
    }

    if (interventions > 0) {
        p2 += ` Foram registradas intervenções do tutor em ${interventions} atividade${interventions !== 1 ? 's' : ''}.`;
    }
    if (tutorObsList.length > 0) {
        p2 += ` Os tutores registraram as seguintes observações: ${tutorObsList.slice(0, 3).join('; ')}.`;
    }

    if (autonomy_percentage > 70) {
        p2 += ' Recomenda-se suporte tutorial esporádico ou dispensável, incentivando a consolidação da independência do aluno.';
    } else if (autonomy_percentage < 30) {
        p2 += ' Recomenda-se manutenção do suporte tutorial contínuo, com estratégias graduais de mediação para desenvolver progressivamente a autonomia.';
    } else {
        p2 += ' Recomenda-se suporte tutorial esporádico, com atenção especial às competências que apresentaram maior taxa de erros ou dificuldade percebida elevada.';
    }

    return `${p1}\n\n${p2}`;
}
