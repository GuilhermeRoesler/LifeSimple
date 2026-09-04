import type { ImgHTMLAttributes } from 'react';
import { cn, publicUrl } from '@/lib/utils';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  /** Caminho em `public/`, ex. `/img/slim.webp` */
  src: string;
  alt: string;
  /** Prioridade alta (hero LCP). Desativa lazy automaticamente. */
  priority?: boolean;
};

/**
 * Imagem pública com lazy/async por padrão e suporte a `priority` (LCP).
 * Paths via `publicUrl` para respeitar `BASE_URL` (GitHub Pages).
 */
export default function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  loading,
  decoding,
  fetchPriority,
  ...rest
}: OptimizedImageProps) {
  return (
    <img
      src={publicUrl(src)}
      alt={alt}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
      className={cn(className)}
      {...rest}
    />
  );
}
