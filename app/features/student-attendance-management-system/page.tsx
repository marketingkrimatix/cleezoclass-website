import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  ChevronDown,
  Fingerprint,
  ClipboardCheck,
  Radio,
  MessageSquare,
  FileChartColumn,
  Users,
  CalendarDays,
  FileDown,
  Mail,
} from 'lucide-react';
import copy from '@/content/student-attendance.json';
import { Action } from '@/components/site/ui';
import styles from './attendance.module.css';
import { AttendanceMotion } from './attendance-motion';

// Indexing inherits the site's production/preview environment policy.
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical: copy.metadata.canonical },
  openGraph: {
    title: copy.metadata.title,
    description: copy.metadata.description,
    url: copy.metadata.canonical,
    type: 'website',
    siteName: 'Cleezo Class',
  },
  twitter: { card: 'summary', title: copy.metadata.title, description: copy.metadata.description },
};

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*)/g).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <Link key={i} href={link[2]}>
              <Inline text={link[1]} />
            </Link>
          );
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
function Block({ text }: { text: string }) {
  if (text.startsWith('### ')) return <h3>{text.slice(4)}</h3>;
  if (/^\*\*(Primary CTA|Secondary CTA|CTA):/.test(text)) {
    const links = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    return (
      <div className={styles.actions}>
        {links.map((m, i) => (
          <Action key={m[2]} href={m[2]} secondary={i > 0}>
            {m[1]}
          </Action>
        ))}
      </div>
    );
  }
  if (/^\d+\. /.test(text))
    return (
      <ol className={styles.checklist}>
        {text.split('\n').map((line) => (
          <li key={line}>
            <Inline text={line.replace(/^\d+\. /, '')} />
          </li>
        ))}
      </ol>
    );
  return (
    <p>
      <Inline text={text} />
    </p>
  );
}
function groups(blocks: string[]) {
  const result: { title: string; blocks: string[] }[] = [];
  blocks.forEach((block) => {
    if (block.startsWith('### ')) result.push({ title: block.slice(4), blocks: [] });
    else result.at(-1)?.blocks.push(block);
  });
  return result;
}
export default function StudentAttendancePage() {
  const [hero, ...sections] = copy.sections;
  const highlights = hero.blocks
    .find((b) => b.startsWith('**Capability highlights:**'))!
    .replace('**Capability highlights:** ', '')
    .split(' · ');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.cleezoclass.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Student Attendance Management System',
        item: copy.metadata.canonical,
      },
    ],
  };
  return (
    <main id="main" className={styles.page} data-attendance-page>
      <AttendanceMotion />
      <div className={styles.opening}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Student attendance management system</span>
        </nav>
        <header className={styles.hero}>
          <div className={styles.heroHeading} data-attendance-reveal>
            <p className={styles.eyebrow}>{hero.blocks[0].replace('**Eyebrow:** ', '')}</p>
            <h1>{hero.blocks[1].replace(/^# /, '')}</h1>
            <div className={styles.heroCopy}>
              {hero.blocks
                .slice(2)
                .filter((b) => !b.startsWith('**Capability highlights:**'))
                .map((b) => (
                  <Block key={b} text={b} />
                ))}
            </div>
          </div>
          <div className={styles.capabilityScene} data-attendance-reveal>
            <div className={styles.orbit} aria-hidden="true">
              <Fingerprint size={62} strokeWidth={1.2} />
            </div>
            <ul className={styles.highlights}>
              {highlights.map((h, i) => {
                const Icon = [ClipboardCheck, Users, Radio, MessageSquare, FileChartColumn][i];
                return (
                  <li key={h} data-attendance-stagger>
                    <span className={styles.capabilityIcon}>
                      <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span>{h}</span>
                    <span className={styles.capabilityNumber} aria-hidden="true">
                      0{i + 1}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </header>
      </div>
      {sections.map((section, index) => {
        const faq = section.title === 'Student attendance management FAQs';
        const workflow = section.title === 'How the attendance workflow fits together';
        const reporting = section.title === 'Attendance review, student information and reporting';
        const closing = index === sections.length - 1;
        const devices = index === 2;
        const evaluation = index === 5;
        return (
          <section
            key={section.title}
            className={`${styles.section} ${closing ? styles.closing : ''} ${workflow ? styles.workflowSection : ''} ${reporting ? styles.reportingSection : ''} ${devices ? styles.devicesSection : ''} ${evaluation ? styles.evaluationSection : ''} ${faq ? styles.faqSection : ''}`}
            aria-labelledby={`attendance-section-${index}`}
          >
            <div className={styles.sectionInner}>
              <div className={styles.sectionHeading} data-attendance-reveal>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 id={`attendance-section-${index}`}>{section.title}</h2>
              </div>
              <div className={styles.body} data-attendance-reveal>
                {faq ? (
                  <div className={styles.faqs}>
                    {groups(section.blocks).map((item) => (
                      <details key={item.title}>
                        <summary>
                          {item.title}
                          <ChevronDown size={19} aria-hidden="true" />
                        </summary>
                        <div>
                          {item.blocks.map((b) => (
                            <Block key={b} text={b} />
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : reporting ? (
                  <div className={styles.reports} data-attendance-group>
                    {groups(section.blocks).map((item, i) => (
                      <article key={item.title} data-attendance-stagger>
                        <span className={styles.reportIcon} aria-hidden="true">
                          {
                            [
                              <ClipboardCheck key="register" />,
                              <FileDown key="exports" />,
                              <Users key="records" />,
                              <FileChartColumn key="cards" />,
                              <MessageSquare key="updates" />,
                            ][i]
                          }
                        </span>
                        <div>
                          <h3>{item.title}</h3>
                          {item.blocks.map((b) => (
                            <Block key={b} text={b} />
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : workflow ? (
                  <ol className={styles.workflow}>
                    {section.blocks.map((b) => {
                      const [heading, ...body] = b.split('\n');
                      return (
                        <li key={b} data-attendance-stagger>
                          <span className={styles.workflowIcon} aria-hidden="true">
                            <CalendarDays size={24} />
                          </span>
                          <h3>{heading.replace(/^\*\*\d+\. /, '').replace(/\*\*\s*$/, '')}</h3>
                          <p>{body.join(' ').trim()}</p>
                        </li>
                      );
                    })}
                  </ol>
                ) : devices ? (
                  <>
                    <div className={styles.deviceIntro}>
                      {section.blocks.slice(0, 1).map((b) => (
                        <Block key={b} text={b} />
                      ))}
                    </div>
                    <div className={styles.deviceSteps} data-attendance-group>
                      {groups(section.blocks).map((item, i) => (
                        <article key={item.title} data-attendance-stagger>
                          <span aria-hidden="true">
                            {i === 0 ? (
                              <Radio size={24} strokeWidth={1.6} />
                            ) : i === 1 ? (
                              <ClipboardCheck size={24} strokeWidth={1.6} />
                            ) : (
                              <Fingerprint size={24} strokeWidth={1.6} />
                            )}
                          </span>
                          <div>
                            <h3>{item.title}</h3>
                            {item.blocks
                              .filter((b) => !b.startsWith('**CTA:'))
                              .map((b) => (
                                <Block key={b} text={b} />
                              ))}
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className={styles.deviceNote}>
                      <div>
                        {section.blocks
                          .slice(
                            1,
                            section.blocks.findIndex((b) => b.startsWith('### ')),
                          )
                          .map((b) => (
                            <Block key={b} text={b} />
                          ))}
                      </div>
                      {section.blocks
                        .filter((b) => b.startsWith('**CTA:'))
                        .flatMap((b) => [...b.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)])
                        .map((link) => (
                          <a key={link[2]} href={link[2]} className={styles.deviceEmail}>
                            <Mail size={20} strokeWidth={1.7} aria-hidden="true" />
                            <span>{link[1]}</span>
                          </a>
                        ))}
                    </div>
                  </>
                ) : (
                  section.blocks.map((b) => <Block key={b} text={b} />)
                )}
              </div>
            </div>
          </section>
        );
      })}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
