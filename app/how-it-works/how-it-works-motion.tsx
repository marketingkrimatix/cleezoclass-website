'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotionDisabled } from '@/components/site/motion';

const motion = { duration: 0.58, distance: 16, stagger: 0.1, ease: 'power3.out' };
type Group = {
  selector: string;
  duration?: number;
  delay?: number;
  x?: number;
  scale?: number;
  opacityOnly?: boolean;
  float?: boolean;
};
const groups: Group[] = [
  { selector: '.how-hero h1', duration: 0.65 },
  { selector: '.how-hero-copy > p', delay: 0.14, duration: 0.5 },
  { selector: '.how-hero-copy > .how-action', delay: 0.25, duration: 0.42 },
  { selector: '.how-campus', scale: 0.975, duration: 0.7, opacityOnly: true },
  { selector: '.how-floating-card', duration: 0.65, float: true },
  { selector: '.how-brand-seal', opacityOnly: true },
  { selector: '.how-journey-strip > div', duration: 0.5 },
  { selector: '.how-section-conversation .how-section-heading' },
  { selector: '.how-section-conversation .how-section-copy > p' },
  { selector: '.how-section-conversation .how-section-art', scale: 0.96, opacityOnly: true },
  { selector: '.how-section-conversation li', x: -10 },
  { selector: '.how-section-conversation .how-action', duration: 0.42 },
  { selector: '.how-section-demo .how-section-heading' },
  { selector: '.how-section-demo .how-section-copy > p' },
  { selector: '.how-section-demo li' },
  { selector: '.how-section-demo .how-action', duration: 0.42 },
  { selector: '.refined-setup-intro' },
  { selector: '.refined-preparation', delay: 0.1 },
  { selector: '.refined-preparation tbody tr', opacityOnly: true, delay: 0.12 },
  { selector: '.how-section-connected-teams .how-section-heading' },
  { selector: '.how-section-connected-teams .how-section-copy > p' },
  { selector: '.how-section-connected-teams .how-table' },
  { selector: '.how-section-connected-teams tbody tr', opacityOnly: true, delay: 0.1 },
  { selector: '.school-showcase-heading' },
  { selector: '.school-showcase-feature', scale: 0.985 },
  { selector: '.school-showcase-row' },
  { selector: '.refined-faq-intro' },
  { selector: '.refined-faq' },
  { selector: '.how-section-book-a-demo .how-section-heading' },
  { selector: '.how-section-book-a-demo .how-section-copy > p', delay: 0.1 },
  { selector: '.how-section-book-a-demo .how-action', delay: 0.2, duration: 0.42 },
];

export function HowItWorksMotion() {
  const disabled = useMotionDisabled();
  const seen = useRef(new WeakSet<Element>());
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.how-page');
    if (!root || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const options = new Map<Element, Group>();
    for (const group of groups)
      root.querySelectorAll(group.selector).forEach((element) => options.set(element, group));
    const context = gsap.context(() => {}, root);
    let disposed = false;
    const allowed = () => !disabled && !reduced.matches && !root.closest('.motion-paused');
    // No pre-hiding: server HTML and unobserved content always remain readable.
    const observer = new IntersectionObserver(
      (entries) => {
        const batch = new Map<Group, number>();
        for (const entry of entries) {
          const element = entry.target;
          if (!entry.isIntersecting || seen.current.has(element)) continue;
          seen.current.add(element);
          observer.unobserve(element);
          if (!allowed()) continue;
          const group = options.get(element)!;
          const order = batch.get(group) || 0;
          batch.set(group, order + 1);
          context.add(() => {
            gsap.fromTo(
              element,
              {
                opacity: 0.35,
                ...(!group.opacityOnly && { y: group.x ? 0 : motion.distance, x: group.x || 0 }),
                ...(group.scale && { scale: group.scale }),
              },
              {
                opacity: 1,
                ...(!group.opacityOnly && { y: 0, x: 0 }),
                ...(group.scale && { scale: 1 }),
                duration: group.duration || motion.duration,
                delay: (group.delay || 0) + Math.min(order, 4) * motion.stagger,
                ease: motion.ease,
                clearProps: 'opacity,transform',
                onComplete: () => {
                  // Two decorative cards make one slow, tiny drift, then settle.
                  if (
                    disposed ||
                    !allowed() ||
                    !group.float ||
                    !element.matches('.how-floating-card-0,.how-floating-card-3')
                  )
                    return;
                  context.add(() =>
                    gsap.to(element, {
                      y: -3,
                      duration: element.matches('.how-floating-card-0') ? 1.6 : 1.8,
                      repeat: 1,
                      yoyo: true,
                      ease: 'sine.inOut',
                      clearProps: 'transform',
                    }),
                  );
                },
              },
            );
            if (element.matches('.how-hero h1')) {
              const ending = element.querySelector('span');
              if (ending)
                gsap.fromTo(
                  ending,
                  { opacity: 0.4 },
                  {
                    opacity: 1,
                    duration: 0.55,
                    delay: 0.1,
                    ease: motion.ease,
                    clearProps: 'opacity',
                  },
                );
            }
          });
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );
    options.forEach((_, element) => {
      if (!seen.current.has(element)) observer.observe(element);
    });
    const cancelDecorativeMotion = () => {
      if (reduced.matches) context.revert();
    };
    reduced.addEventListener('change', cancelDecorativeMotion);
    // Focusing an element immediately restores its complete, stationary content.
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      context.add(() =>
        options.forEach((_, element) => {
          if (!element.contains(event.target as Node)) return;
          seen.current.add(element);
          observer.unobserve(element);
          gsap.killTweensOf(element);
          gsap.set(element, { clearProps: 'opacity,transform' });
        }),
      );
    };
    root.addEventListener('focusin', focus);
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener('change', cancelDecorativeMotion);
      root.removeEventListener('focusin', focus);
      context.revert();
    };
  }, [disabled]);
  return null;
}
