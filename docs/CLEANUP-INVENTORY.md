# VelosShield — cleanup inventory (pending approval)

Prepared 2026-11-07. **Nothing here has been executed.** Every destructive item
requires explicit item-specific approval.

## Keep

| Resource | Value |
|---|---|
| GitHub repository | `jl090909/velos2` (all branches and history) |
| Local checkout | `/home/administrator/OTwebsite/velos2` |
| Vercel project | `veloshield-dreamhost` (`prj_bn2J2o2ye4EsExy42J9G3z4zZUA7`) |
| Production deployment | `dpl_HTjByg6qUKVNQDuipUzKv4ti8n4Z` at `e041a0baff` |
| Domains | `www.velosshield.com`, `velosshield.com` |
| Database / Blob / SES | Neon `neondb`, store `velos-media`, AWS SES `eu-west-1` |

## Local directories — proposed delete (~4.9 GB)

Every path below is fully contained in a verified archive under
`/home/administrator/velos-backups/20261107-website-recovery/historical-local-archives/`.
Archives pass `gzip -t`; every live file outside `.git`, `node_modules` and
`.next` is present; no process, systemd unit, git worktree or deployment
references them.

| Path | Size |
|---|---|
| `OTwebsite/veloshield-dreamhost` | 1.9 G |
| `OTwebsite/veloshield-shadcn` | 1.4 G |
| `OTwebsite/veloshield-dreamhost.bak.20260826_114716` | 1.1 G |
| `OTwebsite/veloshield-dreamhost.bak.20260826_114742` | 590 M |
| `OTwebsite/02-veloshield-product-site` | 60 K |

## GitHub — proposed archive (reversible)

`jl090909/veloshield-shadcn` — not the live source, no active Vercel consumer
(both dependent projects return 503), no CI/CD. History is preserved by the
reversible Archive operation and by the local archives. **No permanent delete.**

Do not merge `fix/site-qa-defects` or documentation PR #1: merging to `main`
triggers a Vercel production deployment.

## Vercel — proposed delete

| Project | ID | Domain state | Notes |
|---|---|---|---|
| `veloshield` | `prj_qZReYbxAo9481MFbkrWfAWCRYQLu` | 503 | no env, no storage, deployments BLOCKED |
| `veloshield-shadcn` | `prj_PmupDXfh3Py9XLG2e2CA2054pQA3` | 503 | no env, no storage |
| `velos2` | `prj_XIJ0TgHOHIQvudtAtegqm9jSuM5k` | 200 (duplicate) | **holds production storage links** |

### Blocking dependency on `velos2`

The `velos-media` Blob store and the `neon-citron-field` Neon integration list
`velos2` (`prj_XIJ0TgHOHIQvudtAtegqm9jSuM5k`) as their **only** connected
project. The project also holds 26 environment variables, including the
production `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `PAYLOAD_SECRET` and AWS
keys.

Re-attach both stores to `veloshield-dreamhost` — or confirm with Vercel that
team-owned stores survive project deletion — **before** removing that project.
The production project already carries a `BLOB_READ_WRITE_TOKEN` with the same
value, so the store stays reachable either way, but the integration link and the
env vars live on the duplicate project.

## Not touched

Canonical repository and checkout, production Vercel project and its domains,
env vars and deployments, the Neon database, the `velos-media` objects, AWS SES
identities and credentials, DNS and TLS, and every backup directory.
