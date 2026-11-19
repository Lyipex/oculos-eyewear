'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const information = {
  faq: { title: 'Perguntas frequentes', text: 'A ÓCULOS Eyewear é uma loja conceitual. Você pode explorar modelos, guardar favoritos e simular uma compra. Nenhum pedido ou pagamento é realizado.' },
  shipping: { title: 'Frete e entregas', text: 'O cálculo de frete e os prazos apresentados são ilustrativos. Use um CEP fictício para experimentar a simulação na página de produto. Não há envio de mercadorias.' },
  returns: { title: 'Trocas e devoluções', text: 'Como não há vendas reais nesta versão, não existem solicitações de troca ou devolução. As referências a troca fácil fazem parte da demonstração da experiência de compra.' },
  sizes: { title: 'Guia de tamanhos', text: 'Os tamanhos P, M e G representam variações demonstrativas das armações. Não correspondem a medidas verificadas. Selecione um tamanho disponível na página do modelo para testar o carrinho.' },
  about: { title: 'Sobre o projeto', text: 'ÓCULOS Eyewear é um projeto de portfólio com uma marca fictícia. Design, navegação, favoritos, carrinho e checkout demonstram uma experiência de e-commerce. Fotografias, avaliações, preços e condições são ilustrativos.' },
  privacy: { title: 'Privacidade', text: 'Favoritos e carrinho são salvos no armazenamento local deste navegador. O formulário de checkout é validado no navegador, sem envio dos dados a um serviço de pedidos. Use apenas dados fictícios. Esta versão não coleta cadastros nem inscrições em newsletter.' },
  terms: { title: 'Termos de uso', text: 'Esta experiência é destinada à demonstração de um projeto de portfólio. Produtos e condições não constituem ofertas comerciais. Não há contratação, cobrança ou pedido real. Nenhum dado de pagamento é solicitado.' },
  contact: { title: 'Contato', text: 'O atendimento comercial não está disponível nesta loja conceitual. Para conversar sobre o projeto, utilize o contato informado no portfólio pelo qual você chegou até aqui. Esta demonstração não envia mensagens nem coleta seus dados.' },
} as const;

export type InformationTopic = keyof typeof information;

export function InformationDialog({ topic, presentation = 'dialog' }: { topic: InformationTopic; presentation?: 'dialog' | 'disclosure' }) {
  const content = information[topic];
  if (presentation === 'disclosure') return (
    <details className="information-disclosure">
      <summary className="information-link">{content.title}</summary>
      <p>{content.text}</p>
    </details>
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger className="information-link">{content.title}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="header-dialog information-dialog">
          <div className="drawer-head">
            <Dialog.Title>{content.title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label={`Fechar ${content.title.toLowerCase()}`}><X size={22} aria-hidden="true" /></Dialog.Close>
          </div>
          <Dialog.Description>{content.text}</Dialog.Description>
          <p className="muted">Projeto conceitual · Experiência demonstrativa</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
