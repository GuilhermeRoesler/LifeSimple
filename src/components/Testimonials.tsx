import Reveal from '@/components/Reveal';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Patrícia L.',
    city: 'Porto Alegre, RS',
    text: 'Atendimento cuidadoso e fórmulas bem orientadas. Consigo tirar dúvidas pelo WhatsApp com praticidade.',
    tone: 'from-primary/25 via-primary/10 to-accent',
  },
  {
    name: 'Ricardo M.',
    city: 'Canoas, RS',
    text: 'Pedido pelo site, retirada rápida e embalagem caprichada. A equipe esclareceu doses e prazo com clareza.',
    tone: 'from-primary-dark/20 via-secondary to-accent',
  },
  {
    name: 'Ana C.',
    city: 'Navegantes, Porto Alegre',
    text: 'Farmácia da região em que confio. Sempre recebo orientação detalhada sobre o uso dos manipulados.',
    tone: 'from-emerald-200/50 via-primary/10 to-teal-50',
  },
  {
    name: 'Carlos O.',
    city: 'São Leopoldo, RS',
    text: 'Entrega na região metropolitana no prazo combinado. Produtos bem identificados e com validade clara.',
    tone: 'from-cyan-100 via-primary/10 to-secondary',
  },
  {
    name: 'Juliana S.',
    city: 'Porto Alegre, RS',
    text: 'Gostei do catálogo online e do retorno pelo WhatsApp. Processo simples do orçamento à retirada.',
    tone: 'from-primary-light/30 via-accent to-secondary',
  },
  {
    name: 'Eduardo A.',
    city: 'Viamão, RS',
    text: 'Equipe atenciosa para montar a fórmula conforme a orientação profissional. Recomendo para quem busca manipulação local.',
    tone: 'from-teal-200/40 via-primary/15 to-accent',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Avatar({
  name,
  tone,
  size = 'md',
}: {
  name: string;
  tone: string;
  size?: 'md' | 'lg';
}) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-primary ring-2 ring-white shadow-[0_8px_20px_-10px_hsl(175_42%_28%/0.55)]',
        tone,
        size === 'lg' ? 'h-14 w-14 text-sm' : 'h-10 w-10 text-xs'
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-[3px] rounded-full bg-white/55 backdrop-blur-[1px]" />
      <span className="relative">{initials(name)}</span>
    </span>
  );
}

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="depoimentos" className="relative section-pad bg-background overflow-hidden">
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
            Clientes
          </p>
          <h2 className="section-title text-foreground">O que dizem sobre nós</h2>
          <p className="section-lead text-muted-foreground">
            Relatos de clientes da região metropolitana de Porto Alegre.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal as="blockquote" className="lg:col-span-6 lg:sticky lg:top-28 lg:self-start">
            <p className="font-display text-3xl md:text-4xl lg:text-[2.65rem] leading-snug text-foreground tracking-tight">
              &ldquo;{featured.text}&rdquo;
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <Avatar name={featured.name} tone={featured.tone} size="lg" />
              <div>
                <cite className="not-italic font-semibold text-foreground">{featured.name}</cite>
                <p className="text-sm text-muted-foreground">{featured.city}</p>
              </div>
            </footer>
          </Reveal>

          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {rest.map((testimonial, index) => (
              <Reveal
                as="blockquote"
                key={`${testimonial.name}-${testimonial.city}`}
                delayMs={80 + index * 70}
                className="border-t border-border pt-5"
              >
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <footer className="mt-4 flex items-center gap-3">
                  <Avatar name={testimonial.name} tone={testimonial.tone} />
                  <div>
                    <cite className="not-italic text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </cite>
                    <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                  </div>
                </footer>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
