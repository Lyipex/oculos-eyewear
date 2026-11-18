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

export function photoColor(product: Product, color: string | undefined, view: ProductView = 'frente') {
  // O retrato usa a cor de referência, mesmo quando outra versão está selecionada.
  if (view === 'rosto') return product.colors[0];
  return color && product.colors.includes(color) ? color : product.colors[0];
}

export function productPhotoPath(product: Product, color?: string, view: ProductView = 'frente') {
  const variant = photoColor(product, color, view);
  const suffix = variant === product.colors[0] ? '' : `-${variant.toLowerCase()}`;
  return `/produtos/${product.slug}${suffix}-${view}.webp`;
}
