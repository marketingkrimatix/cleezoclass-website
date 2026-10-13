import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { CalendarDays, Users, BookOpen, Check, ArrowRight, Clock3 } from 'lucide-react';
import copy from '@/content/school-timetable.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { FAQs } from '@/components/site/experience';
import './timetable.css';

const canonical = siteOrigin + '/features/school-timetable-software/';
const socialImage = { url: '/school-timetable-og.png', width: 1200, height: 630, alt: 'Cleezo Class school timetable planning illustration' };
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title }, description: copy.metadata.description,
  alternates: { canonical },
  openGraph: { ...copy.metadata, url: canonical, siteName: 'Cleezo Class', type: 'website', locale: 'en_IN', images: [socialImage] },
  twitter: { ...copy.metadata, card: 'summary_large_image', images: [socialImage.url] },
};
type Block = { type: string; text?: string; items?: string[]; rows?: string[][] };
const sections: { title: string; blocks: Block[] }[] = copy.sections;
const ids = ['overview', 'planning-challenges', 'scheduling-inputs', 'connected-operations', 'school-teams', 'planning-checklist', 'timetable-faqs', 'timetable-demo'];
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && link[2].startsWith('/') && !link[2].startsWith('//')) return <Link key={i} href={link[2]}>{link[1]}</Link>;
    return <Fragment key={i}>{part}</Fragment>;
  })}</>;
}
function Actions() { return <div className="tt-actions"><Action href="/book-demo/">Request a Demo</Action><Action href="/school-erp-software/" secondary>Explore School ERP Software</Action></div>; }
function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => {
    if (b.type === 'actions') return <Actions key={i}/>;
    if (b.type === 'cta') return <div className="tt-action" key={i}><Action href="/book-demo/">{b.text}</Action></div>;
    if (b.type === 'ordered') return <ol className="tt-checklist" key={i}>{b.items?.map(item => <li key={item}><Inline text={item}/></li>)}</ol>;
    if (b.type === 'table') return <div className="tt-table" key={i}><table><thead><tr>{b.rows?.[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{b.rows?.slice(1).map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td><Inline text={row[1]}/></td></tr>)}</tbody></table></div>;
    return <p key={i}><Inline text={b.text || ''}/></p>;
  })}</>;
}
function groups(blocks: Block[]) {
  const cards: { title: string; blocks: Block[] }[] = [];
  for (const b of blocks) { if (b.type === 'heading') cards.push({ title: b.text!, blocks: [] }); else if (b.type !== 'cta') cards.at(-1)?.blocks.push(b); }
  return cards;
}
const icons = [Users, Clock3, BookOpen, CalendarDays];
function Timetable() {
  const lessons = [['Mathematics','A. Rao','English','R. Shah','Science','M. Das'],['English','R. Shah','Science','M. Das','Mathematics','A. Rao'],['Science','M. Das','Mathematics','A. Rao','English','R. Shah']];
  return <figure className="tt-planner">
    <div className="tt-planner-top"><span><CalendarDays size={20} aria-hidden="true"/> Academic planner</span><span className="tt-label">Monday · Sample day</span></div>
    <div className="tt-planner-heading"><div><span className="tt-overline">A SCHOOL DAY, ORGANISED</span><h2>Every period has its place.</h2></div><span className="tt-ready"><Check size={15} aria-hidden="true"/> Reviewed</span></div>
    <div className="tt-schedule-scroll" tabIndex={0} role="region" aria-label="Illustrative timetable, scroll horizontally on small screens"><table className="tt-schedule"><thead><tr><th scope="col">Section</th><th scope="col">Period 1<small>09:00–09:45</small></th><th scope="col">Period 2<small>09:45–10:30</small></th><th scope="col">Break<small>10:30–10:45</small></th><th scope="col">Period 3<small>10:45–11:30</small></th></tr></thead><tbody>{lessons.map((row,i)=><tr key={i}><th scope="row">Class 6<span>{['Section A','Section B','Section C'][i]}</span></th>{[0,1].map(j=><td key={j}><div className={'tt-lesson tt-subject-'+row[j*2].toLowerCase()}><strong>{row[j*2]}</strong><span>{row[j*2+1]}</span></div></td>)}{i===0&&<td rowSpan={3} className="tt-break"><span>Take a<br/>breather</span></td>}<td><div className={'tt-lesson tt-subject-'+row[4].toLowerCase()}><strong>{row[4]}</strong><span>{row[5]}</span></div></td></tr>)}</tbody></table></div>
    <div className="tt-resolution"><span className="tt-resolution-icon"><Check size={18} aria-hidden="true"/></span><div><strong>Clash reviewed · Substitute arranged</strong><span>Class 6A · Period 4 · Teacher absence</span></div><ArrowRight size={18} aria-hidden="true"/><span className="tt-substitute">S. Iyer allocated</span></div>
    <figcaption>Timetable-planning illustration · Sample data, not a product screenshot</figcaption>
  </figure>;
}
export default function SchoolTimetablePage() {
  return <main id="main" className="tt-page"><div className="tt-opening"><nav className="wrap tt-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">School timetable software</span></nav>
    <section className="wrap tt-hero"><Eyebrow>{copy.hero.eyebrow}</Eyebrow><h1>{copy.hero.title}</h1><p className="tt-intro">{copy.hero.description}</p><Actions/><Timetable/><p className="tt-capabilities">{copy.hero.strip}</p></section></div>
    {sections.map((section,index)=><section className={'tt-section tt-'+ids[index]} id={ids[index]} key={ids[index]} aria-labelledby={ids[index]+'-title'}><div className="wrap"><h2 id={ids[index]+'-title'}>{section.title}</h2>{index===2 ? <><Blocks blocks={section.blocks.slice(0,1)}/><div className="tt-features">{groups(section.blocks).map((card,i)=>{const Icon=icons[i];return <article key={card.title}><span className="tt-feature-icon"><Icon size={24} aria-hidden="true"/></span><span className="tt-number" aria-hidden="true">0{i+1}</span><h3>{card.title}</h3><Blocks blocks={card.blocks}/></article>;})}</div><Blocks blocks={section.blocks.filter(b=>b.type==='cta')}/></> : index===6 ? <FAQs items={groups(section.blocks).map(card=>[card.title,<Inline key={card.title} text={card.blocks.map(b=>b.text).join(' ')} />])}/> : <div className="tt-body"><Blocks blocks={section.blocks}/></div>}</div></section>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteOrigin},{'@type':'ListItem',position:2,name:'School timetable software',item:canonical}]}).replace(/</g,'\u003c')}}/>
  </main>;
}
