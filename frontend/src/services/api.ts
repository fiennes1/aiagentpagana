import { SendMessageRequest, SendMessageResponse, MessagesHistoryResponse } from '../types';

const API_BASE = '/api';

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar mensagem');
  }

  return response.json();
}

export async function getMessages(conversationId: string): Promise<MessagesHistoryResponse> {
  const response = await fetch(`${API_BASE}/messages?conversationId=${conversationId}`);

  if (!response.ok) {
    throw new Error('Falha ao buscar mensagens');
  }

  return response.json();
}

