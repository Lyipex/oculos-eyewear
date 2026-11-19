import { describe, expect, it } from 'vitest';
import { matchesProductQuery } from './product-search';
import { products } from './products';

const search = (query: string) => products.filter((product) => matchesProductQuery(product, query));
describe('busca compartilhada do catálogo e painel', () => {
  it('encontra nomes sem distinguir caixa e espaços externos', () => expect(search(' AURORA ').map(({ slug }) => slug)).toEqual(['aurora']));
  it('encontra categorias com e sem acentos', () => {
    expect(search('oculos de grau')).toHaveLength(3);
    expect(search('Óculos de sol')).toHaveLength(3);
  });
  it('trata consulta vazia e ausência de resultado', () => {
    expect(search('   ')).toHaveLength(products.length);
    expect(search('inexistente')).toEqual([]);
  });
});
