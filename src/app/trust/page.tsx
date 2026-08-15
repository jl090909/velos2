import { Card, CardContent } from '@/components/ui/card';

const trustCards = [
  {
    title: 'Passive-first deployment',
    lead: 'Keep rollout safe and predictable.',
    desc: 'Deploy with passive discovery, controlled boundaries, and change discipline that avoids operational surprise.',
    stat1: 'Passive-first',
    stat1d: 'no active probing',
    stat2: 'Change-safe',
    stat2d: 'clear deployment controls',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/EFTA00000441_-_Server_room_filled_with_networking_equipment_cables_and_rack-mounted_servers.jpg',
  },
  {
    title: 'Data handling',
    lead: 'Protect sensitive operational data.',
    desc: 'Minimize collection, control retention, and keep the customer in charge of integrations and evidence flows.',
    stat1: 'Privacy',
    stat1d: 'data minimization',
    stat2: 'Retention',
    stat2d: 'customer-controlled',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Data_tape_storage_room%2C_NCHS.jpg',
  },
  {
    title: 'Integration',
    lead: 'Connect cleanly to existing tools.',
    desc: 'Share data with SIEM, SOAR, CMDB, and reporting workflows without creating extra overhead.',
    stat1: 'Workflow',
    stat1d: 'SIEM / SOAR / CMDB',
    stat2: 'Evidence',
    stat2d: 'reporting-ready outputs',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Batelco_Network_Operations_Centre_%28NOC%29.JPG/1920px-Batelco_Network_Operations_Centre_%28NOC%29.JPG',
  },
  {
    title: 'Design language',
    lead: 'Premium, calm, and consistent.',
    desc: 'A product experience that feels polished enough for leadership and simple enough for operations.',
    stat1: 'Clarity',
    stat1d: 'easy to navigate',
    stat2: 'Confidence',
    stat2d: 'speaks to trust',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Interior_of_the_Tokyo_International_Forum_Glass_Building%2C_Japan.jpg/1920px-Interior_of_the_Tokyo_International_Forum_Glass_Building%2C_Japan.jpg',
  },
];

const trustThemes = [
  'Passive-first',
  'Data handling',
  'Integration',
  'Design language',
];

export default function TrustPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{
              backgroundImage:
                'url(/shutterstock/trust-hero.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(0,0,0,.46)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] max-w-3xl mb-5">
                Built around passive-first visibility and controlled change.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                OT environments require reliability, change discipline, and clear operational ownership. The trust center should read like a premium product page: direct, calm, and complete.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {trustThemes.map((theme) => (
                  <span key={theme} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {trustCards.map((card) => (
            <Card key={card.title} className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <div
                className="relative h-44 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${card.image})`,
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.35)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.12))]" />
              </div>
              <CardContent className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Trust pillar</p>
                    <h2 className="text-2xl font-semibold tracking-[-.03em] mb-2">{card.title}</h2>
                    <p className="text-sm font-medium text-foreground/80">{card.lead}</p>
                  </div>
                </div>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{card.desc}</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{card.stat1}</b>
                    <span className="text-xs text-muted-foreground">{card.stat1d}</span>
                  </div>
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{card.stat2}</b>
                    <span className="text-xs text-muted-foreground">{card.stat2d}</span>
                  </div>
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
            <a href="/executives" className="hover:text-foreground no-underline">Executives</a>
            <a href="/industries" className="hover:text-foreground no-underline">Industries</a>
            <a href="/trust" className="hover:text-foreground no-underline">Trust</a>
            <a href="/get-started" className="hover:text-foreground no-underline">Demo</a>
          </div>
        </div>
      </footer>
    </>
  );
}
