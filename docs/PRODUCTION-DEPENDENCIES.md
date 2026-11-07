# VelosShield website — production dependencies

Verified 2026-11-07 against the live Vercel project. Secret values are never recorded
here; only variable names, targets and non-secret configuration.

## Vercel project

| Field | Value |
|---|---|
| Project | `veloshield-dreamhost` (`prj_bn2J2o2ye4EsExy42J9G3z4zZUA7`) |
| Team | `team_4YQnqm1UWKrtXoJHkDlurr3Z` |
| Git link | `jl090909/velos2`, production branch `main` |
| Framework / Node | `nextjs` / `24.x` |
| Production domains | `www.velosshield.com`, `velosshield.com` |
| Cron jobs | **none configured** |

### Environment variables (production + preview)

| Name | Type | Present | Notes |
|---|---|---|---|
| `DATABASE_URL` | encrypted | yes | PostgreSQL (Neon) connection string |
| `PAYLOAD_SECRET` | encrypted | yes | Payload auth/session signing |
| `BLOB_READ_WRITE_TOKEN` | encrypted | yes | Vercel Blob media storage |
| `AWS_ACCESS_KEY_ID` | encrypted | yes | SES sender credentials |
| `AWS_SECRET_ACCESS_KEY` | encrypted | yes | SES sender credentials |
| `AWS_REGION` | plain | yes | e.g. `eu-west-1` |
| `SES_FROM` | plain | yes | Verified SES sender address |
| `CONTACT_TO` | plain | yes | Comma-separated recipient list |
| `PAYLOAD_PUBLIC_SERVER_URL` | plain | yes | Production origin |
| `NEXT_PUBLIC_SERVER_URL` | plain | yes | Production origin |
| `PAYLOAD_CRON_SECRET` | — | **no** | Required for cron-triggered queue runs |

## AWS SES

- Used by `src/app/(site)/api/contact/route.ts` for all three forms (contact, demo,
  partnership).
- Sender: `SES_FROM` (must remain verified in the SES region).
- Recipients: `CONTACT_TO` (multiple allowed; the route splits and validates them).
- Credentials: `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in the Vercel env.
- The route applies a per-IP rate limit (5/hour) and a honeypot field.
- **No test email may be sent without explicit approval.**

## Payload CMS

- Collections: `Users`, `Media`, `NewsroomArticles`, `Jobs`, `Whitepapers`,
  `KnowledgeHubArticles`, `Customers`, `Events`, `PressMentions`.
- Roles: `admin`, `hr`, `tech`, `editor`.
- Admin: `/admin`; custom Newsroom desk at `/admin/newsroom`.
- Draft/preview/publish workflows and versions are native Payload features.
- `cors`/`csrf` allowlist: production origin, `www.velosshield.com`, and the
  `veloshield-dreamhost.vercel.app` alias.

## Database (PostgreSQL / Neon)

- Adapter: `@payloadcms/db-postgres`, connection string in `DATABASE_URL`.
- Schema baseline: `db/schema.sql`.
- Production Postgres does not auto-apply schema. Migrations must be generated and
  applied additively, with a verified backup first. **Never reset/reseed/drop
  production.**
- Preview deployments share the same database unless explicitly isolated; do not run
  destructive scripts against production.

## Vercel Blob (media)

- Plugin: `@payloadcms/storage-vercel-blob`; token in `BLOB_READ_WRITE_TOKEN`.
- The `Media` collection stores uploads in Blob; payloads reference them by stored path.
- `next.config.ts` allowlists `/api/media/file/**` for local image patterns.

## Scheduled publishing — currently NOT ticking (action required)

The Newsroom scheduler (`src/tasks/newsroom-publish-due.ts`) runs on a one-minute cron
and publishes drafts whose `publishAt` has arrived. On serverless it must be ticked by a
platform cron calling:

```
GET /api/payload-jobs/run/
```

Two things are required (per `docs/NEWSROOM.md`):

1. `PAYLOAD_CRON_SECRET` set in the Vercel environment, sent as
   `Authorization: Bearer <secret>`.
2. A cron entry pointing at that path. Vercel's Hobby plan only allows once-per-day
   crons; minute-level ticks need Pro or an external scheduler.

**Current state:** neither is configured. `GET /api/payload-jobs/run/` returns
`401 Unauthorized` without an admin session, and the project has no cron jobs. Scheduled
publication therefore does not run in production until this is fixed. This is a
pre-existing gap, not caused by the consolidation.

## Backup and restore

- Database: take a Neon dump before any migration or resource change. Store it outside
  the repository.
- Blob: retain the store; do not delete the media bucket while the site is live.
- Vercel: previous deployments remain available for instant rollback (see
  `docs/ROLLBACK-RUNBOOK.md`).
