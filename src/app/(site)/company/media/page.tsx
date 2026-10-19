import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { NewsroomCard, NewsroomRow } from '@/components/newsroom/NewsroomCard'
import { NewsroomFilters } from '@/components/newsroom/NewsroomFilters'
import { NewsroomHero } from '@/components/newsroom/NewsroomHero'
import { getNewsroomArticles, type NewsroomArticle } from '@/lib/newsroom'
import { NEWSROOM_CATEGORIES, categoryFromSlug, categorySlug, type NewsroomCategory } from '@/lib/newsroom-meta'

/**
 * The Newsroom - /company/media/.
 *
 * Editorial layout (spec Phase 2): one featured hero, then a band per category, with the category
 * filter and the search rendered as URLs so the whole page stays server-rendered and shareable.
 *
 * Drafts cannot reach this page: getNewsroomArticles filters `_status = published` AND
 * `publishAt <= now` with access control ON (see src/lib/newsroom.ts).
 *
 * There is deliberately no "Coverage elsewhere" block on this page: the stories themselves are the
 * page. The `press-mentions` collection and its reader are untouched, so external coverage can be
 * brought back here (or surfaced elsewhere) without re-authoring anything.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Velos Shield media: product news, research and insights, company announcements, press coverage and events in OT cyber security.',
  title: 'Media - Velos Shield',
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

  const { data: articles, error } = await getNewsroomArticles({ category: activeCategory, q: activeQuery })

  const hero = articles.find((article) => article.featured) ?? articles[0] ?? null
  const rest = hero ? articles.filter((article) => String(article.id) !== String(hero.id)) : articles
  const inCategory = (category: NewsroomCategory) => rest.filter((article) => article.category === category)

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <CompanyTabs />
        <p className="mt-10 text-[13px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">Media</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <NewsroomFilters activeCategory={activeCategory} activeQuery={activeQuery} resultCount={articles.length} />

        {articles.length === 0 ? (
          <Card className="mt-10 border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">
                {filtered ? 'No stories match that filter.' : 'No stories are published yet.'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The media feed is temporarily unavailable. Please try again shortly.'
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


          </div>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
