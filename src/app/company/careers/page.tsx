import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { CompanyTabs } from '@/components/CompanyTabs';

const openings = [
  { role: 'Embedded Software Engineer', team: 'Engineering', location: 'Delhi' },
  { role: 'Security Researcher', team: 'Research', location: 'Remote' },
  { role: 'Solutions Architect', team: 'Sales Eng.', location: 'India' },
];

export default function CompanyCareersPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Careers.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Work on cyber-physical security for industrial and critical infrastructure environments.
        </p>
      </section>

      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="overflow-x-auto rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-2 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="font-semibold p-4">Role</th>
                <th className="font-semibold p-4">Team</th>
                <th className="font-semibold p-4">Location</th>
                <th className="font-semibold p-4" />
              </tr>
            </thead>
            <tbody>
              {openings.map((o) => (
                <tr key={o.role} className="border-t border-border/60">
                  <td className="p-4 text-[#003C64]">{o.role}</td>
                  <td className="p-4 text-muted-foreground">{o.team}</td>
                  <td className="p-4 text-muted-foreground">{o.location}</td>
                  <td className="p-4 text-right">
                    <Link
                      href="/company/contact"
                      className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
                    >
                      Apply
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[13px] text-muted-foreground">Sample roles for design review.</p>
      </section>

      <SiteFooter />
    </>
  );
}
