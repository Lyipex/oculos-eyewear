'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { setNonce } from 'get-nonce';
import { ChevronLeft, ChevronRight, Grid2X2, House, Menu, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Wordmark } from './wordmark';
import { InformationLink } from './information-link';
import { SearchPanel } from './search-panel';
import { FavoritesPanel } from './favorites-panel';
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

export function Header() {
  const path = usePathname();
  const [activePanel, setActivePanel] = useState<'search' | 'favorites' | null>(null);
  const mobileNav = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    // Radix inserts the scroll-lock stylesheet into the current document.
    setNonce(document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce ?? '');
  }, []);

  useEffect(() => {
    let frame = 0;
    function keepFocusVisible(event: FocusEvent) {
      const nav = mobileNav.current;
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')
        || !nav?.getClientRects().length || nav.contains(target) || target.closest('[role="dialog"]')) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (document.activeElement !== target) return;
        const bounds = target.getBoundingClientRect();
        const overlap = bounds.bottom - nav.getBoundingClientRect().top;
        if (overlap > -8) window.scrollBy({ top: overlap + 8, behavior: 'instant' });
        else if (bounds.top < 0) window.scrollBy({ top: bounds.top - 8, behavior: 'instant' });
      });
    }

    document.addEventListener('focusin', keepFocusVisible);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('focusin', keepFocusVisible);
    };
  }, []);

  return (
    <>
      <Announcement />
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
                  <p className="menu-label">Explore a coleção</p>
                  <nav className="menu-links" aria-label="Categorias">
                    <Suspense><NavLinks close /></Suspense>
                  </nav>
                  <div className="menu-information"><p className="menu-label">Sobre a experiência</p>
                    <Dialog.Close asChild><InformationLink topic="about" className="information-link" /></Dialog.Close><Dialog.Close asChild><InformationLink topic="sizes" className="information-link" /></Dialog.Close>
                    <p className="muted">Loja conceitual. A compra é simulada.</p>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <Wordmark />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Suspense fallback={navLinks.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}><NavLinks /></Suspense>
          </nav>
          <div className="header-actions">
            <SearchPanel open={activePanel === 'search'} onOpenChange={(open) => setActivePanel((current) => open ? 'search' : current === 'search' ? null : current)} />
            <FavoritesPanel open={activePanel === 'favorites'} onOpenChange={(open) => setActivePanel((current) => open ? 'favorites' : current === 'favorites' ? null : current)} />
            <div className="desktop-account"><AccountDemo /></div>
            <CartDrawer />
          </div>
        </div>
      </header>
      <nav ref={mobileNav} className="mobile-nav" aria-label="Atalhos da loja">
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
      <p>O acesso à conta não está disponível nesta versão conceitual. Seus favoritos e seu carrinho ficam neste navegador, sem necessidade de cadastro.</p>
    </HeaderDialog>
  );
}

const announcements = ['Frete grátis simulado', 'Parcelamento ilustrativo', 'Troca fácil ilustrativa'];

function Announcement() {
  const [index, setIndex] = useState(0);
  return (
    <div className="announcement" role="region" aria-label="Condições demonstrativas">
      <button type="button" aria-label="Mensagem anterior" onClick={() => setIndex((index + announcements.length - 1) % announcements.length)}><ChevronLeft size={14} aria-hidden="true" /></button>
      <div className="announcement-messages" aria-live="polite">
        {announcements.map((message, position) => <span key={message} data-current={position === index}>{message}</span>)}
      </div>
      <button type="button" aria-label="Próxima mensagem" onClick={() => setIndex((index + 1) % announcements.length)}><ChevronRight size={14} aria-hidden="true" /></button>
    </div>
  );
}
