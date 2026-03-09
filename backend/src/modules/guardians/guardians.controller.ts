import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGuardians = async (req: Request, res: Response) => {
    try {
        const guardians = await prisma.guardian.findMany({
            orderBy: { created_at: 'desc' },
            include: { kinship_type: true }
        });
        return res.status(200).json({ success: true, data: guardians });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateGuardian = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, email, phone, kinship_type_id } = req.body;

        const guardian = await prisma.guardian.update({
            where: { id },
            data: { name, email, phone, kinship_type_id }
        });

        return res.status(200).json({ success: true, data: guardian, message: 'Guardian updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteGuardian = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.guardian.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Guardian deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
