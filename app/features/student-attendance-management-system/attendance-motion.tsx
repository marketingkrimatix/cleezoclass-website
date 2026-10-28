'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionDisabled } from '@/components/site/motion';

export function AttendanceMotion() {
  const disabled = useMotionDisabled();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-attendance-page]');
    if (!root || disabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        root.querySelectorAll<HTMLElement>('[data-attendance-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 22,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          });
        });
        root.querySelectorAll<HTMLElement>('ul, ol, [data-attendance-group]').forEach((container) => {
          const children = container.querySelectorAll(':scope > [data-attendance-stagger]');
          if (!children.length) return;
          gsap.from(children, {
            y: 14,
            opacity: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: { trigger: container, start: 'top 92%', once: true },
          });
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [disabled]);
  return null;
}
