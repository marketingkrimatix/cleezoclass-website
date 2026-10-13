import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { ArrowRight, Check, ClipboardList, GraduationCap, MessageSquare, QrCode, FileSpreadsheet, Users, Fingerprint, Building2 } from 'lucide-react';
import copy from '@/content/admission-management.json';
import { siteOrigin } from '@/content/site';
import { Action, Eyebrow } from '@/components/site/ui';
import { FAQs } from '@/components/site/experience';
import './admissions.css';

const canonical = siteOrigin + '/features/admission-management-software/';
const socialImage = { url: '/admission-management-og.png', width: 1200, height: 630, alt: 'Cleezo Class admissions workflow from enquiry to enrolment' };
export const metadata: Metadata = {
  title: { absolute: copy.metadata.title }, description: copy.metadata.description,
  alternates: { canonical },
  openGraph: { ...copy.metadata, url: canonical, siteName: 'Cleezo Class', type: 'website', locale: 'en_IN', images: [socialImage] },
  twitter: { ...copy.metadata, card: 'summary_large_image', images: [socialImage.url] },
};
type Block = { type: string; text?: string; items?: string[] };
const sections: { title: string; blocks: Block[] }[] = copy.sections;
const ids = ['admission-process', 'admission-enquiries', 'entrance-counselling', 'enrolled-records', 'admission-follow-up', 'admission-erp', 'campus-admissions', 'admission-faqs', 'admission-demo'];
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && link[2].startsWith('/') && !link[2].startsWith('//')) return <Link key={i} href={link[2]}>{link[1]}</Link>;
    return <Fragment key={i}>{part}</Fragment>;
  })}</>;
}

function groups(blocks: Block[]) {
  const cards: { title: string; blocks: Block[] }[] = [];
  for (const b of blocks) { if (b.type === 'heading') cards.push({ title: b.text!, blocks: [] }); else if (b.type !== 'cta') cards.at(-1)?.blocks.push(b); }
  return cards;
}

const entryIcons = [Users, QrCode, FileSpreadsheet, Fingerprint];
const entryLabels = ['Walk-in enquiries', 'QR registration', 'Excel imports', 'Tracking IDs'];
function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => {
    if (b.type === 'cta') return <div className="adm-action" key={i}><Action href="/book-demo/">{b.text}</Action></div>;
    if (b.type === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
    if (b.type === 'list') return <ul className="adm-entry-grid" key={i}>{b.items?.map((item,j)=>{const Icon=entryIcons[j];return <li key={item}><span className="adm-icon"><Icon size={24} aria-hidden="true"/></span><h3>{entryLabels[j]}</h3><p><Inline text={item}/></p></li>;})}</ul>;
    return <p key={i}><Inline text={b.text || ''}/></p>;
  })}</>;
}
function AdmissionJourney() {
  return <figure className="adm-journey">
    <div className="adm-journey-top"><span><ClipboardList size={20} aria-hidden="true"/> Admissions workspace</span><span className="adm-sample">Illustrative workflow</span></div>
    <div className="adm-record"><span className="adm-avatar">AS</span><div><span className="adm-overline">PROSPECTIVE STUDENT</span><strong>Aarav S.</strong><span>Class 6 · Enquiry CC-1042</span></div><span className="adm-badge">Enrolled</span></div>
    <ol className="adm-stages">{[{icon:ClipboardList,title:'Enquiry recorded',detail:'Walk-in · Tracking ID assigned'},{icon:MessageSquare,title:'Counselling recorded',detail:'Progress kept with the enquiry'},{icon:Check,title:'Admission accepted',detail:'School decision recorded'},{icon:GraduationCap,title:'Student enrolled',detail:'Connected student record'}].map(({icon:Icon,title,detail},i)=><li key={title}><span className="adm-stage-icon"><Icon size={20} aria-hidden="true"/></span><div><strong>{title}</strong><span>{detail}</span></div><span className="adm-stage-number" aria-hidden="true">0{i+1}</span></li>)}</ol>
    <div className="adm-record-footer"><GraduationCap size={20} aria-hidden="true"/><span>Ready for the next chapter</span><ArrowRight size={18} aria-hidden="true"/></div>
    <figcaption>Sample data · Workflow illustration, not a product screenshot</figcaption>
  </figure>;
}
function StageVisual({ index }: { index: number }) {
  if(index===2)return <div className="adm-stage-preview" aria-label="Illustrative applicant progress"><span className="adm-overline">ONE APPLICANT RECORD</span><strong>Tracking ID · CC-1042</strong><div><span>Entrance stage</span><Check size={18} aria-hidden="true"/></div><div><span>Counselling stage</span><Check size={18} aria-hidden="true"/></div><p>Progress stays with the enquiry.</p></div>;
  if(index===3)return <div className="adm-conversion" aria-label="Accepted enquiry connects to an enrolled student record"><span><ClipboardList size={27} aria-hidden="true"/>Accepted enquiry</span><ArrowRight aria-hidden="true"/><span><GraduationCap size={27} aria-hidden="true"/>Enrolled student</span></div>;
  return <div className="adm-channel"><span className="adm-icon"><MessageSquare size={28} aria-hidden="true"/></span><span className="adm-overline">SCHOOL-OWNED COMMUNICATION</span><strong>Your school’s official<br/>WhatsApp number</strong><div><Check size={17} aria-hidden="true"/> Follow-up linked to the enquiry</div><p>Managed by admissions staff</p></div>;
}
export default function AdmissionManagementPage() {
  return <main id="main" className="adm-page"><div className="adm-opening"><nav className="wrap adm-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Admission management software</span></nav><section className="wrap adm-hero"><div className="adm-hero-copy"><Eyebrow>From first enquiry to enrolment</Eyebrow><h1>{copy.hero.title}</h1><p>{copy.hero.description}</p><div className="adm-action"><Action href="/book-demo/">Book a Demo</Action></div><p className="adm-supporting">{copy.hero.supporting}</p></div><AdmissionJourney/></section></div>
    {sections.map((section,index)=><section className={'adm-section adm-'+ids[index]} id={ids[index]} key={ids[index]} aria-labelledby={ids[index]+'-title'}><div className="wrap">{index>=2&&index<=4 ? <div className={'adm-split '+(index===3?'adm-reverse':'')}><div><span className="adm-overline">0{index} / {['','','EVALUATE','ENROL','FOLLOW UP'][index]}</span><h2 id={ids[index]+'-title'}>{section.title}</h2><Blocks blocks={section.blocks}/></div><StageVisual index={index}/></div> : <><h2 id={ids[index]+'-title'}>{section.title}</h2>{index===7 ? <FAQs items={groups(section.blocks).map(card=>[card.title,<Inline key={card.title} text={card.blocks.map(b=>b.text).join(' ')} />])}/> : <div className="adm-body">{index===6&&<Building2 className="adm-campus-icon" size={38} aria-hidden="true"/>}<Blocks blocks={section.blocks}/></div>}</>}</div></section>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteOrigin},{'@type':'ListItem',position:2,name:'Admission management software',item:canonical}]}).replace(/</g,'\u003c')}}/>
  </main>;
}
