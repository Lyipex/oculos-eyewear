'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FavoriteButton } from './favorite-button';
import { frameTones, money, type Product } from '@/lib/products';
import { ProductPhoto } from './product-photo';
import { Rating } from './rating';

export function ProductCard({ product, returnQuery, heading: Heading = 'h3', imageSizes }: {
  product: Product;
  returnQuery?: string;
  heading?: 'h2' | 'h3';
  imageSizes?: string;
}) {
  const [color, setColor] = useState(product.colors[0]);
  const path = `/produto/${product.slug}`;
  const params = new URLSearchParams();
  if (color !== product.colors[0]) params.set('cor', color);
  if (returnQuery !== undefined) params.set('retorno', returnQuery);
  const href = params.size ? `${path}?${params}` : path;

  return (
    <article className="product-card">
      <Link className="product-link" href={href}>
        <div className="product-image"><ProductPhoto product={product} color={color} sizes={imageSizes} /></div>
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
      <FavoriteButton product={product} color={color} />
    </article>
  );
}
