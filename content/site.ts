// Canonicals and sitemap URLs always refer to the established public domain.
export const siteOrigin = 'https://www.cleezoclass.com';
// Static exports bake robots metadata into HTML. Local and preview builds must
// stay noindex; only an explicitly identified production build enables indexing.
const deploymentContext = process.env.CONTEXT || process.env.VERCEL_ENV || process.env.SITE_ENV;
const deploymentUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || '';
const previewHost = /(?:^|\/\/)[^/]*\.netlify\.app(?:[/:]|$)/i.test(deploymentUrl);
export const publicIndexing =
  process.env.NODE_ENV === 'production' && deploymentContext === 'production' && !previewHost;
