export type Product = {slug:string; name:string; category:'Sol'|'Grau'; price:number; description:string; colors:string[]; sizes:string[]; rating:number; recent?:boolean};
export const products:Product[] = [
 {slug:'aurora',name:'Aurora',category:'Sol',price:489,description:'Linhas suaves e uma presença que acompanha todos os dias.',colors:['Vinho','Preto','Tartaruga'],sizes:['P','M'],rating:4.9,recent:true},
 {slug:'atelier',name:'Atelier',category:'Grau',price:429,description:'Uma forma essencial para um olhar contemporâneo.',colors:['Preto','Tartaruga'],sizes:['M','G'],rating:4.8},
 {slug:'atlas',name:'Atlas',category:'Sol',price:529,description:'Proporções marcantes em uma silhueta atemporal.',colors:['Preto','Vinho'],sizes:['M','G'],rating:4.8},
 {slug:'alma',name:'Alma',category:'Grau',price:459,description:'Leveza visual e um desenho que vai além das tendências.',colors:['Tartaruga','Preto'],sizes:['P','M'],rating:4.9},
 {slug:'lume',name:'Lume',category:'Sol',price:499,description:'Um clássico reinventado para acompanhar a luz.',colors:['Tartaruga','Vinho'],sizes:['M','G'],rating:4.7,recent:true},
 {slug:'linha',name:'Linha',category:'Grau',price:399,description:'O equilíbrio entre simplicidade e personalidade.',colors:['Preto','Vinho'],sizes:['P','M'],rating:4.8,recent:true}
];
export const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export const frameTones: Record<string, string> = { Vinho: '#651a2d', Preto: '#252326', Tartaruga: '#865634' };

export type ProductView = 'frente' | 'lateral' | 'rosto';

// Explicit availability: missing portraits must never resolve to another color.
export const productPhotos = {
  aurora: {
    Vinho: { frente: '/produtos/aurora-frente.webp', lateral: '/produtos/aurora-lateral.webp', rosto: '/produtos/aurora-rosto.webp' },
    Preto: { frente: '/produtos/aurora-preto-frente.webp', lateral: '/produtos/aurora-preto-lateral.webp', rosto: null },
    Tartaruga: { frente: '/produtos/aurora-tartaruga-frente.webp', lateral: '/produtos/aurora-tartaruga-lateral.webp', rosto: null },
  },
  atelier: {
    Preto: { frente: '/produtos/atelier-frente.webp', lateral: '/produtos/atelier-lateral.webp', rosto: '/produtos/atelier-rosto.webp' },
    Tartaruga: { frente: '/produtos/atelier-tartaruga-frente.webp', lateral: '/produtos/atelier-tartaruga-lateral.webp', rosto: null },
  },
  atlas: {
    Preto: { frente: '/produtos/atlas-frente.webp', lateral: '/produtos/atlas-lateral.webp', rosto: '/produtos/atlas-rosto.webp' },
    Vinho: { frente: '/produtos/atlas-vinho-frente.webp', lateral: '/produtos/atlas-vinho-lateral.webp', rosto: null },
  },
  alma: {
    Tartaruga: { frente: '/produtos/alma-frente.webp', lateral: '/produtos/alma-lateral.webp', rosto: '/produtos/alma-rosto.webp' },
    Preto: { frente: '/produtos/alma-preto-frente.webp', lateral: '/produtos/alma-preto-lateral.webp', rosto: null },
  },
  lume: {
    Tartaruga: { frente: '/produtos/lume-frente.webp', lateral: '/produtos/lume-lateral.webp', rosto: '/produtos/lume-rosto.webp' },
    Vinho: { frente: '/produtos/lume-vinho-frente.webp', lateral: '/produtos/lume-vinho-lateral.webp', rosto: null },
  },
  linha: {
    Preto: { frente: '/produtos/linha-frente.webp', lateral: '/produtos/linha-lateral.webp', rosto: '/produtos/linha-rosto.webp' },
    Vinho: { frente: '/produtos/linha-vinho-frente.webp', lateral: '/produtos/linha-vinho-lateral.webp', rosto: null },
  },
} satisfies Record<string, Record<string, Record<ProductView, string | null>>>;

export function photoColor(product: Product, color?: string) {
  return color && product.colors.includes(color) ? color : product.colors[0];
}

export function expectedProductPhotoPath(product: Product, color: string, view: ProductView) {
  const suffix = color === product.colors[0] ? '' : `-${color.toLowerCase()}`;
  return `/produtos/${product.slug}${suffix}-${view}.webp`;
}

export function productPhotoPath(product: Product, color?: string, view: ProductView = 'frente'): string | null {
  const inventory: Record<string, Record<string, Record<ProductView, string | null>>> = productPhotos;
  return inventory[product.slug]?.[photoColor(product, color)]?.[view] ?? null;
}

export const productViews = [
  { id: 'frente', label: 'Frente', description: 'vista frontal' },
  { id: 'lateral', label: 'Em ângulo', description: 'vista em ângulo' },
  { id: 'rosto', label: 'No rosto', description: 'em um rosto fictício' },
] as const;

export function availableProductViews(product: Product, color: string) {
  return productViews.filter(({ id }) => productPhotoPath(product, color, id) !== null);
}

export function resolveProductView(product: Product, color: string, requested: ProductView): ProductView {
  return availableProductViews(product, color).some(({ id }) => id === requested) ? requested : 'frente';
}
