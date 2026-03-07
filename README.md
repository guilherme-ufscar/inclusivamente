# Inclusiva Mente Educa 🧠🦾

Plataforma premium para gestão de Educação Especial, Inclusão Ativa e Acompanhamento Tutorial com Inteligência Analítica.

## 🚀 Sobre o Projeto

A **Inclusiva Mente Educa** é uma solução Full-Stack projetada para escolas, tutores e famílias. O sistema permite o mapeamento completo do perfil cognitivo de alunos, registro de atividades práticas com suporte tutorial e geração de pareceres analíticos automáticos baseados em dados reais de autonomia.

### 🎨 Diferenciais Visuais
- **Identidade Institucional:** Cores baseadas na paleta Azul Intensivo (#13365A) e Azul Bradesco (#0099D7).
- **Tipografia:** Uso exclusivo da fonte **Bradesco Sans**.
- **Acolhimento:** Interface humanizada com uso de mascotes institucionais.

---

## 🛠️ Tecnologias Utilizadas

### Back-End
- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **Prisma ORM** (Modelagem de dados)
- **PostgreSQL** (Banco de dados relacional)
- **Redis** (Gerenciamento de filas e cache)
- **JWT** (Autenticação Segura)

### Front-End
- **React** com **Vite**
- **Tailwind CSS 4.0** (Estilização Moderna)
- **Lucide React** (Iconografia)
- **Framer Motion** (Animações)
- **Chart.js** (Gráficos Analíticos)

---

## 📦 Como Rodar a Plataforma

A maneira mais recomendada e rápida de subir o ambiente completo é utilizando **Docker**.

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo

1. **Subir os Containers:**
   Na raiz do projeto, execute:
   ```bash
   docker compose up --build -d
   ```

2. **Popular o Banco de Dados (Seed):**
   Para inserir o usuário administrador e dados iniciais de teste:
   ```bash
   docker exec -it inclusaogemini_backend npm run seed
   ```

3. **Links de Acesso:**
   - **Front-End:** [http://localhost:5173](http://localhost:5173)
   - **Back-End API:** [http://localhost:8001](http://localhost:8001)

### 🔑 Credenciais de Teste
- **E-mail:** `admin@inclusivamente.com`
- **Senha:** `admin123`

---

## 📈 Funcionalidades Principais

- **Módulo de Tutor:** Registro obrigatório de suporte profissional em games e atividades físicas.
- **Algoritmo de Autonomia:** Cálculo automático que recomenda o nível de suporte necessário (Contínuo, Esporádico ou Não Necessário).
- **Anamnese Dinâmica:** Investigação completa em diversas esferas (Cognitivo, Social, Saúde).
- **Relatórios Analíticos:** Geração de PDFs com síntese qualitativa gerada por inteligência de dados.
- **Troca 360 Graus:** Check-in semanal automático com famílias via integração de mensageria.
- **Mapeamento BNCC:** Vínculo de todas as atividades com a Base Nacional Comum Curricular.

---

## 📂 Estrutura do Repositório

```text
├── backend/            # API, Prisma Schema e Regras de Negócio
├── frontend/           # Interface React, Componentes e Estilos
├── files/              # Assets institucionais (Logos e Mascotes)
├── docker-compose.yml  # Orquestração do ambiente completo
└── escopopdf.md        # Documentação detalhada de requisitos
```

---

**Desenvolvido para Inclusiva Mente Educa. Todos os direitos reservados © 2026.**
