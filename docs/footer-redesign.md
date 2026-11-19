# Footer — redesign editorial

O rodapé passou de cinco colunas equivalentes para uma composição com assinatura de marca, navegação agrupada e faixa legal própria. O escopo desta etapa ficou restrito ao Footer, seus estilos e verificações. A seção vinho da Home já oferece a transição institucional necessária e foi preservada, sem criar outra chamada promocional.

## Decisões de design

- **Marca:** o componente Wordmark existente ganhou escala somente dentro do footer, em vinho. A frase “Seu olhar, sua assinatura.” usa a mesma combinação de sans-serif e Georgia já presente no projeto.
- **Navegação:** Coleção e Atendimento formam os dois grupos principais; Institucional e Conecte-se ficam em um segundo nível. Sobre o projeto e Contato permanecem acessos diretos.
- **Legal:** Privacidade e Termos de uso foram movidos para a base grafite, junto ao copyright e voltar ao topo. O aviso conceitual aparece uma vez, sem repetir a mesma ressalva em cada grupo.
- **Mobile:** os dois grupos com quatro destinos usam disclosures nativos, fechados inicialmente após a hidratação. Os dois grupos curtos ficam visíveis. Isso reduz a altura sem esconder Sobre ou Contato atrás de uma interação adicional.
- **Tablet/desktop:** os grupos principais ficam abertos, com a marca à esquerda e a navegação à direita. A passagem entre breakpoints mantém os mesmos elementos e destinos; um grupo com diálogo aberto conserva seu botão de origem acessível.
- **Motion:** apenas mudança discreta de cor/sublinhado dos links e rotação do indicador dos disclosures. Sem animação de entrada que atrase a leitura. Movimento reduzido remove essas transições.

A cor, fonte e animações do restante do site foram preservadas. Não houve novos gradientes, cartões, sombras, fotografias ou bibliotecas.

## Referências efetivamente analisadas

A [Adidas Adventure](https://www.adidas.com.br/adventure) forneceu estrutura textual de grupos e informações legais. No navegador, o acesso visual retornou **HTTP 403**; não foi possível avaliar diretamente seu comportamento responsivo. A captura desktop anexada pelo usuário foi analisada visualmente: agrupamento de suporte/institucional, alinhamento das colunas e separação da faixa legal. Esses princípios foram aproveitados, sem copiar o fundo preto integral, marcas de pagamento, redes sociais ou informações comerciais.

O [portfólio de Filipe Albuquerque](https://filipealbuquerque.com.br/) foi acessado no navegador e inspecionado visualmente nesta etapa. Foram aproveitados o respiro entre grupos, a hierarquia dos rótulos e a separação sutil da base legal. O layout e a paleta não foram reproduzidos.

As capturas do footer anterior da ÓCULOS também foram usadas para conferir a continuidade da marca. As referências e o estado anterior estão registrados localmente em `/tmp/eyewear-footer-references/`.

## Funcionalidade preservada

Os quatro links de coleção mantêm rotas reais. Perguntas frequentes, Frete e entregas, Trocas e devoluções, Guia de tamanhos, Sobre o projeto, Contato, Privacidade e Termos de uso continuam usando os oito diálogos informativos existentes, com fechamento por Escape e retorno do foco.

Não foram criados CNPJ, endereço, redes sociais, atendimento comercial, formas de pagamento, certificações, newsletter ou políticas de uma loja real. O aviso identifica o projeto conceitual e a simulação.

O botão de voltar ao topo mantém foco no logotipo do header e respeita movimento reduzido. A base reserva espaço para a navegação inferior fixa e para `safe-area-inset-bottom`. Os disclosures usam HTML nativo; sem JavaScript, os links são apresentados abertos, preservando a navegação básica.

## Arquivos desta etapa

| Arquivo | Alteração |
|---|---|
| `components/footer.tsx` | Nova composição, grupos nativos responsivos e organização legal |
| `app/globals.css` | Substituição das regras antigas do footer por estilos locais de assinatura, navegação e base legal |
| `scripts/check-footer.mjs` | Validação focada nas seis larguras e geração de capturas |
| `scripts/check-motion.mjs` | Abertura/fechamento do grupo Atendimento no trecho de teste do rodapé mobile |
| `docs/footer-redesign.md` | Relatório e capturas para revisão |
| `docs/screenshots/footer-375.png` | Captura final de smartphone |
| `docs/screenshots/footer-768.png` | Captura final de tablet |
| `docs/screenshots/footer-1440.png` | Captura final de desktop |

Header, busca, favoritos, Hero, Home, catálogo, galeria, carrinho, checkout e o componente compartilhado de diálogos não foram alterados nesta etapa. O CSS fora dos seletores de footer foi mantido; na regra compartilhada com categorias, apenas os seletores antigos de footer foram retirados.

## Validação

- `npm test`: **28 testes aprovados**, em cinco arquivos.
- `npm run build`: **aprovado**, incluindo TypeScript.
- `git diff --check`: sem problemas.
- Chromium headless contra o build de produção, em **320, 375, 430, 768, 1024 e 1440 px**: todos os cenários passaram, sem overflow horizontal e sem erros de console/JavaScript.
- Teclado: Enter/Space nos disclosures, foco visível, foco contido nos diálogos e retorno ao botão de origem. Os títulos estáticos do desktop ficam fora da sequência de Tab.
- Todos os oito diálogos foram abertos e fechados em cada largura. As quatro rotas de coleção responderam HTTP 200.
- Voltar ao topo foi verificado com movimento reduzido, incluindo foco no logotipo.
- Transições removidas em `prefers-reduced-motion: reduce`; troca de breakpoint 375 → 768 → 375 verificada.
- Áreas interativas de pelo menos 44 px; summaries mobile de 56 px. A base permanece acima da navegação inferior, com espaço reservado.
- Contraste dos tokens usados: vinho/marfim **10,75:1**, grafite/marfim e marfim/grafite **13,88:1**, areia/grafite **7,86:1**. Esses cálculos verificam as combinações empregadas, sem substituir uma auditoria completa de acessibilidade.

Altura do footer fechado observada no viewport de 900 px: 647 px em 320, 627 px em 375/430, 624 px em 768 e 588 px em 1024/1440. As alturas incluem o espaço da navegação inferior quando ela está presente.

O script focado foi executado com Playwright já disponível no ambiente, sem adicionar dependência ao projeto. Capturas e resultados completos em `/tmp/eyewear-footer-qa/`. O script geral de motion recebeu somente a adaptação do trecho relacionado ao footer e não foi reexecutado como auditoria geral nesta etapa.

## Capturas para aprovação visual

- [Smartphone — 375 px](screenshots/footer-375.png)
- [Tablet — 768 px](screenshots/footer-768.png)
- [Desktop — 1440 px](screenshots/footer-1440.png)

As três capturas foram inspecionadas visualmente após o build. Confirmam a presença da marca, a reorganização responsiva, a base legal separada e a preservação da identidade vinho/marfim/grafite.

## Pendências reais

Não foram identificados problemas funcionais pendentes nos cenários testados. A comparação visual direta com a Adidas permaneceu limitada ao screenshot fornecido devido ao bloqueio HTTP 403. Recomenda-se a revisão final em aparelhos físicos e Safari/iOS; o navegador disponível para a validação automatizada foi Chromium. Não houve medição de Web Vitals de produção.

Sem commit, push ou deploy.
