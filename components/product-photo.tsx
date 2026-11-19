import Image from 'next/image';
import { photoColor, productPhotoPath, productViews, type Product, type ProductView } from '@/lib/products';

export const cardSizes = '(max-width: 767px) 46vw, (max-width: 1023px) 30vw, (max-width: 1399px) 23vw, 320px';

export function ProductPhoto({ product, color, angle = 'frente', sizes = cardSizes }: {
  product: Product;
  color?: string;
  angle?: ProductView;
  sizes?: string;
}) {
  const variant = photoColor(product, color);
  const view = productViews.find((entry) => entry.id === angle);
  const src = productPhotoPath(product, color, angle);
  if (!src) return null;
  return (
    <Image className="product-photo" src={src}
      alt={`${product.name}, ${variant}, ${view?.description}. Imagem conceitual.`} fill sizes={sizes} />
  );
}
