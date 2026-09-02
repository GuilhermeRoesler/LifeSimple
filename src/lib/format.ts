const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Formata preço armazenado como "79.90" para "R$ 79,90". */
export function formatPrice(value: string | number): string {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value);
  if (Number.isNaN(amount)) return String(value);
  return currencyFormatter.format(amount);
}

/** Saudação neutra conforme horário local. */
export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'bom dia';
  if (hour < 18) return 'boa tarde';
  return 'boa noite';
}

export function filterProductsBySearch<T extends { nome: string; descricao_curta: string }>(
  products: T[],
  search: string
): T[] {
  const term = search.trim().toLowerCase();
  if (!term) return products;
  return products.filter(
    (product) =>
      product.nome.toLowerCase().includes(term) ||
      product.descricao_curta.toLowerCase().includes(term)
  );
}
