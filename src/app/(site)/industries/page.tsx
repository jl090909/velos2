import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from "@/components/SiteFooter";

const industries = [
  {
    title: 'Manufacturing',
    lead: 'Secure plants without slowing the line.',
    desc: 'Gain continuous visibility across critical systems including SCADA, PLCs, HMIs, DCS, MES, robotics, and industrial networks. Identify vulnerabilities and threats, understand operational risk, and prioritize security actions without disrupting production. By seamlessly blending deep asset visibility with real-time threat detection.',
    stat1: 'Visibility',
    stat1d: 'across lines and cells',
    stat2: 'Priority',
    stat2d: 'for what affects uptime',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Industrial_production_line_operating_in_a_large_modern_factory.jpg/1920px-Industrial_production_line_operating_in_a_large_modern_factory.jpg',
  },
  {
    title: 'Energy & Utilities',
    lead: 'Protect generation, distribution, and field systems.',
    desc: 'Gain continuous visibility across power generation, transmission, distribution, and water systems, including SCADA, PLCs, RTUs, DCS, substations, pumping stations, and treatment plants. Identify threats and vulnerabilities, understand operational risk, and prioritize security actions without disrupting critical services.',
    stat1: 'Control',
    stat1d: 'for remote access',
    stat2: 'Clarity',
    stat2d: 'for operators and leaders',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Transmission_Lines_at_Sunset.jpg/1920px-Transmission_Lines_at_Sunset.jpg',
  },
  {
    title: 'Airports',
    lead: 'Protect airport operations, infrastructure, and connected systems.',
    desc: 'Discover and monitor critical systems such as Baggage Handling, Building Management, Airfield Lighting, Passenger Processing, and Airport Operational Systems. Correlate assets, vulnerabilities, threats, and operational criticality to focus security teams on the risks that matter most.',
    stat1: 'Coverage',
    stat1d: 'for airside and landside systems',
    stat2: 'Insights',
    stat2d: 'from connected devices in real time',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Brussels_Airport_Runway_25_R.jpg/1920px-Brussels_Airport_Runway_25_R.jpg',
  },
  {
    title: 'Maritime',
    lead: 'Secure fleets, ports, and the systems that keep maritime operations moving.',
    desc: 'Gain continuous visibility across vessels, fleets, and ports, including navigation systems, propulsion, engine monitoring, cargo management, onboard networks, and port OT. Identify threats and vulnerabilities, understand operational risk, and prioritize security actions without disrupting maritime operations.',
    stat1: 'Coverage',
    stat1d: 'for port and vessel systems',
    stat2: 'Intelligence',
    stat2d: 'from connected devices in real time',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Port_of_Gdynia.jpg/1920px-Port_of_Gdynia.jpg',
  },
  {
    title: 'Smart cities & facilities',
    lead: 'Secure the systems that keep smart cities and facilities running.',
    desc: 'Gain continuous visibility across Building Management, HVAC, access control, surveillance, lighting, elevators, parking, and other connected facility systems. Identify threats and vulnerabilities, understand operational risk, and prioritize security actions without disrupting essential services.',
    stat1: 'Visibility',
    stat1d: 'across connected smart infrastructure',
    stat2: 'Integrate',
    stat2d: 'with Central Command and Control',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Lima_Peru_City_Skyline_Modern_Glass_Towers.jpg/1920px-Lima_Peru_City_Skyline_Modern_Glass_Towers.jpg',
  },
];

export default function IndustriesPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url(/shutterstock/industries-hero.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(0,0,0,.46)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] max-w-3xl mb-5">
                One platform for manufacturing, energy, airports, maritime, and smart cities.
              </h1>
              <div className="inline-block bg-white/15 backdrop-blur-md pl-12 pr-8 py-6 mb-8 -ml-4 max-w-[80%]" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)' }}>
              <p className="text-base md:text-xl text-white">
                Every industry runs differently. Our OT security platform adapts to the assets, risks, and operational realities that matter most to your business.
              </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['Manufacturing', 'Energy & Utilities', 'Airports', 'Maritime', 'Smart cities'].map((sector) => (
                  <span key={sector} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {sector}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[7fr_3fr] gap-10 items-center">
          <div className="rounded-[1.35rem] overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,.08)] bg-[#0d0e1c]">
            <div className="relative w-full" style={{ aspectRatio: '2000 / 1571' }}>
              <Image
                src="/upscale_image_02left.webp"
                alt="Velos Shield network topology visualization"
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <span className="inline-block text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-4">
              Visualize
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-.03em] text-[#003C64] mb-5 leading-[1.1]">
              See every asset, connection, and risk across your OT network
            </h2>
            <p className="text-[14.25px] text-muted-foreground leading-relaxed mb-6 max-w-lg">
              Velos Shield&apos;s interactive Network Map renders your entire operational
              topology as a force-directed graph — discover devices, expose hidden
              connections, and highlight high-risk communication paths in real time.
              Filter by zone, protocol, asset type, or Purdue level. Zoom, pan, and
              click any node for full asset detail without leaving the canvas.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
              <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <b className="text-lg font-semibold block mb-1">Discover</b>
                <span className="text-xs text-muted-foreground">assets across all Purdue levels</span>
              </div>
              <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <b className="text-lg font-semibold block mb-1">Isolate</b>
                <span className="text-xs text-muted-foreground">threat paths before they spread</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {industries.map((ind) => (
            <div key={ind.title} className="flex flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <div
                className="relative h-44 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${ind.image})`,
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.35)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.12))]" />
              </div>
              <div className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Industry</p>
                    <h2 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-2">{ind.title}</h2>
                    <p className="text-sm font-medium text-foreground/80">{ind.lead}</p>
                  </div>
                </div>
                <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{ind.desc}</p>
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
