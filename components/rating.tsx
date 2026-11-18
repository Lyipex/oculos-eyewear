import { Star } from 'lucide-react';

export function Rating({ value }: { value: number }) {
  return (
    <p className="rating">
      <Star size={14} aria-hidden="true" fill="currentColor" />
      <strong>{value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</strong>
      <span>Avaliação fictícia</span>
    </p>
  );
}
