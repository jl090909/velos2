import { EditorialCard, EditorialRow } from '@/components/site/editorial'
import type { NewsroomArticle } from '@/lib/newsroom'
import { formatNewsroomDate } from '@/lib/newsroom-meta'

/**
 * Newsroom story cards. Two shapes, one data source: the grid card (section grids and search
 * results) and the compact row (the Latest News column, where the headline carries the layout).
 *
 * Both are thin adapters over the shared editorial kit (src/components/site/editorial.tsx), which is
 * also what Resources, the Knowledge Hub and Events render with - one visual implementation for the
 * whole site rather than four copies of it.
 */

export const articleHref = (article: NewsroomArticle): string => `/company/media/${article.slug}/`

const cover = (article: NewsroomArticle) => ({
  alt: article.coverImage?.alt || article.title,
  height: article.coverImage?.height,
  src: article.coverImage?.url ?? null,
  width: article.coverImage?.width,
})

export function NewsroomCard({ article }: { article: NewsroomArticle }) {
  return (
    <EditorialCard
      eyebrow={article.category}
      href={articleHref(article)}
      image={cover(article)}
      meta={article.publishAt ? formatNewsroomDate(article.publishAt) : undefined}
      placeholder="Media"
      summary={article.summary}
      title={article.title}
    />
  )
}

export function NewsroomRow({ article }: { article: NewsroomArticle }) {
  return (
    <EditorialRow
      eyebrow={article.category}
      href={articleHref(article)}
      meta={article.publishAt ? formatNewsroomDate(article.publishAt) : undefined}
      summary={article.summary}
      title={article.title}
    />
  )
}
