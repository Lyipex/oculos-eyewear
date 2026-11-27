import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { RelatedProducts } from '@/components/related-products';
import { catalogHref, catalogParams } from '@/lib/catalog-query';
import { sharingMetadata } from '@/lib/seo';
import { expectedProductPhotoPath, photoColor, products } from '@/lib/products';

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
  if (!product) return { title: 'Produto' };
  const color = product.colors[0];
  return {
    title: product.name,
    description: product.description,
    ...sharingMetadata(`/produto/${product.slug}`, `${product.name} | ÓCULOS Eyewear`, product.description, {
      path: expectedProductPhotoPath(product, color, 'frente'),
      alt: `${product.name}, ${color}, vista frontal. Imagem conceitual.`,
    }),
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) notFound();
  const { cor, retorno } = await searchParams;
  const initialColor = photoColor(product, typeof cor === 'string' ? cor : undefined);
  const categoryParams = new URLSearchParams({ categoria: product.category });
  const returnParams = typeof retorno === 'string' ? catalogParams(new URLSearchParams(retorno)) : categoryParams;
  const otherProducts = products.filter((entry) => entry.slug !== slug);
  const related = [
    ...otherProducts.filter((entry) => entry.category === product.category),
    ...otherProducts.filter((entry) => entry.category !== product.category),
  ];

  return (
    <>
      <ProductDetail key={`${slug}-${initialColor}`} product={product} initialColor={initialColor}
        categoryHref={catalogHref(categoryParams)} returnHref={catalogHref(returnParams)} />
      {related.length > 0 && <RelatedProducts key={slug} products={related} returnQuery={returnParams.toString()} />}
    </>
  );
}
