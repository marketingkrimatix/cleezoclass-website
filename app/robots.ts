import {siteOrigin,publicIndexing} from '@/content/site';
export const dynamic='force-static';
export default function robots(){return {rules:{userAgent:'*',...(publicIndexing?{allow:'/'}:{disallow:'/'})},sitemap:siteOrigin+'/sitemap.xml'}}
