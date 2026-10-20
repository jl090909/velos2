import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { cardGrid, Chip, EditorialHero, Eyebrow, OverlayCard, SectionHeader, Surface } from '@/components/site/editorial'
import { getKnowledgeArticles, type KnowledgeArticle } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { categorySlug } from '@/lib/newsroom-meta'

/**
 * Knowledge Hub - the engineering/research article feed.
 *
 * Same editorial kit as the Media page: eyebrow, featured hero, category filter + search, card grid.
 * The filter and search run over the already-fetched published list, so they add no CMS read and no
 * new API: a chip is a URL, which keeps the page server-rendered and shareable.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Practical notes from the Velos Shield engineering and research teams on OT security, detection design, deployment evidence and compliance.',
  title: 'Knowledge Hub - Velos Shield',
}

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

const href = (article: KnowledgeArticle): string => `/resources/knowledge-hub/${article.slug}/`

const listHref = (category: null | string, query: string): string => {
  const params = new URLSearchParams()
  if (category) {
    params.set('category', categorySlug(category))
  }
  if (query.trim().length > 0) {
    params.set('q', query.trim())
  }
  const search = params.toString()
  return search.length > 0 ? `/resources/knowledge-hub/?${search}` : '/resources/knowledge-hub/'
}

const matches = (article: KnowledgeArticle, term: string): boolean => {
  const haystack = [article.title, article.excerpt, article.authorName, article.category, ...article.tags].join(' ').toLowerCase()
  return haystack.includes(term)
}

export default async function KnowledgeHubPage({ searchParams }: Props) {
  const { category: categoryParam, q: queryParam } = await searchParams
  const query = (queryParam ?? '').trim()

  const { data: articles, error } = await getKnowledgeArticles()

  const categories = [...new Set(articles.map((article) => article.category))]
  const activeCategory = categoryParam ? categories.find((category) => categorySlug(category) === categoryParam) ?? null : null

  const filtered = articles.filter(
    (article) => (!activeCategory || article.category === activeCategory) && (query.length === 0 || matches(article, query.toLowerCase())),
  )
  const isFiltered = Boolean(activeCategory) || query.length > 0

  const hero = articles[0] ?? null
  const rest = isFiltered ? filtered : hero ? articles.filter((article) => article.id !== hero.id) : filtered

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <Eyebrow>Knowledge Hub</Eyebrow>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {articles.length === 0 ? (
          <Surface className="p-8 md:p-10">
            <p className="font-medium text-[#003C64]">The Knowledge Hub is being set up.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error
                ? 'The article feed is temporarily unavailable. Please try again shortly.'
                : 'Articles from the engineering and research teams will appear here.'}
            </p>
          </Surface>
        ) : (
          <div className="space-y-12">
            {hero && !isFiltered ? (
              <EditorialHero
                badge="Latest"
                cta={{ href: href(hero), label: 'Read the note' }}
                eyebrow={hero.category}
                image={{
                  alt: hero.heroImage?.alt || hero.title,
                  height: hero.heroImage?.height,
                  src: hero.heroImage?.url ?? null,
                  width: hero.heroImage?.width,
                }}
                meta={
                  <>
                    <span>{hero.authorName}</span>
                    {hero.readingTime ? <span>{hero.readingTime}</span> : null}
                    {hero.publishedDate ? <span>{formatDate(hero.publishedDate)}</span> : null}
                  </>
                }
                summary={hero.excerpt}
                title={hero.title}
              />
            ) : null}

            <Surface className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Chip active={!activeCategory} href={listHref(null, query)}>
                  All
                </Chip>
                {categories.map((category) => (
                  <Chip active={activeCategory === category} href={listHref(category, query)} key={category}>
                    {category}
                  </Chip>
                ))}
              </div>

              <form action="/resources/knowledge-hub/" className="mt-4 flex flex-wrap items-center gap-3" method="get" role="search">
                {activeCategory ? <input name="category" type="hidden" value={categorySlug(activeCategory)} /> : null}
                <label className="sr-only" htmlFor="knowledge-search">
                  Search the Knowledge Hub
                </label>
                <input
                  className="h-11 min-w-[220px] flex-1 rounded-full border border-border/70 bg-white px-5 text-sm text-[#003C64] outline-none transition-colors placeholder:text-muted-foreground focus:border-[#003C64]/50"
                  defaultValue={query}
                  id="knowledge-search"
                  name="q"
                  placeholder="Search notes, topics, authors"
                  type="search"
                />
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] transition-all hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#002640]"
                  type="submit"
                >
                  Search
                </button>
                {isFiltered ? (
                  <>
                    <Link className="text-sm text-muted-foreground no-underline hover:text-[#003C64]" href="/resources/knowledge-hub/">
                      Clear
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
                    </span>
                  </>
                ) : null}
              </form>
            </Surface>

            {rest.length === 0 ? (
              <Surface className="p-8 md:p-10">
                <p className="font-medium text-[#003C64]">{isFiltered ? 'No notes match that filter.' : 'No notes are published yet.'}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isFiltered ? 'Try another category, or clear the search.' : 'Notes appear here as they are published.'}
                </p>
              </Surface>
            ) : (
              <section className="border-t border-border/60 pt-12">
                <SectionHeader title={activeCategory ?? (query.length > 0 ? 'Search results' : 'Latest notes')} />
                <div className={cardGrid}>
                  {rest.map((article) => (
                    <OverlayCard
                      eyebrow={article.category}
                      footer={
                        <>
                          {article.authorName}
                          {article.readingTime ? ` \u00b7 ${article.readingTime}` : ''}
                        </>
                      }
                      href={href(article)}
                      image={{
                        alt: article.heroImage?.alt || article.title,
                        height: article.heroImage?.height,
                        src: article.heroImage?.url ?? null,
                        width: article.heroImage?.width,
                      }}
                      key={article.id}
                      meta={article.publishedDate ? formatDate(article.publishedDate) : undefined}
                      placeholder="Knowledge Hub"
                      summary={article.excerpt}
                      title={article.title}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
