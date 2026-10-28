"""Read-only production crawl. Run --fetch to refresh saved HTTP evidence."""
import concurrent.futures
import hashlib
import json
import re
import subprocess
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import xml.etree.ElementTree as ET

ORIGIN = 'https://www.cleezoclass.com'
ROOT = Path('.seo-audit/2026-10-24')
ROOT.mkdir(parents=True, exist_ok=True)

def fetch(url):
    key = hashlib.sha256(url.encode()).hexdigest()[:20]
    body, headers, info = [ROOT / (key + suffix) for suffix in ('.html', '.headers', '.json')]
    if '--fetch' in sys.argv or not info.exists():
        p = subprocess.run(['curl.exe', '-sS', '-L', '--max-time', '35', '--max-redirs', '8',
                            '-D', str(headers), '-o', str(body), '-w', '%{http_code}\n%{url_effective}\n%{num_redirects}', url], capture_output=True, text=True)
        lines=p.stdout.splitlines()
        result = {'http_code':int(lines[0]),'url_effective':lines[1],'num_redirects':int(lines[2])} if len(lines)==3 else {}
        result['error'] = p.stderr
        info.write_text(json.dumps(result), encoding='utf-8')
    result=json.loads(info.read_text(encoding='utf-8'))
    if 'http_code' not in result and headers.exists():
        raw=headers.read_text(); statuses=re.findall(r'^HTTP/\S+ (\d+)',raw,re.M)
        locations=re.findall(r'^Location: (.+)',raw,re.M|re.I)
        final=url
        for location in locations:final=urljoin(final,location.strip())
        result={'http_code':int(statuses[-1]) if statuses else 0,'url_effective':final,'num_redirects':len(locations),'error':''}
        info.write_text(json.dumps(result),encoding='utf-8')
    return result, body, headers

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.title=''; self.h1=[]; self.meta={}; self.canonical=[]; self.links=[]; self.ids=set(); self.schema=[]; self.images=[]; self.text=[]; self.capture=None; self.buffer=''; self.skip=0
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('script','style'): self.skip+=1
        if tag in ('title','h1') or (tag=='script' and a.get('type')=='application/ld+json'): self.capture=tag; self.buffer=''
        if tag=='meta': self.meta[a.get('name', a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='img': self.images.append(a)
        if 'id' in a:self.ids.add(a['id'])
    def handle_endtag(self, tag):
        if tag==self.capture:
            if tag=='title':self.title=self.buffer
            if tag=='h1':self.h1.append(' '.join(self.buffer.split()))
            if tag=='script':
                try:self.schema.append(json.loads(self.buffer))
                except ValueError:self.schema.append({'parseError':True})
            self.capture=None
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if self.capture:self.buffer+=data
        if not self.skip:self.text.append(data)

def nodes(value):
    if isinstance(value,dict):
        if '@type' in value:yield value
        for v in value.values():yield from nodes(v)
    elif isinstance(value,list):
        for v in value:yield from nodes(v)

_, sitemap, _ = fetch(ORIGIN+'/sitemap.xml')
urls=[n.text for n in ET.parse(sitemap).findall('{*}url/{*}loc')]
extras=[ORIGIN+'/robots.txt', ORIGIN+'/audit-missing-page-20261024/', 'https://cleezoclass.com/', 'http://cleezoclass.com/', 'http://www.cleezoclass.com/']
extras += [u.rstrip('/') for u in urls if u!=ORIGIN+'/']
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: fetched=dict(zip(urls+extras,pool.map(fetch,urls+extras)))
pages={}; result=[]; issues=[]
for url in urls:
    info,body,headers=fetched[url]; html=body.read_text(encoding='utf-8'); p=Page(html); pages[url]=p
    row={'url':url,'status':info.get('http_code'),'final':info.get('url_effective'),'redirects':info.get('num_redirects'),'title':p.title,'description':p.meta.get('description'),'h1':p.h1,'canonical':p.canonical,'robots':p.meta.get('robots'),'bytes':len(body.read_bytes()),'hash':hashlib.sha256(html.encode()).hexdigest(),'schemaTypes':sorted(set(n['@type'] for n in nodes(p.schema) if isinstance(n['@type'],str))),'headers':headers.read_text(),'schema':p.schema}
    local=Path('out')/urlparse(url).path.lstrip('/')/'index.html'
    if local.exists():
        expected=Page(local.read_text(encoding='utf-8'))
        row['localMetadataMatch']=p.title==expected.title and p.h1==expected.h1 and p.meta.get('description')==expected.meta.get('description')
        row['localContentMatch']=' '.join(' '.join(p.text).split())==' '.join(' '.join(expected.text).split())
    if row['status']!=200:issues.append([url,'status',row['status']])
    if p.canonical!=[url]:issues.append([url,'canonical',p.canonical])
    if len(p.h1)!=1:issues.append([url,'H1 count',len(p.h1)])
    if 'noindex' in p.meta.get('robots',''):issues.append([url,'noindex',p.meta['robots']])
    for n in nodes(p.schema):
        if n.get('@type')=='BreadcrumbList':
            items=n.get('itemListElement',[])
            if len(items)<2:issues.append([url,'breadcrumb too short',items])
            for i,item in enumerate(items):
                if item.get('position')!=i+1 or not item.get('name') or (i<len(items)-1 and not item.get('item')):issues.append([url,'invalid breadcrumb',item])
    result.append(row)
for field in ('title','description','h1','hash'):
    groups=defaultdict(list)
    for row in result:groups[str(row[field])].append(row['url'])
    for value,group in groups.items():
        if len(group)>1:issues.append([group,'duplicate '+field,value])
incoming=defaultdict(set); unresolved=defaultdict(set); broken_anchors=[]
for url,p in pages.items():
    for href in p.links:
        target=urljoin(url,href); u=urlparse(target)
        if u.hostname not in ('cleezoclass.com','www.cleezoclass.com'):continue
        normalized=ORIGIN+(u.path if u.path.endswith('/') else u.path+'/')
        if normalized in pages:
            if normalized!=url:incoming[normalized].add(url)
            if u.fragment and unquote(u.fragment) not in pages[normalized].ids:broken_anchors.append([url,href])
        else:unresolved[target.split('#')[0]].add(url)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: extra_links=dict(zip(unresolved,pool.map(fetch,unresolved)))
summary={'pages':result,'issues':issues,'orphans':[u for u in urls if u!=ORIGIN+'/' and not incoming[u]],'incoming':{u:sorted(incoming[u]) for u in urls},'brokenAnchors':broken_anchors,'extraLinks':{u:{'sources':sorted(unresolved[u]),'status':v[0].get('http_code'),'final':v[0].get('url_effective'),'title':Page(v[1].read_text(encoding='utf-8',errors='replace')).title} for u,v in extra_links.items()},'probes':{u:{k:v[0].get(k) for k in ('http_code','url_effective','num_redirects','error')} for u,v in fetched.items() if u in extras}}
(ROOT/'results.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'pages':len(result),'issues':issues,'orphans':summary['orphans'],'brokenAnchors':broken_anchors,'extraLinks':summary['extraLinks'],'metadataMismatches':[r['url'] for r in result if r.get('localMetadataMatch') is False]},indent=2))
