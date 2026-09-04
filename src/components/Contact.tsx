import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Reveal from '@/components/Reveal';
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
    <section id="contato" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-2 font-medium">
            Contato
          </p>
          <h2 className="section-title text-foreground">Fale com a Life Simple</h2>
          <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">
            Envie sua mensagem e continue a conversa no WhatsApp com a nossa equipe.
          </p>
        </Reveal>

        <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border/70 shadow-[0_24px_60px_-40px_hsl(175_42%_20%/0.5)]">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-5 bg-primary-dark text-primary-foreground p-6 sm:p-8 relative overflow-hidden">
              <div
                className="pointer-events-none absolute -right-12 -bottom-14 h-40 w-40 rounded-full bg-primary-light/15 blur-2xl"
                aria-hidden="true"
              />

              <div className="space-y-4 relative">
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Endereço</p>
                    <p className="text-sm text-white/70 leading-snug">
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
                      className="text-primary-light text-sm font-medium mt-1.5 inline-block hover:underline"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Horário</p>
                    <p className="text-sm text-white/70 leading-snug">
                      {BUSINESS_HOURS.weekdays}
                      <br />
                      {BUSINESS_HOURS.saturday}
                      <br />
                      {BUSINESS_HOURS.sunday}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Canais</p>
                    <p className="text-sm text-white/70 leading-snug">
                      WhatsApp: {PHONE_DISPLAY}
                      <br />
                      E-mail: {EMAIL}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 h-40 sm:h-60 bg-black/20">
                <iframe
                  title="Localização Life Simple no mapa"
                  src={MAPS_EMBED_URL}
                  className="w-full h-full border-0 grayscale-[30%] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="lg:col-span-7 bg-card p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      className="mt-1 h-10"
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
                      className="mt-1 h-10"
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
                    className="mt-1 h-10"
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
                    rows={4}
                    className="mt-1 min-h-[88px]"
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
                  <Label
                    htmlFor="consentimento"
                    className="text-sm text-muted-foreground leading-snug"
                  >
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
                    className={`p-2.5 rounded-lg text-sm ${
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
                  className="w-full h-11 gradient-primary cta-sheen hover:brightness-110 hover:shadow-md hover:shadow-primary/25"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar via WhatsApp'}
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
