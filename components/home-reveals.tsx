'use client';

import { useEffect } from 'react';

export function HomeReveals() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-once');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    // Content stays visible until observed; no dependency on hydration to read it.
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
