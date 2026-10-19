# Velos Shield Newsroom (CMS)

The Newsroom is the editorial feed at `/company/media/`, plus the desk that publishes it. Both are
data: no deploy is needed to publish a story.

| What | Where |
| --- | --- |
| Public Newsroom | `/company/media/` |
| A story | `/company/media/<slug>/` |
| Editorial desk | `/admin/newsroom` |
| Story editor | `/admin/collections/newsroom-articles` |
| Draft preview | `/newsroom-preview/<id>/` (staff only) |

## The workflow

**Create / Edit -> Save draft -> Preview -> Publish.** No approval queue, no second sign-off: an
authorised editor publishes directly, and the story is public on the next request.

* `admin` and `tech` write the Newsroom. `hr` owns Careers and cannot; `editor` stays read-only.
* Payload's own buttons do the transitions: `Save draft`, `Publish`, `Unpublish`.
* The desk at `/admin/newsroom` lists every story (drafts included) with title, category, derived
  status, created, updated, publication date, and the Edit / Preview / Publish / Unpublish actions.
* Preview opens the REAL public article layout for the current draft.

## Fields

Headline, URL slug (auto from the headline), standfirst/summary, body, category, featured toggle,
cover image + caption, author name and role, publication date, reading time, SEO title and
description, tags.

The body is the CMS rich-text editor: headings, paragraphs, lists, links, quotations, inline images
(uploaded to the same `media` collection) and a video embed block (YouTube, Vimeo or a direct
`.mp4`/`.webm`; anything else renders as a plain link, so an editor cannot inject arbitrary markup).

## Status: draft / scheduled / published

Payload owns the draft flag (`_status`). The three states the desk shows are DERIVED from it plus
two fields, in `src/lib/newsroom-meta.ts`:

| State | Meaning |
| --- | --- |
| Draft | saved, not public, and stays that way until someone clicks Publish |
| Scheduled | *"Publish automatically at the date above"* is ticked and the date is still in the future |
| Published | live on `/company/media/` |

There is deliberately **no `status` column**: a select field named `status` collides with the enum
Payload generates for `_status` (see docs/CMS.md). A plain draft can therefore carry any publication
date without going live - only the ticking of *Publish automatically* hands it to the scheduler.

## Draft isolation

Drafts and future-dated stories cannot reach the public surface:

* every reader in `src/lib/newsroom.ts` passes `overrideAccess: false` AND filters
  `_status = published` AND `publishAt <= now`;
* the sitemap lists published stories only (and returns an empty list rather than an error if the
  database is unreachable);
* `/newsroom-preview/<id>/` resolves the Payload session server-side and answers 404 to anyone who is
  not signed in as staff - it never confirms that the id exists;
* `npm run verify:newsroom` proves all four, including that an anonymous `?draft=true` API read
  returns nothing.

## Local development

```bash
docker run -d --name velos-payload-db --restart unless-stopped \
  -e POSTGRES_USER=velos -e POSTGRES_PASSWORD=velosdevpw -e POSTGRES_DB=velos_cms \
  -p 5433:5432 -v velos-payload-db-data:/var/lib/postgresql/data postgres:16-alpine
npm install
npm run dev -- -p 3020        # Payload pushes the schema on the first request
npm run verify:newsroom       # end-to-end Newsroom checks
```

**Serve the app on the port `NEXT_PUBLIC_SERVER_URL` names.** Payload derives its cookie-auth CSRF
allowlist from the server URL, so a dev server on a different port rejects the admin's own fetches
(logged in, then every button bounces to the login screen). If you must use another port, export
`NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` to match it.

A scripted client must present a cookie session the way a browser does: send `Sec-Fetch-Site:
same-origin` (or an `Origin` that matches the server URL). Payload refuses a cookie request that has
neither, which is correct behaviour, not a bug - `scripts/verify-newsroom.mjs` does exactly this.

## Scheduled publishing

Scheduling uses the job queue the CMS already runs - no second scheduler, no external service:

* the editor ticks *Publish automatically at the date above* and sets a future publication date;
* `src/tasks/newsroom-publish-due.ts` runs on a one-minute cron, publishes any draft that is due,
  and is idempotent (it only ever selects drafts).

The queue has to be *ticked*:

* **Long-running Node host** - `jobs.autoRun` in `src/payload.config.ts` ticks it in-process. This is
  how the local dev server behaves.
* **Serverless (Vercel)** - there is no long-lived process, so the platform must tick it:
  `GET /api/payload-jobs/run/` every minute. The endpoint is GET precisely so a platform cron can
  call it. Two things are required:
  1. `PAYLOAD_CRON_SECRET` set in the environment; the endpoint then accepts
     `Authorization: Bearer <secret>`. Without the secret only an admin/tech session may run the
     queue.
  2. a cron entry pointing at that path. Note Vercel's Hobby plan only allows once-per-day crons -
     minute-level ticks need Pro, or an external scheduler hitting the same URL.

## Schema and production

The newsroom adds `newsroom_articles` (+ versions and tags tables) and, because scheduling uses the
queue, `payload_jobs*`. Production Postgres does not auto-push schema: generate and apply migrations
(additively, with a backup first) exactly as described in docs/CMS.md.

## Verification

```bash
CMS_URL=http://localhost:3020 node scripts/verify-newsroom.mjs
```

Creates its own records and deletes them again, so it is safe to re-run against any environment. It
covers authorisation, draft creation and rich text, draft isolation, preview gating and accuracy,
immediate publication, editing, unpublishing, category filtering, search, scheduled publication
(including that an ordinary draft is never swept up by the publisher), image upload, the desk, and
regression on the existing site pages.
