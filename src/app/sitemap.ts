import type { MetadataRoute } from 'next'

import { getNewsroomArticles } from '@/lib/newsroom'
import { getWhitepapers } from '@/lib/cms'

/**
 * Sitemap.
 *
 * Publishes the static marketing routes plus every PUBLISHED Newsroom story - and nothing else.
 * Drafts and scheduled stories cannot appear here by construction: the reader applies
 * `_status = published` AND `publishAt <= now` with access control on, and a database failure returns
 * an empty list rather than an error, so a sitemap request can never leak a draft or break a build.
 */

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3020').replace(/\/+$/, '')

const STATIC_ROUTES = [
  '/',
  '/company/about/',
  '/company/careers/',
  '/company/contact/',
  '/company/events/',
  '/company/media/',
  '/customers/',
  '/demo/',
  '/get-started/',
  '/industries/',
  '/partners/',
  '/product/',
  '/product/org-level/',
  '/product/site-level/',
  '/resources/',
  '/resources/knowledge-hub/',
  '/trust/',
  '/veloshield/',
  '/velossensor/',
]

/**
 * The sitemap is rendered per request rather than prerendered.
 *
 * A sitemap is fetched by crawlers, not by users, so one extra query per request costs nothing - and
 * it removes an ISR window in which a freshly published story is missing from the sitemap (measured:
 * the prerendered copy could be served stale for up to its revalidate window). Rendering on demand
 * means the file always reflects the database, and drafts are excluded by the reader below, not by a
 * cache expiry.
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await getNewsroomArticles({ limit: 500 })
  const { data: papers } = await getWhitepapers()

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${BASE}${route}` })),
    ...papers
      .filter((paper) => paper.body && paper.slug.length > 0)
      .map((paper) => ({
        lastModified: paper.publishedDate ? new Date(paper.publishedDate) : undefined,
        url: `${BASE}/resources/${paper.slug}/`,
      })),
    ...articles
      .filter((article) => article.slug.length > 0)
      .map((article) => ({
        lastModified: article.publishAt ? new Date(article.publishAt) : undefined,
        url: `${BASE}/company/media/${article.slug}/`,
      })),
  ]
}
