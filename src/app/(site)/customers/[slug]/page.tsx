import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/SiteFooter'
import { Eyebrow } from '@/components/site/editorial'
import { RichBody } from '@/components/site/RichBody'
import { getCustomerBySlug } from '@/lib/cms'

/**
 * Customer story - /customers/<slug>/.
 *
 * A customer record whose `caseStudy` field is filled gets this page; the card on /customers links
 * here instead of to an external site. The long-form body is CMS rich text, rendered with the same
 * body renderer as a newsroom article, so an editor can format headings, lists, quotes and images
 * without a developer.
 *
 * Drafts cannot reach this page: getCustomerBySlug filters `_status = published` with access control
 * ON, so an unfinished case study 404s for the public.
 */

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: customer } = await getCustomerBySlug(slug)

  if (!customer) {
    return { title: 'Customer story not found - Velos Shield' }
  }

  return {
    description: customer.summary,
    title: `${customer.name} - Customer story - Velos Shield`,
  }
}

export default async function CustomerStoryPage({ params }: Props) {
  const { slug } = await params
  const { data: customer } = await getCustomerBySlug(slug)

  if (!customer) {
    notFound()
  }

  const facts: { label: string; value: string }[] = [
    { label: 'Sector', value: customer.sector },
    ...(customer.region ? [{ label: 'Region', value: customer.region }] : []),
  ]

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <Link
          className="text-[12px] font-medium text-muted-foreground no-underline transition-colors hover:text-[#FF612A]"
          href="/customers"
        >
          <span aria-hidden>&larr;</span> All customers
        </Link>
        <div className="mt-8">
          <Eyebrow>Customer story</Eyebrow>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.05] tracking-[-.05em] text-[#003C64] md:text-5xl">
          {customer.name}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{customer.summary}</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          {customer.caseStudy ? (
            <RichBody body={customer.caseStudy} />
          ) : (
            <p className="text-sm text-muted-foreground">The full story for this customer is being written.</p>
          )}
        </article>

        <aside className="min-w-0">
          <div className="rounded-[1.35rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF612A]">At a glance</p>
            <dl className="mt-4 space-y-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[11px] uppercase tracking-[.14em] text-muted-foreground">{fact.label}</dt>
                  <dd className="text-sm font-medium text-[#003C64]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {customer.quote ? (
            <blockquote className="mt-5 rounded-[1.35rem] border border-border/60 bg-[#003C64] p-7 text-white">
              <p className="text-[15px] leading-relaxed">&ldquo;{customer.quote}&rdquo;</p>
              {customer.quoteAuthor || customer.quoteRole ? (
                <footer className="mt-4 text-[11px] uppercase tracking-[.14em] text-white/60">
                  {customer.quoteAuthor}
                  {customer.quoteAuthor && customer.quoteRole ? ', ' : ''}
                  {customer.quoteRole}
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
