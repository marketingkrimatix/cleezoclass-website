# SEO fixes and deployment verification

Updated 21 October 2026.

## Verified issue

The public host identifies itself as Nginx. The fee, admission and timetable URLs returned HTTP 200 with byte-identical homepage HTML; a deliberately nonexistent URL did the same. The fee URL still showed this behavior on 21 October. The existing Next.js routes and static exports contain the correct dedicated pages. This points to deployed files or hosting fallback behavior; the remote server configuration was not accessible.

## Changes

- Standardized canonical, sitemap and structured-data origin to `https://www.cleezoclass.com`, with trailing slashes on page canonicals.
- Explicit production builds are indexable; preview, development and Netlify preview-host builds remain noindex,follow.
- Removed four student-passbook references from homepage, ERP and SIS content without adding replacement claims.
- Added a static-export SEO checker and updated existing checks for canonical/indexing settings and the existing homepage ERP link.
- Added an Nginx location configuration example and complete-export deployment instructions in `NETLIFY.md`.
- No forms, URL slugs, design or animations changed.

## Validation

- Production build passed: 42 generated static entries.
- Preview and production export checks passed for all 33 sitemap pages: unique page metadata, one H1, canonical, robots, dedicated feature content and absence of passbook claims.
- 1,058 internal links and anchors resolved against the export. The separate `/CRM` application is excluded and needs host-side verification.
- Local HTTP checks returned 200 with each intended exported HTML document for all 33 sitemap pages; an unknown route returned 404.
- Homepage, How It Works, ERP, SIS and Solutions HTML checks passed.
- Feature-page desktop and 375px mobile layout checks showed correct headings and no horizontal overflow. No layout changes were needed.
- Targeted lint passed. Full-project lint remains blocked by an existing `react-hooks/set-state-in-effect` error at `components/site/motion.tsx:20`, plus 21 warnings in unchanged files. This unrelated motion implementation was left intact.

## Required deployment steps

1. Build the production artifact with `SITE_ENV=production` (PowerShell: `$env:SITE_ENV='production'; npm.cmd run build`). Run `python scripts/check-seo-export.py --production`.
2. Deploy the complete contents of `out/`, preserving folders, including `features/`, `_next/`, robots.txt and sitemap.xml.
3. Merge `deployment/nginx-static-locations.conf.example` into the existing www HTTPS virtual host, preserving SSL and CRM configuration. Remove homepage fallback behavior for nonexistent routes. Validate with `nginx -t` before reload.
4. Verify all sitemap URLs on the live host return their intended content and metadata, and nonexistent routes return 404. Check canonical-host redirects on the host without disrupting CRM.

The live deployment is not complete: server access was unavailable. Static robots metadata is fixed at build time; use a separate noindex preview build or redirect production aliases to the canonical host. Do not publish the indexable production artifact on a preview hostname.
