import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { Eyebrow, Surface } from '@/components/site/editorial'
import { FeedRow } from '@/components/site/FeedRow'
import { getKnowledgeArticles, type KnowledgeArticle } from '@/lib/cms'

/**
 * Knowledge Hub - the engineering/research feed.
 *
 * Same treatment as Resources, turned vertical: no featured hero, no card grid, no filters - the
 * page opens on a column of full-width rows (cover left, bands right, actions pinned to the bottom).
 * The category chips and the search were removed on request; if they come back, they belong above
 * the column, reading from the already-fetched list so no extra CMS read happens.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Practical notes from the Velos Shield engineering and research teams on OT security, detection design, deployment evidence and compliance.',
  title: 'Knowledge Hub - Velos Shield',
}

const href = (article: KnowledgeArticle): string => `/resources/knowledge-hub/${article.slug}/`

export default async function KnowledgeHubPage() {
  const { data: articles, error } = await getKnowledgeArticles()

  // Newest first: the collection order is whatever the CMS returns.
  const ordered = [...articles].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1))

  return (
    <>
      <section className="pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Eyebrow>Knowledge Hub</Eyebrow>
          <h2
            className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] text-[#003C64] md:text-5xl"
            id="notes"
          >
            Latest notes.
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-6">
          {ordered.length === 0 ? (
            <Surface className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">The Knowledge Hub is being set up.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The article feed is temporarily unavailable. Please try again shortly.'
                  : 'Articles from the engineering and research teams will appear here.'}
              </p>
            </Surface>
          ) : (
            <ul aria-labelledby="notes" className="space-y-5" role="list">
              {ordered.map((article, index) => (
                <FeedRow article={article} href={href(article)} index={index} key={article.id} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
