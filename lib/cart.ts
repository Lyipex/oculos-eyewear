import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Item = {
  slug: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
};

export const couponCode = 'OCULOS10';
function normalizeCoupon(value: string) {
  const code = value.trim().toUpperCase();
  return code === 'FORMA10' ? couponCode : code;
}
export const keyOf = (item: Item) => `${item.slug}|${item.color}|${item.size}`;

// Some os valores em centavos e arredonde o desconto uma única vez por carrinho.
export const subtotal = (items: Item[]) =>
  items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;

export const discount = (value: number, coupon: string) =>
  normalizeCoupon(coupon) === couponCode ? Math.round(Math.round(value * 100) / 10) / 100 : 0;

type Store = {
  items: Item[];
  coupon: string;
  add: (item: Item) => void;
  change: (key: string, delta: number) => void;
  remove: (key: string) => void;
  applyCoupon: (value: string) => boolean;
  clearCoupon: () => void;
};

export const useCart = create<Store>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: '',
      add: (item) => set(({ items }) => {
        const key = keyOf(item);
        const existing = items.find((line) => keyOf(line) === key);
        if (!existing) return { items: [...items, item] };
        return {
          items: items.map((line) => keyOf(line) === key
            ? { ...line, quantity: line.quantity + item.quantity }
            : line),
        };
      }),
      change: (key, delta) => set(({ items }) => ({
        items: items.map((line) => keyOf(line) === key
          ? { ...line, quantity: Math.max(1, line.quantity + delta) }
          : line),
      })),
      remove: (key) => set((state) => {
        const items = state.items.filter((line) => keyOf(line) !== key);
        return { items, coupon: items.length ? state.coupon : '' };
      }),
      applyCoupon: (value) => {
        if (!get().items.length || normalizeCoupon(value) !== couponCode) return false;
        set({ coupon: couponCode });
        return true;
      },
      clearCoupon: () => set({ coupon: '' }),
    }),
    {
      // Keep the original storage key so carts saved before the rebrand can migrate.
      name: 'forma-cart',
      version: 1,
      migrate: (persisted) => {
        const cart = persisted as Pick<Store, 'items' | 'coupon'>;
        const coupon = typeof cart?.coupon === 'string' && normalizeCoupon(cart.coupon) === couponCode ? couponCode : '';
        return { ...cart, coupon };
      },
      partialize: ({ items, coupon }) => ({ items, coupon }),
    },
  ),
);
