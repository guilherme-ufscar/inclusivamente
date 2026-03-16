import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seed do 1º Ano...');

    // ─── 1. DISCIPLINAS ───────────────────────────────────────────────────────
    console.log('📚 Criando disciplinas...');

    const portugues = await prisma.subject.upsert({
        where: { id: 'subject-portugues-1ano' },
        update: {},
        create: {
            id: 'subject-portugues-1ano',
            name: 'Português',
            icon: 'BookOpen',
            color: 'text-blue-600'
        }
    });

    const matematica = await prisma.subject.upsert({
        where: { id: 'subject-matematica-1ano' },
        update: {},
        create: {
            id: 'subject-matematica-1ano',
            name: 'Matemática',
            icon: 'Calculator',
            color: 'text-green-600'
        }
    });

    const conhecimentos = await prisma.subject.upsert({
        where: { id: 'subject-conhecimentos-1ano' },
        update: {},
        create: {
            id: 'subject-conhecimentos-1ano',
            name: 'Conhecimentos Gerais',
            icon: 'Globe',
            color: 'text-purple-600'
        }
    });

    console.log('✅ Disciplinas criadas: Português, Matemática, Conhecimentos Gerais');

    // ─── 2. PÍLULAS (CAPÍTULOS) ───────────────────────────────────────────────
    console.log('💊 Criando pílulas (capítulos)...');

    // Português
    const capitulosPortugues = [
        {
            id: 'cap-pt-01',
            name: 'Reconhecimento do Sistema Alfabético',
            subject_id: portugues.id,
            order: 1,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Consolidação Grafema–Fonema',
                        atividades: [
                            { enunciado: 'QUAL LETRA FAZ O SOM /B/? TOQUE NA LETRA.', objetivo: 'Associar grafema ao fonema inicial', fase1: '✔ B ✖ D ✖ P', fase2: '✔ M ✖ N ✖ L' },
                            { enunciado: 'QUAL PALAVRA COMEÇA COM A LETRA M?', objetivo: 'Identificar letra inicial', fase1: '✔ MESA ✖ SAPO ✖ BOLA', fase2: '✔ MACACO ✖ TATU ✖ GATO' },
                            { enunciado: 'TOQUE NA LETRA QUE ESTÁ NO COMEÇO DE SOL.', objetivo: 'Identificar posição inicial', fase1: '✔ S ✖ L ✖ O', fase2: '✔ C (CASA) ✖ A ✖ D' },
                            { enunciado: 'QUAL É A ÚLTIMA LETRA DE PATO?', objetivo: 'Identificar letra final', fase1: '✔ O ✖ P ✖ T', fase2: '✔ A (CASA) ✖ C ✖ S' },
                            { enunciado: 'ARRASTE AS LETRAS QUE FORMAM BOLA.', objetivo: 'Reconhecimento global da palavra', fase1: 'B – O – L – A – M – T', fase2: 'B – O – L – A – R – P' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Análise e Generalização',
                        atividades: [
                            { enunciado: 'QUAL PALAVRA TERMINA COM A LETRA A?', objetivo: 'Identificar letra final', fase1: '✔ CASA ✖ SOL ✖ MAR', fase2: '✔ BOLA ✖ CÉU ✖ PÉ' },
                            { enunciado: 'QUAL PALAVRA TEM A LETRA M NO MEIO?', objetivo: 'Identificar posição medial', fase1: '✔ CAMA ✖ BOLA ✖ SAPO', fase2: '✔ LIMA ✖ PATO ✖ TETO' },
                            { enunciado: 'ENCONTRE A PALAVRA IGUAL: PATO.', objetivo: 'Discriminação visual ampliada', fase1: '✔ PATO ✖ PATA ✖ TATO ✖ POTE', fase2: '✔ BOLA ✖ BOLO ✖ BALA ✖ BOLA' },
                            { enunciado: 'QUAL PALAVRA TEM MAIS LETRAS?', objetivo: 'Comparação de extensão', fase1: '✔ MACACO ✖ SOL ✖ PÉ', fase2: '✔ CAVALO ✖ CASA ✖ MAR' },
                            { enunciado: 'ARRASTE AS PALAVRAS QUE COMEÇAM COM B.', objetivo: 'Classificação por letra inicial', fase1: '✔ BOLA ✔ BOCA ✖ SAPO ✖ MESA', fase2: '✔ BARCO ✔ BALA ✖ CASA ✖ PATO' }
                        ]
                    }
                ],
                acessibilidade: 'Áudio das letras + destaque visual',
                observacoes: 'DI: 2 opções por rodada. TEA: layout fixo.'
            })
        },
        {
            id: 'cap-pt-02',
            name: 'Formação de Palavras',
            subject_id: portugues.id,
            order: 2,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Composição Silábica e Palavras Simples',
                        atividades: [
                            { enunciado: 'ARRASTE AS SÍLABAS PARA FORMAR A PALAVRA BO-LO.', objetivo: 'Formar palavra com 2 sílabas', fase1: 'BO – LO – MA – CA', fase2: 'CA – SA – PA – TO' },
                            { enunciado: 'QUAL É A PALAVRA CORRETA? (imagem de SAPO)', objetivo: 'Relacionar imagem à palavra escrita', fase1: '✔ SAPO ✖ PASO ✖ SOPA', fase2: '✔ CASA ✖ CASSA ✖ SACO' },
                            { enunciado: 'COMPLETE A PALAVRA: CA__A.', objetivo: 'Completar palavra simples', fase1: '✔ SA ✖ MA ✖ PA', fase2: '✔ BO (CA BO A) ✖ LA ✖ TO' },
                            { enunciado: 'QUANTAS SÍLABAS TEM A PALAVRA BO-LA?', objetivo: 'Identificar segmentação silábica', fase1: '✔ 2 ✖ 1 ✖ 3', fase2: '✔ 3 (MA-CA-CO) ✖ 2 ✖ 4' },
                            { enunciado: 'ARRASTE AS LETRAS PARA FORMAR MALA.', objetivo: 'Formação por ordenação de letras', fase1: 'M – A – L – A – T', fase2: 'M – A – L – A – R' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Análise, Comparação e Generalização',
                        atividades: [
                            { enunciado: 'QUAL PALAVRA ESTÁ ESCRITA CORRETAMENTE?', objetivo: 'Discriminar grafia correta', fase1: '✔ BOLA ✖ BOLLA ✖ BOL A', fase2: '✔ CAVALO ✖ CAVALU ✖ CAVLO' },
                            { enunciado: 'QUAL PALAVRA TEM MAIS SÍLABAS?', objetivo: 'Comparar extensão silábica', fase1: '✔ MACACO ✖ BOLO ✖ SOL', fase2: '✔ CAVALO ✖ CASA ✖ MAR' },
                            { enunciado: 'ARRASTE AS PALAVRAS QUE COMEÇAM COM CA.', objetivo: 'Classificar por sílaba inicial', fase1: '✔ CASA ✔ CAVALO ✖ BOLA ✖ SAPO', fase2: '✔ CANECA ✔ CADERNO ✖ PATO ✖ LATA' },
                            { enunciado: 'COMPLETE A PALAVRA: MA__ACO.', objetivo: 'Completar palavra trissilábica', fase1: '✔ CA ✖ BO ✖ TO', fase2: '✔ MA (MA MA CO) ✖ LA ✖ SA' },
                            { enunciado: 'ENCONTRE A PALAVRA DIFERENTE.', objetivo: 'Discriminar por estrutura', fase1: '✔ SOL (entre BOLA, CASA, PATO)', fase2: '✔ MAR (entre CAVALO, MACACO, SAPATO)' }
                        ]
                    }
                ],
                acessibilidade: 'Letras móveis ampliadas',
                observacoes: 'Banco reduzido de letras para DI'
            })
        },
        {
            id: 'cap-pt-03',
            name: 'Leitura de Frases',
            subject_id: portugues.id,
            order: 3,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Leitura Literal com Apoio Visual',
                        atividades: [
                            { enunciado: 'LEIA A FRASE E TOQUE NA IMAGEM CORRETA. FRASE: "O GATO DORME."', objetivo: 'Relacionar frase à imagem', fase1: '✔ GATO DORMINDO ✖ GATO CORRENDO ✖ GATO COMENDO', fase2: '✔ MENINO CORRENDO ✖ MENINO DORMINDO ✖ MENINO NADANDO' },
                            { enunciado: 'QUAL FRASE ESTÁ ESCRITA? (imagem: A BOLA É AZUL.)', objetivo: 'Identificar frase correspondente', fase1: '✔ A BOLA É AZUL. ✖ A BOLA É VERDE. ✖ O SAPO É AZUL.', fase2: '✔ O CACHORRO LATE. ✖ O CACHORRO VOA. ✖ O CACHORRO DORME.' },
                            { enunciado: 'QUAL É A ÚLTIMA PALAVRA DA FRASE? FRASE: "A CASA É GRANDE."', objetivo: 'Identificar palavra final', fase1: '✔ GRANDE ✖ CASA ✖ É', fase2: '✔ AZUL (para "O CÉU É AZUL.") ✖ CÉU ✖ É' },
                            { enunciado: 'QUANTAS PALAVRAS TEM A FRASE? FRASE: "O SAPO PULA."', objetivo: 'Contar palavras', fase1: '✔ 3 ✖ 2 ✖ 4', fase2: '✔ 4 (para "A MENINA COME BOLO.") ✖ 3 ✖ 5' },
                            { enunciado: 'ARRASTE AS PALAVRAS PARA FORMAR A FRASE.', objetivo: 'Organizar frase simples', fase1: 'O – GATO – DORME', fase2: 'A – MENINA – COME – BOLO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Compreensão Simples',
                        atividades: [
                            { enunciado: 'QUEM ESTÁ CORRENDO? FRASE: "O MENINO CORRE."', objetivo: 'Identificar sujeito', fase1: '✔ MENINO ✖ GATO ✖ CASA', fase2: '✔ CACHORRO ✖ MENINO ✖ GATO' },
                            { enunciado: 'O QUE O GATO ESTÁ FAZENDO? FRASE: "O GATO COME."', objetivo: 'Identificar ação', fase1: '✔ COMENDO ✖ DORMINDO ✖ PULANDO', fase2: '✔ BEBENDO ✖ CORRENDO ✖ DORMINDO' },
                            { enunciado: 'QUAL FRASE ESTÁ ERRADA?', objetivo: 'Discriminar incoerência semântica', fase1: '✔ O PEIXE VOA. ✖ O PÁSSARO VOA. ✖ O SAPO PULA.', fase2: '✔ O CACHORRO MIA. ✖ O GATO MIA. ✖ O BOI ANDA.' },
                            { enunciado: 'QUAL FRASE COMBINA COM A IMAGEM?', objetivo: 'Compreensão contextual', fase1: '✔ A MENINA LÊ. ✖ A MENINA DORME. ✖ A MENINA CORRE.', fase2: '✔ O HOMEM DIRIGE. ✖ O HOMEM NADA. ✖ O HOMEM PULA.' },
                            { enunciado: 'O QUE ACONTECE PRIMEIRO? FRASES: "A MENINA ACORDA. A MENINA COME."', objetivo: 'Identificar ordem lógica', fase1: '✔ A MENINA ACORDA. ✖ A MENINA COME. ✖ A MENINA DORME.', fase2: '✔ O MENINO ACORDA. ✖ O MENINO ALMOÇA. ✖ O MENINO DORME.' }
                        ]
                    }
                ],
                acessibilidade: 'Texto narrado + pictograma opcional',
                observacoes: 'Pergunta objetiva após leitura'
            })
        },
        {
            id: 'cap-pt-04',
            name: 'Produção de Frases',
            subject_id: portugues.id,
            order: 4,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Construção Guiada',
                        atividades: [
                            { enunciado: 'COMPLETE A FRASE: O GATO ____.', objetivo: 'Completar com verbo adequado', fase1: '✔ DORME ✖ AZUL ✖ CASA', fase2: '✔ CORRE ✖ GRANDE ✖ SAPATO' },
                            { enunciado: 'ESCOLHA A FRASE CORRETA.', objetivo: 'Construir frase coerente', fase1: '✔ A MENINA COME BOLO. ✖ MENINA COME BOLO. ✖ A MENINA BOLO COME.', fase2: '✔ O SAPO PULA. ✖ SAPO O PULA. ✖ PULA O SAPO.' },
                            { enunciado: 'ARRASTE AS PALAVRAS PARA FORMAR A FRASE.', objetivo: 'Organizar estrutura S+V', fase1: 'O – CACHORRO – LATE', fase2: 'A – MENINA – LÊ – LIVRO' },
                            { enunciado: 'QUAL FRASE TEM SENTIDO?', objetivo: 'Identificar coerência', fase1: '✔ O SOL BRILHA. ✖ O SOL LATE. ✖ O SOL COME.', fase2: '✔ A ÁGUA MOLHA. ✖ A ÁGUA DORME. ✖ A ÁGUA PULA.' },
                            { enunciado: 'COMPLETE: A BOLA É ____.', objetivo: 'Completar com adjetivo', fase1: '✔ AZUL ✖ CORRE ✖ CASA', fase2: '✔ GRANDE ✖ COME ✖ DORME' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Expansão e Coesão',
                        atividades: [
                            { enunciado: 'COMPLETE A FRASE COM DUAS PALAVRAS.', objetivo: 'Expandir estrutura', fase1: '✔ O MENINO CORRE.', fase2: '✔ A MENINA COME BOLO.' },
                            { enunciado: 'QUAL FRASE ESTÁ MAIS COMPLETA?', objetivo: 'Comparar estruturas', fase1: '✔ O GATO PRETO DORME. ✖ O GATO DORME. ✖ GATO DORME.', fase2: '✔ A MENINA LÊ O LIVRO. ✖ A MENINA LÊ. ✖ MENINA LÊ.' },
                            { enunciado: 'QUAL FRASE ESTÁ NO PASSADO?', objetivo: 'Introduzir noção temporal simples', fase1: '✔ O MENINO CORREU. ✖ O MENINO CORRE. ✖ O MENINO CORRER.', fase2: '✔ A MENINA PULOU. ✖ A MENINA PULA. ✖ A MENINA PULAR.' },
                            { enunciado: 'QUAL FRASE ESTÁ NO LUGAR CERTO?', objetivo: 'Organizar frase SUJEITO + VERBO + OBJETO', fase1: '✔ A MENINA COME MAÇÃ. ✖ COME A MENINA MAÇÃ. ✖ MENINA MAÇÃ COME.', fase2: '✔ O MENINO CHUTA A BOLA. ✖ CHUTA O MENINO BOLA. ✖ MENINO BOLA CHUTA.' },
                            { enunciado: 'ESCOLHA A MELHOR FRASE PARA A IMAGEM.', objetivo: 'Selecionar frase adequada ao contexto', fase1: '✔ O MENINO BRINCA NO PARQUE. ✖ O MENINO DORME NO PARQUE. ✖ O MENINO COME NO PARQUE.', fase2: '✔ A MENINA ESCREVE NO CADERNO. ✖ A MENINA NADA NO CADERNO. ✖ A MENINA LATE NO CADERNO.' }
                        ]
                    }
                ],
                acessibilidade: 'Modelo estrutural visível',
                observacoes: 'Estrutura S+V+Complemento fixa'
            })
        },
        {
            id: 'cap-pt-05',
            name: 'Sequência Narrativa',
            subject_id: portugues.id,
            order: 5,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Organização Linear',
                        atividades: [
                            { enunciado: 'ARRASTE AS IMAGENS NA ORDEM CORRETA.', objetivo: 'Organizar 3 cenas', fase1: 'ACORDAR → ESCOVAR → IR À ESCOLA', fase2: 'COMER → LAVAR → GUARDAR' },
                            { enunciado: 'O QUE ACONTECE PRIMEIRO?', objetivo: 'Identificar evento inicial', fase1: '✔ ACORDAR ✖ DORMIR ✖ JANTAR', fase2: '✔ VESTIR ROUPA ✖ BRINCAR ✖ DORMIR' },
                            { enunciado: 'QUAL É O FINAL DA HISTÓRIA?', objetivo: 'Identificar desfecho', fase1: '✔ ELE CHEGOU EM CASA. ✖ ELE ACORDOU. ✖ ELE COMEÇOU A CORRER.', fase2: 'Nova história ampliada' },
                            { enunciado: 'QUAL IMAGEM VEM DEPOIS? (ROTINA: ACORDAR → ESCOVAR OS DENTES → ?)', objetivo: 'Identificar continuidade lógica', fase1: '✔ IR À ESCOLA ✖ DORMIR ✖ JANTAR', fase2: '✔ TOMAR BANHO ✖ ACORDAR ✖ ALMOÇAR' },
                            { enunciado: 'ARRASTE O COMEÇO DA HISTÓRIA.', objetivo: 'Identificar início narrativo', fase1: '✔ ERA UMA VEZ... ✖ ELES FORAM PARA CASA. ✖ FIM.', fase2: '✔ UM DIA... ✖ E DEPOIS... ✖ FIM.' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Causa e Consequência',
                        atividades: [
                            { enunciado: 'POR QUE O MENINO CAIU? (IMAGEM: MENINO CORRENDO E CAINDO)', objetivo: 'Identificar causa simples', fase1: '✔ ELE CORREU RÁPIDO. ✖ ELE DORMIU. ✖ ELE COMEU.', fase2: '✔ ELE ESCORREGOU NA ÁGUA. ✖ ELE LEU UM LIVRO. ✖ ELE DESENHOU.' },
                            { enunciado: 'QUAL FRASE EXPLICA O QUE ACONTECEU? (IMAGEM: MENINO MOLHADO NA CHUVA)', objetivo: 'Identificar relação causa–consequência', fase1: '✔ ELE FICOU MOLHADO PORQUE CHOVEU.', fase2: '✔ ELE FICOU SUJO PORQUE CAIU NA LAMA.' },
                            { enunciado: 'QUAL ACONTECEU POR ÚLTIMO? (SEQUÊNCIA: ACORDAR → VESTIR → CHEGAR EM CASA)', objetivo: 'Identificar evento final', fase1: '✔ ELE CHEGOU EM CASA. ✖ ELE ACORDOU. ✖ ELE VESTIU ROUPA.', fase2: '✔ ELE DORMIU. ✖ ELE TOMOU CAFÉ. ✖ ELE ESCOVOU OS DENTES.' }
                        ]
                    }
                ],
                acessibilidade: 'Imagens ampliadas',
                observacoes: 'Roteiro visual permanente'
            })
        }
    ];

    // Matemática
    const capitulosMatematica = [
        {
            id: 'cap-ma-01',
            name: 'Sistema de Numeração',
            subject_id: matematica.id,
            order: 1,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Reconhecimento e Contagem',
                        atividades: [
                            { enunciado: 'QUAL É O NÚMERO? (imagem com 7 bolas)', objetivo: 'Relacionar número à quantidade', fase1: '✔ 7 ✖ 5 ✖ 9', fase2: '✔ 12 ✖ 10 ✖ 15' },
                            { enunciado: 'CONTE E TOQUE NO NÚMERO.', objetivo: 'Contagem até 20', fase1: '✔ 15 ✖ 13 ✖ 18', fase2: '✔ 18 ✖ 16 ✖ 20' },
                            { enunciado: 'QUAL NÚMERO VEM DEPOIS? 8 →', objetivo: 'Sequência numérica', fase1: '✔ 9 ✖ 7 ✖ 10', fase2: '✔ 15 ✖ 13 ✖ 16' },
                            { enunciado: 'QUAL NÚMERO VEM ANTES? 12 →', objetivo: 'Sequência regressiva', fase1: '✔ 11 ✖ 13 ✖ 10', fase2: '✔ 19 ✖ 18 ✖ 20' },
                            { enunciado: 'ARRASTE O NÚMERO MAIOR.', objetivo: 'Comparar números simples', fase1: '✔ 18 ✖ 12 ✖ 9', fase2: '✔ 20 ✖ 15 ✖ 17' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Decomposição Simples',
                        atividades: [
                            { enunciado: '10 É IGUAL A?', objetivo: 'Compor dezena', fase1: '✔ 5+5 ✖ 4+4 ✖ 6+3', fase2: '✔ 8+2 ✖ 7+1 ✖ 6+2' },
                            { enunciado: 'QUAL NÚMERO TEM UMA DEZENA?', objetivo: 'Reconhecer dezena', fase1: '✔ 10 ✖ 5 ✖ 8', fase2: '✔ 12 ✖ 9 ✖ 7' },
                            { enunciado: 'SEPARE EM GRUPOS DE 10.', objetivo: 'Agrupamento', fase1: '2 grupos de 10', fase2: '3 grupos de 10' },
                            { enunciado: 'QUAL NÚMERO ESTÁ ENTRE 8 E 10?', objetivo: 'Identificar número intermediário', fase1: '✔ 9 ✖ 7 ✖ 11', fase2: '✔ 14 ✖ 12 ✖ 16' },
                            { enunciado: 'ARRASTE OS NÚMEROS MENORES QUE 15.', objetivo: 'Classificação numérica', fase1: '✔ 10 ✔ 12 ✖ 16 ✖ 18', fase2: '✔ 13 ✔ 14 ✖ 19 ✖ 20' }
                        ]
                    }
                ],
                acessibilidade: 'Blocos concretos digitais',
                observacoes: 'DI: agrupamentos visuais organizados'
            })
        },
        {
            id: 'cap-ma-02',
            name: 'Adição Simples',
            subject_id: matematica.id,
            order: 2,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Representação Concreta',
                        atividades: [
                            { enunciado: '2 + 3 É IGUAL A?', objetivo: 'Resolver soma até 5', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '✔ 7 (3+4) ✖ 6 ✖ 8' },
                            { enunciado: 'SOME OS OBJETOS. (4 maçãs + 2 maçãs)', objetivo: 'Somar visualmente', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 9 ✖ 8 ✖ 10' },
                            { enunciado: 'QUAL É O RESULTADO? 5+5', objetivo: 'Soma até 10', fase1: '✔ 10 ✖ 9 ✖ 11', fase2: '✔ 8 (4+4) ✖ 7 ✖ 9' },
                            { enunciado: 'ARRASTE O RESULTADO CORRETO.', objetivo: 'Associar operação ao resultado', fase1: '✔ 12 (7+5) ✖ 11 ✖ 10', fase2: '✔ 14 (8+6) ✖ 13 ✖ 15' },
                            { enunciado: 'COMPLETE: 9 + __ = 10.', objetivo: 'Identificar complemento', fase1: '✔ 1 ✖ 2 ✖ 3', fase2: '✔ 2 (8+2=10) ✖ 3 ✖ 4' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problema Estruturado',
                        atividades: [
                            { enunciado: 'JOÃO TEM 3 BOLAS. GANHOU MAIS 4. QUANTAS TEM AGORA?', objetivo: 'Resolver problema simples', fase1: '✔ 7 ✖ 6 ✖ 8', fase2: '✔ 9 (5+4) ✖ 8 ✖ 10' },
                            { enunciado: 'QUAL É A SOMA? 8+7', objetivo: 'Soma até 20', fase1: '✔ 15 ✖ 14 ✖ 16', fase2: '✔ 17 (9+8) ✖ 18 ✖ 16' },
                            { enunciado: 'QUAL CONTA É IGUAL A 10?', objetivo: 'Identificar equivalência', fase1: '✔ 6+4 ✖ 5+3 ✖ 7+2', fase2: '✔ 8+2 ✖ 4+4 ✖ 9+0' },
                            { enunciado: 'ARRASTE A CONTA CORRETA PARA O RESULTADO 12.', objetivo: 'Associar operação ao resultado', fase1: '✔ 7+5 ✖ 6+4 ✖ 5+5', fase2: '✔ 9+3 ✖ 8+2 ✖ 10+1' },
                            { enunciado: 'QUAL É A SOMA MAIOR?', objetivo: 'Comparar resultados', fase1: '✔ 8+7 ✖ 5+5', fase2: '✔ 9+8 ✖ 6+6' }
                        ]
                    }
                ],
                acessibilidade: 'Material dourado virtual',
                observacoes: 'Passo a passo estruturado'
            })
        },
        {
            id: 'cap-ma-03',
            name: 'Subtração Simples',
            subject_id: matematica.id,
            order: 3,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Representação Concreta',
                        atividades: [
                            { enunciado: '5 – 2 É IGUAL A?', objetivo: 'Resolver subtração até 5', fase1: '✔ 3 ✖ 2 ✖ 4', fase2: '✔ 6 (8-2) ✖ 5 ✖ 7' },
                            { enunciado: 'RETIRE 3 MAÇÃS. QUANTAS SOBRAM? (imagem 7 maçãs)', objetivo: 'Subtração visual', fase1: '✔ 4 ✖ 3 ✖ 5', fase2: '✔ 5 (9-4) ✖ 4 ✖ 6' },
                            { enunciado: 'QUAL É O RESULTADO? 9-4', objetivo: 'Subtração até 10', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '✔ 8 (12-4) ✖ 7 ✖ 9' },
                            { enunciado: 'COMPLETE: 10 – __ = 7.', objetivo: 'Identificar complemento', fase1: '✔ 3 ✖ 2 ✖ 4', fase2: '✔ 5 (15-5=10) ✖ 4 ✖ 6' },
                            { enunciado: 'ARRASTE O RESULTADO CORRETO. 14-4', objetivo: 'Associar operação ao resultado', fase1: '✔ 10 ✖ 9 ✖ 11', fase2: '✔ 8 (13-5) ✖ 7 ✖ 9' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problema Contextualizado',
                        atividades: [
                            { enunciado: 'ANA TINHA 8 BALAS. DEU 3. QUANTAS SOBRARAM?', objetivo: 'Resolver problema simples', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '✔ 7 (10-3) ✖ 6 ✖ 8' },
                            { enunciado: 'QUAL CONTA RESULTA EM 6?', objetivo: 'Identificar equivalência', fase1: '✔ 9-3 ✖ 8-1 ✖ 10-2', fase2: '✔ 11-5 ✖ 12-4 ✖ 13-6' },
                            { enunciado: 'QUAL É O MENOR RESULTADO?', objetivo: 'Comparar resultados', fase1: '✔ 10-6 ✖ 10-3', fase2: '✔ 15-9 ✖ 15-4' },
                            { enunciado: 'ARRASTE A CONTA PARA O RESULTADO 8.', objetivo: 'Correspondência operação-resultado', fase1: '✔ 12-4 ✖ 9-2 ✖ 10-1', fase2: '✔ 14-6 ✖ 13-4 ✖ 11-2' },
                            { enunciado: 'COMPLETE: 15 – 5 = __.', objetivo: 'Subtração até 20', fase1: '✔ 10 ✖ 9 ✖ 11', fase2: '✔ 12 (18-6) ✖ 13 ✖ 14' }
                        ]
                    }
                ],
                acessibilidade: 'Representação concreta',
                observacoes: 'Sem limite de tempo'
            })
        },
        {
            id: 'cap-ma-04',
            name: 'Problemas Simples',
            subject_id: matematica.id,
            order: 4,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Interpretação Direta',
                        atividades: [
                            { enunciado: 'JOÃO TEM 2 CARROS. GANHOU MAIS 3. QUANTOS TEM?', objetivo: 'Identificar operação de soma', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '✔ 7 (4+3) ✖ 6 ✖ 8' },
                            { enunciado: 'HÁ 6 MAÇÃS. 2 CAÍRAM. QUANTAS FICARAM?', objetivo: 'Identificar subtração', fase1: '✔ 4 ✖ 3 ✖ 5', fase2: '✔ 5 (9-4) ✖ 4 ✖ 6' },
                            { enunciado: 'QUAL CONTA RESOLVE O PROBLEMA?', objetivo: 'Escolher operação correta', fase1: '✔ 3+4 ✖ 3-4 ✖ 4-3', fase2: '✔ 8-2 ✖ 8+2 ✖ 2+8' },
                            { enunciado: 'QUEM TEM MAIS?', objetivo: 'Comparar quantidades', fase1: '✔ ANA ✖ JOÃO', fase2: '✔ MARIA ✖ PEDRO' },
                            { enunciado: 'LEIA O PROBLEMA E MARQUE A PERGUNTA. PROBLEMA: "JOÃO TINHA 5 BALAS. ELE DEU 2 PARA O AMIGO."', objetivo: 'Identificar foco da pergunta matemática', fase1: '✔ QUANTAS BALAS RESTARAM? ✖ ONDE JOÃO ESTAVA? ✖ QUEM ERA O AMIGO?', fase2: '✔ QUANTAS MAÇÃS SOBRARAM? ✖ QUAL ERA A COR DA MAÇÃ? ✖ QUEM ERA ANA?' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Duas Etapas Simples',
                        atividades: [
                            { enunciado: 'PEDRO TINHA 5 BOLAS. GANHOU 2 E PERDEU 1. QUANTAS TEM?', objetivo: 'Resolver duas ações', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 8 (6+3-1) ✖ 7 ✖ 9' },
                            { enunciado: 'LEIA O PROBLEMA E MARQUE A PRIMEIRA CONTA.', objetivo: 'Identificar ordem de resolução', fase1: '✔ 5 + 2 ✖ 5 - 1 ✖ 2 + 1', fase2: '✔ 4 + 3 ✖ 4 - 2 ✖ 3 + 2' },
                            { enunciado: 'QUAL É A RESPOSTA FINAL? PROBLEMA: "ANA TINHA 5 BALAS. GANHOU 2. DEPOIS COMEU 1."', objetivo: 'Resolver problema completo', fase1: '✔ 6 ✖ 7 ✖ 5', fase2: '✔ 5 ✖ 4 ✖ 7' },
                            { enunciado: 'QUAL OPERAÇÃO RESOLVE O PROBLEMA? PROBLEMA: "JOÃO TINHA 7 BOLAS E PERDEU 2."', objetivo: 'Escolher operação adequada', fase1: '✔ 7 - 2 ✖ 7 + 2 ✖ 2 + 7', fase2: '✔ 6 + 3 ✖ 6 - 3 ✖ 3 - 6' },
                            { enunciado: 'QUAL É O RESULTADO MAIOR?', objetivo: 'Comparar soluções', fase1: '✔ 10 ✖ 8', fase2: '✔ 12 ✖ 9' }
                        ]
                    }
                ],
                acessibilidade: 'Texto reduzido + áudio',
                observacoes: 'Uma pergunta por tela'
            })
        },
        {
            id: 'cap-ma-05',
            name: 'Sequências Lógicas',
            subject_id: matematica.id,
            order: 5,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Padrão Simples',
                        atividades: [
                            { enunciado: 'QUAL É O PRÓXIMO NÚMERO? 1, 2, 3, __', objetivo: 'Identificar sequência crescente simples', fase1: '✔ 4 ✖ 5 ✖ 2', fase2: '✔ 8 (5, 6, 7, __) ✖ 9 ✖ 6' },
                            { enunciado: 'QUAL É A PRÓXIMA COR? VERMELHO, AZUL, VERMELHO, __', objetivo: 'Identificar padrão alternado', fase1: '✔ AZUL ✖ VERDE ✖ AMARELO', fase2: '✔ AMARELO (AZUL, AMARELO, AZUL, __) ✖ VERMELHO ✖ VERDE' },
                            { enunciado: 'QUAL IMAGEM CONTINUA? (CÍRCULO, QUADRADO, CÍRCULO, __)', objetivo: 'Identificar sequência visual repetida', fase1: '✔ QUADRADO ✖ CÍRCULO ✖ TRIÂNGULO', fase2: '✔ TRIÂNGULO ✖ QUADRADO ✖ CÍRCULO' },
                            { enunciado: 'ARRASTE NA ORDEM CORRETA. (1, 2, 3, 4)', objetivo: 'Organizar sequência numérica crescente', fase1: '✔ 1 → 2 → 3 → 4', fase2: '✔ 5 → 6 → 7 → 8' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Padrão com Variação',
                        atividades: [
                            { enunciado: 'QUAL É O NÚMERO QUE FALTA? 2,4,6,__', objetivo: 'Sequência de 2 em 2', fase1: '✔ 8 ✖ 7 ✖ 9', fase2: '✔ 12 (6,8,10,__) ✖ 11 ✖ 14' },
                            { enunciado: 'QUAL É O PRÓXIMO? TRIÂNGULO, QUADRADO, TRIÂNGULO, __', objetivo: 'Identificar padrão alternado visual', fase1: '✔ QUADRADO ✖ CÍRCULO ✖ RETÂNGULO', fase2: '✔ CÍRCULO ✖ TRIÂNGULO ✖ QUADRADO' },
                            { enunciado: 'QUAL SEQUÊNCIA ESTÁ CORRETA?', objetivo: 'Identificar padrão numérico crescente regular', fase1: '✔ 1, 3, 5, 7 ✖ 1, 3, 4, 7 ✖ 2, 4, 7, 8', fase2: '✔ 2, 4, 6, 8 ✖ 2, 5, 6, 8 ✖ 1, 2, 4, 7' },
                            { enunciado: 'QUAL É A REGRA? 5, 10, 15, __', objetivo: 'Identificar padrão aditivo simples', fase1: '✔ +5 ✖ +3 ✖ +2', fase2: '✔ +2 (2, 4, 6, __) ✖ +4 ✖ +1' },
                            { enunciado: 'COMPLETE A SEQUÊNCIA. 5, 10, 15, __', objetivo: 'Aplicar regra identificada', fase1: '✔ 20 ✖ 18 ✖ 22', fase2: '✔ 12 (2, 4, 6, 8, 10, __) ✖ 14 ✖ 9' }
                        ]
                    }
                ],
                acessibilidade: 'Elementos grandes e organizados',
                observacoes: 'Feedback imediato'
            })
        },
        {
            id: 'cap-ma-06',
            name: 'Noção de Tempo',
            subject_id: matematica.id,
            order: 6,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Organização Temporal Básica',
                        atividades: [
                            { enunciado: 'O QUE VEM ANTES DO ALMOÇO?', objetivo: 'Identificar sequência diária', fase1: '✔ TOMAR CAFÉ ✖ DORMIR ✖ BRINCAR', fase2: '✔ ESCOVAR OS DENTES ✖ JANTAR ✖ DORMIR' },
                            { enunciado: 'QUAL ACONTECE À NOITE?', objetivo: 'Identificar período do dia', fase1: '✔ DORMIR ✖ ALMOÇAR ✖ IR À ESCOLA', fase2: '✔ JANTAR ✖ BRINCAR NO PARQUE ✖ ESTUDAR' },
                            { enunciado: 'QUAL DIA VEM DEPOIS DE SEGUNDA?', objetivo: 'Sequência semanal', fase1: '✔ TERÇA ✖ QUARTA ✖ DOMINGO', fase2: '✔ QUINTA (após quarta) ✖ SEXTA ✖ SEGUNDA' },
                            { enunciado: 'O QUE DEMORA MAIS TEMPO?', objetivo: 'Comparar duração', fase1: '✔ VIAJAR ✖ COMER ✖ PISCAR', fase2: '✔ DORMIR ✖ BEBER ÁGUA ✖ PULAR' },
                            { enunciado: 'ARRASTE NA ORDEM DO DIA.', objetivo: 'Organizar rotina diária simples', fase1: '✔ ACORDAR → IR À ESCOLA → BRINCAR → DORMIR', fase2: '✔ TOMAR CAFÉ → IR À ESCOLA → ALMOÇAR → DORMIR' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Ampliação Temporal',
                        atividades: [
                            { enunciado: 'QUAL MÊS VEM DEPOIS DE JANEIRO?', objetivo: 'Reconhecer sequência dos meses', fase1: '✔ FEVEREIRO ✖ MARÇO ✖ ABRIL', fase2: '✔ ABRIL (APÓS MARÇO) ✖ MAIO ✖ JUNHO' },
                            { enunciado: 'QUAL ACONTECE PRIMEIRO? (SEQUÊNCIA: PLANTAR → COLHER → COMER)', objetivo: 'Organizar sequência lógica ampliada', fase1: '✔ PLANTAR ✖ COLHER ✖ COMER', fase2: '✔ ACORDAR ✖ BRINCAR ✖ DORMIR' },
                            { enunciado: 'QUAL É O ÚLTIMO DIA DA SEMANA?', objetivo: 'Identificar final do ciclo semanal', fase1: '✔ DOMINGO ✖ SÁBADO ✖ SEXTA', fase2: '✔ SEXTA ✖ TERÇA ✖ QUARTA' },
                            { enunciado: 'O QUE ACONTECEU ONTEM?', objetivo: 'Identificar verbo no passado simples', fase1: '✔ EU BRINQUEI. ✖ EU BRINCO. ✖ EU BRINCAR.', fase2: '✔ EU COMI. ✖ EU COMO. ✖ EU COMER.' },
                            { enunciado: 'O QUE VAI ACONTECER AMANHÃ?', objetivo: 'Identificar verbo no futuro simples', fase1: '✔ EU IREI À ESCOLA. ✖ EU FUI À ESCOLA. ✖ EU ESTOU NA ESCOLA.', fase2: '✔ EU VOU BRINCAR. ✖ EU BRINQUEI. ✖ EU BRINCO.' }
                        ]
                    }
                ],
                acessibilidade: 'Linha do tempo visual',
                observacoes: 'Rotina previsível (TEA)'
            })
        },
        {
            id: 'cap-ma-07',
            name: 'Noção de Dinheiro',
            subject_id: matematica.id,
            order: 7,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Reconhecimento',
                        atividades: [
                            { enunciado: 'QUAL É A MOEDA DE 1 REAL?', objetivo: 'Reconhecer valor', fase1: '✔ 1 REAL ✖ 50 CENTAVOS ✖ 25 CENTAVOS', fase2: '✔ 2 REAIS ✖ 1 REAL ✖ 5 REAIS' },
                            { enunciado: 'QUAL É O MAIOR VALOR?', objetivo: 'Comparar valores', fase1: '✔ 20 REAIS ✖ 10 REAIS ✖ 5 REAIS', fase2: '✔ 50 REAIS ✖ 20 REAIS ✖ 10 REAIS' },
                            { enunciado: 'QUAL É MENOR?', objetivo: 'Identificar menor valor', fase1: '✔ 10 CENTAVOS ✖ 25 ✖ 50', fase2: '✔ 5 CENTAVOS ✖ 10 ✖ 25' },
                            { enunciado: 'ARRASTE O DINHEIRO PARA O PRODUTO.', objetivo: 'Correspondência simples', fase1: '✔ 5 REAIS ✖ 2 REAIS ✖ 10 REAIS', fase2: '✔ 8 REAIS ✖ 7 REAIS ✖ 10 REAIS' },
                            { enunciado: 'QUANTAS MOEDAS DE 1 REAL FAZEM 3 REAIS?', objetivo: 'Composição simples', fase1: '✔ 3 ✖ 2 ✖ 4', fase2: '✔ 4 (para 4 reais) ✖ 3 ✖ 5' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Situação de Compra',
                        atividades: [
                            { enunciado: 'O BRINQUEDO CUSTA 8 REAIS. QUAL DINHEIRO PAGA?', objetivo: 'Resolver compra simples', fase1: '✔ 5+3 ✖ 4+2 ✖ 6+1', fase2: '✔ 10-2 ✖ 3+3 ✖ 7+2' },
                            { enunciado: 'SE VOCÊ TEM 10 REAIS E GASTA 4, QUANTO SOBRA?', objetivo: 'Subtração aplicada', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 8 (12-4) ✖ 7 ✖ 9' },
                            { enunciado: 'QUAL É O TROCO?', objetivo: 'Identificar diferença', fase1: '✔ 2 ✖ 3 ✖ 1', fase2: '✔ 4 ✖ 5 ✖ 2' },
                            { enunciado: 'QUAL PRODUTO VOCÊ PODE COMPRAR?', objetivo: 'Tomada de decisão', fase1: 'PRODUTO DE 6 REAIS ✔6 ✖ 8 ✖ 9', fase2: 'PRODUTO DE 9 REAIS ✔9 ✖ 8 ✖ 3' },
                            { enunciado: 'QUAL É A MELHOR OPÇÃO?', objetivo: 'Comparação custo-benefício', fase1: '✔ MAIS BARATO ✖ MAIS CARO', fase2: '✔ MADURO ✖ ESTRAGADO' }
                        ]
                    }
                ],
                acessibilidade: 'Imagens reais de moedas',
                observacoes: 'Cenário estruturado'
            })
        }
    ];

    // Conhecimentos Gerais
    const capitulosConhecimentos = [
        {
            id: 'cap-cg-01',
            name: 'Corpo Humano',
            subject_id: conhecimentos.id,
            order: 1,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação',
                        atividades: [
                            { enunciado: 'ONDE ESTÁ A MÃO?', objetivo: 'Identificar parte do corpo', fase1: '✔ MÃO ✖ PÉ ✖ CABEÇA', fase2: '✔ JOELHO ✖ ORELHA ✖ BRAÇO' },
                            { enunciado: 'QUAL PARTE USAMOS PARA VER?', objetivo: 'Identificar função', fase1: '✔ OLHOS ✖ BOCA ✖ PÉ', fase2: '✔ OUVIDO ✖ NARIZ ✖ MÃO' },
                            { enunciado: 'QUAL PARTE DO CORPO USAMOS PARA OUVIR?', objetivo: 'Identificar órgão relacionado ao sentido', fase1: '✔ OUVIDO ✖ OLHO ✖ BOCA', fase2: '✔ OLHO ✖ NARIZ ✖ MÃO' },
                            { enunciado: 'ARRASTE A CABEÇA PARA O LUGAR CERTO NO CORPO.', objetivo: 'Localizar parte do corpo no esquema corporal', fase1: '✔ CABEÇA ENCAIXADA NA PARTE SUPERIOR DO CORPO', fase2: '✔ MÃO ENCAIXADA NO BRAÇO' },
                            { enunciado: 'QUAL PARTE DO CORPO É MAIOR?', objetivo: 'Comparar proporção corporal simples', fase1: '✔ BRAÇO ✖ DEDO ✖ OLHO', fase2: '✔ PERNA ✖ PÉ ✖ DEDO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Função e Cuidado',
                        atividades: [
                            { enunciado: 'O QUE ACONTECE SE NÃO ESCOVAR OS DENTES?', objetivo: 'Relação cuidado → consequência', fase1: '✔ DENTE SUJO ✖ CABELO MOLHADO ✖ SAPATO SUJO', fase2: '✔ CORPO SUJO ✖ CABELO PENTEADO ✖ ROUPA DOBRADA' },
                            { enunciado: 'QUAL PARTE DO CORPO USAMOS PARA RESPIRAR?', objetivo: 'Identificar função vital simples', fase1: '✔ NARIZ ✖ MÃO ✖ PÉ', fase2: '✔ OLHO ✖ ORELHA ✖ JOELHO' },
                            { enunciado: 'QUAL É UM HÁBITO SAUDÁVEL?', objetivo: 'Reconhecer prática de autocuidado', fase1: '✔ LAVAR AS MÃOS ✖ NÃO ESCOVAR OS DENTES ✖ JOGAR LIXO NO CHÃO', fase2: '✔ COMER FRUTA ✖ COMER SÓ DOCE ✖ NÃO COMER' },
                            { enunciado: 'QUAL PARTE DO CORPO PROTEGE O CÉREBRO?', objetivo: 'Compreensão corporal básica', fase1: '✔ CRÂNIO (CABEÇA) ✖ BRAÇO ✖ PÉ', fase2: '✔ COSTELAS ✖ MÃO ✖ ORELHA' },
                            { enunciado: 'ARRASTE AS PARTES QUE FAZEM PARTE DO ROSTO.', objetivo: 'Classificação corporal visual', fase1: '✔ OLHO ✔ BOCA ✔ NARIZ ✖ JOELHO ✖ PÉ ✖ MÃO', fase2: '✔ ORELHA ✔ SOBRANCELHA ✔ QUEIXO ✖ BRAÇO ✖ PERNA ✖ OMBRO' }
                        ]
                    }
                ],
                acessibilidade: 'Ilustrações reais',
                observacoes: 'Um conceito por tela'
            })
        },
        {
            id: 'cap-cg-02',
            name: 'Animais e Plantas',
            subject_id: conhecimentos.id,
            order: 2,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação',
                        atividades: [
                            { enunciado: 'QUAL É UM ANIMAL?', objetivo: 'Identificar ser vivo', fase1: '✔ CACHORRO ✖ CADEIRA ✖ MESA', fase2: '✔ GATO ✖ LIVRO ✖ SAPATO' },
                            { enunciado: 'QUAL É UMA PLANTA?', objetivo: 'Identificar vegetal', fase1: '✔ ÁRVORE ✖ CARRO ✖ CASA', fase2: '✔ FLOR ✖ LAPIS ✖ BOLA' },
                            { enunciado: 'ONDE O PEIXE VIVE?', objetivo: 'Identificar habitat', fase1: '✔ ÁGUA ✖ ÁRVORE ✖ CÉU', fase2: '✔ LAGO ✖ DESERTO ✖ CASA' },
                            { enunciado: 'QUAL ANIMAL VOA?', objetivo: 'Identificar característica', fase1: '✔ PÁSSARO ✖ VACA ✖ GATO', fase2: '✔ BORBOLETA ✖ CAVALO ✖ CACHORRO' },
                            { enunciado: 'QUAL É SELVAGEM?', objetivo: 'Diferenciar doméstico', fase1: '✔ LEÃO ✖ CACHORRO ✖ GATO', fase2: '✔ TIGRE ✖ VACA ✖ PORCO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Função e Ciclo',
                        atividades: [
                            { enunciado: 'O QUE A PLANTA PRECISA PARA CRESCER?', objetivo: 'Identificar necessidade vital', fase1: '✔ ÁGUA ✖ BRINQUEDO ✖ LIVRO', fase2: '✔ SOL ✖ CADEIRA ✖ SAPATO' },
                            { enunciado: 'QUAL ANIMAL COME PLANTAS?', objetivo: 'Identificar alimentação (herbívoro)', fase1: '✔ VACA ✖ LEÃO ✖ TIGRE', fase2: '✔ CAVALO ✖ LOBO ✖ GATO' },
                            { enunciado: 'QUAL FAZ PARTE DO CICLO DA PLANTA?', objetivo: 'Identificar elemento do ciclo vegetal', fase1: '✔ SEMENTE ✖ CARRO ✖ LIVRO', fase2: '✔ FLOR ✖ SAPATO ✖ BOLA' },
                            { enunciado: 'QUAL ANIMAL VIVE NA FAZENDA?', objetivo: 'Identificar habitat', fase1: '✔ VACA ✖ LEÃO ✖ TIGRE', fase2: '✔ GALINHA ✖ ELEFANTE ✖ URSO' },
                            { enunciado: 'QUAL NÃO É SER VIVO?', objetivo: 'Diferenciar ser vivo/não vivo', fase1: '✔ PEDRA ✖ GATO ✖ ÁRVORE', fase2: '✔ CADEIRA ✖ CACHORRO ✖ FLOR' }
                        ]
                    }
                ],
                acessibilidade: 'Fotos reais + áudio',
                observacoes: 'Sequência concreta'
            })
        },
        {
            id: 'cap-cg-03',
            name: 'Regras Sociais',
            subject_id: conhecimentos.id,
            order: 3,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação de Comportamento',
                        atividades: [
                            { enunciado: 'QUAL É A ATITUDE CORRETA NA SALA DE AULA?', objetivo: 'Identificar comportamento adequado', fase1: '✔ LEVANTAR A MÃO PARA FALAR ✖ GRITAR ✖ CORRER NA SALA', fase2: '✔ SENTAR E USAR O COMPUTADOR COM CALMA ✖ BATER NO TECLADO ✖ CORRER ENTRE OS COMPUTADORES' },
                            { enunciado: 'O QUE VOCÊ DEVE FAZER QUANDO UM COLEGA CAI?', objetivo: 'Identificar empatia básica', fase1: '✔ AJUDAR O COLEGA ✖ RIR ✖ VIRAR AS COSTAS', fase2: '✔ CHAMAR UM ADULTO E AJUDAR ✖ RIR ✖ SAIR CORRENDO' },
                            { enunciado: 'QUAL COMPORTAMENTO ATRAPALHA A AULA?', objetivo: 'Identificar comportamento inadequado', fase1: '✔ CORRER NA SALA ✖ SENTAR CORRETAMENTE ✖ OUVIR A PROFESSORA', fase2: '✔ GRITAR DURANTE A EXPLICAÇÃO ✖ LEVANTAR A MÃO ✖ FAZER A ATIVIDADE' },
                            { enunciado: 'O QUE VOCÊ DEVE FAZER PARA FALAR?', objetivo: 'Autorregulação social básica', fase1: '✔ ESPERAR A SUA VEZ ✖ EMPURRAR ✖ GRITAR', fase2: '✔ LEVANTAR A MÃO E ESPERAR ✖ FALAR AO MESMO TEMPO QUE O COLEGA ✖ GRITAR' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Resolução Social',
                        atividades: [
                            { enunciado: 'SE ALGUÉM PEGAR SEU LÁPIS, O QUE FAZER?', objetivo: 'Resolver conflito simples', fase1: '✔ PEDIR DE VOLTA COM CALMA ✖ BATER ✖ GRITAR', fase2: '✔ FALAR: ME DEVOLVE, POR FAVOR. ✖ EMPURRAR ✖ CHORAR E SAIR' },
                            { enunciado: 'QUAL É A MELHOR ESCOLHA?', objetivo: 'Tomada de decisão social básica', fase1: '✔ COMPARTILHAR O MATERIAL ✖ ESCONDER O MATERIAL', fase2: '✔ DIVIDIR E REVEZAR ✖ PEGAR E NÃO DEVOLVER' },
                            { enunciado: 'O QUE FAZER SE ERRAR?', objetivo: 'Autorregulação emocional básica', fase1: '✔ TENTAR DE NOVO ✖ CHORAR ✖ SAIR CORRENDO', fase2: '✔ PEDIR AJUDA E TENTAR DE NOVO ✖ RASGAR A FOLHA ✖ DESISTIR' },
                            { enunciado: 'QUAL FRASE É EDUCADA?', objetivo: 'Linguagem social funcional', fase1: '✔ POR FAVOR. ✖ ME DÁ! ✖ EU QUERO!', fase2: '✔ VOCÊ PODE ME AJUDAR, POR FAVOR? ✖ FAZ ISSO AGORA! ✖ ME ENTREGA!' },
                            { enunciado: 'QUEM ESTÁ RESPEITANDO AS REGRAS?', objetivo: 'Identificar exemplo positivo', fase1: '✔ ALUNO SENTADO E OUVINDO ✖ ALUNO CORRENDO ✖ ALUNO GRITANDO', fase2: '✔ ALUNO COMPARTILHANDO O MATERIAL ✖ ALUNO EMPURRANDO ✖ ALUNO JOGANDO PAPEL NO CHÃO' }
                        ]
                    }
                ],
                acessibilidade: 'Ilustração clara',
                observacoes: '3 escolhas visuais'
            })
        },
        {
            id: 'cap-cg-04',
            name: 'Emoções',
            subject_id: conhecimentos.id,
            order: 4,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação',
                        atividades: [
                            { enunciado: 'QUAL É A EMOÇÃO DO MENINO?', objetivo: 'Identificar emoção facial básica', fase1: '✔ TRISTE ✖ FELIZ ✖ BRAVO', fase2: '✔ SURPRESO ✖ CALMO ✖ CANSADO' },
                            { enunciado: 'QUAL SITUAÇÃO DEIXA VOCÊ FELIZ?', objetivo: 'Relacionar emoção ao contexto', fase1: '✔ GANHAR ABRAÇO ✖ CAIR ✖ BRIGAR', fase2: '✔ BRINCAR COM AMIGOS ✖ PERDER O BRINQUEDO ✖ MACHUCAR O JOELHO' },
                            { enunciado: 'QUAL É UMA EMOÇÃO?', objetivo: 'Diferenciar emoção de ação ou objeto', fase1: '✔ MEDO ✖ CORRER ✖ AZUL', fase2: '✔ RAIVA ✖ PULAR ✖ CASA' },
                            { enunciado: 'QUEM ESTÁ COM RAIVA?', objetivo: 'Identificar expressão facial específica', fase1: '✔ TESTA FRANZIDA ✖ SORRINDO ✖ DORMINDO', fase2: '✔ ROSTO CHORANDO ✖ ROSTO SORRINDO ✖ ROSTO DORMINDO' },
                            { enunciado: 'QUAL É A EMOÇÃO? (imagem de criança sorrindo)', objetivo: 'Reconhecer emoção positiva', fase1: '✔ FELIZ ✖ BRAVO ✖ MEDO', fase2: '✔ TRISTE ✖ CALMO ✖ SURPRESO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Regulação',
                        atividades: [
                            { enunciado: 'O QUE FAZER QUANDO ESTÁ BRAVO?', objetivo: 'Estratégia de regulação emocional', fase1: '✔ RESPIRAR FUNDO ✖ GRITAR ✖ EMPURRAR', fase2: '✔ RESPIRAR FUNDO ✖ JOGAR O BRINQUEDO ✖ BATER NO COLEGA' },
                            { enunciado: 'QUAL É A MELHOR ESCOLHA?', objetivo: 'Tomada de decisão emocional simples', fase1: '✔ CONVERSAR ✖ BATER ✖ SAIR CORRENDO', fase2: '✔ PEDIR PARA REVEZAR ✖ EMPURRAR ✖ PEGAR À FORÇA' },
                            { enunciado: 'O QUE AJUDA A SE ACALMAR?', objetivo: 'Estratégias adaptativas básicas', fase1: '✔ CONTAR ATÉ 5 ✖ CHORAR ✖ EMPURRAR', fase2: '✔ PEDIR AJUDA ✖ GRITAR ✖ SAIR CORRENDO' },
                            { enunciado: 'QUAL FRASE É EDUCADA?', objetivo: 'Linguagem emocional funcional', fase1: '✔ DESCULPA. ✖ EU NÃO LIGO! ✖ VAI EMBORA!', fase2: '✔ POR FAVOR. ✖ ME DÁ AGORA! ✖ SAI DAQUI!' },
                            { enunciado: 'O QUE FAZER SE ESTIVER TRISTE?', objetivo: 'Estratégia positiva de enfrentamento', fase1: '✔ PEDIR AJUDA ✖ FICAR SOZINHO ✖ QUEBRAR OBJETO', fase2: '✔ FALAR COMO ESTÁ SE SENTINDO ✖ JOGAR O CONTROLE ✖ EMPURRAR O COLEGA' }
                        ]
                    }
                ],
                acessibilidade: 'Ícones expressivos',
                observacoes: 'Respiração guiada'
            })
        },
        {
            id: 'cap-cg-05',
            name: 'Localização Espacial',
            subject_id: conhecimentos.id,
            order: 5,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Posição Simples',
                        atividades: [
                            { enunciado: 'COLOQUE O LIVRO EM CIMA DA MESA.', objetivo: 'Identificar posição espacial', fase1: '✔ LIVRO EM CIMA DA MESA ✖ LIVRO EMBAIXO DA MESA ✖ LIVRO AO LADO DA MESA', fase2: '✔ EMBAIXO ✖ EM CIMA ✖ AO LADO' },
                            { enunciado: 'QUAL OBJETO ESTÁ À DIREITA DO MENINO?', objetivo: 'Lateralidade com referência fixa', fase1: '✔ BOLA À DIREITA ✖ BOLA À ESQUERDA ✖ BOLA ATRÁS', fase2: '✔ BOLA À ESQUERDA ✖ BOLA À DIREITA ✖ BOLA ATRÁS' },
                            { enunciado: 'QUAL OBJETO ESTÁ ENTRE A CADEIRA E A MESA?', objetivo: 'Identificar posição intermediária', fase1: '✔ BOLA ENTRE ✖ BOLA NA FRENTE ✖ BOLA ATRÁS', fase2: '✔ OBJETO CENTRAL ✖ OBJETO NA BORDA ✖ OBJETO FORA' },
                            { enunciado: 'QUAL OBJETO ESTÁ MAIS PERTO DO MENINO?', objetivo: 'Identificar proximidade', fase1: '✔ BOLA MAIS PERTO ✖ BOLA MAIS LONGE ✖ BOLA ATRÁS', fase2: '✔ OBJETO MAIS DISTANTE ✖ OBJETO PRÓXIMO ✖ OBJETO ATRÁS' },
                            { enunciado: 'ARRASTE O BRINQUEDO PARA DENTRO DA CAIXA.', objetivo: 'Interior / exterior', fase1: '✔ OBJETO DENTRO DA CAIXA ✖ OBJETO FORA DA CAIXA ✖ OBJETO EMBAIXO DA CAIXA', fase2: '✔ BOLA FORA DA CAIXA ✖ BOLA DENTRO ✖ BOLA EM CIMA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Orientação Dinâmica',
                        atividades: [
                            { enunciado: 'SIGA AS SETAS ATÉ A CASA.', objetivo: 'Executar sequência direcional simples', fase1: '→ → ↑ (3 comandos com percurso guiado)', fase2: '↑ → ↓ → (4 comandos sem marcação de apoio visual)' },
                            { enunciado: 'QUAL CAMINHO ESTÁ CORRETO?', objetivo: 'Identificar trajeto funcional até o destino', fase1: '✔ CAMINHO DIRETO ✖ CAMINHO BLOQUEADO ✖ CAMINHO SEM SAÍDA', fase2: '4 caminhos com obstáculos; escolher o único com saída funcional' },
                            { enunciado: 'QUAL OBJETO ESTÁ À ESQUERDA DA CADEIRA?', objetivo: 'Relacionar posição espacial (esquerda/direita)', fase1: '✔ BOLA ✖ MESA ✖ LIVRO', fase2: 'Cena modificada com mudança de referência espacial' },
                            { enunciado: 'ORGANIZE DO MAIS PERTO PARA O MAIS LONGE.', objetivo: 'Ordenar elementos segundo distância', fase1: 'Arrastar para ordem correta com apoio visual de sombra', fase2: '4 objetos sem pista de sombra' },
                            { enunciado: 'QUAL ESTÁ ATRÁS?', objetivo: 'Identificar relação espacial (frente/atrás)', fase1: '✔ ATRÁS ✖ FRENTE ✖ AO LADO', fase2: 'Nova cena com mudança de personagem e objeto de referência' }
                        ]
                    }
                ],
                acessibilidade: 'Boneco referência',
                observacoes: 'Um comando por tela'
            })
        },
        {
            id: 'cap-cg-06',
            name: 'Higiene e Saúde',
            subject_id: conhecimentos.id,
            order: 6,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação',
                        atividades: [
                            { enunciado: 'O QUE FAZER ANTES DE COMER?', objetivo: 'Identificar hábito básico de higiene', fase1: '✔ LAVAR AS MÃOS ✖ CORRER ✖ BRINCAR', fase2: '✔ LAVAR AS MÃOS ✖ BRINCAR ✖ ASSISTIR TV' },
                            { enunciado: 'QUAL É UM ALIMENTO SAUDÁVEL?', objetivo: 'Reconhecer alimento saudável cotidiano', fase1: '✔ MAÇÃ ✖ BALA ✖ REFRIGERANTE', fase2: '✔ BANANA ✖ BISCOITO RECHEADO ✖ REFRIGERANTE' },
                            { enunciado: 'QUAL OBJETO É DE HIGIENE?', objetivo: 'Reconhecer item de cuidado pessoal', fase1: '✔ SABONETE ✖ LÁPIS ✖ SAPATO', fase2: '✔ ESCOVA DE DENTE ✖ BOLA ✖ LIVRO' },
                            { enunciado: 'O QUE USAR NO FRIO?', objetivo: 'Relacionar vestuário adequado ao clima', fase1: '✔ CASACO ✖ CHINELO ✖ BONÉ DE PRAIA', fase2: '✔ CACHECOL ✖ ROUPA DE BANHO ✖ SANDÁLIA' },
                            { enunciado: 'QUAL É UM HÁBITO SAUDÁVEL?', objetivo: 'Identificar prática diária positiva', fase1: '✔ TOMAR BANHO ✖ NÃO ESCOVAR ✖ NÃO DORMIR', fase2: '✔ ESCOVAR OS DENTES ✖ NÃO LAVAR AS MÃOS ✖ FICAR ACORDADO A NOITE TODA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Sequência Funcional',
                        atividades: [
                            { enunciado: 'COLOQUE NA ORDEM DE ESCOVAR OS DENTES.', objetivo: 'Organizar sequência funcional de rotina de higiene', fase1: 'PASTA → ESCOVAR → ENXAGUAR (3 etapas)', fase2: 'PASTA → ESCOVAR → ENXAGUAR → GUARDAR ESCOVA (4 etapas)' },
                            { enunciado: 'O QUE ACONTECE SE NÃO DORMIR?', objetivo: 'Compreender relação causa-consequência', fase1: '✔ CANSADO ✖ FELIZ ✖ FORTE', fase2: '✔ SONOLENTO NA ESCOLA ✖ MUITO ENERGÉTICO ✖ MAIS ALTO' },
                            { enunciado: 'QUAL É A MELHOR ESCOLHA?', objetivo: 'Identificar decisão saudável cotidiana', fase1: '✔ BEBER ÁGUA ✖ SÓ REFRIGERANTE ✖ NÃO BEBER', fase2: '✔ COMER FRUTA ✖ COMER APENAS DOCE ✖ NÃO COMER' },
                            { enunciado: 'QUAL EVITA DOENÇA?', objetivo: 'Reconhecer ação preventiva básica', fase1: '✔ LAVAR AS MÃOS ✖ NÃO TOMAR BANHO ✖ NÃO ESCOVAR', fase2: '✔ USAR SABONETE ✖ NÃO LAVAR ✖ SUJAR AS MÃOS' },
                            { enunciado: 'QUAL É UM CUIDADO DIÁRIO?', objetivo: 'Consolidar reconhecimento de rotina saudável', fase1: '✔ DORMIR BEM ✖ NÃO COMER ✖ NÃO TOMAR BANHO', fase2: '✔ ESCOVAR OS DENTES ✖ NÃO TOMAR ÁGUA ✖ NÃO DORMIR' }
                        ]
                    }
                ],
                acessibilidade: 'Sequência visual',
                observacoes: 'Rotina fixa'
            })
        },
        {
            id: 'cap-cg-07',
            name: 'Expressão Artística',
            subject_id: conhecimentos.id,
            order: 7,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Aplicação de Critério',
                        atividades: [
                            { enunciado: 'PINTE O SOL DE AMARELO.', objetivo: 'Associar objeto à cor convencional', fase1: '✔ AMARELO ✖ AZUL ✖ VERDE', fase2: 'Pintar SOL e LUA com cores convencionais (AMARELO / BRANCO)' },
                            { enunciado: 'PINTE SOMENTE OS CÍRCULOS.', objetivo: 'Desenvolver discriminação visual entre formas geométricas básicas', fase1: '✔ CÍRCULOS ✖ QUADRADOS ✖ TRIÂNGULOS', fase2: 'Novo conjunto com 9 formas variadas mantendo regra' },
                            { enunciado: 'USE 3 CORES DIFERENTES.', objetivo: 'Ampliar variedade cromática com controle de quantidade', fase1: 'Utilizar exatamente 3 cores diferentes', fase2: 'Utilizar 4 cores diferentes sem repetição imediata' },
                            { enunciado: 'RECRIE O MODELO.', objetivo: 'Desenvolver reprodução visual simples e organização espacial', fase1: 'Reproduzir modelo com 3 elementos', fase2: 'Reproduzir modelo com 5 elementos mantendo posição relativa' },
                            { enunciado: 'COMPLETE O DESENHO.', objetivo: 'Desenvolver coordenação visomotora básica e continuidade gráfica', fase1: 'Completar 3 áreas com traçado guiado', fase2: 'Completar 5 áreas com menor espessura de guia' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Intenção Criativa',
                        atividades: [
                            { enunciado: 'CRIE UMA CENA DE DIA.', objetivo: 'Compor cena representando o período diurno com organização espacial (EF15AR01)', fase1: 'Selecionar e posicionar 3 elementos obrigatórios: SOL + CÉU + 1 ELEMENTO NATURAL', fase2: 'Organizar 5 elementos incluindo PERSONAGEM EM AÇÃO' },
                            { enunciado: 'USE CORES FRIAS.', objetivo: 'Discriminar e aplicar cores frias em composição visual simples (EF15AR04)', fase1: 'Pintar 3 áreas usando AZUL e VERDE com indicação visual', fase2: 'Pintar 5 áreas usando AZUL, VERDE e ROXO sem marcação prévia' },
                            { enunciado: 'CRIE UM PERSONAGEM.', objetivo: 'Construir personagem com organização corporal básica (EF15AR02)', fase1: 'Montar personagem com 4 peças usando modelo visual', fase2: 'Montar personagem completo com 6 peças sem modelo' },
                            { enunciado: 'ORGANIZE DO CLARO PARA O ESCURO.', objetivo: 'Desenvolver percepção visual de gradação tonal (EF15AR04)', fase1: 'Organizar corretamente 4 tons com pista visual lateral', fase2: 'Organizar 5 tons sem pista visual' }
                        ]
                    }
                ],
                acessibilidade: 'Paleta limitada',
                observacoes: 'Evitar excesso de estímulo'
            })
        },
        {
            id: 'cap-cg-08',
            name: 'Jogos Simbólicos',
            subject_id: conhecimentos.id,
            order: 8,
            content: JSON.stringify({
                etapa: '1º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Sequência Funcional',
                        atividades: [
                            { enunciado: 'AJUDE O PERSONAGEM A IR À ESCOLA.', objetivo: 'Planejamento funcional básico', fase1: '✔ PEGAR MOCHILA → VESTIR CASACO → IR ATÉ A PORTA ✖ IR PARA A CAMA ✖ PEGAR A BOLA', fase2: 'PIJAMA → ESCOVAR DENTES → DEITAR NA CAMA' },
                            { enunciado: 'RESOLVA O PROBLEMA: O BRINQUEDO QUEBROU.', objetivo: 'Escolher solução funcional', fase1: '✔ PEDIR AJUDA AO ADULTO ✖ CHORAR E GRITAR ✖ JOGAR O BRINQUEDO NO LIXO', fase2: 'APONTAR O LÁPIS OU PEDIR AJUDA' },
                            { enunciado: 'ESCOLHA A FALA CORRETA PARA BRINCAR.', objetivo: 'Linguagem social funcional', fase1: '✔ POSSO BRINCAR? ✖ SAI DAQUI! ✖ NÃO É MEU!', fase2: '✔ VOCÊ PODE ME EMPRESTAR, POR FAVOR?' },
                            { enunciado: 'ORGANIZE AS CENAS PARA FORMAR A HISTÓRIA.', objetivo: 'Sequência simbólica simples', fase1: '✔ PLANTAR → CRESCER → COLHER ✖ COLHER → PLANTAR → CRESCER', fase2: 'ACORDAR → ESCOVAR DENTES → TOMAR CAFÉ' },
                            { enunciado: 'ESCOLHA O LUGAR CERTO PARA A AÇÃO.', objetivo: 'Coerência simbólica contextual', fase1: '✔ PARQUE ✖ COZINHA ✖ BANHEIRO', fase2: '✔ BANHEIRO (tomar banho)' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Organização Narrativa',
                        atividades: [
                            { enunciado: 'ORGANIZE AS IMAGENS PARA FORMAR UMA HISTÓRIA COM INÍCIO, MEIO E FIM.', objetivo: 'Organização narrativa simples', fase1: '✔ ORDEM: CAI → AJUDA → SORRI ✖ SORRI → CAI → AJUDA ✖ AJUDA → CAI → SORRI', fase2: '4 cenas: plantar → regar → crescer → colher' },
                            { enunciado: 'QUAL É O FINAL MAIS ADEQUADO PARA A HISTÓRIA?', objetivo: 'Escolher desfecho coerente', fase1: '✔ O MENINO PEDIU DESCULPA E BRINCOU NOVAMENTE ✖ O MENINO VOOU ✖ FIM SEM RESOLVER O PROBLEMA', fase2: 'Nova história: brinquedo quebrou → PEDIU AJUDA PARA CONSERTAR' },
                            { enunciado: 'QUAL PERSONAGEM AJUDOU NA HISTÓRIA?', objetivo: 'Identificar papel social', fase1: '✔ O AMIGO QUE LEVANTOU O MENINO ✖ A BOLA ✖ O CACHORRO PARADO', fase2: '"QUEM RESOLVEU O PROBLEMA?"' },
                            { enunciado: 'QUAL É A MELHOR SOLUÇÃO PARA O PROBLEMA?', objetivo: 'Estratégia social funcional', fase1: '✔ CONVERSAR E RESOLVER ✖ EMPURRAR ✖ IGNORAR E SAIR', fase2: '✔ PEDIR DE VOLTA COM CALMA (colega pegou brinquedo)' },
                            { enunciado: 'MONTE O CENÁRIO CORRETO PARA A HISTÓRIA.', objetivo: 'Organização simbólica coerente', fase1: '✔ ESCOVA ✔ CAMA ✔ PRATO ✖ BOLA ✖ PANELA ✖ LIVRO', fase2: '✔ bola, banco, árvore (parque)' }
                        ]
                    }
                ],
                acessibilidade: 'Roteiro opcional',
                observacoes: 'Modelo fixo para DI'
            })
        }
    ];

    // Inserir todos os capítulos
    const todosCapitulos = [...capitulosPortugues, ...capitulosMatematica, ...capitulosConhecimentos];
    for (const cap of todosCapitulos) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: {},
            create: cap
        });
    }

    console.log(`✅ ${todosCapitulos.length} pílulas criadas (5 Português + 7 Matemática + 8 Conhecimentos Gerais)`);

    // ─── 3. BNCC ──────────────────────────────────────────────────────────────
    console.log('📋 Criando competências BNCC...');

    const bnccData = [
        // PORTUGUÊS
        {
            id: 'bncc-EF01LP01',
            code: 'EF01LP01',
            title: 'Apropriação do sistema de escrita',
            description: 'Nível 1 (Base): Identificar letras do alfabeto. Nível 2 (Ampliação): Relacionar letra ao som inicial. Acessibilidade: Áudio das letras + destaque visual. Comportamento: Identificar fonemas e grafemas, reconhecer letras em diferentes posições na palavra, associar grafema ao fonema inicial e final.',
            stage: '1º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF01LP02',
            code: 'EF01LP02',
            title: 'Construção da escrita',
            description: 'Nível 1 (Base): Montar palavras com apoio visual. Nível 2 (Ampliação): Escrever palavras simples. Acessibilidade: Letras móveis ampliadas. Comportamento: Compor palavras com sílabas simples, identificar sílabas iniciais, mediais e finais, reconhecer estrutura silábica básica (CV).',
            stage: '1º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF01LP05',
            code: 'EF01LP05',
            title: 'Fluência inicial de leitura',
            description: 'Nível 1 (Base): Ler frases curtas com apoio. Nível 2 (Ampliação): Compreender frase sem imagem. Acessibilidade: Texto narrado + pictograma opcional. Comportamento: Ler frases simples com apoio visual, identificar palavras dentro da frase, compreender o sentido global de enunciados curtos.',
            stage: '1º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF01LP07',
            code: 'EF01LP07',
            title: 'Produção textual inicial',
            description: 'Nível 1 (Base): Completar frase com palavra. Nível 2 (Ampliação): Criar frase simples. Acessibilidade: Modelo estrutural visível. Comportamento: Construir frases com estrutura Sujeito+Verbo+Complemento, escolher palavras adequadas ao contexto, ampliar frases com adjetivos e verbos.',
            stage: '1º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF01LP08',
            code: 'EF01LP08',
            title: 'Organização textual e sequência narrativa',
            description: 'Nível 1 (Base): Ordenar 3 cenas. Nível 2 (Ampliação): Produzir início-meio-fim. Acessibilidade: Imagens ampliadas. Comportamento: Organizar sequência narrativa linear, identificar começo, meio e fim de uma história, reconhecer relações de causa e consequência em narrativas simples.',
            stage: '1º Ano',
            subject: 'Português'
        },
        // MATEMÁTICA
        {
            id: 'bncc-EF01MA01',
            code: 'EF01MA01',
            title: 'Sistema decimal inicial – contagem e numeração',
            description: 'Nível 1 (Base): Reconhecer números até 20. Nível 2 (Ampliação): Representar quantidade. Acessibilidade: Blocos concretos digitais. Comportamento: Contar objetos, identificar números em sequência crescente e decrescente, comparar quantidades, reconhecer dezenas e unidades, decompor números simples.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA06',
            code: 'EF01MA06',
            title: 'Operações básicas – adição',
            description: 'Nível 1 (Base): Somar com apoio visual. Nível 2 (Ampliação): Resolver adição até 20. Acessibilidade: Material dourado virtual. Comportamento: Realizar somas concretas com objetos, resolver adições numéricas até 20, identificar complementos, resolver problemas simples de adição com apoio textual e visual.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA07',
            code: 'EF01MA07',
            title: 'Operações básicas – subtração',
            description: 'Nível 1 (Base): Retirar com objetos. Nível 2 (Ampliação): Resolver subtração até 20. Acessibilidade: Representação concreta. Comportamento: Realizar subtrações concretas com representação visual, resolver operações de subtração até 20, identificar complementos, aplicar subtração em contextos de problemas.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA08',
            code: 'EF01MA08',
            title: 'Resolução de problemas matemáticos simples',
            description: 'Nível 1 (Base): Identificar dados no enunciado. Nível 2 (Ampliação): Escolher operação correta. Acessibilidade: Texto reduzido + áudio. Comportamento: Interpretar enunciados matemáticos simples, identificar dados relevantes, escolher operação adequada (adição ou subtração), resolver problemas de duas etapas.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA10',
            code: 'EF01MA10',
            title: 'Raciocínio lógico e sequências',
            description: 'Nível 1 (Base): Completar padrão simples. Nível 2 (Ampliação): Criar sequência própria. Acessibilidade: Elementos grandes e organizados. Comportamento: Identificar e dar continuidade a padrões numéricos e visuais, reconhecer regras de sequências simples, aplicar raciocínio lógico para completar e criar padrões.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA16',
            code: 'EF01MA16',
            title: 'Grandezas e medidas – noção de tempo',
            description: 'Nível 1 (Base): Identificar dia/noite. Nível 2 (Ampliação): Organizar rotina semanal. Acessibilidade: Linha do tempo visual. Comportamento: Identificar períodos do dia, sequenciar dias da semana e meses do ano, comparar durações, reconhecer verbos no passado e futuro em contexto temporal.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF01MA19',
            code: 'EF01MA19',
            title: 'Educação financeira inicial – noção de dinheiro',
            description: 'Nível 1 (Base): Reconhecer moedas. Nível 2 (Ampliação): Simular compra simples. Acessibilidade: Imagens reais de moedas. Comportamento: Identificar cédulas e moedas brasileiras, comparar valores monetários, resolver situações simples de compra e troco, tomar decisões de custo-benefício.',
            stage: '1º Ano',
            subject: 'Matemática'
        },
        // CONHECIMENTOS GERAIS
        {
            id: 'bncc-EF01CI01',
            code: 'EF01CI01',
            title: 'Ciências da Natureza – corpo humano',
            description: 'Nível 1 (Base): Identificar partes do corpo. Nível 2 (Ampliação): Relacionar função básica. Acessibilidade: Ilustrações reais. Comportamento: Reconhecer e nomear partes do corpo humano, identificar funções dos órgãos dos sentidos, compreender hábitos saudáveis e relações de cuidado corporal.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01CI03',
            code: 'EF01CI03',
            title: 'Autocuidado e hábitos saudáveis',
            description: 'Nível 1 (Base): Identificar hábitos. Nível 2 (Ampliação): Relacionar higiene e saúde. Acessibilidade: Sequência visual. Comportamento: Reconhecer hábitos de higiene pessoal, identificar alimentos saudáveis, compreender relações causa-consequência em cuidados de saúde, organizar sequências funcionais de rotina.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01CI04',
            code: 'EF01CI04',
            title: 'Ciências – animais e plantas',
            description: 'Nível 1 (Base): Classificar por grupo. Nível 2 (Ampliação): Identificar habitat. Acessibilidade: Fotos reais + áudio. Comportamento: Identificar e classificar animais e plantas, reconhecer habitats, diferenciar seres vivos de não vivos, compreender necessidades vitais dos seres vivos.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01HI04',
            code: 'EF01HI04',
            title: 'Convivência e regras sociais',
            description: 'Nível 1 (Base): Identificar regra simples. Nível 2 (Ampliação): Escolher atitude adequada. Acessibilidade: Ilustração clara. Comportamento: Reconhecer comportamentos adequados em diferentes contextos sociais, identificar empatia, resolver conflitos simples, utilizar linguagem social funcional e respeitar regras de convivência.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01HI05',
            code: 'EF01HI05',
            title: 'Educação socioemocional – emoções',
            description: 'Nível 1 (Base): Nomear emoção. Nível 2 (Ampliação): Escolher estratégia simples. Acessibilidade: Ícones expressivos. Comportamento: Identificar e nomear emoções básicas, associar emoções a situações contextuais, aplicar estratégias de regulação emocional, desenvolver comunicação emocional funcional.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01GE03',
            code: 'EF01GE03',
            title: 'Geografia inicial – localização espacial',
            description: 'Nível 1 (Base): Direita/esquerda. Nível 2 (Ampliação): Interpretar mapa simples. Acessibilidade: Boneco referência. Comportamento: Identificar posições espaciais (em cima, embaixo, ao lado, dentro, fora, direita, esquerda), executar sequências direcionais, interpretar trajetos simples e organizar elementos por proximidade.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01AR01',
            code: 'EF01AR01',
            title: 'Artes – expressão artística visual',
            description: 'Nível 1 (Base): Pintar com intenção. Nível 2 (Ampliação): Criar cena temática. Acessibilidade: Paleta limitada. Comportamento: Associar cores a objetos, discriminar formas geométricas, utilizar critérios cromáticos, compor cenas com organização espacial, desenvolver coordenação visomotora e intenção criativa.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF01AR04',
            code: 'EF01AR04',
            title: 'Imaginação estruturada e jogos simbólicos',
            description: 'Nível 1 (Base): Criar história guiada. Nível 2 (Ampliação): Resolver conflito fictício. Acessibilidade: Roteiro opcional. Comportamento: Organizar sequências narrativas simbólicas, identificar papéis sociais em histórias, escolher soluções funcionais para problemas fictícios, desenvolver pensamento causal e criatividade estruturada.',
            stage: '1º Ano',
            subject: 'Conhecimentos Gerais'
        }
    ];

    for (const bncc of bnccData) {
        await prisma.bnccCompetence.upsert({
            where: { code: bncc.code },
            update: {
                title: bncc.title,
                description: bncc.description,
                stage: bncc.stage,
                subject: bncc.subject
            },
            create: bncc
        });
    }

    console.log(`✅ ${bnccData.length} competências BNCC criadas`);
    console.log('');
    console.log('🎉 Seed do 1º Ano concluído com sucesso!');
    console.log('   📚 3 disciplinas: Português, Matemática, Conhecimentos Gerais');
    console.log('   💊 20 pílulas: 5 (PT) + 7 (MA) + 8 (CG)');
    console.log('   📋 20 competências BNCC: EF01LP01~08, EF01MA01~19, EF01CI01~04, EF01HI04~05, EF01GE03, EF01AR01~04');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
