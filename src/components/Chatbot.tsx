import { useState } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { publicUrl } from '@/lib/utils';

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
      className={`fixed bottom-6 right-6 z-40 overflow-hidden transition-all duration-300 rounded-2xl bg-card border border-border/80 shadow-[0_28px_60px_-28px_hsl(175_42%_20%/0.55)] ${
        isMinimized ? 'h-14' : 'h-[520px]'
      } w-[min(100vw-2rem,380px)] md:w-[400px] flex flex-col`}
    >
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/10 gradient-primary text-primary-foreground">
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <img
              src={publicUrl('/favicon.svg')}
              alt=""
              width={22}
              height={22}
              className="h-5 w-5"
              aria-hidden="true"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-primary-dark" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">Assistente Life Simple</p>
            <p className="text-[11px] text-white/75">Online · responde em segundos</p>
          </div>
        </div>
        <div className="flex items-center space-x-0.5">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[linear-gradient(180deg,hsl(170_25%_98%),hsl(168_20%_95%))]">
            {messages.length === 0 && !error && (
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="font-display text-lg text-foreground tracking-tight">Olá!</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Posso ajudar com catálogo, prazos e como iniciar sua fórmula. Em caso clínico,
                  a equipe farmacêutica assume pelo WhatsApp.
                </p>
              </div>
            )}

            {error && (
              <p className="text-destructive text-center text-sm p-2 bg-destructive/15 rounded-xl">
                {error}
              </p>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <span
                    className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10"
                    aria-hidden="true"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                  </span>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card text-foreground border border-border/60 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1.5 text-right ${
                      message.sender === 'user' ? 'opacity-70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp?.toDate?.().toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) ?? ''}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start gap-2 items-end">
                <span
                  className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                </span>
                <div className="bg-card border border-border/60 rounded-2xl rounded-bl-md px-3.5 py-3 shadow-sm">
                  <div className="flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                aria-label="Mensagem do chat"
                className="flex-1 px-3.5 py-2.5 border border-border bg-input text-foreground rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 flex-shrink-0 gradient-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 disabled:bg-muted disabled:opacity-50 transition-all"
                aria-label="Enviar mensagem"
              >
                <Send className="h-4 w-4" />
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
