# Busca e favoritos — refinamento pontual

## Alterações

A busca mantém o header aprovado e passa a usar uma barra compacta arredondada no desktop. Ao abrir, apresenta um painel sobre o conteúdo, imediatamente abaixo do header, sem deslocar a Home. Campo com foco inicial, lupa, Cancelar e sugestões reais: Sol, Grau e os seis modelos existentes. A digitação mostra miniaturas, nomes, cores e preços; Enter leva ao catálogo com a consulta completa. Há estado vazio e sem resultados, fechamento por Escape/clique fora e restauração de foco ao cancelar. Ao seguir um link, o painel permite que a navegação de página gerencie o foco.

A lógica de comparação por nome/categoria foi extraída do catálogo para `matchesProductQuery`, reutilizando sua normalização de caixa e acentos. Os resultados são calculados localmente a partir dos seis produtos: sem requisições de API ou debounce desnecessário.

Os favoritos usam uma lista com miniaturas reais, nomes, cores, preços e remoção por variante. No desktop e tablet a partir de 768 px, o painel tem 370 px, alinhado à direita e 12 px abaixo do ícone. No smartphone, usa bottom sheet com área segura e scroll interno acima da navegação inferior. O estado vazio oferece “Seus favoritos aparecerão aqui.” e um link para a coleção.

O mesmo botão de favorito é usado nos cards e na página de produto e considera a cor selecionada. Aurora/Vinho e Aurora/Preto podem coexistir. Remover uma cor não remove as demais. A remoção desloca o foco para um controle sobrevivente, ou para Fechar quando a lista fica vazia.

## Persistência e migração

A chave `oculos-favorites` foi preservada. O formato v1 contém `items: Array<{ slug: string; color: string | null }>`. A migração do v0 `{ slugs: [...] }` mantém cada produto como `{ slug, color: null }`, sem atribuir uma cor como preferência.

Um favorito legado aparece como **Cor não registrada**. Sua imagem usa a primeira cor do catálogo, explicitamente identificada como **Imagem de referência: [cor]**, e o link não passa um parâmetro de cor. Esses registros permanecem independentes de favoritos novos com uma cor explícita. Dados desconhecidos/inválidos e duplicatas são filtrados, preservando registros válidos.

## Decisões técnicas

- Reutilizado Radix Dialog, já instalado, para portal, dismiss, foco e bloqueio de scroll. O painel de favoritos tem apresentação de popover ancorado nas telas com espaço; mantém comportamento modal acessível para impedir sobreposição de interações com outros painéis.
- Busca e favoritos compartilham um estado de abertura no header. Apenas um deles pode estar aberto.
- Posição calculada a partir do header/ícone real, com atualização por resize e ResizeObserver somente enquanto aberto. A posição não depende de uma altura fixa do header.
- CSS de motion novo restrito aos painéis e itens. Hero, cards, galeria, categorias e seções mantêm suas animações aprovadas.
- Movimento reduzido elimina as entradas decorativas. As saídas usam duração praticamente instantânea com o mesmo nome de keyframe para liberar corretamente a presença/scroll lock do Radix mesmo se a preferência mudar durante o fechamento.
- Nenhuma dependência nova, imagem gerada, API, autenticação ou integração comercial.

## Arquivos desta etapa

| Arquivo | Alteração |
|---|---|
| `components/header.tsx` | Integração dos novos painéis e abertura exclusiva |
| `components/search-panel.tsx` | Busca ampla com chips, resultados locais e teclado |
| `components/favorites-panel.tsx` | Popover/sheet, lista, remoção e gerenciamento de foco |
| `components/use-header-panel-position.ts` | Medição do header e ancoragem do painel |
| `components/product-preview.tsx` | Linha de produto compartilhada, com foto e variante |
| `components/favorite-button.tsx` | Coração compartilhado, sensível à cor |
| `components/product-card.tsx` | Integração do coração por variante; layout e motion preservados |
| `components/product-detail.tsx` | Ação de favorito da cor selecionada, sem alterações na galeria/carrinho |
| `components/catalog.tsx` | Uso da função compartilhada de busca |
| `lib/product-search.ts` e `.test.ts` | Normalização/comparação e testes de consulta |
| `lib/favorites.ts` e `.test.ts` | Variantes, migração compatível, validação e testes |
| `app/globals.css` | Estilos restritos aos novos painéis e ajuste de espaço da busca no header |
| `scripts/check-search-favorites.mjs` | Verificação focada de navegador nas seis larguras |
| `scripts/check-motion.mjs` | Seletores atualizados para a nova busca/coração; sem ampliar a interface |
| `docs/search-and-favorites.md`, `docs/PROJETO.md`, `docs/motion-and-product-assets.md` | Documentação atualizada |

Footer, Hero, layout da Home, catálogo de produtos, fotografias, galeria, carrinho e checkout foram preservados. A única alteração na página de produto é a integração do favorito da seleção atual.

## Testes

`npm test`: 5 arquivos, **28 testes aprovados**, incluindo busca compartilhada, coexistência/remoção de cores, legado e dados persistidos inválidos. `npm run build`: **aprovado**, incluindo TypeScript. Nenhuma dependência adicionada.

O script de UI usa Playwright já disponível no ambiente, com um servidor de produção na porta 3100. `BASE_URL`, `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` e `QA_OUTPUT` permitem configurar a execução. As larguras padrão são 320, 375, 430, 768, 1024 e 1440 px; `QA_WIDTHS` permite uma execução focada.

### Validação responsiva e visual concluída

Chromium headless contra o build de produção, viewport de 900 px de altura: **320, 375, 430, 768, 1024 e 1440 px**. Todas as larguras passaram, sem overflow horizontal nem erros de JavaScript/console nos cenários testados.

Verificações efetivamente executadas:

- Painel abaixo do header e sem deslocar verticalmente a Home; oito sugestões, pesquisa por nome/categoria, imagens carregadas e estado sem resultados.
- Campo recebe foco; Tab alcança Cancelar; Enter pesquisa; Escape, Cancelar e clique externo fecham; foco retorna ao controle ao cancelar.
- Chips de categoria e resultados abrem as rotas correspondentes.
- Duas cores de Aurora salvas, miniaturas corretas, URL da variante e cor selecionada na página de destino; persistência após reload.
- Remoção de uma cor preserva a outra. Corações no card e na página de produto acompanham a seleção. O estado vazio e o foco após a última remoção foram verificados.
- Lista com 13 variantes usa rolagem interna. Popover de 370 px alinhado à direita do ícone nas telas a partir de 768 px; sheet alinhado à base nos smartphones, sobre a navegação inferior.
- Movimento reduzido nos dois painéis, incluindo a mudança de preferência durante o fechamento e liberação do bloqueio do scroll.
- Migração real de localStorage v0 para v1, com dois modelos preservados como cor não registrada, sem atribuição automática de preferência; persistência confirmada após um segundo reload.

Capturas comparadas visualmente com as referências: barra compacta e painel de busca em 1440 px, busca/resultados em 320 px, favoritos em smartphone/tablet e popover desktop. A organização segue as referências fornecidas, mantendo os tokens, tipografia e fotografias da ÓCULOS. Artefatos em `/tmp/eyewear-search-favorites-qa/`, incluindo `results.json` e capturas nas seis larguras.

O script anterior `check-motion.mjs` teve seus seletores atualizados para compatibilidade; a rodada de navegador desta etapa foi o script focado em busca/favoritos, sem repetir uma auditoria geral de checkout/footer. Os testes unitários existentes foram executados junto com os novos.

## Limites e pendências

Validação em aparelhos físicos, Safari/iOS e leitor de tela continua recomendada antes da publicação. Não houve medições de Web Vitals de produção. Não foram produzidos novos retratos; as sete ausências continuam fora das vistas oferecidas pela galeria, conforme a decisão anterior, sem bloquear a versão conceitual.

Sem commit, push ou deploy.
