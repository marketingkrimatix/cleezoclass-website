import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Run after npm run build. Exclude hydration payloads: content must be in real HTML.
const copy = JSON.parse(readFileSync('content/homepage.json', 'utf8'));
const html = readFileSync('out/index.html', 'utf8').replace(
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  '',
);
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');

for (const card of copy.sections[7].cards) {
  for (const answer of card.paragraphs)
    assert.ok(html.includes(escape(answer)), `Missing FAQ answer: ${card.title}`);
}
const answers = [...html.matchAll(/<div\b[^>]*data-slot="accordion-content"[^>]*>/g)].map(
  (match) => match[0],
);
assert.equal(answers.length, 9);
assert.ok(
  answers.every(
    (tag) =>
      tag.includes('data-state="closed"') &&
      tag.includes('hidden=""') &&
      tag.includes('display:none'),
  ),
);

for (const card of copy.sections[2].cards) {
  for (const paragraph of card.paragraphs)
    assert.ok(html.includes(escape(paragraph)), `Missing automation description: ${card.title}`);
}
const panels = [...html.matchAll(/<div\b[^>]*class="[^"]*ai-assistant-screen[^>]*>/g)].map(
  (match) => match[0],
);
assert.equal(panels.length, 4);
assert.equal(
  panels.filter((tag) => tag.includes('data-state="active"') && !tag.includes('hidden=""')).length,
  1,
);
assert.equal(
  panels.filter(
    (tag) =>
      tag.includes('data-state="inactive"') &&
      tag.includes('aria-hidden="true"') &&
      tag.includes('inert=""'),
  ).length,
  3,
);

assert.equal((html.match(/school ERP software/g) || []).length, 1);
assert.ok(
  /<a\b[^>]*href="\/school-erp-software\/"[^>]*>school ERP software<\/a>/.test(html),
  'Missing contextual school ERP software link',
);
assert.ok(html.includes('Manage exams and report cards.'));
assert.ok(!html.includes('Manages exams and report cards'));
for (const view of ['Admissions', 'Attendance', 'Academics', 'Communication']) {
  assert.ok(html.includes(`data-view="${view}"`), `Missing contextual preview: ${view}`);
}
assert.ok(html.includes('Student report card'));
assert.ok(html.includes('Weekly timetable'));
assert.ok(html.includes('class="automation-timetable"'));
assert.ok(html.includes('class="automation-panels"'));
assert.ok(!html.includes('class="automation-dashboard"'));
console.log(
  'Verified initial HTML: 9 collapsed answers, 4 automation descriptions, contextual dashboards, corrected grammar and one ERP mention.',
);
