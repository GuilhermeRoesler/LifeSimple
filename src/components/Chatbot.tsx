import { useState } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface ChatbotPanelProps {
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

function ChatbotPanel({ onClose, isMinimized, onToggleMinimize }: ChatbotPanelProps) {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    error,
    messagesEndRef,
    sendMessage,
  } = useChat(true);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 shadow-2xl transition-all duration-300 rounded-lg bg-card border border-border ${
        isMinimized ? 'h-14' : 'h-[500px]'
      } w-[350px] md:w-[400px] flex flex-col`}
    >
      <div className="flex items-center justify-between p-3 border-b border-border/50 gradient-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold text-base">Assistente Virtual</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onToggleMinimize}
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-black/10 flex items-center justify-center transition-colors"
            aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'}
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-black/10 flex items-center justify-center transition-colors"
            aria-label="Fechar chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background h-[calc(100%-120px)]">
            {error && (
              <p className="text-destructive text-center text-sm p-2 bg-destructive/20 rounded-md">{error}</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp?.toDate?.().toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) ?? ''}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-xl p-3 rounded-bl-none">
                  <div className="flex space-x-1 items-center">
                    <span className="text-sm text-secondary-foreground/80">Digitando</span>
                    <div className="w-1.5 h-1.5 bg-secondary-foreground/80 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-secondary-foreground/80 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 bg-secondary-foreground/80 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border bg-card">
            <div className="flex space-x-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                aria-label="Mensagem do chat"
                className="flex-1 p-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 flex-shrink-0 gradient-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 disabled:bg-muted disabled:opacity-50 transition-all"
                aria-label="Enviar mensagem"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 md:h-16 md:w-16 rounded-full text-primary-foreground gradient-primary flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-300 animate-pulse-soft shadow-lg shadow-primary/30"
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      </button>
    );
  }

  return (
    <ChatbotPanel
      onClose={() => setIsOpen(false)}
      isMinimized={isMinimized}
      onToggleMinimize={() => setIsMinimized((v) => !v)}
    />
  );
}
