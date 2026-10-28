# Cleezo Class production technical SEO audit

Audit date: 24 October 2026 (Asia/Calcutta). Site: https://www.cleezoclass.com/

## Outcome

All **33 sitemap URLs return HTTP 200 directly**, with their intended content. All 33 pages' normalized HTML text matches the local export, excluding script/style content. The three previously problematic feature URLs now serve their own pages, not the homepage.

Production has 33 unique titles, 33 unique H1s, one H1 per page, self-referencing www/trailing-slash canonicals and `index, follow` on every sitemap page. There are 30 unique descriptions: four role pages share one generic fallback. That fallback is fixed locally, pending deployment.

The complete URL-by-URL evidence, including exact metadata, HTTP status, inbound-page counts and schema types, is in [the CSV inventory](./production-seo-url-inventory-2026-10-24.csv). It records the **live pre-fix state**, not the updated local metadata.

## Issues, fixes and verification

| Priority | Affected URL(s) | Confirmed issue | Fix applied / required | Verification |
| --- | --- | --- | --- | --- |
| P1 | `/audit-missing-page-20261024/` and potentially other unknown routes | Unknown URL returns HTTP 200 with byte-identical homepage HTML: a soft-404 fallback. | Existing `deployment/nginx-static-locations.conf.example` supplies `try_files $uri $uri/ =404` and the exported 404 page. Requires host administrator to merge into the existing Nginx configuration, preserving CRM and SSL. | **Still live; not resolved remotely.** No server configuration access was available. Local static server already implements 404 responses. |
| P2 | `https://cleezoclass.com/` | Non-www homepage serves 200 instead of redirecting to www. Canonical points to www, so a consolidation signal exists, but the duplicate remains accessible. | Added a scoped host configuration example for non-www marketing requests. Preserve CRM locations. | **Host action pending.** HTTP variants redirect once to HTTPS on the same host; HTTPS non-www remains 200. |
| P2 | `/solutions/leaders/`, `/solutions/administrators/`, `/solutions/teachers/`, `/solutions/parents/` | Same generic meta description on four different role pages. | Metadata now reuses each page's existing approved `intro` verbatim. No page copy or titles rewritten. Open Graph and Twitter descriptions inherit the same correction. | **Fixed locally.** Production build and uniqueness/fallback regression checks pass. Live update requires deployment. |
| P2 | All nine `/school-management-system/*/` module pages | Breadcrumb parent points to `/school-management-system`, an HTML/client redirect alias, rather than the actual Platform page. | Breadcrumb parent now identifies `School Management Platform` at `/platform/`. | **Fixed locally.** Schema checks verify exported destinations and reject this legacy alias. Live parent was verified as HTTP 200 with a redirect notice. |
| P3 | Catch-all page breadcrumbs, including Solutions, modules and Resources | Schema item URLs omit canonical trailing slashes, introducing unnecessary redirects. | Standardized generated breadcrumb item URLs to trailing-slash canonical paths. | **Fixed locally.** All 31 breadcrumb objects pass structural and destination checks. |
| P2 opportunity | Homepage testimonial images | Three PNG portraits total 6,476,694 bytes (~6.48 MB). Static export disables runtime image optimization. | No image substitution made. Consider visually reviewed WebP/AVIF derivatives and responsive sources while retaining the supplied originals. | File sizes verified; not presented as a measured CWV failure. |

## Internal links and redirects

- No orphan among the 33 sitemap pages: each non-homepage URL has inbound links from another crawled page.
- No broken internal fragment targets found in the production crawl. Local export validation passed **1,058 internal link/anchor occurrences**.
- Homepage links reach ERP, SIS, Fee Management, Admission Management, Timetable, Resources and the evaluation checklist. These destinations return their intended content. ERP, SIS and the feature pages retain their existing contextual and navigation links; no unnecessary links were added.
- Resources hub and the three published resource articles are crawlable and linked. The checklist has inbound links; it is not an orphan.
- All 32 slashless sitemap-page variants redirect once to their trailing-slash URL, then return 200. Sitemap URLs themselves require no redirects.
- The shared login target `https://cleezoclass.com/CRM` redirects to `/CRM/` and returns 200 with the separate application's title. No authentication or form submission was performed; login functionality is outside this audit.
- No duplicate titles, H1s or exact page HTML bodies among sitemap entries. This is not a semantic/plagiarism analysis of overlapping product topics.

## Robots and indexing

- Live `robots.txt`: HTTP 200, `User-Agent: *`, `Allow: /`, correct www sitemap URL.
- Live sitemap: HTTP 200, 33 canonical HTTPS www URLs.
- All sitemap pages: `index, follow`, correct canonical; no conflicting X-Robots-Tag observed in captured page headers.
- Local explicit production build remains indexable. Existing context tests confirm preview/development and Netlify preview-host builds remain noindex. No actual preview deployment URL was supplied or audited.
- Indexing **eligibility** is verified; Google's actual indexed/selected-canonical status requires Search Console URL Inspection and was not verified here.

## Structured data

- All captured JSON-LD parses. Organization and WebSite entities are present across the site; their identity, URL, email and logo references agree with published site information.
- 31 pages expose BreadcrumbList objects. The homepage and How It Works page do not; their absence is not a required-property error. No new schema was added solely for completeness.
- Breadcrumb checks cover at least two ListItems, sequential positions, names and item destinations. The parent alias and URL-format defects above were corrected without changing visual breadcrumbs or page content.
- The Fee Management page's eight FAQ questions and answers match its HTML content. Existing FAQ markup is retained. Google discontinued FAQ rich results in May 2026; it should not be described as a current Google rich-result opportunity.
- No fabricated rating, review, price, product-offer or SoftwareApplication claims were introduced.
- This was a JSON-LD/content audit against Google's documentation, **not a completed Google Rich Results Test or Search Console validation**. Rich-result appearance is not guaranteed by valid markup.

References: [Google breadcrumb requirements](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [general structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Organization documentation](https://developers.google.com/search/docs/appearance/structured-data/organization), [FAQ rich-result deprecation](https://developers.google.com/search/updates#may-2026).

## Rendering, accessibility and performance

- Live mobile checks at a requested 375 × 812 viewport (360px document content width after scrollbar) covered Homepage, ERP, SIS, Fee Management, Admission Management, Timetable and Resources. Settled layouts showed visible H1s, no document-wide horizontal overflow and no failed loaded images. The timetable illustration uses its own horizontal table area; it did not create persistent page overflow.
- Desktop homepage at 1440 × 900: full H1 and paragraph visible without overlap. SIS at 768 × 1024: no horizontal overflow. These are targeted checks, not exhaustive visual certification of every section on all 33 pages.
- Pause Motion was tested live: it toggles the paused state and persists on navigation to Fee Management. Motion was resumed afterward. Existing reduced-motion CSS/GSAP guards and readable fallback content were reviewed in source; OS-level reduced-motion emulation was not exercised.
- Live homepage negotiates `Content-Encoding: gzip`. Uncompressed HTML is 293,250 bytes. Avoid adding further global animation/client dependencies; profile main-thread work before making animation changes.
- Large below-fold portraits are a transfer-budget opportunity. Their size alone does not establish poor LCP, INP or CLS.
- No field CWV values, Lighthouse scores or CrUX pass/fail are claimed. Validate p75 mobile/desktop LCP, INP and CLS using field data when available. Google's good thresholds are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1: [Core Web Vitals guidance](https://web.dev/articles/vitals).

## Local validation and deployment

- Production build passed (42 static entries).
- Export SEO validation passed: 33 sitemap pages, 1,058 internal links/anchors, unique feature content, canonical/robots checks.
- Solutions description regression check passed; 31 breadcrumb objects passed the new checker.
- Homepage, How It Works, ERP and SIS content/metadata checks passed. The How It Works check also tests indexing contexts.
- Targeted ESLint completed with no errors and two existing warnings in `components/site/pages.tsx` (unused import and an img recommendation).
- Approved visible copy, layout, animation behavior and enquiry forms were preserved. Only metadata/schema wiring and audit checks changed.

Deploy the complete fresh `out/` directory to publish the local fixes. Separately apply the reviewed Nginx changes and run `nginx -t` before reloading. Re-run `python scripts/audit-live-seo.py --fetch` after deployment; captured evidence is saved under `.seo-audit/2026-10-24/`. Recheck missing URLs and non-www redirects explicitly; changing Next.js metadata cannot correct the remote Nginx fallback.
