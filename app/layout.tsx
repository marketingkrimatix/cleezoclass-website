import {MotionProvider,MotionSetup} from '@/components/site/motion';
import {siteOrigin,publicIndexing} from '@/content/site';
import type { Metadata } from 'next';
import './globals.css';
import './cinematic.css';
import './upgrade.css';
import {ImmersiveMotion} from '@/components/site/immersive';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/ui';
export const metadata: Metadata={title:{default:'Cleezo Class — A school day, beautifully connected',template:'%s | Cleezo Class'},description:'Explore school management for attendance, academics, finance and parent communication. Give every role a clearer view with Cleezo Class.',metadataBase:new URL(siteOrigin),alternates:{canonical:siteOrigin},robots:{index:publicIndexing,follow:publicIndexing},icons:{icon:'/cleezo-logo.png',shortcut:'/cleezo-logo.png'},openGraph:{siteName:'Cleezo Class',type:'website',locale:'en_IN',title:'Cleezo Class — A school day, beautifully connected',description:'Explore attendance, academics, finance and parent communication with Cleezo Class.',url:siteOrigin},twitter:{card:'summary',title:'Cleezo Class — A school day, beautifully connected',description:'School management, thoughtfully connected.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preload" href="/fonts/instrument-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":siteOrigin+"/#organization",name:"Cleezo Class",url:siteOrigin,logo:siteOrigin+"/cleezo-logo.png",email:"support@cleezoclass.com"},{"@type":"WebSite","@id":siteOrigin+"/#website",name:"Cleezo Class",url:siteOrigin,publisher:{"@id":siteOrigin+"/#organization"}}]})}}/><a className="skip-link" href="#main">Skip to content</a><MotionProvider><Header/>{children}<Footer/><MotionSetup/><ImmersiveMotion/></MotionProvider></body></html>}
