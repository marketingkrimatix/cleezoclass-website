'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect,useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet,SheetTrigger,SheetContent,SheetTitle,SheetDescription } from '@/components/ui/sheet';
import { Brand,Action } from './ui';
const links=[['Platform','/platform'],['Solutions','/solutions'],['AI & Automation','/ai'],['Resources','/resources'],['About','/about']];
export function Header(){const path=usePathname();const [open,setOpen]=useState(false);const [scrolled,setScrolled]=useState(false);useEffect(()=>{const update=()=>setScrolled(window.scrollY>30);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update)},[]);return <header className={`site-header ${scrolled?"header-scrolled":""}`}><div className="wrap nav-inner"><Brand/><nav className="desktop-nav" aria-label="Primary">{links.map(([label,url])=><Link key={url} href={url} aria-current={path===url?'page':undefined}>{label}</Link>)}</nav><div className="nav-actions"><a className="login" href="https://cleezoclass.com/CRM" target="_blank" rel="noopener noreferrer">Login ↗</a><Action/><Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="menu-toggle" aria-label="Open navigation"><Menu/></SheetTrigger><SheetContent className="mobile-menu"><SheetTitle>Explore Cleezo Class</SheetTitle><SheetDescription>A school day, beautifully connected.</SheetDescription><nav aria-label="Mobile">{[...links,['Book a Demo','/book-demo'],['Contact','/contact']].map(([label,url])=><Link onClick={()=>setOpen(false)} key={url} href={url}>{label}</Link>)}</nav></SheetContent></Sheet></div></div></header>}
