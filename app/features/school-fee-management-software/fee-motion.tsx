'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionDisabled } from '@/components/site/motion';

export function FeeMotion() {
  const disabled = useMotionDisabled();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.fee-page');
    if (!root || disabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from(root.querySelectorAll('.fee-hero-copy > *'), {
          y: 20,
          opacity: 0,
          stagger: 0.075,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'all',
        });
        gsap.from(root.querySelector('.fee-visual-depth'), {
          y: 18,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          clearProps: 'all',
        });
        const stages = root.querySelectorAll('.fee-stages li');
        const recordFlow = gsap.timeline({ delay: 0.45 });
        recordFlow.from(stages, {
          x: 14,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });
        // Follow the fee record once, without a distracting recurring animation.
        stages.forEach((stage) => {
          recordFlow
            .to(stage, { borderColor: '#84CCAD', backgroundColor: '#e6f3ed', duration: 0.22 })
            .to(stage, { duration: 0.3, clearProps: 'backgroundColor,borderColor' }, '+=.1');
        });
        root.querySelectorAll<HTMLElement>('.fee-section').forEach((section) => {
          const heading = section.querySelector('.fee-section-head');
          if (heading)
            gsap.from(heading, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: 'power3.out',
              clearProps: 'all',
              scrollTrigger: { trigger: section, start: 'top 88%', once: true },
            });
          const body = section.querySelector('.fee-body');
          if (body)
            gsap.from(body, {
              y: 18,
              opacity: 0,
              duration: 0.7,
              delay: 0.08,
              ease: 'power3.out',
              clearProps: 'all',
              scrollTrigger: { trigger: body, start: 'top 92%', once: true },
            });
        });
        root
          .querySelectorAll<HTMLElement>('.fee-cards article, .fee-steps li')
          .forEach((item, i) => {
            gsap.from(item, {
              y: 24,
              opacity: 0,
              duration: 0.65,
              delay: (i % 3) * 0.06,
              ease: 'power3.out',
              clearProps: 'all',
              scrollTrigger: { trigger: item, start: 'top 94%', once: true },
            });
          });
      }, root);
      return () => context.revert();
    });
    // Pause, reduced motion, and navigation restore readable static content.
    return () => media.revert();
  }, [disabled]);
  return null;
}
