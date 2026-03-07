import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendFamilyCheckins = async (req: Request, res: Response) => {
    try {
        const { student_ids, channel, template_version } = req.body;

        // Em um cenário real, isso adicionaria tarefas a uma fila Redis (usando BullMQ por exemplo)
        // Para simplificar a API síncrona, simulamos o registro no banco de dados.

        const checkins = await Promise.all(
            (student_ids as string[]).map(async (student_id) => {
                return prisma.familyCheckin.create({
                    data: {
                        student_id,
                        channel: channel || 'whatsapp',
                        template_version: template_version || 'v1',
                        status: 'sent',
                        sent_at: new Date()
                    }
                });
            })
        );

        return res.status(200).json({ success: true, data: checkins, message: 'Check-ins dispatched successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getStudentCheckins = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const checkins = await prisma.familyCheckin.findMany({
            where: { student_id: id },
            orderBy: { created_at: 'desc' }
        });

        return res.status(200).json({ success: true, data: checkins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
