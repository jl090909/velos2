import config from '@payload-config'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { isStaffRole } from '@/access'
import { ArticleView } from '@/components/newsroom/ArticleView'
import { getNewsroomArticles, getNewsroomDraftById, pickRelated } from '@/lib/newsroom'

/**
 * DRAFT PREVIEW - /newsroom-preview/<id>/.
 *
 * The CMS "Preview" button opens this route (see the collection's `admin.preview`). It renders the
 * SAME ArticleView the public page renders, from the CURRENT draft, with access control ON.
 *
 * Drafts are never reachable from the public Newsroom, so the exposure risk lives here and is closed
 * in three ways:
 *   1. the Payload session is resolved server-side from the request cookie (payload.auth), never from
 *      a query parameter or header the caller controls;
 *   2. a caller who is not signed in as staff gets a 404 - the route does not confirm that the id
 *      exists;
 *   3. the read itself runs with `overrideAccess: false` for that user, so Payload's own access rules
 *      are applied on top.
 *
 * The response is marked noindex/nofollow and is never cached.
 */

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Draft preview - Velos Shield CMS',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function NewsroomPreviewPage({ params }: Props) {
  const { id } = await params

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  const roles: string[] = Array.isArray((user as { roles?: unknown } | null)?.roles)
    ? ((user as { roles?: unknown[] }).roles ?? []).filter((role): role is string => typeof role === 'string')
    : []

  if (!user || !roles.some((role) => isStaffRole(role))) {
    notFound()
  }

  const { data: article } = await getNewsroomDraftById(id, user)
  if (!article) {
    notFound()
  }

  const { data: all } = await getNewsroomArticles({ limit: 60 })

  return <ArticleView article={article} mode="preview" related={pickRelated(all, article)} />
}
