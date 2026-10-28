import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const sitemap = await readFile('out/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const walk = (value) => {
  if (Array.isArray(value)) return value.flatMap(walk);
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(walk)];
};
let count = 0;
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(`out${path}index.html`, 'utf8');
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    for (const node of walk(JSON.parse(match[1]))) {
      if (node['@type'] !== 'BreadcrumbList') continue;
      count++;
      const items = node.itemListElement;
      assert.ok(items.length >= 2, `${path}: breadcrumb length`);
      items.forEach((item, i) => {
        assert.equal(item['@type'], 'ListItem');
        assert.equal(item.position, i + 1);
        assert.ok(item.name);
        if (!item.item && i === items.length - 1) return;
        const target = new URL(item.item);
        assert.equal(target.origin, 'https://www.cleezoclass.com');
        const route = target.pathname.replace(/\/?$/, '/');
        assert.ok(existsSync(`out${route}index.html`), `${path}: missing breadcrumb target`);
        assert.notEqual(route, '/school-management-system/', `${path}: legacy alias parent`);
      });
    }
  }
}
console.log(`PASS: ${count} BreadcrumbList objects, ordered items and exported targets.`);
