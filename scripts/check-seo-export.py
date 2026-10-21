"""Validate the static artifact that will be deployed, without third-party packages."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta={}; self.canonical=[]; self.links=[]; self.ids=set(); self.h1=0; self.title=''; self.in_title=False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag=='h1':self.h1+=1
        if tag=='title':self.in_title=True
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

parser=argparse.ArgumentParser(); parser.add_argument('--production',action='store_true'); args=parser.parse_args()
root=Path('out'); origin='https://www.cleezoclass.com'; ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[node.text for node in ET.parse(root/'sitemap.xml').findall('s:url/s:loc',ns)]
errors=[]; pages={}; links=0
for url in urls:
    assert url.startswith(origin+'/'),url
    route=urlparse(url).path; file=root/route.lstrip('/')/'index.html'
    assert file.exists(),f'Missing exported route: {route}'
    html=file.read_text(encoding='utf-8'); page=Page(html); pages[route]=page
    if page.canonical!=[url]:errors.append(f'{route}: canonical {page.canonical}')
    if page.h1!=1:errors.append(f'{route}: expected one H1, got {page.h1}')
    if not page.meta.get('description') or not page.title:errors.append(f'{route}: missing metadata')
    expected='index, follow' if args.production else 'noindex, follow'
    if page.meta.get('robots')!=expected:errors.append(f'{route}: robots {page.meta.get("robots")}')
    if re.search(r'student[\s-]+passbooks?',html,re.I):errors.append(f'{route}: unapproved passbook claim')
for route,page in pages.items():
    for href in page.links:
        u=urlparse(urljoin(origin+route,href))
        if u.hostname not in ('www.cleezoclass.com','cleezoclass.com'):continue
        if u.path.startswith('/CRM'):continue # Existing external login app; not this static export.
        links+=1; path=unquote(u.path); canonical_path=path if path.endswith('/') else path+'/'
        target=pages.get(canonical_path)
        if target:
            if u.fragment and unquote(u.fragment) not in target.ids:errors.append(f'{route}: missing anchor {href}')
        elif not (root/path.lstrip('/')).is_file():errors.append(f'{route}: missing link target {href}')
for slug,source in [('school-fee-management-software','fee-management'),('admission-management-software','admission-management'),('school-timetable-software','school-timetable')]:
    route=f'/features/{slug}/'; copy=json.loads(Path(f'content/{source}.json').read_text(encoding='utf-8')); p=pages[route]
    assert p.title==copy['metadata']['title'],route+' title'
    assert p.meta['description']==copy['metadata']['description'],route+' description'
    text=(root/route.lstrip('/')/'index.html').read_text(encoding='utf-8')
    assert copy['hero']['title'] in text,route+' H1 content'
assert origin+'/sitemap.xml' in (root/'robots.txt').read_text()
assert 'noindex' in Page((root/'404.html').read_text(encoding='utf-8')).meta['robots']
assert not errors,'\n'.join(sorted(set(errors)))
print(f'PASS: {len(pages)} sitemap pages; {links} internal links/anchors; feature metadata; canonicals; robots; no passbook claims.')
