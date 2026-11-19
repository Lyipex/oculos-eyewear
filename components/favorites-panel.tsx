'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Heart, X } from 'lucide-react';
import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { favoriteKey, useFavorites } from '@/lib/favorites';
import { products } from '@/lib/products';
import { ProductPreview } from './product-preview';
import { useHeaderPanelPosition } from './use-header-panel-position';

export function FavoritesPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const items = useFavorites((state) => state.items);
  const remove = useFavorites((state) => state.remove);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(true);
  const position = useHeaderPanelPosition(open, trigger);
  const style = { '--favorites-top': `${position.triggerBottom}px`, '--favorites-right': `${position.right}px` } as CSSProperties;
  const navigate = () => { restoreFocus.current = false; onOpenChange(false); };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger ref={trigger} className="icon-button" aria-label="Favoritos"><Heart size={21} aria-hidden="true" /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay favorites-backdrop" />
        <Dialog.Content className="favorites-panel" style={style} aria-describedby={undefined}
          onCloseAutoFocus={(event) => { if (!restoreFocus.current) event.preventDefault(); restoreFocus.current = true; }}>
          <div className="favorites-head"><Dialog.Title>Meus favoritos ({items.length})</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Fechar favoritos"><X size={20} aria-hidden="true" /></Dialog.Close>
          </div>
          <div className="favorites-scroll">
            {items.length ? <ul className="favorites-list">{items.map((favorite, index) => {
              const product = products.find((product) => product.slug === favorite.slug);
              if (!product) return null;
              return <li key={favoriteKey(favorite)} className="favorite-item">
                <ProductPreview product={product} color={favorite.color} onNavigate={navigate} />
                <button className="icon-button favorite-remove" type="button" aria-label={`Remover ${product.name}, ${favorite.color ?? 'cor não registrada'} dos favoritos`}
                  onClick={(event) => {
                    const list = event.currentTarget.closest('ul');
                    const controls = list?.querySelectorAll<HTMLButtonElement>('.favorite-remove');
                    const next = controls?.[index + 1] ?? controls?.[index - 1];
                    // Keep focus in the list when the focused removal control disappears.
                    if (next) next.focus();
                    else event.currentTarget.closest('[role=dialog]')?.querySelector<HTMLButtonElement>('[aria-label="Fechar favoritos"]')?.focus();
                    remove(favorite);
                  }}><X size={16} aria-hidden="true" /></button>
              </li>;
            })}</ul> : <div className="favorites-empty"><p>Seus favoritos aparecerão aqui.</p><Link className="text-link" href="/produtos" onClick={navigate}>Explorar a coleção</Link></div>}
          </div>
          <p className="sr-only" role="status">{items.length} {items.length === 1 ? 'favorito salvo' : 'favoritos salvos'}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
