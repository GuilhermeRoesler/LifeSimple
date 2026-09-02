import { Phone, Beaker, Truck } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    title: 'Consulta',
    description: 'Entre em contato conosco pelo WhatsApp ou telefone para discutir suas necessidades.'
  },
  {
    icon: Beaker,
    title: 'Formulação',
    description: 'Nossos farmacêuticos preparam sua fórmula personalizada com máxima qualidade.'
  },
  {
    icon: Truck,
    title: 'Entrega',
    description: 'Receba seu produto em casa com rapidez e segurança, pronto para uso.'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-12 px-4 md:px-12 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Processo simples e rápido para você receber seus medicamentos manipulados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                    <svg className="w-8 h-2" viewBox="0 0 32 8">
                      <path
                        d="M0 4 L24 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="text-border"
                      />
                      <path
                        d="M24 4 L32 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}