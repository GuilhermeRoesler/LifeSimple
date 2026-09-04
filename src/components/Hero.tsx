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

  const heroSm = publicUrl('/background-hero-sm.webp');
  const heroLg = publicUrl('/background-hero.webp');
  const heroFallback = publicUrl('/background-hero.jpg');

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-end lg:items-center overflow-hidden text-white"
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`${heroSm} 960w, ${heroLg} 1920w`}
          sizes="100vw"
        />
        <img
          src={heroFallback}
          alt=""
          width={1920}
          height={1080}
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center animate-ken-burns will-change-transform"
          aria-hidden="true"
        />
      </picture>
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-dark/88 via-primary-dark/55 to-primary-dark/15 lg:via-primary-dark/45 lg:to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 pb-16 pt-28 lg:py-32">
        <div className="max-w-2xl animate-fade-in">
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

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/55"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
