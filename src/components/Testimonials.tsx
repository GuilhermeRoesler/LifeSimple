import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Patrícia L.',
    city: 'Porto Alegre, RS',
    rating: 5,
    text: 'Atendimento cuidadoso e fórmulas bem orientadas. Consigo tirar dúvidas pelo WhatsApp com praticidade.',
  },
  {
    name: 'Ricardo M.',
    city: 'Canoas, RS',
    rating: 5,
    text: 'Pedido pelo site, retirada rápida e embalagem caprichada. A equipe esclareceu doses e prazo com clareza.',
  },
  {
    name: 'Ana C.',
    city: 'Navegantes, Porto Alegre',
    rating: 5,
    text: 'Farmácia da região em que confio. Sempre recebo orientação detalhada sobre o uso dos manipulados.',
  },
  {
    name: 'Carlos O.',
    city: 'São Leopoldo, RS',
    rating: 5,
    text: 'Entrega na região metropolitana no prazo combinado. Produtos bem identificados e com validade clara.',
  },
  {
    name: 'Juliana S.',
    city: 'Porto Alegre, RS',
    rating: 5,
    text: 'Gostei do catálogo online e do retorno pelo WhatsApp. Processo simples do orçamento à retirada.',
  },
  {
    name: 'Eduardo A.',
    city: 'Viamão, RS',
    rating: 5,
    text: 'Equipe atenciosa para montar a fórmula conforme a orientação profissional. Recomendo para quem busca manipulação local.',
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-12 bg-accent md:px-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relatos de clientes da região metropolitana de Porto Alegre
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={`${testimonial.name}-${testimonial.city}`}
              className="hover:shadow-lg transition-shadow duration-300 animate-slide-up"
            >
              <CardContent className="p-6">
                <div className="flex mb-4" aria-label={`${testimonial.rating} de 5 estrelas`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>

                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
