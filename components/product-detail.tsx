'use client';

import { ArrowLeft, Check, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { availableProductViews, resolveProductView, frameTones, money, type Product, type ProductView } from '@/lib/products';
import { postalCode } from '@/lib/shipping';
import { GalleryPhoto } from './gallery-photo';
import { FavoriteButton } from './favorite-button';
import { Rating } from './rating';

export function ProductDetail({ product, initialColor, returnHref, categoryHref }: {
  product: Product;
  initialColor: string;
  returnHref: string;
  categoryHref: string;
}) {
  const [color, setColor] = useState(initialColor);
  const [size, setSize] = useState(product.sizes[0]);
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState('');
  const [added, setAdded] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setConfirmed(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added, color, size]);
  const [selectedView, setSelectedView] = useState<ProductView>('frente');
  const views = availableProductViews(product, color);
  const viewId = resolveProductView(product, color, selectedView);
  const view = views.find(({ id }) => id === viewId)!;
  const moveView = (offset: number) => setSelectedView((current) => {
    const index = views.findIndex(({ id }) => id === resolveProductView(product, color, current));
    return views[(index + offset + views.length) % views.length].id;
  });
  const add = useCart((cart) => cart.add);

  return (
    <section className="shell section">
      <Link href={returnHref} className="product-back text-link"><ArrowLeft size={17} aria-hidden="true" /> Voltar aos produtos</Link>
      <nav className="breadcrumb" aria-label="Caminho da página">
        <ol>
          <li><Link href="/produtos">Coleção</Link></li>
          <li><Link href={categoryHref}>Óculos de {product.category.toLowerCase()}</Link></li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className="pdp">
        <div>
          <div className="pdp-image" role="group" aria-label="Galeria do produto" tabIndex={0} onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveView(event.key === 'ArrowLeft' ? -1 : 1); }
          }}>
            <GalleryPhoto key={`${product.slug}:${color}`} product={product} color={color} angle={view.id} />
            <button type="button" className="icon-button gallery-prev" aria-label="Imagem anterior" onClick={() => moveView(-1)}><ChevronLeft size={20} /></button>
            <button type="button" className="icon-button gallery-next" aria-label="Próxima imagem" onClick={() => moveView(1)}><ChevronRight size={20} /></button>
            <p className="sr-only" role="status">{view.label} · {color}</p>
          </div>
          <div className="thumbs">
            {views.map(({ id, label }) => (
              <button key={id} type="button" aria-pressed={view.id === id} onClick={() => setSelectedView(id)}>{label}</button>
            ))}
          </div>
          <p className="muted gallery-caption">{view.id === 'rosto' ? `Modelo fictício · Cor selecionada: ${color}` : ' '}</p>
        </div>
        <div className="pdp-info">
          <p className="eyebrow">ÓCULOS DE {product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <Rating value={product.rating} />
          <p className="price">{money(product.price)}</p>
          <p>{product.description}</p>
          <fieldset>
            <legend>Cor: <strong>{color}</strong></legend>
            <div className="choices color-choices">
              {product.colors.map((option) => (
                <button key={option} type="button" aria-label={option} title={option} aria-pressed={color === option}
                  onClick={() => { setSelectedView(availableProductViews(product, option).some(({ id }) => id === 'rosto') ? view.id : 'frente'); setColor(option); setAdded(0); setConfirmed(false); }}><span style={{ backgroundColor: frameTones[option] }} /></button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Tamanho</legend>
            <div className="choices">
              {product.sizes.map((option) => (
                <button key={option} type="button" aria-pressed={size === option}
                  onClick={() => { setSize(option); setAdded(0); setConfirmed(false); }}>{option}</button>
              ))}
            </div>
          </fieldset>
          <button type="button" className="button primary full add-to-cart" data-added={confirmed} onClick={() => {
            add({ slug: product.slug, name: product.name, price: product.price, color, size, quantity: 1 });
            setAdded((count) => count + 1);
            setConfirmed(true);
          }}>{confirmed ? <Check size={19} aria-hidden="true" /> : <ShoppingBag size={19} aria-hidden="true" />} {confirmed ? 'Adicionado · Adicionar mais' : 'Adicionar ao carrinho'}</button>
          <p className="add-status" role="status">{added > 0 ? `Adicionado ao carrinho · ${added} nesta seleção.` : ''}</p>
          <FavoriteButton product={product} color={color} className="button outline full detail-favorite" showLabel />
          <form className="shipping" onSubmit={(event) => {
            event.preventDefault();
            const result = postalCode.safeParse(cep);
            setShipping(result.success
              ? 'Frete simulado: grátis · Prazo ilustrativo: 5 a 10 dias úteis.'
              : result.error.issues[0].message);
          }}>
            <label htmlFor="cep">Calcule o frete simulado</label>
            <div className="shipping-form">
              <input id="cep" autoComplete="postal-code" maxLength={10} inputMode="numeric"
                value={cep} onChange={(event) => { setCep(event.target.value); setShipping(''); }}
                placeholder="00000-000" aria-describedby="frete-resultado" />
              <button type="submit">Calcular</button>
            </div>
            <p id="frete-resultado" role="status">{shipping}</p>
          </form>
          <p className="muted">Produto e condições fictícios. Nenhum pedido será realizado.</p>
        </div>
      </div>
    </section>
  );
}
