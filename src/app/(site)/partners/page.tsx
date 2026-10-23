import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStatus } from '@/components/FormStatus';
import { SiteFooter } from '@/components/SiteFooter';

import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/partners/',
  description:
    'Partner with Velos Shield: assessment, architecture and continuous OT monitoring your industrial clients can verify. For system integrators, MSSPs, OT consultancies and automation partners.',
  title: 'Partners - Velos Shield',
});

const inputClass =
  'h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]';

const selectClass =
  'w-full h-12 rounded-[1rem] px-4 bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-0 text-sm text-foreground font-sans outline-none focus:ring-2 focus:ring-primary/15 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]';

const benefits = [
  {
    title: 'Serve the clients you already have',
    body: 'Bring an OT monitoring and assessment offering into accounts you already run, without building a product team or a SOC capability from scratch.',
  },
  {
    title: 'Find the answer, not just a product',
    body: 'We work the discovery with you: passive assessment, a verified asset inventory, a risk register ordered by operational consequence, and a clear architecture recommendation.',
  },
  {
    title: 'New revenue stream',
    body: 'Margin on licences, delivery services and assessments, with joint scoping and technical support from our engineering team on live opportunities.',
  },
  {
    title: 'Win work you cannot reach alone',
    body: 'Use cyber-physical evidence in bids that would otherwise stall at the security question, and take our references into yours.',
  },
];

const criteria = [
  'An active practice serving industrial, utility, transport or critical-infrastructure customers',
  'Ability to run site discovery and change-controlled deployments - or a delivery partner who can',
  'Familiarity with IEC 62443 and the Purdue model, or willingness to complete Velos Shield partner enablement',
  'Commercial coverage in at least one region you can support end to end',
  'No competing inline, intrusive or traffic-injecting OT monitoring product',
  'A named technical owner for the partnership on your side',
  'A joint engagement model: assess, pilot, then rollout',
];

const partnerTypes = [
  'System integrators and automation VARs',
  'MSSPs and SOC providers adding OT visibility',
  'OT security consultancies and assessment practices',
  'Distributors with industrial reach',
  'Technology vendors: SIEM, CMDB, ITSM, network and cloud',
  'Regional partners across India, the Middle East and the UK',
];

export default function PartnersPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Partners</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Find the OT answer with your clients.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
          Most industrial teams know they have an OT security gap but cannot describe it well enough to get funded.
          Velos Shield gives your practice the evidence to find the answer, scope it, and prove it in a pilot - without
          touching a controller.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#partner-form"
            className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
          >
            Become a partner
          </a>
          <Link
            href="/resources/airport-bms-cybersecurity-case-study"
            className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-medium border border-border/70 no-underline text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors"
          >
            See a delivered engagement
          </Link>
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">For partners</p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-[-.04em] text-[#003C64] mb-4 max-w-3xl">
          A faster route to an answer your client can fund
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mb-10">
          The blocker in OT security is rarely technology: it is the change window and the missing evidence. We bring
          the assessment, the sensor and the operational framing; you keep the relationship and the delivery.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {benefits.map((b) => (
            <Card
              key={b.title}
              className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300"
            >
              <CardContent className="p-8 md:p-9">
                <h3 className="text-title-xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Who qualifies</p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-[-.04em] text-[#003C64] mb-4 max-w-3xl">
          Indicative partnership criteria
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mb-8">
          A quick way to judge whether a partnership is likely to work for both sides.
        </p>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-3 max-w-4xl">
          {criteria.map((c) => (
            <li key={c} className="flex gap-3 text-sm md:text-[14.25px] text-muted-foreground leading-relaxed">
              <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF612A]" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[12.35px] text-muted-foreground max-w-3xl">
          *Indicative only and subject to review: scope, region and commercial terms are agreed per partner. Contact us
          and we will talk you through the current programme.
        </p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-6 items-start">
        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-8 md:p-10">
            <h3 className="text-title-xl font-semibold tracking-[-.03em] text-[#003C64] mb-4">Who we partner with</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We work with organisations that already sit next to industrial operations.
            </p>
            <ul className="space-y-2.5">
              {partnerTypes.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#003C64]/40" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-8 md:p-10">
            <h3 className="text-title-xl font-semibold tracking-[-.03em] text-[#003C64] mb-4">Why it matters</h3>
            <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed mb-6">
              Most industrial sites can describe their process in detail and their cyber-physical exposure barely at
              all: which assets exist, what they talk to, and which failure stops production. That gap is why OT
              security projects stall before they are scoped.
            </p>
            <ul className="space-y-2.5">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF612A]" />
                <span>Turn a vague cyber concern into a scoped, fundable project</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF612A]" />
                <span>Stay the trusted advisor - we supply the evidence, you own the relationship</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF612A]" />
                <span>Reach the plant, security and executive audiences with the same findings</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="partner-form" className="py-12 pb-24 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Become a partner</p>
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-[-.04em] text-[#003C64] mb-4 max-w-xl">
              Ready to find the answer with your clients?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mb-7">
              Tell us how you work today and what you want to add. We will come back with the partnership model that
              fits: referral, co-delivery, or full resale with enablement.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {['Keep the client relationship', 'Joint scoping and pilot support', 'Margin on licences and services'].map(
                (tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-border/60 bg-white">
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>

          <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(247,248,250,.9)_100%)] shadow-[0_24px_70px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] ring-1 ring-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.75),transparent_42%)] pointer-events-none" />
            <CardContent className="relative p-8 md:p-10">
              <form action="/api/contact" method="post" className="flex flex-col gap-3.5">
                <FormStatus />
                <input type="hidden" name="formType" value="partner" />
                <input type="hidden" name="next" value="/partners" />
                <Input name="name" placeholder="Full name" required className={inputClass} />
                <Input name="email" type="email" placeholder="Work email" required className={inputClass} />
                <Input name="company" placeholder="Company" required className={inputClass} />
                <Input name="companyWebsite" placeholder="Company website" className={inputClass} />
                <select name="orgType" defaultValue="" className={selectClass} aria-label="Your organisation">
                  <option value="">What best describes your organisation?</option>
                  <option>System integrator</option>
                  <option>MSSP / SOC provider</option>
                  <option>OT security consultancy</option>
                  <option>Industrial automation VAR</option>
                  <option>Distributor / reseller</option>
                  <option>Technology vendor</option>
                  <option>Other</option>
                </select>
                <select name="industries" defaultValue="" className={selectClass} aria-label="Industries you serve">
                  <option value="">Industries you serve</option>
                  <option>Airports and aviation</option>
                  <option>Energy and utilities</option>
                  <option>Manufacturing and process</option>
                  <option>Maritime and ports</option>
                  <option>Critical infrastructure</option>
                  <option>Multiple industries</option>
                </select>
                <select name="otExperience" defaultValue="" className={selectClass} aria-label="OT security experience">
                  <option value="">OT security experience today</option>
                  <option>IT security practice, new to OT</option>
                  <option>Some OT projects, no dedicated practice</option>
                  <option>Established OT practice (IEC 62443, Purdue model)</option>
                  <option>Control systems / automation background</option>
                </select>
                <Input name="regions" placeholder="Regions you cover (e.g. India, Middle East, UK)" className={inputClass} />
                <Textarea
                  name="message"
                  placeholder="What would you like to do: add OT monitoring to an existing practice, co-sell on a live opportunity, integrate with our platform..."
                  className="rounded-[1rem] min-h-[130px] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]"
                />
                <label className="flex items-start gap-3 text-[12.35px] text-muted-foreground leading-relaxed cursor-pointer">
                  <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[#FF612A]" />
                  <span>
                    I agree to be contacted about this partnership enquiry. We use your details only to respond to it.
                  </span>
                </label>
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all mt-1 cursor-pointer"
                >
                  Send partnership enquiry
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
