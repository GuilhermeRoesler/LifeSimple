import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReveal } from '@/hooks/useReveal';

type RevealVariant = 'up' | 'fade' | 'scale' | 'left';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
  variant?: RevealVariant;
};

const variantClass: Record<RevealVariant, string> = {
  up: '',
  fade: 'reveal-fade',
  scale: 'reveal-scale',
  left: 'reveal-left',
};

export default function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
  variant = 'up',
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn('reveal', variantClass[variant], visible && 'reveal-visible', className)}
      style={{ '--reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
