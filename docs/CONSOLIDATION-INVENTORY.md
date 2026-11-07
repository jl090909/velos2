# VelosShield website — consolidation inventory

Date: 2026-11-07
Scope: VelosShield corporate website only (`www.velosshield.com`, `velosshield.com`).
Out of scope: DT2, SaaS, Velos Industries, AI training, OT sensors, licensing backend.

## Source of truth (verified 2026-11-07)

| Item | Value |
|---|---|
| GitHub repository | `jl090909/velos2` (private) |
| Production branch | `main` |
| Local canonical checkout | `/home/administrator/OTwebsite/velos2` |
| Vercel project | `veloshield-dreamhost` (`prj_bn2J2o2ye4EsExy42J9G3z4zZUA7`) |
| Vercel team/org | `team_4YQnqm1UWKrtXoJHkDlurr3Z` |
| Live production commit | `e041a0baff27aa8fcd01f7032a63e2a5124a438f` |
| Production deployment | `dpl_HTjByg6qUKVNQDuipUzKv4ti8n4Z` (2026-10-23 03:06 UTC) |
| Production domains | `www.velosshield.com`, `velosshield.com`, `veloshield-dreamhost.vercel.app` |

Evidence: Vercel project Git link `link.repo=velos2`, `link.productionBranch=main`,
`link.createdAt=2026-10-23T02:56:32Z`; `targets.production.alias` lists both custom
domains; the `target=production` deployment query returns `e041a0baff`. The live
navigation and page copy match `velos2/main` source, not the older `veloshield-shadcn`
tree.

## Inventory

| Resource | GitHub | Local | Vercel | Disposition |
|---|---|---|---|---|
| velos2 | `jl090909/velos2` (main) | `/home/administrator/OTwebsite/velos2` (new) | `veloshield-dreamhost` = LIVE | **KEEP** |
| veloshield-shadcn | `jl090909/veloshield-shadcn` (main) | `OTwebsite/veloshield-dreamhost` 1.9G, `OTwebsite/veloshield-shadcn` 1.4G, 2 backups 1.7G | `veloshield` (503), `veloshield-shadcn` (503) | **ARCHIVE** |
| velos-ai-training | `jl090909/velos-ai-training` | `/home/administrator/velos-ai-training` 6.5G | — | **OUT OF SCOPE** |
| velos-industries | `jl090909/velos-industries` | `/home/administrator/velos-industries` | `velos-industries` -> www.velosindustries.com LIVE | **OUT OF SCOPE** |
| rathon-ai | `jl090909/rathon-ai` | `OTwebsite/rathon-ai` | `rathon-ai` -> www.rathon.ai LIVE | **OUT OF SCOPE** |
| rathonai | `jl090909/rathonai` | `OTwebsite/rathon-mailer` | `rathon-mailer` LIVE | **OUT OF SCOPE** |
| rathon-ai-corporate-site | `jl090909/rathon-ai-corporate-site` | `OTwebsite/rathon-ai-corporate-site` | `rathon-ai-corporate` (503) | **OUT OF SCOPE** |
| velosshield11 | `velosshield/velosshield11` | scratch clone | — | **OUT OF SCOPE** (OT Guard 1.1) |
| velos-shield-backend-1.5 | `velosshield/...` | — | — | **OUT OF SCOPE** |
| velos-shield-frontend-1.5 | `velosshield/...` | — | — | **OUT OF SCOPE** |
| velos2 Vercel project | — | — | `velos2` (`prj_XIJ0T...`) -> velos2.vercel.app | **CONSOLIDATE** (duplicate of veloshield-dreamhost; delete project, keep repo) |
| OTwebsite/02-veloshield-product-site | — | 60K static HTML | — | **ARCHIVE** |
| velos-artifacts | — | 54M ML artifacts | — | **OUT OF SCOPE** |
| veloscore | — | 120M OT Guard deployment | — | **OUT OF SCOPE** |

## Findings

1. **The local folder name is misleading.** `OTwebsite/veloshield-dreamhost` is a
   checkout of `jl090909/veloshield-shadcn` (branch `dreamhost`, commit `a5e713f`),
   not of `velos2`. Its `.vercel/project.json` points at the live project, but the
   project's Git link moved to `velos2` on 2026-10-23. Editing that folder and pushing
   does not change the live site; a `vercel --prod` from it would overwrite production
   with the stale tree.
2. **`veloshield-shadcn` is superseded.** Its tree (45 source files, nav "Velos Sensor /
   Industries / Trust / Resources") is a different, older site. `velos2` (151 source
   files, nav "Products / Resources / Knowledge Hub / Customers / Partners / Company")
   is the live one.
3. **Redundant Vercel projects.** `veloshield` and `veloshield-shadcn` both point at the
   superseded repo and both return 503. `velos2` is a duplicate of `veloshield-dreamhost`
   (same repo and branch); its `velos2.vercel.app` alias is redundant.
4. **Unmerged work in `velos2`.** `fix/site-qa-defects` has 3 commits not in `main`:
   `e7fdae4` (11 QA defects), `f2c06a0` (SEO + branded 404), `5fbe6c1` (LinkedIn footer).
   `feature/newsroom-cms` is merged; `feature/help-widget` has no unique commits.
5. **Scheduled publishing is not ticking in production.** The Newsroom scheduler needs
   `PAYLOAD_CRON_SECRET` plus a cron entry calling `GET /api/payload-jobs/run/`. The live
   project has neither, and the endpoint returns 401 without an admin session. See
   `docs/PRODUCTION-DEPENDENCIES.md`.
6. **No GitHub Actions** in either website repo; Vercel deploy hooks are empty. Deployments
   are triggered by Git pushes to `main`.

## Local unique files preserved

The superseded checkouts contain untracked/uncommitted work that does not exist in
`velos2`: design flowcharts/wireframes (`DRAGOS-FLOWCHART.*`, `VELOSHIELD-FLOWCHART.*`,
`VELOSHIELD-SITE-WIREFRAME.md`), source `.docx` resources, an old `src/app/resources/`
tree, and image/font assets. All are captured in the archive tarballs under
`/home/administrator/velos-archive-20261107/` before any deletion.
