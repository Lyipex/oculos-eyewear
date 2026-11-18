'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { frameTones, money, type Product } from '@/lib/products';
import { postalCode } from '@/lib/shipping';
import { ProductPhoto, productViews } from './product-photo';
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
  const [viewIndex, setViewIndex] = useState(0);
  const view = productViews[viewIndex];
  const moveView = (offset: number) => setViewIndex((index) => (index + offset + productViews.length) % productViews.length);
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
          <div className="pdp-image" role="group" aria-label="Galeria do produto">
            <ProductPhoto product={product} color={color} angle={view.id} sizes="(max-width: 767px) 92vw, 55vw" />
            <button type="button" className="icon-button gallery-prev" aria-label="Imagem anterior" onClick={() => moveView(-1)}><ChevronLeft size={20} /></button>
            <button type="button" className="icon-button gallery-next" aria-label="Próxima imagem" onClick={() => moveView(1)}><ChevronRight size={20} /></button>
            <p className="sr-only" role="status">{view.label}</p>
          </div>
          <div className="thumbs">
            {productViews.map(({ id, label }, index) => (
              <button key={id} type="button" aria-pressed={view.id === id} onClick={() => setViewIndex(index)}>{label}</button>
            ))}
          </div>
          {view.id === 'rosto' && <p className="muted gallery-caption">Modelo fictício · Cor de referência: {product.colors[0]}</p>}
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
                  onClick={() => { setColor(option); setAdded(0); if (view.id === 'rosto') setViewIndex(0); }}><span style={{ backgroundColor: frameTones[option] }} /></button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Tamanho</legend>
            <div className="choices">
              {product.sizes.map((option) => (
                <button key={option} type="button" aria-pressed={size === option}
                  onClick={() => { setSize(option); setAdded(0); }}>{option}</button>
              ))}
            </div>
          </fieldset>
          <button type="button" className="button primary full" onClick={() => {
            add({ slug: product.slug, name: product.name, price: product.price, color, size, quantity: 1 });
            setAdded((count) => count + 1);
          }}><ShoppingBag size={19} aria-hidden="true" /> Adicionar ao carrinho</button>
          <p role="status">{added > 0 ? `Adicionado ao carrinho · ${added} nesta seleção.` : ''}</p>
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
