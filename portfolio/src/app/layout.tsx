import type { Metadata, Viewport } from 'next';
import { Funnel_Display, Funnel_Sans, Spline_Sans_Mono } from 'next/font/google';
import { site } from '@/content/site';
import './globals.css';

const display = Funnel_Display({ subsets: ['latin'], variable: '--font-funnel-display', display: 'swap' });
const sans = Funnel_Sans({ subsets: ['latin'], variable: '--font-funnel-sans', display: 'swap' });
const mono = Spline_Sans_Mono({ subsets: ['latin'], variable: '--font-spline-mono', display: 'swap' });

const title = `${site.name} | Founder & Full Stack Developer`;
const description = 'I build businesses from scratch to conglomerates. Founder of Digira, based in Kathmandu, Nepal.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: site.url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = { themeColor: '#07080B', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: pinned CSS only applies when JS is available */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}