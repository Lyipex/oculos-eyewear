import type { Metadata } from 'next';
import { sharingMetadata, siteDescription, siteTitle } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import { HomeReveals } from '@/components/home-reveals';
import { Benefits } from '@/components/benefits';
import { ProductCard } from '@/components/product-card';
import { ReviewMetrics } from '@/components/review-metrics';
import { ProductPhoto } from '@/components/product-photo';

const reviews = [
  {
    author: 'Marina',
    model: 'Aurora',
    rating: 5,
    quote: 'Fiquei na dúvida entre o preto e o tartaruga. Fui de tartaruga e gostei porque aparece na medida certa, sem chamar muita atenção.',
  },
  {
    author: 'Rafael',
    model: 'Atelier',
    rating: 5,
    quote: 'Uso óculos o dia inteiro no trabalho. O que mais gostei nesse foi a leveza. No fim da tarde, nem lembrava que estava com ele.',
  },
  {
    author: 'Beatriz',
    model: 'Alma',
    rating: 4,
    quote: 'Achei que a armação seria um pouco menor. A foto no rosto ajudou a entender melhor o tamanho, e acabei gostando do formato.',
  },
];

const heroAlt = 'Dois personagens fictícios usam óculos de sol, em uma campanha editorial';
export const metadata: Metadata = sharingMetadata('/', siteTitle, siteDescription, { path: '/hero-editorial.png', alt: heroAlt });

export default function Home() {
  return (
    <>
      <HomeReveals />
      <section className="hero">
        <div className="hero-media">
          <Image src="/hero-editorial.png" alt={heroAlt} fill sizes="100vw" preload />
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
      <section className="shell section highlights" data-reveal>
        <div className="section-heading">
          <h2>Destaques da coleção</h2>
          <Link className="text-link" href="/produtos">Ver todos os produtos <ArrowRight size={16} /></Link>
        </div>
        <div className="grid">{products.slice(0, 4).map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="review-band" aria-labelledby="reviews-title" aria-describedby="reviews-note">
        <div className="shell section review-content">
          <div className="reviews">
            <div>
              <h2 id="reviews-title">Impressões de quem usaria</h2>
              <p id="reviews-note" className="muted">Avaliações fictícias para demonstração.</p>
            </div>
            {reviews.map(({ author, model, rating, quote }) => (
              <figure className="review" data-reveal key={model}>
                <span className="review-stars" aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                <span className="sr-only">{rating} de 5 estrelas</span>
                <blockquote><p>“{quote}”</p></blockquote>
                <figcaption><strong>{author}</strong> <span>· {model}</span></figcaption>
              </figure>
            ))}
          </div>
          <ReviewMetrics />
        </div>
      </section>
      <section className="shell section" data-reveal>
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
      <section className="story" data-reveal><div className="shell">
        <h2>Menos excesso. <em>Mais você.</em></h2>
        <p>Armações essenciais para o seu jeito de ver.</p>
        <Link className="button outline" href="/produtos">Conhecer a coleção <ArrowRight size={17} /></Link>
      </div></section>
    </>
  );
}
