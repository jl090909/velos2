import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { getEvents } from '@/lib/cms'
import { formatDate } from '@/lib/format'

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

export default async function CompanyEventsPage() {
  const { data: events, error } = await getEvents()

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((event) => event.startDate.slice(0, 10) >= today)
  const past = events
    .filter((event) => event.startDate.slice(0, 10) < today)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Events.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Where to meet the team: conferences, trade exhibitions and technical briefings on OT security and
          operational resilience.
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          {upcoming.length > 0
            ? `${upcoming.length} upcoming ${upcoming.length === 1 ? 'event' : 'events'}`
            : 'No upcoming events currently scheduled'}
        </p>
      </section>

      <section className="pb-12 max-w-6xl mx-auto px-6">
        {upcoming.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {upcoming.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300"
              >
                <CardContent className="p-9 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full bg-[#FF612A]/10 text-[#FF612A]">
                      {event.eventType}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{dateRange(event.startDate, event.endDate)}</span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-.03em] mb-2 text-[#003C64]">
                    {event.description ? (
                      <Link href={`/company/events/${event.slug}/`} className="no-underline text-[#003C64] hover:text-[#FF612A] transition-colors">
                        {event.title}
                      </Link>
                    ) : (
                      event.title
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {[event.venue, event.city, event.country].filter(Boolean).join(', ')}
                    {event.booth ? ` - ${event.booth}` : ''}
                  </p>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">{event.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6 border-t border-border/50">
                    {event.description ? (
                      <Link
                        href={`/company/events/${event.slug}/`}
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                      >
                        Event details
                      </Link>
                    ) : null}
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white text-foreground hover:bg-muted transition-colors no-underline"
                      >
                        Register / meet us
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
              <p className="text-[#003C64] font-medium">No upcoming events scheduled.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The events feed is temporarily unavailable. Please try again shortly.'
                  : 'New conferences, exhibitions and briefings are announced here as they are confirmed.'}
              </p>
              <Link
                href="/company/contact"
                className="mt-6 inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
              >
                Invite us to your event
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {past.length > 0 ? (
        <section className="pb-24 max-w-6xl mx-auto px-6">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-6">Past events</p>
          <div className="overflow-x-auto rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-2 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="font-semibold p-4">Event</th>
                  <th className="font-semibold p-4">Type</th>
                  <th className="font-semibold p-4">Date</th>
                  <th className="font-semibold p-4">Location</th>
                </tr>
              </thead>
              <tbody>
                {past.map((event) => (
                  <tr key={event.id} className="border-t border-border/60">
                    <td className="p-4 text-[#003C64]">
                      {event.description ? (
                        <Link href={`/company/events/${event.slug}/`} className="no-underline text-[#003C64] hover:text-[#FF612A] transition-colors">
                          {event.title}
                        </Link>
                      ) : (
                        event.title
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">{event.eventType}</td>
                    <td className="p-4 text-muted-foreground">{dateRange(event.startDate, event.endDate)}</td>
                    <td className="p-4 text-muted-foreground">
                      {[event.city, event.country].filter(Boolean).join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  )
}
