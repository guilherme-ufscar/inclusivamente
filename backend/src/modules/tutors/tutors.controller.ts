import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getTutors = async (req: Request, res: Response) => {
    try {
        const { school_id } = req.query as any;
        const filter = school_id ? { school_id: String(school_id) } : {};

        const tutors = await prisma.tutor.findMany({
            where: filter,
            orderBy: { created_at: 'desc' },
            include: {
                school: { select: { name: true } },
                user: { select: { id: true, email: true } }
            }
        });

        const data = tutors.map(t => ({
            ...t,
            has_account: !!t.user,
            account_email: t.user?.email || null,
        }));

        return res.status(200).json({ success: true, data });
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
            orderBy: { created_at: 'desc' },
            include: { user: { select: { id: true, email: true } } }
        });

        const data = tutors.map(t => ({
            ...t,
            has_account: !!t.user,
            account_email: t.user?.email || null,
        }));

        return res.status(200).json({ success: true, data });
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
            include: {
                school: true,
                user: { select: { id: true, email: true } }
            }
        });

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...tutor,
                has_account: !!tutor.user,
                account_email: tutor.user?.email || null,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createTutor = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, school_id, specialty, password } = req.body;

        if (!name || !school_id) {
            return res.status(400).json({ success: false, message: 'Name and School ID are required' });
        }

        let user_id: string | undefined = undefined;

        // If email and password provided, create a User account for the tutor
        if (email && password) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário.' });
            }

            const password_hash = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password_hash,
                    role: 'tutor',
                    school_id,
                }
            });
            user_id = newUser.id;
        }

        const tutor = await prisma.tutor.create({
            data: {
                name,
                email,
                phone,
                school_id,
                specialty,
                user_id
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
        const { name, email, phone, specialty, password } = req.body;

        const tutor = await prisma.tutor.update({
            where: { id },
            data: { name, email, phone, specialty }
        });

        // Find existing tutor user account
        const existingTutor = await prisma.tutor.findUnique({
            where: { id },
            include: { user: true }
        });

        if (existingTutor?.user) {
            // Update existing user account
            const updateData: any = {};
            if (email) updateData.email = email;
            if (name) updateData.name = name;
            if (password) updateData.password_hash = await bcrypt.hash(password, 10);

            if (Object.keys(updateData).length > 0) {
                await prisma.user.update({
                    where: { id: existingTutor.user.id },
                    data: updateData
                });
            }
        } else if (email && password) {
            // Create new user account if none exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (!existingUser) {
                const password_hash = await bcrypt.hash(password, 10);
                const newUser = await prisma.user.create({
                    data: {
                        name: name || tutor.name,
                        email,
                        password_hash,
                        role: 'tutor',
                        school_id: tutor.school_id,
                    }
                });
                // Link user to tutor
                await prisma.tutor.update({
                    where: { id },
                    data: { user_id: newUser.id }
                });
            }
        }

        return res.status(200).json({ success: true, data: tutor, message: 'Tutor updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteTutor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;

        // Find and delete associated user account
        const tutor = await prisma.tutor.findUnique({ where: { id }, include: { user: true } });
        
        // Unlink first, then delete user
        await prisma.tutor.update({ where: { id }, data: { user_id: null } });
        
        if (tutor?.user) {
            await prisma.user.delete({ where: { id: tutor.user.id } });
        }
        
        await prisma.tutor.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Tutor deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
