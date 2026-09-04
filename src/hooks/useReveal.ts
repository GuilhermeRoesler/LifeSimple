import { useEffect, useRef, useState } from 'react';

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.08,
  rootMargin = '0px 0px -40px 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    if (prefersReducedMotion()) {
      queueMicrotask(() => {
        if (!cancelled) setVisible(true);
      });
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Catch elements already in view on mount / after layout
    requestAnimationFrame(() => {
      if (cancelled) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh - 40 && rect.bottom > 40) {
        setVisible(true);
        if (once) observer.disconnect();
      }
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  return { ref, visible };
}
