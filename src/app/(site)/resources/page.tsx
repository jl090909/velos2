import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import {
  Band,
  buttonPrimary,
  buttonSecondary,
  cardGrid,
  EditorialCard,
  EditorialHero,
  Eyebrow,
  Surface,
} from '@/components/site/editorial'
import { getWhitepapers, type WhitepaperCard } from '@/lib/cms'

/**
 * Resources - whitepapers, case studies and brochures.
 *
 * Rendered with the same editorial kit as the Media page: an eyebrow, a featured hero, then a band of
 * cards per kind. Only the DATA and the buttons differ from Media; the layout, typography and card
 * shell come from src/components/site/editorial.tsx so the two pages cannot drift apart.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description:
    'Point-of-view whitepapers, case studies, and brochures on OT cyber risk, operational context, and the future of OT monitoring.',
  title: 'Resources - Velos Shield POV Whitepaper Series',
}

/** Band order. Any kind the CMS adds later still gets a band, appended after these. */
const KIND_ORDER = ['Whitepaper', 'Case Study', 'Brochure']

const link = (paper: WhitepaperCard): null | string => paper.readOnlinePath ?? paper.downloadUrl ?? null

function PaperActions({ paper }: { paper: WhitepaperCard }) {
  const external = !paper.readOnlinePath && Boolean(paper.downloadUrl)
  return (
    <div className="flex flex-wrap gap-3 border-t border-border/50 pt-6">
      {paper.readOnlinePath ? (
        <Link className={buttonPrimary} href={paper.readOnlinePath}>
          Read online
        </Link>
      ) : null}
      {paper.downloadUrl ? (
        <a
          className={paper.readOnlinePath ? buttonSecondary : buttonPrimary}
          href={paper.downloadUrl}
          rel="noreferrer"
          target="_blank"
        >
          {external ? 'View PDF' : 'Open PDF'}
        </a>
      ) : null}
      {paper.downloadUrl && paper.readOnlinePath ? (
        <a className={buttonSecondary} download href={paper.downloadUrl}>
          Download
        </a>
      ) : null}
    </div>
  )
}

function PaperCard({ paper }: { paper: WhitepaperCard }) {
  return (
    <EditorialCard
      eyebrow={paper.kind}
      footer={
        <>
          {paper.keyPoints.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {paper.keyPoints.map((point) => (
                <span className="rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs text-muted-foreground" key={point}>
                  {point}
                </span>
              ))}
            </div>
          ) : null}
          <PaperActions paper={paper} />
        </>
      }
      href={paper.readOnlinePath ?? undefined}
      image={{ alt: paper.kind }}
      meta={paper.readTime || undefined}
      placeholder={paper.kind}
      summary={paper.subtitle ? `${paper.subtitle}. ${paper.summary}` : paper.summary}
      title={paper.title}
    />
  )
}

export default async function ResourcesPage() {
  const { data: papers, error } = await getWhitepapers()

  const featured = papers[0] ?? null
  const rest = featured ? papers.filter((paper) => paper.id !== featured.id) : papers
  const kinds = [...new Set([...KIND_ORDER, ...rest.map((paper) => paper.kind)])].filter((kind) =>
    rest.some((paper) => paper.kind === kind),
  )

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <Eyebrow>Resources</Eyebrow>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        {papers.length === 0 ? (
          <Surface className="p-8 md:p-10">
            <p className="font-medium text-[#003C64]">Resources are being updated.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error
                ? 'The library feed is temporarily unavailable. Please try again shortly.'
                : 'New papers and case studies are on the way.'}
            </p>
          </Surface>
        ) : (
          <div className="space-y-14">
            {featured ? (
              <EditorialHero
                badge={featured.kind}
                cta={link(featured) ? { href: link(featured) as string, label: 'Read the paper' } : undefined}
                eyebrow={featured.series || 'Velos Shield library'}
                image={{ alt: 'Velos Shield resources', src: '/shutterstock/industries-hero.jpg' }}
                meta={
                  <>
                    {featured.readTime ? <span>{featured.readTime}</span> : null}
                    <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
                    <span>Ungated - free to read</span>
                  </>
                }
                summary={featured.subtitle ? `${featured.subtitle}. ${featured.summary}` : featured.summary}
                title={featured.title}
              />
            ) : null}

            {kinds.map((kind) => (
              <Band key={kind} count={rest.filter((paper) => paper.kind === kind).length} title={kind === 'Case Study' ? 'Case studies' : `${kind}s`}>
                <div className={cardGrid}>
                  {rest
                    .filter((paper) => paper.kind === kind)
                    .map((paper) => (
                      <PaperCard key={paper.id} paper={paper} />
                    ))}
                </div>
              </Band>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <Surface className="flex flex-col justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <Eyebrow className="mb-2">Knowledge Hub</Eyebrow>
            <h2 className="mb-2 text-2xl font-semibold tracking-[-.03em] text-[#003C64]">Technical notes from the field</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Short, practical articles from the OT security engineering and research teams: protocol behaviour,
              deployment evidence, detection design and the operational reasoning behind them.
            </p>
          </div>
          <Link className={`${buttonPrimary} shrink-0 px-8`} href="/resources/knowledge-hub/">
            Open the Knowledge Hub
          </Link>
        </Surface>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Surface className="flex flex-col justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <Eyebrow className="mb-2">A position, not a product claim</Eyebrow>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              These papers describe our perspective on how OT monitoring should evolve. They intentionally do not
              present every idea as an already-shipped capability.
            </p>
          </div>
          <Link className={`${buttonPrimary} shrink-0 px-8`} href="/demo">
            Continue the conversation
          </Link>
        </Surface>
      </section>

      <SiteFooter />
    </>
  )
}
