import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/SiteFooter'
import { Eyebrow } from '@/components/site/editorial'
import { RichBody } from '@/components/site/RichBody'
import { getWhitepaperBySlug } from '@/lib/cms'
import { formatDate } from '@/lib/format'

/**
 * A whitepaper or case study's HTML edition - /resources/<slug>/.
 *
 * The record lives in the "Whitepapers & case studies" collection, so the whole story is written in
 * the Payload admin: title, summary, body, at-a-glance facts, pull quote and PDF. A record with no
 * body is not a page - it stays a card on /resources - which is why a slug without a body 404s here.
 *
 * Drafts cannot reach this page: getWhitepaperBySlug filters `_status = published` with access
 * control ON, so an unfinished case study 404s for the public.
 */

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: paper } = await getWhitepaperBySlug(slug)

  if (!paper) {
    return { title: 'Resource not found - Velos Shield' }
  }

  return {
    description: paper.subtitle || paper.summary,
    title: `${paper.title} - ${paper.kind} - Velos Shield`,
  }
}

export default async function WhitepaperPage({ params }: Props) {
  const { slug } = await params
  const { data: paper } = await getWhitepaperBySlug(slug)

  if (!paper || !paper.body) {
    notFound()
  }

  const facts: { label: string; value: string }[] = [
    ...(paper.sector ? [{ label: 'Sector', value: paper.sector }] : []),
    ...(paper.region ? [{ label: 'Region', value: paper.region }] : []),
  ]

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <Link
          className="text-[11.4px] font-medium text-muted-foreground no-underline transition-colors hover:text-[#FF612A]"
          href="/resources"
        >
          <span aria-hidden>&larr;</span> All resources
        </Link>
        <div className="mt-8">
          <Eyebrow>
            {paper.kind}
            {paper.series ? ` - ${paper.series}` : ''}
          </Eyebrow>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.05] tracking-[-.05em] text-[#003C64] md:text-5xl">
          {paper.title}
        </h1>
        {paper.subtitle ? (
          <p className="mt-5 max-w-3xl text-lg font-medium leading-snug text-[#003C64]/80 md:text-xl">
            {paper.subtitle}
          </p>
        ) : null}
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{paper.summary}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {paper.downloadUrl ? (
            <a
              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] px-6 text-sm font-semibold text-[#FF612A] no-underline"
              download
              href={paper.downloadUrl}
            >
              Download PDF
            </a>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {paper.publishedDate ? formatDate(paper.publishedDate) : null}
            {paper.publishedDate && paper.readTime ? ' - ' : ''}
            {paper.readTime}
          </span>
        </div>
      </section>

      {paper.coverImage ? (
        <section className="mx-auto max-w-6xl px-6 pb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={paper.coverImage.alt || paper.title}
            className="w-full rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]"
            src={paper.coverImage.url}
          />
          {paper.coverCaption ? (
            <p className="mt-3 text-xs text-muted-foreground">{paper.coverCaption}</p>
          ) : null}
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <RichBody body={paper.body} />
        </article>

        <aside className="min-w-0">
          {facts.length > 0 ? (
            <div className="rounded-[1.35rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-7">
              <p className="text-[10.45px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">At a glance</p>
              <dl className="mt-4 space-y-3">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[10.45px] uppercase tracking-[.14em] text-muted-foreground">{fact.label}</dt>
                    <dd className="text-sm font-medium text-[#003C64]">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {paper.quote ? (
            <blockquote className="mt-5 rounded-[1.35rem] border border-border/60 bg-[#003C64] p-7 text-white">
              <p className="text-[14.25px] leading-relaxed">&ldquo;{paper.quote}&rdquo;</p>
              {paper.quoteAuthor || paper.quoteRole ? (
                <footer className="mt-4 text-[10.45px] uppercase tracking-[.14em] text-white/60">
                  {paper.quoteAuthor}
                  {paper.quoteAuthor && paper.quoteRole ? ', ' : ''}
                  {paper.quoteRole}
                </footer>
              ) : null}
            </blockquote>
          ) : null}

          <div className="mt-5 rounded-[1.35rem] border border-border/60 p-7">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Want the same visibility across your own estate? We will walk your OT network with you, read-only, and
              show you what is actually on it.
            </p>
            <Link className="mt-4 inline-flex text-sm font-medium text-[#003C64] no-underline hover:text-[#FF612A]" href="/demo">
              Request a demo
            </Link>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </>
  )
}
