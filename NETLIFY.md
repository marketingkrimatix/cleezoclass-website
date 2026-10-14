# Netlify deployment

Build command: `npm run build`

Publish directory: `out`

The included `netlify.toml` configures a static deployment. Import the repository,
or run the build locally and upload `out/` through manual deployment.
No functions, database, credentials or plugins are required.

See [README.md](./README.md) for the demonstration-only form behavior.

Canonical and sitemap URLs use `https://cleezoclass.com`. Netlify's production
build context enables indexing; deploy previews, branch builds and ordinary
local builds remain noindex. For a manual production export, set
`SITE_ENV=production` when building. Never upload that production export to a
preview host: robots metadata is baked into the static HTML. Build separately
for each environment. The existing form does not deliver demo requests; a live
submission service and delivery verification are still required before launch.
