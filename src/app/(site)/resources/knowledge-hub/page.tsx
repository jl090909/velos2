import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { SiteFooter } from '@/components/SiteFooter'
import { getKnowledgeArticles } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Practical notes from the Velos Shield engineering and research teams on OT security, detection design, deployment evidence and compliance.',
  title: 'Knowledge Hub - Velos Shield',
}

export default async function KnowledgeHubPage() {
  const { data: articles, error } = await getKnowledgeArticles()

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
          Resources - Knowledge Hub
        </p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Notes from the plant floor.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Working notes from the OT security engineering and research teams: what we found, how we verified it, and what
          it means for the people running the process.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
          >
            Whitepapers &amp; case studies
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
          >
            Request a demo
          </Link>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300"
              >
                <CardContent className="p-9 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full bg-[#FF612A]/10 text-[#FF612A]">
                      {article.category}
                    </span>
                    {article.readingTime ? (
                      <span className="text-[11px] text-muted-foreground">{article.readingTime}</span>
                    ) : null}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-.03em] mb-3 text-[#003C64]">
                    <Link href={`/resources/knowledge-hub/${article.slug}/`} className="no-underline text-[#003C64] hover:text-[#FF612A] transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>
                  {article.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-white text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-auto pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {article.authorName}
                      {article.authorRole ? ` - ${article.authorRole}` : ''}
                      {article.publishedDate ? ` - ${formatDate(article.publishedDate)}` : ''}
                    </p>
                    <Link
                      href={`/resources/knowledge-hub/${article.slug}/`}
                      className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
                    >
                      Read article
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="text-[#003C64] font-medium">The Knowledge Hub is being set up.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The article feed is temporarily unavailable. Please try again shortly.'
                  : 'Articles from the engineering and research teams will appear here.'}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
