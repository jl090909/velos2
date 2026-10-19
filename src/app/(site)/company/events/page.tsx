import type { Metadata } from 'next'
import Link from 'next/link'

import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import {
  Band,
  buttonPrimary,
  buttonSecondary,
  cardGrid,
  DateBlock,
  EditorialCard,
  EditorialHero,
  Eyebrow,
  Surface,
} from '@/components/site/editorial'
import { getEvents, type EventItem } from '@/lib/cms'
import { formatDate } from '@/lib/format'

/**
 * Events - the same editorial layout as the Media page.
 *
 * One difference is deliberate: events carry no imagery, so instead of a wall of empty image slots
 * each card leads with a DATE BLOCK (the one fact that matters most about an event), and the hero
 * puts the next event's date beside the copy.
 */

export const revalidate = 300

export const metadata: Metadata = {
  description: 'Conferences, exhibitions and briefings where the Velos Shield team is presenting or exhibiting.',
  title: 'Events - Velos Shield',
}

const dateRange = (start: string, end?: string): string => {
  const from = formatDate(start)
  if (!end) {
    return from
  }
  const to = formatDate(end)
  return from === to ? from : `${from} - ${to}`
}

const place = (event: EventItem): string => [event.venue, event.city, event.country].filter(Boolean).join(', ')

export default async function CompanyEventsPage() {
  const { data: events, error } = await getEvents()

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((event) => event.startDate.slice(0, 10) >= today)
  const past = events.filter((event) => event.startDate.slice(0, 10) < today).sort((a, b) => b.startDate.localeCompare(a.startDate))

  const next = upcoming[0] ?? null
  const laterUpcoming = next ? upcoming.filter((event) => event.id !== next.id) : upcoming

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <CompanyTabs />
        <Eyebrow className="mt-10">Events</Eyebrow>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="space-y-14">
          {next ? (
            <EditorialHero
              aside={next.coverImage ? undefined : <DateBlock iso={next.startDate} />}
              badge={next.eventType}
              cta={
                next.description
                  ? { href: `/company/events/${next.slug}/`, label: 'Event details' }
                  : next.registrationUrl
                    ? { href: next.registrationUrl, label: 'Register / meet us' }
                    : undefined
              }
              eyebrow={place(next) || 'Velos Shield'}
              image={
                next.coverImage
                  ? {
                      alt: next.coverImage.alt || next.title,
                      height: next.coverImage.height,
                      src: next.coverImage.url,
                      width: next.coverImage.width,
                    }
                  : undefined
              }
              meta={
                <>
                  <span>{dateRange(next.startDate, next.endDate)}</span>
                  {next.booth ? <span>{next.booth}</span> : null}
                </>
              }
              summary={next.summary}
              title={next.title}
            />
          ) : null}

          {laterUpcoming.length > 0 ? (
            <Band count={laterUpcoming.length} title="Also coming up">
              <div className={cardGrid}>
                {laterUpcoming.map((event) => (
                  <EditorialCard
                    eyebrow={event.eventType}
                    footer={
                      <div className="flex flex-wrap gap-3 border-t border-border/50 pt-6">
                        {event.description ? (
                          <Link className={buttonPrimary} href={`/company/events/${event.slug}/`}>
                            Event details
                          </Link>
                        ) : null}
                        {event.registrationUrl ? (
                          <a className={buttonSecondary} href={event.registrationUrl} rel="noreferrer" target="_blank">
                            Register / meet us
                          </a>
                        ) : null}
                      </div>
                    }
                    href={event.description ? `/company/events/${event.slug}/` : undefined}
                    image={
                      event.coverImage
                        ? {
                            alt: event.coverImage.alt || event.title,
                            height: event.coverImage.height,
                            src: event.coverImage.url,
                            width: event.coverImage.width,
                          }
                        : undefined
                    }
                    key={event.id}
                    media={event.coverImage ? undefined : <DateBlock iso={event.startDate} />}
                    meta={dateRange(event.startDate, event.endDate)}
                    summary={place(event) ? `${place(event)}${event.booth ? ` - ${event.booth}` : ''}. ${event.summary}` : event.summary}
                    title={event.title}
                  />
                ))}
              </div>
            </Band>
          ) : null}

          {!next && laterUpcoming.length === 0 ? (
            <Surface className="p-8 md:p-10">
              <p className="font-medium text-[#003C64]">No upcoming events scheduled.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The events feed is temporarily unavailable. Please try again shortly.'
                  : 'New conferences, exhibitions and briefings are announced here as they are confirmed.'}
              </p>
              <Link className={`${buttonSecondary} mt-6`} href="/company/contact">
                Invite us to your event
              </Link>
            </Surface>
          ) : null}

          {past.length > 0 ? (
            <section className="border-t border-border/60 pt-12">
              <div className="mb-7">
                <h2 className="text-[24px] font-bold tracking-[-.04em] text-[#003C64] md:text-[30px]">Past events</h2>
              </div>
              <Surface className="overflow-x-auto p-2">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="p-4 font-semibold">Event</th>
                      <th className="p-4 font-semibold">Type</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {past.map((event) => (
                      <tr className="border-t border-border/60" key={event.id}>
                        <td className="p-4 text-[#003C64]">
                          {event.description ? (
                            <Link className="no-underline text-[#003C64] transition-colors hover:text-[#FF612A]" href={`/company/events/${event.slug}/`}>
                              {event.title}
                            </Link>
                          ) : (
                            event.title
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{event.eventType}</td>
                        <td className="p-4 text-muted-foreground">{dateRange(event.startDate, event.endDate)}</td>
                        <td className="p-4 text-muted-foreground">{[event.city, event.country].filter(Boolean).join(', ') || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            </section>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
