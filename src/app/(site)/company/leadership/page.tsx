import { SiteFooter } from '@/components/SiteFooter';
import { CompanyTabs } from '@/components/CompanyTabs';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/company/leadership/',
  title: 'Leadership - Velos Shield',
  description: 'The team building Velos Shield.',
});

const roles = ['CEO', 'CTO', 'VP Engineering', 'VP Sales', 'CISO'];

export default function CompanyLeadershipPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <CompanyTabs />
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mt-10 mb-3">Company</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Leadership.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Placeholder profiles for design review — names, portraits and biographies to be supplied.
        </p>
      </section>

      <section className="pb-16 max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((r) => (
            <div
              key={r}
              className="rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-8 shadow-[0_1px_3px_rgba(15,23,42,.04)]"
            >
              <div className="mb-5 h-14 w-14 rounded-full bg-[linear-gradient(180deg,#eef2f6_0%,#e3e8ee_100%)]" />
              <b className="block text-[#003C64]">Name Surname</b>
              <span className="text-sm text-muted-foreground">{r} · placeholder</span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
