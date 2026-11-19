import type { Product } from './products';

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Shared by the existing catalog and the header's local live results.
export function matchesProductQuery(product: Product, query: string) {
  return normalize(`${product.name} óculos de ${product.category}`).includes(normalize(query.trim()));
}
