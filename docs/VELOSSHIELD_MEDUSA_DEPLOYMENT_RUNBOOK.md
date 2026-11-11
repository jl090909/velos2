# VelosShield + Medusa Deployment Runbook

**File:** `docs/VELOSSHIELD_MEDUSA_DEPLOYMENT_RUNBOOK.md`  
**Repository:** `jl090909/velos2` (owned, private)  
**Branch:** `feature/branded-customer-emails` (PR #3 open, not merged)  
**Scope:** VelosShield marketing/CMS website (Next.js) + Medusa commerce backend (separately hosted) + branded email pipeline.  
**Status:** Local POC verified. No production deployment or PR merge performed.  
**Last verified:** 2026-11-11 (AstraRP-1).  
**Owner:** VelosShield engineering.

> End-user note: every `http://127.0.0.1:*` / `http://localhost:*` URL in this runbook is an **operator-only** local address. End users must never receive localhost links; production traffic uses the published Vercel domain and a separately hosted Medusa backend URL.

---

## 1. Version and revision inventory

| Item | Value |
|---|---|
| velos2 working tree HEAD (this task) | `989be0fec1fd872e0f00f89c075f3a22b283d70c` |
| velos2 pre-doc parent commit | `a079ee8` |
| commerce-upstream HEAD (pinned) | `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f` |
| Medusa version | `2.22.3` (`@medusajs/medusa`, `@medusajs/framework`, `@medusajs/cli`) |
| Node engine (upstream) | `>=22.23.4` (container uses Node 24) |
| Local Node observed | `v22.22.3` |
| Next.js (website) | `^16.3.8` |
| Payload CMS | `^3.91.0` |
| Payload Postgres adapter | `@payloadcms/db-postgres ^3.91.0` |
| AWS SES SDK | `@aws-sdk/client-ses ^3.1131.0` |
| Postgres (compose) | `postgres:17.5` |
| Redis (compose) | `redis:7.4-alpine` |
| Node container (Medusa) | `node:24-bookworm` |
| pnpm | `10.11.1` (via corepack) |
| Docker compose project (commerce) | `velos-commerce-poc` |
| Docker compose project (licensing) | `velos-license-poc` |

`UNVERIFIED`: production Vercel Node/runtime version and production Medusa hosting version are not pinned in this repo; treat as `PLANNED`.

---

## 2. Observed vs proposed

| Item | Status |
|---|---|
| Website local `http://127.0.0.1:9052` | **Observed/verified** (running) |
| Medusa backend local `http://127.0.0.1:9050` | **Observed/verified** (Docker, `/health` OK) |
| Legacy Medusa storefront `http://127.0.0.1:9051` | **Observed/running**, reference-only |
| Payload Postgres `127.0.0.1:9054` | **Observed/verified** |
| Medusa Postgres + Redis (Docker internal) | **Observed/verified** |
| VS Core sidecar `http://127.0.0.1:9053` | **Observed/verified** (boundary only) |
| VS Core app `http://127.0.0.1:4011` | **Observed/verified** (separate stack) |
| Keygen CE `https://keygen.localhost:9445` | **Observed/verified** (boundary only) |
| velos2 feature branch + PR #3 | **Observed/verified** |
| Synthetic `order.placed` event trigger end-to-end | **BLOCKED** (no synthetic event harness; subscriber load verified) |
| Vercel production hosting of Medusa backend | **Proposed/PLANNED** (not implemented) |
| Medusa Cloud / container hosting | **Proposed/PLANNED** |

---

## 3. Repository and worktree map

| Path | Role | Branch | HEAD (observed) | Remote | Ownership |
|---|---|---|---|---|---|
| `/home/administrator/velosshield-commerce-poc/website` | velos2 working tree (authoritative for this task) | `feature/branded-customer-emails` | `989be0f` | `https://github.com/jl090909/velos2.git` (owned) | VelosShield |
| `/home/administrator/velosshield-commerce-poc/commerce-upstream` | upstream Medusa starter (read-only vendor source) | `feature/velosshield-commerce-poc` | `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f` | `https://github.com/medusajs/dtc-starter.git` (public, NEVER push) | Medusa upstream (vendor) + VelosShield overlay |
| `/home/administrator/OTwebsite/velos2` | canonical production website checkout | (do not touch) | `c979e39f566a7fb0c174b74465ca844e78e8c0da` | n/a | Production (read-only here) |
| `/home/administrator/velosshield-commerce-poc/licensing` | Keygen CE + VS Core licensing POC | n/a | n/a | local compose | Keygen/VS Core boundary |
| `/home/administrator/velosshield-commerce-poc/device-agent` | VS Core sidecar (Ed25519 verification) | n/a | n/a | local | VS Core boundary |
| `/home/administrator/velosshield-commerce-poc/keygen-upstream` | Keygen CE upstream source | n/a | n/a | n/a | Keygen boundary |

Rules:
- Do NOT copy the upstream `.git`, `node_modules`, or the whole starter into velos2. Only the minimal overlay in `integrations/medusa/backend` is tracked.
- `/home/administrator/OTwebsite/velos2` is production and must remain untouched by this work.
- `commerce-upstream` remote is `medusajs/dtc-starter` and is **READ-ONLY** upstream. Never push to it.

---

## 4. Local service inventory (AstraRP-1)

| Service | Container / process | Host:Port | Data store | Source repo / path | Branch / SHA | Ownership | Purpose | Health URL |
|---|---|---|---|---|---|---|---|---|
| Website (Next.js + Payload CMS) | `next-server` PID ~415089 | `0.0.0.0:9052` | Payload Postgres (`DATABASE_URL`); Email outbox Postgres (`EMAIL_DATABASE_URL`) | `jl090909/velos2` / `/home/administrator/velosshield-commerce-poc/website` | `feature/branded-customer-emails` @ `989be0f` | VelosShield | Marketing, CMS, account, commerce proxy, secured notification route | `http://127.0.0.1:9052/` → 200 |
| Medusa backend / Admin | Docker `velos-commerce-poc-medusa-1` (`node:24-bookworm`) | `127.0.0.1:9050` (container 9000) | Medusa Postgres `medusa_pg`; Redis `medusa_redis` | `medusajs/dtc-starter` @ `a6f6...` + velos2 overlay | upstream `feature/velosshield-commerce-poc` + overlay | Medusa upstream + VelosShield overlay | Commerce API, cart, orders, payments, Admin | `http://127.0.0.1:9050/health` → `OK` |
| Medusa Admin HMR (dev only) | same container | `127.0.0.1:9055` (container 5173) | n/a | same as Medusa | same | Medusa upstream | Admin Vite HMR websocket | n/a (dev only) |
| Medusa Postgres | Docker `velos-commerce-poc-postgres-1` (`postgres:17.5`) | internal 5432 | volume `medusa_pg` | compose service | n/a | infrastructure | Medusa order/cart/payment state | `pg_isready` (healthy) |
| Medusa Redis | Docker `velos-commerce-poc-redis-1` (`redis:7.4-alpine`) | internal 6379 | volume `medusa_redis` | compose service | n/a | infrastructure | Event bus / cache (Redis required for production) | TCP 6379 |
| Payload Postgres | Docker `velos-commerce-poc-payload_postgres-1` (`postgres:17.5`) | `127.0.0.1:9054` | volume `payload_pg` | compose service | n/a | infrastructure | CMS content (local; production uses Neon) | TCP 9054 |
| Legacy Medusa storefront | `next-server` PID ~1150181 | `*:9051` | none local (Medusa API) | `commerce-upstream/apps/storefront` | upstream `a6f6...` | Medusa upstream (reference only) | Reference storefront; **not** for end users | `http://127.0.0.1:9051/` → 200 (reference only) |
| VS Core sidecar (licensing) | `MainThread` PID ~1407887 (`device-agent/server.mjs`) | `127.0.0.1:9053` | device-agent state files (ignored) | `/home/administrator/velosshield-commerce-poc/device-agent` | n/a | VS Core boundary | Ed25519 signature verification; read-only probe of VS Core | `http://127.0.0.1:9053/` |
| VS Core application | Docker `otguard-otguard-1` (`otguard:offline`) | `0.0.0.0:4011` | Mongo `otguard-mongo-1` (port 27018) | separate VS Core 1.1 stack | n/a | VS Core (boundary) | Licence/IDS dashboard; **do not change** | `http://127.0.0.1:4011/` |
| Keygen CE API | Docker `velos-license-poc-web-1` (`keygen/api:latest`) | `127.0.0.1:9045` | Keygen Postgres `kg_pg` | Keygen CE upstream | n/a | Keygen (boundary) | Licence issuance API | `https://keygen.localhost:9445/v1/health` (TLS internal) |
| Keygen CE worker | Docker `velos-license-poc-worker-1` | internal | same Postgres/Redis | same | n/a | Keygen (boundary) | Background jobs | internal |
| Keygen Postgres | Docker `velos-license-poc-postgres-1` (`postgres:17.5`) | internal 5432 | volume `kg_pg` | compose service | n/a | Keygen (boundary) | Keygen data | `pg_isready` (healthy) |
| Keygen Redis | Docker `velos-license-poc-redis-1` (`redis:7.4-alpine`) | internal 6379 | volume `kg_redis` | compose service | n/a | Keygen (boundary) | Keygen cache/queue | TCP |
| Keygen Caddy (TLS) | Docker `velos-license-poc-caddy-1` (`caddy:2.10-alpine`) | `127.0.0.1:9445` | `caddy_data`, `caddy_config` | compose service | n/a | Keygen (boundary) | Internal TLS termination | HTTPS health |
| OT Guard Mongo (VS Core dep) | Docker `otguard-mongo-1` (`mongo:8.0`) | `0.0.0.0:27018` | Mongo volume | separate stack | n/a | VS Core (boundary) | VS Core data | TCP 27018 |

Boundary rule: Keygen CE, VS Core 1.1, and OT Guard Mongo are **dependencies/boundaries only**. Do not modify their code, data, containers, or configuration as part of VelosShield/Medusa work. The sidecar at 9053 is read-only.

---

## 5. VelosShield-owned overlay (tracked in velos2)

```
integrations/medusa/manifest.json
integrations/medusa/backend/src/subscribers/order-placed-email.ts
integrations/medusa/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts
scripts/medusa-overlay.sh
docs/VELOSSHIELD_MEDUSA_DEPLOYMENT_RUNBOOK.md
```

Existing website email pipeline (from VSW-9):
`src/app/api/commerce/notifications/order-confirmation/route.ts`, `src/lib/email/*`, tests.

### Checksums (SHA-256, verified 2026-11-11)

- `order-placed-email.ts`: `55bbbbeae6126c66cf47651c4adb876a025d6012909f739279dbe573c88dcef2`
- `order-placed-email.unit.spec.ts`: `bedabe5f647368b67de3b6107f727bfee349d6d3875715db7ef92a0eded2adf9`

`manifest.json` pins upstream commit `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f` and Medusa `2.22.3`. The manifest checksums were corrected on 2026-11-11 to match the committed source (previous manifest values were stale).

---

## 6. Prerequisites

- Node.js `>=22.23.4` (container uses 24; local `v22.22.3`)
- pnpm via corepack for Medusa backend
- Docker + Docker Compose
- PostgreSQL 17.5 (provided by compose)
- Redis 7.4 (provided by compose)
- AWS credentials available to Next.js runtime for SES (env only, never committed)
- Untracked env files: website `.env.local`, commerce `apps/backend/.env`
- Access to AstraRP-1 for local verification

---

## 7. Reproducible fetch / setup / build / start

### 7.1 Fetch VelosShield owned repo

```bash
git clone https://github.com/jl090909/velos2.git
cd velos2
git checkout feature/branded-customer-emails
git pull --ff-only
```

### 7.2 Fetch upstream Medusa (READ-ONLY)

```bash
git clone https://github.com/medusajs/dtc-starter.git commerce-upstream
cd commerce-upstream
git checkout a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f
```

Do not commit or push to `commerce-upstream`. It is vendor source.

### 7.3 Website (port 9052)

```bash
cd /home/administrator/velosshield-commerce-poc/website
npm install
# development:
npm run dev          # next dev --hostname 0.0.0.0 --port 9052
# production-style:
npm run build
npm run start
```

### 7.4 Overlay VelosShield-owned subscriber into Medusa

```bash
/home/administrator/velosshield-commerce-poc/website/scripts/medusa-overlay.sh \
  --source /home/administrator/velosshield-commerce-poc/website \
  --target /home/administrator/velosshield-commerce-poc/commerce-upstream
```

Copies only:
- `integrations/medusa/backend/src/subscribers/order-placed-email.ts` → `apps/backend/src/subscribers/order-placed-email.ts`
- `integrations/medusa/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts` → `apps/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts`

Validates SHA-256 against `integrations/medusa/manifest.json`. Expected output: `Checksum validation: OK (all overlay files)`.

### 7.5 Medusa backend (port 9050)

```bash
cd /home/administrator/velosshield-commerce-poc/commerce-upstream
docker compose -f compose.poc.yaml up -d
curl http://127.0.0.1:9050/health   # expect OK
```

### 7.6 Safe Docker service operation

```bash
# Start only required services:
docker compose -f compose.poc.yaml up -d postgres redis payload_postgres medusa

# Stop without destroying data:
docker compose -f compose.poc.yaml stop

# Restart:
docker compose -f compose.poc.yaml restart medusa

# NEVER:
docker compose -f compose.poc.yaml down --volumes   # destroys isolated test data
```

Volumes to preserve: `medusa_pg`, `medusa_redis`, `payload_pg`, and (licensing) `kg_pg`, `kg_redis`, `caddy_data`, `caddy_config`.

---

## 8. Environment variable names (values never committed)

### Website (`.env.local`)

- `DATABASE_URL` (Payload Postgres)
- `EMAIL_DATABASE_URL` (notification outbox Postgres)
- `SES_FROM_EMAIL`, `SES_REPLY_TO`, `AWS_REGION`
- `ORDER_CONFIRMATION_WEBHOOK_SECRET`
- `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SERVER_URL`
- `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`
- `MEDUSA_ADMIN_API_KEY` / `MEDUSA_SECRET_API_KEY` (optional, for admin reads)

Observed redacted sample (names only, values withheld):

```dotenv
DATABASE_URL=<redacted>
EMAIL_DATABASE_URL=<redacted>
SES_FROM_EMAIL=noreply@rathon.ai
SES_REPLY_TO=demo@velosshield.com
AWS_REGION=eu-west-1
ORDER_CONFIRMATION_WEBHOOK_SECRET=<redacted>
PAYLOAD_SECRET=<redacted>
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:9052
NEXT_PUBLIC_SERVER_URL=http://localhost:9052
MEDUSA_BACKEND_URL=http://localhost:9050
MEDUSA_PUBLISHABLE_KEY=<redacted>
```

### Medusa backend (`apps/backend/.env`)

- `DATABASE_URL`, `REDIS_URL`
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- `JWT_SECRET`, `COOKIE_SECRET`
- `NEXT_APP_URL`
- `ORDER_CONFIRMATION_WEBHOOK_SECRET`
- `MEDUSA_PUBLISHABLE_KEY` (consumed by subscriber via env; no hardcoded fallback)

Fail-closed contract:
- The subscriber fails closed if any of `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`, `NEXT_APP_URL`, `ORDER_CONFIRMATION_WEBHOOK_SECRET` is missing.
- The Next route fails closed if `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`, or `ORDER_CONFIRMATION_WEBHOOK_SECRET` is missing.

### SES
- Sender: `noreply@rathon.ai`
- Region: `eu-west-1`
- No AWS access key IDs, secret access keys, or session tokens are stored or printed in this runbook.

---

## 9. Initialization and migration safeguards

- Payload schema is managed by Payload (`withPayload`); run `npm run build` to validate.
- Email outbox table `email_notifications` is created lazily via `ensureNotificationSchema()` on first use. No manual migration required, but back up `EMAIL_DATABASE_URL` before changes.
- Medusa migrations are handled by Medusa CLI; run `medusa build` / `medusa start` only after overlay and env validation.
- Do not run `down --volumes`; preserve Docker volumes.
- Rotate `ORDER_CONFIRMATION_WEBHOOK_SECRET` in both runtimes simultaneously.
- `MEDUSA_PUBLISHABLE_KEY` must match the Medusa backend's publishable key; mismatch causes 401/403.

---

## 10. Browser checkout → SES order event diagram

```
[Browser checkout on Medusa storefront/Admin flow]
          |
          | order created / payment captured
          v
[Medusa backend emits event: order.placed]
          |
          v
[Subscriber: integrations/.../order-placed-email.ts]
  - loads order from Medusa (/store/orders/{id})
  - gates payment_status in {captured, partially_captured, authorized}
  - blocks order_status in {canceled, archived, failed}
  - retries trigger up to 3 times (500ms backoff)
          |
          | POST /api/commerce/notifications/order-confirmation
          | header: x-velos-internal-secret (timing-safe compare)
          v
[Next.js route (src/app/api/commerce/notifications/order-confirmation/route.ts)]
  - fail-closed env checks
  - validates orderId regex
  - fetches order from Medusa with publishable key
  - re-applies payment/order status gates
  - acquireNotification (Postgres outbox, dedup key order_confirmation:<orderId>)
  - renders branded HTML/text email
  - sendTemplatedEmail via SES eu-west-1
  - markNotificationSent (SES MessageId) or markNotificationFailed (retry in 60s, max 5)
          |
          v
[SES eu-west-1 sends from noreply@rathon.ai]
          |
          v
[Postgres outbox row: email_notifications (status sent/failed/dead)]
```

Triggers: Medusa `order.placed` event only.  
Security failure modes:
- Missing shared secret / env → 401 or 500, no email.
- Secret mismatch → 401 (timing-safe compare, no length leak).
- Missing `MEDUSA_BACKEND_URL` / `MEDUSA_PUBLISHABLE_KEY` → 500.
- Invalid `orderId` → 400.
- Payment not captured/authorized → skipped (200, no email).
- Canceled/archived/failed order → skipped.
- Order without email → 400.
- Duplicate dedup key → `already_sent` / in-flight handling, no duplicate send.
- SES failure → outbox row marked failed with retry; exhausted → `dead`.

---

## 11. Health checks

```bash
curl http://127.0.0.1:9050/health          # expect: OK
curl -o /dev/null -w '%{http_code}\n' http://127.0.0.1:9052/   # expect: 200
curl -o /dev/null -w '%{http_code}\n' http://127.0.0.1:9051/   # expect: 200 (reference storefront only)
curl http://127.0.0.1:9053/                 # VS Core sidecar status
docker ps --filter name=velos-commerce-poc
```

Medusa subscriber load (observed in container logs):
```
info: Processing order.placed which has 1 subscribers
```

---

## 12. Tests and expected results

### Website (velos2)
- `npm run lint` → 0 errors (11 pre-existing warnings)
- `npm run build` → PASS
- TS tests (with `.env.local` loaded): `node --import ./node_modules/tsx/dist/loader.mjs --test tests/*.test.ts` → **14 pass** (email-templates 3, notification-store 4, http-security 7)
- `node tests/http.test.mjs` → **8 pass**
- `python3 tests/smoke_local.py` → 45 PASS / 0 FAIL (observed 2026-11-09; UNVERIFIED on this run)

### Medusa (commerce-upstream)
- Overlay: `scripts/medusa-overlay.sh ...` → `Checksum validation: OK (all overlay files)`
- Unit: `TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules jest ... src/subscribers` → **8/8 PASS**
- `/health` → `OK`
- Subscriber runtime → `Processing order.placed which has 1 subscribers`

### Blocked
- Controlled synthetic `order.placed` end-to-end trigger → **BLOCKED** (no synthetic event harness in local Medusa). Subscriber load and unit logic verified; outbox update not exercised by a real event. No real customer email sent. Labeled `BLOCKED`/`UNVERIFIED`.

---

## 13. Deployment verification checklist

- [ ] `git status` clean on `feature/branded-customer-emails`
- [ ] `scripts/medusa-overlay.sh` checksums OK
- [ ] Medusa `/health` OK
- [ ] Website root 200
- [ ] Website lint 0 errors
- [ ] Website build PASS
- [ ] Website tests 14/14
- [ ] Medusa unit tests 8/8
- [ ] No secrets in `git diff` / `git grep`
- [ ] PR #3 still open, not merged
- [ ] Plane/Kiwi governance IDs recorded (section 18)

---

## 14. Log locations

- Website dev server: foreground terminal running `npm run dev` (no persistent file by default; use `nohup`/service manager in production; UNVERIFIED for daemonized logs).
- Next.js build: `.next/` (regenerable).
- Medusa container: `docker logs velos-commerce-poc-medusa-1`
- Medusa watcher restarts: visible in container logs (`[Watcher] ...`).
- Postgres (Medusa/Payload): `docker logs velos-commerce-poc-postgres-1`, `...-payload_postgres-1`
- Email outbox: PostgreSQL table `email_notifications` in `EMAIL_DATABASE_URL` database.
- VS Core sidecar: foreground terminal running `device-agent/server.mjs`.
- VS Core app: `docker logs otguard-otguard-1`
- Keygen: `docker logs velos-license-poc-web-1`, `...-worker-1`
- Licensing compose: `docker logs` per service.

---

## 15. Backup / rollback / recovery

- **Git:** all changes on `feature/branded-customer-emails`; PR #3 open, not merged. Rollback = revert commit(s) or close PR.
- **Database:** Medusa/Payload/Email Postgres run in Docker volumes (`medusa_pg`, `payload_pg`, `kg_pg`). Back up with `pg_dump` before any schema change. No production DB touched.
- **Overlay rollback:** re-run overlay from a previous velos2 commit, or restore `apps/backend/src/subscribers/order-placed-email.ts` from git in commerce-upstream (vendor file was untracked originally).
- **Website:** `.next` build artifacts regenerable; source is git.
- **Secrets:** never commit; rotate `ORDER_CONFIRMATION_WEBHOOK_SECRET` in both runtimes simultaneously.
- **Volume preservation:** never `docker compose down --volumes`.

---

## 16. Secure upgrade procedure

1. Pull latest `feature/branded-customer-emails` in velos2.
2. Review diff for secrets (`git grep` patterns).
3. Re-run overlay script into a fresh Medusa checkout at the pinned upstream commit.
4. Run Medusa unit tests + website lint/build/tests + smoke.
5. Verify Medusa `/health` and website root.
6. Update manifest checksums if subscriber changed.
7. Update Plane VSW and Kiwi evidence (new run, do not overwrite).

---

## 17. Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Medusa `/health` fails | container down or port conflict | `docker ps`; check logs; ensure compose up |
| Subscriber not loaded | file path wrong or syntax error | check `apps/backend/src/subscribers/`; logs for watcher errors |
| Next route returns 401 | secret mismatch | verify `ORDER_CONFIRMATION_WEBHOOK_SECRET` identical in both envs |
| Next route returns 500 "medusa backend not configured" | missing env | set `MEDUSA_BACKEND_URL` / `MEDUSA_PUBLISHABLE_KEY` |
| Subscriber logs missing env | backend `.env` incomplete | populate required var names |
| Email not sent | SES sandbox / unverified identity | check SES config; notification outbox shows failed + retry |
| Duplicate emails | should not occur | dedup key `order_confirmation:<orderId>`; check notification store |
| Overlay checksum mismatch | manifest stale or file modified | recompute SHA-256 and update manifest; do not edit subscriber silently |
| Broken localhost link reported by end user | localhost URL leaked in UI/email | remove from templates/UI; use production domain |

---

## 18. Governance references

### Plane (project `VSW` — VelosShield Website)
- VSW-9: VelosShield branded emails security remediation (Done) — trusted trigger, fail-closed secured Next route, PostgreSQL atomic notification outbox with retries, mandatory `EMAIL_DATABASE_URL`.
- VSW-10: VelosShield Medusa integration source/deploy reproducibility (In Progress) — parent follow-up item; this runbook and the documentation acceptance case link to it.
- This documentation task links to VSW-9 (requirement) and VSW-10 (parent follow-up).

### Kiwi TCMS (product `VelosShield Website`, id 12; plan 75)
- Plan: `TP-VSW Email Notification Remediation Acceptance` (id 75).
- Run 172: original acceptance run (untouched).
- Run 173: integration overlay + subscriber reproducibility (cases 6412–6418).
- Run 175: documentation acceptance for this runbook (case 6440, status PASSED). Case 6440 category `Documentation & Deployment` (id 71). Synthetic trigger remains BLOCKED in case 6418.

### GitHub
- PR #3 (open, not merged) on `jl090909/velos2`, branch `feature/branded-customer-emails`.

---

## 19. Safe release process (PR #3)

1. Keep all work on `feature/branded-customer-emails`.
2. Run full verification (section 13).
3. Push branch to `origin` (no merge).
4. Open/update PR #3 with summary, tests, governance IDs.
5. Request review; do not merge without approval.
6. After approval, merge via GitHub UI; Vercel deploys from `main`.
7. Medusa backend is deployed separately (section 20), not by Vercel.

No production changes were made by this task.

---

## 20. Vercel website vs separately hosted Medusa backend (target design)

- **Website (Next.js)** → Vercel (existing `veloshield-dreamhost` project ← `jl090909/velos2` main). Hosts CMS, marketing, and the secured notification route + outbox.
- **Medusa backend** → separately hosted (not on Vercel; Vercel serverless is unsuitable for long-running Medusa + Postgres + Redis). Proposed: container host (Fly.io / Render / VPS) with managed Postgres + Redis, or Medusa Cloud, or keep local for POC. `PLANNED`/`UNVERIFIED`.
- **Integration boundary:** Medusa subscriber → HTTPS POST to `https://<website>/api/commerce/notifications/order-confirmation` with `x-velos-internal-secret`. No direct DB sharing.
- **CORS:** `STORE_CORS`/`ADMIN_CORS`/`AUTH_CORS` must include the website origin in production.
- **Secrets:** provisioned via host secret manager; never in repo.
- **KEYGEN separate:** Keygen CE and VS Core remain separate stacks (licensing compose, otguard stack). They are not part of the Vercel/Medusa deployment and must not be changed by website release work.

---

## 21. Local vs production differences

| Aspect | Local POC | Production target |
|---|---|---|
| Website host | `next dev` on 9052 | Vercel (main branch) |
| Medusa host | Docker dev on 9050 | Separate container host / Medusa Cloud |
| Event bus | in-memory (dev) | Redis (required) |
| DB | Docker Postgres | Managed Postgres |
| CMS DB | local Payload Postgres | Neon (production) |
| Email | SES sandbox | Production SES with verified domain |
| Secrets | untracked `.env` files | host secret manager |
| CORS | localhost origins | production origins |
| Subscriber trigger | verified loaded; synthetic trigger blocked | must be verified in staging first |

---

## 22. Fresh install runbook (new engineer)

1. Obtain access to AstraRP-1 and credentials out-of-band (never from this repo).
2. Clone `jl090909/velos2` and checkout `feature/branded-customer-emails`.
3. Clone `medusajs/dtc-starter` into `commerce-upstream`; checkout `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f`.
4. Create website `.env.local` with required var names (values from secret store); create commerce `apps/backend/.env`.
5. `npm install` in website; `corepack enable`; verify pnpm.
6. Run overlay script; confirm checksums OK.
7. Start commerce compose; wait for Postgres healthy.
8. Start website dev server on 9052.
9. Run health checks and tests.
10. Do not start licensing/VS Core stacks unless needed; they are separate boundaries.

---

## 23. Upgrade runbook

1. Pull latest branch; review diff.
2. If upstream Medusa version changes, update `manifest.json` (`upstream.commit`, `medusa_version`) and recompute checksums.
3. Re-run overlay; run Medusa unit tests.
4. Run website lint/build/tests; smoke if available.
5. Verify `/health` and root.
6. Update this runbook's version section and last-verified timestamp.
7. Add new Kiwi run/case for the upgrade; do not modify existing runs.
8. Push branch; update PR #3.

---

## 24. CI/CD plan (PLANNED/UNVERIFIED)

- **Website:** GitHub Actions on `jl090909/velos2` → lint, build, tests; Vercel deploy on merge to `main`. `UNVERIFIED` (not yet configured in repo).
- **Medusa overlay:** CI step runs `scripts/medusa-overlay.sh` and fails on checksum mismatch; runs Medusa unit tests.
- **Secrets:** injected via GitHub/Vercel/host secret managers; never committed.
- **Governance:** update Plane VSW and Kiwi TCMS on each verified change (new run, do not overwrite).
- **Rollback:** revert commit or close PR; redeploy previous Vercel build; restore Medusa from previous image/commit.

---

## 25. No production changes

No production deployment, no PR merge, no production DB/secret changes were made. All verification is local. Canonical production checkout `/home/administrator/OTwebsite/velos2` was not modified.
