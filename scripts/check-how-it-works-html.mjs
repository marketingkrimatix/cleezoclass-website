import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const read = file => readFileSync(file, 'utf8');
const clean = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const plain = text => decode(text.replace(/<[^>]+>/g, ''));
const html = clean(read('out/how-it-works/index.html'));
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const rendered = plain(main);
const md = read('docs/cleezo_how_it_works_final_public_copy.md');
const source = md.split('## Public page copy')[1].split('## Implementation notes')[0];
// Validate against the approved source, independently of the extracted JSON.
for (let line of source.split('\n').map(s => s.trim()).filter(Boolean)) {
  if (line === '---' || /^\|[-| ]+\|$/.test(line)) continue;
  const cells = line.startsWith('|') ? line.slice(1, -1).split('|').map(s => s.trim()) : [line];
  for (line of cells) {
    const expected = decode(line.replace(/^#{1,3} |^- /, '').replace(/^\*\*CTA: (.*)\*\*$/, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
    assert.ok(rendered.includes(expected), `Missing or changed approved copy: ${expected}`);
  }
}
assert.equal((main.match(/<h1\b/g) || []).length, 1);
assert.equal((main.match(/<h2\b/g) || []).length, 7);
assert.equal((main.match(/<h3\b/g) || []).length, 7);
assert.equal((main.match(/<table\b/g) || []).length, 2);
assert.equal((main.match(/scope="col"/g) || []).length, 4);
assert.equal((main.match(/scope="row"/g) || []).length, 11);
const faqs = main.match(/<section[^>]+id="faqs"[\s\S]*?<\/section>/)[0];
assert.equal((faqs.match(/<h3\b/g) || []).length, 5);
assert.equal((faqs.match(/class="refined-faq-answer"/g) || []).length, 5);
assert.equal((faqs.match(/<details\b/g) || []).length, 5);
assert.equal((faqs.match(/<summary\b/g) || []).length, 5);
assert.equal((faqs.match(/name="how-it-works-faqs"/g) || []).length, 5);
assert.ok(!/<details[^>]*\sopen(?:\s|=|>)/.test(faqs), 'FAQs start collapsed');
for (const label of ['Implementation notes', 'Page setup', 'Public page copy', 'CTA:', 'Page purpose']) assert.ok(!rendered.includes(label));
const title = md.match(/\| SEO title \| (.+) \|/)[1].replace('\\|', '|');
const description = md.match(/\| Meta description \| (.+) \|/)[1];
assert.ok(decode(html).includes(`<title>${title}</title>`));
assert.ok(decode(html).includes(`<meta name="description" content="${description}"`));
assert.ok(html.includes('<link rel="canonical" href="https://cleezoclass.com/how-it-works/"'));
const ctas = [...main.matchAll(/<a\b[^>]*class="button[^>]*>/g)];
assert.equal(ctas.length, 4);
assert.ok(ctas.every(([tag]) => tag.includes('href="/book-demo/"')));
for (const [, anchor, href] of source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) assert.ok(main.includes(`href="${href}">${anchor}</a>`));
for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
  if (href.includes('.') || href.startsWith('//')) continue;
  assert.ok(existsSync(`out${href.endsWith('/') ? href : href + '/'}index.html`), `Broken link: ${href}`);
}
for (const [file, anchor] of [['out/index.html', 'How Cleezo Class works'], ['out/school-erp-software/index.html', 'Explore the setup process']]) {
  assert.ok(clean(read(file)).includes(`href="/how-it-works/">${anchor}`));
}
const nav = html.match(/<nav[^>]*aria-label="Primary"[\s\S]*?<\/nav>/)[0];
assert.equal((nav.match(/href="\/how-it-works\/"/g) || []).length, 1);
assert.ok(read('out/sitemap.xml').includes('<loc>https://cleezoclass.com/how-it-works/</loc>'));
const production = process.argv.includes('--production');
assert.ok(html.includes(`name="robots" content="${production ? 'index, follow' : 'noindex, follow'}"`));
assert.ok(read('out/robots.txt').includes('Allow: /'));

// Exercise deployment contexts without rebuilding for every environment.
const siteCode = ts.transpileModule(read('content/site.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
for (const [env, expected] of [
  [{}, false],
  [{ NODE_ENV: 'production' }, false],
  [{ NODE_ENV: 'production', CONTEXT: 'production' }, true],
  [{ NODE_ENV: 'production', CONTEXT: 'deploy-preview', SITE_ENV: 'production' }, false],
  [{ NODE_ENV: 'production', CONTEXT: 'branch-deploy' }, false],
  [{ NODE_ENV: 'production', VERCEL_ENV: 'preview', SITE_ENV: 'production' }, false],
  [{ NODE_ENV: 'production', SITE_ENV: 'production' }, true],
  [{ NODE_ENV: 'development', SITE_ENV: 'production' }, false],
]) {
  const context = { exports: {}, process: { env: { ...env, NEXT_PUBLIC_SITE_URL: 'https://preview.example' } } };
  vm.runInNewContext(siteCode, context);
  assert.equal(context.exports.publicIndexing, expected);
  assert.equal(context.exports.siteOrigin, 'https://cleezoclass.com');
}
console.log('PASS: approved Markdown copy, headings, tables, HTML FAQs, CTAs, links, metadata, sitemap and indexing contexts.');
