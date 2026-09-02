import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@/types';
import { openWhatsApp } from '@/lib/whatsapp';
import { formatPrice, greetingForNow } from '@/lib/format';
import { publicUrl } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const handleWhatsApp = () => {
    openWhatsApp(
      `Olá, ${greetingForNow()}! Gostaria de informações sobre o produto ${product.nome} da categoria ${product.categoria}.`
    );
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.nome}</DialogTitle>
          <DialogDescription className="text-base">
            Categoria: {product.categoria}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div>
            <img
              src={publicUrl(product.imagem)}
              alt={product.nome}
              width={480}
              height={480}
              loading="lazy"
              decoding="async"
              className="w-full rounded-lg object-contain bg-accent"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{product.descricao_longa}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Modo de Uso</h3>
              <p className="text-muted-foreground">
                Conforme orientação do farmacêutico ou prescrição médica.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Importante</h3>
              <p className="text-muted-foreground text-sm">
                Consulte um profissional de saúde antes do uso. A disponibilidade e a necessidade
                de receita variam conforme a fórmula. Informações deste site não substituem
                orientação farmacêutica personalizada.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-3xl font-bold text-primary">{formatPrice(product.preco)}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleWhatsApp} className="w-full gradient-primary hover:opacity-90">
            <MessageCircle className="mr-2 h-4 w-4" />
            Fale Conosco no WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
