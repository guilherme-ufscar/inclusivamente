import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seed do 3º Ano...');

    // IDs das disciplinas já criadas no seed-1ano.ts
    const portuguesId = 'subject-portugues-1ano';
    const matematicaId = 'subject-matematica-1ano';
    const conhecimentosId = 'subject-conhecimentos-1ano';

    // ─── PÍLULAS – PORTUGUÊS ──────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 3º Ano – Português...');

    const capitulosPortugues3 = [
        {
            id: 'cap-pt3-01',
            name: 'Leitura de Texto Narrativo',
            subject_id: portuguesId,
            order: 12,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Início/Meio/Fim',
                        atividades: [
                            { enunciado: 'LEIA O TEXTO E TOQUE NA IMAGEM QUE MOSTRA O INÍCIO DA HISTÓRIA.', objetivo: 'Identificar início do texto narrativo', fase1: '✔ IMAGEM DO INÍCIO ✖ IMAGEM DO MEIO ✖ IMAGEM DO FIM', fase2: '✔ IMAGEM DO INÍCIO ✖ IMAGEM ALEATÓRIA ✖ IMAGEM DO FIM' },
                            { enunciado: 'O QUE ACONTECEU PRIMEIRO NA HISTÓRIA?', objetivo: 'Sequenciar início da narrativa', fase1: '✔ OPÇÃO CORRETA DO INÍCIO ✖ EVENTO DO MEIO ✖ EVENTO DO FIM', fase2: '✔ OPÇÃO CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'QUAL IMAGEM MOSTRA O FIM DA HISTÓRIA?', objetivo: 'Identificar fim da narrativa', fase1: '✔ IMAGEM FINAL ✖ IMAGEM INICIAL ✖ IMAGEM DO MEIO', fase2: '✔ IMAGEM FINAL ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Inferir Informação Simples',
                        atividades: [
                            { enunciado: 'O QUE O PERSONAGEM SENTIU NO FIM DA HISTÓRIA?', objetivo: 'Inferir sentimento do personagem', fase1: '✔ ALEGRIA ✖ TRISTEZA ✖ RAIVA', fase2: '✔ ALEGRIA ✖ MEDO ✖ SURPRESA' },
                            { enunciado: 'POR QUE O PERSONAGEM FOI EMBORA?', objetivo: 'Inferir causa de ação', fase1: '✔ RESPOSTA INFERIDA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B', fase2: '✔ RESPOSTA INFERIDA CORRETA ✖ DISTRATOR PLAUSÍVEL ✖ DISTRATOR IMPROVÁVEL' },
                        ],
                    },
                ],
                acessibilidade: 'Texto com áudio opcional',
                observacoes: 'Inferência guiada',
                bncc: 'EF03LP05',
            }),
        },
        {
            id: 'cap-pt3-02',
            name: 'Produção de Parágrafo',
            subject_id: portuguesId,
            order: 13,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Organizar Frases',
                        atividades: [
                            { enunciado: 'COLOQUE AS FRASES NA ORDEM CERTA PARA FORMAR UM PARÁGRAFO.', objetivo: 'Organizar frases em sequência lógica', fase1: '✔ SEQUÊNCIA CORRETA ✖ ORDEM INVERTIDA ✖ ORDEM ALEATÓRIA', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'QUAL FRASE VEM DEPOIS DE "ERA UMA VEZ..."?', objetivo: 'Sequenciar texto narrativo', fase1: '✔ CONTINUAÇÃO COERENTE ✖ FRASE SEM RELAÇÃO ✖ FRASE DO FIM', fase2: '✔ CONTINUAÇÃO COERENTE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Produzir Parágrafo Coerente',
                        atividades: [
                            { enunciado: 'ESCREVA UM PARÁGRAFO SOBRE O SEU DIA USANDO AS PALAVRAS DO MODELO.', objetivo: 'Produzir texto coerente com modelo', fase1: '✔ MODELO VISÍVEL ✖ SEM APOIO', fase2: '✔ MODELO REDUZIDO ✖ SEM MODELO' },
                            { enunciado: 'COMPLETE O PARÁGRAFO COM A FRASE QUE FALTA.', objetivo: 'Completar parágrafo com coerência', fase1: '✔ FRASE COERENTE ✖ FRASE SEM RELAÇÃO ✖ FRASE ERRADA', fase2: '✔ FRASE COERENTE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo visual de parágrafo',
                observacoes: 'Estrutura fixa',
                bncc: 'EF03LP09',
            }),
        },
        {
            id: 'cap-pt3-03',
            name: 'Ortografia Contextual',
            subject_id: portuguesId,
            order: 14,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Erro Simples',
                        atividades: [
                            { enunciado: 'TOQUE NA PALAVRA QUE ESTÁ ESCRITA ERRADA.', objetivo: 'Identificar erro ortográfico', fase1: '✔ PALAVRA ERRADA ✖ PALAVRA CERTA ✖ PALAVRA CERTA', fase2: '✔ PALAVRA ERRADA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'COMO SE ESCREVE CORRETO?', objetivo: 'Escolher grafia correta', fase1: '✔ GRAFIA CORRETA ✖ GRAFIA ERRADA ✖ GRAFIA ERRADA', fase2: '✔ GRAFIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Aplicar Regra Ortográfica',
                        atividades: [
                            { enunciado: 'COMPLETE A PALAVRA COM A LETRA CORRETA: CA_A (SA OU ÇA?)', objetivo: 'Aplicar regra ortográfica contextual', fase1: '✔ ÇA ✖ SA ✖ ZA', fase2: '✔ ÇA ✖ SA ✖ XA' },
                            { enunciado: 'QUAL REGRA SE APLICA NESTA PALAVRA?', objetivo: 'Identificar regra ortográfica', fase1: '✔ REGRA CORRETA ✖ REGRA ERRADA ✖ NÃO SE APLICA', fase2: '✔ REGRA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Palavra destacada',
                observacoes: 'Regra isolada',
                bncc: 'EF03LP02',
            }),
        },
        {
            id: 'cap-pt3-04',
            name: 'Comunicação Funcional',
            subject_id: portuguesId,
            order: 15,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Interpretar Recado',
                        atividades: [
                            { enunciado: 'LEIA O RECADO E DIGA QUEM ENVIOU.', objetivo: 'Identificar remetente em recado', fase1: '✔ NOME DO REMETENTE ✖ NOME DO DESTINATÁRIO ✖ LOCAL', fase2: '✔ NOME DO REMETENTE ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'O QUE O RECADO PEDE QUE VOCÊ FAÇA?', objetivo: 'Identificar ação solicitada no recado', fase1: '✔ AÇÃO CORRETA ✖ AÇÃO NÃO SOLICITADA ✖ AÇÃO CONTRÁRIA', fase2: '✔ AÇÃO CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Produzir Mensagem Clara',
                        atividades: [
                            { enunciado: 'ESCREVA UM RECADO PARA SEU COLEGA AVISANDO QUE NÃO VIRÁ À ESCOLA.', objetivo: 'Produzir recado funcional claro', fase1: '✔ MODELO ESTRUTURADO VISÍVEL ✖ SEM MODELO', fase2: '✔ MODELO REDUZIDO ✖ SEM APOIO' },
                            { enunciado: 'QUAL MENSAGEM É MAIS CLARA?', objetivo: 'Avaliar clareza de mensagem', fase1: '✔ MENSAGEM CLARA ✖ MENSAGEM CONFUSA ✖ MENSAGEM INCOMPLETA', fase2: '✔ MENSAGEM CLARA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo estruturado',
                observacoes: 'Evitar ambiguidade',
                bncc: 'EF03LP15',
            }),
        },
    ];

    for (const cap of capitulosPortugues3) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosPortugues3.length} pílulas de Português criadas.`);

    // ─── PÍLULAS – MATEMÁTICA ─────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 3º Ano – Matemática...');

    const capitulosMatematica3 = [
        {
            id: 'cap-ma3-01',
            name: 'Sistema Decimal até 1.000',
            subject_id: matematicaId,
            order: 15,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Representar até 1.000',
                        atividades: [
                            { enunciado: 'QUAL NÚMERO ESTÁ REPRESENTADO NOS BLOCOS? (centenas, dezenas, unidades)', objetivo: 'Representar número com material dourado', fase1: '✔ NÚMERO CORRETO ✖ NÚMERO COM CENTENA A MENOS ✖ NÚMERO COM DEZENA A MAIS', fase2: '✔ NÚMERO CORRETO ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'MONTE O NÚMERO 342 COM OS BLOCOS.', objetivo: 'Compor número de três algarismos', fase1: '✔ 3 CENTENAS + 4 DEZENAS + 2 UNIDADES ✖ COMPOSIÇÃO ERRADA', fase2: '✔ COMPOSIÇÃO CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Decompor Centenas',
                        atividades: [
                            { enunciado: 'DECOMPONHA O NÚMERO 500. QUANTAS CENTENAS TEM?', objetivo: 'Decompor centenas', fase1: '✔ 5 CENTENAS ✖ 50 DEZENAS ✖ 500 UNIDADES', fase2: '✔ 5 CENTENAS ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: '200 + 30 + 7 = ?', objetivo: 'Compor número pela decomposição', fase1: '✔ 237 ✖ 273 ✖ 327', fase2: '✔ 237 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Material dourado digital',
                observacoes: 'Agrupamento visual',
                bncc: 'EF03MA01',
            }),
        },
        {
            id: 'cap-ma3-02',
            name: 'Adição e Subtração com Reagrupamento',
            subject_id: matematicaId,
            order: 16,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Resolver com Reagrupamento',
                        atividades: [
                            { enunciado: 'RESOLVA: 47 + 35 = ?', objetivo: 'Adição com reagrupamento', fase1: '✔ 82 ✖ 72 ✖ 712', fase2: '✔ 82 ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'RESOLVA: 83 – 47 = ?', objetivo: 'Subtração com reagrupamento', fase1: '✔ 36 ✖ 46 ✖ 44', fase2: '✔ 36 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problemas com Duas Etapas',
                        atividades: [
                            { enunciado: 'ANA TINHA 56 FIGURINHAS. GANHOU 28 E DEPOIS DEU 15. QUANTAS TEM AGORA?', objetivo: 'Resolver problema de duas etapas', fase1: '✔ 69 ✖ 41 ✖ 84', fase2: '✔ 69 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Passo fragmentado',
                observacoes: 'Modelo fixo',
                bncc: 'EF03MA06',
            }),
        },
        {
            id: 'cap-ma3-03',
            name: 'Multiplicação',
            subject_id: matematicaId,
            order: 17,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Tabuada Visual',
                        atividades: [
                            { enunciado: 'QUANTOS PONTINHOS TÊM NO TOTAL? (3 grupos de 4)', objetivo: 'Multiplicação com representação visual', fase1: '✔ 12 ✖ 7 ✖ 9', fase2: '✔ 12 ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: '4 × 3 = ?', objetivo: 'Resolver multiplicação com tabuada', fase1: '✔ 12 ✖ 7 ✖ 43', fase2: '✔ 12 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Multiplicação Contextual',
                        atividades: [
                            { enunciado: 'SE CADA CAIXA TEM 5 LARANJAS E HÁ 4 CAIXAS, QUANTAS LARANJAS NO TOTAL?', objetivo: 'Resolver problema multiplicativo', fase1: '✔ 20 ✖ 9 ✖ 54', fase2: '✔ 20 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Tabela visual fixa',
                observacoes: 'Sem tempo limite',
                bncc: 'EF03MA07',
            }),
        },
        {
            id: 'cap-ma3-04',
            name: 'Divisão',
            subject_id: matematicaId,
            order: 18,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Representar Divisão',
                        atividades: [
                            { enunciado: 'DISTRIBUA 12 BOLINHAS ENTRE 3 GRUPOS. QUANTAS BOLINHAS EM CADA GRUPO?', objetivo: 'Representar divisão por distribuição', fase1: '✔ 4 ✖ 3 ✖ 6', fase2: '✔ 4 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problema Simples de Divisão',
                        atividades: [
                            { enunciado: 'SE VOCÊ TEM 15 BALAS PARA DIVIDIR ENTRE 5 AMIGOS, QUANTAS CADA UM GANHA?', objetivo: 'Resolver problema de divisão', fase1: '✔ 3 ✖ 5 ✖ 10', fase2: '✔ 3 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Blocos organizados',
                observacoes: 'Sequência concreta',
                bncc: 'EF03MA08',
            }),
        },
        {
            id: 'cap-ma3-05',
            name: 'Fração Inicial',
            subject_id: matematicaId,
            order: 19,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Metade',
                        atividades: [
                            { enunciado: 'TOQUE NA FIGURA QUE MOSTRA A METADE COLORIDA.', objetivo: 'Identificar metade de figuras', fase1: '✔ METADE CORRETA ✖ UM TERÇO ✖ INTEIRO', fase2: '✔ METADE CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Representar Fração Simples',
                        atividades: [
                            { enunciado: 'QUAL FRAÇÃO REPRESENTA ESTA PARTE COLORIDA? (1 de 4 partes)', objetivo: 'Representar fração simples', fase1: '✔ 1/4 ✖ 1/2 ✖ 2/4', fase2: '✔ 1/4 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Representação concreta',
                observacoes: 'Cores contrastantes',
                bncc: 'EF03MA09',
            }),
        },
        {
            id: 'cap-ma3-06',
            name: 'Gráficos',
            subject_id: matematicaId,
            order: 20,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Ler Gráfico Simples',
                        atividades: [
                            { enunciado: 'OLHE O GRÁFICO E DIGA QUAL FRUTA FOI A MAIS VOTADA.', objetivo: 'Ler dado em gráfico de barras', fase1: '✔ FRUTA CORRETA ✖ SEGUNDA MAIS VOTADA ✖ MENOS VOTADA', fase2: '✔ FRUTA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Interpretar Dado',
                        atividades: [
                            { enunciado: 'QUANTAS PESSOAS VOTARAM NA BANANA?', objetivo: 'Interpretar dado específico no gráfico', fase1: '✔ NÚMERO CORRETO ✖ NÚMERO MENOR ✖ NÚMERO MAIOR', fase2: '✔ NÚMERO CORRETO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Gráfico ampliado',
                observacoes: 'Pergunta direta',
                bncc: 'EF03MA20',
            }),
        },
        {
            id: 'cap-ma3-07',
            name: 'Educação Financeira',
            subject_id: matematicaId,
            order: 21,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Valor Total',
                        atividades: [
                            { enunciado: 'QUANTO VALE O CONJUNTO DE NOTAS NA TELA? (R$ 10 + R$ 5 + R$ 1)', objetivo: 'Calcular valor total de cédulas', fase1: '✔ R$ 16 ✖ R$ 15 ✖ R$ 11', fase2: '✔ R$ 16 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Simular Troco Simples',
                        atividades: [
                            { enunciado: 'VOCÊ TEM R$ 10 E COMPROU UM LANCHE DE R$ 7. QUAL É O SEU TROCO?', objetivo: 'Calcular troco em situação real', fase1: '✔ R$ 3 ✖ R$ 7 ✖ R$ 17', fase2: '✔ R$ 3 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Cédulas digitais',
                observacoes: 'Passo estruturado',
                bncc: 'EF03MA19',
            }),
        },
    ];

    for (const cap of capitulosMatematica3) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosMatematica3.length} pílulas de Matemática criadas.`);

    // ─── PÍLULAS – CONHECIMENTOS GERAIS ───────────────────────────────────────
    console.log('💊 Criando pílulas do 3º Ano – Conhecimentos Gerais...');

    const capitulosConhecimentos3 = [
        {
            id: 'cap-cg3-01',
            name: 'Ecossistemas',
            subject_id: conhecimentosId,
            order: 14,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Elementos',
                        atividades: [
                            { enunciado: 'TOQUE NO ANIMAL QUE VIVE NESTE ECOSSISTEMA (FLORESTA).', objetivo: 'Identificar elemento do ecossistema', fase1: '✔ ANIMAL DA FLORESTA ✖ ANIMAL DO MAR ✖ ANIMAL DO DESERTO', fase2: '✔ ANIMAL CORRETO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Relacionar Cadeia Alimentar Simples',
                        atividades: [
                            { enunciado: 'QUEM COME QUEM? ARRASTE A SETA ENTRE OS SERES VIVOS.', objetivo: 'Montar cadeia alimentar simples', fase1: '✔ PLANTA → COELHO → RAPOSA ✖ RAPOSA → PLANTA ✖ COELHO → RAPOSA → PLANTA', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Ilustração real',
                observacoes: 'Sequência visual',
                bncc: 'EF03CI04',
            }),
        },
        {
            id: 'cap-cg3-02',
            name: 'Corpo Humano',
            subject_id: conhecimentosId,
            order: 15,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Sistemas',
                        atividades: [
                            { enunciado: 'TOQUE NO ÓRGÃO QUE FAZ PARTE DO SISTEMA DIGESTÓRIO.', objetivo: 'Identificar órgão do sistema', fase1: '✔ ESTÔMAGO ✖ PULMÃO ✖ CÉREBRO', fase2: '✔ ESTÔMAGO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Relacionar Função Básica',
                        atividades: [
                            { enunciado: 'QUAL É A FUNÇÃO DO SISTEMA RESPIRATÓRIO?', objetivo: 'Relacionar sistema à sua função', fase1: '✔ RESPIRAR / OXIGENAR ✖ DIGERIR ✖ BOMBEAR SANGUE', fase2: '✔ RESPIRAR ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Esquema simplificado',
                observacoes: 'Um sistema por vez',
                bncc: 'EF03CI02',
            }),
        },
        {
            id: 'cap-cg3-03',
            name: 'Município',
            subject_id: conhecimentosId,
            order: 16,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Funções',
                        atividades: [
                            { enunciado: 'TOQUE NO LUGAR ONDE VOCÊ VAI QUANDO ESTÁ DOENTE.', objetivo: 'Identificar função de espaço público', fase1: '✔ POSTO DE SAÚDE ✖ ESCOLA ✖ PRAÇA', fase2: '✔ POSTO DE SAÚDE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Relacionar Serviços Públicos',
                        atividades: [
                            { enunciado: 'QUAIS SÃO OS SERVIÇOS PÚBLICOS DO SEU MUNICÍPIO? TOQUE NOS QUE VOCÊ CONHECE.', objetivo: 'Identificar e relacionar serviços públicos', fase1: '✔ ESCOLA + SAÚDE + SEGURANÇA ✖ SUPERMERCADO ✖ SHOPPING', fase2: '✔ SERVIÇOS CORRETOS ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Mapa simplificado',
                observacoes: 'Referência concreta',
                bncc: 'EF03GE03',
            }),
        },
        {
            id: 'cap-cg3-04',
            name: 'Linha do Tempo',
            subject_id: conhecimentosId,
            order: 17,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Passado/Presente',
                        atividades: [
                            { enunciado: 'ESTA FOTO É DO PASSADO OU DO PRESENTE?', objetivo: 'Distinguir passado e presente', fase1: '✔ PASSADO ✖ PRESENTE ✖ FUTURO', fase2: '✔ PASSADO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Organizar Sequência Histórica',
                        atividades: [
                            { enunciado: 'COLOQUE OS EVENTOS NA ORDEM CORRETA NA LINHA DO TEMPO.', objetivo: 'Ordenar eventos históricos', fase1: '✔ SEQUÊNCIA CORRETA ✖ ORDEM ERRADA ✖ ORDEM INVERTIDA', fase2: '✔ SEQUÊNCIA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Linha horizontal visual',
                observacoes: 'Sequência fixa',
                bncc: 'EF03HI01',
            }),
        },
        {
            id: 'cap-cg3-05',
            name: 'Regras Sociais',
            subject_id: conhecimentosId,
            order: 18,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Analisar Situação',
                        atividades: [
                            { enunciado: 'O QUE ESTÁ ERRADO NESTA CENA? (criança jogando lixo no chão)', objetivo: 'Identificar comportamento inadequado', fase1: '✔ JOGAR LIXO NO CHÃO ✖ BRINCAR ✖ CONVERSAR', fase2: '✔ COMPORTAMENTO ERRADO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Escolher Solução Adequada',
                        atividades: [
                            { enunciado: 'SEU COLEGA ESTÁ TRISTE. O QUE VOCÊ FAZ?', objetivo: 'Escolher solução socialmente adequada', fase1: '✔ PERGUNTAR SE PRECISA DE AJUDA ✖ IGNORAR ✖ RIR', fase2: '✔ OFERECER AJUDA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: '3 opções visuais',
                observacoes: 'Feedback acolhedor',
                bncc: 'EF03HI04',
            }),
        },
        {
            id: 'cap-cg3-06',
            name: 'Emoções',
            subject_id: conhecimentosId,
            order: 19,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Emoção Complexa',
                        atividades: [
                            { enunciado: 'COMO O PERSONAGEM ESTÁ SE SENTINDO? (personagem com expressão de frustração)', objetivo: 'Identificar emoção complexa', fase1: '✔ FRUSTRADO ✖ ALEGRE ✖ ASSUSTADO', fase2: '✔ FRUSTRADO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Escolher Estratégia Adequada',
                        atividades: [
                            { enunciado: 'VOCÊ ESTÁ COM RAIVA. O QUE PODE FAZER PARA SE ACALMAR?', objetivo: 'Selecionar estratégia de autorregulação', fase1: '✔ RESPIRAR FUNDO ✖ GRITAR ✖ BATER', fase2: '✔ RESPIRAR FUNDO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo visual',
                observacoes: 'Respiração guiada',
                bncc: 'EF03HI05',
            }),
        },
        {
            id: 'cap-cg3-07',
            name: 'Planejamento',
            subject_id: conhecimentosId,
            order: 20,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Organizar Rotina Semanal',
                        atividades: [
                            { enunciado: 'COLOQUE AS ATIVIDADES NO DIA CORRETO DA SEMANA.', objetivo: 'Organizar rotina semanal visual', fase1: '✔ ATIVIDADE NO DIA CERTO ✖ DIA ERRADO ✖ DIA INCORRETO', fase2: '✔ ORGANIZAÇÃO CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Antecipar Tarefa',
                        atividades: [
                            { enunciado: 'O QUE VOCÊ PRECISA LEVAR AMANHÃ PARA A ESCOLA?', objetivo: 'Antecipar necessidades da rotina', fase1: '✔ MOCHILA + LANCHEIRA + CADERNO ✖ BRINQUEDOS ✖ ROUPAS DE BANHO', fase2: '✔ ITENS ESCOLARES ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Agenda visual',
                observacoes: 'Previsibilidade',
                bncc: 'Competência Geral 6',
            }),
        },
        {
            id: 'cap-cg3-08',
            name: 'Arte',
            subject_id: conhecimentosId,
            order: 21,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificar Técnica',
                        atividades: [
                            { enunciado: 'ESTA OBRA FOI FEITA COM QUAL TÉCNICA?', objetivo: 'Identificar técnica artística', fase1: '✔ PINTURA ✖ ESCULTURA ✖ COLAGEM', fase2: '✔ TÉCNICA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Produzir Trabalho Temático',
                        atividades: [
                            { enunciado: 'USE AS CORES DA PALETA PARA PINTAR O DESENHO DO TEMA DE HOJE.', objetivo: 'Produzir trabalho artístico temático', fase1: '✔ PALETA CONTROLADA VISÍVEL ✖ SEM GUIA', fase2: '✔ PALETA REDUZIDA ✖ SEM APOIO' },
                        ],
                    },
                ],
                acessibilidade: 'Paleta controlada',
                observacoes: 'Evitar sobrecarga',
                bncc: 'EF03AR01',
            }),
        },
        {
            id: 'cap-cg3-09',
            name: 'Jogos Estruturados',
            subject_id: conhecimentosId,
            order: 22,
            content: JSON.stringify({
                etapa: '3º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Resolver Desafio Lógico',
                        atividades: [
                            { enunciado: 'QUAL PEÇA COMPLETA O PADRÃO? (sequência de formas)', objetivo: 'Resolver sequência lógica', fase1: '✔ PEÇA CORRETA ✖ PEÇA ERRADA A ✖ PEÇA ERRADA B', fase2: '✔ PEÇA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Criar Solução Alternativa',
                        atividades: [
                            { enunciado: 'EXISTE OUTRA MANEIRA DE RESOLVER? TENTE ENCONTRAR UMA SOLUÇÃO DIFERENTE.', objetivo: 'Desenvolver raciocínio flexível', fase1: '✔ SOLUÇÃO ALTERNATIVA VÁLIDA ✖ REPETIR A MESMA ✖ SEM SOLUÇÃO', fase2: '✔ SOLUÇÃO VÁLIDA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Elementos organizados',
                observacoes: 'Feedback imediato',
                bncc: 'EF03MA10',
            }),
        },
    ];

    for (const cap of capitulosConhecimentos3) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosConhecimentos3.length} pílulas de Conhecimentos Gerais criadas.`);

    // ─── BNCC – 3º ANO ────────────────────────────────────────────────────────
    console.log('📚 Criando competências BNCC do 3º Ano...');

    const bnccList3 = [
        { id: 'bncc-ef03lp05', code: 'EF03LP05', title: 'Compreensão leitora – Narrativo', description: 'Identificar início, meio e fim de texto narrativo e inferir informação simples a partir de pistas textuais.', stage: '3º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef03lp09', code: 'EF03LP09', title: 'Produção textual – Parágrafo', description: 'Organizar frases em sequência lógica e produzir parágrafo coerente com uso de modelo visual.', stage: '3º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef03lp02', code: 'EF03LP02', title: 'Convenções ortográficas contextuais', description: 'Identificar erros ortográficos simples e aplicar regra ortográfica contextual em palavra destacada.', stage: '3º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef03lp15', code: 'EF03LP15', title: 'Linguagem social – Comunicação funcional', description: 'Interpretar recados e produzir mensagem funcional clara usando modelo estruturado.', stage: '3º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef03ma01', code: 'EF03MA01', title: 'Numeração – Sistema decimal até 1.000', description: 'Representar números de três algarismos com material dourado digital e decompor centenas.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma06', code: 'EF03MA06', title: 'Operações – Adição e subtração com reagrupamento', description: 'Resolver adição e subtração com reagrupamento e problemas com duas etapas de forma fragmentada.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma07', code: 'EF03MA07', title: 'Operações – Multiplicação', description: 'Usar tabuada visual para resolver multiplicações e interpretar problemas multiplicativos contextualizados.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma08', code: 'EF03MA08', title: 'Operações – Divisão', description: 'Representar divisão por distribuição igualitária e resolver problema simples de divisão com blocos organizados.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma09', code: 'EF03MA09', title: 'Frações – Representação inicial', description: 'Identificar metade de figuras e representar fração simples com representação concreta e cores contrastantes.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma10', code: 'EF03MA10', title: 'Raciocínio lógico – Jogos estruturados', description: 'Resolver desafios lógicos com elementos organizados e criar soluções alternativas com feedback imediato.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma19', code: 'EF03MA19', title: 'Matemática aplicada – Educação financeira', description: 'Identificar valor total de cédulas digitais e simular situações simples de troco em passo estruturado.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ma20', code: 'EF03MA20', title: 'Estatística – Gráficos', description: 'Ler e interpretar dados em gráfico simples com barras ampliadas por meio de perguntas diretas.', stage: '3º Ano', subject: 'Matemática' },
        { id: 'bncc-ef03ci02', code: 'EF03CI02', title: 'Ciências – Corpo humano', description: 'Identificar sistemas do corpo humano e relacionar cada um à sua função básica por esquema simplificado.', stage: '3º Ano', subject: 'Ciências' },
        { id: 'bncc-ef03ci04', code: 'EF03CI04', title: 'Ciências – Ecossistemas', description: 'Identificar elementos de ecossistemas e relacionar seres vivos em cadeia alimentar simples com ilustração real.', stage: '3º Ano', subject: 'Ciências' },
        { id: 'bncc-ef03ge03', code: 'EF03GE03', title: 'Geografia – Município', description: 'Identificar funções de espaços públicos e relacionar serviços do município com apoio de mapa simplificado.', stage: '3º Ano', subject: 'Geografia' },
        { id: 'bncc-ef03hi01', code: 'EF03HI01', title: 'História – Linha do tempo', description: 'Identificar passado e presente e organizar sequência histórica em linha do tempo visual horizontal.', stage: '3º Ano', subject: 'História' },
        { id: 'bncc-ef03hi04', code: 'EF03HI04', title: 'Cidadania – Regras sociais', description: 'Analisar situações sociais e escolher soluções adequadas com 3 opções visuais e feedback acolhedor.', stage: '3º Ano', subject: 'História' },
        { id: 'bncc-ef03hi05', code: 'EF03HI05', title: 'Autorregulação – Emoções', description: 'Identificar emoções complexas e escolher estratégia adequada de autorregulação com respiração guiada.', stage: '3º Ano', subject: 'História' },
        { id: 'bncc-ef03ar01', code: 'EF03AR01', title: 'Artes – Técnica e produção', description: 'Identificar técnica artística e produzir trabalho temático com paleta controlada para evitar sobrecarga.', stage: '3º Ano', subject: 'Artes' },
        { id: 'bncc-cg6', code: 'Competência Geral 6', title: 'Funções executivas – Planejamento', description: 'Organizar rotina semanal com agenda visual e antecipar tarefas para desenvolver previsibilidade.', stage: '3º Ano', subject: 'Transversal' },
    ];

    for (const bncc of bnccList3) {
        await prisma.bnccCompetence.upsert({
            where: { id: bncc.id },
            update: bncc,
            create: bncc,
        });
    }
    console.log(`✅ ${bnccList3.length} competências BNCC do 3º Ano criadas.`);

    console.log('🎉 Seed do 3º Ano concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
