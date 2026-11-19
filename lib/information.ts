export const information = {
  faq: { slug: 'perguntas-frequentes', title: 'Perguntas frequentes', text: 'A ÓCULOS Eyewear é uma loja conceitual. Você pode explorar modelos, guardar favoritos e simular uma compra. Nenhum pedido ou pagamento é realizado.' },
  shipping: { slug: 'frete-e-entregas', title: 'Frete e entregas', text: 'O cálculo de frete e os prazos apresentados são ilustrativos. Use um CEP fictício para experimentar a simulação na página de produto. Não há envio de mercadorias.' },
  returns: { slug: 'trocas-e-devolucoes', title: 'Trocas e devoluções', text: 'Como não há vendas reais nesta versão, não existem solicitações de troca ou devolução. As referências a troca fácil fazem parte da demonstração da experiência de compra.' },
  sizes: { slug: 'guia-de-tamanhos', title: 'Guia de tamanhos', text: 'Os tamanhos P, M e G representam variações demonstrativas das armações. Não correspondem a medidas verificadas. Selecione um tamanho disponível na página do modelo para testar o carrinho.' },
  about: { slug: 'sobre-o-projeto', title: 'Sobre o projeto', text: 'ÓCULOS Eyewear é um projeto de portfólio com uma marca fictícia. Design, navegação, favoritos, carrinho e checkout demonstram uma experiência de e-commerce. Fotografias, avaliações, preços e condições são ilustrativos.' },
  privacy: { slug: 'privacidade', title: 'Privacidade', text: 'Favoritos e carrinho são salvos no armazenamento local deste navegador. O formulário de checkout é validado no navegador, sem envio dos dados a um serviço de pedidos. Use apenas dados fictícios. Esta versão não coleta cadastros nem inscrições em newsletter.' },
  terms: { slug: 'termos-de-uso', title: 'Termos de uso', text: 'Esta experiência é destinada à demonstração de um projeto de portfólio. Produtos e condições não constituem ofertas comerciais. Não há contratação, cobrança ou pedido real. Nenhum dado de pagamento é solicitado.' },
  contact: { slug: 'contato', title: 'Contato', text: 'O atendimento comercial não está disponível nesta loja conceitual. Para conversar sobre o projeto, utilize o contato informado no portfólio pelo qual você chegou até aqui. Esta demonstração não envia mensagens nem coleta seus dados.' },
} as const;

export type InformationTopic = keyof typeof information;
