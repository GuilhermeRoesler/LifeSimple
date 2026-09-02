import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-accent/40">
        <p className="text-muted-foreground text-lg">Nenhum produto encontrado nesta categoria.</p>
        <p className="text-sm text-muted-foreground mt-2">Tente outro termo de busca ou categoria.</p>
      </div>
    );
  }

  return (
    <Carousel opts={{ align: 'start', loop: true }} className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="aspect-video relative overflow-hidden bg-accent flex items-center justify-center p-4">
                <img
                  src={publicUrl(product.imagem)}
                  alt={product.nome}
                  width={400}
                  height={225}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{product.nome}</CardTitle>
                <CardDescription>{product.descricao_curta}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{formatPrice(product.preco)}</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => onViewDetails(product)}
                  className="w-full gradient-primary hover:opacity-90"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="md:flex left-2 translate-y-[-100%]" />
      <CarouselNext className="md:flex right-2 translate-y-[-100%]" />
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
    <section id="produtos" className="py-12 md:px-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Nossos Produtos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Fórmulas manipuladas com qualidade farmacêutica para seus objetivos
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar produtos"
              className="pl-10 border-gradient-primary border-2"
            />
          </div>
        </div>

        <Tabs defaultValue="Emagrecimento" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
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
