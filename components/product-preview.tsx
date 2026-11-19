import Link from 'next/link';
import { money, type Product } from '@/lib/products';
import { ProductPhoto } from './product-photo';

export function ProductPreview({ product, color, onNavigate }: { product: Product; color: string | null; onNavigate: () => void }) {
  const variant = color ?? product.colors[0];
  const href = `/produto/${product.slug}${color ? `?${new URLSearchParams({ cor: color })}` : ''}`;
  return (
    <Link className="product-preview" href={href} onClick={onNavigate} aria-label={`Ver ${product.name}, ${color ?? 'cor não registrada'}`}>
      <span className="preview-thumb"><ProductPhoto product={product} color={variant} sizes="76px" /></span>
      <span className="preview-copy"><strong>{product.name}</strong><span className="preview-color">{color ?? 'Cor não registrada'}</span>
        {color === null && <span className="preview-reference">Imagem de referência: {variant}</span>}
        <span className="preview-price">{money(product.price)}</span>
      </span>
    </Link>
  );
}
