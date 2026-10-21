'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  MessageSquare,
  Quote,
  Users,
} from 'lucide-react';
import { useMotionDisabled } from './motion';
import styles from './home-brand-sections.module.css';

export type SchoolTestimonial = { quote: string; name: string; role: string; portrait?: string };

export function StudentSpotlight() {
  const paused = useMotionDisabled();
  return (
    <section
      className={styles.spotlight}
      aria-labelledby="student-spotlight-title"
      data-paused={paused}
    >
      <div className={styles.inner}>
        <figure className={styles.studentScene}>
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.ring} aria-hidden="true" />
          <Image
            className={styles.student}
            src="/cleezo-student-cutout.png"
            width={1024}
            height={1536}
            alt="An Indian school student smiling with her books and backpack"
          />
          <span className={styles.studentLabel}>
            <BookOpen size={18} /> More room for learning.
          </span>
          <figcaption className={styles.imageCaption}>Illustrative student image</figcaption>
        </figure>
        <div className={styles.introduction}>
          <span className={styles.eyebrow}>THE SCHOOL DAY, CONNECTED</span>
          <h2 id="student-spotlight-title">
            Behind every student.
            <br />
            <em>A connected school.</em>
          </h2>
          <p>
            Cleezo Class brings admissions, attendance, academics, fees and communication into one
            school management platform — so your team can keep the work around learning organised.
          </p>
          <div className={styles.preview} aria-label="Illustrative Cleezo Class workflow overview">
            <div className={styles.previewBar}>
              <Image
                className={styles.previewLogo}
                src="/cleezoclass-full-logo.png"
                width={754}
                height={268}
                sizes="120px"
                alt="Cleezo Class"
              />
              <span>Connected workflows</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewHeading}>
                <span>YOUR SCHOOL DAY</span>
                <BookOpen size={19} />
              </div>
              <h3>A clearer view. A shared context.</h3>
              <div className={styles.workflowRows}>
                {[
                  [Users, 'Admissions', 'Student records'],
                  [CalendarDays, 'Attendance', 'Class registers'],
                  [MessageSquare, 'Communication', 'School updates'],
                ].map(([Icon, title, detail]) => {
                  const I = Icon as typeof Users;
                  return (
                    <div key={String(title)}>
                      <span className={styles.workflowIcon}>
                        <I size={19} />
                      </span>
                      <span>
                        <strong>{String(title)}</strong>
                        <small>{String(detail)}</small>
                      </span>
                      <Check size={16} />
                    </div>
                  );
                })}
              </div>
              <div className={styles.previewFoot}>
                <span className={styles.statusDot} /> One school. Connected teams.
              </div>
            </div>
            <span className={styles.previewCaption}>
              Illustrative workflow, not a product screenshot.
            </span>
          </div>
          <div className={styles.actions}>
            <Link href="/platform/">
              Explore Cleezo Class <ArrowUpRight size={18} />
            </Link>
            <span>Built around your school day.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Render only approved endorsements, with the speaker's exact association title.
export function SchoolVoices({ testimonials }: { testimonials: SchoolTestimonial[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const paused = useMotionDisabled();
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = root.current;
    const accordion = element?.querySelector<HTMLElement>(`.${styles.voiceAccordion}`);
    if (!accordion) return;
    let live = true;
    const measure = () => {
      if (!live) return;
      const width = accordion.clientWidth;
      const mobile = window.matchMedia('(max-width:700px)').matches;
      const gap = parseFloat(getComputedStyle(accordion).gap) || 0;
      const quoteWidth = mobile ? width - 2 : ((width - gap * 2) * 2.15) / 4.15 - 2;
      accordion.style.setProperty('--quote-width', `${quoteWidth}px`);
      const heights = Array.from(
        accordion.querySelectorAll<HTMLElement>(`.${styles.voiceQuote}`),
        (quote) => quote.scrollHeight,
      );
      accordion.style.setProperty('--quote-height', `${Math.max(...heights) + 2}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(accordion);
    measure();
    document.fonts.ready.then(measure);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [testimonials]);
  if (!testimonials.length) return null;
  return (
    <section
      ref={root}
      className={styles.voices}
      aria-labelledby="school-voices-title"
      data-visible={visible}
      data-paused={paused}
    >
      <div className={styles.voicesInner}>
        <header className={styles.voicesHeading}>
          <span className={styles.eyebrow}>CLEEZO CLASS / SCHOOL VOICES</span>
          <h2 id="school-voices-title">
            From the people
            <br />
            <em>behind the school day.</em>
          </h2>
        </header>
        <div className={styles.voiceAccordion}>
          {testimonials.slice(0, 3).map((item, index) => (
            <article className={styles.voicePanel} data-active={active === index} key={item.name}>
              <button
                className={styles.voiceSelect}
                aria-expanded={active === index}
                aria-controls={`school-quote-${index}`}
                onClick={() => setActive(index)}
              >
                <span className={styles.voicePortrait}>
                  {item.portrait && (
                    <Image
                      src={item.portrait}
                      width={1122}
                      height={1402}
                      sizes="(max-width: 700px) 100vw, 400px"
                      alt=""
                    />
                  )}
                </span>
                <span className={styles.voiceIdentity}>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                  <small>
                    {active === index ? 'Selected perspective' : 'Read perspective'}{' '}
                    <ArrowUpRight size={14} />
                  </small>
                </span>
              </button>
              <figure
                id={`school-quote-${index}`}
                className={styles.voiceQuote}
                hidden={active !== index}
              >
                <Quote size={36} className={styles.quoteIcon} aria-hidden="true" />
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  {item.portrait && <Image src={item.portrait} width={84} height={84} alt="" />}
                  <span>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
        <Link className={styles.voicesCta} href="/book-demo/">
          Explore Cleezo Class for your school <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
