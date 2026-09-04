import { faqItems } from '@/data/faq';
import Reveal from '@/components/Reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
        <Reveal className="mb-12">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
            Dúvidas
          </p>
          <h2 className="section-title text-foreground">Perguntas frequentes</h2>
          <p className="section-lead text-muted-foreground">
            Respostas rápidas sobre manipulação, entrega e atendimento.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <Accordion
            type="single"
            collapsible
            className="border-t border-border"
            defaultValue={faqItems[0]?.question}
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>
                  <span className="text-base md:text-lg leading-snug pr-2">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
