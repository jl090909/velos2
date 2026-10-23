import type { Metadata } from 'next'
import Link from 'next/link'

import { CompanyTabs } from '@/components/CompanyTabs'
import { SiteFooter } from '@/components/SiteFooter'
import { getOpenJobs } from '@/lib/cms'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata: Metadata = pageMetadata({
  path: '/company/careers/',
  description: 'Open roles at Velos Shield: cyber-physical security for industrial and critical infrastructure environments.',
  title: 'Careers - Velos Shield',
})

export default async function CompanyCareersPage() {
  const { data: jobs, error } = await getOpenJobs()

  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Careers.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Work on cyber-physical security for industrial and critical infrastructure environments.
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          {jobs.length > 0
            ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}`
            : 'Openings are being updated'}
        </p>
      </section>

      <section className="pb-16 max-w-6xl mx-auto px-6">
        {jobs.length > 0 ? (
          <div className="overflow-x-auto rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-2 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="font-semibold p-4">Role</th>
                  <th className="font-semibold p-4">Team</th>
                  <th className="font-semibold p-4">Location</th>
                  <th className="font-semibold p-4">Type</th>
                  <th className="font-semibold p-4" />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-border/60 align-top">
                    <td className="p-4 max-w-xl">
                      <Link
                        href={`/company/careers/${job.slug}/`}
                        className="no-underline font-medium text-[#003C64] hover:text-[#FF612A] transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{job.summary}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">{job.team}</td>
                    <td className="p-4 text-muted-foreground">
                      {job.location}
                      <span className="block text-xs">{job.workMode}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {job.employmentType}
                      {job.experience ? <span className="block text-xs">{job.experience}</span> : null}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/company/careers/${job.slug}/`}
                        className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors whitespace-nowrap"
                      >
                        View role
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-10 text-center shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <p className="text-[#003C64] font-medium">No open roles at the moment.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error
                ? 'Our careers feed is temporarily unavailable. Please try again shortly, or get in touch with us directly.'
                : 'We are always interested in hearing from OT security engineers. Introduce yourself through the contact page.'}
            </p>
            <Link
              href="/company/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full h-11 px-6 text-[13.3px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              Contact us
            </Link>
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
