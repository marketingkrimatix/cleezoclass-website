import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  GraduationCap,
  MessageSquare,
  Users,
  Wallet,
} from 'lucide-react';
import copy from '@/content/student-information-system.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { FAQs } from '@/components/site/experience';
import { SISMotion } from './sis-motion';
import './sis.css';

const canonical = siteOrigin + '/student-information-system/';
const socialImage = {
  url: '/student-information-system-og.png',
  width: 1200,
  height: 630,
  alt: 'Cleezo Class — one connected record for every student',
};
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical },
  openGraph: {
    ...copy.metadata,
    url: canonical,
    siteName: 'Cleezo Class',
    type: 'website',
    locale: 'en_IN',
    images: [socialImage],
  },
  twitter: { ...copy.metadata, card: 'summary_large_image', images: [socialImage.url] },
};
type Block = { type: string; text?: string; items?: string[]; rows?: string[][] };
const sections: { title: string; blocks: Block[] }[] = copy.sections;
const ids = [
  'what-is-sis',
  'student-journey',
  'student-records',
  'school-teams',
  'record-migration',
  'school-groups',
  'evaluate-sis',
  'sis-faqs',
  'sis-demo',
];
const icons = [ClipboardList, Users, Check, GraduationCap, Wallet, MessageSquare];
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
        if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link && link[2].startsWith('/') && !link[2].startsWith('//'))
          return (
            <Link key={index} href={link[2]}>
              {link[1]}
            </Link>
          );
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'cta')
          return (
            <div className="sis-action" key={i}>
              <Action
                href={b.text === 'Log In' ? 'https://cleezoclass.com/CRM' : '/book-demo/'}
                secondary={b.text === 'Log In'}
              >
                {b.text}
              </Action>
            </div>
          );
        if (b.type === 'ordered')
          return (
            <ol className="sis-steps" key={i}>
              {b.items?.map((item) => (
                <li key={item}>
                  <Check className="sis-question-check" size={21} aria-hidden="true" />
                  <Inline text={item} />
                </li>
              ))}
            </ol>
          );
        if (b.type === 'table')
          return (
            <div className="sis-table" key={i}>
              <table>
                <caption className="sr-only">
                  Student information and workflows by school team
                </caption>
                <thead>
                  <tr>
                    {b.rows?.[0].map((cell) => (
                      <th key={cell} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows?.slice(1).map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <p key={i}>
            <Inline text={b.text || ''} />
          </p>
        );
      })}
    </>
  );
}
const journeyStages = [
  { icon: ClipboardList, title: 'Capture the enquiry', label: 'Admissions' },
  { icon: Users, title: 'Welcome the student', label: 'Enrolment' },
  { icon: Wallet, title: 'Connect their fee record', label: 'Accounts' },
  { icon: GraduationCap, title: 'Follow their school day', label: 'Academics' },
  { icon: MessageSquare, title: 'Keep families informed', label: 'Parent access' },
];
function StudentJourney({ blocks }: { blocks: Block[] }) {
  return (
    <div className="sis-section-body">
      {blocks.map((block, index) =>
        block.type === 'ordered' ? (
          <ol className="sis-journey-cards" key={index}>
            {block.items?.map((text, i) => {
              const { icon: Icon, title, label } = journeyStages[i];
              return (
                <li key={title}>
                  <span className="sis-journey-icon">
                    <Icon size={26} aria-hidden="true" />
                  </span>
                  <span className="sis-journey-label">{label}</span>
                  <h3>{title}</h3>
                  <p>
                    <Inline text={text} />
                  </p>
                </li>
              );
            })}
          </ol>
        ) : (
          <Blocks key={index} blocks={[block]} />
        ),
      )}
    </div>
  );
}
function groups(blocks: Block[]) {
  const result: { title: string; blocks: Block[] }[] = [];
  for (const block of blocks) {
    if (block.type === 'heading') result.push({ title: block.text!, blocks: [] });
    else if (block.type !== 'cta') result.at(-1)?.blocks.push(block);
  }
  return result;
}
function StudentRecord() {
  return (
    <figure className="sis-record-visual" aria-label="Illustrative connected student record">
      <div className="sis-visual-top">
        <span>
          <span className="sis-status-dot" /> CONNECTED STUDENT RECORD
        </span>
      </div>
      <div className="sis-profile">
        <span className="sis-avatar">
          <GraduationCap size={34} aria-hidden="true" />
        </span>
        <div>
          <span className="sis-overline">STUDENT PROFILE</span>
          <strong>Aarav S.</strong>
          <span>Class 6A · Student ID CC-0624</span>
        </div>
        <span className="sis-badge">Enrolled</span>
      </div>
      <div className="sis-record-grid">
        {[
          { icon: ClipboardList, title: 'Admissions', detail: 'Enquiry → enrolled' },
          { icon: Check, title: 'Attendance', detail: 'Today · Present' },
          { icon: BookOpen, title: 'Academics', detail: 'Term report available' },
          { icon: Wallet, title: 'Fee status', detail: 'Receipt available' },
        ].map(({ icon: Icon, title, detail }) => (
          <div key={title}>
            <Icon size={20} aria-hidden="true" />
            <strong>{title}</strong>
            <span>{detail}</span>
          </div>
        ))}
      </div>
      <div className="sis-parent-update">
        <MessageSquare size={21} aria-hidden="true" />
        <div>
          <strong>Parent access</strong>
          <span>Fee status, report cards & school updates</span>
        </div>
        <ArrowRight size={19} aria-hidden="true" />
      </div>
      <figcaption>Illustrative student record · Sample data</figcaption>
    </figure>
  );
}
function MiniPreview({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="sis-mini sis-admission-flow">
        <span>Enquiry</span>
        <ArrowRight size={16} />
        <span>Accepted</span>
        <ArrowRight size={16} />
        <strong>Enrolled</strong>
      </div>
    );
  if (index === 1)
    return (
      <div className="sis-mini sis-directory">
        <span className="sis-initial">AS</span>
        <div>
          <strong>Aarav S.</strong>
          <span>Class 6A · Student profile</span>
        </div>
        <Check size={18} />
      </div>
    );
  if (index === 2)
    return (
      <div className="sis-mini sis-register">
        <span>Weekly attendance</span>
        <div>
          {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
            <span key={i}>
              {day}
              <Check size={16} />
            </span>
          ))}
        </div>
      </div>
    );
  if (index === 3)
    return (
      <div className="sis-mini sis-report">
        <span>Term report · Class 6A</span>
        {[
          ['Mathematics', '86%'],
          ['Science', '91%'],
          ['English', '88%'],
        ].map(([subject, width]) => (
          <div key={subject}>
            <span>{subject}</span>
            <i>
              <span style={{ width }} />
            </i>
          </div>
        ))}
      </div>
    );
  if (index === 4)
    return (
      <div className="sis-mini sis-receipt">
        <Wallet size={22} />
        <div>
          <strong>Tuition fee</strong>
          <span>Receipt CC-1024</span>
        </div>
        <span className="sis-badge">Recorded</span>
      </div>
    );
  return (
    <div className="sis-mini sis-message">
      <MessageSquare size={21} />
      <div>
        <strong>School update</strong>
        <span>Your digital report card is available for review.</span>
      </div>
    </div>
  );
}
export default function StudentInformationSystemPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
      { '@type': 'ListItem', position: 2, name: 'Student information system', item: canonical },
    ],
  };
  return (
    <main id="main" className="sis-page">
      <SISMotion />
      <div className="sis-opening">
        <nav className="wrap sis-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Student information system</span>
        </nav>
        <section className="wrap sis-hero">
          <div className="sis-hero-copy">
            <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.description}</p>
            <div className="sis-actions">
              <Action>{copy.hero.primary}</Action>
              <Action href="/school-erp-software/" secondary>
                {copy.hero.secondary}
              </Action>
            </div>
          </div>
          <div className="sis-stage">
            <div className="sis-stage-orbit" aria-hidden="true" />
            <svg
              className="sis-connections"
              viewBox="0 0 1200 520"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M170 120 C340 120 290 180 420 180 M1030 120 C860 120 910 180 780 180 M170 395 C340 395 290 350 420 350 M1030 395 C860 395 910 350 780 350" />
              <path
                className="sis-connection-signal"
                d="M170 120 C340 120 290 180 420 180 M1030 120 C860 120 910 180 780 180 M170 395 C340 395 290 350 420 350 M1030 395 C860 395 910 350 780 350"
              />
            </svg>
            <div className="sis-satellite sis-satellite-admissions">
              <ClipboardList size={22} />
              <span>
                Front desk<strong>Enquiry becomes enrolment</strong>
              </span>
              <Check size={15} />
            </div>
            <div className="sis-satellite sis-satellite-academics">
              <GraduationCap size={22} />
              <span>
                Academics<strong>Progress, in one place</strong>
              </span>
              <Check size={15} />
            </div>
            <StudentRecord />
            <div className="sis-satellite sis-satellite-accounts">
              <Wallet size={22} />
              <span>
                Accounts<strong>Fees linked to the student</strong>
              </span>
              <Check size={15} />
            </div>
            <div className="sis-satellite sis-satellite-parents">
              <MessageSquare size={22} />
              <span>
                Families<strong>A clearer school update</strong>
              </span>
              <Check size={15} />
            </div>
          </div>
        </section>
        <div className="wrap">
          <p className="sis-capabilities">{copy.hero.strip}</p>
        </div>
      </div>
      {sections.map((section, index) => (
        <section
          key={ids[index]}
          id={ids[index]}
          className={'sis-section sis-section-' + ids[index]}
          aria-labelledby={ids[index] + '-title'}
        >
          <div className="wrap">
            <div className="sis-section-heading">
              <h2 id={ids[index] + '-title'}>{section.title}</h2>
            </div>
            {index === 1 ? (
              <StudentJourney blocks={section.blocks} />
            ) : index === 2 ? (
              <>
                <div className="sis-features">
                  {groups(section.blocks).map((card, i) => {
                    const Icon = icons[i];
                    return (
                      <article className="sis-feature" key={card.title}>
                        <div className="sis-feature-top">
                          <div className="sis-feature-icon">
                            <Icon size={23} aria-hidden="true" />
                          </div>
                        </div>
                        <h3>{card.title}</h3>
                        <Blocks blocks={card.blocks} />
                        <MiniPreview index={i} />
                      </article>
                    );
                  })}
                </div>
                <p className="sis-illustration-note">
                  Illustrative workflow previews · Sample data
                </p>
                <Blocks blocks={section.blocks.filter((b) => b.type === 'cta')} />
              </>
            ) : index === 7 ? (
              <FAQs
                items={groups(section.blocks).map((card) => [
                  card.title,
                  <span key={card.title}>
                    {card.blocks.map((b, i) => (
                      <Fragment key={i}>
                        {i > 0 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                        <Inline text={b.text || ''} />
                      </Fragment>
                    ))}
                  </span>,
                ])}
              />
            ) : (
              <div className="sis-section-body">
                {index === 4 && (
                  <div className="sis-migration-visual" aria-hidden="true">
                    <span>
                      <ClipboardList />
                      Existing records
                    </span>
                    <i />
                    <span>
                      <Check />
                      Review & validate
                    </span>
                    <i />
                    <span>
                      <Users />
                      Connected students
                    </span>
                  </div>
                )}
                <Blocks blocks={section.blocks} />
              </div>
            )}
          </div>
        </section>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
