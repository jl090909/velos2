import Link from 'next/link'

import { formatNewsroomDate } from '@/lib/newsroom-meta'
import type { NewsroomArticle } from '@/lib/newsroom'

/**
 * Newsroom story cards. Two shapes, one data source: the grid card (section grids and search
 * results) and the compact row (the Latest News column, where the headline carries the layout).
 */

export const articleHref = (article: NewsroomArticle): string => `/company/media/${article.slug}/`

function Cover({ article, className }: { article: NewsroomArticle; className: string }) {
  if (!article.coverImage) {
    return (
      <div className={`${className} flex items-center justify-center bg-[linear-gradient(135deg,#003C64_0%,#0f5c8f_55%,#FF612A_160%)]`}>
        <span className="text-[11px] font-semibold uppercase tracking-[.22em] text-white/75">Newsroom</span>
      </div>
    )
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      alt={article.coverImage.alt || article.title}
      className={`${className} object-cover`}
      height={article.coverImage.height}
      src={article.coverImage.url}
      width={article.coverImage.width}
    />
  )
}

export function NewsroomCard({ article }: { article: NewsroomArticle }) {
  return (
    <article className="group flex h-full flex-col">
      <Link className="block no-underline" href={articleHref(article)}>
        <Cover
          article={article}
          className="aspect-[16/10] w-full overflow-hidden rounded-[1.15rem] border border-white/55 transition-transform duration-300 group-hover:scale-[1.015]"
        />
        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A]">
          <span>{article.category}</span>
          {article.publishAt ? (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{formatNewsroomDate(article.publishAt)}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 text-[19px] font-semibold leading-[1.25] tracking-[-.03em] text-[#003C64] group-hover:text-[#FF612A] transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
      </Link>
    </article>
  )
}

export function NewsroomRow({ article }: { article: NewsroomArticle }) {
  return (
    <article className="group border-t border-border/60 py-6 first:border-t-0 first:pt-0">
      <Link className="block no-underline" href={articleHref(article)}>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A]">
          <span>{article.category}</span>
          {article.publishAt ? (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{formatNewsroomDate(article.publishAt)}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 text-[21px] font-semibold leading-[1.22] tracking-[-.03em] text-[#003C64] group-hover:text-[#FF612A] transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
      </Link>
    </article>
  )
}
