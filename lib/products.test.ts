import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { availableProductViews, resolveProductView, expectedProductPhotoPath, productPhotoPath, productPhotos, products, type ProductView } from './products';

const views: ProductView[] = ['frente', 'lateral', 'rosto'];

describe('inventário de imagens de produto', () => {
  it.each(products)('mapeia cada cor e vista de $name sem substituir a cor', (product) => {
    for (const color of product.colors) {
      for (const view of views) {
        const path = productPhotoPath(product, color, view);
        if (!path) {
          expect(view).toBe('rosto');
          expect(color).not.toBe(product.colors[0]);
          expect(expectedProductPhotoPath(product, color, view)).toContain(`-${color.toLowerCase()}-rosto.webp`);
          continue;
        }
        expect(path).toBe(expectedProductPhotoPath(product, color, view));
        const data = readFileSync(resolve('public', '.' + path));
        expect(data.toString('ascii', 0, 4)).toBe('RIFF');
        expect(data.toString('ascii', 8, 12)).toBe('WEBP');
      }
    }
  });

  it('contabiliza os 32 arquivos existentes e os sete retratos ausentes', () => {
    const mapped = products.flatMap((product) => product.colors.flatMap((color) => views.map((view) => productPhotoPath(product, color, view))));
    expect(mapped.filter((path) => path === null)).toHaveLength(7);
    const files = mapped.filter((path): path is string => path !== null);
    expect(new Set(files).size).toBe(32);
    expect(files.map((path) => path.replace('/produtos/', '')).sort()).toEqual(readdirSync('public/produtos').sort());
    expect(Object.keys(productPhotos).sort()).toEqual(products.map((product) => product.slug).sort());
  });

  it('jamais retorna o retrato da referência para uma cor sem fotografia', () => {
    for (const product of products) {
      for (const color of product.colors.slice(1)) expect(productPhotoPath(product, color, 'rosto')).toBeNull();
      expect(productPhotoPath(product, 'Amarelo')).toBe(productPhotoPath(product));
    }
  });
});

describe('vistas disponíveis da galeria', () => {
  it.each(products)('mostra somente imagens da cor de $name', (product) => {
    for (const color of product.colors) {
      const views = availableProductViews(product, color);
      expect(views.map(({ id }) => id)).toEqual(color === product.colors[0] ? ['frente', 'lateral', 'rosto'] : ['frente', 'lateral']);
      for (const { id } of views) expect(productPhotoPath(product, color, id)).not.toBeNull();
      expect(resolveProductView(product, color, 'rosto')).toBe(color === product.colors[0] ? 'rosto' : 'frente');
      expect(resolveProductView(product, color, 'lateral')).toBe('lateral');
    }
  });
});
