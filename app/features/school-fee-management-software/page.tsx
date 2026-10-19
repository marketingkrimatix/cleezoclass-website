import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  Wallet,
  Receipt,
  Users,
  ListChecks,
  BadgePercent,
  ClipboardList,
  Plus,
} from 'lucide-react';
import copy from '@/content/fee-management.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { FeeMotion } from './fee-motion';
import './fees.css';

const canonical = `${siteOrigin}/features/school-fee-management-software/`;
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
  },
  twitter: { ...copy.metadata, card: 'summary' },
};
type Block = { type: string; text?: string; href?: string; items?: string[] };
// Public copy from docs/cleezo_school_fee_management_software_final_public_copy.md.
const sections: { title: string; blocks: Block[] }[] = copy.sections;
const ids = [
  'connected-fee-records',
  'fee-capabilities',
  'school-fee-collection',
  'payment-recording',
  'fee-workflow',
  'evaluate-fee-management',
  'fee-faqs',
  'fee-demo',
];
const icons = [ClipboardList, BadgePercent, Wallet, Receipt, ListChecks, Users];
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
        return link && !link[2].startsWith('//') ? (
          <Link key={i} href={link[2]}>
            {link[1]}
          </Link>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'cta')
          return (
            <div className="fee-actions" key={i}>
              <Action href={block.href}>{block.text}</Action>
            </div>
          );
        if (block.type === 'ordered')
          return (
            <ol className="fee-steps" key={i}>
              {block.items?.map((item, j) => {
                const Icon = icons[j];
                return (
                  <li key={item}>
                    <div className="fee-step-visual" aria-hidden="true">
                      <span className="fee-step-count">{String(j + 1).padStart(2, '0')}</span>
                      <span className="fee-step-symbol">
                        <Icon size={32} strokeWidth={1.5} />
                      </span>
                    </div>
                    <p>{item}</p>
                  </li>
                );
              })}
            </ol>
          );
        return (
          <p key={i}>
            <Inline text={block.text || ''} />
          </p>
        );
      })}
    </>
  );
}
function groups(blocks: Block[]) {
  const result: { title: string; blocks: Block[] }[] = [];
  for (const block of blocks) {
    if (block.type === 'heading') result.push({ title: block.text!, blocks: [] });
    else result.at(-1)?.blocks.push(block);
  }
  return result;
}
function FeeIllustration() {
  return (
    <figure className="fee-journey fee-illustration">
      <div className="fee-journey-top">
        <span>
          <Wallet size={23} aria-hidden="true" />
          Connected fee records
        </span>
        <span className="fee-sample">Illustrative workflow</span>
      </div>
      <div className="fee-record">
        <span className="fee-avatar">
          <Users size={26} aria-hidden="true" />
        </span>
        <div>
          <span className="fee-overline">STUDENT FEE ACCOUNT</span>
          <strong>One student. Connected records.</strong>
        </div>
      </div>
      <ol className="fee-stages">
        {[
          'Class-wise fee heads',
          'Applicable concessions',
          'Recorded payments',
          'Outstanding dues',
          'Fee receipts',
        ].map((label, i) => (
          <li key={label}>
            <span className="fee-stage-icon">
              <span>0{i + 1}</span>
            </span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
      <div className="fee-methods">
        {['Cash', 'UPI', 'Cheque', 'Bank transfer'].map((method) => (
          <span key={method}>{method}</span>
        ))}
      </div>
      <figcaption>Payment-recording workflow illustration, not a product screenshot.</figcaption>
    </figure>
  );
}
export default function FeeManagementPage() {
  const faqs = groups(sections[6].blocks);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
          { '@type': 'ListItem', position: 2, name: copy.hero.title, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.title,
          acceptedAnswer: { '@type': 'Answer', text: faq.blocks.map((b) => b.text).join(' ') },
        })),
      },
    ],
  };
  return (
    <main id="main" className="fee-page">
      <FeeMotion />
      <div className="fee-opening">
        <nav className="wrap fee-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">School fee management software</span>
        </nav>
        <section className="wrap fee-hero">
          <div className="fee-hero-copy">
            <Eyebrow>Connected school finance</Eyebrow>
            <h1>{copy.hero.title}</h1>
            <p className="fee-subtitle">{copy.hero.subtitle}</p>
            {copy.hero.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="fee-actions">
              <Action href="/book-demo/">Book a Demo</Action>
              <Action href="/school-erp-software/" secondary>
                Explore School ERP Software
              </Action>
            </div>
          </div>
          <div className="fee-visual-depth">
            <FeeIllustration />
          </div>
        </section>
      </div>
      {sections.map((section, i) => (
        <section
          className={`fee-section fee-${ids[i]}`}
          id={ids[i]}
          key={ids[i]}
          aria-labelledby={`${ids[i]}-title`}
        >
          <div className="wrap fee-section-layout">
            <div className="fee-section-head">
              <span className="fee-section-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 id={`${ids[i]}-title`}>{section.title}</h2>
            </div>
            {i === 1 ? (
              <div className="fee-cards">
                {groups(section.blocks).map((card, j) => {
                  const Icon = icons[j];
                  return (
                    <article key={card.title}>
                      <div className="fee-card-top">
                        <span className="fee-icon">
                          <Icon size={24} aria-hidden="true" />
                        </span>
                        <span className="fee-card-number" aria-hidden="true">
                          {String(j + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3>{card.title}</h3>
                      <Blocks blocks={card.blocks} />
                    </article>
                  );
                })}
              </div>
            ) : i === 6 ? (
              <div className="fee-faq-list">
                {faqs.map((faq, index) => (
                  <details
                    key={faq.title}
                    className="fee-faq"
                    name="fee-questions"
                    open={index === 0}
                  >
                    <summary>
                      <span className="fee-question-number" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3>{faq.title}</h3>
                      <span className="fee-question-toggle">
                        <Plus size={18} aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="fee-faq-answer">
                      <Blocks blocks={faq.blocks} />
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="fee-body">
                <Blocks blocks={section.blocks} />
              </div>
            )}
          </div>
        </section>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
