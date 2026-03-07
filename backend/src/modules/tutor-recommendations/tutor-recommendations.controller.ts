import { Request, Response } from 'express';
import { PrismaClient, TutorRecommendation } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * percentual_com_tutor = (atividades_com_tutor / total_atividades) * 100
 * nível_autonomia_medio = média qualitativa dos últimos 10 registros
 * 
 * Se percentual_com_tutor > 70% e nivel_autonomia_medio = low -> continuous
 * Se percentual_com_tutor entre 30% e 70% e nivel_autonomia_medio = medium -> sporadic
 * Se percentual_com_tutor < 30% e nivel_autonomia_medio = high -> not_needed
 */
export const getTutorRecommendation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id

        // Only consider concluded activities where there could be tutor assignment
        const logs = await prisma.activityLog.findMany({
            where: { student_id: id, completed_at: { not: null } },
            orderBy: { completed_at: 'desc' }
        });

        if (logs.length < 3) {
            return res.status(200).json({
                success: true,
                data: {
                    student_id: id,
                    recommendation: null,
                    status: 'neutral',
                    status_text: 'Amostragem insuficiente. O aluno precisa completar pelo menos 3 atividades para uma recomendação.',
                    metrics: {
                        total_activities: logs.length,
                        activities_with_tutor: logs.filter(l => l.has_tutor).length,
                        avg_autonomy_level: null
                    }
                }
            });
        }

        const activitiesWithTutor = logs.filter(l => l.has_tutor).length;
        const percentualComTutor = (activitiesWithTutor / logs.length) * 100;

        // Last 10 records for autonomy
        const last10 = logs.slice(0, 10).filter(l => l.autonomy_level);

        // Average Qualitative
        let autonomyScore = 0;
        last10.forEach(l => {
            if (l.autonomy_level === 'high') autonomyScore += 3;
            if (l.autonomy_level === 'medium') autonomyScore += 2;
            if (l.autonomy_level === 'low') autonomyScore += 1;
        });

        let avgLevel = 'medium';
        if (last10.length > 0) {
            const avg = autonomyScore / last10.length;
            if (avg >= 2.5) avgLevel = 'high';
            else if (avg <= 1.5) avgLevel = 'low';
        } else {
            // Default fallback if no autonomy levels recorded
            if (percentualComTutor > 70) avgLevel = 'low';
            else if (percentualComTutor < 30) avgLevel = 'high';
        }

        let recommendation: TutorRecommendation = 'sporadic';
        let statusText = 'O aluno apresenta dificuldades pontuais e pode se beneficiar de acompanhamento esporádico.';
        let statusEmoji = '🟡';

        if (percentualComTutor > 70 && avgLevel === 'low') {
            recommendation = 'continuous';
            statusText = 'O aluno requer apoio contínuo. Notou-se alta dependência de tutor nas últimas atividades.';
            statusEmoji = '🔴';
        } else if (percentualComTutor < 30 && avgLevel === 'high') {
            recommendation = 'not_needed';
            statusText = 'O aluno demonstra boa autonomia e realiza a maioria das atividades sem apoio.';
            statusEmoji = '🟢';
        }

        return res.status(200).json({
            success: true,
            data: {
                student_id: id,
                recommendation,
                status_emoji: statusEmoji,
                status_text: statusText,
                metrics: {
                    total_activities: logs.length,
                    activities_with_tutor: activitiesWithTutor,
                    avg_autonomy_level: avgLevel
                }
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getTutorHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const logs = await prisma.activityLog.findMany({
            where: { student_id: id, has_tutor: true },
            orderBy: { started_at: 'desc' },
            include: { tutor: { select: { name: true, specialty: true } } }
        });

        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
