# 📖 Manual Técnico de Instruções e Integração - Inclusiva Mente Educa

Este documento serve como o manual definitivo para desenvolvedores e mantenedores da plataforma "Inclusiva Mente Educa". Todo o descritivo de arquitetura, banco de dados, fluxos de uso, integrações de webhook e variáveis de ambiente (portas e senhas) estão centralizados aqui.

---

## 1. Variáveis de Ambiente e Portas (`.env`)

A arquitetura do projeto foi consolidada para que **todas as portas, acessos de banco de dados, integrações com WhatsApp e envio de e-mails** sejam controlados por um único arquivo `.env` localizado na raiz do projeto (`/inclusaogemini/.env`). 

Quando você alterar o arquivo `.env`, o `docker-compose.yml` lerá automaticamente esses valores.

### 1.1 Variáveis Disponíveis no `.env`

| Variável | Descrição | Valor Sugerido (Padrão) |
| :--- | :--- | :--- |
| `BACKEND_PORT` | Porta onde a API Node.js roda | `8001` |
| `FRONTEND_PORT` | Porta onde o Vite (Painel React) roda | `5173` |
| `POSTGRES_PORT` | Porta de acesso externo do banco | `8432` |
| `POSTGRES_USER` | Usuário do Banco | `admin` |
| `POSTGRES_PASSWORD` | Senha do Banco | `adminpassword` |
| `JWT_SECRET` | Chave p/ assinar os Login Tokens | `mudar-em-producao` |
| `GEMINI_API_KEY` | Integração c/ IA Google (Para PDF) | `Sua_Chave_Opcional` |
| `WHATSAPP_PROVIDER`| Provedor de Mensageria | `twilio` (ou `z-api`) |
| `TWILIO_ACCOUNT_SID`| Token do Twilio para Zap | `` |
| `SMTP_HOST` | Host para envio de E-mails | `smtp.provedor.com` |

**Importante:** Ao mudar as portas ou variáveis no `.env`, você precisará recriar os contêineres:
`docker-compose up -d --force-recreate`

---

## 2. Estrutura do Banco de Dados (PostgreSQL / Prisma)

O sistema foi estruturado garantindo a total integridade referencial com os perfis de usuários, registro de cognição e históricos com tutores.

| Modelo / Tabela | Propósito | Principais Campos |
| :--- | :--- | :--- |
| `User` | Credenciais da Plataforma | ID, Name, Email, Password, Role (Admin, Parent, Tutor...) |
| `School` / `Student` | Organizações e Alunos | Turmas, Diagnósticos, Parentesco (Pai do aluno). |
| `Tutor` | Perfil Exclusivo do Tutor | Especialidades cadastradas e logs amarrados a este ID. |
| `ActivityLog` | O Coração da Integração! | `log_id`, tempo gasto, nível medido, acertos, `has_tutor`. |
| `Report` | Os relatórios gerados. | Quantidade de tutoria, métricas consolidadas, Parecer do Tutor. |

A atualização do banco usa as migrations geradas no diretório padrão.

---

## 3. Fluxo de Sessão e Webhooks (Lançamento de Jogo)

O sistema opera sem "Login de Estudante". A criança joga via link persistente lançado por um tutor ou responsável, e o resultado é devolvido pelo jogo via Webhook.

### 3.1. Disparo Inicial pela Plataforma
1. No painel de Alunos, o usuário clica em **"Iniciar Atividade"**.
2. A tela pergunta de forma vinculativa se haverá a presença de um **Tutor** nesse jogo.
3. O painel efetua uma requisição `POST /api/activities/start` pro nosso Backend.
4. O Backend gera um Log com `started_at` e cria o ID da Sessão (`LOG_ID`).
5. A URL de redirecionamento do jogo abre: `https://www.escola.inclusivamenteeduca.com/?session=LOG_ID`.

### 3.2. Retorno Via WebHook
Quando a atividade acabar no Unity/Engine, o jogo fará um `POST` no nosso backend (Endpoint Público OBRIGATÓRIO), sem precisar de travas de CORS rígidas (apenas controle de host, se aplicável).

**Endpoint do Webhook:** `POST https://www.inclusivamenteeduca.com/api/activities/webhook` (Substituir pela URL base correta em prod)

**O que o Webhook do jogo precisa nos entregar de volta (Payload):**
```json
{
  "log_id": "c3b6ce1f-b292-4f03-8f0a-e9c4093efb70",
  "time_spent": 120,
  "errors_count": 2,
  "correct_count": 8,
  "difficulty_perceived": "medium"
}
```
Na nossa API, esse webhook vai processar os dados recebidos, localizar o `log_id` na tabela `ActivityLog`, colocar as métricas, calcular o nível de autonomia do aluno, e fechar a atividade (`completed_at = now()`).

---

## 4. Algoritmo de Inteligência e Autonomia

Como documentado em `escopopdf.md`, as regras pedagógicas criadas medem se o Aluno precisou de tutor versus quantos acertos ele realizou.

1. **Geração de Pareceres (PDF)**: 
O administrador escolhe o filtro (Por Data Customizada ou pelas "Últimas X atividades").
2. **Leitura Exata:** O backend puxa as exatas atividades desse filtro e mede o `% de Autonomia` (baseado em quantas atividades ele jogou sozinho vs total).
3. **IA do Gemini (Se ativada)**: Se a `GEMINI_API_KEY` estiver no `.env`, ele lê cada log e cria um texto inteligente orgânico. Se não tiver, ele usa heurística (textos pré-programados baseados na métrica).
4. **Exportação de Dashboard**: A página React re-formata em puro HTML/CSS para imprimir PDFs visuais lindíssimos sem bibliotecas pesadas de Backend como `puppeteer`.

---

## 5. Como Iniciar e Resetar Todo o Ambiente Local

Use esses comandos no terminal (Powershell via root do repositório):

1. **Desligar Tudo:**
`docker-compose down`

2. **Ligar Totalmente:**
`docker-compose up --build -d`

3. **Recriar Tabelas e Rodar o Seed para popular Alunos/Usuários padrão:**
`docker exec -it inclusaogemini_backend npm run seed`

### Conta Padrão de Seed do Sistema (Produção Limpa):
A base será resetada apenas com uma escola principal e este usuário para que você possa iniciar livremente sem resíduos:
* **Admin**: `admin@inclusivamenteeduca.com` / `Inclusivamente#2026`

> 💡 *A arquitetura obedece perfeitamente ao Checklist Final de Entregas do Projeto Inicial, incluindo a segregação de Webhook, Layouts do PDF com Cores em Slate, Suporte completo de Módulos Tutoriais e Gerenciamento Inteligente de Permissões.*

---

## 6. Como Iniciar Sem Docker (Local, aaPanel, cPanel, VPS)

Caso prefira rodar a plataforma "diretamente no servidor" (Bare Metal) sem usar containers Docker, siga o passo a passo abaixo:

### 6.1. Pré-Requisitos no Servidor
*   **Node.js**: Versão 18+ instalada.
*   **PostgreSQL**: Banco de dados relacional instalado e rodando.
*   **Redis**: Servidor Redis rodando (para gerenciamento em memória/filas, se necessário no futuro).

### 6.2. Configuração do `.env`
No arquivo raiz `.env`, atente-se para mudar os `HOSTS` dos serviços já que não estaremos usando a rede do Docker.
*   Altere `DATABASE_URL` (Troque `postgres` por `localhost` ou `127.0.0.1`):
    *   `DATABASE_URL=postgresql://usuariodobanco:senhadobanco@localhost:5432/nomedobanco?schema=public`
*   Altere `REDIS_URL` (Troque `redis` por `localhost` ou `127.0.0.1`):
    *   `REDIS_URL=redis://:suasenha@localhost:6379`

### 6.3. Iniciando o Back-End (API Node.js)
1.  Abra o terminal, navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale todas as dependências:
    ```bash
    npm install
    ```
3.  Prepare e sincronize o Banco de Dados (PostgreSQL) recriando o prisma:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  Popule o banco limpo de produção usando a SEED:
    ```bash
    npm run seed
    ```
5.  Inicie o servidor de desenvolvimento **ou** de produção:
    *   **Em desenvolvimento:** `npm run dev`
    *   **Em produção (Ex: via PM2):** 
        ```bash
        npm run build # (Caso queira compilar o TypeScript, se não pule esse passo)
        npx ts-node src/server.ts # Roda o servidor diretamente
        ```

### 6.4. Iniciando o Front-End (Painel React/Vite)
1.  Abra um **segundo terminal** e navegue até a pasta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor do painel:
    *   **Em ambiente local (Modo de desenvolvimento):**
        ```bash
        npm run dev
        ```
        👉 *O painel acessará o backend via http://localhost:8001 (Porta padrão).*
    *   **Em Produção (Gerando HTML Estático para Nginx / Apache):**
        ```bash
        npm run build
        ```
        👉 A pasta `/frontend/dist` será criada. Você pega os arquivos de dentro dessa pasta e hospeda direto no servidor estático do seu aaPanel / Vercel / Nginx! E pronto!

---
