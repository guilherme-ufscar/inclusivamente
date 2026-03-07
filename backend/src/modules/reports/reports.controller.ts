import { Request, Response } from 'express';
import { PrismaClient, TutorRecommendation } from '@prisma/client';

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
        const { period_start, period_end } = req.body;
        const generated_by = req.user?.userId;

        const start = period_start ? new Date(period_start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = period_end ? new Date(period_end) : new Date();

        const logs = await prisma.activityLog.findMany({
            where: {
                student_id: id,
                started_at: { gte: start, lte: end },
                completed_at: { not: null }
            }
        });

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
        let text = `O aluno completou ${count} atividades no período. `;
        if (count > 0) {
            if (autonomy_percentage > 70) {
                text += 'Seu nível de autonomia é notavelmente alto na maioria das tarefas.';
            } else if (autonomy_percentage < 30) {
                text += 'Tem apresentado forte dependência nas dinâmicas e precisa de apoio tutorial consistente.';
            } else {
                text += 'Sua autonomia é mediana, precisando de breves intervenções pontuais do tutor.';
            }
        } else {
            text = 'Nenhuma atividade registrada no período.';
            tutorLevel = 'not_needed';
        }

        const report = await prisma.report.create({
            data: {
                student_id: id,
                period_start: start,
                period_end: end,
                summary_text: text,
                activities_with_tutor_count,
                activities_without_tutor_count,
                autonomy_percentage,
                tutor_recommendation: tutorLevel,
                generated_by
            }
        });

        return res.status(201).json({ success: true, data: report, message: 'Report generated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
