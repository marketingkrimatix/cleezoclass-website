import Link from 'next/link';
import { Building2, UserRoundPlus, ContactRound, Wallet, MessagesSquare, Network, CalendarDays, GraduationCap, ArrowUpRight, ChevronDown } from 'lucide-react';
import copy from '@/content/how-it-works.json';
import './refined-sections.css';
import './school-showcase.css';

type Section = { title: string; blocks: { type: string; text?: string; rows?: string[][]; items?: string[] }[] };

export function SetupSection() {
  const section: Section = copy.sections[3];
  const rows = section.blocks.find(block => block.type === 'table')!.rows!;
  const paragraphs = section.blocks.filter(block => block.type === 'paragraph');
  const icons = [Building2, UserRoundPlus, ContactRound, Wallet, MessagesSquare];
  return <section id="school-setup" className="how-section how-refined-setup" aria-labelledby="school-setup-title">
    <div className="wrap refined-setup-layout">
      <div className="refined-setup-intro">
        <span className="refined-kicker" aria-hidden="true">03<span /></span>
        <h2 id="school-setup-title"><span className="sr-only">3. </span>{section.title.replace(/^3\. /, '')}</h2>
        {paragraphs.slice(0, 2).map(block => <p key={block.text}>{block.text}</p>)}
        <p className="refined-setup-note">{paragraphs[2].text}</p>
        <p>Use the <Link href="/resources/school-management-evaluation-checklist/">evaluation checklist</Link> to prepare your school&apos;s workflows, records and questions before a demo.</p>
      </div>
      <div className="refined-preparation">
        <div className="refined-preparation-heading"><span className="refined-panel-mark" aria-hidden="true"><Building2 size={22} /></span><h3>{section.blocks.find(block => block.type === 'heading')!.text}</h3><span className="refined-panel-dots" aria-hidden="true"><i /><i /><i /></span></div>
        <table><caption className="sr-only">School setup preparation checklist</caption><thead className="sr-only"><tr>{rows[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{rows.slice(1).map(([title, description], index) => {
          const Icon = icons[index];
          return <tr key={title}><th scope="row"><span className="refined-prep-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.5} /></span><span>{title}</span></th><td>{description}</td></tr>;
        })}</tbody></table>
      </div>
    </div>
  </section>;
}

export function EcosystemSection() {
  const section: Section = copy.sections[5];
  const items = section.blocks.find(block => block.type === 'list')!.items!;
  const icons = [Building2, Network, GraduationCap, CalendarDays, UserRoundPlus];
  return <section id="school-picture" className="how-section school-showcase" aria-labelledby="school-picture-title">
    <div className="wrap">
      <div className="school-showcase-heading"><h2 id="school-picture-title">{section.title}</h2><p>{section.blocks[0].text}</p></div>
      <div className="school-showcase-frame">
        <div className="school-showcase-feature">
          <div className="school-showcase-brand"><img src="/cleezo-logo.png" width="48" height="50" alt="" /><span>cleezo<span>class</span></span></div>
          <div className="school-showcase-identity"><span>school management software</span><p>One connected<br />school picture.</p></div>
          <div className="school-showcase-art" aria-hidden="true"><div className="school-showcase-sheet school-showcase-sheet-back" /><div className="school-showcase-sheet school-showcase-sheet-middle" /><div className="school-showcase-sheet school-showcase-sheet-front"><span className="school-showcase-sheet-mark"><Building2 size={27} strokeWidth={1.4} /></span><div className="school-showcase-tile-set">{icons.slice(1).map((Icon, index) => <span key={index}><Icon size={21} strokeWidth={1.4} /></span>)}</div></div></div>
        </div>
        <ul className="school-showcase-modules">{items.map((item, index) => {
          const match = item.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/)!;
          const Icon = icons[index];
          return <li className="school-showcase-row" key={match[3]}>
            <span className="school-showcase-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.5} /></span>
            <p>{match[1]}<Link href={match[3]}>{match[2]}</Link>{match[4]}</p>
            <ArrowUpRight className="school-showcase-arrow" size={19} aria-hidden="true" />
          </li>;
        })}</ul>
      </div>
    </div>
  </section>;
}

export function FAQSection() {
  const section = copy.sections[6];
  const questions = section.blocks.filter(block => block.type === 'heading');
  return <section id="faqs" className="how-section how-refined-faqs" aria-labelledby="faqs-title">
    <div className="wrap refined-faq-layout">
      <div className="refined-faq-intro"><span className="refined-kicker">Common questions</span><h2 id="faqs-title">{section.title}</h2><p>A closer look at the demo, preparation and setup.</p></div>
      <div className="refined-accordion">{questions.map((question, index) => <details className="refined-faq" key={question.text} name="how-it-works-faqs"><summary><h3>{question.text}</h3><ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" /></summary><div className="refined-faq-answer"><p>{section.blocks[index * 2 + 1].text}</p></div></details>)}</div>
    </div>
  </section>;
}
