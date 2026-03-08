import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClasses = async (req: Request, res: Response) => {
    try {
        const { school_id } = req.query as any;
        const filter = school_id ? { school_id: String(school_id) } : {};

        const classes = await prisma.class.findMany({
            where: filter,
            include: {
                school: { select: { name: true } },
                _count: { select: { Students: true } }
            },
            orderBy: { name: 'asc' }
        });
        return res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createClass = async (req: Request, res: Response) => {
    try {
        const { name, grade, school_id } = req.body;
        if (!name || !school_id) {
            return res.status(400).json({ success: false, message: 'Name and School ID are required' });
        }

        const newClass = await prisma.class.create({
            data: { name, grade, school_id }
        });
        return res.status(201).json({ success: true, data: newClass });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, grade, school_id } = req.body;

        const updatedClass = await prisma.class.update({
            where: { id },
            data: { name, grade, school_id }
        });
        return res.status(200).json({ success: true, data: updatedClass });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.class.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Class deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
