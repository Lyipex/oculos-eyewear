'use client';

import { CalendarDays, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const metrics = [
  { label: 'Tempo de mercado', value: 3, unit: 'anos', Icon: CalendarDays },
  { label: 'Vendas realizadas', value: 1240, Icon: ShoppingBag },
  { label: 'Clientes satisfeitos', value: 980, Icon: Heart },
];

const formatter = new Intl.NumberFormat('pt-BR');
const formatNumber = (value: number) => formatter.format(value);

export function ReviewMetrics() {
  const list = useRef<HTMLDListElement>(null);
  // The server and reduced-motion view show the final values.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const target = list.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!target || motion.matches || !('IntersectionObserver' in window)) return;

    const visibilityThreshold = 0.35;
    let frame = 0;
    let start: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < visibilityThreshold) return;
      observer.disconnect();
      frame = requestAnimationFrame(count);
    }, { threshold: visibilityThreshold });

    function count(now: number) {
      start ??= now;
      const elapsed = Math.min((now - start) / 1600, 1);
      setProgress(1 - (1 - elapsed) ** 3);
      if (elapsed < 1) frame = requestAnimationFrame(count);
    }

    function stopIfReduced() {
      if (!motion.matches) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      setProgress(1);
    }

    observer.observe(target);
    motion.addEventListener('change', stopIfReduced);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', stopIfReduced);
    };
  }, []);

  return (
    <section className="review-metrics" aria-labelledby="review-metrics-title" aria-describedby="review-metrics-note">
      <h3 id="review-metrics-title">Uma história em números</h3>
      <dl ref={list}>
        {metrics.map(({ label, value, unit, Icon }) => (
          <div key={label} className="review-metric">
            <dt>{label}</dt>
            <dd>
              <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
              <span className="review-metric-value" aria-hidden="true">
                {formatNumber(Math.floor(value * progress))}
                {unit && <span className="review-metric-unit"> {unit}</span>}
              </span>
              <span className="sr-only">{formatNumber(value)}{unit ? ` ${unit}` : ''}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p id="review-metrics-note">Indicadores fictícios para demonstração.</p>
    </section>
  );
}
