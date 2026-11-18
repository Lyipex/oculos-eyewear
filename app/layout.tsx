import type { Metadata } from 'next';
import Link from 'next/link';
import { Wordmark } from '@/components/wordmark';
import { Header } from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'ÓCULOS Eyewear | Seu olhar, sua assinatura', template: '%s | ÓCULOS Eyewear' },
  description: 'Explore uma coleção conceitual de armações de sol e de grau com design atemporal.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        <Header />
        <main id="conteudo">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div><Wordmark /><p>Seu olhar, sua assinatura.</p></div>
            <div><strong>Explore</strong><Link href="/produtos?categoria=Sol">Óculos de sol</Link><Link href="/produtos?categoria=Grau">Óculos de grau</Link></div>
            <div><strong>Loja conceitual</strong><p>Imagens, preços, benefícios e avaliações são ilustrativos. A compra é simulada.</p></div>
            <small>© ÓCULOS · Projeto demonstrativo</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
