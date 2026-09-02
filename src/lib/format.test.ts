import { describe, expect, it } from 'vitest';
import { filterProductsBySearch, formatPrice, greetingForNow } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

describe('formatPrice', () => {
  it('formata string decimal para BRL', () => {
    expect(formatPrice('79.90')).toMatch(/R\$\s*79,90/);
  });

  it('mantém valor inválido como string', () => {
    expect(formatPrice('abc')).toBe('abc');
  });
});

describe('greetingForNow', () => {
  it('retorna bom dia pela manhã', () => {
    expect(greetingForNow(new Date(2026, 0, 1, 9))).toBe('bom dia');
  });

  it('retorna boa tarde à tarde', () => {
    expect(greetingForNow(new Date(2026, 0, 1, 15))).toBe('boa tarde');
  });

  it('retorna boa noite à noite', () => {
    expect(greetingForNow(new Date(2026, 0, 1, 21))).toBe('boa noite');
  });
});

describe('filterProductsBySearch', () => {
  const products = [
    { nome: 'Creatina Pura', descricao_curta: 'Força muscular' },
    { nome: 'Colágeno Premium', descricao_curta: 'Anti-aging' },
  ];

  it('retorna todos sem termo', () => {
    expect(filterProductsBySearch(products, '  ')).toHaveLength(2);
  });

  it('filtra por nome', () => {
    expect(filterProductsBySearch(products, 'colágeno')).toHaveLength(1);
  });
});

describe('buildWhatsAppUrl', () => {
  it('monta URL sem mensagem', () => {
    expect(buildWhatsAppUrl()).toBe('https://wa.me/5551989354834');
  });

  it('codifica mensagem', () => {
    expect(buildWhatsAppUrl('Olá!')).toContain('text=Ol%C3%A1!');
  });
});
