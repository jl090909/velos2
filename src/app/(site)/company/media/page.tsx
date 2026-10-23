import type { Metadata } from 'next'

import { Card, CardContent } from '@/components/ui/card'
import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { NewsroomCard, NewsroomRow } from '@/components/newsroom/NewsroomCard'
import { NewsroomHero } from '@/components/newsroom/NewsroomHero'
import { getNewsroomArticles, type NewsroomArticle } from '@/lib/newsroom'
import { NEWSROOM_CATEGORIES, type NewsroomCategory } from '@/lib/newsroom-meta'

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
        <h2 className="text-[20.4px] font-bold tracking-[-.04em] text-[#003C64] md:text-[25.5px]">{category}</h2>
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

export default async function CompanyNewsroomPage() {
  const { data: articles, error } = await getNewsroomArticles()

  const hero = articles.find((article) => article.featured) ?? articles[0] ?? null
  const rest = hero ? articles.filter((article) => String(article.id) !== String(hero.id)) : articles
  const inCategory = (category: NewsroomCategory) => rest.filter((article) => article.category === category)

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <CompanyTabs />
        <p className="mt-10 text-[12.35px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">Media</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {articles.length === 0 ? (
          <Card className="mt-10 border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">No stories are published yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The media feed is temporarily unavailable. Please try again shortly.'
                  : 'Product news, research and company announcements appear here as they are published.'}
              </p>
            </CardContent>
          </Card>
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
