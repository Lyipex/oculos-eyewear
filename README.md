# ÓCULOS Eyewear

E-commerce conceitual de eyewear, desenvolvido com Next.js e TypeScript, com foco em experiência de compra, design responsivo e interações simuladas.

A loja pertence a uma marca fictícia e serve como demonstração para portfólio. Produtos, preços, avaliações, benefícios e imagens são ilustrativos. Não existem transações comerciais reais, pagamentos ou pedidos enviados.

## Executar

No macOS e no Linux, use Node.js 24 LTS com npm e execute os comandos abaixo a partir da pasta do projeto. `npm ci` usa o lockfile para instalar as mesmas versões nas duas plataformas.

```bash
npm ci
npm run dev
npm test
npm run build
```

Abra http://localhost:3000 para desenvolvimento. Use `npm start` após o build para inspecionar a versão de produção. O projeto ainda não tem um comando de lint.

## SEO e URL de produção

Defina `SITE_URL` com a origem pública HTTPS definitiva no build e no servidor (por exemplo, `SITE_URL=https://sua-loja.example npm run build`). Essa configuração gera URLs canônicas absolutas, as imagens de Open Graph da home e dos produtos e as URLs do sitemap. As escolhas de filtro e cor ficam fora das URLs canônicas. O checkout mantém `noindex`. Sem `SITE_URL`, o sitemap fica vazio e o robots bloqueia o rastreamento.

As páginas HTML são renderizadas por requisição para receber o nonce da CSP. Use hospedagem com runtime do Next.js e configure HSTS na hospedagem quando o domínio estiver servindo HTTPS definitivo.

## Estrutura e demonstração

Veja também a [documentação do projeto](docs/PROJETO.md).

- `app/` concentra rotas, metadados e os tokens de `globals.css`.
- `components/` contém cabeçalho, busca, favoritos, vitrine, galeria, carrinho e checkout.
- `lib/` contém catálogo fictício, validação de CEP e estado local de favoritos e carrinho.
- `public/hero-editorial.png` contém a campanha gerada, com personagens fictícios.
- `public/produtos/` contém imagens conceituais geradas para cada modelo, com vistas frontal e em ângulo de cada cor e um retrato ilustrativo da cor de referência, em uma pessoa fictícia. As imagens são representações do catálogo conceitual.

Para testar o fluxo, procure por Aurora, marque o favorito e abra o modelo. Escolha uma variação, simule o frete com um CEP fictício e adicione ao carrinho. O cupom `OCULOS10` aplica 10% na simulação e aparece no checkout. Preencha o checkout apenas com dados fictícios.

## Conferência visual no VS Code

Em zoom de 100%, compare a home, o catálogo, o produto e o carrinho com o mockup em 375, 768, 1024 e 1440 px. Confira o recorte da campanha, a largura dos cards, a área de toque dos controles, a ausência de rolagem lateral e o foco dos diálogos por teclado. Se a loja ganhar um catálogo definitivo, registre uma imagem aprovada para cada cor antes de substituir as referências conceituais.
