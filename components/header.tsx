'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Grid2X2, Heart, House, Menu, Search, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type ReactNode } from 'react';
import { useFavorites } from '@/lib/favorites';
import { products } from '@/lib/products';
import { Wordmark } from './wordmark';
import { CartDrawer } from './cart-drawer';

const navLinks = [
  { href: '/produtos?categoria=Sol', label: 'Óculos de sol', param: 'Sol' },
  { href: '/produtos?categoria=Grau', label: 'Óculos de grau', param: 'Grau' },
  { href: '/produtos?colecao=novidades', label: 'Novidades', param: 'novidades' },
  { href: '/produtos', label: 'Todos os óculos', param: '' },
];

function NavLinks({ close = false }: { close?: boolean }) {
  const params = useSearchParams();
  const path = usePathname();
  const selection = params.get('categoria') ?? params.get('colecao') ?? '';
  return navLinks.map(({ href, label, param }) => {
    const link = <Link href={href} aria-current={path === '/produtos' && param === selection ? 'page' : undefined}>{label}</Link>;
    return close ? <Dialog.Close asChild key={href}>{link}</Dialog.Close> : <span key={href}>{link}</span>;
  });
}

function HeaderDialog({ label, icon, title, children }: {
  label: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="icon-button" aria-label={label}>{icon}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="header-dialog" aria-describedby={undefined}>
          <div className="drawer-head">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Fechar"><X size={22} /></Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="icon-button" aria-label="Buscar produtos"><Search size={21} /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="header-dialog" aria-describedby={undefined}>
          <div className="drawer-head">
            <Dialog.Title>Buscar produtos</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Fechar busca"><X size={22} /></Dialog.Close>
          </div>
          <form className="inline-form" onSubmit={(event) => {
            event.preventDefault();
            const query = String(new FormData(event.currentTarget).get('q') ?? '').trim();
            router.push(query ? `/produtos?${new URLSearchParams({ q: query })}` : '/produtos');
            setOpen(false);
          }}>
            <input name="q" aria-label="Nome ou tipo de óculos" placeholder="Nome ou tipo de óculos" maxLength={80} />
            <button className="button primary" type="submit">Buscar</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Header() {
  const path = usePathname();
  const saved = useFavorites((state) => state.slugs);
  const selected = products.filter(({ slug }) => saved.includes(slug));
  return (
    <>
      <div className="announcement">
        <span>Frete grátis simulado</span><span>Parcelamento ilustrativo</span><span>Troca fácil ilustrativa</span>
      </div>
      <header className="site-header">
        <div className="shell header">
          <div className="mobile-menu">
            <Dialog.Root>
              <Dialog.Trigger className="icon-button" aria-label="Abrir menu"><Menu size={22} aria-hidden="true" /></Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="overlay" />
                <Dialog.Content className="menu-drawer" aria-describedby={undefined}>
                  <div className="drawer-head">
                    <Dialog.Title>Menu</Dialog.Title>
                    <Dialog.Close className="icon-button" aria-label="Fechar menu"><X size={22} aria-hidden="true" /></Dialog.Close>
                  </div>
                  <nav className="menu-links" aria-label="Categorias">
                    <Suspense><NavLinks close /></Suspense>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <Wordmark />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Suspense fallback={navLinks.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}><NavLinks /></Suspense>
          </nav>
          <div className="header-actions">
            <SearchDialog />
            <HeaderDialog label="Favoritos" title="Seus favoritos" icon={<Heart size={21} />}>
              {selected.length ? (
                <ul className="dialog-links">{selected.map((product) => (
                  <li key={product.slug}>
                    <Dialog.Close asChild><Link href={`/produto/${product.slug}`}>{product.name}</Link></Dialog.Close>
                  </li>
                ))}</ul>
              ) : <p>Use o coração na vitrine para guardar seus modelos favoritos.</p>}
            </HeaderDialog>
            <div className="desktop-account"><AccountDemo /></div>
            <CartDrawer />
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Atalhos da loja">
        <Link href="/" aria-current={path === '/' ? 'page' : undefined}><House size={20} />Início</Link>
        <Link href="/produtos" aria-current={path.startsWith('/produto') ? 'page' : undefined}><Grid2X2 size={20} />Produtos</Link>
        <AccountDemo withLabel />
      </nav>
    </>
  );
}

function AccountDemo({ withLabel = false }: { withLabel?: boolean }) {
  return (
    <HeaderDialog label="Conta demonstrativa" title="Minha conta" icon={<><UserRound size={21} />{withLabel && <span>Conta</span>}</>}>
      <p>A loja é conceitual. Seus favoritos e seu carrinho ficam neste navegador.</p>
    </HeaderDialog>
  );
}
