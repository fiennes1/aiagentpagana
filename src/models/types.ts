export type MessageRole = 'user' | 'assistant';

export type ConversationStatus = 'active' | 'transferred';

export type Sector = 'vendas' | 'suporte' | 'financeiro';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  sector: Sector | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  transferred: boolean;
  sector?: Sector;
  summary?: string;
}

export interface MessagesHistoryResponse {
  conversationId: string;
  status: ConversationStatus;
  sector: Sector | null;
  summary: string | null;
  messages: Message[];
}

export interface AIResponse {
  content: string;
  transferred: boolean;
  sector?: Sector;
  summary?: string;
}

