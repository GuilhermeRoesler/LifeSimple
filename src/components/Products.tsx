import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductModal from './ProductModal';
import Reveal from '@/components/Reveal';
import { Product } from '@/types';
import { initialProducts } from '@/data/products';
import { filterProductsBySearch, formatPrice } from '@/lib/format';
import OptimizedImage from '@/components/OptimizedImage';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Emagrecimento', 'Academia', 'Pele'] as const;
type Category = (typeof CATEGORIES)[number];

function ProductCarousel({
  products,
  onViewDetails,
}: {
  products: Product[];
  onViewDetails: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border bg-accent/50">
        <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
        <p className="text-sm text-muted-foreground mt-1.5">Tente outro termo de busca ou categoria.</p>
      </div>
    );
  }

  return (
    <Carousel opts={{ align: 'start', loop: true }} className="w-full">
      <CarouselContent className="-ml-2.5 md:-ml-3.5">
        {products.map((product, index) => (
          <CarouselItem
            key={product.id}
            className="pl-2.5 md:pl-3.5 basis-[78%] sm:basis-1/2 lg:basis-1/3"
          >
            <Card
              className="group h-full flex flex-col overflow-hidden rounded-xl border-border/70 shadow-none transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-24px_hsl(175_42%_28%/0.45)] animate-stagger-in"
              style={{ '--stagger-delay': `${index * 90}ms` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className="relative aspect-[4/3] overflow-hidden product-glow text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center rounded-full border border-primary/15 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-sm">
                  Life Simple
                </span>
                <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-primary-dark/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {product.categoria}
                </span>

                <span
                  className="pointer-events-none absolute inset-x-[18%] bottom-[10%] h-6 rounded-[100%] bg-primary/25 blur-xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <OptimizedImage
                  src={product.imagem}
                  alt={product.nome}
                  width={320}
                  height={240}
                  className="absolute inset-0 m-auto h-[72%] w-auto max-w-[62%] object-contain drop-shadow-[0_12px_22px_rgba(20,50,45,0.2)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-0.5"
                />

                <span className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
                    Ver detalhes
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </button>

              <CardContent className="flex flex-1 flex-col p-3.5 sm:p-4">
                <CardTitle className="text-base leading-snug">{product.nome}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2 text-sm">
                  {product.descricao_curta}
                </CardDescription>
                <CardFooter className="mt-auto flex items-center justify-between gap-2 p-0 pt-3">
                  <p className="text-lg font-semibold text-primary tabular-nums">
                    {formatPrice(product.preco)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(product)}
                    className="h-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Detalhes
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-3 border-border bg-card/95 shadow-md" />
      <CarouselNext className="right-0 md:-right-3 border-border bg-card/95 shadow-md" />
    </Carousel>
  );
}

function CategoryTabs({
  value,
  search,
  onSearchChange,
}: {
  value: Category;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const [searchOpen, setSearchOpen] = useState(false);

  const updateIndicator = () => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) return;
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth, ready: true });
  };

  useLayoutEffect(() => {
    if (searchOpen) return;
    updateIndicator();
  }, [value, searchOpen]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(list);
    window.addEventListener('resize', updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const id = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [searchOpen]);

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    onSearchChange('');
  };

  return (
    <div
      className={cn(
        'relative mx-auto flex h-11 w-full max-w-md items-center overflow-hidden rounded-full border border-border/70 bg-card p-0.5 shadow-sm transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        searchOpen ? 'max-w-lg' : 'max-w-md'
      )}
    >
      <div
        aria-hidden={searchOpen}
        className={cn(
          'absolute inset-0.5 flex items-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          searchOpen
            ? 'pointer-events-none -translate-x-3 scale-[0.98] opacity-0'
            : 'translate-x-0 scale-100 opacity-100'
        )}
      >
        <TabsList
          ref={listRef}
          className="relative grid h-full min-w-0 flex-1 grid-cols-3 bg-transparent p-0"
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-0 bottom-0 rounded-full bg-primary shadow-sm transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              indicator.ready ? 'opacity-100' : 'opacity-0'
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              tabIndex={searchOpen ? -1 : undefined}
              className="relative z-10 rounded-full py-2 text-sm text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <button
          type="button"
          onClick={openSearch}
          aria-label="Buscar produtos"
          className="relative z-10 mr-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          'flex h-full w-full items-center gap-1.5 px-1.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          searchOpen
            ? 'relative translate-x-0 scale-100 opacity-100'
            : 'pointer-events-none absolute inset-0.5 translate-x-3 scale-[0.98] opacity-0'
        )}
      >
        <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          ref={searchInputRef}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeSearch();
          }}
          placeholder="Buscar produtos..."
          aria-label="Buscar produtos"
          tabIndex={searchOpen ? 0 : -1}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={closeSearch}
          aria-label="Fechar busca"
          tabIndex={searchOpen ? 0 : -1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('Emagrecimento');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const filteredProducts = filterProductsBySearch(initialProducts, search);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <section id="produtos" className="py-12 md:py-16 gradient-surface">
      <div className="container mx-auto px-4">
        <Reveal className="max-w-2xl mb-7">
          <p className="text-xs uppercase tracking-[0.24em] text-primary mb-2 font-medium">
            Catálogo
          </p>
          <h2 className="section-title text-foreground">Nossos produtos</h2>
          <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl">
            Fórmulas manipuladas com padrão farmacêutico para emagrecimento, performance e pele.
          </p>
        </Reveal>

        <div className="mx-auto max-w-5xl">
          <Tabs
            value={category}
            onValueChange={(next) => setCategory(next as Category)}
            className="w-full"
          >
            <div className="mb-6 flex justify-center">
              <CategoryTabs
                value={category}
                search={search}
                onSearchChange={setSearch}
              />
            </div>

            {CATEGORIES.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-0">
                <ProductCarousel
                  products={filteredProducts.filter((p) => p.categoria === cat)}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

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
