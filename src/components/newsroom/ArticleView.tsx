import Link from 'next/link'

import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { RichBody } from '@/components/site/RichBody'
import { NewsroomCard } from '@/components/newsroom/NewsroomCard'
import type { NewsroomArticle } from '@/lib/newsroom'
import { categorySlug, formatNewsroomDate } from '@/lib/newsroom-meta'

/**
 * The article layout, used by BOTH the public page and the draft preview.
 *
 * That is deliberate: the preview must show the real published layout, so the two cannot drift. The
 * only difference is the banner `mode="preview"` adds, and the preview route is the one that decides
 * whether a draft may be shown at all (it is session-gated server-side).
 */
export function ArticleView({
  article,
  mode = 'public',
  related = [],
}: {
  article: NewsroomArticle
  mode?: 'preview' | 'public'
  related?: NewsroomArticle[]
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    articleSection: article.category,
    author: { '@type': 'Person', name: article.authorName },
    datePublished: article.publishAt || undefined,
    description: article.seoDescription ?? article.summary,
    headline: article.title,
    identifier: article.slug,
  }

  return (
    <>
      {mode === 'public' ? (
        <script
          // Structured data only: built from our own fields and escaped, never raw HTML from an editor.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
          type="application/ld+json"
        />
      ) : null}

      {mode === 'preview' ? (
        <div className="border-b-2 border-[#C99A2E] bg-[#FFF7E6] px-6 py-3">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            <span className="rounded bg-[#830D41] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[.2em] text-white">
              Preview
            </span>
            <span className="text-sm font-semibold text-[#8A6D1F]">
              This is the public layout for a {article.status === 'published' ? 'published' : 'not-yet-public'} story. It
              is visible only to signed-in staff.
            </span>
            <span className="text-xs text-[#6b6d6b]">Status: {article.status}</span>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <CompanyTabs />
        <div className="mt-10 flex flex-wrap items-center gap-2 text-[10.45px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">
          <Link className="no-underline hover:text-[#003C64]" href="/company/media/">
            Newsroom
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link className="no-underline hover:text-[#003C64]" href={`/company/media/?category=${categorySlug(article.category)}`}>
            {article.category}
          </Link>
        </div>
        <h1 className="mt-5 max-w-4xl text-[27.2px] font-bold leading-[1.06] tracking-[-.045em] text-[#003C64] md:text-[44.2px]">
          {article.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{article.summary}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.35px] text-muted-foreground">
          <span className="font-medium text-[#003C64]">{article.authorName}</span>
          {article.authorRole ? <span>{article.authorRole}</span> : null}
          {article.publishAt ? (
            <>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:block" />
              <time dateTime={article.publishAt}>{formatNewsroomDate(article.publishAt)}</time>
            </>
          ) : null}
          {article.readingTime ? <span>{article.readingTime}</span> : null}
        </div>
      </section>

      {article.coverImage ? (
        <section className="mx-auto max-w-6xl px-6">
          <figure className="overflow-hidden rounded-[1.6rem] border border-white/55">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={article.coverImage.alt || article.title}
              className="w-full object-cover"
              height={article.coverImage.height}
              src={article.coverImage.url}
              width={article.coverImage.width}
            />
          </figure>
          {article.coverCaption ? <figcaption className="mt-2 text-sm text-muted-foreground">{article.coverCaption}</figcaption> : null}
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <RichBody body={article.body} />

            {article.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    className="rounded-full bg-[#003C64]/5 px-3 py-1 text-[10.45px] font-semibold uppercase tracking-[.14em] text-[#003C64]"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>

          <aside className="h-max lg:sticky lg:top-28">
            <div className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-7 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
              <p className="text-[10.45px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Newsroom</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This story is written and published from the Velos Shield CMS. Journalists can reach the team for
                briefings, comment or imagery.
              </p>
              <Link
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
                href="/company/contact"
              >
                Press enquiries
              </Link>
              <Link
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-border/70 px-6 text-sm font-medium text-muted-foreground no-underline transition-colors hover:border-[#003C64]/40 hover:text-[#003C64]"
                href="/company/media/"
              >
                All Newsroom stories
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-6xl border-t border-border/60 px-6 py-14">
          <h2 className="mb-7 text-[20.4px] font-bold tracking-[-.04em] text-[#003C64] md:text-[25.5px]">More from the Newsroom</h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <NewsroomCard key={String(item.id)} article={item} />
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  )
}
