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
            // Default placeholder dates (will be adjusted below)
            start = new Date();
            end = new Date();
        } else {
            // filter_type === 'period' or default
            start = period_start ? new Date(period_start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
            end = period_end ? new Date(period_end) : new Date();
            // Ensure end includes the full day
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

        // Weighted percentage of autonomy. 100% being perfectly autonomous
        const autonomy_percentage = autonomyEntries > 0 ? (autonomyScore / autonomyEntries) :
            (activities_without_tutor_count / (logs.length || 1)) * 100;

        let tutorLevel: TutorRecommendation = 'sporadic';
        if (autonomy_percentage > 70) tutorLevel = 'not_needed';
        else if (autonomy_percentage < 30) tutorLevel = 'continuous';

        const count = logs.length;
        let generatedSummary = `O aluno completou ${count} atividades. `;

        if (count > 0) {
            let contextData = logs.map(l =>
                `Data: ${l.completed_at?.toLocaleDateString()} | Erros: ${l.errors_count} | Acertos: ${l.correct_count} | Nível: ${l.difficulty_perceived} | Autonomia: ${l.autonomy_level} | Tutor (Obs): ${l.tutor_observations || 'N/A'}`
            ).join('\n');

            if (process.env.GEMINI_API_KEY) {
                try {
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const prompt = `Atue como um especialista pedagogo de educação inclusiva. Analise friamente o histórico de ${count} atividades abaixo. 
Gere um parágrafo único, analítico e compreensível, apontando os maiores desafios, a evolução do aluno baseado nos erros e acertos, e o nível de intervenção requerido. 
Leve muito em consideração as observações dos tutores se houver.
Histórico de dados:\n${contextData}`;

                    const result = await model.generateContent(prompt);
                    generatedSummary = result.response.text();
                } catch (e) {
                    console.error('[GEMINI_ERROR] Failed to generate summary, falling back to heuristic:', e);
                    generatedSummary += getHeuristicSummary(autonomy_percentage, logs);
                }
            } else {
                generatedSummary += getHeuristicSummary(autonomy_percentage, logs);
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
