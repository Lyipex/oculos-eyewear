import { products } from './products';

export const minPrice = Math.floor(Math.min(...products.map(({ price }) => price)) / 10) * 10;
export const maxPrice = Math.ceil(Math.max(...products.map(({ price }) => price)) / 10) * 10;

export function catalogParams(input: Pick<URLSearchParams, 'get'>) {
  const params = new URLSearchParams();
  const category = input.get('categoria');
  if (category === 'Sol' || category === 'Grau') params.set('categoria', category);
  if (input.get('colecao') === 'novidades') params.set('colecao', 'novidades');
  const query = input.get('q')?.trim().slice(0, 80);
  if (query) params.set('q', query);

  const price = input.get('preco');
  if (price && /^\d+$/.test(price)) {
    const limit = Math.max(minPrice, Math.min(maxPrice, Math.round(Number(price) / 10) * 10));
    if (limit !== maxPrice) params.set('preco', String(limit));
  }

  const sort = input.get('ordem');
  if (sort === 'menor' || sort === 'maior' || sort === 'nome') params.set('ordem', sort);
  return params;
}

export function catalogHref(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/produtos?${query}` : '/produtos';
}
