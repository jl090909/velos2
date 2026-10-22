import { SiteFooter } from '@/components/SiteFooter';
import { CompanyTabs } from '@/components/CompanyTabs';

export default function CompanyAboutPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          About Velos Shield.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Velos Shield operates in cyber-physical security and intelligent operations, serving environments spanning
          IT, OT, ICS, IoT and connected assets. Our mission: make vulnerability assessment continuous, passive and
          decision-ready.
        </p>
      </section>

      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: 'Continuous', body: 'Assessment that runs with operations, not against them.' },
            { label: 'Passive', body: 'No active scanning, no disruption to production or safety systems.' },
            { label: 'Decision-ready', body: 'Findings framed for the people who have to act on them.' },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-8 shadow-[0_1px_3px_rgba(15,23,42,.04)]"
            >
              <h2 className="text-title-lg font-semibold text-[#003C64] mb-2">{c.label}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
