import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Crawl rules.
 *
 * The apex is indexable and advertises its sitemap. Any other origin this build runs on is a
 * staging mirror of the same content (velos2.vercel.app, the *.vercel.app project aliases), so
 * those are disallowed outright - otherwise every deploy publishes a second indexable copy of
 * the whole site.
 */
export default function robots(): MetadataRoute.Robots {
  const isApex = /^https:\/\/(www\.)?velosshield\.com$/.test(SITE_URL)

  if (!isApex) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The CMS admin and the API are not content.
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
