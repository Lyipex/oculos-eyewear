# Refinamento de navegação, motion e imagens

> Este relatório registra a etapa anterior de navegação e motion. O refinamento posterior de busca e favoritos, com variantes e migração de dados, está documentado em [Busca e favoritos](search-and-favorites.md). As animações aprovadas nesta etapa foram preservadas.

## Briefing e referências

A base aprovada é o header da ÓCULOS enviado na imagem 1: logotipo ÓCULOS/EYEWEAR, faixa vinho, fundo marfim, tipografia e distribuição entre marca, categorias e ações foram preservados. A imagem 2 (Nike) orienta somente hierarquia e usabilidade. A imagem 3 registra um estado que foi removido: a galeria não oferece uma vista sem fotografia.

Referências consultadas: [Nike Brasil](https://www.nike.com.br/) para organização de navegação e grupos de ajuda/institucional. O endereço [filipealbuquerque.com.br](https://filipealbuquerque.com.br/) retornou erro de acesso na consulta; não foi usado como evidência visual. As três imagens fornecidas foram analisadas antes das alterações. Nenhum elemento de identidade da Nike foi reproduzido.

## Alterações por área

### Header

Mantida a estrutura existente, com ajustes de espaçamento e alinhamento. Categorias têm sublinhado discreto para seleção/hover e sublinhado mais espesso para foco por teclado, substituindo o contorno retangular nesses links. Os demais controles mantêm foco visível. A busca ganha rótulo “Buscar” em telas largas e orientação por nome/categoria no diálogo, reutilizando o filtro existente (incluindo acentos). Favoritos continuam no estado local; a conta explica que o acesso não está disponível nesta demonstração.

A faixa vinho mantém as três mensagens ilustrativas em telas maiores. No smartphone, setas com área de toque de 44 px permitem alternância manual. Não há rotação automática. O menu existente ganhou título de grupo, links de 52 px e uma área separada sobre o projeto e tamanhos, com disclosures nativos que expandem o texto dentro do próprio menu sem empilhar diálogos. Os painéis continuam usando Radix para foco, Escape, backdrop e bloqueio do scroll.

### Footer

Cinco grupos: Marca, Explore, Ajuda, Institucional e Conecte-se. Explore leva às rotas reais de categoria, novidades e catálogo. No rodapé, os oito tópicos de ajuda/institucionais/contato abrem diálogos contextuais, com texto explícito sobre a demonstração. Sem páginas vazias, cadastro, atendimento fictício ou redes sociais sem destino confirmado.

O layout apresenta blocos em duas colunas no smartphone, quatro grupos abaixo da marca no tablet e cinco colunas no desktop. Inclui aviso conceitual, copyright, separadores e voltar ao topo com foco no logotipo do header. O scroll suave é desativado em movimento reduzido.

### Galeria

`availableProductViews` filtra as vistas pelo inventário tipado; `resolveProductView` resolve uma seleção inválida para Frente. As mesmas funções governam botões, setas e teclado.

- Todas as cores oferecem Frente e Em ângulo.
- “No rosto” aparece apenas com retrato da cor selecionada.
- Trocar para uma cor sem retrato seleciona Frente imediatamente.
- Setas percorrem apenas as vistas disponíveis, inclusive no retorno circular.
- Não há mensagens de indisponibilidade na interface nem reutilização de outra cor.
- A altura da galeria permanece fixa. A legenda reserva sua linha para não deslocar o conteúdo.

As imagens existentes foram preservadas. A galeria descarta a camada anterior na troca de cor e mantém no máximo duas imagens durante a troca de vista. Não usa filtros CSS nem pré-carrega todas as variações.

### Motion

| Elemento | Tempo | Comportamento |
|---|---|---|
| Texto do Hero | 900 ms | Entrada coordenada, sem mudar a composição |
| Fotografia do Hero | 1.100 ms | Revelação de opacidade, sem zoom ou novo recorte |
| Seções da Home | 850 ms | Observer único por montagem, sem animar cada produto |
| Hover de imagem/card | 300 ms | Zoom 1,025 somente com hover e ponteiro preciso |
| Galeria | 350 ms | Opacidade após carregamento, mantendo proporção |
| Menu e carrinho | 380 ms | Entrada/saída lateral e backdrop |
| Botões e seletores | 180–200 ms | Feedback rápido de pressão e seleção |

Revelações usam deslocamentos de 12 px no mobile e 16 px nas telas maiores, com curva suave. A confirmação de adição permanece por 1,8 s, sem bloquear novas adições. `prefers-reduced-motion: reduce` elimina movimentos decorativos e preserva seleção, texto de confirmação e navegação. As seções da Home ficam visíveis antes da hidratação.

## Inventário de imagens

32 arquivos WebP, 13 combinações produto/cor. Todas as 26 fotografias de frente/ângulo e seis retratos estão disponíveis.

| Produto | Frente e ângulo | Retrato disponível | Retratos ausentes |
|---|---|---|---|
| Aurora | Vinho, Preto, Tartaruga | Vinho | Preto, Tartaruga |
| Atelier | Preto, Tartaruga | Preto | Tartaruga |
| Atlas | Preto, Vinho | Preto | Vinho |
| Alma | Tartaruga, Preto | Tartaruga | Preto |
| Lume | Tartaruga, Vinho | Tartaruga | Vinho |
| Linha | Preto, Vinho | Preto | Vinho |

Os sete caminhos futuros em `public/produtos/` são `aurora-preto-rosto.webp`, `aurora-tartaruga-rosto.webp`, `atelier-tartaruga-rosto.webp`, `atlas-vinho-rosto.webp`, `alma-preto-rosto.webp`, `lume-vinho-rosto.webp` e `linha-vinho-rosto.webp`.

Essas vistas continuam como `null` em `productPhotos`. Não serão produzidas nesta etapa e **não bloqueiam a versão 1.0**: a experiência usa apenas as 32 fotografias existentes. Se forem adicionadas no futuro, atualizar o inventário e as expectativas de disponibilidade dos testes. A variação Aurora continua chamada Tartaruga; nenhum nome ou cor foi alterado.

## Arquivos desta etapa

- `components/header.tsx`: navegação, busca, conta, faixa manual e organização do menu.
- `components/footer.tsx`: novo componente extraído do footer existente e ampliado com os grupos solicitados.
- `components/information-dialog.tsx`: tópicos contextuais reutilizados no footer/menu.
- `app/layout.tsx`: integração do footer.
- `app/icon.svg`: ícone tipográfico nas cores da marca, corrigindo a solicitação de favicon sem destino.
- `app/globals.css`: ajustes pontuais de header/footer, foco e tempos de motion.
- `lib/products.ts`: vistas centralizadas e resolução da seleção disponível.
- `components/product-detail.tsx`: galeria filtrada, navegação e retorno automático à Frente.
- `components/gallery-photo.tsx` e `components/product-photo.tsx`: remoção do aviso de imagem ausente e uso dos metadados centralizados.
- `lib/products.test.ts`: regressões de disponibilidade e seleção por cor.
- `scripts/check-motion.mjs`: validação de UI ampliada para navegação, rodapé, busca, favoritos, conta, cupom e checkout.
- `docs/PROJETO.md` e este arquivo: descrição atualizada da experiência.

Nenhuma dependência adicionada. Nenhuma fotografia substituída. Sem alterações na lógica comercial, backend, login, pagamentos ou envio de dados. Sem commit, push ou deploy.

## Validação

`npm test`: 3 arquivos e 21 testes aprovados. `npm run build`: aprovado, incluindo TypeScript. `git diff --check`: sem problemas.

A validação de navegador usa o script `scripts/check-motion.mjs` contra o servidor de produção na porta 3100, configurável por `BASE_URL`. Playwright já está disponível no ambiente; não foi instalado no projeto. Para usar uma instalação externa, informar `PLAYWRIGHT_MODULE` e, se necessário, `CHROMIUM_PATH`. `QA_OUTPUT` define o diretório das capturas e resultados.

### Resultado no navegador

Chromium headless, servidor de produção: **375, 430, 768, 1024 e 1440 px**. Touch habilitado nas três larguras menores. Todos os cenários passaram:

- Home, header, menu, rodapé, catálogo, produto, carrinho e checkout sem overflow horizontal nos cenários verificados.
- Menu com informações expansíveis, foco contido e restauração de foco; fechamento por Escape. Carrinho com seis variantes, scroll independente, bloqueio do fundo, Escape e backdrop.
- Oito diálogos do rodapé com título/conteúdo, fechamento e retorno ao botão de origem. Voltar ao topo funcional e foco no logotipo.
- Busca por “Aurora” retorna um produto; busca por “grau” retorna três. Favorito salvo aparece no diálogo. Conta explica a indisponibilidade do acesso real.
- Link ativo do header com sublinhado e foco por teclado distinguível, sem contorno retangular.
- Trocas rápidas de cores/vistas, altura estável da galeria e retorno à Frente nas cores sem retrato. As 32 imagens disponíveis carregaram; sete opções de retrato são omitidas. Nenhuma referência quebrada de imagem.
- Carrinho com seis variantes, cupom FORMA10 aplicado, resumo preservado no checkout, validação com foco no primeiro erro e finalização simulada com dados fictícios.
- Movimento reduzido na galeria, painéis e Hero; reflow com tamanho-base de texto a 200%.
- Nenhum erro de JavaScript ou de console nos cenários das cinco larguras. O favicon ausente identificado na primeira passagem foi corrigido com `app/icon.svg`.

O CLS observado na Home foi 0 nas cinco execuções locais. Não é uma medição de produção. Contrastes calculados dos tokens principais: vinho/marfim 10,75:1, grafite/marfim 13,88:1, texto secundário/fundo 6,46:1 e branco/vinho 12,08:1. Isso verifica essas combinações de cor, sem substituir uma auditoria completa de acessibilidade.

Capturas e resultados: `/tmp/eyewear-refinement-qa/`, incluindo `results.json`, Home/produto/carrinho/rodapé/checkout nas cinco larguras, menus mobile/tablet, header ativo em desktop e a comparação do header em 1920 px.

### Comparação visual com o briefing

Foram inspecionadas capturas reais do resultado: header de 1920 px, header ativo de 1024 px, rodapés mobile/desktop, menu tablet e galeria Aurora/Tartaruga. Comparadas com as três imagens fornecidas, confirmam a preservação da composição, marca, cores e tipografia da ÓCULOS. A busca foi identificada com texto apenas onde há espaço. A organização usa a referência de UX da Nike sem reproduzir seu visual. A galeria corrigida mostra a fotografia frontal Tartaruga e somente Frente/Em ângulo, eliminando o estado de indisponibilidade da imagem 3.

## Limites e melhorias futuras

Os resultados locais de navegação e performance não representam Web Vitals de produção. Não foi quantificado o delta de bundle. O CSS prioriza transform e opacity, preserva o preload do Hero e não adiciona bibliotecas de animação.

Para a versão 1.0: revisar em aparelhos físicos e Safari/iOS, verificar zoom nativo e leitor de tela, e medir Web Vitals com rede/CPU limitadas. São validações recomendadas; esta etapa não implementa outras funcionalidades. Mais retratos e medidas reais para o guia de tamanhos podem ser considerados se o catálogo deixar de ser conceitual.
