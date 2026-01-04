import { useState, useCallback } from 'react';
import { Message } from './types';
import { sendMessage } from './services/api';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import './App.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleSendMessage = useCallback(async (content: string) => {
    setError(null);

    // Adiciona mensagem do usuário imediatamente
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: conversationId ?? '',
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        conversationId: conversationId ?? undefined,
        message: content,
      });

      setConversationId(response.conversationId);
      
      // Substitui a mensagem temporária pela real e adiciona resposta do assistente
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove a mensagem temporária
        response.userMessage,
        response.assistantMessage
      ]);

      if (response.transferred && response.sector) {
        console.log(`Conversa transferida para: ${response.sector}`);
      }
    } catch (err) {
      // Remove a mensagem temporária em caso de erro
      setMessages(prev => prev.slice(0, -1));
      setError('Erro ao enviar mensagem. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <header className="chat-header">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🤖</span>
              <div className="logo-text">
                <h1>Pagana</h1>
                <span className="status">Assistente Virtual</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button className="new-chat-btn" onClick={handleNewConversation}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nova Conversa
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        <main className="chat-main">
          <MessageList messages={messages} isLoading={isLoading} />
          
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}
        </main>

        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;

