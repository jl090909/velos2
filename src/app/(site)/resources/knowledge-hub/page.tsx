import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { Chip, Eyebrow, Surface } from '@/components/site/editorial'
import { FeedRow } from '@/components/site/FeedRow'
import { getKnowledgeArticles, type KnowledgeArticle } from '@/lib/cms'
import { categorySlug } from '@/lib/newsroom-meta'

/**
 * Knowledge Hub - the engineering/research feed.
 *
 * Same treatment as Resources, turned vertical: no featured hero and no card grid, the page opens on
 * a column of full-width rows (cover left, bands right, actions pinned to the bottom). The category
 * filter and the search are kept - they are real functionality, not layout - and they still run over
 * the already-fetched list, so a chip stays a shareable URL and no extra CMS read happens.
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
  const shown = isFiltered ? filtered : articles

  const heading = isFiltered ? (activeCategory ?? 'Search results') : 'Latest notes.'

  return (
    <>
      <section className="pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Eyebrow>Knowledge Hub</Eyebrow>
          <h2
            className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] text-[#003C64] md:text-5xl"
            id="notes"
          >
            {heading}
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-6">
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
            <div className="space-y-8">
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

              {shown.length === 0 ? (
                <Surface className="p-8 md:p-10">
                  <p className="font-medium text-[#003C64]">{isFiltered ? 'No notes match that filter.' : 'No notes are published yet.'}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isFiltered ? 'Try another category, or clear the search.' : 'Notes appear here as they are published.'}
                  </p>
                </Surface>
              ) : (
                <ul aria-labelledby="notes" className="space-y-5" role="list">
                  {shown.map((article, index) => (
                    <FeedRow article={article} href={href(article)} index={index} key={article.id} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
