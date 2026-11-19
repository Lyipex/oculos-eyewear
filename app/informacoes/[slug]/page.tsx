import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { information } from '@/lib/information';
import { canonical } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
const topics = Object.values(information);
const findTopic = (slug: string) => topics.find((topic) => topic.slug === slug);

export function generateStaticParams() {
  return topics.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = findTopic((await params).slug);
  if (!topic) notFound();
  return { title: topic.title, description: topic.text, ...canonical(`/informacoes/${topic.slug}`) };
}

export default async function Page({ params }: Props) {
  const topic = findTopic((await params).slug);
  if (!topic) notFound();

  return (
    <article className="shell section information-page">
      <Link href="/" className="text-link"><ArrowLeft size={17} aria-hidden="true" /> Voltar ao início</Link>
      <h1>{topic.title}</h1>
      <p>{topic.text}</p>
    </article>
  );
}
