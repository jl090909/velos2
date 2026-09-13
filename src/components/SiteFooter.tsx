import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-12 bg-white/50 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-[#003C64] mb-1">Velos Shield</p>
          <p>© 2026 Rathon.ai</p>
          <div className="mt-3 space-y-1">
            <p>AWFIS Tower C, Bhutani Alphatum,</p>
            <p>Floor 19, Sector 90, Noida 201305</p>
          </div>
          <div className="mt-2 space-y-1">
            <p>Email: <a href="mailto:contact@rathon.ai" className="hover:text-foreground no-underline">contact@rathon.ai</a></p>
            <p>Phone: <a href="tel:+917090004700" className="hover:text-foreground no-underline">+91 70900 04700</a></p>
            <div className="mt-3">
              <a href="https://www.linkedin.com/company/rathon-ai/" target="_blank" rel="noreferrer" aria-label="Velos Shield on LinkedIn" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/70 text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-3">Resources</p>
          <div className="space-y-2">
            <p><Link href="/resources/rethinking-ot-cyber-risk-beyond-cvss" className="hover:text-foreground no-underline">Rethinking OT Cyber Risk</Link></p>
            <p><Link href="/resources/from-packets-to-plant-impact" className="hover:text-foreground no-underline">From Packets to Plant Impact</Link></p>
            <p><Link href="/resources/airport-bms-cybersecurity-case-study" className="hover:text-foreground no-underline">Airport BMS Case Study</Link></p>
            <p><a href="/velosshield-brochure.pdf" className="hover:text-foreground no-underline">Platform Brochure</a></p>
          </div>
        </div>
        <div className="flex gap-5 flex-wrap md:justify-end items-start">
          <Link href="/product" className="hover:text-foreground no-underline">Velos Shield</Link>
          <Link href="/velossensor" className="hover:text-foreground no-underline">Velos Sensor</Link>
          <Link href="/industries" className="hover:text-foreground no-underline">Industries</Link>
          <Link href="/trust" className="hover:text-foreground no-underline">Trust</Link>
          <Link href="/resources" className="hover:text-foreground no-underline">Resources</Link>
        </div>
      </div>
    </footer>
  );
}
