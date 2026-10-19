import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { NewsroomCard, NewsroomRow } from '@/components/newsroom/NewsroomCard'
import { NewsroomFilters } from '@/components/newsroom/NewsroomFilters'
import { NewsroomHero } from '@/components/newsroom/NewsroomHero'
import { getPressMentions } from '@/lib/cms'
import { getNewsroomArticles, type NewsroomArticle } from '@/lib/newsroom'
import { NEWSROOM_CATEGORIES, categoryFromSlug, categorySlug, formatNewsroomDate, type NewsroomCategory } from '@/lib/newsroom-meta'

/**
 * The Newsroom - /company/media/.
 *
 * Editorial layout (spec Phase 2): one featured hero, then a band per category, with the category
 * filter and the search rendered as URLs so the whole page stays server-rendered and shareable.
 *
 * Drafts cannot reach this page: getNewsroomArticles filters `_status = published` AND
 * `publishAt <= now` with access control ON (see src/lib/newsroom.ts). The existing press coverage
 * records are preserved underneath the Press Coverage band, so no previously published content was
 * removed by this redesign.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'The Velos Shield Newsroom: product news, research and insights, company announcements, press coverage and events in OT cyber security.',
  title: 'Newsroom - Velos Shield',
}

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

const SECTIONS: NewsroomCategory[] = [...NEWSROOM_CATEGORIES]

/** One labelled band of stories. A band with nothing in it renders nothing. */
function Section({
  articles,
  category,
  layout = 'grid',
  limit = 3,
}: {
  articles: NewsroomArticle[]
  category: NewsroomCategory
  layout?: 'grid' | 'rows'
  limit?: number
}) {
  const shown = articles.slice(0, limit)
  if (shown.length === 0) {
    return null
  }
  return (
    <section className="border-t border-border/60 pt-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-[24px] font-bold tracking-[-.04em] text-[#003C64] md:text-[30px]">{category}</h2>
        {articles.length > shown.length ? (
          <Link
            className="text-sm font-medium text-[#003C64] no-underline transition-colors hover:text-[#FF612A]"
            href={`/company/media/?category=${categorySlug(category)}`}
          >
            View all {articles.length}
          </Link>
        ) : null}
      </div>
      {layout === 'rows' ? (
        <div className="grid gap-x-10 gap-y-0 md:grid-cols-2">
          {shown.map((article) => (
            <NewsroomRow key={String(article.id)} article={article} />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((article) => (
            <NewsroomCard key={String(article.id)} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}

export default async function CompanyNewsroomPage({ searchParams }: Props) {
  const { category: categoryParam, q: queryParam } = await searchParams
  const activeCategory = categoryFromSlug(categoryParam)
  const activeQuery = (queryParam ?? '').trim()
  const filtered = Boolean(activeCategory) || activeQuery.length > 0

  const [{ data: articles, error }, { data: mentions }] = await Promise.all([
    getNewsroomArticles({ category: activeCategory, q: activeQuery }),
    getPressMentions(),
  ])

  const hero = articles.find((article) => article.featured) ?? articles[0] ?? null
  const rest = hero ? articles.filter((article) => String(article.id) !== String(hero.id)) : articles
  const inCategory = (category: NewsroomCategory) => rest.filter((article) => article.category === category)

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <CompanyTabs />
        <p className="mt-10 mb-3 text-[13px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">Newsroom</p>
        <h1 className="mb-5 max-w-3xl text-3xl font-bold leading-[1.02] tracking-[-.05em] text-[#003C64] md:text-6xl">
          Newsroom.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Product news, research and field insight, company announcements, press coverage and the events we
          will be at. Every story is published by the team from the CMS - no code, no deploy.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] no-underline transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
            href="/company/contact"
          >
            Press enquiries
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 px-6 text-sm font-medium text-muted-foreground no-underline transition-colors hover:border-[#003C64]/40 hover:text-[#003C64]"
            href="/resources/knowledge-hub"
          >
            Knowledge Hub
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <NewsroomFilters activeCategory={activeCategory} activeQuery={activeQuery} resultCount={articles.length} />

        {articles.length === 0 ? (
          <Card className="mt-10 border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">
                {filtered ? 'No stories match that filter.' : 'The Newsroom has no published stories yet.'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The Newsroom feed is temporarily unavailable. Please try again shortly.'
                  : filtered
                    ? 'Try another category, or clear the search to see every story.'
                    : 'Product news, research and company announcements appear here as they are published.'}
              </p>
            </CardContent>
          </Card>
        ) : filtered ? (
          <section className="mt-10">
            <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-[24px] font-bold tracking-[-.04em] text-[#003C64] md:text-[30px]">
                {activeCategory ?? 'Search results'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {articles.length} {articles.length === 1 ? 'story' : 'stories'}
                {activeQuery ? ` for "${activeQuery}"` : ''}
              </p>
            </div>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsroomCard key={String(article.id)} article={article} />
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-12 space-y-14">
            {hero ? <NewsroomHero article={hero} /> : null}

            {SECTIONS.map((category) => (
              <Section
                key={category}
                articles={category === 'Latest News' ? rest : inCategory(category)}
                category={category}
                layout={category === 'Research & Insights' ? 'rows' : 'grid'}
                limit={category === 'Research & Insights' ? 4 : 3}
              />
            ))}

            {mentions.length > 0 ? (
              <section className="border-t border-border/60 pt-12">
                <div className="mb-7">
                  <h2 className="text-[24px] font-bold tracking-[-.04em] text-[#003C64] md:text-[30px]">Coverage elsewhere</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Interviews, features and awards published by other outlets.
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {mentions.map((mention) => (
                    <Card
                      key={String(mention.id)}
                      className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]"
                    >
                      <CardContent className="flex h-full flex-col p-7">
                        <div className="mb-4 flex items-center gap-3">
                          {mention.logo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              alt={mention.logo.alt || mention.outlet}
                              className="max-h-8 w-auto object-contain"
                              src={mention.logo.url}
                            />
                          ) : (
                            <span className="rounded-full bg-[#003C64]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.14em] text-[#003C64]">
                              {mention.kind}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {mention.outlet}
                            {mention.publishedDate ? ` - ${formatNewsroomDate(mention.publishedDate)}` : ''}
                          </span>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold tracking-[-.03em] text-[#003C64]">
                          <a
                            className="text-[#003C64] no-underline transition-colors hover:text-[#FF612A]"
                            href={mention.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {mention.headline}
                          </a>
                        </h3>
                        {mention.excerpt ? (
                          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{mention.excerpt}</p>
                        ) : null}
                        <a
                          className="mt-auto pt-6 text-sm font-medium text-[#003C64] no-underline transition-colors hover:text-[#FF612A]"
                          href={mention.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Read the coverage
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
