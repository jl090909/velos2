import type { Metadata } from 'next'

import { Card, CardContent } from '@/components/ui/card'
import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { getPressMentions } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export const revalidate = 300

export const metadata: Metadata = {
  description: 'Press coverage, interviews and awards about Velos Shield and OT security in industrial environments.',
  title: 'Media - Velos Shield',
}

export default async function CompanyMediaPage() {
  const { data: mentions, error } = await getPressMentions()

  const byYear = new Map<string, typeof mentions>()
  for (const mention of mentions) {
    const year = mention.publishedDate ? mention.publishedDate.slice(0, 4) : 'Undated'
    byYear.set(year, [...(byYear.get(year) ?? []), mention])
  }
  const years = [...byYear.keys()].sort((a, b) => b.localeCompare(a))

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Media.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Press coverage, interviews and awards. For press enquiries, briefings or comment on an OT security story,
          reach the team through the contact page.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="/company/contact"
            className="inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
          >
            Press enquiries
          </a>
        </div>
      </section>

      <section className="pb-24 max-w-6xl mx-auto px-6">
        {mentions.length > 0 ? (
          <div className="space-y-12">
            {years.map((year) => (
              <div key={year}>
                <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-5">{year}</p>
                <div className="grid md:grid-cols-2 gap-5">
                  {(byYear.get(year) ?? []).map((mention) => (
                    <Card key={mention.id} className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
                      <CardContent className="p-8 md:p-9 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          {mention.logo ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img alt={mention.logo.alt || mention.outlet} className="max-h-8 w-auto object-contain" src={mention.logo.url} />
                            </>
                          ) : (
                            <span className="text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full bg-[#003C64]/5 text-[#003C64]">
                              {mention.kind}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {mention.outlet}
                            {mention.publishedDate ? ` - ${formatDate(mention.publishedDate)}` : ''}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold tracking-[-.03em] mb-3 text-[#003C64]">
                          <a
                            href={mention.url}
                            target="_blank"
                            rel="noreferrer"
                            className="no-underline text-[#003C64] hover:text-[#FF612A] transition-colors"
                          >
                            {mention.headline}
                          </a>
                        </h2>
                        {mention.excerpt ? (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{mention.excerpt}</p>
                        ) : null}
                        <a
                          href={mention.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-auto pt-6 text-sm font-medium text-[#003C64] no-underline hover:text-[#FF612A] transition-colors"
                        >
                          Read the coverage
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="text-[#003C64] font-medium">No press coverage listed yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The media feed is temporarily unavailable. Please try again shortly.'
                  : 'Coverage, interviews and awards appear here as they are published.'}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
