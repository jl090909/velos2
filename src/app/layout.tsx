import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veloshield — Secure Operations. Intelligent Decisions.',
  description: 'Veloshield OT security platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <Navbar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
