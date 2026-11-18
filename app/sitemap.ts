import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { siteOrigin } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin) return [];
  return ['/', '/produtos', ...products.map(({ slug }) => `/produto/${slug}`)]
    .map((path) => ({ url: new URL(path, origin).href }));
}
