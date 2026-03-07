import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSchools = async (req: Request, res: Response) => {
    try {
        const schools = await prisma.school.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { Students: true, Tutors: true, Users: true }
                }
            }
        });
        return res.status(200).json({ success: true, data: schools });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getSchoolById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const school = await prisma.school.findUnique({
            where: { id },
            include: {
                Students: true,
                Tutors: true
            }
        });

        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        return res.status(200).json({ success: true, data: school });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createSchool = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, document, address } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const school = await prisma.school.create({
            data: { name, email, phone, document, address }
        });

        return res.status(201).json({ success: true, data: school, message: 'School created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, email, phone, document, address } = req.body;

        const school = await prisma.school.update({
            where: { id },
            data: { name, email, phone, document, address }
        });

        return res.status(200).json({ success: true, data: school, message: 'School updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.school.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'School deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
