# Inclusiva Mente Educa

## Especificação Técnica Completa - Back-End &

## Front-End

### Plataforma Educacional Inclusiva com Base na BNCC

```
Data: 06 de março de 2026 | Versão: 2.0 (Atualizado com Módulo Tutor) | Status: Aprovado para Desenvolvimento
```
### ÍNDICE COMPLETO

1. Visão Geral da Plataforma
2. Arquitetura do Sistema
3. Back-End Detalhado (8 Módulos)
    3.1. Módulo Usuários e Cadastro
    3.2. Módulo Anamnese
    3.3. Módulo Perfil Cognitivo
    3.4. Módulo Atividades/Games
    3.5. Módulo Relatórios Analíticos
    3.6. Módulo Tutor - Indicação e Acompanhamento (NOVO)
    3.7. Módulo Troca 360 Graus
    3.8. Módulo BNCC
4. Front-End Detalhado (18 Telas)
5. Integrações Externas
6. Algoritmos Críticos
7. Checklist Completo de Entrega

## PARTE 1: VISÃO GERAL DA PLATAFORMA

### Objetivo:


Plataforma educacional para crianças típicas e atípicas, focada em alfabetização e reforço escolar
através de games educacionais, com personalização baseada em anamnese completa e relatórios
neuropedagógicos.

### Público-Alvo:

```
Crianças em fase de alfabetização (5-10 anos)
Crianças típicas e atípicas (TEA, TDAH, Dislexia, etc.)
Escolas públicas e particulares
Pais/responsáveis
```
### Base Pedagógica:

```
Fundamentada na BNCC (Base Nacional Comum Curricular)
Avaliação neuropedagógica contínua
Personalização automática do perfil cognitivo
Análise de autonomia e necessidade de tutor (NOVO)
```
### Stack Tecnológica Recomendada:

Back-End: Node.js + Express.js (API REST), PostgreSQL (banco de dados principal), Redis (cache e
filas), JWT (autenticação).

Front-End: React.js + TypeScript, Tailwind CSS, Axios para API, Chart.js para gráficos.

Integrações: Twilio/Z-API (WhatsApp), SendGrid (E-mail), API própria da plataforma de games.

## PARTE 2: ARQUITETURA DO SISTEMA

### Diagrama de Arquitetura:

```
┌─────────────────┐
│ FRONT-END │
│ (React.js) │
│ Painel ADM │
└────────┬────────┘
│
│ HTTPS/REST
▼
┌─────────────────┐ ┌──────────────┐
│ BACK-END │◄─────┤ PostgreSQL │
│ (Node.js) │ │ (Banco) │
└────────┬────────┘ └──────────────┘
│
├──────► Plataforma de Games (WebHook)
├──────► WhatsApp API (Twilio/Z-API)
├──────► SendGrid (E-mail)
└──────► Redis (Cache)
```

## PARTE 3: BACK-END DETALHADO

### 3.1. MÓDULO USUÁRIOS E CADASTRO

#### Tabelas:

Tabela: users

```
id (UUID, PK)
name (VARCHAR)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
role (ENUM: 'admin', 'school', 'parent', 'teacher', 'tutor')
school_id (FK → schools.id)
created_at (TIMESTAMP)
```
Tabela: tutors (NOVO)

```
id (UUID, PK)
name (VARCHAR)
email (VARCHAR)
phone (VARCHAR)
school_id (FK → schools.id)
specialty (VARCHAR) -- Ex: TEA, TDAH, Dislexia
created_at (TIMESTAMP)
```
#### Endpoints:

```
POST /api/auth/register
POST /api/students
GET /api/schools/{id}/tutors (NOVO)
POST /api/tutors (NOVO)
```
#### Regra de Negócio: Tutores são vinculados a escolas específicas e podem ter acesso

#### restrito apenas aos alunos que acompanham.

### 3.2. MÓDULO ANAMNESE

Estrutura para investigação completa do aluno (Saúde, Cognitivo, Social, etc.).

#### Tabelas Principais:

```
anamnesis_spheres (Esferas da investigação)
anamnesis_questions (Perguntas dinâmicas)
```

```
anamnesis_responses (Respostas dos responsáveis)
```
### 3.3. MÓDULO PERFIL COGNITIVO

Algoritmo que determina o nível e estilo de aprendizado do aluno.

#### Tabela: cognitive_profiles

```
cognitive_level (very_low a very_high)
learning_style (visual, auditivo, cinestésico)
special_needs (JSON array: TEA, TDAH...)
```
### 3.4. MÓDULO ATIVIDADES/GAMES

#### Tabela: activity_logs (Atualizada)

```
id (UUID, PK)
student_id (FK)
activity_id (FK)
started_at (TIMESTAMP)
completed_at (TIMESTAMP)
time_spent (INTEGER) -- segundos
errors_count (INTEGER)
correct_count (INTEGER)
difficulty_perceived (ENUM: 'easy', 'medium', 'hard')
has_tutor (BOOLEAN) -- SE HAVIA TUTOR PRESENTE (NOVO)
tutor_id (FK → tutors.id, NULLABLE) -- TUTOR RESPONSÁVEL (NOVO)
autonomy_level (ENUM: 'high', 'medium', 'low') -- NÍVEL DE AUTONOMIA (NOVO)
tutor_intervention_needed (ENUM: 'yes', 'no', 'partial') -- INTERVENÇÃO NECESSÁRIA
(NOVO)
tutor_observations (TEXT) -- OBSERVAÇÕES DO TUTOR (NOVO)
tutor_recommendation (ENUM: 'not_needed', 'sporadic', 'continuous') -- RECOMENDAÇÃO
AUTOMÁTICA (NOVO)
```
#### Endpoints Atualizados:

POST /api/activities/start: Recebe has_tutor e tutor_id.
POST /api/activities/{log_id}/tutor-feedback (NOVO): Endpoint para o tutor registrar
observações pós-atividade.

### 3.5. MÓDULO RELATÓRIOS ANALÍTICOS

Relatórios gerados semanalmente com IA.

#### Campos Novos na Tabela Reports:

```
activities_with_tutor_count (INTEGER)
activities_without_tutor_count (INTEGER)
autonomy_percentage (FLOAT)
tutor_recommendation (ENUM)
```

### 3.6. MÓDULO TUTOR - INDICAÇÃO E ACOMPANHAMENTO (NOVO)

#### Conceito:

```
Sistema inteligente que registra se o aluno realizou atividades com apoio de tutor, analisa o
desempenho e emite recomendação técnica automática sobre a necessidade de
acompanhamento tutorial.
```
#### Funcionalidades:

1. Registro no Momento da Atividade: Pergunta obrigatória "Esta atividade será realizada
    com tutor?" antes do game iniciar.
2. Feedback Pós-Atividade: Tutor deve avaliar o nível de autonomia e necessidade de
    intervenção.
3. Recomendação Automática: Baseada em dados históricos (ver seção Algoritmos).

#### Endpoints Específicos:

```
GET /api/students/{id}/tutor-recommendation
```
```
{
"student_id": "uuid-aluno",
"recommendation": "sporadic",
"status_emoji": "🟡",
"status_text": "O aluno apresenta dificuldades pontuais...",
"metrics": {
"total_activities": 20,
"activities_with_tutor": 8,
"avg_autonomy_level": "medium"
}
}
```
```
GET /api/students/{id}/tutor-history
```
### 3.7. MÓDULO TROCA 360 GRAUS

Check-in semanal automático com famílias via WhatsApp/E-mail.

Novidade: As mensagens agora incluem um bloco sobre "Acompanhamento com Tutor" e perguntas
específicas sobre necessidade de ajuda em casa.

### 3.8. MÓDULO BNCC

Mapeamento de competências e habilidades da Base Nacional Comum Curricular.

## PARTE 4: FRONT-END DETALHADO


### Estrutura de Menu (Sidebar):

Mente Educa > Matérias, Capítulos, Turmas, Alunos, Tutores (NOVO), Graus Parentesco, Esferas
Anamnese, Perguntas, BNCC, Relatórios, Configurações.

### 4.1. Dashboard Principal

Inclui card novo: "Alunos que precisam de tutor" com badge de contagem.

### 4.7. Modal: Iniciar Atividade (ATUALIZADO)

Layout:

```
Título: "Iniciar Atividade: [Nome]"
Pergunta Obrigatória: "Haverá tutor nesta atividade?" (Toggle SIM/NÃO)
Se SIM: Dropdown para selecionar o tutor cadastrado.
```
### 4.8. Formulário: Feedback do Tutor Pós-Atividade (NOVO)

Exibido automaticamente após game com tutor.

```
Nível de autonomia: Alto / Médio / Baixo
Intervenção necessária? Sim / Não / Parcialmente
Observações: Texto livre.
```
### 4.9. Tela: Relatório Analítico (ATUALIZADO)

Inclui seção "Análise de Autonomia e Suporte Tutorial" com badge colorido (🟢🟡🔴) e
recomendação do sistema.

### 4.10. Tela: Histórico de Tutorias (NOVO)

Visualização de linha do tempo e gráficos de barras empilhadas (Com Tutor vs Sem Tutor).

### 4.11. Tela: Cadastro de Tutores (NOVO)

CRUD completo de tutores (Nome, Especialidade, Escola).

### 4.16. Tela: Alunos

Tabela de alunos agora possui coluna "Necessita tutor?" com indicador visual.

## PARTE 5: INTEGRAÇÕES EXTERNAS

### 5.1. Plataforma de Games


Token de sessão JWT agora carrega `has_tutor` e `tutor_id`. Webhook de retorno dispara solicitação
de feedback para o tutor.

### 5.2. WhatsApp (Twilio/Z-API)

Template de mensagem atualizado para incluir resumo de autonomia.

## PARTE 6: ALGORITMOS CRÍTICOS

### 6.3. Algoritmo de Recomendação de Tutor (Lógica Principal)

```
percentual_com_tutor = (atividades_com_tutor / total_atividades) * 100
nivel_autonomia_medio = média dos últimos 10 registros
SE (percentual_com_tutor > 70%) E (nivel_autonomia_medio = "low"):
→ recomendação = "continuous" (🔴 Tutor contínuo necessário)
SE (percentual_com_tutor entre 30% e 70%) E (nivel_autonomia_medio = "medium"):
→ recomendação = "sporadic" (🟡 Suporte esporádico)
SE (percentual_com_tutor < 30%) E (nivel_autonomia_medio = "high"):
→ recomendação = "not_needed" (🟢 Autônomo)
```
## PARTE 7: CHECKLIST COMPLETO DE ENTREGA

### Back-End

```
Tabela users, schools, students criadas.
Tabela tutors criada.
Endpoints de Cadastro e Login.
Endpoints de Tutor (GET/POST) implementados.
Módulo Anamnese completo (Esferas, Perguntas, Respostas).
Algoritmo de Perfil Cognitivo.
Tabela activity_logs com campos de tutor.
Algoritmo de Recomendação de Tutor implementado.
Geração de Relatório Analítico com IA.
Troca 360 Graus (Rotação de Perguntas e Envio).
```
### Front-End

```
Estrutura React + Tailwind configurada.
Dashboard com métricas de tutor.
Tela de Cadastro de Tutores.
```

```
Modal "Iniciar Atividade" com seleção de tutor.
Formulário de Feedback do Tutor.
Relatório Analítico com nova seção de Autonomia.
Tela Histórico de Tutorias (Gráficos).
Listagem de Alunos com filtro de recomendação.
```
### Integrações & Infra

```
Integração Games (Webhook).
WhatsApp e E-mail configurados.
PostgreSQL e Redis em produção.
Segurança (JWT, SSL, Sanitização).
```
```
Documento gerado para uso exclusivo da Plataforma Inclusiva Mente Educa.
Todos os direitos reservados © 2026.
```