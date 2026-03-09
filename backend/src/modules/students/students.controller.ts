import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../common/middleware/auth';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getStudents = async (req: AuthRequest, res: Response) => {
    try {
        const { school_id, tutor_id: queryTutorId } = req.query as any;
        const filter: any = {};

        // Basic filtering
        if (school_id) filter.school_id = String(school_id);
        if (req.query.class_id) filter.class_id = String(req.query.class_id);

        // Security: If user is a TUTOR, restrict to their students
        if (req.user?.role === 'tutor') {
            const userId = req.user.userId;
            let tutor = await prisma.tutor.findUnique({
                where: { user_id: userId }
            });

            if (!tutor) {
                // Try finding by email for self-healing
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user?.email) {
                    tutor = await prisma.tutor.findFirst({
                        where: { email: user.email }
                    });
                    if (tutor) {
                        await prisma.tutor.update({
                            where: { id: tutor.id },
                            data: { user_id: userId }
                        });
                    }
                }
            }

            if (tutor) {
                filter.Tutors = { some: { id: tutor.id } };
            } else {
                // If they are a tutor but have no tutor profile, they see no students
                return res.status(200).json({ success: true, data: [] });
            }
        }
        // If query param tutor_id is provided (for admins/schools to filter)
        else if (queryTutorId) {
            filter.Tutors = { some: { id: String(queryTutorId) } };
        }

        const students = await prisma.student.findMany({
            where: filter,
            orderBy: { created_at: 'desc' },
            include: {
                school: { select: { name: true } },
                guardian: { select: { name: true } },
                class: { select: { name: true } },
                Tutors: { select: { id: true, name: true } },
                Reports: {
                    orderBy: { generated_at: 'desc' },
                    take: 1
                }
            }
        });
        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as any;
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                school: true,
                guardian: true,
                CognitiveProfiles: true,
                Tutors: { select: { id: true, name: true } },
                Reports: { orderBy: { generated_at: 'desc' }, take: 1 }
            }
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        return res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name, birth_date, school_id, grade_level, tutor_ids, class_id,
            cpf, rg, diagnosis, needs_tutor,
            student_email, student_password,
            guardian_name, guardian_cpf, guardian_phone, guardian_address
        } = req.body;

        if (!name || !birth_date || !school_id) {
            return res.status(400).json({ success: false, message: 'Name, Birth Date and School ID are required' });
        }

        let newUserId: string | null = null;

        // 1. Create User account if requested
        if (student_email && student_password) {
            const existingUser = await prisma.user.findUnique({ where: { email: student_email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email já está em uso para o login do aluno.' });
            }
            const password_hash = await bcrypt.hash(student_password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email: student_email,
                    password_hash,
                    role: 'student',
                    school_id
                }
            });
            newUserId = newUser.id;
        }

        // 2. Handle Guardian
        let guardianId = req.body.primary_guardian_id || null;
        if (!guardianId && guardian_name) {
            const newGuardian = await prisma.guardian.create({
                data: {
                    name: guardian_name,
                    cpf: guardian_cpf || null,
                    phone: guardian_phone || null,
                    address: guardian_address || null,
                }
            });
            guardianId = newGuardian.id;
        }

        // 3. Create Student
        const student = await prisma.student.create({
            data: {
                name,
                birth_date: new Date(birth_date),
                school_id,
                primary_guardian_id: guardianId,
                grade_level: grade_level || null,
                class_id: class_id || null,
                cpf: cpf || null,
                rg: rg || null,
                diagnosis: diagnosis || null,
                needs_tutor: needs_tutor === true || needs_tutor === 'true',
                user_id: newUserId,
                Tutors: tutor_ids && tutor_ids.length > 0 ? {
                    connect: tutor_ids.map((tid: string) => ({ id: tid }))
                } : undefined
            }
        });

        return res.status(201).json({ success: true, data: student, message: 'Student created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as any;
        const {
            name, birth_date, primary_guardian_id, grade_level, status, tutor_ids, class_id,
            cpf, rg, diagnosis, needs_tutor,
            guardian_name, guardian_cpf, guardian_phone, guardian_address
        } = req.body;

        const currentStudent = await prisma.student.findUnique({ where: { id } });
        if (!currentStudent) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Handle Guardian Update/Creation during Student update
        let guardianId = primary_guardian_id || currentStudent.primary_guardian_id;
        if (guardian_name) {
            if (guardianId) {
                await prisma.guardian.update({
                    where: { id: guardianId },
                    data: { name: guardian_name, cpf: guardian_cpf, phone: guardian_phone, address: guardian_address }
                });
            } else {
                const newGuardian = await prisma.guardian.create({
                    data: { name: guardian_name, cpf: guardian_cpf, phone: guardian_phone, address: guardian_address }
                });
                guardianId = newGuardian.id;
            }
        }

        const student = await prisma.student.update({
            where: { id },
            data: {
                name,
                birth_date: birth_date ? new Date(birth_date) : undefined,
                primary_guardian_id: guardianId || null,
                grade_level: grade_level || null,
                class_id: class_id || null,
                cpf: cpf !== undefined ? cpf : undefined,
                rg: rg !== undefined ? rg : undefined,
                diagnosis: diagnosis !== undefined ? diagnosis : undefined,
                needs_tutor: needs_tutor !== undefined ? (needs_tutor === true || needs_tutor === 'true') : undefined,
                status,
                Tutors: tutor_ids ? {
                    set: tutor_ids.map((tid: string) => ({ id: tid }))
                } : undefined
            }
        });

        return res.status(200).json({ success: true, data: student, message: 'Student updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateMyProgression = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { coins, persona } = req.body;

        const student = await prisma.student.update({
            where: { user_id: userId } as any,
            data: {
                coins: coins !== undefined ? Number(coins) : undefined,
                persona: persona !== undefined ? Number(persona) : undefined,
            } as any
        });

        return res.status(200).json({ success: true, data: student, message: 'Progression updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
