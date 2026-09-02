import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
    <section id="contato" className="py-12 bg-background">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa equipe da Life Simple está pronta para atender você com cuidado e profissionalismo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="animate-slide-up max-w-lg mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      className="border-black border-gradient-primary mt-1"
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
                      className="border-black border-gradient-primary mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone (opcional)</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(51) 98935-4834"
                      className="border-black border-gradient-primary mt-1"
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
                      className="border-black border-gradient-primary mt-1"
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
                    <Label htmlFor="consentimento" className="text-sm text-muted-foreground">
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
                          ? 'bg-green-500/10 text-green-600 border border-green-200'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-primary hover:opacity-90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar via WhatsApp'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-slide-up max-w-lg mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
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
                      className="text-primary text-sm underline mt-2 inline-block"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl overflow-hidden border border-border aspect-video bg-accent">
              <iframe
                title="Localização Life Simple no mapa"
                src={MAPS_EMBED_URL}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">
                      {BUSINESS_HOURS.weekdays}
                      <br />
                      {BUSINESS_HOURS.saturday}
                      <br />
                      {BUSINESS_HOURS.sunday}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefones</h3>
                    <p className="text-muted-foreground">
                      WhatsApp: {PHONE_DISPLAY}
                      <br />
                      E-mail: {EMAIL}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
