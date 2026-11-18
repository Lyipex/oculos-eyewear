'use client';

import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { keyOf, useCart } from '@/lib/cart';
import { money } from '@/lib/products';
import { postalCode } from '@/lib/shipping';
import { CartSummary } from './cart-summary';

const schema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.'),
  email: z.email('Informe um e-mail válido.'),
  cep: postalCode,
  address: z.string().trim().min(3, 'Informe seu endereço.'),
});

const fields = [
  { name: 'name', label: 'Nome completo', autoComplete: 'name' },
  { name: 'email', label: 'E-mail', autoComplete: 'email', type: 'email' },
  { name: 'cep', label: 'CEP', autoComplete: 'postal-code', inputMode: 'numeric', placeholder: '00000-000' },
  { name: 'address', label: 'Endereço', autoComplete: 'street-address' },
] as const;

export function Checkout() {
  const { items, coupon } = useCart();
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof schema>, string[]>>>({});
  const [message, setMessage] = useState('');

  return (
    <section className="shell section checkout">
      <p className="eyebrow">EXPERIÊNCIA DEMONSTRATIVA</p>
      <h1>Finalizar pedido</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio. <Link className="text-link" href="/produtos">Ver produtos</Link></p>
      ) : (
        <>
          <p>Use dados fictícios para simular o pedido.</p>
          <div className="checkout-grid">
            <form noValidate onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
              if (!parsed.success) {
                setErrors(z.flattenError(parsed.error).fieldErrors);
                setMessage('Confira os campos destacados.');
                const field = parsed.error.issues[0]?.path[0];
                if (typeof field === 'string') (form.elements.namedItem(field) as HTMLInputElement | null)?.focus();
                return;
              }
              setErrors({});
              setMessage('Simulação concluída.');
            }}>
              <h2>Seus dados</h2>
              {fields.map(({ name, label, ...attributes }) => (
                <label key={name}>{label}
                  <input name={name} {...attributes} required aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `erro-${name}` : undefined} onChange={() => {
                    setErrors((previous) => ({ ...previous, [name]: undefined }));
                    setMessage('');
                  }} />
                  {errors[name] && <span className="field-error" id={`erro-${name}`}>{errors[name][0]}</span>}
                </label>
              ))}
              <button type="submit" className="button primary full">Simular finalização</button>
              <p role="status">{message}</p>
            </form>
            <aside>
              <h2>Resumo</h2>
              {items.map((item) => (
                <div className="totals" key={keyOf(item)}>
                  <span>{item.name} · {item.color} · {item.size} × {item.quantity}</span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <CartSummary items={items} coupon={coupon} />
              <p className="muted">Frete demonstrativo grátis.</p>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
