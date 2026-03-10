import { Request, Response } from 'express';
import { PrismaClient, AutonomyLevel, InterventionNeeded, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

export const startActivity = async (req: Request | any, res: Response) => {
    try {
        let { student_id, studentId, activity_id, activityId, has_tutor, hasTutor, tutor_id, tutorId } = req.body;

        student_id = student_id || studentId;
        activity_id = activity_id || activityId;
        has_tutor = has_tutor !== undefined ? has_tutor : hasTutor;
        tutor_id = tutor_id || tutorId;

        // Se student_id não vier no body, pega do token (ideal para o jogo)
        if (!student_id && req.user) {
            if (req.user.id) {
                // Se o token já tiver o id do estudante (adicionado no login/registro)
                student_id = req.user.id;
            } else {
                // Tenta buscar o profile do estudante associado a este usuario
                const studentProfile = await prisma.student.findFirst({
                    where: { user_id: req.user.userId }
                });
                if (studentProfile) {
                    student_id = studentProfile.id;
                }
            }
        }

        if (!student_id || !activity_id) {
            return res.status(400).json({ success: false, message: 'Student ID and Activity ID are required' });
        }

        if (has_tutor && !tutor_id) {
            return res.status(400).json({ success: false, message: 'Tutor ID is required when has_tutor is true' });
        }

        const log = await prisma.activityLog.create({
            data: {
                student_id,
                activity_id,
                has_tutor: Boolean(has_tutor),
                tutor_id: has_tutor ? tutor_id : null,
                started_at: new Date()
            }
        });

        return res.status(201).json({ success: true, data: log, message: 'Activity started' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const finishActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        let { time_spent, timeSpent, errors_count, errorsCount, correct_count, correctCount, difficulty_perceived, difficultyPerceived } = req.body;

        time_spent = time_spent ?? timeSpent;
        errors_count = errors_count ?? errorsCount;
        correct_count = correct_count ?? correctCount;
        difficulty_perceived = difficulty_perceived ?? difficultyPerceived;

        const diff = difficulty_perceived as Difficulty;

        const log = await prisma.activityLog.update({
            where: { id: id },
            data: {
                completed_at: new Date(),
                time_spent: time_spent !== undefined ? Number(time_spent) : undefined,
                errors_count: errors_count !== undefined ? Number(errors_count) : undefined,
                correct_count: correct_count !== undefined ? Number(correct_count) : undefined,
                difficulty_perceived: diff
            }
        });

        return res.status(200).json({ success: true, data: log, message: 'Activity finished' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const submitTutorFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { autonomy_level, tutor_intervention_needed, tutor_observations, tutor_recommendation } = req.body;

        const log = await prisma.activityLog.findUnique({ where: { id: id } });
        if (!log) {
            return res.status(404).json({ success: false, message: 'Activity log not found.' });
        }

        // Se o log não tinha tutor marcado, mas agora o tutor está enviando feedback, 
        // podemos assumir que ele estava lá ou estamos corrigindo o log.
        // No entanto, a regra geralmente exige que has_tutor seja true.

        // Automatic recommendation logic
        let autoRecommendation = tutor_recommendation;
        if (!autoRecommendation && autonomy_level) {
            if (autonomy_level === 'low') autoRecommendation = 'continuous';
            else if (autonomy_level === 'medium') autoRecommendation = 'sporadic';
            else if (autonomy_level === 'high') autoRecommendation = 'not_needed';
        }

        const updatedLog = await prisma.activityLog.update({
            where: { id: id },
            data: {
                autonomy_level: autonomy_level as AutonomyLevel,
                tutor_intervention_needed: tutor_intervention_needed as InterventionNeeded,
                tutor_observations,
                tutor_recommendation: autoRecommendation
            }
        });

        return res.status(200).json({ success: true, data: updatedLog, message: 'Tutor feedback submitted and recommendation generated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getStudentActivityLogs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const logs = await prisma.activityLog.findMany({
            where: { student_id: id },
            orderBy: { started_at: 'desc' },
            include: { tutor: { select: { name: true } } }
        });
        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getActivityLogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const log = await prisma.activityLog.findUnique({
            where: { id },
            include: { student: { select: { name: true } }, tutor: { select: { name: true } } }
        });
        if (!log) {
            return res.status(404).json({ success: false, message: 'Log not found' });
        }
        return res.status(200).json({ success: true, data: log });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getGlobalTutorHistory = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.activityLog.findMany({
            where: { has_tutor: true, completed_at: { not: null } },
            orderBy: { completed_at: 'desc' },
            include: {
                student: { select: { name: true } },
                tutor: { select: { name: true, specialty: true } }
            }
        });
        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getGameSessionDetails = async (req: Request, res: Response) => {
    try {
        const { log_id } = req.params as any;
        const log = await prisma.activityLog.findUnique({
            where: { id: log_id },
            include: { student: { select: { name: true } } }
        });

        if (!log) {
            return res.status(404).json({ success: false, message: 'Activity session not found or invalid log_id.' });
        }

        return res.status(200).json({
            success: true,
            data: {
                log_id: log.id,
                activity_id: log.activity_id,
                student_name: log.student?.name || 'Aluno',
                has_tutor: log.has_tutor,
                started_at: log.started_at
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const markActivityAsCompleted = async (req: Request, res: Response) => {
    try {
        let { student_id, studentId, activity_id, activityId } = req.body;

        let finalStudentId = student_id || studentId;
        const finalActivityId = activity_id || activityId;

        if (!finalStudentId || !finalActivityId) {
            return res.status(400).json({ success: false, message: 'Student ID and Activity ID are required' });
        }

        // Tentar verificar se o ID fornecido foi na verdade um ID de Usuário (User ID) em vez do ID do Estudante.
        const providedUser = await prisma.user.findUnique({ where: { id: finalStudentId } });
        if (providedUser && providedUser.role === 'student') {
            const linkedStudent = await prisma.student.findFirst({ where: { user_id: providedUser.id } });
            if (linkedStudent) {
                finalStudentId = linkedStudent.id;
            }
        }

        // Verifica se já existe para não duplicar (caso faça mais de 2 vezes, contabiliza só 1)
        const existing = await prisma.completedGameActivity.findUnique({
            where: {
                student_id_activity_id: { student_id: finalStudentId, activity_id: finalActivityId }
            }
        });

        if (existing) {
            return res.status(200).json({ success: true, message: 'Activity already marked as completed', data: existing });
        }

        const completed = await prisma.completedGameActivity.create({
            data: {
                student_id: finalStudentId,
                activity_id: finalActivityId
            }
        });

        return res.status(201).json({ success: true, data: completed, message: 'Activity marked as completed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error (Verify if the ID is a valid student ID and if the database was migrated)' });
    }
};

export const getCompletedActivities = async (req: Request, res: Response) => {
    try {
        let { student_id } = req.params as any;

        if (!student_id) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        // Tentar verificar se o ID fornecido foi na verdade um ID de Usuário (User ID) em vez do ID do Estudante.
        const providedUser = await prisma.user.findUnique({ where: { id: student_id } });
        if (providedUser && providedUser.role === 'student') {
            const linkedStudent = await prisma.student.findFirst({ where: { user_id: providedUser.id } });
            if (linkedStudent) {
                student_id = linkedStudent.id;
            }
        }

        const completed = await prisma.completedGameActivity.findMany({
            where: { student_id },
            select: { activity_id: true, completed_at: true }
        });

        const activities = completed.map((c: any) => c.activity_id);

        return res.status(200).json({ success: true, data: activities, completedData: completed });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
