import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ContactForm } from '@/types';
import {
  BUSINESS_HOURS,
  ADDRESS_LINES,
  EMAIL,
  PHONE_DISPLAY,
  MAPS_EMBED_URL,
  MAPS_LINK,
} from '@/constants/contact';
import { openWhatsApp } from '@/lib/whatsapp';

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
    consentimento: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consentimento) {
      setSubmitMessage('Por favor, aceite os termos de consentimento.');
      return;
    }

    setIsSubmitting(true);

    try {
      const telefoneLine = formData.telefone ? `*Telefone:* ${formData.telefone}\n` : '';
      const mensagemWhatsApp = `Olá! Vim através do site da Life Simple!

*Nome:* ${formData.nome}
*E-mail:* ${formData.email}
${telefoneLine}*Mensagem:* ${formData.mensagem}

Aguardo retorno. Obrigado(a)!`;

      openWhatsApp(mensagemWhatsApp);
      setSubmitMessage('Redirecionando para o WhatsApp...');

      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          mensagem: '',
          consentimento: false,
        });
      }, 2000);
    } catch (error) {
      setSubmitMessage('Erro ao processar. Por favor, tente novamente.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 8000);
    }
  };

  return (
    <section id="contato" className="section-pad bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
          <div className="lg:col-span-5 animate-fade-in">
            <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
              Contato
            </p>
            <h2 className="section-title text-foreground">Fale com a Life Simple</h2>
            <p className="section-lead text-muted-foreground">
              Envie sua mensagem e continue a conversa no WhatsApp com a nossa equipe.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Endereço</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ADDRESS_LINES.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium mt-2 inline-block hover:underline"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Horário</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {BUSINESS_HOURS.weekdays}
                    <br />
                    {BUSINESS_HOURS.saturday}
                    <br />
                    {BUSINESS_HOURS.sunday}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Canais</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    WhatsApp: {PHONE_DISPLAY}
                    <br />
                    E-mail: {EMAIL}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-border aspect-[16/10] bg-accent">
              <iframe
                title="Localização Life Simple no mapa"
                src={MAPS_EMBED_URL}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="lg:col-span-7 animate-slide-up">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[0_20px_50px_-40px_hsl(175_42%_20%/0.5)] space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="mt-1.5 h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="mt-1.5 h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(51) 98935-4834"
                  className="mt-1.5 h-11"
                />
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem *</Label>
                <Textarea
                  id="mensagem"
                  required
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  placeholder="Como podemos ajudar você?"
                  rows={5}
                  className="mt-1.5"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consentimento"
                  checked={formData.consentimento}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consentimento: checked === true })
                  }
                />
                <Label htmlFor="consentimento" className="text-sm text-muted-foreground leading-relaxed">
                  Concordo com o processamento dos meus dados pessoais de acordo com a{' '}
                  <Link to="/privacidade" className="text-primary underline">
                    Política de Privacidade
                  </Link>{' '}
                  e a{' '}
                  <Link to="/lgpd" className="text-primary underline">
                    LGPD
                  </Link>
                  .
                </Label>
              </div>

              {submitMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    submitMessage.includes('Redirecionando')
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 gradient-primary hover:opacity-90 text-base"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar via WhatsApp'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
