import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { ArrowDown, Check, ClipboardCheck } from 'lucide-react';
import copy from '@/content/evaluation-checklist.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { PrintButton } from './print-button';
import './checklist.css';

const canonical = `${siteOrigin}/resources/school-management-evaluation-checklist/`;
const title = 'School Management Software Evaluation Checklist for Schools | Cleezo Class';
const description = 'Use this practical school management software evaluation checklist to compare workflows, data, team access, implementation needs and vendor questions before a demo.';
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical },
  openGraph: { title, description, url: canonical, type: 'article', images: [{ url: '/evaluation-checklist-og.png', width: 1200, height: 630, alt: 'School software evaluation checklist and vendor scorecard' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/evaluation-checklist-og.png'] },
};

// Approved source: docs/cleezo_school_management_software_evaluation_checklist_final_public_copy(2).md.
// The content JSON contains public copy only; editorial implementation notes are excluded.
type Block = { type: string; text?: string; items?: string[]; rows?: string[][] };
const sections: { title: string; blocks: Block[] }[] = copy;
const ids = ['school-priorities', 'stakeholders', 'core-workflows', 'connected-information', 'user-access', 'prepare-records', 'demo-questions', 'costs-and-support', 'vendor-scorecard', 'cleezo-workflow', 'checklist-faqs', 'next-step'];
const labels = ['Start with your priorities', 'Bring your team', '01 / Core workflows', '02 / Connected information', '03 / Access & campuses', '04 / Prepare your records', '05 / Make the demo useful', '06 / Costs & support', '07 / Compare vendors', 'Explore Cleezo Class', 'Common questions', 'Your next step'];

function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
    if (link && !link[2].startsWith('//')) return <Link key={i} href={link[2]}>{link[1]}</Link>;
    return <Fragment key={i}>{part}</Fragment>;
  })}</>;
}

function Blocks({ blocks, caption }: { blocks: Block[]; caption: string }) {
  return <>{blocks.map((block, i) => {
    if (block.type === 'heading') return <h3 key={i}>{block.text}</h3>;
    if (block.type === 'cta') return <div className="checklist-actions" key={i}><Action href="/book-demo/">{block.text}</Action></div>;
    if (block.type === 'table') return <div className="checklist-table" role="region" aria-label={caption} tabIndex={0} key={i}><table><caption className="sr-only">{caption}</caption><thead><tr>{block.rows?.[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{block.rows?.slice(1).map((row, j) => <tr key={j}>{row.map((cell, k) => k === 0 ? <th scope="row" key={k}><Inline text={cell} /></th> : <td key={k}><Inline text={cell} /></td>)}</tr>)}</tbody></table></div>;
    if (block.type === 'unordered' || block.type === 'ordered') {
      const List = block.type === 'ordered' ? 'ol' : 'ul';
      return <List key={i} className={`checklist-list ${block.type}`}>{block.items?.map(item => <li key={item}>{block.type === 'unordered' && <span className="checklist-box" aria-hidden="true" />}<span><Inline text={item} /></span></li>)}</List>;
    }
    return <p key={i}><Inline text={block.text || ''} /></p>;
  })}</>;
}

export default function EvaluationChecklistPage() {
  return <main id="main" className="evaluation-page">
    <nav className="wrap checklist-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/resources/">Resources</Link><span>/</span><span aria-current="page">Evaluation checklist</span></nav>
    <header className="wrap checklist-hero">
      <div><Eyebrow>A practical guide for school teams</Eyebrow><h1>{sections[0].title}</h1><Blocks blocks={sections[0].blocks} caption="Introduction" /><a className="checklist-jump" href="#vendor-scorecard">Jump to the vendor scorecard <ArrowDown size={16} /></a></div>
      <aside className="checklist-cover" aria-label="Inside this guide"><div className="checklist-cover-top"><ClipboardCheck size={28} /><span>THE EVALUATION GUIDE</span></div><p className="checklist-cover-title">Your school.<br />Your priorities.<br /><em>A clearer comparison.</em></p><div className="checklist-cover-rows">{['Map the work that matters', 'Ask the right questions', 'Record the evidence'].map((text, i) => <div key={text}><span>0{i + 1}</span>{text}<Check size={18} /></div>)}</div><div className="checklist-cover-footer"><span>7 evaluation steps</span><span>1 vendor scorecard</span></div></aside>
    </header>
    <div className="wrap checklist-toolbar"><span>Plan together. Compare consistently.</span><PrintButton /></div>
    <div className="wrap checklist-layout">
      <aside className="checklist-sidebar"><nav aria-label="On this page"><p>IN THIS GUIDE</p>{ids.map((id, i) => <a href={`#${id}`} key={id}>{labels[i]}</a>)}</nav></aside>
      <article className="checklist-content">{sections.slice(1).map((section, i) => <section id={ids[i]} key={section.title} aria-labelledby={`${ids[i]}-title`} className={i === 11 ? 'checklist-closing' : ''}>
        <h2 id={`${ids[i]}-title`}>{section.title}</h2>
        {i === 8 && <div className="checklist-scorecard-meta"><span>School: ____________________</span><span>Vendor: ____________________</span><span>Date: ____________________</span></div>}
        <Blocks blocks={section.blocks} caption={section.title} />
        {i === 9 && <p><Link href="/school-erp-software/">Explore School ERP Software →</Link></p>}
      </section>)}</article>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin }, { '@type': 'ListItem', position: 2, name: 'Resources', item: `${siteOrigin}/resources/` }, { '@type': 'ListItem', position: 3, name: sections[0].title, item: canonical }] }).replace(/</g, '\\u003c') }} />
  </main>;
}
