import type { Metadata } from 'next'

/**
 * Canonical origin for THIS build.
 *
 * Each Vercel project injects its own NEXT_PUBLIC_SERVER_URL, so the apex build emits
 * https://velosshield.com and the velos2 staging project emits https://velos2.vercel.app.
 * Without this, the same codebase serving four hostnames emits no canonical at all and the
 * two custom domains compete with each other in search.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'https://velosshield.com'
).replace(/\/+$/, '')

export const SITE_NAME = 'Velos Shield'

/**
 * Every page's metadata in one place, so title, description, canonical and social tags can
 * never drift apart. `path` must be the public path with a leading and trailing slash
 * (e.g. '/product/', '/company/media/'), which is what trailingSlash: true serves.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}): Metadata {
  const url = `${SITE_URL}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
