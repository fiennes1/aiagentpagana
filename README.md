# Agente de Triagem Inteligente com IA

Sistema de atendimento automatizado que utiliza IA para identificar a necessidade do cliente e encaminhá-lo para o setor correto (Vendas, Suporte ou Financeiro).

## Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- SQLite (better-sqlite3)
- OpenAI API (GPT-4o-mini)

### Frontend
- React 18 + TypeScript
- Vite
- CSS com variáveis (temas light/dark)

## Estrutura do Projeto

```
pagana/
├── src/                    # Backend
│   ├── config/             # Configurações da aplicação
│   ├── controllers/        # Controllers da API
│   ├── database/           # Conexão e schema do banco
│   ├── models/             # Tipos e interfaces
│   ├── repositories/       # Acesso ao banco de dados
│   ├── routes/             # Rotas da API
│   ├── services/           # Lógica de negócio e integração com IA
│   └── server.ts           # Entrada da aplicação
│
└── frontend/               # Frontend React
    └── src/
        ├── components/     # Componentes React
        ├── hooks/          # Custom hooks
        ├── services/       # Integração com API
        ├── styles/         # Estilos globais
        └── App.tsx         # Componente principal
```

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd pagana
```

2. Instale as dependências do backend:
```bash
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
cd ..
```

4. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

5. Edite o arquivo `.env` e adicione sua chave da OpenAI:
```
PORT=3000
OPENAI_API_KEY=sua_chave_aqui
DATABASE_PATH=./database.db
```

## Executando a Aplicação

A aplicação requer dois processos: backend e frontend.

### Terminal 1 - Backend
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:3000`.

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
A interface estará disponível em `http://localhost:5173`.

## Funcionalidades do Frontend

- Interface de chat para conversar com o agente de IA
- Histórico de mensagens da conversa atual
- Indicador de carregamento enquanto aguarda resposta
- Alternância entre tema claro e escuro
- Botão para iniciar nova conversa
- Layout responsivo para desktop e mobile

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

- `message` (obrigatório): Mensagem do usuário
- `conversationId` (opcional): ID da conversa existente. Se não fornecido, uma nova conversa será criada.

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

Quando a conversa é transferida para um atendente:
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

Retorna o histórico de mensagens.

**Query Parameters:**
- `conversationId` (opcional): Filtra por uma conversa específica

**Response (200):**
```json
[
  {
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "transferred",
    "sector": "financeiro",
    "summary": "Cliente solicita pagamento de boleto",
    "messages": [...]
  }
]
```

### GET /health

Verifica se o servidor está funcionando.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-03T10:00:00.000Z"
}
```

## Scripts Disponíveis

### Backend
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor compilado
- `npm run migrate` - Executa as migrações do banco

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza a build de produção

## Setores de Transferência

| Setor | Exemplos de Solicitação |
|-------|-------------------------|
| Vendas | Compra, preços, descontos, negociação |
| Suporte | Reclamações, problemas técnicos, serviço bloqueado |
| Financeiro | Pagamentos, boletos, estornos, nota fiscal |

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
