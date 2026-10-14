import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { Building2, MessagesSquare, MonitorPlay, ClipboardList, UsersRound, ArrowUpRight, GraduationCap, BookOpen, Wallet, CalendarDays, UserRound, Network, Check, type LucideIcon } from 'lucide-react';
import { Action } from '@/components/site/ui';
import { siteOrigin } from '@/content/site';
import copy from '@/content/how-it-works.json';
import { HowItWorksMotion } from './how-it-works-motion';
import { SetupSection, EcosystemSection, FAQSection } from './refined-sections';
import './how-it-works.css';
import './page-motion.css';

const canonical = `${siteOrigin}/how-it-works/`;
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical },
  openGraph: { ...copy.metadata, url: canonical, siteName: 'Cleezo Class', type: 'website', locale: 'en_IN' },
  twitter: { ...copy.metadata, card: 'summary' },
};

type Block = { type: string; text?: string; items?: string[]; rows?: string[][] };
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\((\/[^)]+|\/)\)$/);
    return link ? <Link key={i} href={link[2]}>{link[1]}</Link> : <Fragment key={i}>{part}</Fragment>;
  })}</>;
}
const workflowIcons = [UsersRound, GraduationCap, CalendarDays, Wallet, MessagesSquare];
const teamIcons = [UsersRound, BookOpen, Wallet, Building2, Network, GraduationCap];
function Blocks({ blocks, tableCaption, variant }: { blocks: Block[]; tableCaption?: string; variant?: string }) {
  if (variant === 'faqs') return <div className="how-faq-grid">{blocks.filter(block => block.type === 'heading').map((block, index) => <article className="how-faq-item" key={block.text}><h3>{block.text}</h3><p><Inline text={blocks[index * 2 + 1].text || ''} /></p></article>)}</div>;
  return <>{blocks.map((block, i) => {
    if (block.type === 'heading') return <h3 key={i}>{block.text}</h3>;
    if (block.type === 'cta') return <div className="how-action" key={i}><Action href="/book-demo/">{block.text}</Action></div>;
    if (block.type === 'list') return <ul key={i}>{block.items?.map((item, index) => {
      const Icon = variant === 'conversation' ? Check : workflowIcons[index % workflowIcons.length];
      return <li key={item}><span className="how-list-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span><span><Inline text={item} /></span>{variant === 'school-picture' && <ArrowUpRight className="how-link-arrow" size={20} aria-hidden="true" />}</li>;
    })}</ul>;
    if (block.type === 'table') return <div className="how-table" key={i}><table><caption className="sr-only">{tableCaption}</caption><thead><tr>{block.rows?.[0].map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead><tbody>{block.rows?.slice(1).map(([area, detail], index) => {
      const Icon = teamIcons[index % teamIcons.length];
      return <tr key={area}><th scope="row"><span className="how-table-label"><span className="how-table-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>{area}</span></th><td>{detail}</td></tr>;
    })}</tbody></table></div>;
    return <p key={i}><Inline text={block.text || ''} /></p>;
  })}</>;
}

// A branded editorial diagram, not a representation of the product interface.
function WorkflowIllustration() {
  return <div className="how-illustration" aria-hidden="true">
    <svg className="how-workflow-lines" viewBox="0 0 500 500" fill="none"><path className="how-workflow-track" d="M85 125C160 20 400 50 420 150S410 380 320 415 100 430 75 340" /><path className="how-workflow-trace" pathLength="1" d="M85 125C160 20 400 50 420 150S410 380 320 415 100 430 75 340" /></svg>
    <div className="how-orbit how-orbit-outer" /><div className="how-orbit how-orbit-inner" />
    <div className="how-orbit-dot how-orbit-dot-one" /><div className="how-orbit-dot how-orbit-dot-two" />
    <svg className="how-campus" viewBox="0 0 520 460" fill="none">
      <defs>
        <linearGradient id="how-plinth" x1="80" y1="300" x2="390" y2="420" gradientUnits="userSpaceOnUse"><stop stopColor="#d8eee3" /><stop offset="1" stopColor="#8db9aa" /></linearGradient>
        <linearGradient id="how-wall" x1="140" y1="130" x2="330" y2="310" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef8" /><stop offset="1" stopColor="#e1ece9" /></linearGradient>
        <linearGradient id="how-roof" x1="130" y1="130" x2="350" y2="230" gradientUnits="userSpaceOnUse"><stop stopColor="#2b7289" /><stop offset="1" stopColor="#0b3655" /></linearGradient>
      </defs>
      <ellipse cx="264" cy="365" rx="185" ry="54" fill="#062a40" opacity=".09" />
      <path d="M55 300 253 198 465 305 268 412Z" fill="url(#how-plinth)" />
      <path d="M55 300v18l213 112v-18Z" fill="#89b6a3" /><path d="m268 412 197-107v18L268 430Z" fill="#639385" />
      <path d="m122 231 102-51 1 139-103 52Z" fill="#b9d4d1" /><path d="m225 180 174 85v108l-174-54Z" fill="url(#how-wall)" />
      <path d="m105 226 117-77 194 105-25 14-170-81-94 51Z" fill="url(#how-roof)" />
      <path d="M175 173 250 133l73 38v152l-74 40-74-39Z" fill="url(#how-wall)" />
      <path d="m249 207 74-36v152l-74 40Z" fill="#c4dad7" />
      <path d="m161 169 88-68 87 69-87 48Z" fill="url(#how-roof)" />
      <path d="m161 169 88 44v10l-88-44Z" fill="#173e57" />
      <path d="m249 213 87-43v10l-87 43Z" fill="#082e4b" />
      <path d="M250 102V59" stroke="#18435d" strokeWidth="4" /><path d="M252 60h42l-10 13 10 12h-42Z" fill="#ef8a4c" />
      <path d="m202 278 25 13v54l-25-13Z" fill="#0b4d6f" /><path d="m259 293 26-13v62l-26 14Z" fill="#2e6373" />
      {[0, 1, 2].map(i => <Fragment key={i}><path d={`m${137 + i * 23} ${249 - i * 12} 13-7v25l-13 7Z`} fill="#458196" /><path d={`m${337 + i * 19} ${263 + i * 10} 11 5v24l-11-5Z`} fill="#5c8e9c" /></Fragment>)}
      <path d="m191 216 15 8v25l-15-8Zm29 15 15 8v25l-15-8Z" fill="#5b91a1" /><path d="m265 239 15-8v25l-15 8Zm27-14 15-8v25l-15 8Z" fill="#387388" />
      <path d="m191 338 47 25 30-15 20 10-52 28-63-33Z" fill="#f6f7ed" /><path d="m173 353 63 33v9l-63-33Zm63 33 52-28v9l-52 28Z" fill="#b2c9bf" />
      <path d="M104 306v-41m319 47v-40" stroke="#477e68" strokeWidth="6" />
      <ellipse cx="104" cy="255" rx="24" ry="35" fill="#75ac89" /><ellipse cx="114" cy="251" rx="14" ry="28" fill="#98c5a0" />
      <ellipse cx="422" cy="257" rx="25" ry="37" fill="#599977" /><ellipse cx="431" cy="252" rx="15" ry="29" fill="#84b591" />
    </svg>
    <div className="how-brand-seal"><img src="/cleezo-logo.png" alt="" width="30" height="32" /><span>cleezo class</span></div>
    {([
      [MessagesSquare, '01', 'Your school'], [MonitorPlay, '02', 'Relevant workflows'],
      [ClipboardList, '03', 'School setup'], [UsersRound, '04', 'Connected teams'],
    ] as [LucideIcon, string, string][]).map(([Icon, number, label], i) => <div className={`how-floating-card how-floating-card-${i}`} key={number}><span className="how-floating-icon"><Icon size={21} strokeWidth={1.6} /></span><span><small>{number}</small><strong>{label}</strong></span></div>)}
  </div>;
}

function SectionArt({ index }: { index: number }) {
  const Icon = [MessagesSquare, MonitorPlay, ClipboardList, UsersRound][index];
  return <div className={`how-section-art how-section-art-${index}`} aria-hidden="true"><div className="how-art-orbit" /><span className="how-art-center"><Icon size={44} strokeWidth={1.3} /></span><span className="how-art-satellite"><UserRound size={22} strokeWidth={1.5} /></span><span className="how-art-satellite"><BookOpen size={22} strokeWidth={1.5} /></span></div>;
}

const ids = ['conversation', 'demo', 'school-setup', 'connected-teams', 'school-picture', 'faqs', 'book-a-demo'];
export default function HowItWorksPage() {
  const [hero, ...sections] = copy.sections;
  return <main id="main" className="how-page">
    <HowItWorksMotion />
    <section className="how-hero wrap">
      <div className="how-hero-copy"><div className="how-eyebrow"><span />How It Works</div><h1>Start with your school. <span>Build around the way it works.</span></h1><Blocks blocks={hero.blocks} /></div>
      <WorkflowIllustration />
    </section>
    <div className="wrap"><div className="how-journey-strip" aria-hidden="true">{['Your school', 'Relevant workflows', 'School setup', 'Connected teams'].map((label, i) => <div key={label}><span>0{i + 1}</span><strong>{label}</strong><ArrowUpRight size={19} /></div>)}</div></div>
    {sections.map((section, i) => i === 2 ? <SetupSection key={section.title} /> : i === 4 ? <EcosystemSection key={section.title} /> : i === 5 ? <FAQSection key={section.title} /> : <section key={section.title} id={ids[i]} className={`how-section how-section-${ids[i]}`} aria-labelledby={`${ids[i]}-title`}>
      <div className="wrap how-section-inner">
        <div className="how-section-heading">{i < 4 && <span className="how-step" aria-hidden="true">0{i + 1}<span /></span>}<h2 id={`${ids[i]}-title`}>{i < 4 ? <><span className="sr-only">{i + 1}. </span>{section.title.replace(/^\d\. /, '')}</> : section.title}</h2>{(i === 0 || i === 2) && <SectionArt index={i} />}</div>
        <div className="how-section-copy"><Blocks blocks={section.blocks} variant={ids[i]} tableCaption={i === 2 ? 'Prepare the essentials' : 'Teams and relevant workflow examples'} /></div>
      </div>
    </section>)}
  </main>;
}
