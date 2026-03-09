import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGuardianDashboard = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== 'parent') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const guardian = await prisma.guardian.findFirst({
            where: { email: user.email }
        });

        if (!guardian) {
            return res.status(404).json({ success: false, message: 'Guardian profile not found' });
        }

        const students = await prisma.student.findMany({
            where: { primary_guardian_id: guardian.id },
            include: {
                ActivityLogs: {
                    orderBy: { started_at: 'desc' },
                },
                Reports: {
                    orderBy: { generated_at: 'desc' }
                }
            }
        });

        if (students.length === 0) {
            return res.status(200).json({ success: true, data: { stats: { totalActivities: 0, lastReportDate: 'N/A', autonomyTrend: 'Sem dados' }, students: [] } });
        }

        let totalActivities = 0;
        let latestReportDate: any = null;
        let allLogs: any[] = [];

        const studentsData = students.map(student => {
            totalActivities += student.ActivityLogs.length;
            if (student.Reports.length > 0) {
                const reportDate = student.Reports[0].generated_at;
                if (!latestReportDate || reportDate > latestReportDate) {
                    latestReportDate = reportDate;
                }
            }
            allLogs = [...allLogs, ...student.ActivityLogs];
            return {
                id: student.id,
                name: student.name,
                birth_date: student.birth_date,
                grade_level: student.grade_level,
            };
        });

        allLogs.sort((a, b) => b.started_at.getTime() - a.started_at.getTime());

        const recentLogs = allLogs.filter(l => l.autonomy_level).slice(0, 5);
        let autonomyTrend = 'Estável';
        if (recentLogs.length >= 2) {
            const getScore = (l: any) => l.autonomy_level === 'high' ? 3 : l.autonomy_level === 'medium' ? 2 : 1;
            const latest = getScore(recentLogs[0]);
            const previous = getScore(recentLogs[recentLogs.length - 1]);
            if (latest > previous) autonomyTrend = 'Em Crescimento';
            else if (latest < previous) autonomyTrend = 'Em Atenção';
        } else if (recentLogs.length === 0) {
            autonomyTrend = 'Sem avaliações';
        }

        // Timeline events
        const timeline = allLogs.slice(0, 10).map(log => ({
            id: log.id,
            type: 'activity',
            title: `Atividade: ${log.activity_id}`,
            date: log.started_at,
            details: `Acertos: ${log.correct_count || 0} | Erros: ${log.errors_count || 0} ${log.autonomy_level ? `| Autonomia: ${log.autonomy_level}` : ''}`
        }));

        students.forEach(s => {
            s.Reports.forEach(r => {
                timeline.push({
                    id: r.id,
                    type: 'report',
                    title: `Relatório Gerado`,
                    date: r.generated_at,
                    details: r.summary_text
                });
            });
        });

        timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

        return res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalActivities,
                    lastReportDate: latestReportDate ? latestReportDate.toLocaleDateString('pt-BR') : 'Nenhum',
                    autonomyTrend
                },
                students: studentsData,
                timeline: timeline.slice(0, 15)
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getGuardianReports = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== 'parent') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const guardian = await prisma.guardian.findFirst({
            where: { email: user.email }
        });

        if (!guardian) {
            return res.status(404).json({ success: false, message: 'Guardian profile not found' });
        }

        const students = await prisma.student.findMany({
            where: { primary_guardian_id: guardian.id },
            include: {
                Reports: {
                    orderBy: { generated_at: 'desc' }
                }
            }
        });

        const allReports = students.flatMap(s => s.Reports.map(r => ({
            ...r,
            student_name: s.name
        })));

        allReports.sort((a, b) => b.generated_at.getTime() - a.generated_at.getTime());

        return res.status(200).json({
            success: true,
            data: allReports
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
