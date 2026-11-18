import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Favorites = { slugs: string[]; toggle: (slug: string) => void };
export const useFavorites = create<Favorites>()(persist(
  (set) => ({
    slugs: [],
    toggle: (slug) => set(({ slugs }) => ({
      slugs: slugs.includes(slug) ? slugs.filter((saved) => saved !== slug) : [...slugs, slug],
    })),
  }),
  { name: 'oculos-favorites', partialize: ({ slugs }) => ({ slugs }) },
));
