import Link from 'next/link'

import { formatNewsroomDate } from '@/lib/newsroom-meta'
import type { NewsroomArticle } from '@/lib/newsroom'

import { articleHref } from './NewsroomCard'

/** The featured story: the Newsroom's hero. One story, the full width of the page. */
export function NewsroomHero({ article }: { article: NewsroomArticle }) {
  return (
    <article className="relative overflow-hidden rounded-[1.6rem] border border-white/55 bg-[linear-gradient(150deg,#002640_0%,#003C64_58%,#0f5c8f_100%)] shadow-[0_18px_60px_rgba(0,38,64,.18)]">
      <div className="grid items-stretch gap-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="order-2 flex flex-col justify-center p-8 md:p-12 lg:order-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-[#FF612A] px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-white">
              Featured
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-white/80">{article.category}</span>
          </div>
          <h2 className="mt-5 text-[28px] font-bold leading-[1.08] tracking-[-.04em] text-white md:text-[42px]">
            <Link className="no-underline text-white hover:text-[#FF612A] transition-colors" href={articleHref(article)}>
              {article.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-base">{article.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/60">
            <span>{article.authorName}</span>
            {article.publishAt ? (
              <>
                <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
                <span>{formatNewsroomDate(article.publishAt)}</span>
              </>
            ) : null}
          </div>
          <Link
            className="mt-8 inline-flex w-max items-center justify-center rounded-full bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] px-7 py-3 text-sm font-semibold text-[#002640] no-underline transition-all hover:bg-[linear-gradient(180deg,#ffffff_0%,#f1f5f9_100%)]"
            href={articleHref(article)}
          >
            Read the story
          </Link>
        </div>

        <div className="order-1 min-h-[220px] lg:order-2 lg:min-h-[420px]">
          {article.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              alt={article.coverImage.alt || article.title}
              className="h-full w-full object-cover"
              height={article.coverImage.height}
              src={article.coverImage.url}
              width={article.coverImage.width}
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,97,42,.35)_0%,rgba(0,60,100,0)_60%)]" />
          )}
        </div>
      </div>
    </article>
  )
}
