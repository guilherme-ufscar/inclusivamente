import { Request, Response } from 'express';
import { PrismaClient, TutorRecommendation } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

export const getReports = async (req: Request, res: Response) => {
    try {
        const { student_id } = req.query as any;
        const filter = student_id ? { student_id: String(student_id) } : {};

        const reports = await prisma.report.findMany({
            where: filter,
            orderBy: { generated_at: 'desc' },
            include: { student: { select: { name: true } } }
        });

        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const report = await prisma.report.findUnique({
            where: { id },
            include: { student: { select: { name: true } } }
        });

        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        return res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getStudentReports = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const reports = await prisma.report.findMany({
            where: { student_id: id },
            orderBy: { generated_at: 'desc' }
        });
        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const generateStudentReport = async (req: Request | any, res: Response) => {
    try {
        const { id } = req.params as any; // student_id
        const { period_start, period_end, filter_type, activity_count } = req.body || {};
        const generated_by = req.user?.userId;

        // ─── BLOQUEIO: verificar avaliações de tutor ──────────────────────────
        // Pega as últimas 10 atividades com tutor concluídas do aluno
        const lastActivitiesWithTutor = await prisma.activityLog.findMany({
            where: { student_id: id, has_tutor: true, completed_at: { not: null } },
            orderBy: { completed_at: 'desc' },
            take: 10
        });

        const isAdmin = req.user?.role === 'admin';

        if (lastActivitiesWithTutor.length > 0 && !isAdmin) {
            const evaluated = lastActivitiesWithTutor.filter(l => l.autonomy_level !== null).length;
            const evaluationRate = evaluated / lastActivitiesWithTutor.length;

            if (evaluationRate < 0.7) {
                return res.status(403).json({
                    success: false,
                    message: `Relatório bloqueado: o tutor avaliou apenas ${Math.round(evaluationRate * 100)}% das últimas ${lastActivitiesWithTutor.length} atividades acompanhadas. É necessário avaliar pelo menos 70% antes de gerar o relatório.`,
                    evaluated_count: evaluated,
                    total_with_tutor: lastActivitiesWithTutor.length,
                    evaluation_rate: Math.round(evaluationRate * 100),
                    pending_evaluations: lastActivitiesWithTutor
                        .filter(l => l.autonomy_level === null)
                        .map(l => ({ log_id: l.id, activity_id: l.activity_id, completed_at: l.completed_at }))
                });
            }
        }

        // ─── CONSULTA DE ATIVIDADES DO PERÍODO ───────────────────────────────
        let queryOptions: any = {
            where: {
                student_id: id,
                completed_at: { not: null }
            },
            orderBy: { completed_at: 'desc' }
        };

        let start: Date;
        let end: Date;

        if (filter_type === 'quantity') {
            const takeCount = activity_count ? parseInt(activity_count, 10) : 5;
            queryOptions.take = takeCount;
            start = new Date();
            end = new Date();
        } else {
            start = period_start ? new Date(period_start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
            end = period_end ? new Date(period_end) : new Date();
            end.setHours(23, 59, 59, 999);
            queryOptions.where.completed_at = { gte: start, lte: end };
        }

        const logs = await prisma.activityLog.findMany(queryOptions);

        if (filter_type === 'quantity' && logs.length > 0) {
            start = logs[logs.length - 1].completed_at as Date;
            end = logs[0].completed_at as Date;
        }

        console.log(`[DEBUG] Generating report for student ${id}`);
        console.log(`[DEBUG] Found ${logs.length} completed activities based on filter ${filter_type || 'period'}.`);

        const activities_with_tutor_count = logs.filter(l => l.has_tutor).length;
        const activities_without_tutor_count = logs.length - activities_with_tutor_count;

        let autonomyScore = 0;
        let autonomyEntries = 0;
        logs.forEach(l => {
            if (l.autonomy_level) {
                if (l.autonomy_level === 'high') autonomyScore += 100;
                if (l.autonomy_level === 'medium') autonomyScore += 50;
                if (l.autonomy_level === 'low') autonomyScore += 0;
                autonomyEntries++;
            }
        });

        const autonomy_percentage = autonomyEntries > 0 ? (autonomyScore / autonomyEntries) :
            (activities_without_tutor_count / (logs.length || 1)) * 100;

        let tutorLevel: TutorRecommendation = 'sporadic';
        if (autonomy_percentage > 70) tutorLevel = 'not_needed';
        else if (autonomy_percentage < 30) tutorLevel = 'continuous';

        // ─── CRUZAMENTO BNCC ──────────────────────────────────────────────────
        const anyLogs = logs as any[];
        const bnccCodes = [...new Set(anyLogs.map(l => l.bncc_codigo).filter(Boolean))] as string[];

        interface BnccEnriched {
            code: string;
            habilidade?: string;
            descricao?: string;
            etapa?: string;
            disciplina?: string;
            disciplinasRelacionadas: string[];
            pilulas: string[];
            acertos: number;
            erros: number;
            atividadesCount: number;
        }

        let bnccEnriched: BnccEnriched[] = [];
        if (bnccCodes.length > 0) {
            const bnccCompetences = await prisma.bnccCompetence.findMany({
                where: { code: { in: bnccCodes } }
            });
            const chaptersWithSubject = await prisma.chapter.findMany({
                where: { OR: bnccCodes.map(code => ({ content: { contains: code } })) },
                include: { subject: true }
            });

            bnccEnriched = bnccCodes.map(code => {
                const competence = bnccCompetences.find(c => c.code === code);
                const chapters = chaptersWithSubject.filter(ch => ch.content?.includes(code));
                const logsForCode = anyLogs.filter(l => l.bncc_codigo === code);
                return {
                    code,
                    habilidade: competence?.title ?? undefined,
                    descricao: competence?.description ?? undefined,
                    etapa: competence?.stage ?? undefined,
                    disciplina: competence?.subject ?? undefined,
                    disciplinasRelacionadas: [...new Set(chapters.map(ch => ch.subject?.name).filter(Boolean))] as string[],
                    pilulas: chapters.map(ch => ch.name),
                    acertos: logsForCode.reduce((acc, l) => acc + (l.correct_count || 0), 0),
                    erros: logsForCode.reduce((acc, l) => acc + (l.errors_count || 0), 0),
                    atividadesCount: logsForCode.length,
                };
            });
        }

        // ─── DADOS DO ALUNO (perfil, sondagem, cognitivo) ────────────────────
        const studentData = await prisma.student.findUnique({
            where: { id },
            select: {
                name: true, birth_date: true, grade_level: true, diagnosis: true,
                needs_tutor: true, persona: true, sondagem_completed: true,
                sondagem_score: true, sondagem_perfil: true,
                cognitiveProfile: true,
            }
        });

        // ─── GERAÇÃO DO RELATÓRIO ─────────────────────────────────────────────
        const count = logs.length;
        let generatedSummary = '';

        if (count > 0) {
            generatedSummary = buildHeuristicReport(autonomy_percentage, logs, bnccEnriched, studentData);
        } else {
            generatedSummary = 'Nenhuma atividade registrada no período selecionado.';
            tutorLevel = 'not_needed';
        }

        const report = await prisma.report.create({
            data: {
                student_id: id,
                period_start: start,
                period_end: end,
                summary_text: generatedSummary,
                activities_with_tutor_count,
                activities_without_tutor_count,
                autonomy_percentage,
                tutor_recommendation: tutorLevel,
                generated_by
            }
        });

        return res.status(201).json({ success: true, data: report, message: 'Report generated successfully' });
    } catch (error) {
        console.error('[GENERATE_REPORT_ERROR]:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: String(error) });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const { tutor_observations } = req.body;

        const report = await prisma.report.update({
            where: { id },
            data: { tutor_observations }
        });

        return res.status(200).json({ success: true, data: report, message: 'Report updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

interface BnccEnriched {
    code: string;
    habilidade?: string;
    descricao?: string;
    etapa?: string;
    disciplina?: string;
    disciplinasRelacionadas: string[];
    pilulas: string[];
    acertos: number;
    erros: number;
    atividadesCount: number;
}

function buildHeuristicReport(autonomy_percentage: number, logs: any[], bnccEnriched: BnccEnriched[], studentData: any): string {
    const count = logs.length;
    const totalAcertos = logs.reduce((acc, l) => acc + (l.correct_count || 0), 0);
    const totalErros = logs.reduce((acc, l) => acc + (l.errors_count || 0), 0);
    const taxaAcerto = (totalAcertos + totalErros) > 0
        ? Math.round((totalAcertos / (totalAcertos + totalErros)) * 100)
        : null;
    const tutorObsList = logs.filter(l => l.tutor_observations).map(l => l.tutor_observations);
    const interventions = logs.filter(l => l.tutor_intervention_needed === true || l.tutor_intervention_needed === 'true').length;
    const highDiff = logs.filter(l => l.difficulty_perceived === 'high').length;
    const mediumDiff = logs.filter(l => l.difficulty_perceived === 'medium').length;
    const easyDiff = logs.filter(l => l.difficulty_perceived === 'easy').length;

    // Tempo médio
    const logsWithTime = logs.filter(l => l.time_spent && l.time_spent > 0);
    const tempoMedio = logsWithTime.length > 0
        ? Math.round(logsWithTime.reduce((acc, l) => acc + l.time_spent, 0) / logsWithTime.length)
        : null;

    const PERFIL_LABELS: Record<number, string> = {
        1: 'TEA Nível 2 – Apoio substancial com adaptação curricular e mediação contínua',
        2: 'DI Leve + TEA – Apoio pedagógico estruturado com currículo funcional e reforço emocional',
        3: 'DI Severa + Motora – Apoio muito substancial 1:1 com foco em comunicação, conforto e inclusão afetiva',
        4: 'Baixa Complexidade – Estratégias pedagógicas universais, sem necessidade de apoio especializado contínuo',
        5: 'Deficiência Visual – Acessibilidade visual com recursos de ampliação, contraste e autonomia digital monitorada',
    };

    const COGNITIVE_LEVEL_LABELS: Record<string, string> = {
        very_low: 'Muito Baixo – necessita de mediação constante e atividades altamente estruturadas',
        low: 'Baixo – necessita de suporte frequente e adaptações significativas',
        medium: 'Médio – responde bem a atividades estruturadas com suporte moderado',
        high: 'Alto – demonstra boa capacidade de aprendizagem com suporte pontual',
        very_high: 'Muito Alto – autonomia na aprendizagem com necessidade mínima de intervenção',
    };

    const LEARNING_STYLE_LABELS: Record<string, string> = {
        visual: 'Visual – aprende melhor por meio de imagens, gráficos, esquemas e demonstrações visuais',
        auditivo: 'Auditivo – aprende melhor por meio de instruções verbais, narrativas e estímulos sonoros',
        cinestesico: 'Cinestésico – aprende melhor por meio de atividades práticas, manipulação e movimento corporal',
    };

    const sections: string[] = [];

    // ═══ SEÇÃO 1: PERFIL DO ALUNO ════════════════════════════════════════
    if (studentData) {
        let perfil = '══ PERFIL DO ALUNO ══';
        perfil += `\nAluno: ${studentData.name}`;
        if (studentData.birth_date) {
            const age = Math.floor((Date.now() - new Date(studentData.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            perfil += ` | Idade: ${age} anos`;
        }
        if (studentData.grade_level) perfil += ` | Série: ${studentData.grade_level}`;
        if (studentData.diagnosis) perfil += `\nDiagnóstico clínico: ${studentData.diagnosis}`;

        if (studentData.sondagem_completed && studentData.sondagem_perfil) {
            const perfilDesc = PERFIL_LABELS[studentData.sondagem_perfil] || `Perfil ${studentData.sondagem_perfil}`;
            perfil += `\n\nResultado da Sondagem Educacional: Perfil ${studentData.sondagem_perfil} – ${perfilDesc}.`;
            perfil += `\nA sondagem avalia 100 indicadores distribuídos em 5 domínios do desenvolvimento:`;
            perfil += `\n  • Comunicação e Linguagem (20 indicadores): capacidade comunicativa, compreensão verbal, uso funcional da linguagem e participação comunicativa no contexto escolar.`;
            perfil += `\n  • Cognição e Aprendizagem Funcional (20 indicadores): atenção, memória funcional, reconhecimento de símbolos, capacidade de aprendizagem por repetição e generalização.`;
            perfil += `\n  • Funções Executivas (15 indicadores): iniciativa, atenção sustentada, planejamento, organização, controle de impulsos, tolerância à frustração e autorregulação.`;
            perfil += `\n  • Comportamento, Interação Social e Emocional (20 indicadores): interesse social, interação com pares e adultos, regulação emocional, comportamentos disruptivos e vínculo afetivo.`;
            perfil += `\n  • Motricidade e Autonomia Funcional (25 indicadores): controle postural, coordenação motora, autonomia em alimentação e higiene, consciência corporal e permanência segura no ambiente escolar.`;
            perfil += `\nCada indicador é pontuado de 0 (não realiza / totalmente dependente) a 4 (realiza de forma independente e consistente). A classificação do perfil orienta o nível de apoio pedagógico necessário.`;
        }

        if (studentData.cognitiveProfile) {
            const cp = studentData.cognitiveProfile;
            perfil += `\n\nPerfil Cognitivo:`;
            if (cp.cognitive_level) {
                const cogDesc = COGNITIVE_LEVEL_LABELS[cp.cognitive_level] || cp.cognitive_level;
                perfil += `\n  • Nível cognitivo: ${cogDesc}.`;
            }
            if (cp.learning_style) {
                const lsDesc = LEARNING_STYLE_LABELS[cp.learning_style] || cp.learning_style;
                perfil += `\n  • Estilo de aprendizagem: ${lsDesc}.`;
            }
            if (cp.special_needs) {
                try {
                    const needs = typeof cp.special_needs === 'string' ? JSON.parse(cp.special_needs) : cp.special_needs;
                    if (Array.isArray(needs) && needs.length > 0) {
                        perfil += `\n  • Necessidades especiais identificadas: ${needs.join('; ')}.`;
                    }
                } catch { /* ignore */ }
            }
            if (cp.summary) {
                perfil += `\n  • Síntese do perfil cognitivo: ${cp.summary}`;
            }
        }

        sections.push(perfil);
    }

    // ═══ SEÇÃO 2: DESEMPENHO GERAL ═══════════════════════════════════════
    let desempenho = '══ DESEMPENHO NO PERÍODO ══';
    desempenho += `\nO aluno realizou ${count} atividade${count !== 1 ? 's' : ''} no período analisado, totalizando ${totalAcertos} acerto${totalAcertos !== 1 ? 's' : ''} e ${totalErros} erro${totalErros !== 1 ? 's' : ''}`;
    if (taxaAcerto !== null) desempenho += ` (taxa de acerto geral: ${taxaAcerto}%)`;
    desempenho += '.';

    if (tempoMedio !== null) {
        const minutos = Math.floor(tempoMedio / 60);
        const segundos = tempoMedio % 60;
        desempenho += ` O tempo médio por atividade foi de ${minutos > 0 ? `${minutos} minuto${minutos !== 1 ? 's' : ''}` : ''}${minutos > 0 && segundos > 0 ? ' e ' : ''}${segundos > 0 ? `${segundos} segundo${segundos !== 1 ? 's' : ''}` : ''}.`;
        if (tempoMedio > 300) {
            desempenho += ' O tempo elevado pode indicar dificuldade na compreensão dos enunciados ou necessidade de maior suporte durante as atividades.';
        } else if (tempoMedio < 60) {
            desempenho += ' O tempo reduzido pode indicar boa fluência na resolução ou, alternativamente, respostas por tentativa e erro — recomenda-se cruzar com a taxa de acerto.';
        }
    }

    if (highDiff > 0 || mediumDiff > 0 || easyDiff > 0) {
        desempenho += `\n\nDistribuição de dificuldade percebida:`;
        if (easyDiff > 0) desempenho += `\n  • Fácil: ${easyDiff} atividade${easyDiff !== 1 ? 's' : ''} (${Math.round(easyDiff / count * 100)}%)`;
        if (mediumDiff > 0) desempenho += `\n  • Média: ${mediumDiff} atividade${mediumDiff !== 1 ? 's' : ''} (${Math.round(mediumDiff / count * 100)}%)`;
        if (highDiff > 0) desempenho += `\n  • Elevada: ${highDiff} atividade${highDiff !== 1 ? 's' : ''} (${Math.round(highDiff / count * 100)}%)`;
        if (highDiff > count * 0.4) {
            desempenho += `\nAtenção: mais de 40% das atividades tiveram dificuldade percebida elevada, indicando que o conteúdo pode estar acima do nível atual do aluno ou que há necessidade de adaptações adicionais.`;
        }
    }

    // Análise de padrão de erros
    if (totalErros > 0) {
        const logsWithErrors = logs.filter(l => (l.errors_count || 0) > 0);
        const avgErrorsPerActivity = Math.round(totalErros / logsWithErrors.length * 10) / 10;
        desempenho += `\n\nAnálise de erros: Dos ${count} exercícios, ${logsWithErrors.length} apresentaram erros (média de ${avgErrorsPerActivity} erro${avgErrorsPerActivity !== 1 ? 's' : ''} por atividade com erro).`;

        // Erros em atividades com/sem tutor
        const errosComTutor = logs.filter(l => l.has_tutor).reduce((acc, l) => acc + (l.errors_count || 0), 0);
        const errosSemTutor = totalErros - errosComTutor;
        const atividadesComTutor = logs.filter(l => l.has_tutor).length;
        const atividadesSemTutor = count - atividadesComTutor;

        if (atividadesComTutor > 0 && atividadesSemTutor > 0) {
            const taxaErroComTutor = atividadesComTutor > 0 ? Math.round(errosComTutor / atividadesComTutor * 10) / 10 : 0;
            const taxaErroSemTutor = atividadesSemTutor > 0 ? Math.round(errosSemTutor / atividadesSemTutor * 10) / 10 : 0;
            desempenho += ` Taxa média de erros com tutor: ${taxaErroComTutor} por atividade; sem tutor: ${taxaErroSemTutor} por atividade.`;
            if (taxaErroSemTutor > taxaErroComTutor * 1.5) {
                desempenho += ' Observa-se aumento significativo de erros na ausência de tutor, sugerindo que a mediação externa é fator relevante para o desempenho.';
            }
        }
    }

    sections.push(desempenho);

    // ═══ SEÇÃO 3: HABILIDADES BNCC DETALHADAS ════════════════════════════
    if (bnccEnriched.length > 0) {
        let bnccSection = '══ HABILIDADES DA BNCC TRABALHADAS ══';
        bnccSection += `\nForam identificadas ${bnccEnriched.length} habilidade${bnccEnriched.length !== 1 ? 's' : ''} da Base Nacional Comum Curricular (BNCC) no período:\n`;

        // Ordenar por taxa de acerto (fracas primeiro)
        const bnccOrdenado = [...bnccEnriched].sort((a, b) => {
            const taxaA = (a.acertos + a.erros) > 0 ? a.acertos / (a.acertos + a.erros) : 0;
            const taxaB = (b.acertos + b.erros) > 0 ? b.acertos / (b.acertos + b.erros) : 0;
            return taxaA - taxaB;
        });

        bnccOrdenado.forEach((b, i) => {
            const taxaB = (b.acertos + b.erros) > 0 ? Math.round((b.acertos / (b.acertos + b.erros)) * 100) : null;
            let nivel = 'Em desenvolvimento';
            if (taxaB !== null) {
                if (taxaB >= 80) nivel = 'Consolidado';
                else if (taxaB >= 60) nivel = 'Em progresso';
                else if (taxaB >= 40) nivel = 'Em desenvolvimento';
                else nivel = 'Necessita reforço';
            }

            bnccSection += `\n${i + 1}. ${b.code}`;
            if (b.disciplina) bnccSection += ` | ${b.disciplina}`;
            if (b.etapa) bnccSection += ` | ${b.etapa}`;
            if (b.habilidade) bnccSection += `\n   Habilidade: ${b.habilidade}`;
            if (b.descricao) bnccSection += `\n   Descrição BNCC: ${b.descricao}`;
            if (b.pilulas.length > 0) bnccSection += `\n   Conteúdo trabalhado (pílulas): ${b.pilulas.join(', ')}`;
            bnccSection += `\n   Desempenho: ${b.acertos} acerto${b.acertos !== 1 ? 's' : ''} e ${b.erros} erro${b.erros !== 1 ? 's' : ''} em ${b.atividadesCount} atividade${b.atividadesCount !== 1 ? 's' : ''}`;
            if (taxaB !== null) bnccSection += ` (${taxaB}% de aproveitamento)`;
            bnccSection += `\n   Nível de domínio: ${nivel}`;
            bnccSection += '\n';
        });

        // Resumo cruzado
        const fortes = bnccOrdenado.filter(b => {
            const t = (b.acertos + b.erros) > 0 ? Math.round((b.acertos / (b.acertos + b.erros)) * 100) : 0;
            return t >= 70;
        });
        const fracas = bnccOrdenado.filter(b => {
            const t = (b.acertos + b.erros) > 0 ? Math.round((b.acertos / (b.acertos + b.erros)) * 100) : 0;
            return t < 50;
        });

        if (fortes.length > 0) {
            bnccSection += `\nHabilidades com bom domínio (≥70%): ${fortes.map(b => b.code).join(', ')}.`;
        }
        if (fracas.length > 0) {
            bnccSection += `\nHabilidades que necessitam de reforço (<50%): ${fracas.map(b => b.code).join(', ')}. Recomenda-se retomar esses conteúdos com estratégias diferenciadas e maior mediação pedagógica.`;
        }

        sections.push(bnccSection);
    } else {
        sections.push('══ HABILIDADES DA BNCC ══\nNão foram identificadas competências BNCC associadas às atividades do período. Recomenda-se verificar o mapeamento curricular das atividades utilizadas.');
    }

    // ═══ SEÇÃO 4: AUTONOMIA E MEDIAÇÃO ═══════════════════════════════════
    let autonomia = '══ AUTONOMIA E MEDIAÇÃO ══';
    if (autonomy_percentage > 70) {
        autonomia += `\nO aluno demonstrou desempenho independente ao longo do período (${autonomy_percentage.toFixed(0)}% de autonomia), executando as tarefas com assertividade e com mínima necessidade de mediação externa. Este nível de autonomia indica que o aluno está consolidando habilidades e pode ser gradualmente desafiado com conteúdos de maior complexidade.`;
    } else if (autonomy_percentage < 30) {
        autonomia += `\nO aluno apresentou forte dependência de mediação ao longo do período (${autonomy_percentage.toFixed(0)}% de autonomia), necessitando de suporte constante para a realização das atividades. Isso sugere que o nível de complexidade das atividades pode estar acima da zona de desenvolvimento atual, ou que o aluno requer mais tempo para internalizar as estratégias de resolução.`;
    } else {
        autonomia += `\nO aluno apresentou nível intermediário de independência (${autonomy_percentage.toFixed(0)}% de autonomia), com variações conforme o tipo de atividade e a complexidade do conteúdo. Encontra-se em zona de transição, onde a mediação ainda é necessária em momentos específicos.`;
    }

    if (interventions > 0) {
        autonomia += `\nForam registradas intervenções do tutor em ${interventions} atividade${interventions !== 1 ? 's' : ''} (${Math.round(interventions / count * 100)}% das atividades).`;
    }

    if (tutorObsList.length > 0) {
        autonomia += `\n\nObservações registradas pelos tutores:`;
        tutorObsList.slice(0, 5).forEach((obs, i) => {
            autonomia += `\n  ${i + 1}. "${obs}"`;
        });
        if (tutorObsList.length > 5) {
            autonomia += `\n  (e mais ${tutorObsList.length - 5} observação${tutorObsList.length - 5 !== 1 ? 'ões' : ''})`;
        }
    }

    sections.push(autonomia);

    // ═══ SEÇÃO 5: FEEDBACK PEDAGÓGICO E RECOMENDAÇÕES ════════════════════
    let feedback = '══ FEEDBACK PEDAGÓGICO E RECOMENDAÇÕES ══';

    // Recomendação de tutor
    if (autonomy_percentage > 70) {
        feedback += `\n\nRecomendação de tutoria: APOIO ESPORÁDICO OU DISPENSÁVEL. O aluno demonstra capacidade de realizar atividades com autonomia. Sugere-se manter acompanhamento leve para monitorar a evolução e oferecer desafios progressivos.`;
    } else if (autonomy_percentage < 30) {
        feedback += `\n\nRecomendação de tutoria: APOIO CONTÍNUO. O aluno necessita de mediação constante. Sugere-se manter tutor dedicado com estratégias graduais para desenvolver progressivamente a autonomia, utilizando modelagem, dicas visuais e reforço positivo.`;
    } else {
        feedback += `\n\nRecomendação de tutoria: APOIO ESPORÁDICO. O aluno demonstra autonomia parcial. Sugere-se mediação direcionada nos momentos de maior dificuldade, com atenção especial às competências que apresentaram menor aproveitamento.`;
    }

    // Recomendações baseadas em desempenho
    if (taxaAcerto !== null) {
        if (taxaAcerto < 50) {
            feedback += `\n\nDesempenho geral abaixo de 50% — recomenda-se: (a) revisar o nível de dificuldade das atividades propostas, considerando a zona de desenvolvimento proximal do aluno; (b) utilizar atividades de reforço com suporte visual e concreto; (c) aumentar a frequência de feedback imediato durante as atividades.`;
        } else if (taxaAcerto >= 50 && taxaAcerto < 70) {
            feedback += `\n\nDesempenho geral entre 50-70% — o aluno está em progressão. Recomenda-se: (a) manter o nível atual de atividades com variações para consolidação; (b) oferecer exercícios de fixação antes de avançar para novos conteúdos; (c) alternar entre atividades individuais e mediadas.`;
        } else if (taxaAcerto >= 70 && taxaAcerto < 90) {
            feedback += `\n\nDesempenho geral entre 70-90% — o aluno demonstra bom domínio dos conteúdos trabalhados. Recomenda-se: (a) introduzir gradualmente atividades de maior complexidade; (b) explorar conexões entre diferentes habilidades da BNCC; (c) reduzir progressivamente o suporte externo.`;
        } else {
            feedback += `\n\nDesempenho geral acima de 90% — excelente. Recomenda-se: (a) avançar para conteúdos do próximo nível; (b) propor atividades que exijam análise e síntese; (c) estimular a autonomia completa na resolução de problemas.`;
        }
    }

    // Recomendações por perfil sondagem
    if (studentData?.sondagem_perfil) {
        const perfil = studentData.sondagem_perfil;
        feedback += `\n\nOrientações específicas para o perfil do aluno (Perfil ${perfil}):`;
        switch (perfil) {
            case 1:
                feedback += `\n  • Manter adaptação curricular com sequências previsíveis e rotinas visuais claras.`;
                feedback += `\n  • Utilizar antecipação de mudanças para reduzir ansiedade e comportamentos reativos.`;
                feedback += `\n  • Trabalhar habilidades sociais de forma estruturada, com mediação contínua.`;
                feedback += `\n  • Garantir comunicação alternativa quando necessário e respeitar o tempo de processamento do aluno.`;
                break;
            case 2:
                feedback += `\n  • Priorizar currículo funcional com atividades significativas e contextualizadas.`;
                feedback += `\n  • Utilizar reforço emocional positivo como principal estratégia motivacional.`;
                feedback += `\n  • Oferecer atividades com complexidade gradual e suporte visual constante.`;
                feedback += `\n  • Trabalhar generalização de aprendizagens para diferentes contextos.`;
                break;
            case 3:
                feedback += `\n  • Manter apoio 1:1 com foco em comunicação funcional e conforto.`;
                feedback += `\n  • Priorizar inclusão afetiva e participação significativa nas atividades em grupo.`;
                feedback += `\n  • Utilizar recursos multissensoriais adaptados às capacidades motoras do aluno.`;
                feedback += `\n  • Monitorar sinais de desconforto e fadiga, ajustando o tempo e ritmo das atividades.`;
                break;
            case 4:
                feedback += `\n  • Aplicar estratégias pedagógicas universais com foco em engajamento e motivação.`;
                feedback += `\n  • Estimular a participação ativa e a autonomia progressiva.`;
                feedback += `\n  • Monitorar a evolução e estar atento a possíveis necessidades emergentes.`;
                break;
            case 5:
                feedback += `\n  • Garantir acessibilidade visual em todos os materiais (ampliação, contraste, fontes adequadas).`;
                feedback += `\n  • Utilizar recursos de tecnologia assistiva para autonomia digital.`;
                feedback += `\n  • Oferecer descrição verbal de conteúdos visuais (audiodescrição).`;
                feedback += `\n  • Garantir iluminação adequada e posicionamento ergonômico durante as atividades.`;
                break;
        }
    }

    // Perfil cognitivo e recomendações
    if (studentData?.cognitiveProfile?.learning_style) {
        const ls = studentData.cognitiveProfile.learning_style;
        feedback += `\n\nOrientações baseadas no estilo de aprendizagem (${ls}):`;
        switch (ls) {
            case 'visual':
                feedback += `\n  • Priorizar atividades com apoio de imagens, diagramas, mapas conceituais e vídeos.`;
                feedback += `\n  • Utilizar códigos de cores para organizar informações e categorias.`;
                feedback += `\n  • Apresentar instruções de forma visual, não apenas verbal.`;
                break;
            case 'auditivo':
                feedback += `\n  • Priorizar instruções verbais claras e narrativas.`;
                feedback += `\n  • Utilizar recursos sonoros, músicas e histórias como veículo de aprendizagem.`;
                feedback += `\n  • Permitir que o aluno verbalize o raciocínio como estratégia de consolidação.`;
                break;
            case 'cinestesico':
                feedback += `\n  • Priorizar atividades práticas, manipulativas e com movimento corporal.`;
                feedback += `\n  • Oferecer materiais concretos para apoiar conceitos abstratos.`;
                feedback += `\n  • Permitir pausas ativas e alternar entre atividades que exigem concentração e movimento.`;
                break;
        }
    }

    // Próximos passos
    feedback += `\n\nPróximos passos sugeridos:`;
    if (bnccEnriched.length > 0) {
        const fracas = bnccEnriched.filter(b => {
            const t = (b.acertos + b.erros) > 0 ? Math.round((b.acertos / (b.acertos + b.erros)) * 100) : 0;
            return t < 50;
        });
        if (fracas.length > 0) {
            feedback += `\n  1. Retomar as habilidades com menor aproveitamento: ${fracas.map(b => `${b.code}${b.habilidade ? ` (${b.habilidade})` : ''}`).join('; ')}.`;
            feedback += `\n  2. Propor atividades de reforço específicas para essas habilidades com nível de dificuldade reduzido.`;
            feedback += `\n  3. Reavaliar após o ciclo de reforço para verificar progressão.`;
        } else {
            feedback += `\n  1. Avançar para novas habilidades da BNCC mantendo revisão periódica das já trabalhadas.`;
            feedback += `\n  2. Introduzir atividades com nível de complexidade progressivamente maior.`;
        }
    } else {
        feedback += `\n  1. Mapear as atividades da plataforma com as habilidades da BNCC para enriquecer os próximos relatórios.`;
        feedback += `\n  2. Acompanhar a evolução do aluno com relatórios periódicos.`;
    }
    feedback += `\n  • Manter comunicação contínua entre equipe pedagógica, tutor e família.`;
    feedback += `\n  • Agendar nova avaliação de sondagem caso haja mudança significativa no comportamento ou desempenho do aluno.`;

    sections.push(feedback);

    return sections.join('\n\n');
}
