import * as conversationRepository from '../repositories/conversationRepository.js';
import * as messageRepository from '../repositories/messageRepository.js';
import * as aiService from './aiService.js';
import type { SendMessageResponse, MessagesHistoryResponse } from '../models/types.js';

export async function sendMessage(
  conversationId: string | undefined,
  userMessage: string
): Promise<SendMessageResponse> {
  let conversation;
  
  if (conversationId) {
    conversation = conversationRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }
    if (conversation.status === 'transferred') {
      throw new Error('Esta conversa já foi transferida para um atendente');
    }
  } else {
    conversation = conversationRepository.createConversation();
  }
  
  const savedUserMessage = messageRepository.createMessage(
    conversation.id,
    'user',
    userMessage
  );
  
  const conversationMessages = messageRepository.findMessagesByConversationId(conversation.id);
  
  const aiResponse = await aiService.generateResponse(conversationMessages);
  
  const savedAssistantMessage = messageRepository.createMessage(
    conversation.id,
    'assistant',
    aiResponse.content
  );
  
  if (aiResponse.transferred && aiResponse.sector) {
    conversationRepository.updateConversation(conversation.id, {
      status: 'transferred',
      sector: aiResponse.sector,
      summary: aiResponse.summary,
    });
  }
  
  return {
    conversationId: conversation.id,
    userMessage: savedUserMessage,
    assistantMessage: savedAssistantMessage,
    transferred: aiResponse.transferred,
    sector: aiResponse.sector,
    summary: aiResponse.summary,
  };
}

export function getMessagesHistory(conversationId?: string): MessagesHistoryResponse[] {
  if (conversationId) {
    const conversation = conversationRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }
    
    const messages = messageRepository.findMessagesByConversationId(conversationId);
    
    return [{
      conversationId: conversation.id,
      status: conversation.status,
      sector: conversation.sector,
      summary: conversation.summary,
      messages,
    }];
  }
  
  const conversations = conversationRepository.findAllConversations();
  
  return conversations.map((conversation) => {
    const messages = messageRepository.findMessagesByConversationId(conversation.id);
    return {
      conversationId: conversation.id,
      status: conversation.status,
      sector: conversation.sector,
      summary: conversation.summary,
      messages,
    };
  });
}

