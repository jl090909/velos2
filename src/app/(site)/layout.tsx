import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { AmbientBackground } from '@/components/site/AmbientBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velos Shield — Secure Operations. Intelligent Decisions.',
  description: 'Velos Shield OT security platform.',
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
