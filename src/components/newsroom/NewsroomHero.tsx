import Link from 'next/link'

import { EditorialHero } from '@/components/site/editorial'
import type { NewsroomArticle } from '@/lib/newsroom'
import { formatNewsroomDate } from '@/lib/newsroom-meta'

import { articleHref } from './NewsroomCard'

/**
 * The featured story: the Media page's hero. Built from the shared editorial kit so the hero on
 * Resources, the Knowledge Hub and Events is the same implementation with different data.
 */
export function NewsroomHero({ article }: { article: NewsroomArticle }) {
  return (
    <EditorialHero
      badge="Featured"
      cta={{ href: articleHref(article), label: 'Read the story' }}
      eyebrow={article.category}
      image={{
        alt: article.coverImage?.alt || article.title,
        height: article.coverImage?.height,
        src: article.coverImage?.url ?? null,
        width: article.coverImage?.width,
      }}
      meta={
        <>
          <span>{article.authorName}</span>
          {article.publishAt ? (
            <>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
              <span>{formatNewsroomDate(article.publishAt)}</span>
            </>
          ) : null}
        </>
      }
      summary={article.summary}
      title={
        <Link className="no-underline text-white transition-colors hover:text-[#FF612A]" href={articleHref(article)}>
          {article.title}
        </Link>
      }
    />
  )
}
