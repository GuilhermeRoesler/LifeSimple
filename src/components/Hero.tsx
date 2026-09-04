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
      className="relative min-h-[100svh] flex items-end lg:items-center overflow-hidden text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center animate-ken-burns will-change-transform"
        style={{ backgroundImage: `url(${publicUrl('/background-hero.jpg')})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-dark/88 via-primary-dark/55 to-primary/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 pb-16 pt-28 lg:py-32">
        <div className="max-w-3xl animate-fade-in">
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-white/80 mb-5 font-medium">
            Farmácia de manipulação · Porto Alegre
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[0.95] mb-6 drop-shadow-sm">
            Life Simple
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-xl mb-10 font-light">
            Fórmulas personalizadas com orientação farmacêutica, qualidade em cada dose e
            atendimento humano do primeiro contato à entrega.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="border-0 bg-[linear-gradient(135deg,hsl(175_45%_32%),hsl(175_40%_48%))] text-white hover:opacity-90 transition-all duration-300 h-12 px-7 text-base shadow-lg shadow-black/25"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale conosco
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToProducts}
              className="border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary-dark h-12 px-7 text-base transition-all duration-300"
            >
              Ver produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
