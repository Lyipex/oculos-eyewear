'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites';
import type { Product } from '@/lib/products';

export function FavoriteButton({ product, color, className = 'icon-button favorite-button', showLabel = false }: {
  product: Product; color: string; className?: string; showLabel?: boolean;
}) {
  const saved = useFavorites((state) => state.items.some((item) => item.slug === product.slug && item.color === color));
  const toggle = useFavorites((state) => state.toggle);
  return (
    <button type="button" className={className}
      aria-label={saved ? `Remover ${product.name}, ${color} dos favoritos` : `Favoritar ${product.name}, ${color}`}
      aria-pressed={saved} onClick={() => toggle(product.slug, color)}>
      <Heart size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      {showLabel && (saved ? 'Salvo nos favoritos' : 'Salvar nos favoritos')}
    </button>
  );
}
