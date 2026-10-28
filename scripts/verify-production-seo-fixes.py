"""Read-only post-deployment checks; compare production metadata with the local out/ artifact."""
import concurrent.futures
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ORIGIN = 'https://www.cleezoclass.com'
ROOT = Path('.seo-audit/deployment-verification')
ROOT.mkdir(parents=True, exist_ok=True)
ROLES = ['leaders', 'administrators', 'teachers', 'parents']
MODULES = ['scheduling', 'learning', 'exams', 'communication', 'finance', 'transport', 'staff', 'engagement', 'library']
routes = [f'/solutions/{role}/' for role in ROLES] + [f'/school-management-system/{module}/' for module in MODULES]

class Metadata(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.description=None; self.schemas=[]; self.capture=False; self.buffer=''; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='meta' and a.get('name')=='description':self.description=a.get('content')
        if tag=='script' and a.get('type')=='application/ld+json':self.capture=True; self.buffer=''
    def handle_data(self, data):
        if self.capture:self.buffer+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.capture:self.schemas.append(json.loads(self.buffer)); self.capture=False

def breadcrumbs(value):
    if isinstance(value,list):return [n for v in value for n in breadcrumbs(v)]
    if isinstance(value,dict):
        return ([value] if value.get('@type')=='BreadcrumbList' else []) + [n for v in value.values() for n in breadcrumbs(v)]
    return []

def get(url):
    import hashlib
    key=hashlib.sha256(url.encode()).hexdigest()[:20]
    body=ROOT/(key+'.html'); headers=ROOT/(key+'.headers')
    p=subprocess.run(['curl.exe','-sS','--max-time','30','-D',str(headers),'-o',str(body),url],capture_output=True,text=True)
    if p.returncode:return {'url':url,'error':p.stderr,'status':0,'body':''}
    raw=headers.read_text(); statuses=re.findall(r'^HTTP/\S+ (\d+)',raw,re.M)
    location=re.search(r'^Location:\s*(.+)',raw,re.I|re.M)
    return {'url':url,'status':int(statuses[-1]) if statuses else 0,'location':location.group(1).strip() if location else None,'body':body.read_text(encoding='utf8',errors='replace')}

probes=[ORIGIN+'/seo-deployment-missing-check-20261024/']
redirects=['https://cleezoclass.com/','https://cleezoclass.com/solutions/leaders/','https://cleezoclass.com/features/school-fee-management-software/?seo_check=1']
crm=['https://cleezoclass.com/CRM','https://cleezoclass.com/CRM/']
urls=[ORIGIN+route for route in routes]+probes+redirects+crm
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:responses=dict(zip(urls,pool.map(get,urls)))
checks=[]
for route in routes:
    response=responses[ORIGIN+route]; actual=Metadata(response['body']); expected=Metadata((Path('out')/route.strip('/')/'index.html').read_text(encoding='utf8'))
    checks.append({'url':ORIGIN+route,'check':'HTTP 200 and deployed description/breadcrumbs match built artifact','pass':response['status']==200 and actual.description==expected.description and breadcrumbs(actual.schemas)==breadcrumbs(expected.schemas),'status':response['status']})
for url in probes:checks.append({'url':url,'check':'Unknown route returns 404','pass':responses[url]['status']==404,'status':responses[url]['status']})
for url in redirects:
    response=responses[url]; target=url.replace('https://cleezoclass.com','https://www.cleezoclass.com',1)
    checks.append({'url':url,'check':'301 to canonical www preserving path/query','pass':response['status']==301 and response.get('location')==target,'status':response['status'],'location':response.get('location')})
for url in crm:
    response=responses[url]
    # Compare with the pre-deployment baseline: /CRM redirects to /CRM/; /CRM/ serves its app.
    ok=(response['status']==301 and response.get('location') in ('/CRM/','https://cleezoclass.com/CRM/')) if url.endswith('/CRM') else response['status']==200 and 'Cleezo Class' in response['body'] and 'School Management Software for K' not in response['body']
    checks.append({'url':url,'check':'CRM public response remains consistent with baseline (no login submitted)','pass':ok,'status':response['status'],'location':response.get('location')})
(ROOT/'results.json').write_text(json.dumps(checks,indent=2),encoding='utf8')
for check in checks:print(('PASS' if check['pass'] else 'FAIL')+' '+check['url']+' '+check['check']+' ['+str(check['status'])+']')
sys.exit(0 if all(check['pass'] for check in checks) else 1)
