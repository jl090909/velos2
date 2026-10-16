import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';

const caseStudies = [
  {
    sector: 'Manufacturing',
    quote: 'Placeholder testimonial describing visibility and risk reduction across sites.',
  },
  {
    sector: 'Energy',
    quote: 'Placeholder testimonial describing passive deployment and zero disruption to operations.',
  },
  {
    sector: 'Pharma',
    quote: 'Placeholder testimonial describing audit evidence and faster remediation cycles.',
  },
];

export default function CustomersPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Customers</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Trusted where uptime matters.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Sample placeholders — real logos and approved case studies to be supplied by Velos Shield.
        </p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {caseStudies.map((c) => (
            <Card
              key={c.sector}
              className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300"
            >
              <CardContent className="p-8 md:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-4">
                  Case study · {c.sector}
                </p>
                <h2 className="text-xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">Customer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{c.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-8">Logo wall</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex h-24 items-center justify-center rounded-[1.35rem] border border-border/60 bg-white/70 text-sm text-muted-foreground"
            >
              Logo {i}
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-muted-foreground">Placeholder marks for design review.</p>
      </section>

      <SiteFooter />
    </>
  );
}
