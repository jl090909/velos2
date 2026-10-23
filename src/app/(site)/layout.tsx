import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { AmbientBackground } from '@/components/site/AmbientBackground';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  // metadataBase is what makes relative canonical/OG URLs absolute. Set from the same env the
  // per-page helper uses, so the apex and the velos2 staging project never cross-reference hosts.
  metadataBase: new URL(SITE_URL),
  title: 'Velos Shield — Secure Operations. Intelligent Decisions.',
  description: 'Velos Shield OT security platform.',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    url: SITE_URL,
    title: 'Velos Shield — Secure Operations. Intelligent Decisions.',
    description: 'Velos Shield OT security platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velos Shield — Secure Operations. Intelligent Decisions.',
    description: 'Velos Shield OT security platform.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="text-foreground min-h-screen antialiased">
        {/* Fixed, aria-hidden backdrop: the page's material, not its content. */}
        <AmbientBackground />
        <Navbar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
