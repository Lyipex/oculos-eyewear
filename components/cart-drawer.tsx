'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { keyOf, useCart } from '@/lib/cart';
import { money, products } from '@/lib/products';
import { ProductPhoto } from './product-photo';
import { CartSummary } from './cart-summary';

export function CartDrawer() {
  const { items, coupon, applyCoupon, clearCoupon, change, remove } = useCart();
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog.Root onOpenChange={() => { setInput(''); setMessage(''); }}>
      <Dialog.Trigger className="icon-button" aria-label={`Abrir carrinho (${totalItems})`}>
        <ShoppingBag size={20} aria-hidden="true" /><span className="cart-badge" aria-hidden="true">{totalItems}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="drawer">
          <header className="cart-header">
            <div className="drawer-head">
              <Dialog.Title>Seu carrinho ({totalItems})</Dialog.Title>
              <Dialog.Close aria-label="Fechar carrinho" className="icon-button"><X /></Dialog.Close>
            </div>
            <Dialog.Description className="muted">Carrinho demonstrativo.</Dialog.Description>
          </header>
          <div className="cart-scroll" role="region" aria-label="Produtos e cupom" tabIndex={0}>
            <div className="cart-items">
              {items.length === 0 && <p>Seu carrinho está vazio.</p>}
              {items.map((item) => {
                const key = keyOf(item);
                const variant = `${item.name}, ${item.color}, tamanho ${item.size}`;
                const product = products.find(({ slug }) => slug === item.slug);
                return (
                  <div className="cart-item" key={key}>
                    {product ? <div className="cart-thumb"><ProductPhoto product={product} color={item.color} sizes="72px" /></div> : <div />}
                    <div>
                      <strong>{item.name}</strong><p>{item.color} · {item.size}</p>
                      <button type="button" className="text-link" aria-label={`Remover ${variant}`} onClick={() => remove(key)}>Remover</button>
                    </div>
                    <div>
                      <strong>{money(item.price * item.quantity)}</strong>
                      <div className="quantity">
                        <button type="button" aria-label={`Diminuir quantidade de ${variant}`} disabled={item.quantity === 1} onClick={() => change(key, -1)}><Minus size={14} /></button>
                        {item.quantity}
                        <button type="button" aria-label={`Aumentar quantidade de ${variant}`} onClick={() => change(key, 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {items.length > 0 && (
              <form className="coupon" onSubmit={(event) => {
                event.preventDefault();
                setMessage(applyCoupon(input) ? 'Cupom aplicado.' : 'Cupom inválido. Experimente FORMA10.');
              }}>
                <label htmlFor="coupon">Cupom demonstrativo</label>
                <div>
                  <input id="coupon" value={input} onChange={(event) => { setInput(event.target.value); setMessage(''); }} placeholder="Experimente FORMA10" required />
                  <button type="submit">Aplicar</button>
              </div>
                <p role="status">{message}</p>
                {coupon && <button type="button" className="text-link" onClick={() => { clearCoupon(); setInput(''); setMessage('Cupom removido.'); }}>Remover cupom {coupon}</button>}
              </form>
            )}
          </div>
          <footer className="cart-footer">
            {items.length ? (
              <>
                <CartSummary items={items} coupon={coupon} />
                <Dialog.Close asChild><Link className="button primary full" href="/checkout">Ir para o checkout</Link></Dialog.Close>
              </>
            ) : (
              <Dialog.Close asChild><Link className="button primary full" href="/produtos">Explorar a coleção</Link></Dialog.Close>
            )}
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
