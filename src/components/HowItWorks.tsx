const steps = [
  {
    number: '01',
    title: 'Consulta',
    description: 'Conte seu objetivo pelo WhatsApp. Orientamos com segurança e clareza.',
  },
  {
    number: '02',
    title: 'Formulação',
    description: 'Farmacêuticos preparam a fórmula personalizada com qualidade controlada.',
  },
  {
    number: '03',
    title: 'Entrega',
    description: 'Retire na farmácia ou receba em casa, pronto para o uso orientado.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-pad bg-primary-dark text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14 md:mb-16 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.24em] text-primary-light mb-3 font-medium">
            Processo
          </p>
          <h2 className="section-title text-white">Como funciona</h2>
          <p className="section-lead text-white/75">
            Três passos simples do primeiro contato à fórmula na sua mão.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-10 md:gap-0">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className="relative animate-slide-up md:px-8 first:md:pl-0 last:md:pr-0"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 right-0 w-px h-[calc(100%-1.75rem)] bg-white/15 translate-x-1/2"
                  aria-hidden="true"
                />
              )}

              <p className="font-display text-4xl md:text-5xl text-primary-light/90 mb-4 tracking-tight">
                {step.number}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-white/65 leading-relaxed text-[0.95rem]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
