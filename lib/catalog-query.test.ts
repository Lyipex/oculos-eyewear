import { describe, expect, it } from 'vitest';
import { catalogHref, catalogParams, minPrice } from './catalog-query';

describe('retorno ao catálogo', () => {
  it('preserva a busca, categoria, preço e ordenação em uma URL interna', () => {
    const query = new URLSearchParams({
      categoria: 'Sol', colecao: 'novidades', q: 'óculos', preco: '451', ordem: 'menor',
    });
    const deepLink = new URLSearchParams({ cor: 'Preto', retorno: query.toString() });
    expect(catalogHref(catalogParams(new URLSearchParams(deepLink.get('retorno') ?? ''))))
      .toBe('/produtos?categoria=Sol&colecao=novidades&q=%C3%B3culos&preco=450&ordem=menor');
  });

  it('ignora parâmetros desconhecidos ou inválidos e limita o preço ao intervalo do catálogo', () => {
    const query = new URLSearchParams('categoria=Outra&ordem=Outra&preco=1&redirect=https://example.com');
    expect(catalogHref(catalogParams(query))).toBe(`/produtos?preco=${minPrice}`);
    expect(catalogHref(catalogParams(new URLSearchParams('https://example.com')))).toBe('/produtos');
  });
});
