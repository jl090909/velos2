# VelosShield website — architecture

Canonical source of truth for the VelosShield corporate website. This document describes
the live system as verified on 2026-11-07. See `docs/CONSOLIDATION-INVENTORY.md` for the
full resource inventory and the evidence behind these statements.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.8 (App Router, Turbopack, `trailingSlash: true`) |
| UI | React 19.2.8, Tailwind CSS 4, shadcn/ui, Base UI |
| CMS | Payload CMS 3.91 (`src/payload.config.ts`) |
| Database | PostgreSQL via `@payloadcms/db-postgres` (Neon) |
| Media storage | Vercel Blob via `@payloadcms/storage-vercel-blob` |
| Email | AWS SES via `@aws-sdk/client-ses` |
| Runtime | Node 24.x on Vercel |

## Repository layout

```
velos2/
  src/
    app/
      (site)/            public site pages (product, resources, customers, partners, company, ...)
      (site)/api/contact form handler (contact / demo / partnership)
      (payload)/         Payload admin + REST/GraphQL API
    collections/         Payload collections (see below)
    access/              role helpers
    tasks/               Payload job-queue tasks (newsroom publishing)
    lib/, components/    shared code and UI
  db/schema.sql          production schema
  scripts/               seed, migrate and verify helpers
  docs/                  this documentation set
```

## CMS collections

`Users`, `Media`, `NewsroomArticles`, `Jobs`, `Whitepapers`, `KnowledgeHubArticles`,
`Customers`, `Events`, `PressMentions`.

Roles: `admin` (full), `hr` (careers), `tech` (whitepapers + knowledge hub), `editor` (read).

Admin UI: `/admin`. A custom Newsroom desk is registered at `/admin/newsroom`.

## Environments

| Env | URL |
|---|---|
| Production | `https://www.velosshield.com` (apex `https://velosshield.com` also serves) |
| Vercel alias | `https://veloshield-dreamhost.vercel.app` |
| Local dev | `http://localhost:3020` (Payload server URL; the Next dev server is 3000) |

`PAYLOAD_PUBLIC_SERVER_URL` / `NEXT_PUBLIC_SERVER_URL` are set to the production origin
in Vercel; locally they default to `http://localhost:3020`.

## Request flow

1. Browser -> Vercel edge -> Next.js route.
2. Public pages read published Payload documents through the local Payload SDK (no HTTP
   round-trip to a separate CMS origin).
3. `/api/contact` validates the form, enforces a per-IP rate limit and a honeypot, then
   sends via SES to the configured recipients.
4. `/admin/*` is session-cookie authenticated; role access is enforced in `src/access`.

## Build and deploy

- Build command: `next build` (Node 24.x).
- Output: server-rendered Next.js + Payload routes.
- Trigger: Git push to `main` (Vercel Git integration). No GitHub Actions, no deploy hooks.
- Preview deployments: created for other branches; they must never be used to write
  production data (see `docs/PRODUCTION-DEPENDENCIES.md`).
