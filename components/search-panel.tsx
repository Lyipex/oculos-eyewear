'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type CSSProperties } from 'react';
import { matchesProductQuery } from '@/lib/product-search';
import { products } from '@/lib/products';
import { ProductPreview } from './product-preview';
import { useHeaderPanelPosition } from './use-header-panel-position';

export function SearchPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef(true);
  const [query, setQuery] = useState('');
  const position = useHeaderPanelPosition(open, trigger);
  const style = { '--search-top': `${position.headerBottom}px` } as CSSProperties;
  const results = products.filter((product) => matchesProductQuery(product, query));
  const navigate = () => { restoreFocus.current = false; onOpenChange(false); };
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (next) setQuery(''); onOpenChange(next); }}>
      <Dialog.Trigger ref={trigger} className="icon-button search-trigger" aria-label="Buscar produtos"><Search size={20} aria-hidden="true" /><span className="search-trigger-label">Buscar</span></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay search-backdrop" style={style} />
        <Dialog.Content className="search-panel" style={style} aria-describedby={undefined}
          onOpenAutoFocus={(event) => { event.preventDefault(); input.current?.focus(); }}
          onCloseAutoFocus={(event) => { if (!restoreFocus.current) event.preventDefault(); restoreFocus.current = true; }}>
          <div className="shell search-panel-inner">
            <Dialog.Title className="sr-only">Buscar produtos</Dialog.Title>
            <div className="search-panel-top">
              <form role="search" className="search-field" onSubmit={(event) => {
                event.preventDefault();
                const value = query.trim();
                navigate();
                router.push(value ? `/produtos?${new URLSearchParams({ q: value })}` : '/produtos');
              }}>
                <Search size={20} aria-hidden="true" />
                <input ref={input} type="search" name="q" aria-label="Nome ou tipo de óculos" placeholder="Buscar" maxLength={80}
                  autoComplete="off" enterKeyHint="search" value={query} onChange={(event) => setQuery(event.target.value)} />
              </form>
              <Dialog.Close className="search-cancel">Cancelar</Dialog.Close>
            </div>
            <div key={query.trim() ? 'results' : 'suggestions'} className="search-panel-body">
              {query.trim() ? <>
                <p className="search-section-label" role="status">{results.length ? `${results.length} ${results.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}` : 'Nenhum produto encontrado.'}</p>
                {results.length ? <ul className="search-results">{results.map((product) => <li key={product.slug}><ProductPreview product={product} color={product.colors[0]} onNavigate={navigate} /></li>)}</ul>
                  : <p className="search-empty">Experimente o nome de um modelo ou busque por sol ou grau.</p>}
                <Link className="text-link search-all" href={`/produtos?${new URLSearchParams({ q: query.trim() })}`} onClick={navigate}>Ver todos os resultados</Link>
              </> : <>
                <h2 className="search-section-label">Explore a coleção</h2>
                <div className="search-chips">
                  <Link href="/produtos?categoria=Sol" onClick={navigate}>Óculos de sol</Link>
                  <Link href="/produtos?categoria=Grau" onClick={navigate}>Óculos de grau</Link>
                  {products.map((product) => <Link key={product.slug} href={`/produto/${product.slug}`} onClick={navigate}>{product.name}</Link>)}
                </div>
              </>}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
