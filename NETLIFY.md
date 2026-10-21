# Netlify deployment

Build command: `npm run build`

Publish directory: `out`

The included `netlify.toml` configures a static deployment. Import the repository,
or run the build locally and upload `out/` through manual deployment.
No functions, database, credentials or plugins are required.

See [README.md](./README.md) for the demonstration-only form behavior.

Canonical and sitemap URLs use `https://www.cleezoclass.com`. Netlify's production
build context enables indexing; deploy previews, branch builds and ordinary
local builds remain noindex. For a manual production export, set
`SITE_ENV=production` when building. Never upload that production export to a
preview host: robots metadata is baked into the static HTML. Build separately
for each environment. The existing form does not deliver demo requests; a live
submission service and delivery verification are still required before launch.


The current public host responds as Nginx. See `deployment/nginx-static-locations.conf.example`
for a location snippet to merge into its existing virtual host. Upload the **entire**
`out/` directory contents, including `features/`, `_next/`, route payloads, robots.txt
and sitemap.xml. Do not flatten the folders or upload only index.html. Unknown URLs
must return 404, never the homepage with status 200. Preserve existing CRM locations.

When Netlify's site URL (`URL`, falling back to `DEPLOY_PRIME_URL`) ends in
`.netlify.app`, the artifact remains noindex even in its production context.
For a custom-domain production build, configure the primary site URL as
`https://www.cleezoclass.com`. A single static artifact cannot vary its HTML robots
by request hostname: use separate preview builds, or redirect production aliases to
www at the host. Do not replace existing CRM host routing with a blanket redirect.

Run `python scripts/check-seo-export.py --production` after a production build;
omit `--production` for preview/development exports. Verify the live host again
following deployment, including a nonexistent route returning HTTP 404.
