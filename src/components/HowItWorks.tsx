import { MessageCircle, FlaskConical, Package } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/lib/whatsapp';

const steps = [
  {
    number: '01',
    title: 'Consulta',
    description: 'Conte seu objetivo pelo WhatsApp. Orientamos com segurança e clareza.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Formulação',
    description: 'Farmacêuticos preparam a fórmula personalizada com qualidade controlada.',
    icon: FlaskConical,
  },
  {
    number: '03',
    title: 'Entrega',
    description: 'Retire na farmácia ou receba em casa, pronto para o uso orientado.',
    icon: Package,
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative section-pad bg-primary-dark text-primary-foreground overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <p
        className="pointer-events-none absolute -right-6 top-10 font-display text-[clamp(6rem,18vw,14rem)] leading-none text-white/[0.04] select-none"
        aria-hidden="true"
      >
        01–03
      </p>

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end mb-14 md:mb-20">
          <Reveal className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.24em] text-primary-light mb-3 font-medium">
              Processo
            </p>
            <h2 className="section-title text-white">Do WhatsApp à fórmula na sua mão</h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delayMs={120}>
            <p className="text-white/70 text-base md:text-lg leading-relaxed lg:text-right">
              Três etapas claras, sem burocracia desnecessária — com orientação farmacêutica em
              cada passo.
            </p>
          </Reveal>
        </div>

        <ol className="relative grid md:grid-cols-3 gap-10 md:gap-6">
          <div
            className="hidden md:block absolute top-[2.75rem] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} as="li" delayMs={index * 110} className="relative">
                <div className="flex flex-col md:items-start">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm text-primary-light">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <p className="font-display text-5xl md:text-6xl text-primary-light/85 mb-3 tracking-tight">
                    {step.number}
                  </p>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-white/65 leading-relaxed text-[0.95rem] max-w-xs">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Reveal className="mt-14 md:mt-16" delayMs={280}>
          <Button
            size="lg"
            onClick={() =>
              openWhatsApp('Olá! Quero iniciar uma consulta sobre uma fórmula manipulada.')
            }
            className="h-12 px-7 border-0 bg-white text-primary-dark hover:bg-white/90"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Começar pelo WhatsApp
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
