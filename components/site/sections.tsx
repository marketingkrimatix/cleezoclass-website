import homepage from '@/content/homepage.json';
import { ModuleStory, AIStory } from './cinematic';
import Link from 'next/link';
import {
  CalendarDays,
  BookOpen,
  FileCheck,
  MessagesSquare,
  Wallet,
  Bus,
  Users,
  Heart,
  Library,
  ArrowUpRight,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { modules, modulePath } from '@/content/modules';
import { resources } from '@/content/resources';
import { Action, Eyebrow, TextLink } from './ui';
import { FAQs, ModuleWorkflow } from './experience';
export const moduleIcons = [
  CalendarDays,
  BookOpen,
  FileCheck,
  MessagesSquare,
  Wallet,
  Bus,
  Users,
  Heart,
  Library,
];
export function PlatformGrid({ limit = 9 }: { limit?: number }) {
  return (
    <div className="platform-grid">
      {modules.slice(0, limit).map((m, i) => {
        const Icon = moduleIcons[i];
        return (
          <Link className="platform-card" href={modulePath(m.slug)} key={m.slug}>
            <div className="platform-card-top">
              <span className="feature-icon">
                <Icon size={24} />
              </span>
              <span>0{i + 1}</span>
            </div>
            <h3>{m.title}</h3>
            <p>{m.tagline}</p>
            <div className="platform-card-bottom">
              <span>{m.label}</span>
              <ArrowUpRight size={19} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export function PlatformSection() {
  return (
    <section className="platform-section section wrap">
      <Eyebrow>Meet your connected platform</Eyebrow>
      <div className="section-heading">
        <h2>
          The whole school.
          <br />
          Thoughtfully organised.
        </h2>
        <div>
          <p>Explore the work you need to do, and the modules that help you follow it through.</p>
          <TextLink href="/platform">See the platform</TextLink>
        </div>
      </div>
      <ModuleStory />
    </section>
  );
}
export function PhotoMoment() {
  return (
    <section className="photo-moment wrap reveal">
      <figure>
        <img
          src="/classroom-learning-1200.webp"
          srcSet="/classroom-learning-640.webp 640w, /classroom-learning-1200.webp 1200w, /classroom-learning-1800.webp 1800w"
          sizes="100vw"
          width="1800"
          height="1200"
          loading="lazy"
          alt="A teacher points to a workbook while two students work attentively"
        />
        <figcaption>
          School-life imagery by Katerina Holmes / Pexels. Illustrative, not a customer photograph.
        </figcaption>
      </figure>
      <div>
        <Eyebrow>At the heart of it all</Eyebrow>
        <h2>
          Better organised.
          <br />
          More human.
        </h2>
        <p>
          School software should help the people behind the process. Every register, assignment and
          update exists to support something more important: a child’s experience of learning.
        </p>
        <TextLink href="/about">Get to know Cleezo Class</TextLink>
      </div>
    </section>
  );
}
export function AISection() {
  return <AIStory />;
}
export function Adoption({ home = false }: { home?: boolean }) {
  return (
    <section className="section wrap adoption">
      <div>
        <Eyebrow>Make a considered start</Eyebrow>
        <h2>
          {home ? (
            homepage.sections[6].title
          ) : (
            <>
              Start with your school.
              <br />
              Build a practical plan.
            </>
          )}
        </h2>
        <p>
          {home
            ? homepage.sections[6].paragraphs[0]
            : 'A useful evaluation starts with your current routines, the people involved, and the information you need to bring together.'}
        </p>
        <TextLink href="/book-demo">
          {home ? 'Discuss Your School Setup' : 'Talk through your requirements'}
        </TextLink>
        {home && (
          <div style={{ marginTop: 16 }}>
            <TextLink href="/how-it-works/">How Cleezo Class works</TextLink>
          </div>
        )}
      </div>
      <ol>
        {(home
          ? [
              [
                'Set up your institution',
                'Choose your board affiliation, student count and selected modules.',
              ],
              [
                'Provision role accounts',
                'Give administration, accounts, HR and front desk their core workspaces.',
              ],
              [
                'Import existing records',
                'Use Excel import for historical student, staff and lead data.',
              ],
            ]
          : [
              [
                'Explore the fit',
                'Bring a real workflow, a typical exception and the questions your team wants answered.',
              ],
              [
                'Prepare the information',
                'Discuss records, import formats, responsibilities and validation before moving data.',
              ],
              [
                'Plan for your people',
                'Agree training, role access, rollout steps and the support included in your proposal.',
              ],
            ]
        ).map(([t, b], i) => (
          <li key={t}>
            <span>0{i + 1}</span>
            <div>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function ResourcesSection() {
  return (
    <section className="section resources-section">
      <div className="wrap">
        <Eyebrow>Useful before the first demo</Eyebrow>
        <div className="section-heading">
          <h2>
            A little clarity.
            <br />A better next step.
          </h2>
          <TextLink href="/resources">All resources</TextLink>
        </div>
        <div className="resource-teasers">
          <Link href={`/resources/${resources[0].slug}`} className="resource-featured">
            <div className="resource-image">
              <img
                src="/school-workspace-1200.webp"
                srcSet="/school-workspace-640.webp 640w, /school-workspace-1200.webp 1200w"
                sizes="(max-width: 760px) 100vw, 50vw"
                width="1200"
                height="800"
                alt="Pencils and school supplies arranged on a paper school bag"
                loading="lazy"
              />
            </div>
            <div className="resource-feature-copy">
              <span className="tiny-eyebrow">
                {resources[0].category} · {resources[0].minutes}
              </span>
              <h3>{resources[0].title}</h3>
              <p>{resources[0].description}</p>
              <span className="text-link">
                Read the guide <ArrowRight size={18} />
              </span>
            </div>
          </Link>
          <div className="resource-list">
            {resources.slice(1).map((r, i) => (
              <Link href={`/resources/${r.slug}`} key={r.slug}>
                <span className="tiny-eyebrow">
                  {r.category} · {r.minutes}
                </span>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className="text-link">
                  Read the guide <ArrowRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export const homeFaqs: [string, string][] = [
  [
    'What is Cleezo Class?',
    'Cleezo Class is school management software with published capabilities across attendance, academics, finance, communication and school operations. Explore the modules and use a demo to confirm the workflows your institution needs.',
  ],
  [
    'Who is it designed for?',
    'The platform describes experiences for school management, administrators, teachers, parents and students. Each role has different tasks; a demo can show how your school’s structure and access requirements fit.',
  ],
  [
    'How should we approach onboarding?',
    'Start by discussing the records you need to prepare, who will check them, how users will receive access, and what training and support are included. Agree the scope and responsibilities before setting a rollout date.',
  ],
  [
    'How much does it cost?',
    'The existing website directs schools to discuss pricing and rollout needs. Request a quote based on your student count, required modules and support needs; no fixed public price is shown here.',
  ],
  [
    'Can we set different permissions for staff and parents?',
    'Bring your role and access requirements to the demo. Ask who can view, edit and export each type of information, and confirm the available configuration before adopting the platform.',
  ],
  [
    'How can we contact the team?',
    'Email support@cleezoclass.com or use the demo request form. During evaluation, confirm the support channels and response arrangements that will apply to your school.',
  ],
];
export function HomeFAQs() {
  return (
    <section className="section wrap faq-section">
      <div>
        <Eyebrow>A few practical questions</Eyebrow>
        <h2>{homepage.sections[7].title}</h2>
        <TextLink href="/contact">Talk to the team</TextLink>
      </div>
      <FAQs
        items={homepage.sections[7].cards.map((card) => [card.title, card.paragraphs.join('\n\n')])}
      />
    </section>
  );
}
export function Spotlight() {
  return (
    <section className="spotlight">
      <div className="wrap spotlight-intro">
        <Eyebrow>Look a little closer</Eyebrow>
        <h2>
          From a register entry
          <br />
          to a useful conversation.
        </h2>
        <p>
          Attendance becomes more useful when the school knows how to review it, correct it and
          follow up. Explore the handover, one step at a time.
        </p>
      </div>
      <ModuleWorkflow module={modules[0]} />
    </section>
  );
}
