import type Lenis from 'lenis';
import type { ScrollToOptions } from 'lenis';

/** Compensa o header fixo (h-16 / lg:h-[4.5rem]). */
export const HEADER_SCROLL_OFFSET = -80;

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function scrollToAnchor(
  target: string | number | HTMLElement,
  options: ScrollToOptions = {},
) {
  if (lenis) {
    lenis.scrollTo(target, { offset: HEADER_SCROLL_OFFSET, ...options });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
