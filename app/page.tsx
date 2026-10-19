import type { Metadata } from 'next';
import homepage from '@/content/homepage.json';
import { siteOrigin } from '@/content/site';
import './homepage.css';
import {
  ExperienceHero,
  ConnectionMap,
  PlatformPreview,
  ConnectedPathway,
  GatherWorkspace,
  SchoolDayTimeline,
  StakeholderExperience,
  HumanMoment,
  ModuleEcosystem,
  AttendanceWalkthrough,
  HumanControlledAI,
  SchoolDemo,
  EditorialResources,
} from '@/components/site/immersive';
import { Adoption, HomeFAQs } from '@/components/site/sections';
import { Closing } from '@/components/site/ui';
export const metadata: Metadata = {
  title: { absolute: homepage.metadata.title },
  description: homepage.metadata.description,
  openGraph: {
    ...homepage.metadata,
    siteName: 'Cleezo Class',
    type: 'website',
    locale: 'en_IN',
    url: siteOrigin,
  },
  twitter: { ...homepage.metadata, card: 'summary' },
};
export default function Home() {
  return (
    <main id="main" className="connected-home homepage-copy">
      <ExperienceHero />
      <ConnectionMap />
      <PlatformPreview />
      <ConnectedPathway />
      <GatherWorkspace />
      <SchoolDayTimeline />
      <StakeholderExperience />
      <HumanMoment />
      <ModuleEcosystem />
      <AttendanceWalkthrough />
      <HumanControlledAI />
      <SchoolDemo />
      <Adoption home />
      <EditorialResources />
      <HomeFAQs />
      <Closing home />
    </main>
  );
}
