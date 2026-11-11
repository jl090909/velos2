# VelosShield + Medusa Deployment Runbook

**Repository:** `jl090909/velos2` (owned)  
**Branch:** `feature/branded-customer-emails`  
**Scope:** VelosShield marketing/CMS website (Next.js) + Medusa commerce backend (separately hosted) + branded email pipeline.  
**Status:** Local POC verified. No production deployment or PR merge performed.

---

## 1. Observed vs proposed

| Item | Status |
|---|---|
| Website local `http://127.0.0.1:9052` | **Observed/verified** (running) |
| Medusa backend local `http://127.0.0.1:9050` | **Observed/verified** (Docker, /health OK) |
| Payload Postgres `127.0.0.1:9054` | **Observed/verified** |
| Medusa Postgres + Redis (Docker internal) | **Observed/verified** |
| velos2 feature branch + PR #3 | **Observed/verified** |
| Synthetic `order.placed` event trigger end-to-end | **BLOCKED** (no synthetic event harness; subscriber load verified) |
| Vercel production hosting of Medusa backend | **Proposed** (not implemented) |

---

## 2. Repository and worktree inventory

| Path | Role | Branch | HEAD (observed) | Remote |
|---|---|---|---|---|
| `/home/administrator/velosshield-commerce-poc/website` | velos2 working tree (authoritative for this task) | `feature/branded-customer-emails` | `a079ee8` (pre-task) | `https://github.com/jl090909/velos2.git` (owned) |
| `/home/administrator/velosshield-commerce-poc/commerce-upstream` | upstream Medusa starter (read-only vendor source) | `feature/velosshield-commerce-poc` | `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f` | `https://github.com/medusajs/dtc-starter.git` (public, NEVER push) |
| `/home/administrator/OTwebsite/velos2` | canonical production website checkout | (do not touch) | n/a | n/a |

**Pinned upstream commit:** `a6f6b866f6f3b08c7d2c557805bf728ccf9ddc9f`  
**Medusa version:** `2.22.3` (`@medusajs/medusa`, `@medusajs/framework`, `@medusajs/cli`)  
**Node engine:** `>=22.23.4` (container uses Node 24)

Do NOT copy the upstream `.git`, `node_modules`, or the whole starter into velos2. Only the minimal overlay in `integrations/medusa/backend` is tracked.

---

## 3. Local topology (AstraRP-1)

### Processes / containers

| Service | Container / process | Port (host) | Health |
|---|---|---|---|
| Website (Next.js dev) | `node ./node_modules/.bin/next dev` (PID ~415067) | `0.0.0.0:9052` | `GET /` → 200 |
| Medusa backend | Docker `velos-commerce-poc-medusa-1` (`node:24-bookworm`) | `127.0.0.1:9050` (container 9000) | `GET /health` → `OK` |
| Medusa HMR | same container | `127.0.0.1:9055` (container 5173) | n/a |
| Medusa Postgres | Docker `velos-commerce-poc-postgres-1` | internal 5432 | healthy |
| Medusa Redis | Docker `velos-commerce-poc-redis-1` | internal 6379 | up |
| Payload Postgres | Docker `velos-commerce-poc-payload_postgres-1` | `127.0.0.1:9054` | up |

### URLs

- Website: `http://127.0.0.1:9052` (also `http://localhost:9052`)
- Medusa store/admin: `http://127.0.0.1:9050`
- Payload admin: `http://127.0.0.1:9052/admin` (embedded in Next)
- Medusa HMR: `http://127.0.0.1:9055`

### Compose file

`/home/administrator/velosshield-commerce-poc/commerce-upstream/compose.poc.yaml` (project `velos-commerce-poc`).

---

## 4. VelosShield-owned files tracked in velos2

```
integrations/medusa/manifest.json
integrations/medusa/backend/src/subscribers/order-placed-email.ts
integrations/medusa/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts
scripts/medusa-overlay.sh
docs/VELOSSHIELD_MEDUSA_DEPLOYMENT_RUNBOOK.md
```

Plus existing website email pipeline (from VSW-9): `src/app/api/commerce/notifications/order-confirmation/route.ts`, `src/lib/email/*`, tests.

### Checksums (SHA-256)

- `order-placed-email.ts`: `0d234173bcf3c5d233436707d5f126850c88b03667afe5d3e344e52ec896de74`
- `order-placed-email.unit.spec.ts`: `e43499fcad4d829b2b369adae19a6c11b3704eaf1bbad11b88a623c4a1454bb2`

---

## 5. Prerequisites

- Node.js `>=22.23.4` (container uses 24)
- pnpm (via corepack) for Medusa backend
- Docker + Docker Compose
- PostgreSQL 17.5 (provided by compose)
- Redis 7.4 (provided by compose)
- AWS credentials available to Next.js runtime for SES (env, not committed)
- Untracked env files: website `.env.local`, commerce `apps/backend/.env`

---

## 6. Setup / build / start

### Website (port 9052)

```bash
cd /home/administrator/velosshield-commerce-poc/website
npm install
npm run dev          # next dev --hostname 0.0.0.0 --port 9052
# production-style:
npm run build
npm run start
```

### Medusa backend (port 9050)

```bash
cd /home/administrator/velosshield-commerce-poc/commerce-upstream
# overlay VelosShield-owned subscriber first
/home/administrator/velosshield-commerce-poc/website/scripts/medusa-overlay.sh \
  --source /home/administrator/velosshield-commerce-poc/website \
  --target /home/administrator/velosshield-commerce-poc/commerce-upstream
docker compose -f compose.poc.yaml up -d
# health
curl http://127.0.0.1:9050/health   # expect OK
```

### Overlay sync (checksum-validated)

```bash
scripts/medusa-overlay.sh --source <velos2-checkout> --target <commerce-upstream-checkout>
```

Copies only:
- `integrations/medusa/backend/src/subscribers/order-placed-email.ts` → `apps/backend/src/subscribers/order-placed-email.ts`
- `integrations/medusa/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts` → `apps/backend/src/subscribers/__tests__/order-placed-email.unit.spec.ts`

Validates SHA-256 against `integrations/medusa/manifest.json`.

---

## 7. Environment variable names (values never committed)

### Website (`.env.local`)

- `DATABASE_URL` (Payload Postgres)
- `EMAIL_DATABASE_URL` (notification outbox Postgres)
- `SES_FROM_EMAIL`, `SES_REPLY_TO`, `AWS_REGION`
- `ORDER_CONFIRMATION_WEBHOOK_SECRET`
- `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SERVER_URL`
- `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`

### Medusa backend (`apps/backend/.env`)

- `DATABASE_URL`, `REDIS_URL`
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- `JWT_SECRET`, `COOKIE_SECRET`
- `NEXT_APP_URL`
- `ORDER_CONFIRMATION_WEBHOOK_SECRET`
- `MEDUSA_PUBLISHABLE_KEY` (consumed by subscriber via env; no hardcoded fallback)

The subscriber **fails closed** if any of `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY`, `NEXT_APP_URL`, `ORDER_CONFIRMATION_WEBHOOK_SECRET` is missing. The Next route fails closed if `MEDUSA_BACKEND_URL` or `MEDUSA_PUBLISHABLE_KEY` or `ORDER_CONFIRMATION_WEBHOOK_SECRET` is missing.

---

## 8. Dependencies

- **Postgres (Medusa):** order storage, cart, payment status.
- **Postgres (Payload):** CMS content.
- **Postgres (Email outbox):** `EMAIL_DATABASE_URL` durable notification store with dedup keys, lease/retry, exhaustion.
- **Redis:** Medusa event bus / cache (local in-memory bus is used in dev; not production-grade).
- **SES:** email delivery (sandbox/verified identities only in dev).
- **Notification outbox:** idempotent `order_confirmation:<orderId>` dedup keys.

---

## 9. Health and acceptance tests

### Automated (observed)

- Website lint: `npm run lint` → 0 errors (11 pre-existing warnings)
- Website build: `npm run build` → PASS
- Website TS tests: `node --import ./node_modules/tsx/dist/loader.mjs --test tests/*.test.ts` with `.env.local` loaded → 14 pass (email-templates 3, notification-store 4, http-security 7)
- HTTP tests: `tests/http.test.mjs` → 8 pass
- Smoke: `python3 tests/smoke_local.py` → 45 PASS / 0 FAIL
- Medusa unit: `TEST_TYPE=unit ... jest` → 8/8 PASS (order-placed subscriber)
- Medusa /health: `curl http://127.0.0.1:9050/health` → `OK`
- Website root: `curl http://127.0.0.1:9052/` → 200

### Subscriber runtime (observed)

- Medusa logs: `Processing order.placed which has 1 subscribers` → subscriber loaded.
- Unit tests: missing env fail-closed; allowed/blocked payment statuses; canceled/archived/failed order statuses; Next trigger call with secret; 4xx no retry; 5xx retry (3 attempts); network error handling.

### Blocked

- **Controlled synthetic `order.placed` event trigger end-to-end** → BLOCKED (no synthetic event harness in local Medusa). Subscriber load and unit logic verified; outbox update not exercised by a real event. No real customer email sent.

---

## 10. Backup / rollback / recovery

- **Git:** all changes on `feature/branded-customer-emails`; PR #3 open, not merged. Rollback = revert commit(s) or close PR.
- **Database:** Medusa/Payload/Email Postgres run in Docker volumes (`medusa_pg`, `payload_pg`). Back up with `pg_dump` before any schema change. No production DB touched.
- **Overlay rollback:** re-run overlay from a previous velos2 commit, or manually restore `apps/backend/src/subscribers/order-placed-email.ts` from git in commerce-upstream (vendor file was untracked originally).
- **Website:** `.next` build artifacts regenerable; source is git.
- **Secrets:** never commit; rotate `ORDER_CONFIRMATION_WEBHOOK_SECRET` in both runtimes simultaneously.

---

## 11. Secure upgrade procedure

1. Pull latest `feature/branded-customer-emails` in velos2.
2. Review diff for secrets (`git grep` patterns).
3. Re-run overlay script into a fresh Medusa checkout at the pinned upstream commit.
4. Run Medusa unit tests + website lint/build/tests + smoke.
5. Verify Medusa /health and website root.
6. Update manifest checksums if subscriber changed.
7. Update Plane VSW and Kiwi evidence (new run, do not overwrite).

---

## 12. Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Medusa /health fails | container down or port conflict | `docker ps`; check logs; ensure compose up |
| Subscriber not loaded | file path wrong or syntax error | check `apps/backend/src/subscribers/`; logs for watcher errors |
| Next route returns 401 | secret mismatch | verify `ORDER_CONFIRMATION_WEBHOOK_SECRET` identical in both envs |
| Next route returns 500 "medusa backend not configured" | missing env | set `MEDUSA_BACKEND_URL` / `MEDUSA_PUBLISHABLE_KEY` |
| Subscriber logs missing env | backend `.env` incomplete | populate required var names |
| Email not sent | SES sandbox / unverified identity | check SES config; notification outbox shows failed + retry |
| Duplicate emails | should not occur | dedup key `order_confirmation:<orderId>`; check notification store |

---

## 13. Vercel website vs separately hosted Medusa backend (target design)

- **Website (Next.js)** → Vercel (existing `veloshield-dreamhost` project ← `jl090909/velos2` main). Hosts CMS, marketing, and the secured notification route + outbox.
- **Medusa backend** → separately hosted (not on Vercel; Vercel serverless is unsuitable for long-running Medusa + Postgres + Redis). Proposed: container host (e.g., Fly.io / Render / VPS) with managed Postgres + Redis, or keep local for POC.
- **Integration boundary:** Medusa subscriber → HTTPS POST to `https://<website>/api/commerce/notifications/order-confirmation` with `x-velos-internal-secret`. No direct DB sharing.
- **CORS:** `STORE_CORS`/`ADMIN_CORS`/`AUTH_CORS` must include the website origin in production.
- **Secrets:** provisioned via host secret manager; never in repo.

---

## 14. Local vs production differences

| Aspect | Local POC | Production target |
|---|---|---|
| Website host | `next dev` on 9052 | Vercel (main branch) |
| Medusa host | Docker dev on 9050 | Separate container host |
| Event bus | in-memory | Redis (required) |
| DB | Docker Postgres | Managed Postgres |
| Email | SES sandbox | Production SES with verified domain |
| Secrets | untracked `.env` files | host secret manager |
| CORS | localhost origins | production origins |
| Subscriber trigger | verified loaded; synthetic trigger blocked | must be verified in staging first |

---

## 15. Governance references

- **Plane:** project `VSW` (VelosShield Website). VSW-9 (branded emails remediation, Done). VSW-10 (Medusa integration source/deploy reproducibility, In Progress).
- **Kiwi TCMS:** product `VelosShield Website` (id 12). Plan `TP-VSW Email Notification Remediation Acceptance` (id 75). Run 172 (original, untouched). New run 173 (integration overlay + subscriber reproducibility; cases VSW-EMAIL-13..19). Cases 6412–6418.
- **GitHub:** PR #3 (open, not merged) on `jl090909/velos2`.

---

## 16. No production changes

No production deployment, no PR merge, no production DB/secret changes were made. All verification is local.
