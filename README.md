# Nichols Auto Repair

First design preview of a new independent website for Nichols Auto Repair in Wheat Ridge, Colorado. Inspired by the shop’s original Wix site, with locally stored Wix imagery supplied under the owner’s statement that they own or have rights to use those images. No AutoVitals photos, widgets, video assets, or code are reused.

## Develop

Use the existing checkout at `/workspace/Nichols-Auto-s-Website`. Cloud tasks are already isolated; do not create a worktree unless explicitly requested.

Requires Node.js 22.12+ (tested with 24.22.1) and npm. No database or credentials are needed for the preview.

```sh
cd /workspace/Nichols-Auto-s-Website
npm ci
npm run dev -- --port 4321
```

The environment runs a local development server. There is no public deployment and no domain change. Images, styles, and fonts are local; website visitors do not need access to Wix.

## Verify

```sh
npm run check
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Tests use the production build and start/stop their own preview server on port 4322. On another machine, install Playwright Chromium with `npx playwright install chromium` and omit the executable override. The development server can run separately on port 4321.

## Content and behavior

- Shared shop details and services: `src/data/site.ts`.
- Shared page structure: `src/layouts/Base.astro`.
- Visual design and mobile layouts: `src/styles/global.css`.
- Seventeen content pages plus a custom 404, robots.txt, and XML sitemap.
- Six service detail pages and three general educational guides. Guides are clearly distinguished from actual customer repair stories. No fabricated reviews, repair histories, credentials, or ratings.
- The contact form validates fields and prepares a `mailto:` email. It does not store inquiries, deliver email itself, or book appointments. A real appointment workflow is a separate integration.
- No ShopKey access, Neon connection, database replication, analytics, or third-party embeds have been added.
- Preview builds default to `noindex, nofollow` and disallow crawling. This is indexing guidance, not access control; use hosting authentication for a private public preview.

## Before launch

The owner confirmed **303-421-1414** for this site. Confirm the contact email, weekday hours, Saturday hours, Sunday closure, current staff photo, services/restoration scope, and all copy. Saturday times differ across the old sites, so this draft asks visitors to call. Confirm current financing and warranty terms before adding claims or application links. Review imagery and design with the owner.

Select hosting and a real inquiry/appointment workflow. Audit every existing URL and traffic data, implement and test redirects, review the privacy notice, confirm the Google Business Profile link, and test accessibility and the final mobile experience. The old domain’s email/DNS records must be preserved during cutover. Nothing should be pointed to the new site until the owner approves launch.

After approval, build with `SITE_LIVE=true npm run build` to enable indexing. Confirm canonical URLs, sitemap, robots.txt and privacy copy on the chosen host. Deployment and DNS cutover are not performed by these commands.

See `docs/DATA-PLAN.md` for the proposed future repair-story pipeline and `docs/ASSETS.md` for image provenance.

## Cloud environment persistence

The attempted save of `install_script` and `start_skill` could not be confirmed by the environment configuration service. The equivalent setup is retained in `scripts/setup.sh`; run it from this checkout. To restart the website, run `npm run dev -- --port 4321`. Files and dependencies may be captured by an environment snapshot, but running processes must be restarted. The setup script does not push code, publish the website, or change domain settings.

## Cloudflare Pages preview

The website branch is `preview/website`. Configure Cloudflare Pages with build command `npm run build` and output directory `dist`, using the repository root. Enable preview deployments for this branch. Keep `SITE_LIVE` unset or `false` for previews. Do not attach or change the live domain until launch is approved. No Cloudflare account configuration is managed by this repository.
