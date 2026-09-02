import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/lib/whatsapp';
import { publicUrl } from '@/lib/utils';

export default function Hero() {
  const handleWhatsApp = () => {
    openWhatsApp('Olá! Gostaria de informações sobre produtos manipulados.');
  };

  const scrollToProducts = () => {
    document.querySelector('#produtos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative pt-20 lg:pt-24 min-h-screen flex items-center justify-center text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${publicUrl('/background-hero.jpg')})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-primary/85 to-primary-light/80" />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 place-items-center">
          <div className="animate-fade-in text-center flex flex-col items-center">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80 mb-4 font-medium">
              Farmácia de manipulação · Porto Alegre
            </p>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-light mb-8 leading-tight font-inter">
              Life Simple
            </h1>

            <p className="text-base lg:text-lg text-gray-100 mb-8 leading-relaxed max-w-3xl font-inter font-normal">
              Cuidar da sua saúde é a nossa prioridade. Medicamentos, bem-estar e cuidados
              pessoais com atendimento atencioso, orientação segura e qualidade em cada fórmula.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="gradient-primary hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Fale conosco
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToProducts}
                className="border-white/80 text-white bg-transparent hover:bg-white hover:text-primary"
              >
                Ver Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 justify-center">
              {['Farmácia Registrada', 'Entrega Rápida', 'Qualidade Garantida'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-light" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
