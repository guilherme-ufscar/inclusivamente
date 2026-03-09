import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { generateToken } from '../../common/utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, school_id } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        // Convert string to enum to ensure TS compatibility
        const userRole = role as Role;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role: userRole,
                school_id,
            },
        });

        // If the user is a tutor, ensure they have a linked Tutor profile
        if (userRole === 'tutor' && school_id) {
            const existingTutor = await prisma.tutor.findFirst({
                where: { email: email }
            });

            if (existingTutor) {
                await prisma.tutor.update({
                    where: { id: existingTutor.id },
                    data: { user_id: user.id }
                });
            } else {
                await prisma.tutor.create({
                    data: {
                        name,
                        email,
                        school_id,
                        specialty: req.body.specialty || null,
                        user_id: user.id
                    }
                });
            }
        }

        // Se for um responsavel
        if (userRole === 'parent') {
            const guardian = await prisma.guardian.create({
                data: {
                    name,
                    email,
                    phone: req.body.phone || null,
                    kinship_type_id: req.body.kinship_type_id || null,
                }
            });

            if (req.body.student_id) {
                await prisma.student.update({
                    where: { id: req.body.student_id },
                    data: { primary_guardian_id: guardian.id }
                });
            }
        }

        const token = generateToken({ userId: user.id, role: user.role, schoolId: user.school_id || undefined });

        return res.status(201).json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                token,
            },
            message: 'User registered successfully',
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Missing email or password' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken({ userId: user.id, role: user.role, schoolId: user.school_id || undefined });

        return res.status(200).json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                token,
            },
            message: 'Login successful',
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getMe = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role, school_id: user.school_id },
            },
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
