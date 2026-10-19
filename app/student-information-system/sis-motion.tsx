'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionDisabled } from '@/components/site/motion';

export function SISMotion() {
  const disabled = useMotionDisabled();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.sis-page');
    if (!root || disabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.sis-hero-copy > *', {
          y: 28,
          opacity: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power3.out',
        });
        gsap.from('.sis-record-visual', {
          y: 65,
          scale: 0.94,
          opacity: 0,
          duration: 1.1,
          delay: 0.25,
          ease: 'power3.out',
        });
        gsap.from('.sis-satellite', {
          y: 30,
          opacity: 0,
          scale: 0.9,
          stagger: 0.13,
          duration: 0.8,
          delay: 0.55,
          ease: 'power3.out',
        });
        gsap.utils.toArray<HTMLElement>('.sis-section', root).forEach((section) => {
          gsap.from(section.querySelector('.sis-section-heading'), {
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 85%', once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>('.sis-feature', root).forEach((card, i) => {
          gsap.from(card, {
            y: 45,
            opacity: 0,
            duration: 0.8,
            delay: (i % 2) * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });
        });
        const journey = root.querySelector('.sis-journey-cards');
        if (journey) {
          gsap.from(journey.children, {
            y: 35,
            opacity: 0,
            stagger: 0.14,
            duration: 0.7,
            scrollTrigger: { trigger: journey, start: 'top 85%', once: true },
          });
        }
        gsap.from('.sis-migration-visual > span', {
          y: 24,
          opacity: 0,
          stagger: 0.18,
          duration: 0.7,
          scrollTrigger: { trigger: '.sis-migration-visual', start: 'top 85%', once: true },
        });
      }, root);
      return () => context.revert();
    });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          (entry.target as HTMLElement).dataset.sisVisible = String(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    root
      .querySelectorAll('.sis-stage,.sis-feature,.sis-migration-visual')
      .forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      media.revert();
      root
        .querySelectorAll('[data-sis-visible]')
        .forEach((el) => el.removeAttribute('data-sis-visible'));
    };
  }, [disabled]);
  return null;
}
