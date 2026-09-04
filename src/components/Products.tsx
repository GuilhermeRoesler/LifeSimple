import { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductModal from './ProductModal';
import { Product } from '@/types';
import { initialProducts } from '@/data/products';
import { filterProductsBySearch, formatPrice } from '@/lib/format';
import { publicUrl } from '@/lib/utils';

const CATEGORIES = ['Emagrecimento', 'Academia', 'Pele'] as const;

function ProductCarousel({
  products,
  onViewDetails,
}: {
  products: Product[];
  onViewDetails: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-border bg-accent/50">
        <p className="text-muted-foreground text-lg">Nenhum produto encontrado nesta categoria.</p>
        <p className="text-sm text-muted-foreground mt-2">Tente outro termo de busca ou categoria.</p>
      </div>
    );
  }

  return (
    <Carousel opts={{ align: 'start', loop: true }} className="w-full">
      <CarouselContent className="-ml-3 md:-ml-5">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="pl-3 md:pl-5 basis-[85%] sm:basis-1/2 lg:basis-1/3"
          >
            <article className="group h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border/70 transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_48px_-28px_hsl(175_42%_28%/0.45)]">
              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-accent to-secondary text-left"
              >
                <img
                  src={publicUrl(product.imagem)}
                  alt={product.nome}
                  width={400}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 m-auto h-[78%] w-auto max-w-[70%] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                    Ver detalhes
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </button>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {product.nome}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {product.descricao_curta}
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <p className="text-xl font-semibold text-primary tabular-nums">
                    {formatPrice(product.preco)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(product)}
                    className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-4 border-border bg-card/95 shadow-md" />
      <CarouselNext className="right-0 md:-right-4 border-border bg-card/95 shadow-md" />
    </Carousel>
  );
}

export default function Products() {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const filteredProducts = filterProductsBySearch(initialProducts, search);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <section id="produtos" className="section-pad gradient-surface">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 animate-fade-in">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-primary mb-3 font-medium">
              Catálogo
            </p>
            <h2 className="section-title text-foreground">Nossos produtos</h2>
            <p className="section-lead text-muted-foreground">
              Fórmulas manipuladas com padrão farmacêutico para emagrecimento, performance e pele.
            </p>
          </div>

          <div className="w-full max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar produtos"
              className="pl-10 h-11 bg-card border-border shadow-sm"
            />
          </div>
        </div>

        <Tabs defaultValue="Emagrecimento" className="w-full">
          <TabsList className="w-full max-w-lg h-auto p-1 bg-secondary/80 rounded-full grid grid-cols-3">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => (
            <TabsContent key={category} value={category} className="mt-10">
              <ProductCarousel
                products={filteredProducts.filter((p) => p.categoria === category)}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          ))}
        </Tabs>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={showProductModal}
            onClose={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </section>
  );
}
