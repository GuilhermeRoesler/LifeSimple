import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve um caminho de `public/` respeitando o `base` do Vite (ex.: GitHub Pages). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${normalized}`;
}
