# How It Works — implementation review

Implemented at `/how-it-works/`. No deployment was performed.

## Latest change: three-section redesign

This pass changes only Plan the school setup, One connected school picture and
FAQs. Earlier implementation notes below describe previous iterations.

- Setup: balanced explanatory column and compact five-item preparation panel,
  with meaningful icons and connected rows. The original preparation text and
  Excel-import explanation remain intact; the panel retains table semantics.
- School picture: central branded platform with five linked modules and fine
  orthogonal connectors. On smaller screens it becomes a vertical connected
  list. All original sentences, anchor text and destinations remain intact.
- FAQs: native exclusive `details`/`summary` accordion, closed initially, with
  five exact questions and answers rendered in HTML. Native keyboard interaction,
  visible focus, chevrons and progressive expand/collapse transitions are included.
- Scoped entrance/line animations consume the existing Pause Motion context;
  CSS transitions also respect that control and reduced-motion preferences.

Files touched in this pass: `app/how-it-works/page.tsx` (three routing branches
within the section renderer), new `refined-sections.tsx`, `refined-sections.css`
and `section-motion.tsx` beside it, `scripts/check-how-it-works-html.mjs` (accordion
assertions), and this report. No existing shared components or styles changed.

Verification: build and TypeScript passed; approved Markdown/HTML checks passed;
the page and all five destinations returned local HTTP 200. Snapshot comparison
confirmed exact exported HTML outside the three sections, including header and
footer, remained unchanged; title, description and canonical were unchanged.
File hashes taken before this pass confirmed the prior unrelated working changes
were preserved. `git diff --check` passed.

Lint: new components have zero errors. Repository-wide lint remains blocked by
the existing `react-hooks/set-state-in-effect` error in
`components/site/motion.tsx:9`, plus existing warnings. The new logo image has the
same Next.js image-element advisory as other existing branded images; it is sized
explicitly and uses the existing local asset.

Visual QA limitation: no browser/native-app surface is available. The supplied
before screenshots were inspected, and responsive rules were reviewed for the
requested 1440, 1024, 768, 390 and 320px widths, but actual rendered screenshots,
console checks, keyboard interaction and Pause Motion interaction could not be
tested. These checks remain pending; this is not a claim of visual release approval.

## Visual redesign

The spacing follow-up reduces desktop section padding from 110px to 62px and
mobile padding from 60px to 38px. The preparation table now uses the full content
width and FAQs use a compact two-column grid (one column on smaller screens),
removing the tall empty heading columns. Hero artwork, table rows and cards also
use tighter spacing.

`app/how-it-works/how-it-works-motion.tsx` adds one-time viewport entrance motion,
a workflow connection trace and a sequential emphasis on the four workflow
icons. Content stays visible without JavaScript. Animations are brief, honour
reduced-motion preferences (including changes while open), and clean up on
navigation. The previous continuous floating animation now finishes within
five seconds. Table rows and workflow cards have subtle hover feedback.

Following design feedback, the page now has a larger editorial hero with a
custom isometric school illustration, floating workflow cards and a four-stage
overview. The main sections vary in composition: conversation checklist, dark
workflow cards, preparation table, full-width team table, linked exploration
cards, open FAQs and a centred closing invitation. Colours and fonts use the
existing brand system. Decorative movement respects reduced-motion preferences.
The illustration is authored SVG artwork, not a product interface or screenshot.

The redesign changes only `app/how-it-works/page.tsx`, its CSS and this review
record. The approved copy and original CTA destinations remain unchanged.
The rebuilt page passed TypeScript, the Markdown/HTML verification script and
the local HTTP check. Browser inventory is still empty, so visual and interactive
keyboard verification remains pending.

## Changed files

- `app/how-it-works/page.tsx`: server-rendered page, exact approved metadata,
  one H1, seven H2s, five HTML-rendered FAQ answers, four demo CTAs, two semantic
  customer-facing tables and a decorative branded workflow illustration.
- `app/how-it-works/how-it-works.css`: existing brand colours and typography,
  desktop columns, mobile stacking, wrapping tables, focus indicators and
  fixed-header clearance. The illustration is a diagram, not a sample interface
  or a product screenshot.
- `content/how-it-works.json`: public copy extracted from the supplied Markdown;
  document labels and implementation notes are excluded.
- `components/site/header.tsx`: one How It Works entry in each existing desktop
  and mobile navigation, beside Platform; normalized current-page indication.
- `components/site/sections.tsx`: homepage setup section incoming link, preserving
  its existing demo link and content.
- `app/school-erp-software/page.tsx`: incoming link in the setup section.
- `content/routes.ts`: includes the route in the existing sitemap pipeline.
- `app/[...slug]/page.tsx`: excludes this dedicated route from catch-all exports.
- `content/site.ts`: production-domain canonicals and sitemap; indexing only
  for explicitly identified production builds. Hosting preview context takes
  precedence over the manual production setting.
- `README.md`, `NETLIFY.md`: explain static production/preview builds and form limits.
- `scripts/check-how-it-works-html.mjs`: checks exported HTML against the original
  Markdown and exercises indexing contexts.
- `docs/how-it-works-review.md`: this review record.

The supplied `docs/cleezo_how_it_works_final_public_copy.md` was read in full and
left unchanged. It was already untracked when work began.

## Verification

- `npm.cmd run build`: passed, including TypeScript and 42 generated static pages.
- Production-mode export with `SITE_ENV=production`: built successfully;
  `node scripts/check-how-it-works-html.mjs --production` passed, confirming
  `index, follow`, production canonical and sitemap, and `Allow: /` robots.
- Final ordinary local export: rebuilt successfully and left **noindex**.
  `node scripts/check-how-it-works-html.mjs` passed. Checks cover every approved
  public line, headings, table headers, FAQ HTML, four CTAs, all supplied outgoing
  anchors, incoming links, navigation duplication, title, description and sitemap.
- Indexing context checks passed for local/development, Netlify production,
  deploy previews, branch builds, Vercel preview and manual production exports.
  Preview domains cannot replace canonical URLs.
- Local HTTP checks: `/how-it-works/`, all internal destinations linked by the
  page and shared header/footer, `/book-demo/`, `/sitemap.xml` and `/robots.txt`
  returned **200**. These are local export checks, not live production checks.
- Existing school ERP and student-information HTML checks passed.
- `git diff --check`: passed.
- Existing homepage HTML checker failed at line 25: it expects an older full
  sentence beginning “Cleezo Class brings the capabilities…”. No homepage copy
  was changed to satisfy that unrelated assertion.

## Remaining review and launch blockers

1. **Demo delivery is not configured.** `components/site/form.tsx` prevents the
   default submit, uses native validation and sets local completion state. It
   makes no request, stores no entries and sends no email. The existing page
   clearly labels this as a demonstration. A submission backend, recipient and
   delivery/error handling must be configured and tested before launch. No
   request or email was sent during this work.
2. **Browser QA remains pending.** The available computer-use inventory returned
   no browsers or native apps. Responsive CSS, focus styling, semantic links,
   headings, table associations and DOM order were reviewed in source, but actual
   mobile/desktop rendering, tab traversal, the mobile menu and form validation
   could not be exercised interactively. Review at 320, 375, 768, 1024 and 1440px,
   with keyboard-only navigation and zoom, before approving release.
3. Recheck live destination status and delivery after the eventual production
   deployment. Build a separate production export; do not upload the final
   local noindex export as the production release.
