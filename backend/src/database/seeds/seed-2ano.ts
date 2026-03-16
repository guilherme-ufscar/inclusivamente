import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seed do 2º Ano...');

    // IDs das disciplinas já criadas no seed-1ano.ts
    const portuguesId = 'subject-portugues-1ano';
    const matematicaId = 'subject-matematica-1ano';
    const conhecimentosId = 'subject-conhecimentos-1ano';

    // ─── PÍLULAS – PORTUGUÊS ──────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 2º Ano – Português...');

    const capitulosPortugues2 = [
        {
            id: 'cap-pt2-01',
            name: 'Leitura de Texto Curto',
            subject_id: portuguesId,
            order: 6,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Localização Literal',
                        atividades: [
                            { enunciado: 'LEIA O TEXTO E TOQUE NO PERSONAGEM. TEXTO: "ANA FOI AO PARQUE. ELA LEVOU SUA BOLA."', objetivo: 'Localizar informação explícita', fase1: '✔ ANA ✖ PARQUE ✖ BOLA', fase2: '✔ JOÃO ✖ ESCOLA ✖ LIVRO' },
                            { enunciado: 'ONDE ANA FOI?', objetivo: 'Identificar local explícito', fase1: '✔ PARQUE ✖ CASA ✖ ESCOLA', fase2: '✔ PRAIA ✖ MERCADO ✖ CINEMA' },
                            { enunciado: 'O QUE ELA LEVOU?', objetivo: 'Identificar objeto citado', fase1: '✔ BOLA ✖ BONÉ ✖ SAPATO', fase2: '✔ MOCHILA ✖ CANETA ✖ CHAPÉU' },
                            { enunciado: 'QUAL FRASE APARECE NO TEXTO?', objetivo: 'Discriminar frase presente', fase1: '✔ ELA LEVOU SUA BOLA ✖ ELA COMPROU UMA BOLA ✖ ELA PERDEU A BOLA', fase2: '✔ ELE FOI AO MERCADO ✖ ELE VIAJOU ✖ ELE NADOU' },
                            { enunciado: 'QUEM APARECE NA HISTÓRIA?', objetivo: 'Identificar personagem', fase1: '✔ ANA ✖ MARIA ✖ PAULA', fase2: '✔ PEDRO ✖ JOÃO ✖ LUCAS' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Inferência Básica',
                        atividades: [
                            { enunciado: 'POR QUE ANA FOI AO PARQUE?', objetivo: 'Inferência simples', fase1: '✔ PARA BRINCAR ✖ PARA DORMIR ✖ PARA ESTUDAR', fase2: '✔ PARA PASSEAR ✖ PARA CHORAR ✖ PARA TRABALHAR' },
                            { enunciado: 'O QUE PODE ACONTECER DEPOIS?', objetivo: 'Antecipar desfecho', fase1: '✔ ELA BRINCOU ✖ ELA DORMIU ✖ ELA CAIU', fase2: '✔ ELE JOGOU BOLA ✖ ELE SAIU ✖ ELE GRITOU' },
                            { enunciado: 'QUAL É A IDEIA PRINCIPAL?', objetivo: 'Identificar tema central', fase1: '✔ ANA FOI AO PARQUE ✖ ANA PERDEU A BOLA ✖ ANA VIAJOU', fase2: '✔ PEDRO FOI À PRAIA ✖ PEDRO DORMIU ✖ PEDRO ESTUDOU' },
                            { enunciado: 'QUAL PALAVRA TEM O MESMO SENTIDO DE PASSEAR?', objetivo: 'Trabalhar sinonímia simples', fase1: '✔ BRINCAR ✖ ESTUDAR ✖ CHORAR', fase2: '✔ CAMINHAR ✖ CORRER ✖ GRITAR' },
                            { enunciado: 'QUAL É O TÍTULO MAIS ADEQUADO?', objetivo: 'Escolher título coerente', fase1: '✔ UM DIA NO PARQUE ✖ A ESCOLA ✖ O MERCADO', fase2: '✔ UMA TARDE NA PRAIA ✖ O LIVRO ✖ A SALA' }
                        ]
                    }
                ],
                acessibilidade: 'Texto narrado',
                observacoes: 'Perguntas literais'
            })
        },
        {
            id: 'cap-pt2-02',
            name: 'Produção Textual',
            subject_id: portuguesId,
            order: 7,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Construção Guiada',
                        atividades: [
                            { enunciado: 'ORGANIZE AS PALAVRAS PARA FORMAR UMA FRASE.', objetivo: 'Construir frase simples', fase1: 'ANA / BRINCA / PARQUE', fase2: 'ANA / LÊ / LIVRO' },
                            { enunciado: 'COMPLETE A FRASE: O MENINO ESTÁ ____', objetivo: 'Construir frase funcional', fase1: '✔ CORRENDO ✖ MESA ✖ AZUL', fase2: '✔ ESTUDANDO ✖ LIVRO ✖ BONITO' },
                            { enunciado: 'ESCOLHA A FRASE CORRETA.', objetivo: 'Reconhecer frase estruturada', fase1: '✔ A MENINA PULA CORDA ✖ MENINA PULA ✖ PULA CORDA MENINA', fase2: '✔ O CACHORRO CORRE ✖ CACHORRO O CORRE ✖ CORRE O CACHORRO' },
                            { enunciado: 'QUAL FRASE DESCREVE A IMAGEM?', objetivo: 'Produzir frase coerente', fase1: '✔ O MENINO COME MAÇÃ ✖ O MENINO DORME ✖ O MENINO NADA', fase2: '✔ A MENINA LÊ ✖ A MENINA CORRE ✖ A MENINA CAI' },
                            { enunciado: 'ESCOLHA A MELHOR FRASE.', objetivo: 'Selecionar frase completa', fase1: '✔ EU GOSTO DE BRINCAR ✖ GOSTO BRINCAR ✖ EU BRINCAR', fase2: '✔ EU VOU À ESCOLA ✖ EU IR ESCOLA ✖ IR ESCOLA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Expansão Textual',
                        atividades: [
                            { enunciado: 'ESCREVA UMA FRASE SOBRE A IMAGEM.', objetivo: 'Produção guiada', fase1: 'Frase com sujeito e verbo', fase2: 'Frase com complemento' },
                            { enunciado: 'COMPLETE O TEXTO: O MENINO FOI AO ____ E COMPROU ____', objetivo: 'Completar texto curto', fase1: '✔ MERCADO / PÃO', fase2: '✔ PARQUE / BOLA' },
                            { enunciado: 'QUAL FRASE TEM MAIS INFORMAÇÃO?', objetivo: 'Comparar produção', fase1: '✔ ANA FOI AO PARQUE À TARDE ✖ ANA FOI', fase2: '✔ PEDRO JOGOU BOLA NO CAMPO ✖ PEDRO JOGOU' },
                            { enunciado: 'ORGANIZE O TEXTO NA ORDEM CORRETA.', objetivo: 'Sequência textual', fase1: 'Ordem correta (3 frases embaralhadas)', fase2: 'Novo conjunto' },
                            { enunciado: 'ESCOLHA O FINAL ADEQUADO.', objetivo: 'Completar narrativa', fase1: '✔ E ELE FICOU FELIZ ✖ ELE CAIU ✖ ELE SUMIU', fase2: '✔ ELA BRINCOU COM OS AMIGOS ✖ ELA CHOROU ✖ ELA DORMIU' }
                        ]
                    }
                ],
                acessibilidade: 'Modelo estruturado',
                observacoes: 'Frase-modelo visível'
            })
        },
        {
            id: 'cap-pt2-03',
            name: 'Ortografia Básica',
            subject_id: portuguesId,
            order: 8,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Discriminação Ortográfica',
                        atividades: [
                            { enunciado: 'QUAL É A PALAVRA CORRETA?', objetivo: 'Identificar grafia correta', fase1: '✔ CASA ✖ CAZA ✖ CASSA', fase2: '✔ BOLA ✖ BOLLA ✖ BOLÁ' },
                            { enunciado: 'COMPLETE COM S OU Z: CA__A', objetivo: 'Aplicar regra simples', fase1: '✔ CASA ✖ CAZA ✖ CAXA', fase2: '✔ MESA ✖ MEZA ✖ MEXA' },
                            { enunciado: 'QUAL PALAVRA COMEÇA COM CH?', objetivo: 'Identificar dígrafo', fase1: '✔ CHUVA ✖ XUVA ✖ JUVA', fase2: '✔ CHAVE ✖ XAVE ✖ CAVE' },
                            { enunciado: 'ESCOLHA A PALAVRA COM LH.', objetivo: 'Identificar grupo consonantal', fase1: '✔ FILHO ✖ FIO ✖ FILO', fase2: '✔ OLHO ✖ OIO ✖ OLO' },
                            { enunciado: 'QUAL PALAVRA ESTÁ ESCRITA ERRADA?', objetivo: 'Reconhecer erro', fase1: '✔ BOLSA ✖ BOLÇA ✖ BOLZA', fase2: '✔ MESA ✖ MEZA ✖ MESSA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Aplicação Contextual',
                        atividades: [
                            { enunciado: 'CORRIJA A PALAVRA: CAZA', objetivo: 'Produzir grafia correta', fase1: 'CASA', fase2: 'BOLA (novo erro)' },
                            { enunciado: 'QUAL FRASE ESTÁ CORRETA?', objetivo: 'Aplicar ortografia em frase', fase1: '✔ A CASA É GRANDE ✖ A CAZA É GRANDE ✖ A CASSA É GRANDE', fase2: '✔ O FILHO BRINCA ✖ O FILO BRINCA ✖ O FIO BRINCA' },
                            { enunciado: 'COMPLETE COM LH OU LI.', objetivo: 'Aplicar regra contextual', fase1: 'FI__O → ✔ FILHO ✖ FIO ✖ FILO', fase2: 'MI__O → ✔ MILHO ✖ MIO ✖ MILO' },
                            { enunciado: 'QUAL PALAVRA TEM SOM DE /Z/?', objetivo: 'Identificar som medial', fase1: '✔ CASA ✖ CATA ✖ CADA', fase2: '✔ ROSE ✖ ROCE ✖ ROCE' },
                            { enunciado: 'ESCOLHA A FORMA CORRETA.', objetivo: 'Generalizar regra', fase1: '✔ CHAVE ✖ XAVE ✖ CAVE', fase2: '✔ FILHO ✖ FIO ✖ FILO' }
                        ]
                    }
                ],
                acessibilidade: 'Destaque visual',
                observacoes: 'DI: regra por vez'
            })
        },
        {
            id: 'cap-pt2-04',
            name: 'Interpretação de Texto',
            subject_id: portuguesId,
            order: 9,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Compreensão Literal',
                        atividades: [
                            { enunciado: 'LEIA E RESPONDA: QUEM TEM UM CACHORRO? TEXTO: "JOÃO TEM UM CACHORRO. ELE GOSTA DE BRINCAR."', objetivo: 'Localizar informação explícita', fase1: '✔ JOÃO ✖ CACHORRO ✖ BRINCAR', fase2: '✔ MARIA ✖ ESCOLA ✖ AMIGO' },
                            { enunciado: 'DO QUE JOÃO GOSTA?', objetivo: 'Identificar informação direta', fase1: '✔ BRINCAR ✖ DORMIR ✖ ESTUDAR', fase2: '✔ CORRER ✖ NADAR ✖ LER' },
                            { enunciado: 'QUAL FRASE ESTÁ NO TEXTO?', objetivo: 'Discriminar frase presente', fase1: '✔ ELE GOSTA DE BRINCAR ✖ ELE TEM UM GATO ✖ ELE FOI À PRAIA', fase2: '✔ JOÃO TEM UM CACHORRO ✖ JOÃO TEM UM PEIXE ✖ JOÃO TEM UM PATO' },
                            { enunciado: 'QUEM É O PERSONAGEM?', objetivo: 'Identificar personagem', fase1: '✔ JOÃO ✖ ESCOLA ✖ PRAÇA', fase2: '✔ MARIA ✖ PRAIA ✖ LIVRO' },
                            { enunciado: 'O TEXTO FALA SOBRE O QUÊ?', objetivo: 'Identificar tema central', fase1: '✔ UM MENINO E SEU CACHORRO ✖ UMA ESCOLA ✖ UMA PRAIA', fase2: '✔ UMA CASA ✖ UM MERCADO ✖ UMA LOJA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Inferência e Síntese',
                        atividades: [
                            { enunciado: 'POR QUE JOÃO GOSTA DO CACHORRO?', objetivo: 'Inferência simples', fase1: '✔ PORQUE BRINCA COM ELE ✖ PORQUE DORME ✖ PORQUE COME', fase2: '✔ PORQUE CORRE ✖ PORQUE ESTUDA ✖ PORQUE LÊ' },
                            { enunciado: 'O QUE PODE ACONTECER DEPOIS?', objetivo: 'Antecipar sequência', fase1: '✔ ELES BRINCARAM ✖ ELE DORMIU ✖ ELE VIAJOU', fase2: '✔ ELE CORREU ✖ ELE SUMIU ✖ ELE GRITOU' },
                            { enunciado: 'QUAL É A IDEIA PRINCIPAL?', objetivo: 'Identificar ideia central', fase1: '✔ JOÃO GOSTA DE SEU CACHORRO ✖ JOÃO FOI À ESCOLA ✖ JOÃO DORMIU', fase2: '✔ JOÃO VIAJOU ✖ JOÃO ESTUDOU ✖ JOÃO CHOROU' },
                            { enunciado: 'QUAL PALAVRA TEM O MESMO SENTIDO DE GOSTA?', objetivo: 'Trabalhar sinonímia', fase1: '✔ APRECIA ✖ ODEIA ✖ IGNORA', fase2: '✔ AMA ✖ CORRE ✖ PULA' },
                            { enunciado: 'QUAL TÍTULO É MAIS ADEQUADO?', objetivo: 'Escolher título coerente', fase1: '✔ JOÃO E SEU CACHORRO ✖ A ESCOLA ✖ O MERCADO', fase2: '✔ UM DIA NA PRAIA ✖ O LIVRO ✖ O CINEMA' }
                        ]
                    }
                ],
                acessibilidade: 'Texto narrado + destaque visual',
                observacoes: 'Pergunta literal antes da inferência'
            })
        },
        {
            id: 'cap-pt2-05',
            name: 'Produção de Bilhete',
            subject_id: portuguesId,
            order: 10,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Estrutura Básica',
                        atividades: [
                            { enunciado: 'QUAL É A FORMA CORRETA DE INICIAR UM BILHETE?', objetivo: 'Identificar estrutura inicial', fase1: '✔ OLÁ, MAMÃE ✖ MAMÃE OLÁ ✖ EU MAMÃE', fase2: '✔ QUERIDO AMIGO ✖ AMIGO QUERIDO ✖ EU AMIGO' },
                            { enunciado: 'QUAL É A DESPEDIDA CORRETA?', objetivo: 'Identificar fechamento', fase1: '✔ BEIJOS ✖ FIM ✖ TCHAU EU', fase2: '✔ ATÉ LOGO ✖ ACABOU ✖ FIM DE TUDO' },
                            { enunciado: 'QUAL FRASE PODE ESTAR EM UM BILHETE?', objetivo: 'Reconhecer linguagem adequada', fase1: '✔ VOLTO ÀS 18H ✖ ERA UMA VEZ ✖ O SOL NASCEU', fase2: '✔ ESTOU NA ESCOLA ✖ ERA UMA FLORESTA ✖ ERA UM REI' },
                            { enunciado: 'ORGANIZE AS PARTES DO BILHETE.', objetivo: 'Sequenciar estrutura', fase1: 'SAUDAÇÃO → MENSAGEM → DESPEDIDA', fase2: 'Novo conjunto' },
                            { enunciado: 'QUAL É O DESTINATÁRIO?', objetivo: 'Identificar para quem é o bilhete', fase1: '✔ MAMÃE ✖ GATO ✖ CARRO', fase2: '✔ PROFESSOR ✖ ÁRVORE ✖ RIO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Produção Funcional',
                        atividades: [
                            { enunciado: 'COMPLETE O BILHETE.', objetivo: 'Produção guiada', fase1: 'Preencher mensagem simples', fase2: 'Novo tema' },
                            { enunciado: 'QUAL É O OBJETIVO DO BILHETE?', objetivo: 'Identificar finalidade', fase1: '✔ INFORMAR ✖ CONTAR HISTÓRIA ✖ INVENTAR', fase2: '✔ AVISAR ✖ DESCREVER FILME ✖ CRIAR POEMA' },
                            { enunciado: 'QUAL FRASE É MAIS ADEQUADA?', objetivo: 'Escolher frase objetiva', fase1: '✔ ESTOU NA CASA DA VOVÓ ✖ ERA UMA VEZ ✖ O SOL NASCEU', fase2: '✔ CHEGO ÀS 17H ✖ ERA UMA FLORESTA ✖ UM DRAGÃO' },
                            { enunciado: 'REESCREVA O BILHETE DE FORMA CLARA.', objetivo: 'Revisar estrutura', fase1: 'Frase organizada', fase2: 'Novo conjunto' },
                            { enunciado: 'QUAL É A ORDEM CORRETA?', objetivo: 'Organizar texto completo', fase1: 'Ordem correta (3 partes embaralhadas)', fase2: 'Novo conjunto' }
                        ]
                    }
                ],
                acessibilidade: 'Estrutura-modelo fixa',
                observacoes: 'Frases guiadas'
            })
        },
        {
            id: 'cap-pt2-06',
            name: 'Pontuação Básica',
            subject_id: portuguesId,
            order: 11,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Reconhecimento de Sinais',
                        atividades: [
                            { enunciado: 'QUAL SINAL TERMINA A FRASE? FRASE: ANA FOI AO PARQUE', objetivo: 'Identificar ponto final', fase1: '✔ . ✖ , ✖ ?', fase2: '✔ . ✖ ! ✖ ,' },
                            { enunciado: 'QUAL FRASE É UMA PERGUNTA?', objetivo: 'Diferenciar interrogativa', fase1: '✔ VOCÊ VAI? ✖ VOCÊ VAI. ✖ VOCÊ VAI!', fase2: '✔ ONDE ESTÁ? ✖ ELE ESTÁ. ✖ ELE ESTÁ!' },
                            { enunciado: 'QUAL FRASE EXPRESSA SURPRESA?', objetivo: 'Reconhecer exclamação', fase1: '✔ QUE LEGAL! ✖ QUE LEGAL. ✖ QUE LEGAL?', fase2: '✔ QUE SUSTO! ✖ QUE SUSTO. ✖ QUE SUSTO?' },
                            { enunciado: 'COLOQUE O PONTO FINAL.', objetivo: 'Aplicar ponto final', fase1: 'ANA CHEGOU .', fase2: 'Novo conjunto' },
                            { enunciado: 'QUAL FRASE ESTÁ CORRETA?', objetivo: 'Discriminar pontuação adequada', fase1: '✔ ELE BRINCOU. ✖ ELE BRINCOU ✖ ELE BRINCOU,', fase2: '✔ ELA CHEGOU. ✖ ELA CHEGOU ✖ ELA CHEGOU,' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Aplicação Contextual',
                        atividades: [
                            { enunciado: 'QUAL SINAL DEVE SER USADO? FRASE: ONDE VOCÊ ESTÁ', objetivo: 'Selecionar pontuação adequada', fase1: '✔ ? ✖ . ✖ !', fase2: '✔ ? ✖ , ✖ .' },
                            { enunciado: 'REESCREVA COM PONTUAÇÃO CORRETA.', objetivo: 'Aplicar múltiplos sinais', fase1: 'Frase corrigida', fase2: 'Novo conjunto' },
                            { enunciado: 'QUAL FRASE ESTÁ CORRETA?', objetivo: 'Comparar frases', fase1: '✔ QUE DIA LINDO! ✖ QUE DIA LINDO ✖ QUE DIA LINDO?', fase2: '✔ VOCÊ VEM? ✖ VOCÊ VEM ✖ VOCÊ VEM!' },
                            { enunciado: 'ESCOLHA A FRASE CORRETA.', objetivo: 'Identificar erro textual', fase1: '✔ ELE CHEGOU CEDO. ✖ ELE CHEGOU CEDO ✖ ELE CHEGOU CEDO!', fase2: '✔ ELA PERGUNTOU? ✖ ELA PERGUNTOU. ✖ ELA PERGUNTOU!' },
                            { enunciado: 'ORGANIZE A FRASE COM PONTUAÇÃO.', objetivo: 'Aplicar pontuação completa', fase1: 'Frase correta (palavras embaralhadas)', fase2: 'Novo conjunto' }
                        ]
                    }
                ],
                acessibilidade: 'Destaque colorido na pontuação',
                observacoes: 'Um conceito por atividade'
            })
        }
    ];

    // ─── PÍLULAS – MATEMÁTICA 2º ANO ─────────────────────────────────────────
    console.log('💊 Criando pílulas do 2º Ano – Matemática...');

    const capitulosMatematica2 = [
        {
            id: 'cap-ma2-01',
            name: 'Sistema Decimal – 2º Ano',
            subject_id: matematicaId,
            order: 8,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Dezenas e Unidades',
                        atividades: [
                            { enunciado: 'QUAL NÚMERO REPRESENTA 1 DEZENA?', objetivo: 'Identificar dezena', fase1: '✔ 10 ✖ 1 ✖ 100', fase2: '✔ 20 ✖ 2 ✖ 200' },
                            { enunciado: 'QUANTAS UNIDADES HÁ EM 14?', objetivo: 'Identificar unidades', fase1: '✔ 4 ✖ 1 ✖ 14', fase2: '✔ 6 (16) ✖ 1 ✖ 10' },
                            { enunciado: 'QUAL É A DEZENA DE 23?', objetivo: 'Identificar valor posicional', fase1: '✔ 2 ✖ 3 ✖ 23', fase2: '✔ 4 (45) ✖ 5 ✖ 45' },
                            { enunciado: 'COMPLETE: 30 É ____ DEZENAS.', objetivo: 'Relacionar dezenas', fase1: '✔ 3 ✖ 30 ✖ 13', fase2: '✔ 5 (50) ✖ 15 ✖ 1' },
                            { enunciado: 'QUAL É O MAIOR NÚMERO?', objetivo: 'Comparar dezenas', fase1: '✔ 42 ✖ 24 ✖ 34', fase2: '✔ 67 ✖ 76 ✖ 57' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Decomposição e Valor Posicional',
                        atividades: [
                            { enunciado: 'DECOMPONHA 35.', objetivo: 'Decompor número', fase1: '✔ 3 DEZENAS E 5 UNIDADES', fase2: '✔ 4 DEZENAS E 2 UNIDADES (42)' },
                            { enunciado: 'QUAL NÚMERO É 2 DEZENAS E 4 UNIDADES?', objetivo: 'Construir número', fase1: '✔ 24 ✖ 42 ✖ 204', fase2: '✔ 36 ✖ 63 ✖ 306' },
                            { enunciado: 'QUAL É O ANTECESSOR DE 50?', objetivo: 'Identificar sequência decimal', fase1: '✔ 49 ✖ 48 ✖ 51', fase2: '✔ 69 ✖ 70 ✖ 68' },
                            { enunciado: 'QUAL É O SUCESSOR DE 39?', objetivo: 'Identificar sucessor', fase1: '✔ 40 ✖ 38 ✖ 41', fase2: '✔ 60 ✖ 59 ✖ 61' },
                            { enunciado: 'QUAL É O VALOR DO 5 EM 52?', objetivo: 'Valor posicional avançado', fase1: '✔ 50 ✖ 5 ✖ 2', fase2: '✔ 60 (em 63) ✖ 6 ✖ 3' }
                        ]
                    }
                ],
                acessibilidade: 'Material concreto digital',
                observacoes: 'Passo visual fixo'
            })
        },
        {
            id: 'cap-ma2-02',
            name: 'Adição e Subtração – 2º Ano',
            subject_id: matematicaId,
            order: 9,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Cálculo Direto',
                        atividades: [
                            { enunciado: 'RESOLVA: 12 + 5', objetivo: 'Calcular adição simples', fase1: '✔ 17 ✖ 16 ✖ 18', fase2: '✔ 24 (19+5) ✖ 23 ✖ 25' },
                            { enunciado: 'RESOLVA: 18 - 6', objetivo: 'Calcular subtração simples', fase1: '✔ 12 ✖ 13 ✖ 11', fase2: '✔ 21 (30-9) ✖ 19 ✖ 22' },
                            { enunciado: 'QUAL É O MAIOR RESULTADO?', objetivo: 'Comparar operações', fase1: '✔ 15+4 ✖ 12+3', fase2: '✔ 30-5 ✖ 28-4' },
                            { enunciado: 'COMPLETE: 20 - __ = 15', objetivo: 'Encontrar termo faltante', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '✔ 8 (30-8=22) ✖ 6 ✖ 7' },
                            { enunciado: 'QUAL CONTA RESULTA EM 25?', objetivo: 'Relacionar operação e resultado', fase1: '✔ 20+5 ✖ 30-4 ✖ 18+6', fase2: '✔ 40-10 ✖ 30+5 ✖ 22+3' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problemas Contextualizados',
                        atividades: [
                            { enunciado: 'ANA TINHA 15 BALAS. GANHOU 7. QUANTAS TEM?', objetivo: 'Resolver problema', fase1: '✔ 22 ✖ 21 ✖ 23', fase2: '✔ 30 (20+10) ✖ 29 ✖ 31' },
                            { enunciado: 'PEDRO TINHA 40 FIGURINHAS. DEU 12. QUANTAS RESTARAM?', objetivo: 'Resolver problema subtração', fase1: '✔ 28 ✖ 27 ✖ 29', fase2: '✔ 35 (50-15) ✖ 36 ✖ 34' },
                            { enunciado: 'QUAL É A PRIMEIRA CONTA?', objetivo: 'Identificar operação inicial', fase1: '✔ 15+7 ✖ 15-7 ✖ 7+15', fase2: '✔ 40-12 ✖ 40+12 ✖ 12+40' },
                            { enunciado: 'QUAL É O RESULTADO FINAL?', objetivo: 'Concluir cálculo', fase1: '✔ 22 ✖ 20 ✖ 24', fase2: '✔ 38 ✖ 36 ✖ 40' }
                        ]
                    }
                ],
                acessibilidade: 'Etapas fragmentadas',
                observacoes: 'Sem tempo limite'
            })
        },
        {
            id: 'cap-ma2-03',
            name: 'Multiplicação Inicial',
            subject_id: matematicaId,
            order: 10,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Agrupamento Concreto',
                        atividades: [
                            { enunciado: '2 GRUPOS DE 3 É IGUAL A?', objetivo: 'Compreender agrupamento', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 12 (3x4) ✖ 10 ✖ 11' },
                            { enunciado: '3 VEZES 2', objetivo: 'Multiplicação simples', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 8 (4x2) ✖ 6 ✖ 9' },
                            { enunciado: 'QUAL REPRESENTA 4+4?', objetivo: 'Relacionar adição repetida', fase1: '✔ 2x4 ✖ 4+2 ✖ 8-4', fase2: '✔ 3x3 ✖ 6+3 ✖ 9-3' },
                            { enunciado: 'QUANTOS AO TODO? (3 pratos com 2 maçãs cada)', objetivo: 'Contagem por grupos', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '✔ 9 (3x3) ✖ 8 ✖ 10' },
                            { enunciado: 'QUAL É O RESULTADO? 5x2', objetivo: 'Calcular multiplicação', fase1: '✔ 10 ✖ 8 ✖ 12', fase2: '✔ 15 (5x3) ✖ 14 ✖ 13' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Problemas Multiplicativos',
                        atividades: [
                            { enunciado: 'ANA COMPROU 4 PACOTES COM 3 BALAS CADA. QUANTAS BALAS?', objetivo: 'Resolver problema multiplicativo', fase1: '✔ 12 ✖ 11 ✖ 13', fase2: '✔ 20 (5x4) ✖ 18 ✖ 22' },
                            { enunciado: 'QUAL É A CONTA?', objetivo: 'Escolher operação correta', fase1: '✔ 4x3 ✖ 4+3 ✖ 4-3', fase2: '✔ 6x2 ✖ 6+2 ✖ 6-2' },
                            { enunciado: 'QUAL É O MAIOR RESULTADO?', objetivo: 'Comparar produtos', fase1: '✔ 5x3 ✖ 4x3', fase2: '✔ 6x4 ✖ 5x4' },
                            { enunciado: 'COMPLETE: 3x__ = 12', objetivo: 'Encontrar fator faltante', fase1: '✔ 4 ✖ 3 ✖ 5', fase2: '✔ 5 (5x5=25) ✖ 4 ✖ 6' },
                            { enunciado: 'QUAL SITUAÇÃO REPRESENTA 2x5?', objetivo: 'Relacionar contexto', fase1: '✔ 2 GRUPOS DE 5 ✖ 5+2 ✖ 5-2', fase2: '✔ 3 GRUPOS DE 4 ✖ 4+3 ✖ 4-3' }
                        ]
                    }
                ],
                acessibilidade: 'Representação concreta',
                observacoes: 'Tabelas visuais'
            })
        },
        {
            id: 'cap-ma2-04',
            name: 'Grandezas e Medidas – 2º Ano',
            subject_id: matematicaId,
            order: 11,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Comparação',
                        atividades: [
                            { enunciado: 'QUAL É O MAIS PESADO?', objetivo: 'Comparar peso', fase1: '✔ PEDRA ✖ PENA ✖ PAPEL', fase2: '✔ MOCHILA ✖ CADERNO ✖ BORRACHA' },
                            { enunciado: 'QUAL É O MAIS ALTO?', objetivo: 'Comparar altura', fase1: '✔ MENINO MAIS ALTO ✖ MENOR ✖ MÉDIO', fase2: '✔ ÁRVORE MAIS ALTA ✖ MENOR ✖ MÉDIA' },
                            { enunciado: 'QUAL DEMORA MAIS TEMPO?', objetivo: 'Comparar duração', fase1: '✔ VIAJAR ✖ COMER ✖ PISCAR', fase2: '✔ FILME ✖ ESCOVAÇÃO ✖ SALTO' },
                            { enunciado: 'QUAL CABE MAIS ÁGUA?', objetivo: 'Comparar capacidade', fase1: '✔ BALDE ✖ COPO ✖ TAMPA', fase2: '✔ GARRAFA GRANDE ✖ COPO ✖ XÍCARA' },
                            { enunciado: 'QUAL É MAIS COMPRIDO?', objetivo: 'Comparar comprimento', fase1: '✔ CORDA LONGA ✖ CURTA ✖ MÉDIA', fase2: '✔ RÉGUA GRANDE ✖ PEQUENA ✖ MÉDIA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Unidades de Medida',
                        atividades: [
                            { enunciado: 'QUANTOS METROS?', objetivo: 'Medir comprimento', fase1: '✔ 3m ✖ 2m ✖ 4m', fase2: '✔ 5m ✖ 4m ✖ 6m' },
                            { enunciado: 'QUAL TEM MAIS CAPACIDADE?', objetivo: 'Comparar capacidade avançada', fase1: '✔ 2L ✖ 1L ✖ 500ml', fase2: '✔ 3L ✖ 2L ✖ 1L' },
                            { enunciado: 'QUAL É MAIS PESADO EM KG?', objetivo: 'Relacionar unidade', fase1: '✔ 5kg ✖ 3kg ✖ 2kg', fase2: '✔ 10kg ✖ 7kg ✖ 9kg' },
                            { enunciado: 'QUAL É A UNIDADE CORRETA?', objetivo: 'Identificar unidade adequada', fase1: '✔ LITRO ✖ METRO ✖ QUILO', fase2: '✔ METRO ✖ LITRO ✖ GRAMA' },
                            { enunciado: 'QUAL SITUAÇÃO USA METRO?', objetivo: 'Aplicar unidade', fase1: '✔ MEDIR PAREDE ✖ MEDIR LEITE ✖ PESAR FRUTA', fase2: '✔ MEDIR PORTA ✖ PESAR MOCHILA ✖ ENCHER COPO' }
                        ]
                    }
                ],
                acessibilidade: 'Régua digital ampliada',
                observacoes: 'Um comando por tela'
            })
        },
        {
            id: 'cap-ma2-05',
            name: 'Tabelas Simples',
            subject_id: matematicaId,
            order: 12,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Leitura de Tabela',
                        atividades: [
                            { enunciado: 'QUAL FRUTA TEM MAIOR QUANTIDADE?', objetivo: 'Ler dado de maior valor em tabela simples', fase1: '✔ MAÇÃ ✖ PERA ✖ UVA', fase2: 'Nova tabela com BANANA, LARANJA e MANGA' },
                            { enunciado: 'QUANTAS BANANAS HÁ?', objetivo: 'Localizar número específico na tabela', fase1: '✔ 5 ✖ 3 ✖ 7', fase2: 'Nova tabela com outro valor-alvo' },
                            { enunciado: 'QUAL ITEM TEM MENOR NÚMERO?', objetivo: 'Comparar três valores simples', fase1: '✔ PERA ✖ MAÇÃ ✖ UVA', fase2: 'Nova tabela com 3 itens diferentes' },
                            { enunciado: 'QUAL É O TOTAL?', objetivo: 'Somar dois valores apresentados', fase1: '✔ 10 ✖ 8 ✖ 12', fase2: 'Nova tabela com soma de três valores até 15' },
                            { enunciado: 'QUAL LINHA MOSTRA 3?', objetivo: 'Localizar dado específico em linha', fase1: '✔ LINHA 2 ✖ LINHA 1 ✖ LINHA 3', fase2: 'Nova tabela com outra quantidade-alvo' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Interpretação',
                        atividades: [
                            { enunciado: 'QUAL DIA TEVE MAIS VENDAS?', objetivo: 'Interpretar maior valor em tabela ampliada', fase1: '✔ TERÇA ✖ SEGUNDA ✖ QUARTA', fase2: 'Nova tabela com 5 dias' },
                            { enunciado: 'QUAL FOI A DIFERENÇA?', objetivo: 'Calcular diferença entre dois valores', fase1: '✔ 2 ✖ 3 ✖ 4', fase2: 'Nova tabela com diferença até 5 unidades' },
                            { enunciado: 'QUAL ITEM SOMA 8?', objetivo: 'Integrar dois dados da tabela', fase1: '✔ MAÇÃ+PERA ✖ PERA+UVA ✖ MAÇÃ+UVA', fase2: 'Nova meta de soma' },
                            { enunciado: 'QUAL É O MENOR VALOR?', objetivo: 'Comparar múltiplos dados', fase1: '✔ 2 ✖ 3 ✖ 5', fase2: 'Nova tabela com 5 valores' },
                            { enunciado: 'QUAL AFIRMAÇÃO ESTÁ CORRETA?', objetivo: 'Interpretar informação expressa em frase', fase1: '✔ A MAÇÃ FOI A MAIS VENDIDA ✖ A PERA FOI A MAIS VENDIDA ✖ A UVA FOI A MAIS VENDIDA', fase2: 'Nova tabela com nova afirmação correta' }
                        ]
                    }
                ],
                acessibilidade: 'Ícones grandes',
                observacoes: 'Pergunta objetiva'
            })
        },
        {
            id: 'cap-ma2-06',
            name: 'Gráficos Simples',
            subject_id: matematicaId,
            order: 13,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Leitura Visual Básica',
                        atividades: [
                            { enunciado: 'QUAL É A BARRA MAIOR?', objetivo: 'Identificar maior valor visualmente', fase1: '✔ BARRA AZUL ✖ VERDE ✖ AMARELA', fase2: 'Novo gráfico com 4 barras' },
                            { enunciado: 'QUAL É A BARRA MENOR?', objetivo: 'Identificar menor valor', fase1: '✔ BARRA VERDE ✖ AZUL ✖ VERMELHA', fase2: 'Novo gráfico com valores diferentes' },
                            { enunciado: 'QUANTOS VOTOS RECEBEU A MAÇÃ?', objetivo: 'Localizar valor específico no gráfico', fase1: '✔ 5 ✖ 3 ✖ 7', fase2: 'Novo gráfico; localizar valor da BANANA' },
                            { enunciado: 'QUAL FRUTA FOI MAIS ESCOLHIDA?', objetivo: 'Interpretar gráfico simples', fase1: '✔ BANANA ✖ UVA ✖ PERA', fase2: 'Novo gráfico com 4 frutas' },
                            { enunciado: 'QUAL É O TOTAL?', objetivo: 'Somar valores apresentados no gráfico', fase1: '✔ 10 ✖ 12 ✖ 8', fase2: 'Gráfico com 3 barras; calcular total até 20' }
                        ]
                    }
                ],
                acessibilidade: 'Barras ampliadas',
                observacoes: 'Comparação concreta'
            })
        },
        {
            id: 'cap-ma2-07',
            name: 'Divisão Intuitiva',
            subject_id: matematicaId,
            order: 14,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Partilha Igual',
                        atividades: [
                            { enunciado: 'DIVIDA 6 BALAS ENTRE 2 CRIANÇAS.', objetivo: 'Compreender partilha igual concreta', fase1: '✔ 3 PARA CADA ✖ 2 ✖ 4', fase2: '8 BALAS ÷ 2 → ✔ 4 PARA CADA ✖ 3 ✖ 5' },
                            { enunciado: 'QUANTOS CADA UM RECEBE? (10 ÷ 2)', objetivo: 'Identificar resultado da partilha', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '12 ÷ 3 → ✔ 4 ✖ 3 ✖ 5' },
                            { enunciado: '12 DIVIDIDO POR 3', objetivo: 'Resolver divisão simples com apoio visual', fase1: '✔ 4 ✖ 3 ✖ 5', fase2: '15 ÷ 3 → ✔ 5 ✖ 4 ✖ 6' },
                            { enunciado: 'QUAL REPRESENTA 8 ÷ 2?', objetivo: 'Relacionar divisão à ideia de metade', fase1: '✔ 4 + 4 ✖ 2 + 6 ✖ 3 + 5', fase2: '10 ÷ 2 → ✔ 5 + 5 ✖ 4 + 6 ✖ 3 + 7' },
                            { enunciado: 'QUANTOS GRUPOS DE 2 HÁ EM 6?', objetivo: 'Relacionar divisão a agrupamento', fase1: '✔ 3 GRUPOS ✖ 2 ✖ 4', fase2: '8 OBJETOS EM GRUPOS DE 2 → ✔ 4 ✖ 3 ✖ 5' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Aplicação e Resto',
                        atividades: [
                            { enunciado: 'ANA TEM 15 DOCES PARA 3 AMIGOS. QUANTOS CADA UM RECEBE?', objetivo: 'Aplicar divisão em situação-problema', fase1: '✔ 5 ✖ 4 ✖ 6', fase2: '20 ÷ 4 → ✔ 5 ✖ 4 ✖ 6' },
                            { enunciado: 'QUAL É A CONTA?', objetivo: 'Identificar operação correta', fase1: '✔ 15 ÷ 3 ✖ 15 − 3 ✖ 15 + 3', fase2: '✔ 18 ÷ 3 ✖ 18 − 3 ✖ 18 + 3' },
                            { enunciado: 'QUAL É O RESULTADO? (18 ÷ 3)', objetivo: 'Calcular divisão consolidada', fase1: '✔ 6 ✖ 5 ✖ 7', fase2: '21 ÷ 3 → ✔ 7 ✖ 6 ✖ 8' },
                            { enunciado: 'QUAL É O RESTANTE? (7 ÷ 3)', objetivo: 'Compreender noção de resto', fase1: '✔ RESTA 1 ✖ 2 ✖ 0', fase2: '10 ÷ 4 → ✔ RESTA 2 ✖ 1 ✖ 0' },
                            { enunciado: 'QUAL SITUAÇÃO REPRESENTA 12 ÷ 4?', objetivo: 'Relacionar divisão ao contexto', fase1: '✔ 12 BALAS EM 4 GRUPOS IGUAIS ✖ 12 − 4 ✖ 4 + 4 + 4 + 4', fase2: '✔ 16 BALAS EM 4 GRUPOS IGUAIS ✖ 16 − 4 ✖ 4 + 4' }
                        ]
                    }
                ],
                acessibilidade: 'Representação concreta',
                observacoes: 'Sem tempo limite'
            })
        }
    ];

    // ─── PÍLULAS – CONHECIMENTOS GERAIS 2º ANO ───────────────────────────────
    console.log('💊 Criando pílulas do 2º Ano – Conhecimentos Gerais...');

    const capitulosConhecimentos2 = [
        {
            id: 'cap-cg2-01',
            name: 'Natureza',
            subject_id: conhecimentosId,
            order: 9,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Identificação',
                        atividades: [
                            { enunciado: 'QUAL É UM SER VIVO?', objetivo: 'Diferenciar ser vivo de objeto inanimado', fase1: '✔ ÁRVORE ✖ PEDRA ✖ MESA', fase2: '✔ CACHORRO ✖ CARRO ✖ CADEIRA' },
                            { enunciado: 'QUAL ANIMAL VIVE NA ÁGUA?', objetivo: 'Classificar animal por habitat', fase1: '✔ PEIXE ✖ CAVALO ✖ GATO', fase2: '✔ TUBARÃO ✖ VACA ✖ LEÃO' },
                            { enunciado: 'O QUE A PLANTA PRECISA PARA CRESCER?', objetivo: 'Reconhecer necessidade vital básica', fase1: '✔ ÁGUA ✖ PEDRA ✖ BRINQUEDO', fase2: '✔ SOL ✖ SAPATO ✖ LIVRO' },
                            { enunciado: 'QUAL É UM ANIMAL DOMÉSTICO?', objetivo: 'Diferenciar animal doméstico de selvagem', fase1: '✔ CACHORRO ✖ LEÃO ✖ TIGRE', fase2: '✔ GATO ✖ JACARÉ ✖ ONÇA' },
                            { enunciado: 'QUAL PARTE É DA PLANTA?', objetivo: 'Identificar partes estruturais básicas', fase1: '✔ RAIZ ✖ RODA ✖ PEDRA', fase2: '✔ FOLHA ✖ MESA ✖ SAPATO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Ciclo e Consciência Ambiental',
                        atividades: [
                            { enunciado: 'QUAL É A ORDEM DO CRESCIMENTO DA PLANTA?', objetivo: 'Sequenciar ciclo', fase1: 'SEMENTE → BROTO → PLANTA', fase2: 'Novo conjunto' },
                            { enunciado: 'QUAL ANIMAL É HERBÍVORO?', objetivo: 'Classificar alimentação', fase1: '✔ VACA ✖ LEÃO ✖ COBRA', fase2: '✔ CAVALO ✖ TIGRE ✖ LOBO' },
                            { enunciado: 'O QUE ACONTECE SE NÃO CHOVER?', objetivo: 'Compreender causa e efeito', fase1: '✔ A PLANTA MURCHA ✖ A PLANTA CRESCE ✖ A PLANTA FICA AZUL', fase2: '✔ O SOLO FICA SECO ✖ O SOLO MOLHA ✖ O SOLO SOME' },
                            { enunciado: 'QUAL É UM RECURSO NATURAL?', objetivo: 'Identificar recurso natural', fase1: '✔ ÁGUA ✖ PLÁSTICO ✖ BRINQUEDO', fase2: '✔ SOL ✖ CARRO ✖ MESA' },
                            { enunciado: 'QUAL AÇÃO PROTEGE A NATUREZA?', objetivo: 'Identificar atitude sustentável', fase1: '✔ RECICLAR ✖ JOGAR LIXO NO CHÃO ✖ QUEIMAR PAPEL', fase2: '✔ PLANTAR ÁRVORE ✖ CORTAR ÁRVORE ✖ SUJAR RIO' }
                        ]
                    }
                ],
                acessibilidade: 'Animação simples',
                observacoes: 'Sequência concreta'
            })
        },
        {
            id: 'cap-cg2-02',
            name: 'Sociedade',
            subject_id: conhecimentosId,
            order: 10,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Espaços e Profissões',
                        atividades: [
                            { enunciado: 'QUAL É UM LUGAR DA CIDADE?', objetivo: 'Reconhecer espaços sociais', fase1: '✔ ESCOLA ✖ FLORESTA ✖ RIO', fase2: '✔ HOSPITAL ✖ MONTANHA ✖ DESERTO' },
                            { enunciado: 'QUEM TRABALHA NO HOSPITAL?', objetivo: 'Identificar profissão', fase1: '✔ MÉDICO ✖ PILOTO ✖ PINTOR', fase2: '✔ ENFERMEIRA ✖ MOTORISTA ✖ FAZENDEIRO' },
                            { enunciado: 'QUAL É UM MEIO DE TRANSPORTE?', objetivo: 'Identificar transporte', fase1: '✔ ÔNIBUS ✖ CASA ✖ ÁRVORE', fase2: '✔ TREM ✖ SOFÁ ✖ GATO' },
                            { enunciado: 'O QUE DEVEMOS FAZER NA FILA?', objetivo: 'Comportamento social', fase1: '✔ ESPERAR A VEZ ✖ EMPURRAR ✖ GRITAR', fase2: '✔ FICAR EM SILÊNCIO ✖ CORRER ✖ SAIR' },
                            { enunciado: 'QUAL É UM DIREITO DA CRIANÇA?', objetivo: 'Reconhecer direito básico', fase1: '✔ ESTUDAR ✖ TRABALHAR NA RUA ✖ NÃO COMER', fase2: '✔ BRINCAR ✖ NÃO DORMIR ✖ NÃO IR À ESCOLA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Funções Sociais',
                        atividades: [
                            { enunciado: 'QUAL É A FUNÇÃO DO PROFESSOR?', objetivo: 'Compreender papel social', fase1: '✔ ENSINAR ✖ DIRIGIR ÔNIBUS ✖ COZINHAR', fase2: '✔ ORIENTAR ✖ VENDER PRODUTOS ✖ CONSTRUIR CASA' },
                            { enunciado: 'QUAL ATITUDE É RESPEITOSA?', objetivo: 'Identificar atitude adequada', fase1: '✔ CUMPRIMENTAR ✖ GRITAR ✖ EMPURRAR', fase2: '✔ PEDIR DESCULPA ✖ IGNORAR ✖ RIR DO OUTRO' },
                            { enunciado: 'QUAL É UM SERVIÇO PÚBLICO?', objetivo: 'Identificar serviço público', fase1: '✔ HOSPITAL ✖ LOJA DE ROUPA ✖ PADARIA', fase2: '✔ ESCOLA PÚBLICA ✖ SHOPPING ✖ CINEMA' },
                            { enunciado: 'QUAL É UMA REGRA DE CONVIVÊNCIA?', objetivo: 'Reconhecer regra social', fase1: '✔ NÃO JOGAR LIXO NO CHÃO ✖ FALAR ALTO ✖ EMPURRAR', fase2: '✔ RESPEITAR O OUTRO ✖ BATER ✖ GRITAR' },
                            { enunciado: 'QUAL AÇÃO AJUDA A COMUNIDADE?', objetivo: 'Identificar ação coletiva', fase1: '✔ AJUDAR VIZINHO ✖ SUJAR RUA ✖ QUEBRAR OBJETO', fase2: '✔ PARTICIPAR DA LIMPEZA ✖ RASGAR PAPEL ✖ PICHAR MURO' }
                        ]
                    }
                ],
                acessibilidade: 'Imagens reais',
                observacoes: 'Comparação visual'
            })
        },
        {
            id: 'cap-cg2-03',
            name: 'Ciclo da Água',
            subject_id: conhecimentosId,
            order: 11,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Sequência Básica',
                        atividades: [
                            { enunciado: 'QUAL É A PRIMEIRA ETAPA?', objetivo: 'Identificar etapa inicial do ciclo da água', fase1: '✔ EVAPORAÇÃO ✖ CHUVA ✖ RIO', fase2: 'Nova pergunta com sequência visual embaralhada' },
                            { enunciado: 'QUAL É A FASE DA CHUVA?', objetivo: 'Reconhecer precipitação', fase1: '✔ CHUVA ✖ SOL ✖ VENTO', fase2: 'Nova imagem com granizo/neblina' },
                            { enunciado: 'QUAL REPRESENTA O SOL AQUECENDO A ÁGUA?', objetivo: 'Identificar evaporação', fase1: '✔ EVAPORAÇÃO ✖ CONDENSAÇÃO ✖ RIO', fase2: 'Novo cenário com lago' },
                            { enunciado: 'O QUE VEM DEPOIS DA EVAPORAÇÃO?', objetivo: 'Sequenciar etapas do ciclo', fase1: '✔ CONDENSAÇÃO ✖ CHUVA ✖ RIO', fase2: 'Pergunta inversa: O QUE VEM ANTES DA CHUVA? ✔ CONDENSAÇÃO' },
                            { enunciado: 'QUAL É A ORDEM CORRETA?', objetivo: 'Organizar sequência completa básica', fase1: 'EVAPORAÇÃO → CONDENSAÇÃO → CHUVA', fase2: '4 etapas incluindo ACÚMULO' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Causa, Efeito e Consciência',
                        atividades: [
                            { enunciado: 'POR QUE CHOVE?', objetivo: 'Compreender relação causa-efeito', fase1: '✔ NUVENS FICAM CHEIAS ✖ SOL SOME ✖ VENTO PARA', fase2: 'Nova situação: POR QUE A PLANTA MURCHA? ✔ FALTA DE CHUVA' },
                            { enunciado: 'QUAL É A FUNÇÃO DO SOL?', objetivo: 'Identificar papel do sol no ciclo', fase1: '✔ AQUECER A ÁGUA ✖ MOLHAR A TERRA ✖ FAZER NEVE', fase2: 'O QUE ACONTECE QUANDO O SOL AQUECE? ✔ EVAPORAÇÃO' },
                            { enunciado: 'QUAL ACONTECE POR ÚLTIMO?', objetivo: 'Identificar etapa final', fase1: '✔ CHUVA ✖ EVAPORAÇÃO ✖ CONDENSAÇÃO', fase2: 'Nova sequência com 4 etapas' },
                            { enunciado: 'QUAL É O CICLO COMPLETO?', objetivo: 'Reconhecer sequência correta', fase1: '✔ EVAPORAÇÃO → CONDENSAÇÃO → CHUVA ✖ INVERTIDA ✖ INCOMPLETA', fase2: 'Nova sequência com 4 etapas' },
                            { enunciado: 'QUAL AÇÃO ECONOMIZA ÁGUA?', objetivo: 'Aplicar conhecimento à vida diária', fase1: '✔ FECHAR TORNEIRA ✖ DEIXAR ABERTA ✖ DESPERDIÇAR', fase2: '✔ REUTILIZAR ÁGUA ✖ JOGAR FORA' }
                        ]
                    }
                ],
                acessibilidade: 'Animação simples',
                observacoes: 'Sequência visual fixa'
            })
        },
        {
            id: 'cap-cg2-04',
            name: 'Comunidade',
            subject_id: conhecimentosId,
            order: 12,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Espaço Social',
                        atividades: [
                            { enunciado: 'QUAL É UM LOCAL DA COMUNIDADE?', objetivo: 'Reconhecer espaço social organizado', fase1: '✔ ESCOLA ✖ FLORESTA ✖ DESERTO', fase2: '✔ HOSPITAL ✖ MONTANHA ✖ PRAIA' },
                            { enunciado: 'QUEM TRABALHA NA ESCOLA?', objetivo: 'Identificar papel social no espaço escolar', fase1: '✔ PROFESSOR ✖ PILOTO ✖ PESCADOR', fase2: '✔ DIRETOR ✖ MOTORISTA DE NAVIO ✖ ASTRONAUTA' },
                            { enunciado: 'QUAL É UM SERVIÇO PÚBLICO?', objetivo: 'Diferenciar serviço público de privado', fase1: '✔ HOSPITAL ✖ LOJA ✖ CINEMA', fase2: '✔ POSTO DE SAÚDE ✖ RESTAURANTE ✖ SHOPPING' },
                            { enunciado: 'O QUE FAZ O BOM VIZINHO?', objetivo: 'Identificar atitude adequada de convivência', fase1: '✔ AJUDA ✖ GRITA ✖ EMPURRA', fase2: '✔ COMPARTILHA ✖ BRIGA ✖ QUEBRA' },
                            { enunciado: 'QUAL É UM DIREITO?', objetivo: 'Reconhecer direito básico da criança', fase1: '✔ ESTUDAR ✖ NÃO COMER ✖ TRABALHAR NA RUA', fase2: '✔ BRINCAR ✖ NÃO DORMIR ✖ NÃO IR À ESCOLA' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Responsabilidade e Cooperação',
                        atividades: [
                            { enunciado: 'QUAL AÇÃO AJUDA A COMUNIDADE?', objetivo: 'Identificar atitude coletiva positiva', fase1: '✔ LIMPAR PRAÇA ✖ SUJAR ✖ QUEBRAR', fase2: '✔ PLANTAR ÁRVORE ✖ RASGAR PAPEL ✖ JOGAR LIXO' },
                            { enunciado: 'QUAL É A FUNÇÃO DO PREFEITO?', objetivo: 'Compreender papel de liderança municipal', fase1: '✔ ADMINISTRAR A CIDADE ✖ ENSINAR NA ESCOLA ✖ PESCAR', fase2: '✔ ORGANIZAR SERVIÇOS DA CIDADE ✖ VENDER PRODUTOS ✖ DIRIGIR AVIÃO' },
                            { enunciado: 'QUAL É UMA REGRA DE CONVIVÊNCIA?', objetivo: 'Reconhecer regra social básica', fase1: '✔ RESPEITAR ✖ EMPURRAR ✖ GRITAR', fase2: '✔ ESPERAR A VEZ ✖ INTERROMPER ✖ BRIGAR' },
                            { enunciado: 'QUAL É UM DEVER?', objetivo: 'Identificar dever individual na comunidade', fase1: '✔ CUIDAR DO ESPAÇO ✖ SUJAR ✖ RASGAR', fase2: '✔ PRESERVAR A ESCOLA ✖ PICHAR ✖ QUEBRAR' },
                            { enunciado: 'QUAL SITUAÇÃO MOSTRA COOPERAÇÃO?', objetivo: 'Identificar ação colaborativa', fase1: '✔ AJUDAR AMIGO ✖ IGNORAR ✖ EMPURRAR', fase2: '✔ TRABALHAR EM GRUPO ✖ FAZER SOZINHO ✖ BRIGAR' }
                        ]
                    }
                ],
                acessibilidade: 'Imagens reais',
                observacoes: 'Comparação concreta'
            })
        },
        {
            id: 'cap-cg2-05',
            name: 'Autocuidado – 2º Ano',
            subject_id: conhecimentosId,
            order: 13,
            content: JSON.stringify({
                etapa: '2º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO 1 – NÍVEL 1 – Hábitos Básicos',
                        atividades: [
                            { enunciado: 'O QUE FAZER ANTES DE COMER?', objetivo: 'Identificar hábito básico de higiene', fase1: '✔ LAVAR AS MÃOS ✖ CORRER ✖ BRINCAR', fase2: '✔ LAVAR AS MÃOS ✖ ASSISTIR TV ✖ PULAR' },
                            { enunciado: 'QUAL ALIMENTO É MAIS SAUDÁVEL?', objetivo: 'Escolher alimento adequado', fase1: '✔ MAÇÃ ✖ BALA ✖ REFRIGERANTE', fase2: '✔ BANANA ✖ DOCE ✖ REFRIGERANTE' },
                            { enunciado: 'O QUE USAR NO FRIO?', objetivo: 'Relacionar vestuário ao clima', fase1: '✔ CASACO ✖ CHINELO ✖ REGATA', fase2: '✔ CACHECOL ✖ SHORT ✖ SANDÁLIA' },
                            { enunciado: 'QUAL OBJETO É DE HIGIENE?', objetivo: 'Reconhecer objeto de cuidado pessoal', fase1: '✔ ESCOVA DE DENTES ✖ LÁPIS ✖ BOLA', fase2: '✔ SABONETE ✖ LIVRO ✖ SAPATO' },
                            { enunciado: 'QUAL É UMA ATITUDE SEGURA?', objetivo: 'Identificar comportamento preventivo', fase1: '✔ ATRAVESSAR NA FAIXA ✖ CORRER NA RUA ✖ EMPURRAR', fase2: '✔ USAR CAPACETE ✖ CORRER NA ESCADA ✖ BRIGAR' }
                        ]
                    },
                    {
                        bloco: 'BLOCO 2 – NÍVEL 2 – Autonomia e Prevenção',
                        atividades: [
                            { enunciado: 'POR QUE DEVEMOS ESCOVAR OS DENTES?', objetivo: 'Compreender finalidade do cuidado', fase1: '✔ EVITAR CÁRIES ✖ DORMIR ✖ CORRER', fase2: '✔ MANTER BOCA SAUDÁVEL ✖ ENGORDAR ✖ CORRER MAIS' },
                            { enunciado: 'QUAL HÁBITO PREVINE DOENÇAS?', objetivo: 'Relacionar hábito e saúde', fase1: '✔ LAVAR AS MÃOS ✖ PULAR REFEIÇÃO ✖ DORMIR TARDE', fase2: '✔ TOMAR BANHO ✖ NÃO ESCOVAR ✖ NÃO DORMIR' },
                            { enunciado: 'QUAL SITUAÇÃO É MAIS SEGURA?', objetivo: 'Comparar situações de risco', fase1: '✔ USAR CINTO ✖ FICAR EM PÉ ✖ CORRER NO ÔNIBUS', fase2: '✔ OLHAR PARA OS DOIS LADOS ✖ ATRAVESSAR CORRENDO ✖ EMPURRAR' },
                            { enunciado: 'QUAL ATITUDE DEMONSTRA RESPONSABILIDADE?', objetivo: 'Reconhecer comportamento autônomo', fase1: '✔ ARRUMAR MOCHILA ✖ JOGAR NO CHÃO ✖ GRITAR', fase2: '✔ ORGANIZAR MATERIAL ✖ RASGAR PAPEL ✖ EMPURRAR' },
                            { enunciado: 'QUAL É UM HÁBITO SAUDÁVEL?', objetivo: 'Consolidar conceito de cuidado diário', fase1: '✔ DORMIR BEM ✖ NÃO COMER ✖ NÃO LAVAR AS MÃOS', fase2: '✔ BEBER ÁGUA ✖ NÃO DORMIR ✖ NÃO TOMAR BANHO' }
                        ]
                    }
                ],
                acessibilidade: 'Sequência ilustrada',
                observacoes: 'Modelo estruturado'
            })
        }
    ];

    // Inserir todos os capítulos do 2º ano
    const todosCapitulos2 = [...capitulosPortugues2, ...capitulosMatematica2, ...capitulosConhecimentos2];
    for (const cap of todosCapitulos2) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: {},
            create: cap
        });
    }
    console.log(`✅ ${todosCapitulos2.length} pílulas do 2º Ano criadas`);

    // ─── BNCC 2º ANO ──────────────────────────────────────────────────────────
    console.log('📋 Criando competências BNCC do 2º Ano...');

    const bnccData2 = [
        {
            id: 'bncc-EF02LP05',
            code: 'EF02LP05',
            title: 'Compreensão leitora – leitura e interpretação de texto curto',
            description: 'Nível 1 (Base): Ler texto de 3 linhas e localizar informações explícitas. Nível 2 (Ampliação): Identificar ideia principal e fazer inferências simples. Acessibilidade: Texto narrado + destaque visual. Comportamento: Identificar personagens, local e ações explícitas no texto, inferir causas, antecipar desfechos, sintetizar tema central e escolher título adequado.',
            stage: '2º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF02LP09',
            code: 'EF02LP09',
            title: 'Produção textual – bilhete e texto funcional',
            description: 'Nível 1 (Base): Produzir bilhete simples completando modelo estruturado. Nível 2 (Ampliação): Produzir pequeno parágrafo com início, meio e fim. Acessibilidade: Modelo estruturado com frase-modelo visível. Comportamento: Organizar frases para formar texto coerente, produzir bilhete com saudação/mensagem/despedida, escolher frase objetiva e adequada ao contexto comunicativo.',
            stage: '2º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF02LP03',
            code: 'EF02LP03',
            title: 'Convenções ortográficas – ortografia básica',
            description: 'Nível 1 (Base): Identificar sílabas e aplicar correspondência grafema-fonema básica. Nível 2 (Ampliação): Aplicar regra simples S/Z, CH, LH. Acessibilidade: Destaque visual. Comportamento: Discriminar grafias corretas, identificar dígrafos (CH, LH), reconhecer erros ortográficos e generalizar regras de correspondência fonema-grafema em palavras simples.',
            stage: '2º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF02LP04',
            code: 'EF02LP04',
            title: 'Convenções linguísticas – pontuação básica',
            description: 'Nível 1 (Base): Identificar ponto final. Nível 2 (Ampliação): Usar ponto final, interrogação e exclamação. Acessibilidade: Destaque colorido na pontuação. Comportamento: Reconhecer e aplicar ponto final, interrogação e exclamação; diferenciar frases declarativas, interrogativas e exclamativas; identificar erros de pontuação e organizar frases corretamente.',
            stage: '2º Ano',
            subject: 'Português'
        },
        {
            id: 'bncc-EF02MA01',
            code: 'EF02MA01',
            title: 'Numeração – sistema decimal até 100',
            description: 'Nível 1 (Base): Compor número até 100. Nível 2 (Ampliação): Decompor dezenas e unidades. Acessibilidade: Material concreto digital. Comportamento: Identificar dezenas e unidades, decompor números formalmente (3D+5U), reconhecer valor posicional, comparar números até 100, identificar antecessor e sucessor.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA06',
            code: 'EF02MA06',
            title: 'Operações – adição e subtração até 100',
            description: 'Nível 1 (Base): Resolver adição e subtração até 100. Nível 2 (Ampliação): Resolver problemas contextualizados. Acessibilidade: Etapas fragmentadas. Comportamento: Calcular adições e subtrações até 100, encontrar termos faltantes, resolver problemas de uma e duas etapas, comparar resultados de operações.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA07',
            code: 'EF02MA07',
            title: 'Operações – multiplicação inicial por agrupamento',
            description: 'Nível 1 (Base): Agrupar objetos para representar multiplicação. Nível 2 (Ampliação): Resolver multiplicação simples em contextos. Acessibilidade: Representação concreta com tabelas visuais. Comportamento: Compreender multiplicação como adição repetida, calcular produtos simples (até 5x5), encontrar fator faltante, resolver problemas multiplicativos.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA08',
            code: 'EF02MA08',
            title: 'Operações – divisão intuitiva por partilha',
            description: 'Nível 1 (Base): Distribuir igualmente objetos entre grupos. Nível 2 (Ampliação): Resolver divisão simples com e sem resto. Acessibilidade: Representação concreta. Comportamento: Compreender divisão como partilha igual, calcular quocientes simples, identificar a operação correta, compreender noção de resto.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA16',
            code: 'EF02MA16',
            title: 'Medidas – grandezas e unidades de medida',
            description: 'Nível 1 (Base): Medir comprimento e comparar grandezas. Nível 2 (Ampliação): Comparar medidas usando unidades formais (m, kg, L). Acessibilidade: Régua digital ampliada. Comportamento: Comparar grandezas por peso, altura, duração, capacidade e comprimento; reconhecer e aplicar unidades formais (metro, litro, quilo) em contextos cotidianos.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA20',
            code: 'EF02MA20',
            title: 'Tratamento da informação – tabelas simples',
            description: 'Nível 1 (Base): Ler tabela com imagem e identificar dados. Nível 2 (Ampliação): Interpretar dado específico e realizar cálculos com dados da tabela. Acessibilidade: Ícones grandes. Comportamento: Localizar valores em tabelas de 2-3 colunas, identificar maior/menor valor, calcular total e diferença entre dados, interpretar afirmações sobre dados.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02MA21',
            code: 'EF02MA21',
            title: 'Estatística inicial – gráficos de barras simples',
            description: 'Nível 1 (Base): Identificar maior e menor quantidade no gráfico. Nível 2 (Ampliação): Comparar dados e calcular total. Acessibilidade: Barras ampliadas. Comportamento: Identificar maior e menor barra, localizar valor específico, interpretar gráfico simples de barras, calcular totais e diferenças entre dados.',
            stage: '2º Ano',
            subject: 'Matemática'
        },
        {
            id: 'bncc-EF02CI03',
            code: 'EF02CI03',
            title: 'Ciências naturais – ciclo da água e natureza',
            description: 'Nível 1 (Base): Identificar fases do ciclo da água e seres vivos. Nível 2 (Ampliação): Relacionar fases do ciclo, classificar alimentação e compreender relações causais na natureza. Acessibilidade: Animação simples com sequência visual fixa. Comportamento: Sequenciar evaporação→condensação→chuva, identificar habitats, classificar animais e plantas, compreender impacto ambiental.',
            stage: '2º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF02CI06',
            code: 'EF02CI06',
            title: 'Saúde e cidadania – autocuidado e prevenção',
            description: 'Nível 1 (Base): Identificar hábitos saudáveis. Nível 2 (Ampliação): Relacionar hábito e consequência para a saúde. Acessibilidade: Sequência ilustrada com modelo estruturado. Comportamento: Reconhecer hábitos de higiene, alimentação saudável, comportamentos seguros, compreender relações causa-efeito na saúde e demonstrar autonomia em cuidados pessoais.',
            stage: '2º Ano',
            subject: 'Conhecimentos Gerais'
        },
        {
            id: 'bncc-EF02HI02',
            code: 'EF02HI02',
            title: 'História e Geografia – sociedade, comunidade e moradia',
            description: 'Nível 1 (Base): Identificar tipos de moradia, profissões e espaços da comunidade. Nível 2 (Ampliação): Relacionar função social de espaços, profissões e serviços públicos. Acessibilidade: Imagens reais com comparação visual. Comportamento: Reconhecer espaços sociais da cidade, identificar profissões e suas funções, diferenciar serviços públicos de privados, compreender direitos e deveres na comunidade.',
            stage: '2º Ano',
            subject: 'Conhecimentos Gerais'
        }
    ];

    for (const bncc of bnccData2) {
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

    console.log(`✅ ${bnccData2.length} competências BNCC do 2º Ano criadas`);
    console.log('');
    console.log('🎉 Seed do 2º Ano concluído!');
    console.log('   💊 18 pílulas: 6 (PT) + 7 (MA) + 5 (CG)');
    console.log('   📋 14 competências BNCC: EF02LP03~09, EF02MA01~21, EF02CI03~06, EF02HI02');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
