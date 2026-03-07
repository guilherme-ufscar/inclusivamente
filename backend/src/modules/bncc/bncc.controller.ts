import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBncc = async (req: Request, res: Response) => {
    try {
        const records = await prisma.bnccCompetence.findMany({
            orderBy: { code: 'asc' }
        });
        return res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createBncc = async (req: Request, res: Response) => {
    try {
        const { code, title, description, stage, subject } = req.body;
        const competence = await prisma.bnccCompetence.create({
            data: { code, title, description, stage, subject }
        });
        return res.status(201).json({ success: true, data: competence, message: 'BNCC Competence created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateBncc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { code, title, description, stage, subject } = req.body;
        const competence = await prisma.bnccCompetence.update({
            where: { id },
            data: { code, title, description, stage, subject }
        });
        return res.status(200).json({ success: true, data: competence, message: 'BNCC updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteBncc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.bnccCompetence.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'BNCC deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
