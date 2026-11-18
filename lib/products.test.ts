import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { productPhotoPath, products } from './products';

describe('imagens de produto', () => {
  it.each(products)('tem todas as cores e vistas de $name', (product) => {
    const files = product.colors.flatMap((color) => [
      productPhotoPath(product, color, 'frente'),
      productPhotoPath(product, color, 'lateral'),
    ]);
    files.push(productPhotoPath(product, undefined, 'rosto'));
    expect(new Set(files).size).toBe(product.colors.length * 2 + 1);
    for (const file of files) {
      const data = readFileSync(resolve('public', '.' + file));
      expect(data.toString('ascii', 8, 12)).toBe('WEBP');
    }
  });

  it('usa a cor de referência para um retrato e ignora uma cor inválida de um link', () => {
    const product = products[0];
    expect(productPhotoPath(product, product.colors[1], 'rosto')).toBe(productPhotoPath(product, undefined, 'rosto'));
    expect(productPhotoPath(product, 'Amarelo')).toBe(productPhotoPath(product));
  });
});
