'use client';
import {useEffect} from 'react';
export function AliasRedirect({href}:{href:string}) {
 useEffect(()=>{window.location.replace(href)},[href]);
 return <main id="main" className="section wrap"><h1>This page has moved.</h1><a href={href}>Continue to the page</a></main>;
}
