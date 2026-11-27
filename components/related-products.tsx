'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/products';
import { ProductCard } from './product-card';

const imageSizes = '(max-width: 767px) 63vw, (max-width: 1023px) 30vw, (max-width: 1399px) 23vw, 312px';

export function RelatedProducts({ products, returnQuery }: { products: Product[]; returnQuery: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  function updateControls(track: HTMLUListElement) {
    setCanGoBack(track.scrollLeft > 1);
    setCanGoForward(track.scrollWidth - track.clientWidth - track.scrollLeft > 1);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls(track);
    const observer = new ResizeObserver(() => updateControls(track));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const first = track?.children[0];
    const second = track?.children[1];
    if (!track || !first || !second) return;
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * step, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  return (
    <section className="shell related-products" aria-labelledby="related-products-title">
      <div className="related-products-heading">
        <h2 id="related-products-title">Você também pode gostar</h2>
        <div className="related-products-controls">
          <button type="button" className="icon-button" aria-label="Produtos anteriores"
            aria-controls="related-products-list" disabled={!canGoBack} onClick={() => move(-1)}>
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="Próximos produtos"
            aria-controls="related-products-list" disabled={!canGoForward} onClick={() => move(1)}>
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul id="related-products-list" className="related-products-list" role="list" aria-label="Produtos relacionados"
        ref={trackRef} tabIndex={0} onScroll={(event) => updateControls(event.currentTarget)} onFocus={(event) => {
          const track = event.currentTarget;
          const target = event.target;
          const slide = target.closest('li');
          if (!slide || !target.matches(':focus-visible')) return;

          requestAnimationFrame(() => {
            if (document.activeElement !== target) return;
            const { left, right } = target.getBoundingClientRect();
            const viewport = track.getBoundingClientRect();
            if (left >= viewport.left && right <= viewport.right) return;
            const offset = slide.getBoundingClientRect().left - track.children[0].getBoundingClientRect().left;
            track.scrollTo({ left: offset, behavior: 'instant' });
          });
        }} onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}>
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} returnQuery={returnQuery} imageSizes={imageSizes} />
          </li>
        ))}
      </ul>
      <Link href="/produtos" className="text-link related-products-collection">Ver toda a coleção</Link>
    </section>
  );
}
