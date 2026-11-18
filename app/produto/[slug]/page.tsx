import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { catalogHref, catalogParams } from '@/lib/catalog-query';
import { canonical } from '@/lib/seo';
import { photoColor, products } from '@/lib/products';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cor?: string | string[]; retorno?: string | string[] }>;
};

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  return { title: product?.name ?? 'Produto', description: product?.description, ...(product && canonical(`/produto/${product.slug}`)) };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) notFound();
  const { cor, retorno } = await searchParams;
  const initialColor = photoColor(product, typeof cor === 'string' ? cor : undefined);
  const categoryHref = catalogHref(new URLSearchParams({ categoria: product.category }));
  const returnHref = typeof retorno === 'string'
    ? catalogHref(catalogParams(new URLSearchParams(retorno)))
    : categoryHref;
  return <ProductDetail key={`${slug}-${initialColor}`} product={product} initialColor={initialColor} categoryHref={categoryHref} returnHref={returnHref} />;
}
