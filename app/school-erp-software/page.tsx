import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { Users, Wallet, BookOpen, CalendarDays, MessageSquare, Building2, Sparkles } from 'lucide-react';
import copy from '@/content/school-erp.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { ProductCanvas } from '@/components/site/product';
import { FAQs } from '@/components/site/experience';
import './erp.css';

const canonical = `${siteOrigin}/school-erp-software/`;
const socialImage = { url: '/school-erp-og.png', width: 1200, height: 630, alt: 'Cleezo Class school ERP software: one connected school system' };
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical },
  openGraph: { ...copy.metadata, url: canonical, siteName: 'Cleezo Class', type: 'website', locale: 'en_IN', images: [socialImage] },
  twitter: { ...copy.metadata, card: 'summary_large_image', images: [socialImage.url] },
};

type Block = { type: string; text?: string; items?: string[]; rows?: string[][] };
type Section = { title: string; blocks: Block[] };
const sections: Section[] = copy.sections;
const ids = ['what-is-school-erp', 'connected-workflow', 'erp-modules', 'evaluate-school-erp', 'multi-branch', 'role-workspaces', 'automation', 'school-operations', 'schools-in-india', 'school-setup', 'erp-faqs', 'erp-demo'];
const moduleVisuals = [
  { icon: Users, tags: ['Enquiries', 'Enrolment'] },
  { icon: Wallet, tags: ['Fee receipts', 'Ledgers'] },
  { icon: BookOpen, tags: ['Examinations', 'Report cards'] },
  { icon: CalendarDays, tags: ['Attendance', 'Salary slips'] },
  { icon: MessageSquare, tags: ['Parent access', 'WhatsApp updates'] },
  { icon: Building2, tags: ['Campus setup', 'Master data'] },
];

// Render only the document's inline emphasis and links; never execute raw HTML.
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && link[2].startsWith('/') && !link[2].startsWith('//')) return <Link key={index} href={link[2]}>{link[1]}</Link>;
    return <Fragment key={index}>{part}</Fragment>;
  })}</>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => {
    if (block.type === 'heading') return <h3 key={index}>{block.text}</h3>;
    if (block.type === 'cta') return <div className="erp-action" key={index}><Action href={block.text === 'Log In' ? 'https://cleezoclass.com/CRM' : '/book-demo/'} secondary={block.text === 'Log In'}>{block.text}</Action></div>;
    if (block.type === 'ordered' || block.type === 'unordered') {
      const List = block.type === 'ordered' ? 'ol' : 'ul';
      return <List key={index} className={`erp-list erp-${block.type}`}>{block.items?.map(item => <li key={item}><Inline text={item} /></li>)}</List>;
    }
    if (block.type === 'table') return <div className="erp-table-wrap" key={index}><table><caption className="sr-only">Central and campus team responsibilities</caption><thead><tr>{block.rows?.[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{block.rows?.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}><Inline text={cell} /></td>)}</tr>)}</tbody></table></div>;
    return <p key={index}><Inline text={block.text || ''} /></p>;
  })}</>;
}

function groups(section: Section) {
  const cards: { title: string; blocks: Block[] }[] = [];
  const trailing: Block[] = [];
  for (const block of section.blocks) {
    if (block.type === 'heading') cards.push({ title: block.text!, blocks: [] });
    else if (block.type === 'cta' || block.text?.startsWith('Explore [Cleezo')) trailing.push(block);
    else cards.at(-1)?.blocks.push(block);
  }
  return { cards, trailing };
}

function FeatureCards({ section, previews = false }: { section: Section; previews?: boolean }) {
  const { cards, trailing } = groups(section);
  return <><div className={`erp-feature-grid ${previews ? 'erp-modules' : 'erp-automation'}`}>{cards.map((card, index) => {
    const Icon = previews ? moduleVisuals[index].icon : Sparkles;
    return <article className="erp-feature" key={card.title} data-reveal>
    <div className="erp-card-top"><span className="erp-card-icon"><Icon size={23} aria-hidden="true" /></span><span className="erp-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
    <h3>{card.title}</h3>
    <div className="erp-feature-copy"><Blocks blocks={card.blocks} /></div>
    {previews && <div className="erp-module-tags">{moduleVisuals[index].tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
  </article>;
  })}</div><Blocks blocks={trailing} /></>;
}

export default function SchoolERPPage() {
  const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
    { '@type': 'ListItem', position: 2, name: 'School ERP software', item: canonical },
  ] };
  return <main id="main" className="erp-page">
    <nav className="wrap erp-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">School ERP software</span></nav>
    <section className="erp-hero wrap">
      <div className="erp-hero-copy"><Eyebrow>{copy.hero.eyebrow}</Eyebrow><h1>{copy.hero.title}</h1><p>{copy.hero.description}</p><div className="erp-actions"><Action>{copy.hero.primary}</Action><Action href="/platform/" secondary>{copy.hero.secondary}</Action></div></div>
      <div className="erp-hero-preview" data-reveal><ProductCanvas homepage mode={5} compact /></div>
      <p className="erp-capability-strip">{copy.hero.strip}</p>
    </section>
    {sections.map((section, index) => <section className={`erp-section erp-section-${ids[index]}`} id={ids[index]} key={section.title} aria-labelledby={`${ids[index]}-title`}>
      <div className="wrap">
        <h2 id={`${ids[index]}-title`}>{section.title}</h2>
        {index === 2 || index === 6 ? <FeatureCards section={section} previews={index === 2} /> : index === 10 ? <FAQs items={groups(section).cards.map(card => [card.title, <Inline key={card.title} text={card.blocks.map(block => block.text).join('\n\n')} />])} /> : <div className="erp-section-body"><Blocks blocks={section.blocks} />{index === 9 && <p><Link href="/how-it-works/">Explore the setup process</Link></p>}</div>}
      </div>
    </section>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }} />
  </main>;
}
