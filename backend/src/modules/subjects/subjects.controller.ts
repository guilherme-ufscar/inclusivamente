import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Subjects
export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: { _count: { select: { Chapters: true } } }
        });
        return res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, icon, color } = req.body;
        const subject = await prisma.subject.create({
            data: { name, icon, color }
        });
        return res.status(201).json({ success: true, data: subject });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, icon, color } = req.body;
        const subject = await prisma.subject.update({
            where: { id },
            data: { name, icon, color }
        });
        return res.status(200).json({ success: true, data: subject });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.subject.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Subject deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Chapters
export const getChapters = async (req: Request, res: Response) => {
    try {
        const { subject_id } = req.query as any;
        const filter = subject_id ? { subject_id: String(subject_id) } : {};
        const chapters = await prisma.chapter.findMany({
            where: filter,
            include: { subject: { select: { name: true } } },
            orderBy: { order: 'asc' }
        });
        return res.status(200).json({ success: true, data: chapters });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createChapter = async (req: Request, res: Response) => {
    try {
        const { name, subject_id, content, order } = req.body;
        const chapter = await prisma.chapter.create({
            data: { name, subject_id, content, order: Number(order || 0) }
        });
        return res.status(201).json({ success: true, data: chapter });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateChapter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, subject_id, content, order } = req.body;
        const chapter = await prisma.chapter.update({
            where: { id },
            data: { name, subject_id, content, order: Number(order || 0) }
        });
        return res.status(200).json({ success: true, data: chapter });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.chapter.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Chapter deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
