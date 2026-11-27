import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { siteDescription, siteTitle } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  title: { default: siteTitle, template: '%s | ÓCULOS Eyewear' },
  description: siteDescription,
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  await connection(); // Next.js applies the CSP nonce when rendering each document.
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
