import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// Check real exported HTML, excluding React hydration payloads.
const copy = JSON.parse(readFileSync('content/school-erp.json', 'utf8'));
const html = readFileSync('out/school-erp-software/index.html', 'utf8').replace(
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  '',
);
const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
const plain = (value) =>
  decode(value.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
const rendered = decode(html.replace(/<[^>]+>/g, ''));
for (const section of copy.sections) {
  assert.ok(rendered.includes(plain(section.title)), `Missing section: ${section.title}`);
  for (const block of section.blocks) {
    for (const text of [block.text, ...(block.items || []), ...(block.rows || []).flat()].filter(
      Boolean,
    )) {
      assert.ok(rendered.includes(plain(text)), `Missing public copy: ${text}`);
    }
  }
}
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(rendered.includes(copy.hero.title));
assert.ok(rendered.includes(copy.hero.description));
assert.ok(decode(html).includes(`<title>${copy.metadata.title}</title>`));
assert.ok(decode(html).includes(`content="${copy.metadata.description}"`));
assert.ok(html.includes('rel="canonical"'));
assert.ok(html.includes('/school-erp-software/'));
assert.ok(html.includes('/school-erp-og.png'));
assert.ok(!rendered.includes('Implementation notes'));
const answers = [...html.matchAll(/<div\b[^>]*data-slot="accordion-content"[^>]*>/g)];
assert.equal(answers.length, 8);
assert.ok(answers.every(([tag]) => tag.includes('hidden=""') && tag.includes('display:none')));
assert.equal((html.match(/class="erp-module-tags"/g) || []).length, 6);
assert.equal((html.match(/class="school-workspace /g) || []).length, 1);
for (const tag of [
  'Enquiries',
  'Fee receipts',
  'Report cards',
  'Salary slips',
  'WhatsApp updates',
  'Master data',
]) {
  assert.ok(rendered.includes(tag), 'Missing module feature: ' + tag);
}
for (const [, url] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
  if (url.includes('.') || url.startsWith('//')) continue;
  assert.ok(
    existsSync(`out${url.endsWith('/') ? url : `${url}/`}index.html`),
    `Broken internal link: ${url}`,
  );
}
assert.ok(readFileSync('out/sitemap.xml', 'utf8').includes('/school-erp-software'));
const png = readFileSync('out/school-erp-og.png');
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log(
  'Verified complete public copy, 8 collapsed FAQ answers, compact module cards, metadata, internal links, sitemap and social image.',
);
