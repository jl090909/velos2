import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { getEventBySlug } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { data: event } = await getEventBySlug(slug)
  if (!event) {
    return { title: 'Event not found - Velos Shield' }
  }
  return {
    description: event.summary,
    title: `${event.title} - Events - Velos Shield`,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const { data: event } = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const where = [event.venue, event.city, event.country].filter(Boolean).join(', ')
  const when = event.endDate && formatDate(event.endDate) !== formatDate(event.startDate)
    ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
    : formatDate(event.startDate)

  const facts = [
    { label: 'Type', value: event.eventType },
    { label: 'When', value: when },
    { label: 'Where', value: where || 'To be confirmed' },
    { label: 'Booth', value: event.booth || 'Not applicable' },
  ]

  const hero = event.registrationUrl || event.websiteUrl

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">
          Events - {event.eventType}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-[-.05em] leading-[1.05] mb-5 max-w-3xl text-[#003C64]">
          {event.title}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">{event.summary}</p>
      </section>

      {event.coverImage ? (
        <section className="max-w-6xl mx-auto px-6">
          <figure className="overflow-hidden rounded-[1.6rem] border border-white/55">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={event.coverImage.alt || event.title}
              className="w-full object-cover"
              height={event.coverImage.height}
              src={event.coverImage.url}
              width={event.coverImage.width}
            />
          </figure>
          {event.coverCaption ? <figcaption className="mt-2 text-sm text-muted-foreground">{event.coverCaption}</figcaption> : null}
        </section>
      ) : null}

      <section className="pb-12 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_320px] gap-10">
        <article className="min-w-0">
          {event.description ? (
            <RichText
              className="text-[14.25px] leading-relaxed text-muted-foreground [&_a]:text-[#003C64] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF612A]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-.03em] [&_h2]:text-[#003C64] [&_h2]:mt-9 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#003C64] [&_h3]:mt-7 [&_h3]:mb-2 [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-[#003C64] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5"
              data={event.description}
            />
          ) : (
            <p className="text-[14.25px] text-muted-foreground">
              Full details for this event will be published here as the agenda is confirmed.
            </p>
          )}
        </article>

        <aside className="lg:sticky lg:top-28 h-max rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-7 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <dl className="space-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10.45px] font-semibold tracking-[.16em] uppercase text-muted-foreground">{fact.label}</dt>
                <dd className="text-sm text-[#003C64] mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {hero ? (
            <a
              href={hero}
              target="_blank"
              rel="noreferrer"
              className="mt-7 w-full inline-flex items-center justify-center rounded-full h-12 px-7 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              {event.registrationUrl ? 'Register / meet us' : 'Event website'}
            </a>
          ) : null}
          <Link
            href="/company/events"
            className="mt-3 w-full inline-flex items-center justify-center rounded-full h-11 px-6 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
          >
            All events
          </Link>
        </aside>
      </section>

      <SiteFooter />
    </>
  )
}
