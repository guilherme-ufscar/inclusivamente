import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seed do 5º Ano...');

    // IDs das disciplinas já criadas no seed-1ano.ts
    const portuguesId = 'subject-portugues-1ano';
    const matematicaId = 'subject-matematica-1ano';
    const conhecimentosId = 'subject-conhecimentos-1ano';

    // ─── PÍLULAS – PORTUGUÊS ──────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 5º Ano – Português...');

    const capitulosPortugues5 = [
        {
            id: 'cap-pt5-01',
            name: 'Interpretação Textual',
            subject_id: portuguesId,
            order: 20,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Argumento',
                        atividades: [
                            { enunciado: 'TEXTO: "Reciclar é uma atitude importante. Quando reciclamos, ajudamos a diminuir o lixo e protegemos a natureza." QUAL É A IDEIA PRINCIPAL DO TEXTO?', objetivo: 'Identificar argumento explícito', fase1: '✔ RECICLAR AJUDA A PROTEGER A NATUREZA ✖ RECICLAR AUMENTA O LIXO ✖ RECICLAR NÃO MUDA NADA', fase2: '✔ SEPARAR O LIXO AJUDA O PLANETA ✖ JOGAR TUDO JUNTO É MELHOR ✖ LIXO NÃO TEM IMPORTÂNCIA' },
                            { enunciado: 'TEXTO: "Comer frutas e verduras ajuda o corpo a crescer saudável." O TEXTO DEFENDE QUAL IDEIA?', objetivo: 'Reconhecer argumento explícito', fase1: '✔ COMER FRUTAS FAZ BEM À SAÚDE ✖ DOCES SÃO MAIS SAUDÁVEIS ✖ NÃO PRECISAMOS COMER VERDURAS', fase2: '✔ ALIMENTAÇÃO SAUDÁVEL É IMPORTANTE ✖ SÓ REFRIGERANTE É NECESSÁRIO ✖ COMIDA NÃO IMPORTA' },
                            { enunciado: 'TEXTO: "Na opinião do autor, usar o celular por muitas horas pode prejudicar o sono das crianças." QUAL FRASE MOSTRA A OPINIÃO DO AUTOR?', objetivo: 'Identificar opinião explícita', fase1: '✔ USAR CELULAR POR MUITAS HORAS PODE PREJUDICAR O SONO ✖ O CELULAR FOI CRIADO EM 1973 ✖ O CELULAR TEM TELA DE VIDRO', fase2: '✔ O AUTOR ACREDITA QUE O EXCESSO FAZ MAL ✖ CELULAR É UM OBJETO ELETRÔNICO ✖ EXISTEM VÁRIOS MODELOS' },
                            { enunciado: 'TEXTO: "Apagar a luz ao sair do quarto economiza energia." O TEXTO QUER CONVENCER O LEITOR A FAZER O QUÊ?', objetivo: 'Reconhecer intenção explícita', fase1: '✔ APAGAR A LUZ PARA ECONOMIZAR ENERGIA ✖ DEIXAR TODAS AS LUZES ACESAS ✖ NÃO SE PREOCUPAR COM ENERGIA', fase2: '✔ ECONOMIZAR ENERGIA É IMPORTANTE ✖ DESPERDIÇAR É NORMAL ✖ GASTAR MAIS É MELHOR' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Inferir Intenção',
                        atividades: [
                            { enunciado: 'TEXTO: "O bullying machuca sentimentos e pode deixar marcas profundas." POR QUE O AUTOR ESCREVEU ESSE TEXTO?', objetivo: 'Inferir intenção do autor', fase1: '✔ ALERTAR SOBRE A IMPORTÂNCIA DO RESPEITO ✖ CONTAR UMA HISTÓRIA ENGRAÇADA ✖ ENSINAR MATEMÁTICA', fase2: '✔ CONVENCER A NÃO PRATICAR BULLYING ✖ FALAR SOBRE ESPORTES ✖ ENSINAR CIÊNCIAS' },
                            { enunciado: 'TEXTO: "Maria incluiu o colega novo nas brincadeiras. Todos se sentiram felizes." O QUE PODEMOS ENTENDER NAS ENTRELINHAS?', objetivo: 'Identificar informação implícita', fase1: '✔ INCLUSÃO TRAZ FELICIDADE ✖ EXCLUIR É MELHOR ✖ IGNORAR OS COLEGAS É CORRETO', fase2: '✔ RESPEITAR É IMPORTANTE ✖ SÓ ALGUNS MERECEM BRINCAR ✖ AMIZADE NÃO IMPORTA' },
                            { enunciado: 'TEXTO: "Proteger as florestas é fundamental para o equilíbrio do planeta." QUAL É O PONTO DE VISTA DO AUTOR?', objetivo: 'Reconhecer posicionamento', fase1: '✔ O AUTOR DEFENDE A PROTEÇÃO AMBIENTAL ✖ O AUTOR É CONTRA A NATUREZA ✖ O AUTOR NÃO TEM OPINIÃO', fase2: '✔ DEFENDE O CUIDADO COM O PLANETA ✖ DEFENDE A POLUIÇÃO ✖ NÃO DEFENDE NADA' },
                        ],
                    },
                ],
                acessibilidade: 'Texto segmentado',
                observacoes: 'Inferência guiada',
                bncc: 'EF05LP05',
            }),
        },
        {
            id: 'cap-pt5-02',
            name: 'Produção Textual',
            subject_id: portuguesId,
            order: 21,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Produzir Texto Narrativo',
                        atividades: [
                            { enunciado: 'COMPLETE A HISTÓRIA: "Ontem, Ana encontrou um cachorro perdido..." (1) Ana fez ______. (2) O cachorro ______. (3) No final ______.', objetivo: 'Produzir narrativa com apoio estrutural', fase1: '✔ FRASES GUIADAS DISPONÍVEIS: "Ana levou o cachorro para casa." ✖ SEM APOIO', fase2: '✔ PRODUÇÃO LIVRE COM BANCO DE PALAVRAS ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'ESCREVA 4 FRASES SOBRE COMO FOI SEU DIA. MODELO: (1) Eu cheguei na escola. (2) Eu ______. (3) Depois ______. (4) No final ______.', objetivo: 'Produzir relato simples', fase1: '✔ BANCO DE VERBOS: estudei, brinquei, aprendi, conversei', fase2: '✔ PRODUÇÃO AUTÔNOMA COM CORRETOR VISUAL ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'DESCREVA O QUE VOCÊ VÊ NA IMAGEM EM 3 FRASES SIMPLES. MODELO: "Eu vejo ______.', objetivo: 'Produzir descrição simples', fase1: '✔ BANCO DE PALAVRAS VISÍVEIS: crianças, árvore, banco, bola', fase2: '✔ PRODUÇÃO COM MENOS APOIO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Produzir Texto Opinativo Simples',
                        atividades: [
                            { enunciado: 'ESCREVA UM TEXTO COM 5 FRASES DIZENDO POR QUE DEVEMOS CUIDAR DO PLANETA. USE: porque, então, por isso.', objetivo: 'Produzir texto opinativo simples', fase1: '✔ TEXTO MODELO: "Devemos reciclar porque ajuda a natureza." ✖ SEM MODELO', fase2: '✔ PRODUÇÃO AUTÔNOMA COM 1 CONECTIVO OBRIGATÓRIO ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'VOCÊ ACHA QUE O CELULAR DEVE SER USADO NA ESCOLA? ESCREVA SUA OPINIÃO EM 5 FRASES E JUSTIFIQUE.', objetivo: 'Produzir opinião com justificativa', fase1: '✔ MODELO: "Eu acho que ______ porque ______." ✖ SEM MODELO', fase2: '✔ PRODUÇÃO COM 2 JUSTIFICATIVAS ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'CRIE UMA HISTÓRIA COM PERSONAGEM, PROBLEMA E SOLUÇÃO (MÍNIMO 6 FRASES).', objetivo: 'Produzir narrativa estruturada', fase1: '✔ ORGANIZADOR GRÁFICO EM 3 PARTES DISPONÍVEL ✖ SEM APOIO', fase2: '✔ PRODUÇÃO LIVRE COM CHECKLIST NARRATIVO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo estrutural',
                observacoes: 'Parágrafos guiados',
                bncc: 'EF05LP09',
            }),
        },
        {
            id: 'cap-pt5-03',
            name: 'Coesão Textual',
            subject_id: portuguesId,
            order: 22,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Sequência Lógica',
                        atividades: [
                            { enunciado: 'TEXTO: "João estudou para a prova. ____ ele tirou nota boa." COMPLETE COM A PALAVRA QUE LIGA AS FRASES.', objetivo: 'Identificar conectivo simples', fase1: '✔ POR ISSO ✖ MAS ✖ OU', fase2: '✔ ENTÃO ✖ PORÉM ✖ PORQUE' },
                            { enunciado: 'TEXTO: "Maria queria brincar, ____ estava chovendo." QUAL PALAVRA COMPLETA CORRETAMENTE?', objetivo: 'Reconhecer conectivo de oposição', fase1: '✔ MAS ✖ PORQUE ✖ ENTÃO', fase2: '✔ PORÉM ✖ POR ISSO ✖ E' },
                            { enunciado: 'TEXTO: "Pedro estava cansado. ____ foi dormir cedo." QUAL CONECTIVO INDICA CONSEQUÊNCIA?', objetivo: 'Reconhecer relação causa-consequência', fase1: '✔ POR ISSO ✖ MAS ✖ OU', fase2: '✔ ENTÃO ✖ PORÉM ✖ E' },
                            { enunciado: 'ORGANIZE AS FRASES: (1) ELE ESTUDOU MUITO. (2) JOÃO QUERIA PASSAR NA PROVA. (3) ELE CONSEGUIU NOTA ALTA.', objetivo: 'Sequenciar ideias logicamente', fase1: '✔ ORDEM: 2 → 1 → 3', fase2: '✔ CONFIRMAÇÃO VISUAL EM VERDE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Produzir Texto Coeso com Conectivos',
                        atividades: [
                            { enunciado: 'TEXTO: "Ana estava com fome, ____ preparou um lanche." ESCOLHA O CONECTIVO QUE MELHOR EXPLICA A RELAÇÃO.', objetivo: 'Inferir conectivo adequado', fase1: '✔ ENTÃO ✖ PORÉM ✖ EMBORA', fase2: '✔ POR ISSO ✖ MAS ✖ OU' },
                            { enunciado: 'ESCREVA UM TEXTO EXPLICANDO POR QUE A AMIZADE É IMPORTANTE. USE PELO MENOS 1 CONECTIVO (porque, além disso, então).', objetivo: 'Produzir texto coeso com conectivo', fase1: '✔ LISTA VISUAL DE CONECTIVOS + BANCO DE IDEIAS ✖ SEM APOIO', fase2: '✔ PRODUÇÃO AUTÔNOMA COM CONECTIVO OBRIGATÓRIO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Modelo estruturado em blocos',
                observacoes: 'Conectivos destacados',
                bncc: 'EF05LP07',
            }),
        },
    ];

    for (const cap of capitulosPortugues5) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosPortugues5.length} pílulas de Português criadas.`);

    // ─── PÍLULAS – MATEMÁTICA ─────────────────────────────────────────────────
    console.log('💊 Criando pílulas do 5º Ano – Matemática...');

    const capitulosMatematica5 = [
        {
            id: 'cap-ma5-01',
            name: 'Frações Equivalentes',
            subject_id: matematicaId,
            order: 28,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Frações Equivalentes',
                        atividades: [
                            { enunciado: 'NA TELA APARECE UMA PIZZA DIVIDIDA EM 4 PARTES IGUAIS. DUAS PARTES ESTÃO COLORIDAS. QUAL FRAÇÃO REPRESENTA A PARTE COLORIDA?', objetivo: 'Representar fração simples', fase1: '✔ 2/4 ✖ 1/4 ✖ 4/2', fase2: '✔ 1/2 ✖ 3/4 ✖ 4/4' },
                            { enunciado: 'QUAL FRAÇÃO É EQUIVALENTE A 2/4?', objetivo: 'Reconhecer fração equivalente', fase1: '✔ 1/2 ✖ 2/8 ✖ 4/2', fase2: '✔ 3/6 ✖ 1/4 ✖ 2/5' },
                            { enunciado: 'BARRA DIVIDIDA EM 10 PARTES IGUAIS. 3 PARTES COLORIDAS. QUAL FRAÇÃO REPRESENTA A PARTE COLORIDA?', objetivo: 'Relacionar parte e todo', fase1: '✔ 3/10 ✖ 10/3 ✖ 7/10', fase2: '✔ 0,3 ✖ 3,0 ✖ 30,0' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Problemas com Equivalência',
                        atividades: [
                            { enunciado: 'JOÃO COMEU 1/4 DE UMA PIZZA E MARIA COMEU 1/4. QUANTO FOI COMIDO AO TODO?', objetivo: 'Resolver soma simples de frações iguais', fase1: '✔ 2/4 ✖ 1/8 ✖ 1/4', fase2: '✔ 1/2 ✖ 3/4 ✖ 4/4' },
                            { enunciado: '0,75 REPRESENTA QUAL FRAÇÃO?', objetivo: 'Converter decimal em fração com centésimos', fase1: '✔ 75/100 ✖ 7/5 ✖ 3/4', fase2: '✔ 3/4 ✖ 75/10 ✖ 7/10' },
                        ],
                    },
                ],
                acessibilidade: 'Representação visual concreta',
                observacoes: 'Cores contrastantes',
                bncc: 'EF05MA06',
            }),
        },
        {
            id: 'cap-ma5-02',
            name: 'Frações e Decimais',
            subject_id: matematicaId,
            order: 29,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Representar Fração e Decimal',
                        atividades: [
                            { enunciado: 'APARECE O NÚMERO 0,5 NA TELA. QUAL FRAÇÃO REPRESENTA 0,5?', objetivo: 'Converter decimal simples em fração', fase1: '✔ 1/2 ✖ 5/10 ✖ 2/5', fase2: '✔ 5/10 ✖ 1/5 ✖ 10/5' },
                            { enunciado: '0,2 REPRESENTA QUANTOS DÉCIMOS?', objetivo: 'Reconhecer décimos', fase1: '✔ 2 DÉCIMOS ✖ 20 DÉCIMOS ✖ 1 DÉCIMO', fase2: '✔ 0,2 = 2/10 ✖ 2/100 ✖ 20/100' },
                            { enunciado: '1 CHOCOLATE DIVIDIDO EM 8 PARTES. 4 PARTES COMIDAS. QUAL FRAÇÃO FOI COMIDA?', objetivo: 'Identificar fração em situação concreta', fase1: '✔ 4/8 ✖ 8/4 ✖ 1/8', fase2: '✔ 1/2 ✖ 2/8 ✖ 8/8' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver Problema com Fração e Decimal',
                        atividades: [
                            { enunciado: 'UM PRODUTO CUSTA R$ 2,50 E OUTRO CUSTA R$ 1,25. QUAL É O VALOR TOTAL?', objetivo: 'Resolver adição com decimais', fase1: '✔ 3,75 ✖ 3,50 ✖ 4,75', fase2: '✔ 3,75 CORRETO ✖ 2,75 ✖ 5,00' },
                            { enunciado: 'UMA GARRAFA TEM 1 LITRO. FORAM USADOS 0,25 L. QUANTO RESTA?', objetivo: 'Resolver subtração com decimal simples', fase1: '✔ 0,75 ✖ 0,25 ✖ 1,25', fase2: '✔ 3/4 ✖ 1/4 ✖ 2/4' },
                        ],
                    },
                ],
                acessibilidade: 'Visual concreto',
                observacoes: 'Passo estruturado',
                bncc: 'EF05MA07',
            }),
        },
        {
            id: 'cap-ma5-03',
            name: 'Problemas Complexos',
            subject_id: matematicaId,
            order: 30,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Dados',
                        atividades: [
                            { enunciado: 'UMA ESCOLA COMPROU 5 CAIXAS COM 10 LÁPIS EM CADA CAIXA. QUANTOS LÁPIS FORAM COMPRADOS AO TODO?', objetivo: 'Identificar dados e operação necessária', fase1: '✔ 50 ✖ 15 ✖ 100', fase2: '✔ 5 x 10 = 50 ✖ 5 + 10 = 15 ✖ 10 - 5 = 5' },
                            { enunciado: 'JOÃO TINHA 30 FIGURINHAS. ELE DEU 12 PARA UM AMIGO. COM QUANTAS FICOU?', objetivo: 'Reconhecer subtração necessária', fase1: '✔ 18 ✖ 42 ✖ 12', fase2: '✔ 30 - 12 = 18 ✖ 30 + 12 = 42 ✖ 12 - 30 = 18' },
                            { enunciado: 'EM UMA SALA HÁ 4 FILAS COM 6 CADEIRAS EM CADA FILA. QUANTAS CADEIRAS HÁ AO TODO?', objetivo: 'Identificar multiplicação em organização espacial', fase1: '✔ 24 ✖ 10 ✖ 12', fase2: '✔ 4 x 6 = 24 ✖ 4 + 6 = 10 ✖ 6 - 4 = 2' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Resolver 2 Operações',
                        atividades: [
                            { enunciado: 'UMA LOJA VENDEU 3 CAIXAS COM 12 CHOCOLATES CADA. DEPOIS VENDEU MAIS 10. QUANTOS FORAM VENDIDOS AO TODO?', objetivo: 'Resolver problema com 2 operações', fase1: '✔ 46 ✖ 36 ✖ 22', fase2: '✔ (3 x 12) + 10 = 46 ✖ 3 + 12 + 10 = 25 ✖ 12 + 10 = 22' },
                            { enunciado: 'UMA ESCOLA COMPROU 5 PACOTES COM 20 FOLHAS CADA. USARAM 30 FOLHAS. QUANTAS RESTARAM?', objetivo: 'Aplicar multiplicação e subtração', fase1: '✔ 70 ✖ 100 ✖ 50', fase2: '✔ (5 x 20) - 30 = 70 ✖ 5 + 20 - 30 = -5 ✖ 20 - 5 = 15' },
                            { enunciado: 'CADA INGRESSO CUSTA R$ 15. UMA FAMÍLIA COMPROU 4 INGRESSOS. SE PAGARAM R$ 100, QUANTO DE TROCO?', objetivo: 'Resolver multiplicação e subtração monetária', fase1: '✔ TOTAL R$ 60 E TROCO R$ 40 ✖ TOTAL R$ 45 TROCO R$ 55 ✖ TOTAL R$ 100 TROCO R$ 0', fase2: '✔ 4 x 15 = 60 / 100 - 60 = 40 ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Etapas numeradas',
                observacoes: 'Sem tempo limite',
                bncc: 'EF05MA08',
            }),
        },
        {
            id: 'cap-ma5-04',
            name: 'Gráficos e Tabelas Complexas',
            subject_id: matematicaId,
            order: 31,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Ler Tabela de Dupla Entrada',
                        atividades: [
                            { enunciado: 'OBSERVE A TABELA: CIDADE A – 10.000 HABITANTES; CIDADE B – 50.000 HABITANTES. QUAL CIDADE TEM MAIOR POPULAÇÃO?', objetivo: 'Interpretar dado numérico em tabela', fase1: '✔ CIDADE B ✖ CIDADE A ✖ SÃO IGUAIS', fase2: '✔ 50.000 É MAIOR QUE 10.000 ✖ 10.000 É MAIOR ✖ NÃO É POSSÍVEL SABER' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Interpretar Dados Comparativos',
                        atividades: [
                            { enunciado: 'NA TABELA DE DUPLA ENTRADA: QUANTOS ALUNOS PREFEREM FUTEBOL E SÃO DO 5º ANO?', objetivo: 'Ler dado em tabela de dupla entrada', fase1: '✔ VALOR CORRETO NA CÉLULA ✖ LINHA ERRADA ✖ COLUNA ERRADA', fase2: '✔ DADO CORRETO ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'COMPARE OS DADOS DO GRÁFICO: EM QUAL ANO HOUVE MAIS VENDAS?', objetivo: 'Interpretar tendência comparativa', fase1: '✔ ANO COM MAIOR BARRA/VALOR ✖ ANO COM MENOR ✖ NÃO É POSSÍVEL SABER', fase2: '✔ DADO CORRETO ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Destaque visual nos dados',
                observacoes: 'Pergunta objetiva antes da análise',
                bncc: 'EF05MA24',
            }),
        },
    ];

    for (const cap of capitulosMatematica5) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosMatematica5.length} pílulas de Matemática criadas.`);

    // ─── PÍLULAS – CONHECIMENTOS GERAIS ───────────────────────────────────────
    console.log('💊 Criando pílulas do 5º Ano – Conhecimentos Gerais...');

    const capitulosConhecimentos5 = [
        {
            id: 'cap-cg5-01',
            name: 'Sistema Digestório',
            subject_id: conhecimentosId,
            order: 32,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Órgãos',
                        atividades: [
                            { enunciado: 'CLIQUE NO ÓRGÃO QUE INICIA A DIGESTÃO DOS ALIMENTOS.', objetivo: 'Identificar órgão principal', fase1: '✔ BOCA ✖ ESTÔMAGO ✖ INTESTINO', fase2: '✔ A DIGESTÃO COMEÇA NA BOCA ✖ COMEÇA NO PÉ ✖ COMEÇA NO CORAÇÃO' },
                            { enunciado: 'TEXTO: "O estômago mistura o alimento com o suco gástrico." QUAL É A FUNÇÃO DO ESTÔMAGO?', objetivo: 'Identificar função básica', fase1: '✔ MISTURAR E DIGERIR O ALIMENTO ✖ RESPIRAR ✖ BOMBEAR SANGUE', fase2: '✔ AJUDAR NA DIGESTÃO ✖ PRODUZIR OSSOS ✖ CONTROLAR MOVIMENTOS' },
                            { enunciado: 'O QUE ACONTECE NO INTESTINO?', objetivo: 'Reconhecer função simples', fase1: '✔ ABSORVER NUTRIENTES ✖ PRODUZIR AR ✖ FAZER O CORAÇÃO BATER', fase2: '✔ RETIRAR VITAMINAS DOS ALIMENTOS ✖ PRODUZIR OSSOS ✖ RESPIRAR' },
                            { enunciado: 'ORGANIZE A ORDEM DA DIGESTÃO: BOCA – ESTÔMAGO – INTESTINO.', objetivo: 'Sequenciar órgãos principais', fase1: '✔ BOCA → ESTÔMAGO → INTESTINO ✖ ESTÔMAGO → BOCA → INTESTINO ✖ INTESTINO → BOCA → ESTÔMAGO', fase2: '✔ ORDEM CORRETA CONFIRMADA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Explicar Função Integrada',
                        atividades: [
                            { enunciado: 'TEXTO: "A digestão começa na boca com a mastigação e continua no estômago." QUAL É A FUNÇÃO INTEGRADA DA BOCA E DO ESTÔMAGO?', objetivo: 'Compreender processo integrado', fase1: '✔ INICIAR E CONTINUAR A DIGESTÃO ✖ PRODUZIR SANGUE ✖ CONTROLAR MOVIMENTO', fase2: '✔ TRANSFORMAR O ALIMENTO EM PARTES MENORES ✖ RESPIRAR ✖ OUVIR' },
                            { enunciado: 'SE O INTESTINO NÃO ABSORVER NUTRIENTES, O QUE PODE ACONTECER?', objetivo: 'Inferir consequência simples', fase1: '✔ FALTA DE ENERGIA NO CORPO ✖ CRESCER MAIS RÁPIDO ✖ RESPIRAR MELHOR', fase2: '✔ FRAQUEZA E CANSAÇO ✖ MAIS FORÇA ✖ MAIS OSSOS' },
                            { enunciado: 'POR QUE MASTIGAR BEM É IMPORTANTE?', objetivo: 'Inferir relação funcional', fase1: '✔ FACILITA A DIGESTÃO ✖ ATRAPALHA O CORAÇÃO ✖ PRODUZ MAIS OSSOS', fase2: '✔ TORNA O ALIMENTO MENOR PARA DIGERIR ✖ PRODUZ AR ✖ FAZ O CORPO PARAR' },
                        ],
                    },
                ],
                acessibilidade: 'Esquema simplificado',
                observacoes: 'Um sistema por vez',
                bncc: 'EF05CI06',
            }),
        },
        {
            id: 'cap-cg5-02',
            name: 'Transformações da Matéria',
            subject_id: conhecimentosId,
            order: 33,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Mudança Física',
                        atividades: [
                            { enunciado: 'QUANDO O GELO DERRETE, O QUE ACONTECEU COM A ÁGUA?', objetivo: 'Identificar mudança de estado físico', fase1: '✔ MUDOU DE SÓLIDO PARA LÍQUIDO ✖ DESAPARECEU ✖ VIROU GÁS IMEDIATAMENTE', fase2: '✔ TRANSFORMAÇÃO FÍSICA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'RASGAR UM PAPEL É UMA MUDANÇA FÍSICA OU QUÍMICA?', objetivo: 'Classificar tipo de mudança', fase1: '✔ FÍSICA ✖ QUÍMICA ✖ NÃO É MUDANÇA', fase2: '✔ FÍSICA – A SUBSTÂNCIA NÃO MUDA ✖ QUÍMICA ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Diferenciar Física e Química Simples',
                        atividades: [
                            { enunciado: 'QUEIMAR PAPEL É UMA MUDANÇA FÍSICA OU QUÍMICA?', objetivo: 'Diferenciar mudança física de química', fase1: '✔ QUÍMICA – A SUBSTÂNCIA MUDA PARA CINZAS ✖ FÍSICA ✖ NÃO É MUDANÇA', fase2: '✔ MUDANÇA QUÍMICA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'QUAL EXEMPLO ABAIXO É UMA MUDANÇA FÍSICA?', objetivo: 'Comparar exemplos de mudança', fase1: '✔ DERRETER GELO ✖ QUEIMAR MADEIRA ✖ ENFERRUJAR FERRO', fase2: '✔ MUDANÇA FÍSICA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Animação curta explicativa',
                observacoes: 'Comparação concreta',
                bncc: 'EF05CI02',
            }),
        },
        {
            id: 'cap-cg5-03',
            name: 'Formação do Brasil',
            subject_id: conhecimentosId,
            order: 34,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Período Histórico',
                        atividades: [
                            { enunciado: 'TEXTO: "Em 1500, os portugueses chegaram ao território que hoje chamamos Brasil." QUEM CHEGOU AO BRASIL EM 1500?', objetivo: 'Identificar período e fato histórico', fase1: '✔ PORTUGUESES ✖ ITALIANOS ✖ JAPONESES', fase2: '✔ CHEGADA DOS PORTUGUESES EM 1500 ✖ INDEPENDÊNCIA ✖ REPÚBLICA' },
                            { enunciado: 'TEXTO: "Antes da chegada dos portugueses, os povos indígenas já viviam no Brasil." QUEM VIVIA NO BRASIL ANTES DOS PORTUGUESES?', objetivo: 'Reconhecer povos originários', fase1: '✔ POVOS INDÍGENAS ✖ REIS EUROPEUS ✖ PRESIDENTES', fase2: '✔ INDÍGENAS JÁ HABITAVAM O TERRITÓRIO ✖ O BRASIL ERA VAZIO ✖ NÃO HAVIA PESSOAS' },
                            { enunciado: 'TEXTO: "Em 1822, Dom Pedro declarou a Independência do Brasil." O QUE ACONTECEU EM 1822?', objetivo: 'Reconhecer evento histórico', fase1: '✔ INDEPENDÊNCIA DO BRASIL ✖ DESCOBRIMENTO ✖ PROCLAMAÇÃO DA REPÚBLICA', fase2: '✔ O BRASIL DEIXOU DE SER COLÔNIA ✖ COMEÇOU A COLONIZAÇÃO ✖ VIRAMOS REPÚBLICA' },
                            { enunciado: 'ORGANIZE NA ORDEM CORRETA: DESCOBRIMENTO, COLÔNIA, INDEPENDÊNCIA.', objetivo: 'Sequenciar períodos históricos', fase1: '✔ DESCOBRIMENTO → COLÔNIA → INDEPENDÊNCIA ✖ COLÔNIA → DESCOBRIMENTO → INDEPENDÊNCIA ✖ INDEPENDÊNCIA → DESCOBRIMENTO → COLÔNIA', fase2: '✔ ORDEM CORRETA DESTACADA ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Fatos',
                        atividades: [
                            { enunciado: 'TEXTO: "Os africanos foram trazidos ao Brasil como escravizados para trabalhar nas plantações." QUAL FOI UMA CONSEQUÊNCIA DA ESCRAVIDÃO NO BRASIL?', objetivo: 'Identificar consequência histórica', fase1: '✔ DESIGUALDADE SOCIAL ✖ MAIS IGUALDADE ✖ FIM DO TRABALHO', fase2: '✔ INJUSTIÇA HISTÓRICA ✖ PROGRESSO IMEDIATO ✖ FIM DA COLÔNIA' },
                            { enunciado: 'TEXTO: "A mistura entre povos indígenas, africanos e europeus formou a cultura brasileira." O QUE ESSA MISTURA PRODUZIU?', objetivo: 'Relacionar fatos culturais', fase1: '✔ DIVERSIDADE CULTURAL ✖ UMA ÚNICA CULTURA EUROPEIA ✖ FIM DAS TRADIÇÕES', fase2: '✔ CULTURA BRASILEIRA DIVERSA ✖ CULTURA SEM MISTURA ✖ APENAS CULTURA PORTUGUESA' },
                        ],
                    },
                ],
                acessibilidade: 'Linha do tempo visual',
                observacoes: 'Sequência fixa',
                bncc: 'EF05HI03',
            }),
        },
        {
            id: 'cap-cg5-04',
            name: 'População e Território',
            subject_id: conhecimentosId,
            order: 35,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Interpretar Mapa',
                        atividades: [
                            { enunciado: 'TEXTO: "O Brasil é dividido em estados. Cada estado tem cidades e população." O QUE É POPULAÇÃO?', objetivo: 'Identificar conceito básico', fase1: '✔ CONJUNTO DE PESSOAS QUE VIVEM EM UM LUGAR ✖ CONJUNTO DE ÁRVORES ✖ CONJUNTO DE ANIMAIS', fase2: '✔ PESSOAS QUE MORAM NA CIDADE ✖ APENAS OS PRÉDIOS ✖ SOMENTE AS RUAS' },
                            { enunciado: 'MAPA DO BRASIL COM 5 REGIÕES COLORIDAS. QUANTAS REGIÕES O BRASIL TEM?', objetivo: 'Reconhecer divisão territorial', fase1: '✔ 5 ✖ 3 ✖ 7', fase2: '✔ CINCO REGIÕES BRASILEIRAS ✖ TRÊS REGIÕES ✖ DEZ REGIÕES' },
                            { enunciado: 'NO MAPA DO BRASIL, CLIQUE NA REGIÃO NORDESTE.', objetivo: 'Localizar região no mapa interativo', fase1: '✔ NORDESTE CORRETO DESTACADO', fase2: '✔ CONFIRMAÇÃO VISUAL COM COR VERDE ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Dados',
                        atividades: [
                            { enunciado: 'TEXTO: "A região Sudeste é a mais populosa do Brasil." O QUE SIGNIFICA REGIÃO MAIS POPULOSA?', objetivo: 'Relacionar conceito e dado', fase1: '✔ REGIÃO COM MAIS PESSOAS ✖ REGIÃO MAIOR EM TAMANHO ✖ REGIÃO COM MAIS FLORESTAS', fase2: '✔ MAIS HABITANTES ✖ MAIS TERRITÓRIO ✖ MAIS RIOS' },
                            { enunciado: 'TEXTO: "Algumas regiões têm mais indústrias. Outras têm mais agricultura." O QUE MUDA ENTRE AS REGIÕES DO BRASIL?', objetivo: 'Relacionar território e atividade econômica', fase1: '✔ ATIVIDADES ECONÔMICAS ✖ COR DO CÉU ✖ TAMANHO DOS PRÉDIOS', fase2: '✔ PRODUÇÃO E TRABALHO ✖ APENAS CLIMA ✖ APENAS RIOS' },
                        ],
                    },
                ],
                acessibilidade: 'Mapa simplificado',
                observacoes: 'Referência concreta',
                bncc: 'EF05GE04',
            }),
        },
        {
            id: 'cap-cg5-05',
            name: 'Regiões Brasileiras e Economia',
            subject_id: conhecimentosId,
            order: 36,
            content: JSON.stringify({
                etapa: '5º Ano',
                perfil: 'DI + TEA',
                blocos: [
                    {
                        bloco: 'BLOCO I – NÍVEL 1 – Identificar Atividade Econômica',
                        atividades: [
                            { enunciado: 'QUAL ATIVIDADE ECONÔMICA É MAIS COMUM NA REGIÃO NORDESTE?', objetivo: 'Identificar atividade econômica regional', fase1: '✔ AGRICULTURA E PESCA ✖ MINERAÇÃO INTENSA ✖ APENAS INDÚSTRIA', fase2: '✔ ATIVIDADE ECONÔMICA CORRETA ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'QUAL REGIÃO DO BRASIL TEM MAIS INDÚSTRIAS?', objetivo: 'Relacionar região a atividade', fase1: '✔ SUDESTE ✖ NORTE ✖ CENTRO-OESTE', fase2: '✔ SUDESTE (SÃO PAULO) ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                    {
                        bloco: 'BLOCO II – NÍVEL 2 – Relacionar Produção e Território',
                        atividades: [
                            { enunciado: 'POR QUE A REGIÃO SUL É CONHECIDA PELA AGRICULTURA?', objetivo: 'Relacionar clima e produção agrícola', fase1: '✔ CLIMA FAVORÁVEL E SOLO FÉRTIL ✖ TEM MAIS CIDADES ✖ É A REGIÃO MAIOR', fase2: '✔ CONDIÇÕES NATURAIS FAVORECEM ✖ DISTRATOR A ✖ DISTRATOR B' },
                            { enunciado: 'ONDE ESTÁ LOCALIZADA A MAIOR PRODUÇÃO DE SOJA DO BRASIL?', objetivo: 'Localizar produção no território', fase1: '✔ CENTRO-OESTE ✖ NORDESTE ✖ SUDESTE', fase2: '✔ CENTRO-OESTE E SUL ✖ DISTRATOR A ✖ DISTRATOR B' },
                        ],
                    },
                ],
                acessibilidade: 'Mapa simplificado com ícones',
                observacoes: 'Comparação concreta',
                bncc: 'EF05GE05',
            }),
        },
    ];

    for (const cap of capitulosConhecimentos5) {
        await prisma.chapter.upsert({
            where: { id: cap.id },
            update: cap,
            create: cap,
        });
    }
    console.log(`✅ ${capitulosConhecimentos5.length} pílulas de Conhecimentos Gerais criadas.`);

    // ─── BNCC – 5º ANO ────────────────────────────────────────────────────────
    console.log('📚 Criando competências BNCC do 5º Ano...');

    const bnccList5 = [
        { id: 'bncc-ef05lp05', code: 'EF05LP05', title: 'Compreensão – Interpretação e inferência', description: 'Identificar argumento explícito e inferir intenção do autor em texto segmentado com inferência guiada passo a passo.', stage: '5º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef05lp09', code: 'EF05LP09', title: 'Produção – Narrativo e opinativo', description: 'Produzir texto narrativo e texto opinativo simples com modelo estrutural e parágrafos guiados.', stage: '5º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef05lp07', code: 'EF05LP07', title: 'Coesão – Conectivos e sequência lógica', description: 'Identificar sequência lógica e produzir texto coeso com conectivos usando modelo estruturado em blocos com conectivos destacados.', stage: '5º Ano', subject: 'Língua Portuguesa' },
        { id: 'bncc-ef05ma06', code: 'EF05MA06', title: 'Frações – Equivalência', description: 'Identificar frações equivalentes e resolver problemas com equivalência com representação visual concreta e cores contrastantes.', stage: '5º Ano', subject: 'Matemática' },
        { id: 'bncc-ef05ma07', code: 'EF05MA07', title: 'Sistema decimal – Frações e decimais', description: 'Representar décimos e centésimos e resolver operações com decimal usando material concreto digital com fragmentação da operação.', stage: '5º Ano', subject: 'Matemática' },
        { id: 'bncc-ef05ma08', code: 'EF05MA08', title: 'Resolução – Problemas com múltiplas etapas', description: 'Identificar operações necessárias e resolver problemas com 2-3 etapas usando etapas numeradas visíveis e modelo fixo.', stage: '5º Ano', subject: 'Matemática' },
        { id: 'bncc-ef05ma24', code: 'EF05MA24', title: 'Estatística – Gráficos e tabelas complexas', description: 'Ler tabela de dupla entrada e interpretar dados comparativos com destaque visual nos dados e pergunta objetiva antes da análise.', stage: '5º Ano', subject: 'Matemática' },
        { id: 'bncc-ef05ci02', code: 'EF05CI02', title: 'Ciências – Transformações da matéria', description: 'Identificar mudança física e diferenciar física de química simples com animação curta explicativa e comparação concreta.', stage: '5º Ano', subject: 'Ciências' },
        { id: 'bncc-ef05ci06', code: 'EF05CI06', title: 'Ciências – Sistema digestório', description: 'Identificar órgãos principais e explicar função integrada do sistema digestório com esquema simplificado, um sistema por vez.', stage: '5º Ano', subject: 'Ciências' },
        { id: 'bncc-ef05hi03', code: 'EF05HI03', title: 'História – Formação do Brasil', description: 'Identificar período histórico e relacionar fatos da formação do Brasil com linha do tempo estruturada e sequência previsível.', stage: '5º Ano', subject: 'História' },
        { id: 'bncc-ef05ge04', code: 'EF05GE04', title: 'Geografia – População e território', description: 'Interpretar mapa e relacionar dados populacionais e territoriais com mapa simplificado e referência concreta.', stage: '5º Ano', subject: 'Geografia' },
        { id: 'bncc-ef05ge05', code: 'EF05GE05', title: 'Geografia – Regiões e economia', description: 'Identificar atividade econômica regional e relacionar produção e território com mapa simplificado com ícones e comparação concreta.', stage: '5º Ano', subject: 'Geografia' },
    ];

    for (const bncc of bnccList5) {
        await prisma.bnccCompetence.upsert({
            where: { id: bncc.id },
            update: bncc,
            create: bncc,
        });
    }
    console.log(`✅ ${bnccList5.length} competências BNCC do 5º Ano criadas.`);

    console.log('🎉 Seed do 5º Ano concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
