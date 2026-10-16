import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';

const tracks = [
  { title: 'Channel & Resellers', desc: 'Sell and deploy Velos Shield 1.1 and 1.5.' },
  { title: 'System Integrators', desc: 'Deliver OT security projects end to end.' },
  { title: 'Technology Integrations', desc: 'Directory of SIEM, CMDB and ticketing connectors.' },
];

export default function PartnersPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Partners</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Grow with Velos Shield.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
          A programme for system integrators, resellers and technology partners serving industrial and critical
          infrastructure environments.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
        >
          Become a partner
        </Link>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {tracks.map((t) => (
            <Card
              key={t.title}
              className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300"
            >
              <CardContent className="p-8 md:p-9">
                <h2 className="text-xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">{t.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
