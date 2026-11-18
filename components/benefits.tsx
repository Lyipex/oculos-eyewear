import { CreditCard, Repeat2, ShieldCheck, Truck } from 'lucide-react';

const benefits = [
  { icon: Truck, label: 'Frete grátis', note: 'Na simulação' },
  { icon: ShieldCheck, label: 'Compra segura', note: 'Ambiente de demonstração' },
  { icon: CreditCard, label: 'Parcelamento', note: 'Condição ilustrativa' },
  { icon: Repeat2, label: 'Troca fácil', note: 'Política ilustrativa' },
];

export function Benefits() {
  return (
    <section className="benefits" aria-label="Benefícios ilustrativos">
      <ul className="shell">{benefits.map(({ icon: Icon, label, note }) => (
        <li key={label}><Icon size={26} strokeWidth={1.5} aria-hidden="true" />
          <div><strong>{label}</strong><p>{note}</p></div>
        </li>
      ))}</ul>
    </section>
  );
}
