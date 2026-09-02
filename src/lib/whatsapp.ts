import { WHATSAPP_NUMBER } from '@/constants/contact';

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message?: string): void {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
