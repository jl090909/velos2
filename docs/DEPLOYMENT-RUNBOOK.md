# VelosShield website — deployment runbook

## Local development

```bash
cd /home/administrator/OTwebsite/velos2
npm install
cp .env.example .env      # fill DATABASE_URL, PAYLOAD_SECRET, server URLs
npm run dev               # Next dev server; Payload at /admin
```

The Payload server URL defaults to `http://localhost:3020`. `next.config.ts` allowlists
the WSL/LAN dev origins so the page hydrates when browsed from another device.

Useful scripts:

| Command | Purpose |
|---|---|
| `npm run build` | production build |
| `npm run payload generate:types` | regenerate Payload types |
| `npm run payload generate:importmap` | regenerate the admin import map |
| `npm run seed` | local admin/HR/tech accounts (local only) |
| `npm run verify:all` | CMS + publish + uploads + newsroom checks |

## Release process

Target flow: **local dev -> feature branch -> pull request -> checks -> merge to
`main` -> Vercel production deployment.**

1. Create a branch from `main`: `git checkout -b feat/<change>`.
2. Commit and push: `git push -u origin feat/<change>`.
3. Open a pull request against `main` (Vercel creates a preview deployment).
4. Verify the preview (see below). Do not run destructive scripts against the shared
   production database from a preview.
5. Merge to `main`. Vercel auto-deploys the merge commit to production.
6. Confirm the production deployment SHA matches the merge commit, then smoke-test.

There are no GitHub Actions and no deploy hooks; the Vercel Git integration is the only
deployment trigger. Do not run `vercel --prod` from a stale local checkout — the local
folder name is not evidence of the live source (see `docs/CONSOLIDATION-INVENTORY.md`).

## Post-deploy smoke test

Run against `https://www.velosshield.com`:

- `/` returns 200 and shows the expected navigation.
- `/resources/`, `/customers/`, `/partners/`, `/company/` return 200.
- `/admin/` redirects to the login and authenticates with a staff account.
- A media file referenced by a page resolves (Vercel Blob).
- The contact form renders and validates (do not submit real enquiries in a smoke test).

For a full CMS check: `CMS_URL=https://www.velosshield.com node scripts/verify-cms.mjs`
(creates and deletes its own records; safe to re-run).

## Scheduled publishing

Publishing is triggered by a cron calling `GET /api/payload-jobs/run/`. Until
`PAYLOAD_CRON_SECRET` and a cron entry are configured (see
`docs/PRODUCTION-DEPENDENCIES.md`), scheduled articles will not publish automatically.
To tick manually with an admin session:

```bash
CMS_URL=https://www.velosshield.com node scripts/verify-newsroom.mjs
```

## Documentation changes

Documentation lives in `docs/` on a branch, merged through the same PR flow. Never commit
credentials, database contents or exported secrets.
