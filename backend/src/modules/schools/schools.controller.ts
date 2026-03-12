import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getSchools = async (req: Request, res: Response) => {
    try {
        const schools = await prisma.school.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { Students: true, Tutors: true, Classes: true }
                },
                Users: {
                    where: { role: 'school' },
                    select: { id: true, email: true }
                }
            }
        });

        const data = schools.map(s => ({
            ...s,
            has_account: s.Users.length > 0,
            account_email: s.Users[0]?.email || null,
        }));

        return res.status(200).json({ success: true, data });
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
                Tutors: true,
                Users: {
                    where: { role: 'school' },
                    select: { id: true, email: true }
                }
            }
        });

        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...school,
                has_account: school.Users.length > 0,
                account_email: school.Users[0]?.email || null,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createSchool = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, document, address, password } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        // Create the school record
        const school = await prisma.school.create({
            data: { name, email, phone, document, address }
        });

        // If email and password provided, create a User account for the school
        if (email && password) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário.' });
            }

            const password_hash = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password_hash,
                    role: 'school',
                    school_id: school.id,
                }
            });
        }

        return res.status(201).json({ success: true, data: school, message: 'School created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, email, phone, document, address, password } = req.body;

        const school = await prisma.school.update({
            where: { id },
            data: { name, email, phone, document, address }
        });

        // Find existing school user account
        const schoolUser = await prisma.user.findFirst({
            where: { school_id: id, role: 'school' }
        });

        if (schoolUser) {
            // Update existing user account
            const updateData: any = {};
            if (email) updateData.email = email;
            if (name) updateData.name = name;
            if (password) updateData.password_hash = await bcrypt.hash(password, 10);

            if (Object.keys(updateData).length > 0) {
                await prisma.user.update({
                    where: { id: schoolUser.id },
                    data: updateData
                });
            }
        } else if (email && password) {
            // Create new user account if none exists yet
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (!existingUser) {
                const password_hash = await bcrypt.hash(password, 10);
                await prisma.user.create({
                    data: {
                        name: name || school.name,
                        email,
                        password_hash,
                        role: 'school',
                        school_id: school.id,
                    }
                });
            }
        }

        return res.status(200).json({ success: true, data: school, message: 'School updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteSchool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;

        // Delete associated school user accounts first
        await prisma.user.deleteMany({
            where: { school_id: id, role: 'school' }
        });

        await prisma.school.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'School deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
