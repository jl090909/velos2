import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const products = [
  {
    num: '01',
    name: 'XDR',
    full: 'Extended Detection & Response',
    tagline: 'Detect and respond across the entire OT estate.',
    desc: 'Unify detection, investigation, and response across OT and IT with passive visibility, AI-driven correlation, and automated containment — so threats are caught and stopped before they disrupt operations.',
    image: '/velosrouter2.jpg',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Combined_Space_Operations_Center_%28CSpOC%29_staff_monitors_workstations_%28Screen_images_have_been_altered_for_operational_security%29_%289169412%29.jpg/1920px-Combined_Space_Operations_Center_%28CSpOC%29_staff_monitors_workstations_%28Screen_images_have_been_altered_for_operational_security%29_%289169412%29.jpg',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Pit_stop_raikkonen.jpg',
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
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/shutterstock/getstarted-hero.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.52)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Secure operations with best-in-class SOC products.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                The same XDR, SOAR, and Rapid Response capabilities the most demanding security teams rely on — refined for the clarity and calm of the Velos Shield experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['XDR', 'SOAR', 'Rapid Response', 'OT + IT'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
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
          <span>© 2026 Rathon.ai · Another product from Rathon.ai</span>
          <div className="flex gap-5 flex-wrap">
            <a href="/product" className="hover:text-foreground no-underline">Velos Shield</a>
            <a href="/velossensor" className="hover:text-foreground no-underline">Velos Sensor</a>
            <a href="/industries" className="hover:text-foreground no-underline">Industries</a>
            <a href="/trust" className="hover:text-foreground no-underline">Trust</a>
            <a href="/get-started" className="hover:text-foreground no-underline">Demo</a>
          </div>
        </div>
      </footer>
    </>
  );
}
