"""Check the attendance review route against the supplied public-copy source."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.parts=[]; self.links=[]; self.meta={}; self.canonicals=[]; self.h1=0; self.skip=0; self.details=0; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('script','style'):self.skip+=1
        if tag=='h1':self.h1+=1
        if tag=='details':self.details+=1
        if tag=='a':self.links.append(a.get('href'))
        if tag=='meta':self.meta[a.get('name')]=a.get('content')
        if tag=='link' and a.get('rel')=='canonical':self.canonicals.append(a.get('href'))
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
    def handle_data(self,text):
        if not self.skip:self.parts.append(text)

source=Path('docs/cleezo-student-attendance-management-system-product-verified-final.md').read_text(encoding='utf8')
public=source.split('<!-- PUBLIC PAGE COPY: BEGIN -->')[1].split('<!-- PUBLIC PAGE COPY: END -->')[0].strip()
expected=[]
for title,body in re.findall(r'^## ([^\n]+)\n(.*?)(?=^## |\Z)',public,re.M|re.S):
    expected.append({'title':title,'blocks':[b.strip() for b in re.split(r'\n\s*\n',body) if b.strip() and b.strip()!='---']})
copy=json.loads(Path('content/student-attendance.json').read_text(encoding='utf8'))
assert copy['sections']==expected,'Content JSON differs from source'
path=Path('out/features/student-attendance-management-system/index.html'); html=path.read_text(encoding='utf8'); page=Page(html)
normalize=lambda text: re.sub(r'\s+','',text)
rendered=normalize(' '.join(page.parts))
for section in expected:
    if section['title']!='Hero':assert normalize(section['title']) in rendered,section['title']
    for block in section['blocks']:
        if block.startswith('**Capability highlights:**'):
            for highlight in block.replace('**Capability highlights:** ', '').split(' · '):
                assert normalize(highlight) in rendered,highlight
            continue
        clean=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',block).replace('**','')
        clean=re.sub(r'^(?:#{1,3} |\d+\. )','',clean,flags=re.M)
        clean=re.sub(r'(?:Primary CTA|Secondary CTA|CTA|Eyebrow|Capability highlights):\s*','',clean).replace(' · ',' ')
        assert normalize(clean) in rendered,clean
for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)',public):assert target in page.links,target
assert page.h1==1
assert page.details==6
assert page.meta['description']==copy['metadata']['description']
assert '<title>'+copy['metadata']['title']+'</title>' in html
assert page.canonicals==[copy['metadata']['canonical']]
assert page.meta['robots']==('index, follow' if '--production' in sys.argv else 'noindex, follow')
assert copy['metadata']['canonical'] in Path('out/sitemap.xml').read_text()
for route in ['platform','school-management-system/scheduling','school-erp-software','student-information-system']:
    linked=Page(Path('out',route,'index.html').read_text(encoding='utf8'))
    assert '/features/student-attendance-management-system/' in linked.links,route
scheduling=Path('out/school-management-system/scheduling/index.html').read_text(encoding='utf8')
assert 'Teachers can record the register' not in scheduling
assert 'Mark the class register' not in scheduling
assert 'Teachers cannot manually mark student attendance in the teacher web portal.' in scheduling
assert 'Editorial status' not in rendered and 'Product and editorial QA instructions' not in rendered
assert 'BreadcrumbList' in html
print('PASS: complete public copy, six HTML FAQs, email/internal links, metadata, environment indexing, sitemap inclusion and corrected capture claims.')
