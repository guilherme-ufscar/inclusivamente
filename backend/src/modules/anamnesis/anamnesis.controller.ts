import { Request, Response } from 'express';
import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

// Spheres
export const getSpheres = async (req: Request, res: Response) => {
    try {
        const spheres = await prisma.anamnesisSphere.findMany({
            orderBy: { order_index: 'asc' },
            include: {
                Questions: { where: { is_active: true }, orderBy: { order_index: 'asc' } }
            }
        });
        return res.status(200).json({ success: true, data: spheres });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createSphere = async (req: Request, res: Response) => {
    try {
        const { name, description, order_index, is_active } = req.body;
        const sphere = await prisma.anamnesisSphere.create({
            data: { name, description, order_index, is_active }
        });
        return res.status(201).json({ success: true, data: sphere, message: 'Sphere created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateSphere = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name, description, order_index, is_active } = req.body;
        const sphere = await prisma.anamnesisSphere.update({
            where: { id },
            data: { name, description, order_index, is_active }
        });
        return res.status(200).json({ success: true, data: sphere, message: 'Sphere updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteSphere = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.anamnesisSphere.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Sphere deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Questions
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const { sphere_id } = req.query as any;
        const filter = sphere_id ? { sphere_id: String(sphere_id) } : {};
        const questions = await prisma.anamnesisQuestion.findMany({
            where: filter,
            orderBy: { order_index: 'asc' },
            include: { sphere: { select: { name: true } } }
        });
        return res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const { sphere_id, question_text, question_type, options_json, is_required, order_index, is_active } = req.body;
        const qType = question_type as QuestionType;
        const question = await prisma.anamnesisQuestion.create({
            data: { sphere_id, question_text, question_type: qType, options_json, is_required, order_index, is_active }
        });
        return res.status(201).json({ success: true, data: question, message: 'Question created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateQuestion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { sphere_id, question_text, question_type, options_json, is_required, order_index, is_active } = req.body;
        const qType = question_type ? (question_type as QuestionType) : undefined;
        const question = await prisma.anamnesisQuestion.update({
            where: { id },
            data: { sphere_id, question_text, question_type: qType, options_json, is_required, order_index, is_active }
        });
        return res.status(200).json({ success: true, data: question, message: 'Question updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteQuestion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.anamnesisQuestion.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Question deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Student Responses
export const getStudentAnamnesis = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const responses = await prisma.anamnesisResponse.findMany({
            where: { student_id: id },
            include: { question: { include: { sphere: true } } }
        });
        return res.status(200).json({ success: true, data: responses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createStudentAnamnesisResponse = async (req: Request | any, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const { question_id, answer_json } = req.body;
        const answered_by_user_id = req.user?.userId;

        const response = await prisma.anamnesisResponse.create({
            data: { student_id: id, question_id, answer_json, answered_by_user_id }
        });
        return res.status(201).json({ success: true, data: response, message: 'Response saved' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateStudentAnamnesisResponse = async (req: Request | any, res: Response) => {
    try {
        const { responseId } = req.params as any;
        const { answer_json } = req.body;

        // Spec asks for PUT /api/students/:id/anamnesis/responses but technically it modifies a specific response.
        // If we use PUT /api/students/:id/anamnesis/responses and send an array of updates:
        if (Array.isArray(req.body)) {
            const answered_by_user_id = req.user?.userId;
            const updates = [];
            for (const item of req.body) {
                updates.push(prisma.anamnesisResponse.upsert({
                    where: {
                        student_id_question_id: {
                            student_id: req.params.id,
                            question_id: item.question_id
                        }
                    },
                    update: { answer_json: item.answer_json },
                    create: {
                        student_id: req.params.id,
                        question_id: item.question_id,
                        answer_json: item.answer_json,
                        answered_by_user_id
                    }
                }));
            }
            await prisma.$transaction(updates);
            return res.status(200).json({ success: true, message: 'Responses updated' });
        }

        const response = await prisma.anamnesisResponse.update({
            where: { id: responseId },
            data: { answer_json }
        });
        return res.status(200).json({ success: true, data: response, message: 'Response updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Kinship (Grau de Parentesco)
export const getKinship = async (req: Request, res: Response) => {
    try {
        const kinship = await prisma.kinshipType.findMany({
            orderBy: { name: 'asc' }
        });
        return res.status(200).json({ success: true, data: kinship });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createKinship = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const kinship = await prisma.kinshipType.create({
            data: { name }
        });
        return res.status(201).json({ success: true, data: kinship, message: 'Kinship created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateKinship = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { name } = req.body;
        const kinship = await prisma.kinshipType.update({
            where: { id },
            data: { name }
        });
        return res.status(200).json({ success: true, data: kinship, message: 'Kinship updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteKinship = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        await prisma.kinshipType.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Kinship deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
