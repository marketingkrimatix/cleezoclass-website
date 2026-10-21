import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const copy = JSON.parse(readFileSync('content/student-information-system.json', 'utf8'));
const raw = readFileSync('out/student-information-system/index.html', 'utf8');
const html = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
const plain = (s) =>
  decode(s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
const rendered = decode(html.replace(/<[^>]+>/g, ''));
for (const text of Object.values(copy.hero))
  assert.ok(rendered.includes(plain(text)), 'Missing hero copy: ' + text);
for (const section of copy.sections) {
  assert.ok(rendered.includes(plain(section.title)), 'Missing section: ' + section.title);
  for (const b of section.blocks)
    for (const text of [b.text, ...(b.items || []), ...(b.rows || []).flat()].filter(Boolean))
      assert.ok(rendered.includes(plain(text)), 'Missing public copy: ' + text);
}
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(decode(html).includes('<title>' + copy.metadata.title + '</title>'));
assert.ok(decode(html).includes('content="' + copy.metadata.description + '"'));
assert.ok(/rel="canonical"[^>]+student-information-system\//.test(html));
assert.ok(html.includes(`name="robots" content="${process.argv.includes('--production') ? 'index, follow' : 'noindex, follow'}"`));
assert.ok(html.includes('summary_large_image'));
assert.ok(html.includes('/student-information-system-og.png'));
assert.ok(!rendered.includes('Implementation notes'));
const answers = [...html.matchAll(/<div\b[^>]*data-slot="accordion-content"[^>]*>/g)];
assert.equal(answers.length, 9);
assert.ok(answers.every(([tag]) => tag.includes('hidden=""') && tag.includes('display:none')));
assert.ok(
  raw.includes('Organization') && raw.includes('WebSite') && raw.includes('BreadcrumbList'),
);
for (const [, url] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
  if (url.includes('.') || url.startsWith('//')) continue;
  assert.ok(
    existsSync('out' + (url.endsWith('/') ? url : url + '/') + 'index.html'),
    'Broken link: ' + url,
  );
}
assert.ok(readFileSync('out/sitemap.xml', 'utf8').includes('/student-information-system/'));
const png = readFileSync('out/student-information-system-og.png');
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log(
  'Verified all supplied public copy, nine rendered FAQ answers, links, schema, environment robots, metadata, sitemap and 1200×630 social image.',
);
