import { discount, subtotal, type Item } from '@/lib/cart';
import { money } from '@/lib/products';

export function CartSummary({ items, coupon }: { items: Item[]; coupon: string }) {
  const sum = subtotal(items);
  const savings = discount(sum, coupon);

  return (
    <div aria-live="polite">
      <div className="totals"><span>Subtotal</span><strong>{money(sum)}</strong></div>
      {savings > 0 && (
        <div className="totals">
          <span>Desconto · {coupon}</span><strong>− {money(savings)}</strong>
        </div>
      )}
      <div className="totals">
        <span>Total estimado</span><strong>{money(sum - savings)}</strong>
      </div>
    </div>
  );
}
