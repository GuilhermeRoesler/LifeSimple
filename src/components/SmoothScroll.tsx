import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import 'lenis/dist/lenis.css';
import { HEADER_SCROLL_OFFSET, registerLenis } from '@/lib/scroll';

const lenisOptions: LenisOptions = {
  autoRaf: true,
  lerp: 0.12,
  smoothWheel: true,
  syncTouch: false,
  anchors: { offset: HEADER_SCROLL_OFFSET },
  allowNestedScroll: true,
  respectReducedMotion: true,
  prevent: (node) => Boolean(node.closest('[data-lenis-prevent]')),
};

function LenisBridge({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const { pathname } = useLocation();

  useEffect(() => {
    registerLenis(lenis ?? null);
    return () => registerLenis(null);
  }, [lenis]);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    lenis?.resize();
  }, [pathname, lenis]);

  return children;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <LenisBridge>{children}</LenisBridge>
    </ReactLenis>
  );
}
