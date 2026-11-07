# VelosShield website — rollback runbook

Verified 2026-11-07. Rollback must never require a database reset.

## 1. Application rollback (fastest, preferred)

Vercel keeps every deployment. To roll back:

1. List recent deployments:
   ```bash
   curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
     "https://api.vercel.com/v6/deployments?projectId=prj_bn2J2o2ye4EsExy42J9G3z4zZUA7&teamId=team_4YQnqm1UWKrtXoJHkDlurr3Z&limit=20"
   ```
2. Identify the last known-good deployment (`meta.githubCommitSha`, `state=READY`).
3. Redeploy it from the Vercel dashboard (**Deployments -> Redeploy**) or the CLI
   (`vercel deploy --prod` is NOT the rollback path; use the dashboard redeploy so the
   exact build is reused).
4. Confirm both `www.velosshield.com` and `velosshield.com` serve the rolled-back build
   (compare the navigation/commit marker).

No new build is produced by a redeploy, so rollback is immediate and does not depend on
the current working tree.

## 2. Git revert (when a new build is acceptable)

```bash
git revert <merge-commit>          # or git reset --hard <last-good> on a branch
git push origin main
```

Vercel rebuilds from the pushed commit. This is slower (a full build) and changes the
commit history; prefer option 1 for an urgent rollback.

## 3. Database changes

- Migrations are additive and must remain reversible. Before applying any migration in
  production, take a Neon dump and store it outside the repo.
- **Do not reset, reseed, drop or overwrite the production database** as a rollback step.
- If a migration must be undone, write a new additive migration rather than reverting the
  data in place.

## 4. Configuration / secret changes

- Environment variable changes in Vercel take effect on the next deployment. To roll back,
  restore the previous value and redeploy (or redeploy the previous build).
- If `PAYLOAD_CRON_SECRET` is rotated or added, the previous value is not recoverable
  from the API — keep it in a password manager before changing it.
- Domain changes are not part of this runbook; DNS changes require explicit approval.

## 5. Media / Blob

- Blob objects are not touched by application rollbacks. Do not delete the media store.
- If media appears missing after a rollback, verify the `Media` collection records still
  reference the stored paths before re-uploading anything.

## 6. Recovery from the consolidation archive

Superseded local checkouts and the older `veloshield-shadcn` tree are archived at
`/home/administrator/velos-archive-20261107/*.tar.gz`. They are historical only — the
live site is served from `jl090909/velos2`, so a rollback never depends on these copies.
Extract with:

```bash
tar -xzf /home/administrator/velos-archive-20261107/<name>.tar.gz -C /tmp/
```

## Rollback readiness checklist

- [ ] Last known-good deployment identified and redeployable.
- [ ] Both domains verified after rollback.
- [ ] Database dump taken before any migration.
- [ ] `PAYLOAD_CRON_SECRET` / SES values stored outside the repo.
- [ ] Archive tarballs verified extractable.
