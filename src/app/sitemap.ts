import type { MetadataRoute } from 'next'

import { getNewsroomArticles } from '@/lib/newsroom'

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

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await getNewsroomArticles({ limit: 500 })

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${BASE}${route}` })),
    ...articles
      .filter((article) => article.slug.length > 0)
      .map((article) => ({
        lastModified: article.publishAt ? new Date(article.publishAt) : undefined,
        url: `${BASE}/company/media/${article.slug}/`,
      })),
  ]
}
