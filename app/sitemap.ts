import {sitePaths} from '@/content/routes';
import {siteOrigin} from '@/content/site';
export const dynamic='force-static';
export default function sitemap(){return sitePaths.map(path=>({url:siteOrigin+path+'/',changeFrequency:'monthly' as const,priority:path===''?1:path==='/platform'?.9:.7}));}
