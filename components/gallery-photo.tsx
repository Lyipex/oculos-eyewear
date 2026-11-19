'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { productPhotoPath, productViews, type Product, type ProductView } from '@/lib/products';

// The parent keys this component by color: a previous color is never retained.
export function GalleryPhoto({ product, color, angle }: { product: Product; color: string; angle: ProductView }) {
  const src = productPhotoPath(product, color, angle);
  const [settled, setSettled] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const description = productViews.find((view) => view.id === angle)!.description;
  const sizes = '(max-width: 767px) 92vw, (max-width: 1440px) 55vw, 760px';
  if (!src) return null;
  return (
    <div className="gallery-photo" ref={container} data-source={src ?? ''}>
      <>
        {settled && settled !== src && <Image className="product-photo" src={settled} alt="" aria-hidden="true" fill sizes={sizes} />}
        <Image key={src} className="product-photo gallery-incoming" src={src}
          alt={`${product.name}, ${color}, ${description}. Imagem conceitual.`} fill sizes={sizes}
          onLoad={(event) => { event.currentTarget.dataset.loaded = 'true'; }}
          onTransitionEnd={(event) => {
            if (event.propertyName === 'opacity' && container.current?.dataset.source === src) setSettled(src);
          }} />
      </>
    </div>
  );
}
