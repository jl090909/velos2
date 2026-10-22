import Link from 'next/link'

import type { KnowledgeArticle } from '@/lib/cms'
import { formatDate } from '@/lib/format'

/**
 * One article in the Knowledge Hub feed: the same fixed-band idea as the resources lineup, turned
 * sideways - portrait cover on the left, the bands stacked on the right, actions pinned to the
 * bottom so a short note and a long note still share a baseline.
 *
 * Below sm the cover moves on top of the copy and takes a landscape crop, because a 0.94 portrait
 * at 342px wide is 364px tall before any text appears.
 *
 * Plain <img> for the same reason as LineupTile: CMS media URLs are absolute to the deployment that
 * uploaded them, and next/image would refuse the host.
 */
export function FeedRow({ article, href, index }: { article: KnowledgeArticle; href: string; index: number }) {
  const cover = article.heroImage

  return (
    <li className="feed-row">
      <article className="grid gap-5 rounded-[20px] border border-white/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.05),0_18px_40px_rgba(15,23,42,.06)] sm:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] sm:items-start">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#eef2f7_0%,#e2e8f0_100%)] sm:aspect-[260/277]">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              alt={cover.alt || article.title}
              className="h-full w-full object-cover"
              decoding="async"
              height={cover.height || 554}
              loading={index === 0 ? 'eager' : 'lazy'}
              src={cover.url}
              width={cover.width || 520}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-[13.3px] font-medium text-[#003C64]/50">
              {article.category}
            </div>
          )}
        </div>

        <div className="flex min-h-full flex-col">
          <p className="text-[10.45px] font-semibold tracking-[.18em] uppercase text-[#FF612A]">{article.category}</p>

          <h3 className="mt-2 line-clamp-2 text-title-lg font-semibold leading-[1.27] tracking-[-.02em] text-[#003C64] lg:text-xl">
            <Link className="no-underline" href={href}>
              {article.title}
            </Link>
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>

          {article.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  className="inline-flex items-center rounded-full border border-border/60 bg-[#f7f7f9] px-2.5 py-1 text-[11.4px] text-muted-foreground"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border/50 pt-5 sm:mt-5">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-[13.3px] font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
              href={href}
            >
              Read note
            </Link>
            <p className="text-[13.3px] text-muted-foreground">
              {article.authorName}
              {article.readingTime ? ` \u00b7 ${article.readingTime}` : ''}
              {article.publishedDate ? ` \u00b7 ${formatDate(article.publishedDate)}` : ''}
            </p>
          </div>
        </div>
      </article>
    </li>
  )
}
