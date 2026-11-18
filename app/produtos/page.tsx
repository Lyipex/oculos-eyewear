import type { Metadata } from 'next';
import { Catalog } from '@/components/catalog';
import { catalogParams } from '@/lib/catalog-query';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Todos os óculos',
  description: 'Explore a coleção conceitual de óculos de sol e de grau da ÓCULOS Eyewear.',
  ...canonical('/produtos'),
};

export default async function Page({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const incoming = await searchParams;
  const initial = catalogParams({ get: (key) => typeof incoming[key] === 'string' ? incoming[key] : null });
  return <Catalog initialQuery={initial.toString()} />;
}
