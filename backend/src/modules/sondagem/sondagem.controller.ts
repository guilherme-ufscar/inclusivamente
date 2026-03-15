import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../common/middleware/auth';

const prisma = new PrismaClient();

// Pontuação → Perfil → Persona no jogo
// persona: 0=Padrão, 1=TEA Nível 2, 2=DI Leve+TEA, 3=DI Severa+Motora, 4=Deficiência Visual
function calcularPerfil(score: number): { perfil: number; persona: number } {
    if (score >= 301) return { perfil: 4, persona: 0 };  // Baixa Complexidade → Padrão
    if (score >= 220) return { perfil: 1, persona: 1 };  // TEA Nível 2
    if (score >= 160) return { perfil: 2, persona: 2 };  // DI Leve + TEA
    return { perfil: 3, persona: 3 };                    // DI Severa + Motora
}

export const submitSondagem = async (req: AuthRequest, res: Response) => {
    try {
        const { id: student_id } = req.params;
        const { scores, deficiencia_visual } = req.body as {
            scores: number[];
            deficiencia_visual?: boolean;
        };

        if (!Array.isArray(scores) || scores.length !== 100) {
            return res.status(400).json({
                success: false,
                message: 'scores deve ser um array com exatamente 100 valores (0-4)'
            });
        }

        const invalid = scores.some(s => typeof s !== 'number' || s < 0 || s > 4);
        if (invalid) {
            return res.status(400).json({
                success: false,
                message: 'Cada score deve ser um número entre 0 e 4'
            });
        }

        const student = await prisma.student.findUnique({ where: { id: student_id } });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        }

        const total = scores.reduce((acc, s) => acc + s, 0);

        // Perfil 5 (Deficiência Visual) tem prioridade independente da pontuação
        let perfil: number;
        let persona: number;
        if (deficiencia_visual) {
            perfil = 5;
            persona = 4;
        } else {
            ({ perfil, persona } = calcularPerfil(total));
        }

        const updated = await prisma.student.update({
            where: { id: student_id },
            data: {
                sondagem_completed: true,
                sondagem_score: total,
                sondagem_perfil: perfil,
                persona
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                score: total,
                perfil,
                persona,
                deficiencia_visual: !!deficiencia_visual,
                student_id: updated.id
            }
        });
    } catch (error) {
        console.error('[Sondagem Error]:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getSondagemStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id: student_id } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: student_id },
            select: {
                id: true,
                sondagem_completed: true,
                sondagem_score: true,
                sondagem_perfil: true,
                persona: true
            }
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        }

        return res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error('[Sondagem Status Error]:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
