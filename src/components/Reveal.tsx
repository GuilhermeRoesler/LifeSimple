import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReveal } from '@/hooks/useReveal';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
};

export default function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn('reveal', visible && 'reveal-visible', className)}
      style={{ '--reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
