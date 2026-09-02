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
    <section id="faq" className="py-12 bg-accent md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Respostas rápidas sobre manipulação, entrega e atendimento
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group bg-card rounded-xl border border-border px-5 py-4"
            >
              <summary className="cursor-pointer font-medium text-foreground list-none flex items-center justify-between gap-4">
                <span>{item.question}</span>
                <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
