import { type ReactNode, useState } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn, publicUrl } from '@/lib/utils';
import { buildWhatsAppUrl, openWhatsApp } from '@/lib/whatsapp';

const QUICK_REPLIES = [
  { id: 'hours', label: 'Horários', text: 'Quais são os horários de funcionamento?' },
  { id: 'products', label: 'Produtos', text: 'Quais produtos vocês têm no catálogo?' },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    action: 'whatsapp' as const,
    message: 'Olá! Vim pelo site da Life Simple e gostaria de atendimento.',
  },
] as const;

function linkifyMessage(text: string): ReactNode[] {
  const re = /(https?:\/\/[^\s<]+)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    let url = match[1]!;
    let trailing = '';
    const punct = url.match(/[),.;!?]+$/);
    if (punct) {
      trailing = punct[0];
      url = url.slice(0, -trailing.length);
    }
    const isWhatsApp = /wa\.me\//i.test(url);
    nodes.push(
      <a
        key={`link-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isWhatsApp
            ? 'font-medium text-primary underline underline-offset-2'
            : 'underline underline-offset-2 break-all'
        }
      >
        {isWhatsApp ? 'Falar no WhatsApp' : url}
      </a>
    );
    if (trailing) nodes.push(trailing);
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes.length > 0 ? nodes : [text];
}

function ChatBubbleText({
  text,
  tone,
}: {
  text: string;
  tone: 'user' | 'bot';
}) {
  return (
    <p
      className={cn(
        'text-sm whitespace-pre-wrap leading-relaxed',
        tone === 'user' ? 'text-primary-foreground' : 'text-foreground'
      )}
    >
      {tone === 'bot' ? linkifyMessage(text) : text}
    </p>
  );
}

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
    streamingText,
    ephemeralError,
    dismissEphemeralError,
    error,
    messagesEndRef,
    sendMessage,
  } = useChat(true);

  const busy = isTyping || streamingText !== null;
  const showQuickReplies = !busy && !error && messages.length <= 1;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!busy && inputMessage.trim()) void sendMessage();
    }
  };

  return (
    <Card
      className={cn(
        'fixed bottom-6 right-6 z-40 overflow-hidden rounded-2xl border-border/80 shadow-[0_28px_60px_-28px_hsl(175_42%_20%/0.55)] w-[min(100vw-2rem,380px)] md:w-[400px] flex flex-col origin-bottom-right animate-chat-in transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] py-0 gap-0',
        isMinimized ? 'h-14' : 'h-[520px]'
      )}
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
            aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
            aria-label="Fechar chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <CardContent
            data-lenis-prevent
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[linear-gradient(180deg,hsl(170_25%_98%),hsl(168_20%_95%))]"
          >
            {error && (
              <div className="rounded-2xl border border-border/70 bg-card/95 px-3.5 py-3.5 shadow-sm animate-fade-in">
                <p className="text-sm text-foreground leading-relaxed text-center">{error}</p>
                <div className="mt-3 flex justify-center">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-full gradient-primary text-xs"
                    onClick={() =>
                      openWhatsApp('Olá! Vim pelo chat do site e gostaria de atendimento.')
                    }
                  >
                    Falar no WhatsApp
                  </Button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 animate-fade-in ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                  <ChatBubbleText text={message.text} tone={message.sender} />
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

            {streamingText !== null && (
              <div className="flex justify-start gap-2 items-end animate-fade-in">
                <span
                  className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                </span>
                <div className="max-w-[78%] bg-card border border-border/60 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm">
                  {streamingText ? (
                    <ChatBubbleText text={streamingText} tone="bot" />
                  ) : (
                    <div className="flex space-x-1 items-center py-0.5">
                      <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {ephemeralError && (
              <div className="flex justify-start gap-2 items-end animate-fade-in">
                <span
                  className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10"
                  aria-hidden="true"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-destructive" />
                </span>
                <div className="max-w-[78%] space-y-2 rounded-2xl rounded-bl-md border border-destructive/30 bg-destructive/10 px-3.5 py-2.5">
                  <p className="text-sm text-destructive leading-relaxed">{ephemeralError}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full text-xs"
                      onClick={() => openWhatsApp('Olá! Precisei de ajuda pelo chat do site.')}
                    >
                      Abrir WhatsApp
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-full text-xs"
                      onClick={dismissEphemeralError}
                    >
                      Dispensar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
                {QUICK_REPLIES.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full border-border/80 bg-card/90 text-xs font-medium shadow-sm"
                    onClick={() => {
                      if ('action' in item && item.action === 'whatsapp') {
                        openWhatsApp(item.message);
                        return;
                      }
                      if ('text' in item) void sendMessage(item.text);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-3 border-t border-border bg-card space-y-2">
            <p className="px-1 text-[11px] text-muted-foreground">
              Dúvidas clínicas?{' '}
              <a
                href={buildWhatsAppUrl('Olá! Gostaria de falar com a equipe farmacêutica.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                Fale no WhatsApp
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                aria-label="Mensagem do chat"
                disabled={busy || Boolean(error)}
                className="flex-1 rounded-full border-border bg-input px-3.5 h-10"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void sendMessage()}
                disabled={busy || !inputMessage.trim() || Boolean(error)}
                className="shrink-0 rounded-full gradient-primary hover:brightness-110"
                aria-label="Enviar mensagem"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <Button
        type="button"
        size="icon"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 md:h-16 md:w-16 rounded-full gradient-primary hover:brightness-110 hover:scale-105 active:scale-95 animate-pulse-soft shadow-lg shadow-primary/30 [&_svg]:size-7 md:[&_svg]:size-8"
        aria-label="Abrir chat"
      >
        <MessageCircle />
      </Button>
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
