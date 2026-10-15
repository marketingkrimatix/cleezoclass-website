import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Check the deployed artifacts, not the dev server: a case-only alias previously
// overwrote this page on Windows and repeatedly redirected to itself.
const pages = {
  solutions: 'One school. Different perspectives.',
  'solutions/leaders': 'A clearer view for the decisions that matter.',
  'solutions/administrators': 'Keep the work behind the school day moving.',
  'solutions/teachers': 'A little less chasing. A little more teaching.',
  'solutions/parents': 'Stay closer to the school day.',
};
for (const [route, heading] of Object.entries(pages)) {
  const html = await readFile(`out/${route}/index.html`, 'utf8');
  assert.ok(html.includes(heading), `${route}: expected page content missing`);
  assert.ok(!html.includes('This page has moved.'), `${route}: redirect replaced page`);
  assert.ok(!html.includes('Page not found |'), `${route}: incorrect metadata`);
}
console.log('Solutions export checks passed (overview and all four role pages).');
