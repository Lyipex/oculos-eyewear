'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { catalogHref, catalogParams, maxPrice, minPrice } from '@/lib/catalog-query';
import { products } from '@/lib/products';
import { ProductCard } from './product-card';

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const sorting = {
  destaque: () => 0,
  menor: (a: number, b: number) => a - b,
  maior: (a: number, b: number) => b - a,
};

export function Catalog({ initialQuery }: { initialQuery: string }) {
  const params = catalogParams(useSearchParams() ?? new URLSearchParams(initialQuery));
  const selected = params.get('categoria');
  const category = selected === 'Sol' || selected === 'Grau' ? selected : 'Todos';
  const query = params.get('q') ?? '';
  const onlyRecent = params.get('colecao') === 'novidades';
  const [showFilters, setShowFilters] = useState(false);
  const max = Number(params.get('preco') ?? maxPrice);
  const sort = params.get('ordem') ?? 'destaque';

  function changeFilter(key: string, value: string, replace = false) {
    const next = new URLSearchParams(window.location.search);
    next.set(key, value);
    const href = catalogHref(catalogParams(next));
    if (replace) window.history.replaceState(null, '', href);
    else window.history.pushState(null, '', href);
  }

  const visibleProducts = products
    .filter((product) => (category === 'Todos' || product.category === category) && product.price <= max
      && (!onlyRecent || product.recent)
      && (!query || normalize(`${product.name} óculos de ${product.category}`).includes(normalize(query))))
    .sort((a, b) => sort === 'nome' ? a.name.localeCompare(b.name, 'pt-BR') : sorting[sort as keyof typeof sorting](a.price, b.price));

  return (
    <section className="shell section catalog">
      <h1>{query ? `Resultados para “${query}”` : onlyRecent ? 'Novidades' : category === 'Todos' ? 'Todos os óculos' : `Óculos de ${category.toLowerCase()}`}</h1>
      <p aria-live="polite" className="results">{visibleProducts.length} {visibleProducts.length === 1 ? 'produto' : 'produtos'}</p>
      <div className="catalog-controls">
        <button type="button" className="button outline filter-toggle" aria-controls="catalog-filters" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={17} /> Filtrar
        </button>
        <div className="filters" id="catalog-filters" data-expanded={showFilters}>
        <label>Categoria
          <select value={category} onChange={(event) => changeFilter('categoria', event.target.value)}>
            <option>Todos</option><option>Sol</option><option>Grau</option>
          </select>
        </label>
        <label>Preço até R$ {max}
          <input type="range" min={minPrice} max={maxPrice} step={10} value={max} onChange={(event) => changeFilter('preco', event.target.value, true)} />
        </label>
        </div>
        <label>Ordenar por
          <select value={sort} onChange={(event) => changeFilter('ordem', event.target.value)}>
            <option value="destaque">Destaques</option><option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option><option value="nome">Nome</option>
          </select>
        </label>
      </div>
      {visibleProducts.length > 0 ? (
        <div className="grid">{visibleProducts.map((product) => <ProductCard key={product.slug} product={product} returnQuery={params.toString()} heading="h2" />)}</div>
      ) : (
        <div>
          <p>Nenhum produto encontrado para estes filtros.</p>
          <button type="button" className="text-link" onClick={() => { window.history.pushState(null, '', '/produtos'); }}>Limpar filtros</button>
        </div>
      )}
    </section>
  );
}
