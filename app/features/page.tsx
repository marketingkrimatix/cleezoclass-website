import type { Metadata } from 'next';
import { AliasRedirect } from '@/components/site/alias-redirect';
import { siteOrigin } from '@/content/site';

export const metadata: Metadata = {
  title: 'Platform Features | Cleezo Class',
  description: 'Explore Cleezo Class school management platform features.',
  alternates: { canonical: `${siteOrigin}/platform/` },
  robots: { index: false, follow: true },
};

export default function FeaturesPage() {
  return <AliasRedirect href="/platform" />;
}
