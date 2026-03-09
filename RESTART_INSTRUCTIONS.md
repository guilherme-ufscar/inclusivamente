# Como resolver o erro 502 no seu servidor Docker

O erro 502 (Bad Gateway) acontece quando o painel tenta falar com a API, mas ela está desligada ou travou. 

Como as correções já foram enviadas para este repositório, faça o seguinte no terminal do seu servidor:

1. Acesse a pasta do projeto e garanta que está na branch main:
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```

2. Reconstrua os containers do zero para garantir que as novas rotas e dependências sejam lidas:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. (MUITO IMPORTANTE) Como alteramos o banco de dados (campos do aluno), rode a sincronização do Prisma:
   ```bash
   docker-compose exec backend npx prisma db push
   ```

Se o erro persistir, verifique logs do erro com:
```bash
docker-compose logs backend
```
