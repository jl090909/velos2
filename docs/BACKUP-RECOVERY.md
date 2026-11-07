# VelosShield — backup and recovery

Status: **verified 2026-11-07**. Production was not modified while producing or
verifying these backups.

> This document contains no credentials, connection strings, database records or
> archive contents. Secret values live only in the encrypted backup set and in
> the Vercel project environment.

## What is backed up

| Component | Where | Contents |
|---|---|---|
| Git source | `velos2-all-branches.bundle`, `velos2-production-e041a0b.tar.gz` | full history, all branches, exact production tree |
| Historical local trees | `historical-local-archives/*.tar.gz` | the superseded `veloshield-shadcn` / `veloshield-dreamhost` checkouts, including `.git` |
| Neon PostgreSQL | `db/velos2-neondb-*.{dump,sql}.gz.gpg` | full logical dump of schema `public`, gzip + AES-256 |
| Vercel Blob | `blob/objects/**` + `blob/manifest.json` | every object under its original pathname, with SHA-256 |
| Vercel configuration | `vercel/*.json`, `vercel/vercel-env-values.json.gpg` | project, domains, env names/scopes, storage metadata, deployments |
| AWS SES | `aws/*`, `docs/AWS-SES-RECOVERY.md` | region, identity, DNS records, reissue procedure |

Backup root: `/home/administrator/velos-backups/`
- `20261107-website-recovery/` — source and historical archives (~1.2 GB)
- `20261107-production-recovery/` — production recovery set (21 MB)

`SHA256SUMS.txt` in each set covers every file.

## Recovery runbook

See `docs/RESTORE-RUNBOOK.md` in the backup set for the step-by-step procedure
and `docs/BACKUP-VERIFICATION-REPORT.md` for the evidence. Summary:

1. **Fastest — Vercel redeploy.** Every `READY` deployment can be redeployed from
   the dashboard with no new build. Current production deployment:
   `dpl_HTjByg6qUKVNQDuipUzKv4ti8n4Z` at commit `e041a0baff27aa8fcd01f7032a63e2a5124a438f`.
2. **Source rebuild.** Clone the bundle, check out `e041a0b`, `npm ci`, `npm run build`.
3. **Database.** Restore the encrypted dump into an isolated PostgreSQL 18
   instance first; never restore directly into production as a first move.
4. **Blob.** Objects keep their original pathnames, so re-uploading with the same
   pathnames preserves every CMS `url` reference.
5. **Email.** Follow the SES reissue procedure in `AWS-SES-RECOVERY.md`.

## Verification results

| Check | Result |
|---|---|
| Git bundle restores `e041a0b` | PASS |
| `npm ci && npm run build` from restored source | PASS |
| Production tarball identical to bundle checkout | PASS (0 diff) |
| Database restore into isolated instance | PASS (37/37 tables, 0 count or hash mismatches) |
| Blob objects match manifest | PASS (56/56) |
| CMS `media` filenames covered by Blob | PASS (13/13) |
| Vercel rollback deployments available | PASS |
| AWS SES send path | PASS (active sending observed) |
| Independent off-disk copy | **NOT AVAILABLE** |

## Known gaps

- **No independent copy.** The backup sets sit on a single WSL virtual disk. A
  physical disk failure is not recoverable from them. Copy the 21 MB production
  set off-host.
- **SES IAM policy cannot be exported.** The `velos-shield-ses` IAM user is
  send-only and is denied every `ses:*` read and `iam:*` action, so the attached
  policy document is not recoverable from the backup. Reissue requires AWS
  account-level access — see `AWS-SES-RECOVERY.md`.
- **SES sender domain SPF does not include Amazon SES** and there is no DMARC
  record for `rathon.ai`. Sending currently works via DKIM; this is a
  deliverability risk, not an outage.

## Related documents

- `docs/PRODUCTION-DEPENDENCIES.md` — live integrations and their configuration
- `docs/DEPLOYMENT-RUNBOOK.md` — release and smoke-test process
- `docs/ROLLBACK-RUNBOOK.md` — application and data rollback
- `docs/CONSOLIDATION-INVENTORY.md` — what is live and what is superseded
