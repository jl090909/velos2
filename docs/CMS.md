# Velos Shield CMS (Payload 3)

The marketing site and its CMS run in one Next.js application. Payload is mounted at `/admin`, the
public site lives in the `(site)` route group, and the CMS internals live in `(payload)`.

Everything HR and the tech team publish is data, not code: no deploy is needed to add a role,
a whitepaper or a Knowledge Hub article.

## What is editable

| Collection                 | Slug                      | Who can write          | Appears on                                     |
| -------------------------- | ------------------------- | ---------------------- | ---------------------------------------------- |
| Job openings               | `jobs`                    | admin, hr             | `/company/careers`, `/company/careers/<slug>`  |
| Whitepapers & case studies | `whitepapers`             | admin, tech           | `/resources`                                   |
| Knowledge Hub articles     | `knowledge-hub-articles`  | admin, tech           | `/resources/knowledge-hub`, `.../<slug>`       |
| Media (images + PDFs)      | `media`                   | admin, hr, tech       | referenced by the collections above            |
| Staff accounts             | `users`                   | admin                 | CMS login only                                 |

Roles: `admin` (everything, including deleting and staff accounts), `hr` (Careers), `tech`
(Resources), `editor` (read only). Role separation is enforced server side and covered by
`npm run verify:cms`.

Publishing rules:

* Collections use Payload drafts. A record only reaches the site when it is published
  (`_status = published`). Drafts are invisible to anonymous visitors even with `?draft=true`.
* Job openings additionally have `postingStatus` (`open` / `closed`). Setting a role to `closed`
  removes it from the site without deleting the record.
* Editing a record calls `revalidatePath` through `src/hooks/revalidate.ts`, so the prerendered
  pages update on the next request instead of waiting for the 5 minute ISR window.

## Local development

```bash
docker run -d --name velos-payload-db --restart unless-stopped \
  -e POSTGRES_USER=velos -e POSTGRES_PASSWORD=velosdevpw -e POSTGRES_DB=velos_cms \
  -p 5433:5432 -v velos-payload-db-data:/var/lib/postgresql/data postgres:16-alpine

npm install
npm run dev -- -p 3020     # Payload pushes the schema to the database on first request
npm run seed               # idempotent: staff accounts, roles, whitepapers, articles
npm run verify:all         # access-control + publishing checks against the running server
```

`.env` (gitignored, chmod 600) needs DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL and the
three SEED_* email/password pairs; see `.env.example`.

The seeded passwords exist only in `.env`: read them from there, or use Forgot password in the CMS
once an email adapter is configured. Create real accounts in `/admin` > Settings > Users and delete
the `.test` seed accounts before going live.

## Verification

`npm run verify:cms` (20 checks) proves over HTTP that:

* each seeded account authenticates and carries the expected role
* anonymous visitors can read published content but never user accounts
* HR cannot touch Knowledge Hub articles, Tech cannot touch job openings, neither can create staff
  accounts, and only admin can delete
* drafts never leak, including with `?draft=true`

`npm run verify:publish` (7 checks) proves the publishing loop: a role published through the API by
HR appears on `/company/careers` on the next request, disappears when set to `closed`, and a
Knowledge Hub article from Tech appears on `/resources/knowledge-hub`.

Both suites create throwaway records and delete them again, so they are safe to run against a
staging environment.

## Known environment constraints

* **The Payload CLI / tsx scripts do not run in this workspace.** `payload run`,
  `payload generate:importmap` and `payload generate:types` crash inside undici 7.29.1
  (`TypeError: Illegal constructor` from `CacheStorage`) when loaded through tsx, on Node 22 and
  Node 26 alike. The seed and verification scripts therefore speak REST over HTTP
  (`scripts/cms-http.mjs`), which also exercises the same surface the deployed site uses. The import
  map shipped in the repository is the one Payload needs for a config without custom admin
  components.
* **`trailingSlash: true` applies to the API too.** `/api/jobs` answers 308 and redirects to
  `/api/jobs/`. Always call the Payload REST API with a trailing slash; the scripts do.
* **Local media is written to `/media`** (gitignored) and served through `/api/media/file/...`.
  Serverless hosts need object storage instead (see below).
* **Node:** Next.js 16.3.3 or newer is required by `@payloadcms/next`; this repo runs 16.3.8. Node 22
  LTS is the safe runtime here (Node 26 works for Next itself but is not what the Payload toolchain
  is tested against).
* **Do not name a select field `status`** in a collection that also uses drafts: both the field and
  Payload's `_status` map onto the same generated postgres enum (`enum_<collection>_status`) and the
  schema push fails with `invalid input value for enum`.

## Production deployment

The application is unchanged in shape: Vercel (or any Node host) runs `npm run build` and
`npm run start`. What the CMS adds is state:

| Concern          | Local                  | Production requirement                                        |
| ---------------- | ---------------------- | ------------------------------------------------------------- |
| Database         | docker Postgres (5433) | managed Postgres (`DATABASE_URL`), e.g. Vercel Postgres/Neon   |
| Uploads          | `/media` on disk       | object storage (Vercel Blob, S3 or R2)                         |
| PAYLOAD_SECRET   | `.env`                 | host secret, unique per environment                            |
| Schema changes   | dev-mode push          | generate and run migrations (`payload migrate`) in CI/CD       |
| Email            | logged to console      | SMTP/SES adapter, required for password resets                 |

The build reads the database: `/company/careers`, `/resources` and `/resources/knowledge-hub` are
prerendered. Readers are wrapped in try/catch, so a database outage during the build degrades those
sections to an empty state instead of failing the build, and the pages recover on the next ISR
revalidation.
