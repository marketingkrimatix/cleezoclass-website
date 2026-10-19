import { siteOrigin } from '@/content/site';
export const dynamic = 'force-static';
// Crawlers must be able to read the preview pages' noindex metadata.
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: siteOrigin + '/sitemap.xml' };
}
