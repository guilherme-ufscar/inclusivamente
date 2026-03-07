import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTutors = async (req: Request, res: Response) => {
    try {
        const { school_id } = req.query as any;
        const filter = school_id ? { school_id: String(school_id) } : {};

        const tutors = await prisma.tutor.findMany({
            where: filter,
            orderBy: { created_at: 'desc' },
            include: { school: { select: { name: true } } }
        });
        return res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getTutorsBySchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const tutors = await prisma.tutor.findMany({
            where: { school_id: id },
            orderBy: { created_at: 'desc' }
        });
        return res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getTutorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const tutor = await prisma.tutor.findUnique({
            where: { id },
            include: { school: true }
        });

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }
        return res.status(200).json({ success: true, data: tutor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createTutor = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, school_id, specialty, user_id } = req.body;

        if (!name || !school_id) {
            return res.status(400).json({ success: false, message: 'Name and School ID are required' });
        }

        const tutor = await prisma.tutor.create({
            data: {
                name,
                email,
                phone,
                school_id,
                specialty,
                user_id // Link to user if provided
            }
        });

        return res.status(201).json({ success: true, data: tutor, message: 'Tutor created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateTutor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, email, phone, specialty } = req.body;

        const tutor = await prisma.tutor.update({
            where: { id },
            data: { name, email, phone, specialty }
        });

        return res.status(200).json({ success: true, data: tutor, message: 'Tutor updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteTutor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.tutor.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Tutor deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
