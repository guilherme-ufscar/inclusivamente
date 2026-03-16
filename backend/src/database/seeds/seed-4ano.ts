import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seed do 4º Ano...');

    // IDs das disciplinas já criadas no seed-1ano.ts
    const portuguesId = 'subject-portugues-1ano';
    const matematicaId = 'subject-matematica-1ano';
    const conhecimentosId = 'subject-conhecimentos-1ano';

    // ─── PÍLULAS – PORTUGUÊS ──────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 4º Ano – Português...');

    const capitulosPortugues4 = [
        {
            id: 'cap-pt4-01',
            name: 'Texto Informativo',
            subject_id: portuguesId,
            order: 16,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Tema',
                        atividades: [
                            { enunciado: 'LEIA O TEXTO: "O SOL É UMA ESTRELA. ELE EMITE LUZ E CALOR." O QUE O SOL É?', objetivo: 'Identificar informação explícita', fase1: '✔ UMA ESTRELA ✖ UM PLANETA ✖ UMA PEDRA', fase2: '✔ UMA ESTRELA ✖ UM SATÉLITE ✖ UM COMETA' },
                            { enunciado: 'LEIA O TEXTO: "A ÁGUA EVAPORA COM O CALOR." O QUE FAZ A ÁGUA EVAPORAR?', objetivo: 'Localizar causa explícita', fase1: '✔ O CALOR ✖ O FRIO ✖ O VENTO', fase2: '✔ O CALOR ✖ A SOMBRA ✖ A NOITE' },
                            { enunciado: 'LEIA: "O PULMÃO AJUDA NA RESPIRAÇÃO." QUAL ÓRGÃO AJUDA A RESPIRAR?', objetivo: 'Identificar elemento citado', fase1: '✔ PULMÃO ✖ CORAÇÃO ✖ ESTÔMAGO', fase2: '✔ PULMÃO ✖ RIM ✖ FÍGADO' },
                            { enunciado: 'LEIA: "O LEÃO É UM ANIMAL CARNÍVORO." O QUE O LEÃO COME?', objetivo: 'Relacionar informação', fase1: '✔ CARNE ✖ PLANTAS ✖ PEDRAS', fase2: '✔ CARNE ✖ FRUTAS ✖ FOLHAS' },
                            { enunciado: 'LEIA: "A TERRA GIRA AO REDOR DO SOL." QUEM GIRA AO REDOR DO SOL?', objetivo: 'Identificar sujeito', fase1: '✔ A TERRA ✖ A LUA ✖ MARTE', fase2: '✔ A TERRA ✖ JÚPITER ✖ SATURNO' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Identificar Ideia Principal',
                        atividades: [
                            { enunciado: 'LEIA: "AS PLANTAS PRODUZEM SEU PRÓPRIO ALIMENTO." COMO A PLANTA SE ALIMENTA?', objetivo: 'Compreender processo simples', fase1: '✔ PRODUZ SEU ALIMENTO ✖ COME CARNE ✖ BEBE LEITE', fase2: '✔ PRODUZ SEU ALIMENTO ✖ CAÇA ANIMAIS ✖ COME PEIXE' },
                            { enunciado: 'LEIA: "A CHUVA FAZ PARTE DO CICLO DA ÁGUA." A CHUVA FAZ PARTE DE QUAL CICLO?', objetivo: 'Identificar conceito', fase1: '✔ CICLO DA ÁGUA ✖ CICLO DO FOGO ✖ CICLO DO VENTO', fase2: '✔ CICLO DA ÁGUA ✖ CICLO DA TERRA ✖ CICLO DO SOL' },
                            { enunciado: 'LEIA: "O AR É IMPORTANTE PARA A VIDA." POR QUE O AR É IMPORTANTE?', objetivo: 'Inferência simples', fase1: '✔ AJUDA A RESPIRAR ✖ SERVE PARA COMER ✖ SERVE PARA BEBER', fase2: '✔ AJUDA A RESPIRAR ✖ FAZ BARULHO ✖ É DURO' },
                        ],
                    },
                ],
                acessibilidade: 'Destaque visual',
                observacoes: 'Pergunta objetiva',
                bncc: 'EF04LP05',
            }),
        },
        {
            id: 'cap-pt4-02',
            name: 'Produção Textual',
            subject_id: portuguesId,
            order: 17,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Produzir Relato',
                        atividades: [
                            { enunciado: 'ORGANIZE AS FRASES PARA FORMAR UM TEXTO SOBRE A ESCOLA.', objetivo: 'Sequenciar ideias', fase1: '✔ EU ACORDO CEDO / EU VOU PARA A ESCOLA / EU ESTUDO COM MEUS AMIGOS', fase2: '✔ EU ESCOVO OS DENTES / EU TOMO CAFÉ / EU VOU PARA A ESCOLA' },
                            { enunciado: 'QUAL É A FRASE QUE PODE COMEÇAR UM TEXTO SOBRE MEU DIA?', objetivo: 'Identificar frase inicial', fase1: '✔ HOJE EU ACORDEI CEDO. ✖ E DEPOIS. ✖ POR FIM.', fase2: '✔ ONTEM EU FUI À ESCOLA. ✖ ENTÃO. ✖ FINALMENTE.' },
                            { enunciado: 'COMPLETE A FRASE: EU GOSTO DE ______.', objetivo: 'Completar ideia simples', fase1: '✔ BRINCAR ✖ AZUL ✖ ONTEM', fase2: '✔ ESTUDAR ✖ RAPIDAMENTE ✖ DEPOIS' },
                            { enunciado: 'QUAL FRASE TERMINA O TEXTO DE FORMA CORRETA?', objetivo: 'Identificar conclusão', fase1: '✔ FOI UM DIA FELIZ. ✖ PRIMEIRO EU. ✖ DEPOIS.', fase2: '✔ EU VOLTEI PARA CASA. ✖ ANTES. ✖ PORQUE.' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Produzir Texto Estruturado',
                        atividades: [
                            { enunciado: 'ESCREVA 3 FRASES SOBRE SEU DIA. ESCOLHA A MELHOR OPÇÃO PARA COMEÇAR.', objetivo: 'Produção guiada', fase1: '✔ HOJE EU... ✖ DEPOIS. ✖ POR FIM.', fase2: '✔ ONTEM EU... ✖ ENTÃO. ✖ FINALMENTE.' },
                            { enunciado: 'QUAL CONECTIVO COMPLETA A FRASE? EU ESTUDEI, ______ FIZ A TAREFA.', objetivo: 'Usar conectivo adequado', fase1: '✔ DEPOIS ✖ CASA ✖ LIVRO', fase2: '✔ ENTÃO ✖ MESA ✖ ÁGUA' },
                            { enunciado: 'ORGANIZE AS IDEIAS EM TÓPICOS PARA FORMAR UM TEXTO INFORMATIVO ESTRUTURADO.', objetivo: 'Organizar ideias em tópicos', fase1: '✔ INTRODUÇÃO + DESENVOLVIMENTO + CONCLUSÃO ✖ SEM ORDEM ✖ SÓ CONCLUSÃO', fase2: '✔ ESTRUTURA COMPLETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo em tópicos',
                observacoes: 'Parágrafo guiado',
                bncc: 'EF04LP09',
            }),
        },
        {
            id: 'cap-pt4-03',
            name: 'Pontuação Ampliada',
            subject_id: portuguesId,
            order: 18,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Usar Vírgula Simples',
                        atividades: [
                            { enunciado: 'ESCOLHA A FRASE COM PONTO FINAL CORRETO.', objetivo: 'Identificar uso do ponto final', fase1: '✔ EU GOSTO DE LER. ✖ EU GOSTO DE LER ✖ EU GOSTO DE LER,', fase2: '✔ EU FUI À ESCOLA. ✖ EU FUI À ESCOLA ✖ EU FUI À ESCOLA,' },
                            { enunciado: 'QUAL FRASE TERMINA COM PONTO DE INTERROGAÇÃO?', objetivo: 'Reconhecer pergunta', fase1: '✔ VOCÊ FEZ A TAREFA? ✖ VOCÊ FEZ A TAREFA. ✖ VOCÊ FEZ A TAREFA!', fase2: '✔ ONDE ESTÁ O LIVRO? ✖ ONDE ESTÁ O LIVRO. ✖ ONDE ESTÁ O LIVRO!' },
                            { enunciado: 'QUAL FRASE MOSTRA SURPRESA?', objetivo: 'Identificar ponto de exclamação', fase1: '✔ QUE DIA LINDO! ✖ QUE DIA LINDO. ✖ QUE DIA LINDO?', fase2: '✔ QUE LEGAL! ✖ QUE LEGAL. ✖ QUE LEGAL?' },
                            { enunciado: 'ESCOLHA A FRASE COM VÍRGULA CORRETA.', objetivo: 'Identificar uso simples de vírgula', fase1: '✔ JOÃO COMPROU PÃO, LEITE E FRUTA. ✖ JOÃO COMPROU, PÃO LEITE E FRUTA. ✖ JOÃO, COMPROU PÃO LEITE E FRUTA.', fase2: '✔ ANA TROUXE LÁPIS, BORRACHA E CADERNO. ✖ ANA, TROUXE LÁPIS BORRACHA E CADERNO. ✖ ANA TROUXE, LÁPIS BORRACHA E CADERNO.' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Aplicar Pontuação em Diálogo',
                        atividades: [
                            { enunciado: 'COMPLETE COM A PONTUAÇÃO CORRETA: QUE DIA BONITO__', objetivo: 'Aplicar pontuação adequada', fase1: '✔ ! ✖ . ✖ ?', fase2: '✔ ! ✖ , ✖ .' },
                            { enunciado: 'COLOQUE A VÍRGULA NO LUGAR CORRETO: MARIA COMPROU MAÇÃ PERA E UVA.', objetivo: 'Aplicar vírgula em enumeração', fase1: '✔ MARIA COMPROU MAÇÃ, PERA E UVA. ✖ MARIA, COMPROU MAÇÃ PERA E UVA. ✖ MARIA COMPROU, MAÇÃ PERA E UVA.', fase2: '✔ PEDRO TROUXE LÁPIS, BORRACHA E CANETA. ✖ PEDRO, TROUXE LÁPIS BORRACHA E CANETA. ✖ PEDRO TROUXE, LÁPIS BORRACHA E CANETA.' },
                            { enunciado: 'QUAL TEXTO ESTÁ PONTUADO CORRETAMENTE?', objetivo: 'Comparar versões completas', fase1: '✔ EU ACORDEI CEDO. DEPOIS, FUI À ESCOLA. ✖ EU ACORDEI CEDO DEPOIS FUI À ESCOLA ✖ EU ACORDEI CEDO, DEPOIS FUI À ESCOLA', fase2: '✔ EU ESTUDEI. ENTÃO FIZ A TAREFA. ✖ EU ESTUDEI ENTÃO FIZ A TAREFA ✖ EU ESTUDEI, ENTÃO FIZ A TAREFA' },
                        ],
                    },
                ],
                acessibilidade: 'Cor diferenciada',
                observacoes: 'Um recurso por vez',
                bncc: 'EF04LP04',
            }),
        },
        {
            id: 'cap-pt4-04',
            name: 'Uso de Conectivos',
            subject_id: portuguesId,
            order: 19,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Conectivos Simples',
                        atividades: [
                            { enunciado: 'QUAL PALAVRA LIGA AS DUAS FRASES? "EU ESTUDEI ______ FIZ A TAREFA."', objetivo: 'Identificar conectivo simples', fase1: '✔ E ✖ CASA ✖ LIVRO', fase2: '✔ DEPOIS ✖ MESA ✖ ÁGUA' },
                            { enunciado: 'QUAL CONECTIVO INDICA OPOSIÇÃO? "EU QUERIA BRINCAR ______ ESTAVA CHOVENDO."', objetivo: 'Reconhecer conectivo de oposição', fase1: '✔ MAS ✖ E ✖ PORQUE', fase2: '✔ PORÉM ✖ ENTÃO ✖ E' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Aplicar Conectivos em Texto',
                        atividades: [
                            { enunciado: 'REESCREVA O TEXTO USANDO O CONECTIVO CORRETO ENTRE AS FRASES.', objetivo: 'Aplicar conectivo em texto', fase1: '✔ TEXTO COM CONECTIVO CORRETO ✖ TEXTO SEM CONECTIVO ✖ TEXTO COM CONECTIVO ERRADO', fase2: '✔ VERSÃO COESA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'COMPLETE O TEXTO COM O CONECTIVO ADEQUADO: "EU ESTAVA COM FOME, ______ COMI UMA FRUTA."', objetivo: 'Usar conectivo de consequência', fase1: '✔ ENTÃO ✖ MAS ✖ OU', fase2: '✔ POR ISSO ✖ PORÉM ✖ E' },
                        ],
                    },
                ],
                acessibilidade: 'Conectivos destacados por cor',
                observacoes: 'Um conectivo por atividade',
                bncc: 'EF04LP07',
            }),
        },
    ];

    for (const cap of capitulosPortugues4) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosPortugues4.length} pílulas de Português criadas.`);

    // ─── PÍLULAS – MATEMÁTICA ─────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 4º Ano – Matemática...');

    const capitulosMatematica4 = [
        {
            id: 'cap-ma4-01',
            name: 'Operações Complexas',
            subject_id: matematicaId,
            order: 22,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Resolver com Reagrupamento',
                        atividades: [
                            { enunciado: 'RESOLVA A MULTIPLICAÇÃO: 6 × 4. QUAL É O RESULTADO?', objetivo: 'Resolver multiplicação simples', fase1: '✔ 24 ✖ 20 ✖ 18', fase2: '✔ 35 ✖ 30 ✖ 25' },
                            { enunciado: 'RESOLVA A DIVISÃO: 20 ÷ 5. QUAL É O RESULTADO?', objetivo: 'Resolver divisão exata', fase1: '✔ 4 ✖ 5 ✖ 3', fase2: '✔ 6 ✖ 8 ✖ 2' },
                            { enunciado: 'RESOLVA: 12 + 8 - 5. QUAL É O RESULTADO?', objetivo: 'Calcular expressão simples', fase1: '✔ 15 ✖ 20 ✖ 10', fase2: '✔ 18 ✖ 16 ✖ 12' },
                            { enunciado: 'ANA TEM 5 CAIXAS COM 3 LÁPIS EM CADA UMA. QUANTOS LÁPIS ELA TEM?', objetivo: 'Aplicar multiplicação em problema', fase1: '✔ 15 ✖ 8 ✖ 10', fase2: '✔ 12 ✖ 9 ✖ 6' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Problema com 2 Etapas',
                        atividades: [
                            { enunciado: 'RESOLVA: (4 × 5) + 6. QUAL É O RESULTADO?', objetivo: 'Resolver expressão com prioridade', fase1: '✔ 26 ✖ 20 ✖ 24', fase2: '✔ 18 ✖ 30 ✖ 22' },
                            { enunciado: 'UMA LOJA VENDE 4 PACOTES COM 7 BISCOITOS EM CADA UM. DEPOIS VENDERAM 6 BISCOITOS. QUANTOS RESTARAM?', objetivo: 'Problema com duas operações', fase1: '✔ 22 ✖ 28 ✖ 20', fase2: '✔ 18 ✖ 24 ✖ 16' },
                            { enunciado: 'EM UMA SALA HÁ 8 FILEIRAS COM 5 CADEIRAS CADA. QUANTAS CADEIRAS HÁ AO TODO?', objetivo: 'Aplicar multiplicação em organização espacial', fase1: '✔ 40 ✖ 35 ✖ 45', fase2: '✔ 30 ✖ 25 ✖ 50' },
                        ],
                    },
                ],
                acessibilidade: 'Passo fragmentado',
                observacoes: 'Modelo fixo',
                bncc: 'EF04MA06',
            }),
        },
        {
            id: 'cap-ma4-02',
            name: 'Múltiplos e Divisores',
            subject_id: matematicaId,
            order: 23,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Múltiplos Simples',
                        atividades: [
                            { enunciado: 'QUAIS SÃO OS MÚLTIPLOS DE 2 ATÉ 10?', objetivo: 'Identificar múltiplos de 2', fase1: '✔ 2, 4, 6, 8, 10 ✖ 1, 3, 5, 7, 9 ✖ 2, 3, 6, 9, 10', fase2: '✔ MÚLTIPLOS DE 2 CORRETOS ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'O NÚMERO 15 É MÚLTIPLO DE 5?', objetivo: 'Verificar múltiplo simples', fase1: '✔ SIM ✖ NÃO', fase2: '✔ SIM, 5 × 3 = 15 ✖ NÃO ✖ NÃO DÁ PARA SABER' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Problema com Múltiplos',
                        atividades: [
                            { enunciado: 'MARIA PLANTA FLORES A CADA 4 DIAS. EM QUAIS DIAS ELA PLANTARÁ NOS PRÓXIMOS 20 DIAS?', objetivo: 'Resolver problema com múltiplos', fase1: '✔ 4, 8, 12, 16, 20 ✖ 2, 4, 6, 8 ✖ 5, 10, 15, 20', fase2: '✔ MÚLTIPLOS DE 4 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Tabela visual estruturada',
                observacoes: 'Exemplos concretos',
                bncc: 'EF04MA05',
            }),
        },
        {
            id: 'cap-ma4-03',
            name: 'Frações',
            subject_id: matematicaId,
            order: 24,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Fração Equivalente',
                        atividades: [
                            { enunciado: 'A FIGURA MOSTRA UMA PIZZA DIVIDIDA EM 2 PARTES IGUAIS. 1 PARTE ESTÁ PINTADA. QUAL É A FRAÇÃO?', objetivo: 'Identificar fração simples', fase1: '✔ 1/2 ✖ 2/2 ✖ 1/3', fase2: '✔ 1/2 ✖ 1/4 ✖ 2/3' },
                            { enunciado: 'UM RETÂNGULO ESTÁ DIVIDIDO EM 4 PARTES IGUAIS. 1 PARTE ESTÁ PINTADA. QUAL É A FRAÇÃO?', objetivo: 'Reconhecer 1/4', fase1: '✔ 1/4 ✖ 2/4 ✖ 4/4', fase2: '✔ 1/4 ✖ 3/4 ✖ 1/2' },
                            { enunciado: 'UMA BARRA ESTÁ DIVIDIDA EM 3 PARTES IGUAIS. 1 PARTE ESTÁ PINTADA. QUAL É A FRAÇÃO?', objetivo: 'Identificar 1/3', fase1: '✔ 1/3 ✖ 2/3 ✖ 3/3', fase2: '✔ 1/3 ✖ 1/2 ✖ 1/4' },
                            { enunciado: 'QUAL FRAÇÃO REPRESENTA 2 PARTES PINTADAS DE UM TOTAL DE 4 PARTES IGUAIS?', objetivo: 'Interpretar 2/4', fase1: '✔ 2/4 ✖ 1/4 ✖ 3/4', fase2: '✔ 2/4 ✖ 4/4 ✖ 1/2' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Comparação de Frações',
                        atividades: [
                            { enunciado: 'QUAL FRAÇÃO É MAIOR?', objetivo: 'Comparar frações simples', fase1: '✔ 1/2 ✖ 1/4 ✖ 1/3', fase2: '✔ 3/4 ✖ 1/4 ✖ 2/4' },
                            { enunciado: 'QUAL FRAÇÃO REPRESENTA METADE?', objetivo: 'Reconhecer equivalência', fase1: '✔ 1/2 ✖ 1/3 ✖ 1/4', fase2: '✔ 2/4 ✖ 3/4 ✖ 1/5' },
                            { enunciado: 'UM CHOCOLATE FOI DIVIDIDO EM 8 PARTES IGUAIS. 4 PARTES FORAM COMIDAS. QUAL FRAÇÃO FOI COMIDA?', objetivo: 'Identificar 4/8', fase1: '✔ 4/8 ✖ 2/8 ✖ 8/8', fase2: '✔ 4/8 ✖ 1/8 ✖ 6/8' },
                        ],
                    },
                ],
                acessibilidade: 'Representação visual',
                observacoes: 'Cores contrastantes',
                bncc: 'EF04MA09',
            }),
        },
        {
            id: 'cap-ma4-04',
            name: 'Números Decimais',
            subject_id: matematicaId,
            order: 25,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Décimos',
                        atividades: [
                            { enunciado: 'QUAL É O VALOR DO ALGARISMO APÓS A VÍRGULA EM 3,5?', objetivo: 'Identificar décimos', fase1: '✔ 5 DÉCIMOS ✖ 5 INTEIROS ✖ 5 CENTÉSIMOS', fase2: '✔ 5/10 ✖ 5/100 ✖ 50/10' },
                            { enunciado: 'ESCREVA 0,3 POR EXTENSO.', objetivo: 'Ler decimal simples', fase1: '✔ TRÊS DÉCIMOS ✖ TRÊS INTEIROS ✖ TRINTA ✖ ZERO E TRÊS', fase2: '✔ TRÊS DÉCIMOS ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Operação Simples com Decimais',
                        atividades: [
                            { enunciado: 'RESOLVA: 1,5 + 0,5 = ?', objetivo: 'Somar decimais simples', fase1: '✔ 2,0 ✖ 1,0 ✖ 2,5', fase2: '✔ 2 ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'UM PRODUTO CUSTA R$ 4,50 E OUTRO R$ 2,50. QUAL É O VALOR TOTAL?', objetivo: 'Resolver adição com decimais em contexto', fase1: '✔ R$ 7,00 ✖ R$ 6,00 ✖ R$ 8,00', fase2: '✔ R$ 7,00 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Material concreto',
                observacoes: 'Visual fixo',
                bncc: 'EF04MA07',
            }),
        },
        {
            id: 'cap-ma4-05',
            name: 'Problemas com Duas Operações',
            subject_id: matematicaId,
            order: 26,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Dados',
                        atividades: [
                            { enunciado: 'QUAIS SÃO OS DADOS DO PROBLEMA? "ANA TEM 15 LARANJAS E COMPROU MAIS 10."', objetivo: 'Identificar dados do problema', fase1: '✔ 15 LARANJAS + 10 LARANJAS ✖ 15 - 10 ✖ SÓ 10', fase2: '✔ DADOS CORRETOS ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Problema com 2 Etapas',
                        atividades: [
                            { enunciado: 'PEDRO TINHA 30 BOLINHAS. GANHOU 12 E DEPOIS DEU 8. QUANTAS TEM AGORA?', objetivo: 'Resolver duas operações sequenciais', fase1: '✔ 34 ✖ 42 ✖ 22', fase2: '✔ 30 + 12 - 8 = 34 ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'EM UMA LOJA, 3 CAMISETAS CUSTAM R$ 25 CADA. SE VOCÊ PAGAR COM R$ 100, QUAL É O TROCO?', objetivo: 'Resolver problema com duas operações e troco', fase1: '✔ TROCO: R$ 25 ✖ TROCO: R$ 50 ✖ TROCO: R$ 75', fase2: '✔ 3 × 25 = 75; 100 - 75 = 25 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Etapas numeradas visualmente',
                observacoes: 'Sem limite de tempo',
                bncc: 'EF04MA08',
            }),
        },
        {
            id: 'cap-ma4-06',
            name: 'Gráficos Complexos',
            subject_id: matematicaId,
            order: 27,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Ler Gráfico de Colunas',
                        atividades: [
                            { enunciado: 'OBSERVE O GRÁFICO DE BARRAS: MAÇÃ = 5, BANANA = 8, UVA = 3. QUAL FRUTA TEM MAIOR QUANTIDADE?', objetivo: 'Localizar maior valor', fase1: '✔ BANANA ✖ MAÇÃ ✖ UVA', fase2: '✔ LARANJA ✖ PERA ✖ MAÇÃ' },
                            { enunciado: 'NO GRÁFICO: AZUL = 7, VERMELHO = 5, VERDE = 9. QUAL COR TEM 7?', objetivo: 'Identificar valor específico', fase1: '✔ AZUL ✖ VERMELHO ✖ VERDE', fase2: '✔ AMARELO ✖ VERDE ✖ AZUL' },
                            { enunciado: 'QUAL ITEM TEM A SEGUNDA MAIOR QUANTIDADE? (MAÇÃ=10, PERA=8, UVA=5)', objetivo: 'Ordenar visualmente valores', fase1: '✔ PERA ✖ MAÇÃ ✖ UVA', fase2: '✔ BANANA ✖ PERA ✖ MAÇÃ' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Interpretar Dados',
                        atividades: [
                            { enunciado: 'NO GRÁFICO: MENINOS = 12, MENINAS = 15. QUANTAS PESSOAS HÁ AO TODO?', objetivo: 'Somar valores do gráfico', fase1: '✔ 27 ✖ 25 ✖ 30', fase2: '✔ 18 ✖ 22 ✖ 24' },
                            { enunciado: 'NO GRÁFICO: LIVROS=9, REVISTAS=3. QUAL É A DIFERENÇA ENTRE ELES?', objetivo: 'Calcular diferença simples', fase1: '✔ 6 ✖ 12 ✖ 3', fase2: '✔ 4 ✖ 2 ✖ 8' },
                            { enunciado: 'OBSERVE O GRÁFICO: MAÇÃ=6, PERA=6, UVA=2. QUAIS FRUTAS TÊM A MESMA QUANTIDADE?', objetivo: 'Identificar igualdade de valores', fase1: '✔ MAÇÃ E PERA ✖ MAÇÃ E UVA ✖ PERA E UVA', fase2: '✔ BANANA E MAÇÃ ✖ PERA E UVA ✖ UVA E BANANA' },
                        ],
                    },
                ],
                acessibilidade: 'Gráfico ampliado',
                observacoes: 'Uma pergunta por tela',
                bncc: 'EF04MA20',
            }),
        },
    ];

    for (const cap of capitulosMatematica4) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosMatematica4.length} pílulas de Matemática criadas.`);

    // ─── PÍLULAS – CONHECIMENTOS GERAIS ───────────────────────────────────────
    console.log('💊 Criando pílulas do 4º Ano – Conhecimentos Gerais...');

    const capitulosConhecimentos4 = [
        {
            id: 'cap-cg4-01',
            name: 'Sistema Solar',
            subject_id: conhecimentosId,
            order: 23,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Planetas',
                        atividades: [
                            { enunciado: 'QUAL É A ESTRELA DO SISTEMA SOLAR?', objetivo: 'Identificar elemento principal', fase1: '✔ SOL ✖ LUA ✖ TERRA', fase2: '✔ SOL ✖ MARTE ✖ SATURNO' },
                            { enunciado: 'QUAL É O PLANETA ONDE NÓS MORAMOS?', objetivo: 'Identificar planeta Terra', fase1: '✔ TERRA ✖ MARTE ✖ JÚPITER', fase2: '✔ TERRA ✖ VÊNUS ✖ NETUNO' },
                            { enunciado: 'QUAL PLANETA É CONHECIDO COMO PLANETA VERMELHO?', objetivo: 'Reconhecer Marte', fase1: '✔ MARTE ✖ TERRA ✖ URANO', fase2: '✔ MARTE ✖ SATURNO ✖ VÊNUS' },
                            { enunciado: 'QUAL É O MAIOR PLANETA DO SISTEMA SOLAR?', objetivo: 'Identificar Júpiter', fase1: '✔ JÚPITER ✖ MERCÚRIO ✖ TERRA', fase2: '✔ JÚPITER ✖ MARTE ✖ VÊNUS' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Características',
                        atividades: [
                            { enunciado: 'QUAL PLANETA FICA MAIS PRÓXIMO DO SOL?', objetivo: 'Identificar Mercúrio', fase1: '✔ MERCÚRIO ✖ TERRA ✖ SATURNO', fase2: '✔ MERCÚRIO ✖ JÚPITER ✖ NETUNO' },
                            { enunciado: 'QUAL PLANETA TEM ANÉIS VISÍVEIS?', objetivo: 'Reconhecer Saturno', fase1: '✔ SATURNO ✖ MARTE ✖ TERRA', fase2: '✔ SATURNO ✖ MERCÚRIO ✖ VÊNUS' },
                            { enunciado: 'QUANTOS PLANETAS EXISTEM NO SISTEMA SOLAR?', objetivo: 'Reconhecer quantidade básica', fase1: '✔ 8 ✖ 5 ✖ 10', fase2: '✔ 8 ✖ 6 ✖ 9' },
                        ],
                    },
                ],
                acessibilidade: 'Imagens reais',
                observacoes: 'Sequência visual',
                bncc: 'EF04CI03',
            }),
        },
        {
            id: 'cap-cg4-02',
            name: 'Ciclos Naturais',
            subject_id: conhecimentosId,
            order: 24,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Etapas',
                        atividades: [
                            { enunciado: 'NO CICLO DA ÁGUA, O QUE ACONTECE QUANDO A ÁGUA ESQUENTA?', objetivo: 'Identificar evaporação', fase1: '✔ EVAPORA ✖ CONGELA ✖ SOME', fase2: '✔ EVAPORA ✖ VIRA PEDRA ✖ PARA' },
                            { enunciado: 'DEPOIS QUE A ÁGUA EVAPORA, O QUE SE FORMA NO CÉU?', objetivo: 'Identificar condensação', fase1: '✔ NUVENS ✖ PEDRAS ✖ FOGO', fase2: '✔ NUVENS ✖ FUMAÇA ✖ AREIA' },
                            { enunciado: 'QUANDO AS NUVENS FICAM CHEIAS DE ÁGUA, O QUE ACONTECE?', objetivo: 'Identificar chuva', fase1: '✔ CHOVE ✖ NEVA ✖ DESAPARECE', fase2: '✔ CHOVE ✖ QUEBRA ✖ PARA' },
                            { enunciado: 'O SOL AJUDA EM QUAL PARTE DO CICLO DA ÁGUA?', objetivo: 'Relacionar causa e efeito', fase1: '✔ EVAPORAÇÃO ✖ CHUVA ✖ VENTO', fase2: '✔ EVAPORAÇÃO ✖ PLANTAÇÃO ✖ SOMBRA' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Explicar Processo Simples',
                        atividades: [
                            { enunciado: 'COLOQUE EM ORDEM: CHUVA – EVAPORAÇÃO – NUVENS. QUAL É A PRIMEIRA ETAPA?', objetivo: 'Organizar sequência', fase1: '✔ EVAPORAÇÃO ✖ CHUVA ✖ NUVENS', fase2: '✔ EVAPORAÇÃO ✖ SOL ✖ TERRA' },
                            { enunciado: 'NO CICLO DA PLANTA, O QUE VEM PRIMEIRO?', objetivo: 'Identificar início do ciclo', fase1: '✔ SEMENTE ✖ FLOR ✖ FRUTO', fase2: '✔ SEMENTE ✖ ÁRVORE ✖ GALHO' },
                            { enunciado: 'O CICLO DA ÁGUA TERMINA OU CONTINUA?', objetivo: 'Compreender continuidade', fase1: '✔ CONTINUA ✖ TERMINA ✖ PARA', fase2: '✔ CONTINUA ✖ QUEBRA ✖ DESAPARECE' },
                        ],
                    },
                ],
                acessibilidade: 'Animação curta',
                observacoes: 'Ordem fixa',
                bncc: 'EF04CI04',
            }),
        },
        {
            id: 'cap-cg4-03',
            name: 'Sistema Respiratório',
            subject_id: conhecimentosId,
            order: 25,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Órgãos Principais',
                        atividades: [
                            { enunciado: 'QUAL ÓRGÃO É RESPONSÁVEL PELA RESPIRAÇÃO?', objetivo: 'Identificar pulmão', fase1: '✔ PULMÃO ✖ CORAÇÃO ✖ ESTÔMAGO', fase2: '✔ PULMÃO ✖ RIM ✖ CÉREBRO' },
                            { enunciado: 'POR ONDE O AR ENTRA NO CORPO?', objetivo: 'Identificar nariz/boca', fase1: '✔ NARIZ E BOCA ✖ OUVIDO ✖ OLHOS', fase2: '✔ NARIZ ✖ OUVIDO ✖ PELE' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Função Básica',
                        atividades: [
                            { enunciado: 'QUAL É A FUNÇÃO DO SISTEMA RESPIRATÓRIO?', objetivo: 'Relacionar sistema à função', fase1: '✔ LEVAR OXIGÊNIO AO CORPO ✖ DIGERIR ALIMENTOS ✖ BOMBEAR SANGUE', fase2: '✔ RESPIRAR E OXIGENAR ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'O QUE O PULMÃO FAZ COM O OXIGÊNIO INSPIRADO?', objetivo: 'Compreender troca gasosa simples', fase1: '✔ MANDA PARA O SANGUE ✖ JOGA FORA ✖ COME', fase2: '✔ OXIGENA O SANGUE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Esquema corporal simplificado',
                observacoes: 'Um sistema por vez',
                bncc: 'EF04CI07',
            }),
        },
        {
            id: 'cap-cg4-04',
            name: 'Cadeia Alimentar',
            subject_id: conhecimentosId,
            order: 26,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Produtor/Consumidor',
                        atividades: [
                            { enunciado: 'QUEM PRODUZ O PRÓPRIO ALIMENTO NA CADEIA ALIMENTAR?', objetivo: 'Identificar produtor', fase1: '✔ PLANTAS ✖ ANIMAIS ✖ FUNGOS', fase2: '✔ PLANTAS / PRODUTORES ✖ HERBÍVOROS ✖ CARNÍVOROS' },
                            { enunciado: 'O COELHO COME CAPIM. O COELHO É UM...', objetivo: 'Identificar consumidor', fase1: '✔ CONSUMIDOR ✖ PRODUTOR ✖ DECOMPOSTO', fase2: '✔ CONSUMIDOR PRIMÁRIO ✖ PRODUTOR ✖ CONSUMIDOR FINAL' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Organizar Cadeia Alimentar Simples',
                        atividades: [
                            { enunciado: 'ARRASTE NA ORDEM: CAPIM → COELHO → RAPOSA', objetivo: 'Montar cadeia alimentar', fase1: '✔ CAPIM → COELHO → RAPOSA ✖ RAPOSA → CAPIM → COELHO ✖ COELHO → RAPOSA → CAPIM', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Sequência visual concreta',
                observacoes: 'Arrastar em ordem',
                bncc: 'EF04CI04',
            }),
        },
        {
            id: 'cap-cg4-05',
            name: 'Brasil Colônia',
            subject_id: conhecimentosId,
            order: 27,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Período',
                        atividades: [
                            { enunciado: 'QUEM COLONIZOU O BRASIL?', objetivo: 'Identificar colonizador', fase1: '✔ PORTUGAL ✖ ESPANHA ✖ INGLATERRA', fase2: '✔ PORTUGUESES ✖ ESPANHÓIS ✖ INGLESES' },
                            { enunciado: 'O QUE O BRASIL ERA ANTES DE SER INDEPENDENTE?', objetivo: 'Identificar período colonial', fase1: '✔ COLÔNIA DE PORTUGAL ✖ UM PAÍS LIVRE ✖ UMA REPÚBLICA', fase2: '✔ COLÔNIA ✖ NAÇÃO INDEPENDENTE ✖ IMPÉRIO' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Organizar Linha do Tempo',
                        atividades: [
                            { enunciado: 'COLOQUE NA ORDEM: CHEGADA DOS PORTUGUESES → BRASIL COLÔNIA → INDEPENDÊNCIA', objetivo: 'Ordenar cronologia do Brasil Colônia', fase1: '✔ 1500 → COLÔNIA → 1822 ✖ 1822 → 1500 → COLÔNIA ✖ COLÔNIA → 1822 → 1500', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Linha horizontal',
                observacoes: 'Sequência fixa',
                bncc: 'EF04HI03',
            }),
        },
        {
            id: 'cap-cg4-06',
            name: 'Brasil Império',
            subject_id: conhecimentosId,
            order: 28,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Período Histórico',
                        atividades: [
                            { enunciado: 'QUEM FOI O PRIMEIRO IMPERADOR DO BRASIL?', objetivo: 'Identificar Dom Pedro I', fase1: '✔ DOM PEDRO I ✖ DOM PEDRO II ✖ GETÚLIO VARGAS', fase2: '✔ DOM PEDRO I ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'EM QUE ANO O BRASIL PROCLAMOU A INDEPENDÊNCIA?', objetivo: 'Fixar marco histórico', fase1: '✔ 1822 ✖ 1500 ✖ 1889', fase2: '✔ 1822 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Organizar Linha do Tempo Básica',
                        atividades: [
                            { enunciado: 'COLOQUE EM ORDEM: INDEPENDÊNCIA (1822) → PERÍODO IMPERIAL → PROCLAMAÇÃO DA REPÚBLICA (1889)', objetivo: 'Organizar linha do tempo do Império', fase1: '✔ 1822 → IMPÉRIO → 1889 ✖ 1889 → 1822 → IMPÉRIO ✖ REPÚBLICA → 1822 → IMPÉRIO', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Linha do tempo horizontal',
                observacoes: 'Sequência fixa',
                bncc: 'EF04HI04',
            }),
        },
        {
            id: 'cap-cg4-07',
            name: 'Regiões Brasileiras',
            subject_id: conhecimentosId,
            order: 29,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Regiões',
                        atividades: [
                            { enunciado: 'QUANTAS REGIÕES TEM O BRASIL?', objetivo: 'Reconhecer divisão regional', fase1: '✔ 5 ✖ 3 ✖ 7', fase2: '✔ CINCO ✖ TRÊS ✖ DEZ' },
                            { enunciado: 'TOQUE NA REGIÃO NORDESTE NO MAPA.', objetivo: 'Localizar região no mapa', fase1: '✔ NORDESTE CORRETO ✖ SUDESTE ✖ NORTE', fase2: '✔ NORDESTE DESTACADO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Características',
                        atividades: [
                            { enunciado: 'QUAL REGIÃO DO BRASIL TEM A MAIOR FLORESTA TROPICAL DO MUNDO?', objetivo: 'Relacionar região a característica', fase1: '✔ NORTE (AMAZÔNIA) ✖ NORDESTE ✖ SUL', fase2: '✔ REGIÃO NORTE ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'QUAL REGIÃO É CONHECIDA PELO FRIO E POR SERRAS?', objetivo: 'Relacionar clima à região', fase1: '✔ SUL ✖ NORTE ✖ CENTRO-OESTE', fase2: '✔ REGIÃO SUL ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Mapa simplificado',
                observacoes: 'Referência concreta',
                bncc: 'EF04GE02',
            }),
        },
        {
            id: 'cap-cg4-08',
            name: 'Migrações e Território',
            subject_id: conhecimentosId,
            order: 30,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Deslocamento Populacional',
                        atividades: [
                            { enunciado: 'O QUE É MIGRAÇÃO?', objetivo: 'Identificar conceito de migração', fase1: '✔ QUANDO UMA PESSOA SE MUDA DE UM LUGAR PARA OUTRO ✖ QUANDO ALGUÉM VIAJA DE FÉRIAS ✖ QUANDO ALGUÉM COMPRA UMA CASA', fase2: '✔ MUDANÇA DE LOCAL DE MORADIA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Causas Simples',
                        atividades: [
                            { enunciado: 'POR QUE AS PESSOAS MIGRAM PARA OUTRAS CIDADES?', objetivo: 'Identificar causa de migração', fase1: '✔ EM BUSCA DE TRABALHO OU ESTUDO ✖ APENAS POR DIVERSÃO ✖ SEM MOTIVO', fase2: '✔ EMPREGO E OPORTUNIDADES ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Mapa simplificado',
                observacoes: 'Comparação concreta',
                bncc: 'EF04GE04',
            }),
        },
        {
            id: 'cap-cg4-09',
            name: 'Planejamento de Tarefas',
            subject_id: conhecimentosId,
            order: 31,
            content: JSON.stringify({
                etapa: '4º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Organizar Etapas de Projeto',
                        atividades: [
                            { enunciado: 'PARA FAZER UM BOLO, QUAL É A PRIMEIRA ETAPA?', objetivo: 'Organizar etapas de tarefa', fase1: '✔ REUNIR OS INGREDIENTES ✖ COLOCAR NO FORNO ✖ SERVIR', fase2: '✔ ETAPA INICIAL CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'COLOQUE AS ETAPAS DO PROJETO EM ORDEM: PLANEJAR → EXECUTAR → AVALIAR', objetivo: 'Sequenciar etapas de projeto', fase1: '✔ PLANEJAR → EXECUTAR → AVALIAR ✖ AVALIAR → PLANEJAR → EXECUTAR ✖ EXECUTAR → AVALIAR → PLANEJAR', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Antecipar Resultado',
                        atividades: [
                            { enunciado: 'SE VOCÊ PLANEJAR BEM AS ETAPAS DE UMA TAREFA, O QUE ACONTECE?', objetivo: 'Antecipar resultado de planejamento', fase1: '✔ A TAREFA FICA MAIS FÁCIL E ORGANIZADA ✖ A TAREFA FICA MAIS DIFÍCIL ✖ NÃO FAZ DIFERENÇA', fase2: '✔ ORGANIZAÇÃO FACILITA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Agenda visual estruturada',
                observacoes: 'Rotina previsível; fragmentação',
                bncc: 'Competência Geral 6 (BNCC)',
            }),
        },
    ];

    for (const cap of capitulosConhecimentos4) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosConhecimentos4.length} pílulas de Conhecimentos Gerais criadas.`);

    // ─── BNCC – 4º ANO ────────────────────────────────────────────────────────
    console.log('📚 Criando competências BNCC do 4º Ano...');

    const bnccList4 = [
        { id: 'bncc-ef04lp05', code: 'EF04LP05', title: 'Compreensão – Texto informativo', description: 'Identificar tema e ideia principal em texto informativo com destaque visual e pergunta objetiva.', stage: '4º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef04lp09', code: 'EF04LP09', title: 'Produção – Texto informativo estruturado', description: 'Produzir relato e texto informativo com modelo em tópicos (Introdução–Desenvolvimento–Conclusão) com parágrafo guiado.', stage: '4º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef04lp04', code: 'EF04LP04', title: 'Convenções – Pontuação ampliada', description: 'Usar vírgula simples e aplicar pontuação em diálogo com cor diferenciada, um recurso por vez.', stage: '4º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef04lp07', code: 'EF04LP07', title: 'Coesão – Uso de conectivos', description: 'Identificar conectivos simples e aplicar conectivos em texto com destaque por cor, um conectivo por atividade.', stage: '4º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef04ma05', code: 'EF04MA05', title: 'Números – Múltiplos e divisores', description: 'Identificar múltiplos simples e resolver problema envolvendo múltiplos com tabela visual estruturada.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ma06', code: 'EF04MA06', title: 'Operações – Complexas com reagrupamento', description: 'Resolver operações com reagrupamento e problemas com duas etapas usando passo fragmentado e modelo fixo.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ma07', code: 'EF04MA07', title: 'Numeração – Números decimais', description: 'Identificar décimos e resolver operação simples com decimais usando material concreto e visual fixo.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ma08', code: 'EF04MA08', title: 'Resolução – Problemas com duas operações', description: 'Identificar dados e resolver problemas com duas operações com etapas numeradas visualmente, sem limite de tempo.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ma09', code: 'EF04MA09', title: 'Frações – Equivalência e comparação', description: 'Identificar fração equivalente e resolver comparações com representação visual e cores contrastantes.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ma20', code: 'EF04MA20', title: 'Estatística – Gráficos complexos', description: 'Ler gráfico de colunas e interpretar dados com gráfico ampliado, uma pergunta por tela.', stage: '4º Ano', subject: 'Matemática' },
        { id: 'bncc-ef04ci03', code: 'EF04CI03', title: 'Ciências – Sistema solar', description: 'Identificar planetas e relacionar características com imagens reais e sequência visual.', stage: '4º Ano', subject: 'Ciências' },
        { id: 'bncc-ef04ci04', code: 'EF04CI04', title: 'Ciências – Ciclos naturais e cadeia alimentar', description: 'Identificar etapas dos ciclos naturais, explicar processo simples e organizar cadeia alimentar com animação curta e ordem fixa.', stage: '4º Ano', subject: 'Ciências' },
        { id: 'bncc-ef04ci07', code: 'EF04CI07', title: 'Ciências – Sistema respiratório', description: 'Identificar órgãos principais e relacionar função básica do sistema respiratório com esquema corporal simplificado.', stage: '4º Ano', subject: 'Ciências' },
        { id: 'bncc-ef04ge02', code: 'EF04GE02', title: 'Geografia – Regiões brasileiras', description: 'Identificar as cinco regiões do Brasil e relacionar características de cada uma com mapa simplificado.', stage: '4º Ano', subject: 'Geografia' },
        { id: 'bncc-ef04ge04', code: 'EF04GE04', title: 'Geografia – Migrações e território', description: 'Identificar deslocamento populacional e relacionar causas simples de migração com mapa simplificado.', stage: '4º Ano', subject: 'Geografia' },
        { id: 'bncc-ef04hi03', code: 'EF04HI03', title: 'História – Brasil Colônia', description: 'Identificar período colonial e organizar linha do tempo básica com linha horizontal e sequência fixa.', stage: '4º Ano', subject: 'História' },
        { id: 'bncc-ef04hi04', code: 'EF04HI04', title: 'História – Brasil Império', description: 'Identificar período histórico imperial e organizar linha do tempo básica com sequência fixa.', stage: '4º Ano', subject: 'História' },
        { id: 'bncc-cg6-4ano', code: 'Competência Geral 6 (BNCC)', title: 'Funções executivas – Planejamento de tarefas', description: 'Organizar etapas de projeto e antecipar resultado com agenda visual estruturada e rotina previsível.', stage: '4º Ano', subject: 'Transversal' },
    ];

    for (const bncc of bnccList4) {
        await prisma.bnccCompetence.upsert({
            where: { id: bncc.id },
            update: bncc,
            create: bncc,
        });
    }
    console.log(`✅ ${bnccList4.length} competências BNCC do 4º Ano criadas.`);

    console.log('🎉 Seed do 4º Ano concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
