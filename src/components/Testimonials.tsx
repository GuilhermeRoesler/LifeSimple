const testimonials = [
  {
    name: 'Patrícia L.',
    city: 'Porto Alegre, RS',
    text: 'Atendimento cuidadoso e fórmulas bem orientadas. Consigo tirar dúvidas pelo WhatsApp com praticidade.',
  },
  {
    name: 'Ricardo M.',
    city: 'Canoas, RS',
    text: 'Pedido pelo site, retirada rápida e embalagem caprichada. A equipe esclareceu doses e prazo com clareza.',
  },
  {
    name: 'Ana C.',
    city: 'Navegantes, Porto Alegre',
    text: 'Farmácia da região em que confio. Sempre recebo orientação detalhada sobre o uso dos manipulados.',
  },
  {
    name: 'Carlos O.',
    city: 'São Leopoldo, RS',
    text: 'Entrega na região metropolitana no prazo combinado. Produtos bem identificados e com validade clara.',
  },
  {
    name: 'Juliana S.',
    city: 'Porto Alegre, RS',
    text: 'Gostei do catálogo online e do retorno pelo WhatsApp. Processo simples do orçamento à retirada.',
  },
  {
    name: 'Eduardo A.',
    city: 'Viamão, RS',
    text: 'Equipe atenciosa para montar a fórmula conforme a orientação profissional. Recomendo para quem busca manipulação local.',
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

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="depoimentos" className="section-pad bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
            Clientes
          </p>
          <h2 className="section-title text-foreground">O que dizem sobre nós</h2>
          <p className="section-lead text-muted-foreground">
            Relatos de clientes da região metropolitana de Porto Alegre.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <blockquote className="lg:col-span-6 animate-slide-up">
            <p className="font-display text-3xl md:text-4xl lg:text-[2.65rem] leading-snug text-foreground tracking-tight">
              &ldquo;{featured.text}&rdquo;
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                aria-hidden="true"
              >
                {initials(featured.name)}
              </span>
              <div>
                <cite className="not-italic font-semibold text-foreground">{featured.name}</cite>
                <p className="text-sm text-muted-foreground">{featured.city}</p>
              </div>
            </footer>
          </blockquote>

          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {rest.map((testimonial, index) => (
              <blockquote
                key={`${testimonial.name}-${testimonial.city}`}
                className="animate-slide-up border-t border-border pt-5"
                style={{ animationDelay: `${0.08 + index * 0.06}s` }}
              >
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <footer className="mt-4 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary"
                    aria-hidden="true"
                  >
                    {initials(testimonial.name)}
                  </span>
                  <div>
                    <cite className="not-italic text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </cite>
                    <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
