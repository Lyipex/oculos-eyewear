# ÓCULOS Eyewear

E-commerce conceitual de eyewear, desenvolvido com Next.js e TypeScript, com foco em experiência de compra, design responsivo e interações simuladas.

## Escopo

Marca fictícia criada para portfólio. Não existem transações comerciais reais, pagamentos ou envio de pedidos. Os dados enviados no formulário da simulação são validados no navegador. Use dados de exemplo.

## Experiência demonstrada

- Home com vitrine, painel de busca com resultados locais e navegação por categoria.
- Catálogo com filtros, ordenação e favoritos locais por produto/cor; popover no desktop/tablet e sheet no mobile, com migração de registros antigos sem cor.
- Página de produto com cores, tamanhos, galeria e simulação de frete. A vista no rosto aparece somente nas cores com retrato fictício correspondente; as demais oferecem Frente e Em ângulo.
- Header com navegação acessível e rodapé com informações contextuais da demonstração.
- Carrinho local com quantidades, cupom de demonstração e checkout simulado.

## Organização

Next.js App Router e React organizam as páginas. TypeScript descreve os dados e componentes. Zustand mantém carrinho e favoritos no navegador. Zod valida os campos do checkout. Consulte o [README](../README.md) para execução e testes.
