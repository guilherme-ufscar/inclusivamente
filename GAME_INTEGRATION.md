# 🎮 Especificações Técnicas de Integração - Inclusiva Mente Educa (Game)

Olá! O sistema de Painel do Aluno foi configurado para autenticação por **Single Sign-On (SSO)** via JWT (JSON Web Token). Abaixo estão os detalhes para a integração:

## 1. Entrada no Jogo (Redirecionamento)
Sempre que um aluno fizer login no Painel, ele será redirecionado automaticamente para:
**URL:** `https://game.inclusivamenteeduca.com/?token=SEU_JWT_AQUI`

O desenvolvedor deve:
* Capturar o parâmetro `token` da URL.
* Salvar esse token no `LocalStorage` ou `SessionStorage` para persistência.
* Decodificar o JWT (formato base64 padrão) para ler os dados iniciais do aluno.

## 2. Estrutura do JWT (Payload)
O Token decodificado contém o seguinte objeto (Exemplo):
```json
{
  "id": "uuid-do-aluno",
  "username": "Nome do Aluno",
  "birthdate": "2015-05-20T00:00:00.000Z",
  "school_id": "uuid-da-escola",
  "ano_escolar": "3º Ano",
  "coins": 150,
  "persona": 2, // 0: Padrão, 1: DI, 2: TEA
  "role": "student",
  "userId": "uuid-da-conta-usuario",
  "iat": 1710000000,
  "exp": 1710604800 // Expira em 7 dias
}
```

## 3. Comunicação com a API (Endpoints)
Para todas as chamadas de API, o jogo deve enviar o Token no Header da requisição:
`Authorization: Bearer <SEU_JWT>`

**Base URL da API:** `https://api.inclusivamenteeduca.com/api` (ajustar conforme seu domínio de produção)

### A. Sincronizar Progresso (Gasto/Ganho de Moedas e Persona):
* **Método:** `PATCH`
* **Rota:** `/students/me/progression`
* **Body (JSON):**
    ```json
    {
      "coins": 200,   // Novo valor total de moedas
      "persona": 1    // Se mudar a persona no jogo (opcional)
    }
    ```

### B. Verificar Dados Atualizados (Identificação Automática):
Caso o aluno mude algo no Painel e o jogo precise conferir sem relogar:
* **Método:** `GET`
* **Rota:** `/auth/me`
* **Retorno:** Retorna o objeto `user` contendo um sub-objeto `student` com os campos atualizados.

## 4. Tratamento de Erro de Login
Se o Token for inválido ou estiver expirado, a API retornará `401 Unauthorized`. O desenvolvedor do jogo deve então exibir a mensagem: *"Nenhuma conta encontrada, faça login novamente no painel."* e possivelmente redirecionar o aluno de volta para a URL do painel.

---

### Observações:
1. **Segredo do JWT**: Se você precisar *validar* a assinatura do token no backend (apenas se o jogo tiver um backend próprio), será necessário usar o `JWT_SECRET` do projeto. Se o jogo rodar inteiramente no frontend (Unity WebGL, etc.), apenas decodifique o payload do JWT para leitura, não sendo necessária a validação da assinatura no cliente.
2. **CORS**: O painel já deve ter as regras de CORS configuradas, mas caso o jogo encontre problemas de acesso aos endpoints da API por problemas de Cross-Origin, avise a equipe para liberação do domínio `game.inclusivamenteeduca.com`.
