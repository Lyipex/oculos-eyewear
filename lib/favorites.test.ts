import { describe, expect, it } from 'vitest';
import { favoriteKey, normalizeFavorites, toggleFavorite } from './favorites';

describe('favoritos por variante e compatibilidade', () => {
  it('migra modelos legados sem inventar uma preferência de cor', () => {
    expect(normalizeFavorites({ slugs: ['aurora', 'atlas', 'aurora'] })).toEqual([
      { slug: 'aurora', color: null }, { slug: 'atlas', color: null },
    ]);
  });
  it('preserva duas cores e remove somente a variante solicitada', () => {
    const wine = { slug: 'aurora', color: 'Vinho' };
    const black = { slug: 'aurora', color: 'Preto' };
    const items = toggleFavorite(toggleFavorite([], wine), black);
    expect(items).toEqual([wine, black]);
    expect(toggleFavorite(items, wine)).toEqual([black]);
    expect(favoriteKey(wine)).not.toBe(favoriteKey(black));
  });
  it('mantém o favorito sem cor independente das novas preferências explícitas', () => {
    const legacy = { slug: 'aurora', color: null };
    const black = { slug: 'aurora', color: 'Preto' };
    expect(toggleFavorite([legacy], black)).toEqual([legacy, black]);
    expect(toggleFavorite([legacy, black], black)).toEqual([legacy]);
  });
  it('valida dados persistidos e elimina duplicatas sem afetar registros válidos', () => {
    expect(normalizeFavorites({ items: [null, { slug: 'outra', color: null }, { slug: 'aurora', color: 'Azul' }, { slug: 'atlas' }, { slug: 'alma', color: 'Preto' }, { slug: 'alma', color: 'Preto' }] })).toEqual([{ slug: 'alma', color: 'Preto' }]);
    expect(normalizeFavorites(null)).toEqual([]);
    expect(normalizeFavorites('invalid')).toEqual([]);
  });
});
