import { faqItems } from '@/data/faq';

export default function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="section-pad bg-accent/70">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
            Dúvidas
          </p>
          <h2 className="section-title text-foreground">Perguntas frequentes</h2>
          <p className="section-lead text-muted-foreground">
            Respostas rápidas sobre manipulação, entrega e atendimento.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-6 font-medium text-foreground">
                <span className="text-base md:text-lg leading-snug pr-2">{item.question}</span>
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-primary text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-12 text-muted-foreground text-sm md:text-[0.95rem] leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
