import type { Request, Response } from 'express';
import * as chatService from '../services/chatService.js';
import type { SendMessageRequest } from '../models/types.js';

export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const { conversationId, message } = req.body as SendMessageRequest;
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ error: 'Mensagem é obrigatória' });
      return;
    }
    
    const result = await chatService.sendMessage(conversationId, message.trim());
    
    res.status(201).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    if (errorMessage === 'Conversa não encontrada') {
      res.status(404).json({ error: errorMessage });
      return;
    }
    
    if (errorMessage === 'Esta conversa já foi transferida para um atendente') {
      res.status(400).json({ error: errorMessage });
      return;
    }
    
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export function getMessages(req: Request, res: Response): void {
  try {
    const { conversationId } = req.query;
    
    const result = chatService.getMessagesHistory(
      typeof conversationId === 'string' ? conversationId : undefined
    );
    
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    if (errorMessage === 'Conversa não encontrada') {
      res.status(404).json({ error: errorMessage });
      return;
    }
    
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

