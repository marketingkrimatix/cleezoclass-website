# Production SEO release — 24 October 2026

## Status

Built and validated locally; **not uploaded or applied to production**. No production SSH destination, document root, hosting-panel session or deployment command has been supplied. All four changes therefore still require the hosting administrator or an authenticated deployment route.

The release archive contains the complete static site under `site/`, Nginx merge examples under `configuration/`, and a SHA-256 manifest. The site directory is the contents of the validated production `out/` export, not a preview build. It contains no CRM application directory.

## Apply the release

1. Inspect the existing Nginx virtual hosts and determine the marketing document root. Back up the active marketing release and relevant Nginx configuration. Preserve the current CRM root, aliases, proxy/application configuration, certificates and all enquiry integration settings.
2. Stage the full `site/` contents in a new marketing release directory. Deploy all route directories and `_next` assets together. Do not replace a shared parent directory or use a deleting sync against a directory containing CRM. If the marketing and CRM applications share a root, resolve their separate mappings before changing roots.
3. In the **existing www HTTPS** marketing location, merge `nginx-static-locations.conf.example`: resolve real files/directories and otherwise return 404. Remove any inherited homepage fallback or `error_page 404 =200 /index.html` behavior for marketing requests. Ensure `/404.html` is available in the marketing root. Keep more-specific CRM/application locations intact.
4. In the **existing non-www HTTPS** host, merge `nginx-canonical-host.conf.example`. The marketing `location /` returns HTTP 301 to `https://www.cleezoclass.com$request_uri`. Do not add a server-level return that intercepts CRM. Preserve existing `/CRM` and `/CRM/` application routing and inspect regex locations for precedence. HTTP hosts must continue reaching HTTPS; do not redirect CRM to www.
5. Run `nginx -t` against the actual installed configuration. Reload only after it succeeds. A local example cannot validate the production root, SSL, included files or CRM location precedence.
6. Publish/switch the staged marketing release using the host's existing deployment method. Retain the previous release for rollback; do not overwrite CRM or change forms.

## Required verification

From this project, keeping the matching `out/` artifact, run:

```powershell
python scripts/verify-production-seo-fixes.py
python scripts/audit-live-seo.py --fetch
```

The first check must pass for all four Solutions descriptions and all nine module breadcrumb objects, the 404 probe, three non-www 301 probes (including a query string), and the public CRM response baseline. The second crawl checks the 33 sitemap pages and their links. Inspect the audit's reported issues, not merely its process exit code.

Also verify canonical trailing slashes on the remaining generated breadcrumbs, all sitemap pages remain indexable, and a host administrator checks CRM through its existing operational procedure. Do not submit demo, quote or CRM forms as part of this SEO release.

Public CRM baseline: `https://cleezoclass.com/CRM` returns 301 to `https://cleezoclass.com/CRM/`; the latter returns 200 with the CRM application HTML. Public HTTP checks do not certify authenticated CRM behavior.

## Local validation

- Production build: passed, 42 generated static entries.
- Export SEO checks: passed for 33 sitemap pages and 1,058 internal link/anchor occurrences.
- Solutions checks: passed, four distinct descriptions using existing approved introductory text.
- Breadcrumb checks: passed, 31 objects with ordered items and valid exported destinations.
- No approved visible content, design, animation, CRM or enquiry-form changes are included in these fixes.

## Latest production check before deployment

All 13 affected pages return HTTP 200 but still contain the old metadata/schema. The missing-route probe returns HTTP 200. All three non-www marketing probes return HTTP 200 without the required redirect. Both CRM public baseline checks pass. **None of the four fixes is verified as deployed.**
