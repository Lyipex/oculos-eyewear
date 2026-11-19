'use client';

import { ArrowUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { InformationDialog } from './information-dialog';
import { Wordmark } from './wordmark';

export function Footer() {
  const navigation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const arrangeGroups = () => {
      navigation.current?.querySelectorAll<HTMLDetailsElement>('details').forEach((group) => {
        // Native disclosures remain usable without JS. Preserve an open dialog's
        // trigger when crossing into the compact layout.
        group.open = desktop.matches || Boolean(group.querySelector('[aria-expanded="true"]'));
        const summary = group.querySelector('summary');
        if (summary) {
          summary.tabIndex = desktop.matches ? -1 : 0;
          if (desktop.matches) summary.setAttribute('aria-disabled', 'true');
          else summary.removeAttribute('aria-disabled');
        }
      });
    };
    arrangeGroups();
    desktop.addEventListener('change', arrangeGroups);
    return () => desktop.removeEventListener('change', arrangeGroups);
  }, []);

  const keepDesktopOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(min-width: 768px)').matches) event.preventDefault();
  };
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-signature">
          <Wordmark />
          <p className="footer-signature-line">Seu olhar, <em>sua assinatura.</em></p>
        </div>
        <div className="footer-navigation" ref={navigation}>
          <nav aria-label="Coleção" className="footer-nav-group">
            <details className="footer-disclosure" open>
              <summary onClick={keepDesktopOpen}><h2>Coleção</h2><Plus size={18} aria-hidden="true" /></summary>
              <div className="footer-group-links">
                <Link href="/produtos?categoria=Sol">Óculos de sol</Link>
                <Link href="/produtos?categoria=Grau">Óculos de grau</Link>
                <Link href="/produtos?colecao=novidades">Novidades</Link>
                <Link href="/produtos">Todos os óculos</Link>
              </div>
            </details>
          </nav>
          <nav aria-label="Atendimento" className="footer-nav-group">
            <details className="footer-disclosure" open>
              <summary onClick={keepDesktopOpen}><h2>Atendimento</h2><Plus size={18} aria-hidden="true" /></summary>
              <div className="footer-group-links">
                <InformationDialog topic="faq" /><InformationDialog topic="shipping" />
                <InformationDialog topic="returns" /><InformationDialog topic="sizes" />
              </div>
            </details>
          </nav>
          <nav aria-label="Institucional" className="footer-nav-group footer-nav-short">
            <h2>Institucional</h2><InformationDialog topic="about" />
          </nav>
          <nav aria-label="Conecte-se" className="footer-nav-group footer-nav-short">
            <h2>Conecte-se</h2><InformationDialog topic="contact" />
          </nav>
        </div>
      </div>
      <div className="footer-legal">
        <div className="shell">
          <div className="footer-legal-row">
            <small>© {new Date().getFullYear()} ÓCULOS Eyewear</small>
            <nav aria-label="Informações legais"><InformationDialog topic="privacy" /><InformationDialog topic="terms" /></nav>
            <button type="button" className="back-to-top" onClick={() => {
              window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
              document.querySelector<HTMLAnchorElement>('.site-header .logo')?.focus({ preventScroll: true });
            }}>Voltar ao topo <ArrowUp size={16} aria-hidden="true" /></button>
          </div>
          <p className="footer-disclaimer">Projeto conceitual de portfólio. Produtos, imagens, preços, avaliações e condições são ilustrativos. A compra é simulada.</p>
        </div>
      </div>
    </footer>
  );
}
