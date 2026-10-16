import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { SiteFooter } from '@/components/SiteFooter'
import { getWhitepapers } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Point-of-view whitepapers, case studies, and brochures on OT cyber risk, operational context, and the future of OT monitoring.',
  title: 'Resources - Velos Shield POV Whitepaper Series',
}

const badgeClass = (kind: string): string => {
  if (kind === 'Case Study') {
    return 'bg-[#FF612A]/10 text-[#FF612A]'
  }
  if (kind === 'Brochure') {
    return 'bg-[#003C64]/10 text-[#003C64]'
  }
  return 'bg-[#003C64]/5 text-[#003C64]'
}

export default async function ResourcesPage() {
  const { data: papers, error } = await getWhitepapers()

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[480px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/shutterstock/industries-hero.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.55)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[480px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/70 mb-3">
                Resources - Whitepapers, Case Studies & Brochures
              </p>
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Rethinking OT security, in plain operational terms.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                Point-of-view papers, field case studies, and the platform brochure on closing the gap between what OT
                security tools see and what plant, security, and executive teams need to know.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
                {['Ungated - free to read', 'HTML + PDF download', 'Board-ready frameworks'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        {papers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {papers.map((paper) => (
              <Card
                key={paper.id}
                className="overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300"
              >
                <CardContent className="p-9 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full ${badgeClass(paper.kind)}`}>
                      {paper.kind}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold tracking-[.14em] uppercase text-muted-foreground mb-3">{paper.series}</p>
                  <h2 className="text-2xl font-semibold tracking-[-.03em] mb-1 text-[#003C64]">{paper.title}</h2>
                  <p className="text-sm font-medium text-foreground/80 mb-4">{paper.subtitle}</p>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">{paper.summary}</p>
                  {paper.keyPoints.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {paper.keyPoints.map((point) => (
                        <span key={point} className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-white text-muted-foreground">
                          {point}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {paper.readTime ? <p className="text-xs text-muted-foreground mb-6">{paper.readTime}</p> : null}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6 border-t border-border/50">
                    {paper.readOnlinePath ? (
                      <Link
                        href={paper.readOnlinePath}
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                      >
                        Read online
                      </Link>
                    ) : paper.downloadUrl ? (
                      <a
                        href={paper.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                      >
                        View PDF
                      </a>
                    ) : null}
                    {paper.downloadUrl ? (
                      <a
                        href={paper.downloadUrl}
                        download
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white text-foreground hover:bg-muted transition-colors no-underline"
                      >
                        Download PDF
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="text-[#003C64] font-medium">Resources are being updated.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The library feed is temporarily unavailable. Please try again shortly.'
                  : 'New papers and case studies are on the way.'}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        <Card className="border-border/70 overflow-hidden">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">Knowledge Hub</p>
              <h2 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-2">
                Technical notes from the field.
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Short, practical articles from the OT security engineering and research teams: protocol behaviour,
                deployment evidence, detection design and the operational reasoning behind them.
              </p>
            </div>
            <Link
              href="/resources/knowledge-hub"
              className="shrink-0 inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              Open the Knowledge Hub
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        <Card className="border-border/70">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">A position, not a product claim</p>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                These papers describe our perspective on how OT monitoring should evolve. They intentionally do not
                present every idea as an already-shipped capability.
              </p>
            </div>
            <Link
              href="/demo"
              className="shrink-0 inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              Continue the conversation
            </Link>
          </CardContent>
        </Card>
      </section>

      <SiteFooter />
    </>
  )
}
