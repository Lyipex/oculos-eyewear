import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from './products';

// null is reserved for legacy favorites whose color was never recorded.
export type Favorite = { slug: string; color: string | null };
export const favoriteKey = ({ slug, color }: Favorite) => `${slug}|${color ?? ''}`;

export function normalizeFavorites(value: unknown): Favorite[] {
  if (!value || typeof value !== 'object') return [];
  const state = value as { items?: unknown; slugs?: unknown };
  const input = Array.isArray(state.items) ? state.items : Array.isArray(state.slugs)
    ? state.slugs.map((slug) => ({ slug, color: null })) : [];
  const unique = new Map<string, Favorite>();
  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue;
    const { slug, color } = entry as Partial<Favorite>;
    const product = products.find((product) => product.slug === slug);
    if (!product || (color !== null && (typeof color !== 'string' || !product.colors.includes(color)))) continue;
    const favorite = { slug: product.slug, color } as Favorite;
    unique.set(favoriteKey(favorite), favorite);
  }
  return [...unique.values()];
}

export function toggleFavorite(items: Favorite[], favorite: Favorite) {
  const key = favoriteKey(favorite);
  return items.some((entry) => favoriteKey(entry) === key)
    ? items.filter((entry) => favoriteKey(entry) !== key)
    : normalizeFavorites({ items: [...items, favorite] });
}

type Favorites = {
  items: Favorite[];
  toggle: (slug: string, color: string) => void;
  remove: (favorite: Favorite) => void;
};
export const useFavorites = create<Favorites>()(persist(
  (set) => ({
    items: [],
    toggle: (slug, color) => set(({ items }) => ({ items: toggleFavorite(items, { slug, color }) })),
    remove: (favorite) => set(({ items }) => ({ items: items.filter((item) => favoriteKey(item) !== favoriteKey(favorite)) })),
  }),
  {
    name: 'oculos-favorites',
    version: 1,
    partialize: ({ items }) => ({ items }),
    migrate: (state) => ({ items: normalizeFavorites(state) }),
    merge: (persisted, current) => ({ ...current, items: normalizeFavorites(persisted) }),
  },
));
