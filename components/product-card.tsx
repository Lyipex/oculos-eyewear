'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFavorites } from '@/lib/favorites';
import { frameTones, money, type Product } from '@/lib/products';
import { ProductPhoto } from './product-photo';
import { Rating } from './rating';

export function ProductCard({ product, returnQuery, heading: Heading = 'h3' }: {
  product: Product;
  returnQuery?: string;
  heading?: 'h2' | 'h3';
}) {
  const saved = useFavorites((state) => state.slugs.includes(product.slug));
  const toggle = useFavorites((state) => state.toggle);
  const [color, setColor] = useState(product.colors[0]);
  const path = `/produto/${product.slug}`;
  const params = new URLSearchParams();
  if (color !== product.colors[0]) params.set('cor', color);
  if (returnQuery !== undefined) params.set('retorno', returnQuery);
  const href = params.size ? `${path}?${params}` : path;

  return (
    <article className="product-card">
      <Link className="product-link" href={href}>
        <div className="product-image"><ProductPhoto product={product} color={color} /></div>
        <div className="product-meta">
          <Heading>{product.name}</Heading>
          <Rating value={product.rating} />
          <strong>{money(product.price)}</strong>
        </div>
      </Link>
      <div className="swatches" role="group" aria-label={`Cores de ${product.name}`}>
        {product.colors.map((option) => (
          <button key={option} type="button" aria-label={option} title={option} aria-pressed={color === option}
            onClick={() => setColor(option)}>
            <span style={{ backgroundColor: frameTones[option] }} />
          </button>
        ))}
      </div>
      <button type="button" className="icon-button favorite-button" aria-label={`Favoritar ${product.name}`}
        aria-pressed={saved} onClick={() => toggle(product.slug)}>
        <Heart size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
    </article>
  );
}
