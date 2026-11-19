import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
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
        <Footer />
      </body>
    </html>
  );
}
