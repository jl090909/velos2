import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormStatus } from '@/components/FormStatus';
import { SiteFooter } from '@/components/SiteFooter';
import { CompanyTabs } from '@/components/CompanyTabs';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/company/contact/',
  title: 'Contact Us - Velos Shield',
  description: 'Talk to the Velos Shield team about a walkthrough, site visit or proof of concept.',
});

const inputClass =
  'h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]';

export default function CompanyContactPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Contact Us.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Tell us what you need and we will route you to the right team.
        </p>
      </section>

      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 items-start">
          <div className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-8 md:p-9 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <p className="text-[10.45px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-5">Velos Shield</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>AWFIS Tower C, Bhutani Alphatum,</p>
              <p>Floor 19, Sector 90, Noida 201305</p>
            </div>
            <div className="mt-5 space-y-1 text-sm text-muted-foreground">
              <p>
                Email:{' '}
                <a href="mailto:demo@velosshield.com" className="no-underline hover:text-foreground">
                  demo@velosshield.com
                </a>
              </p>
            </div>
          </div>

          <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(247,248,250,.9)_100%)] shadow-[0_24px_70px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] ring-1 ring-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.75),transparent_42%)] pointer-events-none" />
            <CardContent className="relative p-8 md:p-10">
              <form action="/api/contact" method="post" className="flex flex-col gap-3.5">
                <FormStatus />
                <input type="hidden" name="next" value="/company/contact" />
                <Input name="name" placeholder="Full name" required className={inputClass} />
                <Input name="email" type="email" placeholder="Work email" required className={inputClass} />
                <Textarea
                  name="goal"
                  placeholder="How can we help?"
                  className="rounded-[1rem] min-h-[140px] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]"
                />
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(242,243,246,.88)_100%)] text-foreground ring-1 ring-white/80 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.05)] hover:brightness-[1.02] transition-colors mt-1 cursor-pointer"
                >
                  Send message
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
