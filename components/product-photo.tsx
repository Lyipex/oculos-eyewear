import Image from 'next/image';
import { photoColor, productPhotoPath, type Product, type ProductView } from '@/lib/products';

export const cardSizes = '(max-width: 767px) 46vw, (max-width: 1023px) 30vw, (max-width: 1399px) 23vw, 320px';

export const productViews = [
  { id: 'frente', label: 'Frente', description: 'vista frontal' },
  { id: 'lateral', label: 'Em ângulo', description: 'vista em ângulo' },
  { id: 'rosto', label: 'No rosto', description: 'em um rosto fictício' },
] as const;

export function ProductPhoto({ product, color, angle = 'frente', sizes = cardSizes }: {
  product: Product;
  color?: string;
  angle?: ProductView;
  sizes?: string;
}) {
  const variant = photoColor(product, color, angle);
  const view = productViews.find((entry) => entry.id === angle);
  return (
    <Image className="product-photo" src={productPhotoPath(product, color, angle)}
      alt={`${product.name}, ${variant}, ${view?.description}. Imagem conceitual.`} fill sizes={sizes} />
  );
}
