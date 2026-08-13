import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const products = [
  {
    num: '01',
    name: 'XDR',
    full: 'Extended Detection & Response',
    tagline: 'Detect and respond across the entire OT estate.',
    desc: 'Unify detection, investigation, and response across OT and IT with passive visibility, AI-driven correlation, and automated containment — so threats are caught and stopped before they disrupt operations.',
    image: '/veloshield-hero.png',
    bullets: ['Unified OT + IT detection', 'AI-driven threat correlation', 'Automated containment'],
    ctas: [
      { label: 'Watch a demo', href: '/demo', primary: true },
      { label: 'Contact sales', href: '/demo', primary: false },
    ],
  },
  {
    num: '02',
    name: 'SOAR',
    full: 'Security Orchestration, Automation & Response',
    tagline: 'Automate the SOC workflow end to end.',
    desc: 'Connect your security tools, orchestrate playbooks, and automate response so analysts move faster, reduce burnout, and lower mean time to respond across every environment you operate.',
    bullets: ['Playbook orchestration', 'Tool integration', 'Faster MTTR'],
    ctas: [
      { label: 'Watch a demo', href: '/demo', primary: true },
      { label: 'Take a test drive', href: '/demo', primary: false },
    ],
  },
  {
    num: '03',
    name: 'Rapid Response',
    full: 'Managed Incident Response & Threat Hunting',
    tagline: 'Expert help when every minute counts.',
    desc: 'Get on-demand incident response and proactive threat hunting from specialists who help you contain, investigate, and recover — fast — with evidence ready for leadership and auditors.',
    bullets: ['On-demand IR', 'Proactive hunting', 'Evidence ready'],
    ctas: [
      { label: 'Contact sales', href: '/demo', primary: true },
      { label: 'Request access', href: '/demo', primary: false },
    ],
  },
];

export default function GetStartedPage() {
  return (
    <>
      <section className="pt-28 pb-8 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-primary shrink-0">Get Started</p>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
      </section>

      <section className="pt-4 pb-10 max-w-6xl mx-auto px-6">
        <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">SOC</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] max-w-3xl mb-5">
          Secure operations with best-in-class SOC products.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          The same XDR, SOAR, and Rapid Response capabilities the most demanding security teams rely on — refined for the clarity and calm of the Velos Shield experience.
        </p>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Card
              key={p.name}
              className="flex flex-col overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300"
            >
              {p.image && (
                <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.25)_100%)]" />
                </div>
              )}
              <CardContent className="flex flex-1 flex-col p-8 md:p-9">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary">{p.name}</p>
                  <span className="text-4xl font-black text-muted/20 leading-none select-none">{p.num}</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-.03em] mb-1.5">{p.full}</h3>
                <p className="text-sm font-medium text-foreground/80 mb-4">{p.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{p.desc}</p>
                <ul className="space-y-2 mb-8">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="text-primary font-bold mt-0.5 shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-2.5 pt-6 border-t border-border/50">
                  {p.ctas.map((c) =>
                    c.primary ? (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#3da2ff_0%,#0071e3_48%,#005ac1_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,113,227,.22)] hover:brightness-[1.03] transition-all no-underline"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(242,243,246,.88)_100%)] text-foreground ring-1 ring-white/80 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.05)] hover:brightness-[1.02] transition-all no-underline"
                      >
                        {c.label}
                      </Link>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground gap-4 flex-wrap">
          <span>© 2026 Velos Shield</span>
          <div className="flex gap-5 flex-wrap">
            <a href="/product" className="hover:text-foreground no-underline">Product</a>
            <a href="/industries" className="hover:text-foreground no-underline">Industries</a>
            <a href="/trust" className="hover:text-foreground no-underline">Trust</a>
            <a href="/demo" className="hover:text-foreground no-underline">Demo</a>
          </div>
        </div>
      </footer>
    </>
  );
}
