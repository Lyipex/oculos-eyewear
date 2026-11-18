import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import { Benefits } from '@/components/benefits';
import { ProductCard } from '@/components/product-card';
import { ProductPhoto } from '@/components/product-photo';

const reviews = [
  'Uma armação discreta que combina com tudo.',
  'O desenho é leve e fácil de usar no dia a dia.',
  'Gostei de comparar as cores antes de escolher.',
];

export const metadata: Metadata = canonical('/');

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Image src="/hero-editorial.png" alt="Dois personagens fictícios usam óculos de sol, em uma campanha editorial" fill sizes="100vw" preload />
        </div>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Coleção essencial</p>
            <h1>Seu olhar,<br />sua <em>assinatura.</em></h1>
            <p>Óculos com design atemporal para todas as ocasiões.</p>
            <div className="hero-actions">
              <Link className="button primary" href="/produtos">Explorar coleção <ArrowRight size={17} /></Link>
              <Link className="button outline" href="/produtos?colecao=novidades">Novidades</Link>
            </div>
          </div>
        </div>
      </section>
      <Benefits />
      <section className="shell section highlights">
        <div className="section-heading">
          <h2>Destaques da coleção</h2>
          <Link className="text-link" href="/produtos">Ver todos os produtos <ArrowRight size={16} /></Link>
        </div>
        <div className="grid">{products.slice(0, 4).map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="review-band">
        <div className="shell section reviews">
          <div><h2>O que nossos clientes diriam</h2><p className="muted">Depoimentos fictícios</p></div>
          {reviews.map((review) => <blockquote key={review}><span aria-label="Cinco estrelas ilustrativas">★★★★★</span><p>“{review}”</p></blockquote>)}
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading"><h2>Explore por categoria</h2></div>
        <div className="categories">
          {(['Sol', 'Grau'] as const).map((category) => {
            const product = products.find((entry) => entry.category === category)!;
            return (
              <Link key={category} href={`/produtos?categoria=${category}`}>
                <div className="category-art"><ProductPhoto product={product} sizes="(max-width: 559px) 92vw, 45vw" /></div>
                <span>Óculos de {category.toLowerCase()} <ArrowRight size={18} /></span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="story"><div className="shell">
        <h2>Menos excesso. <em>Mais você.</em></h2>
        <p>Armações essenciais para o seu jeito de ver.</p>
        <Link className="button outline" href="/produtos">Conhecer a coleção <ArrowRight size={17} /></Link>
      </div></section>
    </>
  );
}
