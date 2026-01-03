# Agente de Triagem Inteligente com IA

Sistema de atendimento automatizado que utiliza IA para identificar a necessidade do cliente e encaminhá-lo para o setor correto (Vendas, Suporte ou Financeiro).

## Tecnologias

- Node.js + TypeScript
- Express.js
- SQLite (better-sqlite3)
- OpenAI API (GPT-4o-mini)

## Estrutura do Projeto

```
src/
├── config/          # Configurações da aplicação
├── controllers/     # Controllers da API
├── database/        # Conexão e schema do banco
├── models/          # Tipos e interfaces
├── repositories/    # Acesso ao banco de dados
├── routes/          # Rotas da API
├── services/        # Lógica de negócio e integração com IA
└── server.ts        # Entrada da aplicação
```

## Instalacao

1. Clone o repositorio:
```bash
git clone <url-do-repositorio>
cd pagana
```

2. Instale as dependencias:
```bash
npm install
```

3. Configure as variaveis de ambiente:
```bash
cp env.example .env
```

4. Edite o arquivo `.env` e adicione sua chave da OpenAI:
```
PORT=3000
OPENAI_API_KEY=sua_chave_aqui
DATABASE_PATH=./database.db
```

5. Inicie o servidor:
```bash
npm run dev
```

O servidor estara disponivel em `http://localhost:3000`.

## Endpoints da API

### POST /api/messages

Envia uma mensagem para o agente de IA.

**Request Body:**
```json
{
  "message": "Olá, gostaria de pagar meu boleto",
  "conversationId": "uuid-opcional"
}
```

- `message` (obrigatorio): Mensagem do usuario
- `conversationId` (opcional): ID da conversa existente. Se nao fornecido, uma nova conversa sera criada.

**Response (201):**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "userMessage": {
    "id": "msg-uuid",
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "user",
    "content": "Olá, gostaria de pagar meu boleto",
    "createdAt": "2026-01-03T10:00:00.000Z"
  },
  "assistantMessage": {
    "id": "msg-uuid-2",
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "assistant",
    "content": "Claro! Posso te ajudar com isso. Você tem o CPF em mãos?",
    "createdAt": "2026-01-03T10:00:01.000Z"
  },
  "transferred": false
}
```

Quando a conversa e transferida para um atendente:
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "userMessage": { ... },
  "assistantMessage": { ... },
  "transferred": true,
  "sector": "financeiro",
  "summary": "Cliente solicita linha digitável de boleto. CPF informado: 123.456.789-00"
}
```

### GET /api/messages

Retorna o historico de mensagens.

**Query Parameters:**
- `conversationId` (opcional): Filtra por uma conversa especifica

**Response (200):**
```json
[
  {
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "transferred",
    "sector": "financeiro",
    "summary": "Cliente solicita pagamento de boleto",
    "messages": [
      {
        "id": "msg-uuid",
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "user",
        "content": "Quero pagar meu boleto",
        "createdAt": "2026-01-03T10:00:00.000Z"
      },
      {
        "id": "msg-uuid-2",
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "assistant",
        "content": "Vou te transferir para o setor Financeiro...",
        "createdAt": "2026-01-03T10:00:01.000Z"
      }
    ]
  }
]
```

### GET /health

Verifica se o servidor esta funcionando.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-03T10:00:00.000Z"
}
```

## Testando com Postman

### 1. Verificar saude do servidor

- Metodo: GET
- URL: `http://localhost:3000/health`

### 2. Iniciar uma nova conversa

- Metodo: POST
- URL: `http://localhost:3000/api/messages`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "message": "Olá, preciso de ajuda"
}
```

### 3. Continuar uma conversa existente

- Metodo: POST
- URL: `http://localhost:3000/api/messages`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "conversationId": "ID_RETORNADO_NA_RESPOSTA_ANTERIOR",
  "message": "Quero pagar meu boleto que vence hoje"
}
```

### 4. Ver historico de todas as conversas

- Metodo: GET
- URL: `http://localhost:3000/api/messages`

### 5. Ver historico de uma conversa especifica

- Metodo: GET
- URL: `http://localhost:3000/api/messages?conversationId=ID_DA_CONVERSA`

## Fluxos de Teste

### Fluxo Financeiro
1. "Gostaria de pagar meu boleto que vence hoje"
2. "Meu CPF é 123.456.789-00"
3. A IA deve transferir para o setor Financeiro

### Fluxo Vendas
1. "Estou com um boleto atrasado e queria um desconto para quitar"
2. "Prefiro pagar à vista se tiver desconto"
3. A IA deve transferir para o setor Vendas

### Fluxo Suporte
1. "Paguei o boleto ontem mas meu acesso ainda está bloqueado"
2. "Tenho o comprovante aqui comigo"
3. A IA deve transferir para o setor Suporte

### Teste Fora de Contexto
1. "Vocês sabem se vai chover hoje?"
2. A IA deve recusar educadamente e redirecionar para o atendimento

## Scripts Disponiveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor compilado
- `npm run migrate` - Executa as migracoes do banco

## Setores de Transferencia

| Setor | Exemplos de Solicitacao |
|-------|-------------------------|
| Vendas | Compra, precos, descontos, negociacao |
| Suporte | Reclamacoes, problemas tecnicos, servico bloqueado |
| Financeiro | Pagamentos, boletos, estornos, nota fiscal |

