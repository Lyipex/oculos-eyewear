'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export function useHeaderPanelPosition(open: boolean, trigger: RefObject<HTMLButtonElement | null>) {
  const [position, setPosition] = useState({ headerBottom: 114, triggerBottom: 100, right: 16 });
  useLayoutEffect(() => {
    if (!open) return;
    const header = trigger.current?.closest('.site-header');
    const measure = () => {
      const rect = trigger.current?.getBoundingClientRect();
      const bottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 114);
      const next = { headerBottom: bottom, triggerBottom: (rect?.bottom ?? bottom) + 12, right: Math.max(16, window.innerWidth - (rect?.right ?? window.innerWidth - 16)) };
      setPosition((previous) => Object.keys(next).every((key) => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure); };
  }, [open, trigger]);
  return position;
}
