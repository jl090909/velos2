import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStatus } from '@/components/FormStatus';
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/demo/',
  title: 'Request a Demo - Velos Shield',
  description: 'Plan a walkthrough, site visit or POC shaped around your operating environment.',
});

const agenda = [
  'A guided walkthrough of the product.',
  'A discussion of your network, OT, and leadership priorities.',
  'A site visit or remote session to review your environment.',
  'A practical path to a POC scoped to your business goals.',
];

const outcomes = [
  'A clear conversation with the right technical and business stakeholders.',
  'A tailored POC plan aligned to visibility, detection, and operational value.',
  'A simple next step: contact, talk, site visit, or pilot scheduling.',
  'A premium demo flow that feels polished, calm, and modern.',
];

export default function DemoPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 items-stretch">
          <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.97)_0%,rgba(246,247,249,.9)_100%)] shadow-[0_24px_70px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] ring-1 ring-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.8),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,.12),transparent_38%)] pointer-events-none" />
            <CardContent className="relative p-8 md:p-10 h-full flex flex-col justify-between">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-4">Let’s talk</p>
              <h1 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-6">Plan a walkthrough, site visit, or POC.</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Tell us what you want to improve and we’ll shape the conversation around your operating environment, your team, and the outcomes that matter.
              </p>
              <div className="space-y-3 mb-8">
                {agenda.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-[#FF612A] font-bold mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#ffffff,#f7f7f9)] p-5 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <p className="text-[10.45px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-3">What you get</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {outcomes.map((o) => (
                    <li key={o}>• {o}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(247,248,250,.9)_100%)] shadow-[0_24px_70px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] ring-1 ring-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.75),transparent_42%)] pointer-events-none" />
            <CardContent className="relative p-8 md:p-10">
              <form action="/api/contact" method="post" className="flex flex-col gap-3.5">
                <FormStatus />
                <Input name="name" placeholder="Full name" required className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]" />
                <Input name="email" type="email" placeholder="Work email" required className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]" />
                <Input name="organization" placeholder="Organization" className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]" />
                <select name="role" className="w-full h-12 rounded-[1rem] px-4 bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-0 text-sm text-foreground font-sans outline-none focus:ring-2 focus:ring-primary/15 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]">
                  <option value="">Role</option><option>CISO / Security</option><option>Plant / OT Head</option><option>SOC</option><option>Engineering</option><option>Executive</option>
                </select>
                <select name="industry" className="w-full h-12 rounded-[1rem] px-4 bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-0 text-sm text-foreground font-sans outline-none focus:ring-2 focus:ring-primary/15 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]">
                  <option value="">Industry</option><option>Aviation</option><option>Energy</option><option>Manufacturing</option><option>Critical Infrastructure</option>
                </select>
                <Input name="sites" placeholder="Number of OT sites" className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]" />
                <Textarea name="goal" placeholder="Primary goal: visibility, detection, compliance, resilience..." className="rounded-[1rem] min-h-[110px] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]" />
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button type="submit" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(242,243,246,.88)_100%)] text-foreground ring-1 ring-white/80 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.05)] hover:brightness-[1.02] transition-colors mt-1 cursor-pointer">
                  Book a walkthrough
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
