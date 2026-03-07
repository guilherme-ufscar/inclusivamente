import { Request, Response } from 'express';
import { PrismaClient, CognitiveLevel, LearningStyle } from '@prisma/client';

const prisma = new PrismaClient();

export const getCognitiveProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const profile = await prisma.cognitiveProfile.findUnique({
            where: { student_id: id }
        });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Cognitive Profile not found for this student. Try recalculating.' });
        }

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const recalculateCognitiveProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id

        // Fetch the anamnesis responses
        const responses = await prisma.anamnesisResponse.findMany({
            where: { student_id: id },
            include: { question: true }
        });

        // Dummy logic for calculating cognitive profile
        // In a real scenario, this would evaluate the answers based on points or heuristics
        let score = responses.length; // Simply use amount of answers as a dumb modifier for now
        let cLevel: CognitiveLevel = 'medium';
        let style: LearningStyle = 'visual';

        if (score > 10) cLevel = 'high';
        if (score < 5) cLevel = 'low';

        // We will extract a generic logic finding common key terms
        const summary = `Profile generated automatically based on ${responses.length} anamnesis responses.`;
        const specialNeeds = JSON.stringify([]); // empty array

        const profile = await prisma.cognitiveProfile.upsert({
            where: { student_id: id },
            create: {
                student_id: id,
                cognitive_level: cLevel,
                learning_style: style,
                special_needs: specialNeeds,
                summary
            },
            update: {
                cognitive_level: cLevel,
                learning_style: style,
                special_needs: specialNeeds,
                summary,
                generated_at: new Date()
            }
        });

        return res.status(200).json({ success: true, data: profile, message: 'Cognitive profile recalculated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
