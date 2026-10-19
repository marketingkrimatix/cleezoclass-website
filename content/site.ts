// Canonicals and sitemap URLs always refer to the established public domain.
export const siteOrigin = 'https://cleezoclass.com';
// Static exports bake robots metadata into HTML. Local and preview builds must
// stay noindex; only an explicitly identified production build enables indexing.
const deploymentContext = process.env.CONTEXT || process.env.VERCEL_ENV || process.env.SITE_ENV;
export const publicIndexing =
  process.env.NODE_ENV === 'production' && deploymentContext === 'production';
