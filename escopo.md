# Escopo TÃƒÂ©cnico Completo Ã¢â‚¬â€ Plataforma Inclusiva Mente Educa

## 1. Objetivo do Projeto

Desenvolver uma plataforma educacional inclusiva, web-based, voltada para crianÃƒÂ§as tÃƒÂ­picas e atÃƒÂ­picas em fase de alfabetizaÃƒÂ§ÃƒÂ£o e reforÃƒÂ§o escolar, com personalizaÃƒÂ§ÃƒÂ£o pedagÃƒÂ³gica baseada em anamnese, perfil cognitivo, acompanhamento de atividades educacionais em formato de games, geraÃƒÂ§ÃƒÂ£o de relatÃƒÂ³rios analÃƒÂ­ticos e um mÃƒÂ³dulo especÃƒÂ­fico para indicaÃƒÂ§ÃƒÂ£o e acompanhamento tutorial. O sistema deve ser aderente ÃƒÂ  BNCC e preparado para uso por administradores, escolas, responsÃƒÂ¡veis, professores e tutores.

Este projeto nÃƒÂ£o deve ser tratado como protÃƒÂ³tipo ou prova de conceito. A entrega esperada ÃƒÂ© de uma aplicaÃƒÂ§ÃƒÂ£o funcional, organizada, escalÃƒÂ¡vel, segura e com arquitetura pronta para continuidade de produto. O agente deve implementar backend, frontend administrativo, integraÃƒÂ§ÃƒÂµes e regras de negÃƒÂ³cio centrais do sistema.

---

## 2. VisÃƒÂ£o do Produto

A plataforma deve permitir o cadastro e gestÃƒÂ£o de escolas, usuÃƒÂ¡rios, alunos e tutores, registrar anamneses completas, construir perfis cognitivos automatizados, acompanhar o desempenho do aluno em atividades educacionais, medir autonomia, registrar participaÃƒÂ§ÃƒÂ£o de tutor durante as atividades, gerar relatÃƒÂ³rios analÃƒÂ­ticos e manter comunicaÃƒÂ§ÃƒÂ£o recorrente com famÃƒÂ­lias por canais externos.

O sistema deve priorizar personalizaÃƒÂ§ÃƒÂ£o pedagÃƒÂ³gica, clareza operacional e capacidade analÃƒÂ­tica. O nÃƒÂºcleo da aplicaÃƒÂ§ÃƒÂ£o estÃƒÂ¡ na relaÃƒÂ§ÃƒÂ£o entre dados da anamnese, comportamento do aluno nas atividades, autonomia observada, necessidade de intervenÃƒÂ§ÃƒÂ£o e recomendaÃƒÂ§ÃƒÂ£o automÃƒÂ¡tica sobre suporte tutorial.

---

## 3. Perfis de UsuÃƒÂ¡rio

O sistema deve suportar, no mÃƒÂ­nimo, os seguintes perfis:

- `admin`: controle global da plataforma.
- `school`: gestÃƒÂ£o institucional vinculada ÃƒÂ  escola.
- `parent`: responsÃƒÂ¡vel legal pelo aluno.
- `teacher`: professor com acesso pedagÃƒÂ³gico conforme permissÃƒÂ£o.
- `tutor`: profissional de acompanhamento com acesso restrito aos alunos vinculados.

Cada perfil deve ter permissÃƒÂµes especÃƒÂ­ficas, com controle de acesso por role e escopo institucional.

---

## 4. Diretrizes Gerais de ImplementaÃƒÂ§ÃƒÂ£o

O agente deve construir o projeto com foco em manutenÃƒÂ§ÃƒÂ£o, legibilidade e separaÃƒÂ§ÃƒÂ£o clara de responsabilidades. O cÃƒÂ³digo deve seguir padrÃƒÂ£o profissional, com mÃƒÂ³dulos bem isolados, validaÃƒÂ§ÃƒÂ£o de entrada, tratamento de erros consistente, logs, testes essenciais e documentaÃƒÂ§ÃƒÂ£o mÃƒÂ­nima de execuÃƒÂ§ÃƒÂ£o.

A soluÃƒÂ§ÃƒÂ£o deve ser dividida em:

- **Back-end API REST** responsÃƒÂ¡vel por autenticaÃƒÂ§ÃƒÂ£o, regras de negÃƒÂ³cio, persistÃƒÂªncia, integraÃƒÂ§ÃƒÂµes e processamento analÃƒÂ­tico.
- **Front-end administrativo** responsÃƒÂ¡vel pela operaÃƒÂ§ÃƒÂ£o da plataforma, dashboards, cadastros, relatÃƒÂ³rios e fluxos de acompanhamento.
- **Banco relacional principal** para entidades de negÃƒÂ³cio.
- **Camada de cache e filas** para tarefas assÃƒÂ­ncronas, notificaÃƒÂ§ÃƒÂµes e processamento de relatÃƒÂ³rios.

---

## 5. Stack ObrigatÃƒÂ³ria / Recomendada

### Back-end
- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT para autenticaÃƒÂ§ÃƒÂ£o

### Front-end
- React.js
- TypeScript
- Tailwind CSS
- Axios
- Chart.js

### IntegraÃƒÂ§ÃƒÂµes
- WhatsApp via Twilio ou Z-API
- E-mail via SendGrid
- API prÃƒÂ³pria da plataforma de games via webhook

### Requisitos adicionais de engenharia
- ORM recomendado: Prisma ou Sequelize
- ValidaÃƒÂ§ÃƒÂ£o recomendada: Zod, Yup ou Joi
- Hash de senha com bcrypt
- Controle de ambiente via `.env`
- Docker e Docker Compose para ambiente local
- Estrutura preparada para deploy em produÃƒÂ§ÃƒÂ£o

---

## 6. Arquitetura Esperada

A arquitetura deve seguir o fluxo abaixo:

1. O front-end consome a API via HTTPS/REST.
2. O back-end centraliza autenticaÃƒÂ§ÃƒÂ£o, autorizaÃƒÂ§ÃƒÂ£o, regras de negÃƒÂ³cio e integraÃƒÂ§ÃƒÂµes.
3. O PostgreSQL armazena entidades principais, histÃƒÂ³ricos, relatÃƒÂ³rios e vÃƒÂ­nculos.
4. O Redis deve ser utilizado para cache, filas e tarefas recorrentes.
5. A plataforma de games envia e recebe dados por integraÃƒÂ§ÃƒÂ£o externa, incluindo webhook de retorno.
6. As integraÃƒÂ§ÃƒÂµes de WhatsApp e e-mail devem ser acionadas por eventos do sistema e por rotinas agendadas.

### Requisitos arquiteturais
- SeparaÃƒÂ§ÃƒÂ£o por mÃƒÂ³dulos de domÃƒÂ­nio.
- ServiÃƒÂ§os desacoplados para integraÃƒÂ§ÃƒÂµes externas.
- Camada de autorizaÃƒÂ§ÃƒÂ£o por perfil e escopo.
- Suporte a tarefas assÃƒÂ­ncronas para envio de mensagens e geraÃƒÂ§ÃƒÂ£o de relatÃƒÂ³rios.
- Estrutura preparada para evoluÃƒÂ§ÃƒÂ£o futura sem reescrita total.

---

## 7. MÃƒÂ³dulos de Back-end

## 7.1. MÃƒÂ³dulo de AutenticaÃƒÂ§ÃƒÂ£o, UsuÃƒÂ¡rios e Cadastro

### Objetivo
Gerenciar cadastro, autenticaÃƒÂ§ÃƒÂ£o, autorizaÃƒÂ§ÃƒÂ£o e associaÃƒÂ§ÃƒÂ£o institucional de usuÃƒÂ¡rios, escolas, alunos e tutores.

### Entidades mÃƒÂ­nimas

#### `users`
- `id` UUID PK
- `name`
- `email` ÃƒÂºnico
- `password_hash`
- `role` enum (`admin`, `school`, `parent`, `teacher`, `tutor`)
- `school_id` FK
- `created_at`
- `updated_at`

#### `schools`
- `id` UUID PK
- `name`
- `email`
- `phone`
- `document`
- `address`
- `created_at`
- `updated_at`

#### `students`
- `id` UUID PK
- `name`
- `birth_date`
- `school_id` FK
- `primary_guardian_id` FK opcional
- `grade_level`
- `status`
- `created_at`
- `updated_at`

#### `tutors`
- `id` UUID PK
- `name`
- `email`
- `phone`
- `school_id` FK
- `specialty`
- `created_at`
- `updated_at`

### Regras de negÃƒÂ³cio
- E-mail de usuÃƒÂ¡rio deve ser ÃƒÂºnico.
- Tutor pertence a uma escola especÃƒÂ­fica.
- Tutor sÃƒÂ³ pode visualizar alunos vinculados ao seu acompanhamento.
- UsuÃƒÂ¡rios devem autenticar com JWT.
- O token deve carregar role, user_id e contexto institucional mÃƒÂ­nimo.

### Endpoints mÃƒÂ­nimos
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/students`
- `GET /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `POST /api/tutors`
- `GET /api/schools/:id/tutors`
- `GET /api/tutors/:id`
- `PUT /api/tutors/:id`
- `DELETE /api/tutors/:id`

---

## 7.2. MÃƒÂ³dulo de Anamnese

### Objetivo
Registrar investigaÃƒÂ§ÃƒÂ£o completa do aluno em mÃƒÂºltiplas esferas, com perguntas dinÃƒÂ¢micas e respostas de responsÃƒÂ¡veis.

### Entidades mÃƒÂ­nimas

#### `anamnesis_spheres`
Representa as esferas da investigaÃƒÂ§ÃƒÂ£o, por exemplo saÃƒÂºde, cogniÃƒÂ§ÃƒÂ£o, comportamento, socializaÃƒÂ§ÃƒÂ£o, rotina e aprendizagem.

Campos sugeridos:
- `id`
- `name`
- `description`
- `order_index`
- `is_active`

#### `anamnesis_questions`
Campos sugeridos:
- `id`
- `sphere_id` FK
- `question_text`
- `question_type` (`text`, `single_choice`, `multiple_choice`, `boolean`, `number`)
- `options_json`
- `is_required`
- `order_index`
- `is_active`

#### `anamnesis_responses`
Campos sugeridos:
- `id`
- `student_id` FK
- `question_id` FK
- `answered_by_user_id` FK
- `answer_json`
- `created_at`
- `updated_at`

### Regras de negÃƒÂ³cio
- Perguntas devem ser configurÃƒÂ¡veis via painel.
- Deve ser possÃƒÂ­vel ativar, desativar e reordenar perguntas.
- As respostas devem aceitar estrutura flexÃƒÂ­vel quando necessÃƒÂ¡rio.
- O sistema deve consolidar as respostas para alimentar o perfil cognitivo.

### Endpoints mÃƒÂ­nimos
- `GET /api/anamnesis/spheres`
- `POST /api/anamnesis/spheres`
- `PUT /api/anamnesis/spheres/:id`
- `GET /api/anamnesis/questions`
- `POST /api/anamnesis/questions`
- `PUT /api/anamnesis/questions/:id`
- `GET /api/students/:id/anamnesis`
- `POST /api/students/:id/anamnesis/responses`
- `PUT /api/students/:id/anamnesis/responses`

---

## 7.3. MÃƒÂ³dulo de Perfil Cognitivo

### Objetivo
Gerar e manter um perfil cognitivo automatizado do aluno com base em anamnese, histÃƒÂ³rico de desempenho e sinais relevantes.

### Entidade mÃƒÂ­nima

#### `cognitive_profiles`
- `id`
- `student_id` FK
- `cognitive_level` enum (`very_low`, `low`, `medium`, `high`, `very_high`)
- `learning_style` enum (`visual`, `auditivo`, `cinestesico`)
- `special_needs` JSON array
- `summary`
- `generated_at`
- `updated_at`

### Regras de negÃƒÂ³cio
- O perfil deve ser recalculÃƒÂ¡vel.
- O sistema deve registrar necessidades especiais em estrutura flexÃƒÂ­vel.
- O perfil deve ser utilizado para personalizaÃƒÂ§ÃƒÂ£o futura de atividades e relatÃƒÂ³rios.

### Endpoints mÃƒÂ­nimos
- `GET /api/students/:id/cognitive-profile`
- `POST /api/students/:id/cognitive-profile/recalculate`

---

## 7.4. MÃƒÂ³dulo de Atividades / Games

### Objetivo
Registrar a execuÃƒÂ§ÃƒÂ£o das atividades educacionais, incluindo mÃƒÂ©tricas de desempenho, presenÃƒÂ§a de tutor, autonomia e feedback posterior.

### Entidade principal

#### `activity_logs`
- `id` UUID PK
- `student_id` FK
- `activity_id` FK ou identificador externo
- `started_at`
- `completed_at`
- `time_spent` em segundos
- `errors_count`
- `correct_count`
- `difficulty_perceived` enum (`easy`, `medium`, `hard`)
- `has_tutor` boolean
- `tutor_id` FK nullable
- `autonomy_level` enum (`high`, `medium`, `low`)
- `tutor_intervention_needed` enum (`yes`, `no`, `partial`)
- `tutor_observations` text
- `tutor_recommendation` enum (`not_needed`, `sporadic`, `continuous`)
- `created_at`
- `updated_at`

### Regras de negÃƒÂ³cio
- Antes de iniciar uma atividade, deve ser obrigatÃƒÂ³rio informar se haverÃƒÂ¡ tutor.
- Se `has_tutor = true`, o `tutor_id` deve ser obrigatÃƒÂ³rio.
- ApÃƒÂ³s atividade com tutor, o sistema deve solicitar feedback pÃƒÂ³s-atividade.
- O log deve permitir cÃƒÂ¡lculo histÃƒÂ³rico de autonomia e suporte.

### Endpoints mÃƒÂ­nimos
- `POST /api/activities/start`
- `POST /api/activities/:log_id/finish`
- `POST /api/activities/:log_id/tutor-feedback`
- `GET /api/students/:id/activity-logs`
- `GET /api/activity-logs/:id`

### Payload esperado para iniciar atividade
- `student_id`
- `activity_id`
- `has_tutor`
- `tutor_id` quando aplicÃƒÂ¡vel

### Payload esperado para feedback do tutor
- `autonomy_level`
- `tutor_intervention_needed`
- `tutor_observations`

---

## 7.5. MÃƒÂ³dulo de RelatÃƒÂ³rios AnalÃƒÂ­ticos

### Objetivo
Gerar relatÃƒÂ³rios recorrentes com leitura pedagÃƒÂ³gica e analÃƒÂ­tica do aluno, incluindo mÃƒÂ©tricas de autonomia e recomendaÃƒÂ§ÃƒÂ£o tutorial.

### Entidade mÃƒÂ­nima

#### `reports`
- `id`
- `student_id` FK
- `period_start`
- `period_end`
- `summary_text`
- `activities_with_tutor_count`
- `activities_without_tutor_count`
- `autonomy_percentage`
- `tutor_recommendation`
- `generated_by`
- `generated_at`

### Regras de negÃƒÂ³cio
- RelatÃƒÂ³rios devem poder ser gerados manualmente e automaticamente.
- O sistema deve consolidar dados das atividades, perfil cognitivo e histÃƒÂ³rico tutorial.
- O texto analÃƒÂ­tico deve ser estruturado para leitura administrativa e pedagÃƒÂ³gica.

### Endpoints mÃƒÂ­nimos
- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/students/:id/reports/generate`
- `GET /api/students/:id/reports`

---

## 7.6. MÃƒÂ³dulo Tutor Ã¢â‚¬â€ IndicaÃƒÂ§ÃƒÂ£o e Acompanhamento

### Objetivo
Implementar a lÃƒÂ³gica central de acompanhamento tutorial, medindo dependÃƒÂªncia, autonomia e necessidade de apoio contÃƒÂ­nuo.

### Funcionalidades obrigatÃƒÂ³rias
1. Pergunta obrigatÃƒÂ³ria no inÃƒÂ­cio da atividade sobre presenÃƒÂ§a de tutor.
2. Registro de tutor responsÃƒÂ¡vel, quando houver.
3. Feedback pÃƒÂ³s-atividade com autonomia e necessidade de intervenÃƒÂ§ÃƒÂ£o.
4. CÃƒÂ¡lculo automÃƒÂ¡tico de recomendaÃƒÂ§ÃƒÂ£o tutorial com base no histÃƒÂ³rico.
5. HistÃƒÂ³rico de tutoria por aluno.
6. ExibiÃƒÂ§ÃƒÂ£o da recomendaÃƒÂ§ÃƒÂ£o atual em dashboards, listagens e relatÃƒÂ³rios.

### Endpoints obrigatÃƒÂ³rios
- `GET /api/students/:id/tutor-recommendation`
- `GET /api/students/:id/tutor-history`

### Estrutura mÃƒÂ­nima da resposta de recomendaÃƒÂ§ÃƒÂ£o
```json
{
  "student_id": "uuid-do-aluno",
  "recommendation": "sporadic",
  "status": "warning",
  "status_text": "O aluno apresenta dificuldades pontuais e pode se beneficiar de acompanhamento esporÃƒÂ¡dico.",
  "metrics": {
    "total_activities": 20,
    "activities_with_tutor": 8,
    "avg_autonomy_level": "medium"
  }
}
```

### Regras de acesso
- Admin e escola podem visualizar todos os alunos de seu escopo.
- Tutor visualiza apenas alunos vinculados.
- Professor visualiza conforme permissÃƒÂ£o institucional.

---

## 7.7. MÃƒÂ³dulo Troca 360 Graus

### Objetivo
Executar check-ins semanais automÃƒÂ¡ticos com famÃƒÂ­lias por WhatsApp e/ou e-mail, coletando informaÃƒÂ§ÃƒÂµes complementares sobre evoluÃƒÂ§ÃƒÂ£o, dificuldades e apoio em casa.

### Funcionalidades obrigatÃƒÂ³rias
- Rotina de envio semanal.
- Templates parametrizÃƒÂ¡veis.
- Bloco especÃƒÂ­fico sobre acompanhamento com tutor.
- Perguntas sobre necessidade de ajuda em casa.
- Registro do histÃƒÂ³rico de mensagens enviadas e respostas recebidas.

### Entidades sugeridas
#### `family_checkins`
- `id`
- `student_id`
- `channel` (`whatsapp`, `email`)
- `template_version`
- `sent_at`
- `status`
- `response_json`
- `created_at`

### Endpoints mÃƒÂ­nimos
- `POST /api/checkins/send`
- `GET /api/students/:id/checkins`

### Processamento assÃƒÂ­ncrono
Esse mÃƒÂ³dulo deve usar fila com Redis para disparos em lote e retentativas.

---

## 7.8. MÃƒÂ³dulo BNCC

### Objetivo
Mapear competÃƒÂªncias e habilidades da BNCC para associaÃƒÂ§ÃƒÂ£o com conteÃƒÂºdos, capÃƒÂ­tulos, atividades e leitura analÃƒÂ­tica do desenvolvimento do aluno.

### Entidades sugeridas
#### `bncc_competencies`
- `id`
- `code`
- `title`
- `description`
- `stage`
- `subject`

#### `activities_bncc`
Tabela de relaÃƒÂ§ÃƒÂ£o entre atividade e habilidade BNCC.

### Funcionalidades obrigatÃƒÂ³rias
- CRUD de competÃƒÂªncias/habilidades.
- AssociaÃƒÂ§ÃƒÂ£o entre BNCC e atividades.
- ExibiÃƒÂ§ÃƒÂ£o em relatÃƒÂ³rios e contexto pedagÃƒÂ³gico.

### Endpoints mÃƒÂ­nimos
- `GET /api/bncc`
- `POST /api/bncc`
- `PUT /api/bncc/:id`
- `DELETE /api/bncc/:id`

---

## 8. Modelagem Funcional Complementar

AlÃƒÂ©m das tabelas explicitamente descritas acima, o agente deve estruturar as entidades auxiliares necessÃƒÂ¡rias para o painel e para os relacionamentos do domÃƒÂ­nio, incluindo, quando fizer sentido:

- `subjects`
- `chapters`
- `classes`
- `student_tutors`
- `guardians`
- `kinship_types`
- `activities`
- `notifications`
- `audit_logs`

Essas entidades devem existir sempre que forem necessÃƒÂ¡rias para suportar o menu e os fluxos administrativos previstos.

---

## 9. Algoritmo CrÃƒÂ­tico de RecomendaÃƒÂ§ÃƒÂ£o de Tutor

O algoritmo principal deve seguir a regra abaixo:

```text
percentual_com_tutor = (atividades_com_tutor / total_atividades) * 100
nivel_autonomia_medio = mÃƒÂ©dia qualitativa dos ÃƒÂºltimos 10 registros

Se percentual_com_tutor > 70% e nivel_autonomia_medio = low
  recomendaÃƒÂ§ÃƒÂ£o = continuous

Se percentual_com_tutor entre 30% e 70% e nivel_autonomia_medio = medium
  recomendaÃƒÂ§ÃƒÂ£o = sporadic

Se percentual_com_tutor < 30% e nivel_autonomia_medio = high
  recomendaÃƒÂ§ÃƒÂ£o = not_needed
```

### Regras adicionais obrigatÃƒÂ³rias
- O cÃƒÂ¡lculo deve ignorar alunos sem amostragem mÃƒÂ­nima confiÃƒÂ¡vel, por exemplo menos de 3 atividades concluÃƒÂ­das.
- Em caso de dados insuficientes, retornar status neutro com mensagem informativa.
- O algoritmo deve estar encapsulado em serviÃƒÂ§o prÃƒÂ³prio, testÃƒÂ¡vel e reutilizÃƒÂ¡vel.
- A recomendaÃƒÂ§ÃƒÂ£o calculada deve ser persistida quando apropriado e tambÃƒÂ©m poder ser recalculada sob demanda.

---

## 10. Requisitos do Front-end

O front-end deve ser um painel administrativo moderno, responsivo, organizado por sidebar e com experiÃƒÂªncia de uso clara para operaÃƒÂ§ÃƒÂ£o escolar e pedagÃƒÂ³gica.

### Estrutura mÃƒÂ­nima de menu
- Dashboard
- MatÃƒÂ©rias
- CapÃƒÂ­tulos
- Turmas
- Alunos
- Tutores
- Graus de Parentesco
- Esferas da Anamnese
- Perguntas
- BNCC
- RelatÃƒÂ³rios
- ConfiguraÃƒÂ§ÃƒÂµes

### Diretrizes visuais
- Interface profissional, limpa e institucional.
- ComponentizaÃƒÂ§ÃƒÂ£o consistente.
- Uso de Tailwind CSS com design system simples.
- Tabelas com paginaÃƒÂ§ÃƒÂ£o, filtro e busca.
- FormulÃƒÂ¡rios com validaÃƒÂ§ÃƒÂ£o visual clara.
- GrÃƒÂ¡ficos legÃƒÂ­veis para dados pedagÃƒÂ³gicos e tutorial.
- Estados de loading, vazio, erro e sucesso em todas as telas crÃƒÂ­ticas.

---

## 11. Telas e Fluxos ObrigatÃƒÂ³rios

## 11.1. Dashboard Principal
Deve conter, no mÃƒÂ­nimo:
- mÃƒÂ©tricas gerais da plataforma
- quantidade de alunos
- quantidade de atividades
- indicadores analÃƒÂ­ticos
- card especÃƒÂ­fico de Ã¢â‚¬Å“alunos que precisam de tutorÃ¢â‚¬Â com contagem
- atalhos para aÃƒÂ§ÃƒÂµes recorrentes

## 11.2. Tela de MatÃƒÂ©rias
CRUD para disciplinas ou ÃƒÂ¡reas de conteÃƒÂºdo.

## 11.3. Tela de CapÃƒÂ­tulos
CRUD de capÃƒÂ­tulos ou unidades vinculadas ÃƒÂ s matÃƒÂ©rias.

## 11.4. Tela de Turmas
CRUD de turmas, com associaÃƒÂ§ÃƒÂ£o de alunos e escola.

## 11.5. Tela de Alunos
Deve listar alunos com filtros e coluna visual indicando necessidade de tutor. Deve permitir acesso ao perfil completo do aluno, incluindo anamnese, atividades, perfil cognitivo, relatÃƒÂ³rios e histÃƒÂ³rico tutorial.

## 11.6. Tela de Detalhe do Aluno
Deve consolidar dados do aluno em abas ou seÃƒÂ§ÃƒÂµes:
- dados cadastrais
- anamnese
- perfil cognitivo
- atividades
- relatÃƒÂ³rios
- recomendaÃƒÂ§ÃƒÂ£o tutorial
- histÃƒÂ³rico de tutorias

## 11.7. Modal de Iniciar Atividade
Fluxo obrigatÃƒÂ³rio:
- abrir a partir do contexto do aluno ou atividade
- exibir pergunta obrigatÃƒÂ³ria: haverÃƒÂ¡ tutor nesta atividade?
- se a resposta for sim, exibir dropdown de tutores cadastrados
- impedir continuaÃƒÂ§ÃƒÂ£o se houver inconsistÃƒÂªncia de preenchimento

## 11.8. FormulÃƒÂ¡rio de Feedback do Tutor PÃƒÂ³s-Atividade
Deve ser exibido apÃƒÂ³s atividade com tutor e conter:
- nÃƒÂ­vel de autonomia
- necessidade de intervenÃƒÂ§ÃƒÂ£o
- observaÃƒÂ§ÃƒÂµes livres
- submissÃƒÂ£o vinculada ao log da atividade

## 11.9. Tela de RelatÃƒÂ³rio AnalÃƒÂ­tico
Deve apresentar:
- resumo do perÃƒÂ­odo
- mÃƒÂ©tricas do aluno
- desempenho nas atividades
- seÃƒÂ§ÃƒÂ£o especÃƒÂ­fica de autonomia e suporte tutorial
- badge visual de recomendaÃƒÂ§ÃƒÂ£o
- contexto pedagÃƒÂ³gico com BNCC, quando aplicÃƒÂ¡vel

## 11.10. Tela de HistÃƒÂ³rico de Tutorias
Deve conter:
- linha do tempo de registros
- grÃƒÂ¡fico comparativo entre atividades com tutor e sem tutor
- evoluÃƒÂ§ÃƒÂ£o da autonomia
- filtros por perÃƒÂ­odo

## 11.11. Tela de Cadastro de Tutores
CRUD completo com campos:
- nome
- e-mail
- telefone
- especialidade
- escola

## 11.12. Tela de Graus de Parentesco
CRUD para tipos de vÃƒÂ­nculo familiar/responsÃƒÂ¡vel.

## 11.13. Tela de Esferas da Anamnese
CRUD das esferas de investigaÃƒÂ§ÃƒÂ£o.

## 11.14. Tela de Perguntas da Anamnese
CRUD de perguntas com tipos dinÃƒÂ¢micos e associaÃƒÂ§ÃƒÂ£o ÃƒÂ  esfera.

## 11.15. Tela de BNCC
CRUD e listagem de competÃƒÂªncias/habilidades com filtros.

## 11.16. Tela de RelatÃƒÂ³rios
Listagem dos relatÃƒÂ³rios gerados, filtros por aluno, perÃƒÂ­odo e recomendaÃƒÂ§ÃƒÂ£o tutorial.

## 11.17. Tela de ConfiguraÃƒÂ§ÃƒÂµes
ConfiguraÃƒÂ§ÃƒÂµes administrativas e operacionais, incluindo parÃƒÂ¢metros de integraÃƒÂ§ÃƒÂ£o, templates e preferÃƒÂªncias institucionais.

## 11.18. Tela de Login / AutenticaÃƒÂ§ÃƒÂ£o
Fluxo de autenticaÃƒÂ§ÃƒÂ£o seguro, persistÃƒÂªncia de sessÃƒÂ£o e proteÃƒÂ§ÃƒÂ£o de rotas.

---

## 12. ExperiÃƒÂªncia de Uso ObrigatÃƒÂ³ria

- O painel deve funcionar bem em desktop e de forma aceitÃƒÂ¡vel em tablets.
- O usuÃƒÂ¡rio deve conseguir localizar rapidamente alunos com necessidade de tutor.
- O fluxo de atividade com tutor deve ser direto e sem ambiguidade.
- A leitura dos relatÃƒÂ³rios deve ser objetiva, com visualizaÃƒÂ§ÃƒÂ£o clara das mÃƒÂ©tricas.
- O sistema deve comunicar estados e validaÃƒÂ§ÃƒÂµes de forma amigÃƒÂ¡vel.

---

## 13. IntegraÃƒÂ§ÃƒÂµes Externas

## 13.1. IntegraÃƒÂ§ÃƒÂ£o com Plataforma de Games

### Requisitos obrigatÃƒÂ³rios
- O sistema deve iniciar uma sessÃƒÂ£o de atividade.
- O token JWT de sessÃƒÂ£o deve carregar `has_tutor` e `tutor_id` quando aplicÃƒÂ¡vel.
- O retorno da atividade deve ser recebido por webhook.
- O webhook deve atualizar o `activity_log` e disparar solicitaÃƒÂ§ÃƒÂ£o de feedback tutorial quando necessÃƒÂ¡rio.

### Endpoints sugeridos
- `POST /api/integrations/games/session`
- `POST /api/webhooks/games/result`

### Requisitos de seguranÃƒÂ§a
- ValidaÃƒÂ§ÃƒÂ£o de assinatura do webhook, se disponÃƒÂ­vel.
- ProteÃƒÂ§ÃƒÂ£o contra repetiÃƒÂ§ÃƒÂ£o de eventos.
- Logs de auditoria do retorno recebido.

## 13.2. IntegraÃƒÂ§ÃƒÂ£o com WhatsApp

### Requisitos obrigatÃƒÂ³rios
- Envio de mensagens automÃƒÂ¡ticas para responsÃƒÂ¡veis.
- Templates com resumo de autonomia e acompanhamento tutorial.
- Registro de tentativas de envio e status final.

## 13.3. IntegraÃƒÂ§ÃƒÂ£o com E-mail

### Requisitos obrigatÃƒÂ³rios
- Envio de relatÃƒÂ³rios e comunicaÃƒÂ§ÃƒÂµes automÃƒÂ¡ticas.
- Templates consistentes e parametrizados.
- Registro de logs de envio.

---

## 14. SeguranÃƒÂ§a, Privacidade e Confiabilidade

O agente deve tratar este projeto como sistema real com dados sensÃƒÂ­veis de crianÃƒÂ§as e informaÃƒÂ§ÃƒÂµes pedagÃƒÂ³gicas. Portanto, os seguintes pontos sÃƒÂ£o obrigatÃƒÂ³rios:

- autenticaÃƒÂ§ÃƒÂ£o com JWT
- hash seguro de senhas
- autorizaÃƒÂ§ÃƒÂ£o por perfil e escopo institucional
- sanitizaÃƒÂ§ÃƒÂ£o de entradas
- validaÃƒÂ§ÃƒÂ£o de payloads
- proteÃƒÂ§ÃƒÂ£o contra acesso indevido entre escolas
- proteÃƒÂ§ÃƒÂ£o de rotas e middlewares de permissÃƒÂ£o
- uso de HTTPS em produÃƒÂ§ÃƒÂ£o
- CORS configurÃƒÂ¡vel
- rate limit em endpoints sensÃƒÂ­veis
- logs de auditoria para aÃƒÂ§ÃƒÂµes crÃƒÂ­ticas
- tratamento de erros sem vazar detalhes internos
- polÃƒÂ­tica bÃƒÂ¡sica de LGPD no armazenamento e acesso aos dados

---

## 15. Requisitos NÃƒÂ£o Funcionais

- CÃƒÂ³digo limpo e modular.
- Estrutura preparada para escala moderada.
- Tempo de resposta aceitÃƒÂ¡vel para operaÃƒÂ§ÃƒÂµes administrativas.
- Cache onde fizer sentido.
- Tarefas assÃƒÂ­ncronas para rotinas pesadas.
- Facilidade de manutenÃƒÂ§ÃƒÂ£o e extensÃƒÂ£o.
- ConfiguraÃƒÂ§ÃƒÂ£o simples de ambiente local e produÃƒÂ§ÃƒÂ£o.

---

## 16. Testes ObrigatÃƒÂ³rios

O projeto deve ser entregue com testes mÃƒÂ­nimos cobrindo as partes mais crÃƒÂ­ticas.

### Back-end
- testes de autenticaÃƒÂ§ÃƒÂ£o
- testes de autorizaÃƒÂ§ÃƒÂ£o por role
- testes de criaÃƒÂ§ÃƒÂ£o de tutor
- testes de inÃƒÂ­cio de atividade com e sem tutor
- testes de feedback pÃƒÂ³s-atividade
- testes do algoritmo de recomendaÃƒÂ§ÃƒÂ£o tutorial
- testes bÃƒÂ¡sicos de webhook

### Front-end
- testes dos fluxos crÃƒÂ­ticos, pelo menos em nÃƒÂ­vel de componente ou integraÃƒÂ§ÃƒÂ£o
- cobertura dos estados principais de formulÃƒÂ¡rio e tabela

---

## 17. Observabilidade e OperaÃƒÂ§ÃƒÂ£o

O projeto deve possuir:
- logs estruturados no back-end
- mensagens de erro padronizadas
- healthcheck da API
- documentaÃƒÂ§ÃƒÂ£o de variÃƒÂ¡veis de ambiente
- script claro para subir ambiente local

### Endpoints sugeridos
- `GET /health`
- `GET /ready`

---

## 18. Estrutura Recomendada de Pastas

### Back-end
```text
backend/
  src/
    modules/
      auth/
      users/
      schools/
      students/
      tutors/
      anamnesis/
      cognitive-profiles/
      activities/
      reports/
      tutor-recommendations/
      bncc/
      integrations/
      checkins/
    common/
      middleware/
      utils/
      validators/
      errors/
      jobs/
      config/
    database/
      migrations/
      seeds/
    app.ts
    server.ts
```

### Front-end
```text
frontend/
  src/
    app/
    pages/
    components/
    layouts/
    services/
    hooks/
    contexts/
    utils/
    types/
    styles/
```

---

## 19. PadrÃƒÂµes de API

### Regras obrigatÃƒÂ³rias
- Respostas JSON consistentes.
- Erros padronizados.
- PaginaÃƒÂ§ÃƒÂ£o em listagens.
- Filtros por query params.
- OrdenaÃƒÂ§ÃƒÂ£o quando fizer sentido.
- ValidaÃƒÂ§ÃƒÂ£o de UUIDs e payloads.

### Exemplo de envelope de resposta sugerido
```json
{
  "success": true,
  "data": {},
  "message": "OperaÃƒÂ§ÃƒÂ£o realizada com sucesso"
}
```

### Exemplo de erro padronizado
```json
{
  "success": false,
  "message": "Dados invÃƒÂ¡lidos",
  "errors": {
    "field": ["Mensagem de validaÃƒÂ§ÃƒÂ£o"]
  }
}
```

---

## 20. Seeds e Dados Iniciais

O agente deve entregar seeds mÃƒÂ­nimas para facilitar homologaÃƒÂ§ÃƒÂ£o e demonstraÃƒÂ§ÃƒÂ£o:

- 1 administrador
- 1 escola
- 2 tutores
- alunos de exemplo
- esferas de anamnese
- perguntas de anamnese
- competÃƒÂªncias BNCC de exemplo
- atividades de exemplo
- alguns logs de atividade para demonstrar o algoritmo tutorial

---

## 21. Ambiente e Deploy

### Entrega obrigatÃƒÂ³ria
- `docker-compose.yml` para ambiente local
- arquivos `.env.example` para backend e frontend
- instruÃƒÂ§ÃƒÂµes de instalaÃƒÂ§ÃƒÂ£o e execuÃƒÂ§ÃƒÂ£o no `README.md`
- migrations versionadas
- script de seed

### Banco e infraestrutura
- PostgreSQL como banco principal
- Redis para cache e filas
- configuraÃƒÂ§ÃƒÂ£o preparada para produÃƒÂ§ÃƒÂ£o

---

## 22. CritÃƒÂ©rios de Aceite

O projeto sÃƒÂ³ deve ser considerado concluÃƒÂ­do quando, no mÃƒÂ­nimo:

1. UsuÃƒÂ¡rios conseguem autenticar com seguranÃƒÂ§a.
2. Ãƒâ€° possÃƒÂ­vel cadastrar escola, aluno e tutor.
3. Tutores ficam vinculados a escolas.
4. Ãƒâ€° possÃƒÂ­vel configurar esferas e perguntas de anamnese.
5. ResponsÃƒÂ¡veis conseguem ter respostas registradas no sistema.
6. O perfil cognitivo pode ser gerado ou recalculado.
7. Uma atividade pode ser iniciada com ou sem tutor.
8. O feedback tutorial pode ser enviado apÃƒÂ³s a atividade.
9. O histÃƒÂ³rico tutorial do aluno pode ser consultado.
10. A recomendaÃƒÂ§ÃƒÂ£o automÃƒÂ¡tica de tutor ÃƒÂ© calculada corretamente.
11. O dashboard exibe card de alunos que precisam de tutor.
12. O relatÃƒÂ³rio analÃƒÂ­tico exibe autonomia e recomendaÃƒÂ§ÃƒÂ£o.
13. A tela de histÃƒÂ³rico de tutorias possui visualizaÃƒÂ§ÃƒÂ£o grÃƒÂ¡fica.
14. IntegraÃƒÂ§ÃƒÂµes essenciais estÃƒÂ£o estruturadas e prontas para uso.
15. O projeto sobe localmente com documentaÃƒÂ§ÃƒÂ£o clara.

---

## 23. Checklist Final de Entrega

### Back-end
- [ ] tabelas `users`, `schools`, `students` criadas
- [ ] tabela `tutors` criada
- [ ] autenticaÃƒÂ§ÃƒÂ£o e login implementados
- [ ] endpoints de tutores implementados
- [ ] mÃƒÂ³dulo de anamnese completo
- [ ] algoritmo de perfil cognitivo implementado
- [ ] `activity_logs` com campos de tutor implementado
- [ ] algoritmo de recomendaÃƒÂ§ÃƒÂ£o de tutor implementado
- [ ] geraÃƒÂ§ÃƒÂ£o de relatÃƒÂ³rio analÃƒÂ­tico implementada
- [ ] troca 360 graus implementada

### Front-end
- [ ] React + TypeScript + Tailwind configurados
- [ ] dashboard com mÃƒÂ©tricas e card de tutor
- [ ] tela de cadastro de tutores
- [ ] modal de iniciar atividade com seleÃƒÂ§ÃƒÂ£o de tutor
- [ ] formulÃƒÂ¡rio de feedback do tutor
- [ ] relatÃƒÂ³rio analÃƒÂ­tico com seÃƒÂ§ÃƒÂ£o de autonomia
- [ ] histÃƒÂ³rico de tutorias com grÃƒÂ¡ficos
- [ ] listagem de alunos com indicador de necessidade de tutor

### IntegraÃƒÂ§ÃƒÂµes e Infra
- [ ] integraÃƒÂ§ÃƒÂ£o com games via webhook
- [ ] integraÃƒÂ§ÃƒÂ£o com WhatsApp e e-mail configurÃƒÂ¡vel
- [ ] PostgreSQL e Redis configurados
- [ ] seguranÃƒÂ§a bÃƒÂ¡sica implementada
- [ ] documentaÃƒÂ§ÃƒÂ£o de execuÃƒÂ§ÃƒÂ£o pronta

---

## 24. InstruÃƒÂ§ÃƒÂ£o Final para o Agente

Implemente este projeto como uma aplicaÃƒÂ§ÃƒÂ£o real de produÃƒÂ§ÃƒÂ£o em nÃƒÂ­vel inicial, com backend e frontend integrados, arquitetura organizada, cÃƒÂ³digo profissional, interface administrativa funcional e todas as regras principais descritas neste escopo. Priorize consistÃƒÂªncia, seguranÃƒÂ§a, clareza e capacidade de manutenÃƒÂ§ÃƒÂ£o.

NÃƒÂ£o entregue apenas layout estÃƒÂ¡tico. NÃƒÂ£o entregue apenas CRUD superficial. O resultado deve contemplar autenticaÃƒÂ§ÃƒÂ£o, domÃƒÂ­nio pedagÃƒÂ³gico, anamnese, perfil cognitivo, registro de atividades, lÃƒÂ³gica tutorial, relatÃƒÂ³rios, dashboards, integraÃƒÂ§ÃƒÂµes e estrutura pronta para evoluÃƒÂ§ÃƒÂ£o do produto.

Em todos os pontos em que este escopo exigir interpretaÃƒÂ§ÃƒÂ£o tÃƒÂ©cnica, siga a soluÃƒÂ§ÃƒÂ£o mais robusta, limpa e escalÃƒÂ¡vel, sem contrariar as regras de negÃƒÂ³cio definidas.
