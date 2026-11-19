import Link from 'next/link';
import type { ComponentProps } from 'react';
import { information, type InformationTopic } from '@/lib/information';

type Props = Omit<ComponentProps<typeof Link>, 'href' | 'children'> & {
  topic: InformationTopic;
};

export function InformationLink({ topic, ...linkProps }: Props) {
  const { slug, title } = information[topic];
  return <Link {...linkProps} href={`/informacoes/${slug}`}>{title}</Link>;
}
