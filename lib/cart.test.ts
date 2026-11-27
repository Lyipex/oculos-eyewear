import { describe, it, expect } from 'vitest';
import { subtotal, discount, keyOf, useCart } from './cart';
const item = { slug: 'aurora', name: 'Aurora', price: 100, color: 'Vinho', size: 'M', quantity: 2 };
describe('carrinho demonstrativo', () => {
  it('calcula o subtotal com quantidades', () => expect(subtotal([item])).toBe(200));
  it('aplica o desconto para o código atual e o legado', () => {
    expect(discount(200, ' oculos10 ')).toBe(20);
    expect(discount(200, ' forma10 ')).toBe(20);
    expect(discount(200, 'outro')).toBe(0);
  });
  it('distingue variações', () => expect(keyOf(item)).not.toBe(keyOf({ ...item, color: 'Preto' })));
});

it('mantém o cupom aplicado até a última remoção e ignora códigos inválidos', () => {
  useCart.setState({ items: [item], coupon: '' });
  const cart = useCart.getState();
  expect(cart.applyCoupon(' forma10 ')).toBe(true);
  expect(cart.applyCoupon('outro')).toBe(false);
  expect(useCart.getState().coupon).toBe('OCULOS10');
  cart.remove(keyOf(item));
  expect(useCart.getState().coupon).toBe('');
  expect(cart.applyCoupon('OCULOS10')).toBe(false);
});

it('arredonda o desconto para centavos', () => {
  expect(discount(19.95, 'OCULOS10')).toBe(2);
  expect(subtotal([{ ...item, price: 19.95, quantity: 3 }])).toBe(59.85);
});
