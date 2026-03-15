import { Request, Response } from 'express';
import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Webhook publico para plataformas de games externas
 * Espera um corpo com o log_id da atividade e os resultados
 */
export const handleGamesWebhook = async (req: Request, res: Response) => {
    try {
        const { log_id, time_spent, errors_count, correct_count, difficulty_perceived, bncc_codigo, webhook_secret } = req.body;

        // Validação simples de segredo para evitar abusos no webhook público
        if (webhook_secret !== process.env.GAMES_WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
            return res.status(401).json({ success: false, message: 'Invalid webhook secret' });
        }

        if (!log_id) {
            return res.status(400).json({ success: false, message: 'log_id is required' });
        }

        const log = await prisma.activityLog.update({
            where: { id: log_id },
            data: {
                completed_at: new Date(),
                time_spent: Number(time_spent) || 0,
                errors_count: Number(errors_count) || 0,
                correct_count: Number(correct_count) || 0,
                difficulty_perceived: (difficulty_perceived as Difficulty) || 'medium',
                bncc_codigo: bncc_codigo || null
            }
        });

        // O escopo diz: "Webhook de retorno dispara solicitação de feedback para o tutor"
        // Em um sistema real, aqui dispararíamos um Push Notification ou Socket.io para o Tutor
        console.log(`[Webhook] Atividade ${log_id} concluída. Feedback do tutor agora é elegível.`);

        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            requires_tutor_feedback: log.has_tutor
        });

    } catch (error) {
        console.error('[Games Webhook Error]:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
