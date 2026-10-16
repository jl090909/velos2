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
| Customers                  | `customers`               | admin, tech           | `/customers`                                   |
| Events                     | `events`                  | admin, tech           | `/company/events`, `/company/events/<slug>`    |
| Press & media mentions     | `press-mentions`          | admin, tech           | `/company/media`                               |
| Uploads (images + PDFs)    | `media`                   | admin, hr, tech       | referenced by the collections above            |
| Staff accounts             | `users`                   | admin                 | CMS login only                                 |

Roles: `admin` (everything, including deleting and staff accounts), `hr` (Careers), `tech`
(Resources), `editor` (read only). Role separation is enforced server side and covered by
`npm run verify:cms`.

Navigation (as of the Company/Resources restructure):

    Industries | Trust | Products (dropdown) | Resources (dropdown) | Customers | Partners | Company (dropdown)

* Company dropdown order: About, Events, Media, Leadership, Careers, Contact Us.
* Resources dropdown: White Papers & Case Studies, Knowledge Hub.
* `/product` and `/velossensor` are intentionally NOT in the navigation - they remain live pages reachable by
  URL only. Re-adding either means editing the `links` array in `src/components/Navbar.tsx`.

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

## Draft leakage - the trap that matters most

Payload's **Local API bypasses access control by default**. A server-side `payload.find()` therefore returns
drafts even when the same query over REST correctly returns published documents only, and the leak shows up on
the rendered page rather than in any API test:

* every reader in `src/lib/cms.ts` passes `overrideAccess: false` **and** an explicit published filter
* `npm run verify:publish` covers this: it creates drafts, asserts they do NOT appear on
  `/customers`, `/company/events` and `/company/media`, then publishes them, asserts they appear, and deletes them

Any new reader added to `src/lib/cms.ts` must copy that pattern.

## Applying schema changes to the production database

Production Postgres (Neon) does not auto-push the schema. Adding collections means a schema change, and the
safe procedure is additive:

```bash
# 1. push locally first: run `npm run dev` once so the dev database gains the new tables
# 2. refresh the committed schema: dump the local database (docker exec ... pg_dump --schema-only)
# 3. back up production before touching it
docker run --rm postgres:18-alpine pg_dump --dbname "$PROD_URL" > /root/velos-neon-backup-$(date +%s).sql
# 4. diff schema to schema and apply only what is missing (new types, sequences, tables, indexes,
#    constraints) plus ALTER TABLE ADD COLUMN for shared tables such as payload_locked_documents_rels
#    which gains one column per collection
```

Notes learned the hard way: a pg16 `pg_dump` refuses a pg18 server ("server version mismatch"), so use a
version-matched client container; and object ordering matters - types, then sequences, then tables, then new
columns, then indexes, then constraints, or the foreign keys reference columns that do not exist yet. The
schema move is additive: no data is dropped and a full data backup is taken first.

## Upload storage

Uploads land on local disk in development and in Vercel Blob in production:

* `vercelBlobStorage` is registered with `token: process.env.BLOB_READ_WRITE_TOKEN`. The plugin documents
  that it disables itself when the token is missing, so local development keeps writing to `/media` and needs
  no cloud credentials - the same collection schema is used in both cases because
  `alwaysInsertFields: true` is set.
* `clientUploads` is enabled with an admin/hr/tech access rule, so the browser sends files straight to the
  blob store and whitepaper PDFs are not capped by the 4.5MB Vercel Function request limit.
* Client uploads need `VercelBlobClientUploadHandler` in Payload's import map
  (`src/app/(payload)/admin/importMap.js`). `payload generate:importmap` cannot run in this workspace (the
  CLI dies inside undici under tsx), so that single entry is maintained by hand. If the plugin or Payload is
  upgraded, re-check that the key still matches the string the plugin injects
  (`@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler`).
* The client-upload route (`/api/payload-blob-upload`) is registered by the plugin only when it is active,
  so it answers 404 on a deployment without `BLOB_READ_WRITE_TOKEN`. That is expected, not a misconfiguration.
* `npm run verify:uploads` proves the whole path in whichever mode the target runs: it uploads an image,
  asserts the storage mode from the returned URL (`local-disk` vs `vercel-blob`), fetches the file back,
  attaches it as a customer logo, checks it renders on `/customers`, then deletes everything. Expect it to
  fail with a 500 upload on a Vercel deployment until the Blob store exists.
* Uploading through the REST API needs the other fields as JSON in a `_payload` part of the multipart body;
  plain sibling form fields are ignored and validation fails with "Alt is required".
* The store itself is created in the Vercel dashboard (Storage -> Create Database -> Blob). Vercel's API is
  read-only for stores, so this step cannot be automated from CI or a script.

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
