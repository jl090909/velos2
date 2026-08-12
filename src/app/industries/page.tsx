import { Card, CardContent } from '@/components/ui/card';

const industries = [
  {
    title: 'Manufacturing',
    lead: 'Secure plants without slowing the line.',
    desc: 'A polished OT experience for production teams: clear visibility, dependency context, and evidence that supports resilient operations.',
    stat1: 'Visibility',
    stat1d: 'across lines and cells',
    stat2: 'Priority',
    stat2d: 'for what affects uptime',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Industrial_production_line_operating_in_a_large_modern_factory.jpg/1920px-Industrial_production_line_operating_in_a_large_modern_factory.jpg',
  },
  {
    title: 'Energy & Utilities',
    lead: 'Protect generation, distribution, and field systems.',
    desc: 'Model the network, highlight risky access paths, and provide the confidence needed for critical infrastructure environments.',
    stat1: 'Control',
    stat1d: 'for remote access',
    stat2: 'Clarity',
    stat2d: 'for operators and leaders',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Transmission_Lines_at_Sunset.jpg/1920px-Transmission_Lines_at_Sunset.jpg',
  },
  {
    title: 'Airports',
    lead: 'Turn network data into real-time airport intelligence across airside and landside operations.',
    desc: 'Improve network security while using live device and traffic data to increase ROE, reduce operational overhead, and surface business intelligence in real time from baggage systems, check-in kiosks, security checkpoints, OT devices, and facility systems.',
    stat1: 'Coverage',
    stat1d: 'for airside and landside systems',
    stat2: 'Insights',
    stat2d: 'from connected devices in real time',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Interior_of_Helsinki_Airport_Vantaa.jpg/1920px-Interior_of_Helsinki_Airport_Vantaa.jpg',
  },
  {
    title: 'Shipping',
    lead: 'Turn vessel, terminal, and yard data into real-time maritime intelligence.',
    desc: 'From shipboard systems, port OT, and connected cargo devices, we can gain both NIDS-level security visibility and real-time business intelligence that helps teams speed vessel turnaround, reduce manual overhead, improve coordination, and protect uptime across ports and logistics operations.',
    stat1: 'Coverage',
    stat1d: 'for port and vessel systems',
    stat2: 'Intelligence',
    stat2d: 'from connected devices in real time',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Port_of_Gdynia.jpg/1920px-Port_of_Gdynia.jpg',
  },
];

export default function IndustriesPage() {
  return (
    <>
      <section className="pt-28 pb-8 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-primary shrink-0">Industries</p>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[340px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Port_of_Gdynia.jpg/1920px-Port_of_Gdynia.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(0,0,0,.46)_100%)]" />
            <CardContent className="relative flex min-h-[340px] flex-col justify-end p-8 md:p-10 text-white">
              <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-white/85 mb-3">Sectors we cover</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.02] max-w-3xl mb-4">
                One platform for manufacturing, energy, airports, shipping, and every connected operation in between.
              </h2>
              <p className="max-w-3xl text-sm md:text-base leading-relaxed text-white/85 mb-6">
                Build stronger network security while turning device and traffic data into business intelligence, lower overhead, and real-time operational insight.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {['Manufacturing', 'Energy & Utilities', 'Airports', 'Shipping'].map((sector) => (
                  <span key={sector} className="rounded-none border border-white/35 bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-white/90 backdrop-blur-sm">
                    {sector}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {industries.map((ind) => (
            <Card key={ind.title} className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <div
                className="relative h-44 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${ind.image})`,
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.35)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.12))]" />
              </div>
              <CardContent className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Industry</p>
                    <h2 className="text-2xl font-semibold tracking-[-.03em] mb-2">{ind.title}</h2>
                    <p className="text-sm font-medium text-foreground/80">{ind.lead}</p>
                  </div>
                  <span className="text-4xl font-black text-muted/20 leading-none select-none">0{industries.indexOf(ind) + 1}</span>
                </div>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{ind.desc}</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{ind.stat1}</b>
                    <span className="text-xs text-muted-foreground">{ind.stat1d}</span>
                  </div>
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{ind.stat2}</b>
                    <span className="text-xs text-muted-foreground">{ind.stat2d}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_.9fr] gap-8 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Industry story</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5">
              Clear stories for complex environments.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Whether the audience is engineering, operations, or leadership, the message should be the same: see more, interrupt less, and protect what keeps the business moving.
            </p>
          </div>
          <Card className="border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_20px_60px_rgba(15,23,42,.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="rounded-none border border-border/60 bg-[linear-gradient(180deg,#ffffff,#f7f7f9)] p-6 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary mb-3">Messaging themes</p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Zero downtime posture for operational teams</li>
                  <li>• Comprehensive visibility for asset and traffic understanding</li>
                  <li>• AI-powered prioritization for the issues that matter most</li>
                  <li>• Executive-ready evidence for trust and governance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground gap-4 flex-wrap">
          <span>© 2026 Veloshield</span>
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
