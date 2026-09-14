import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/header';
import { Mark } from '@/components/ui';
import { disclosure } from '@/lib/content';
import { origin } from '@/lib/metadata';
import Link from 'next/link';
import './globals.css';
const display = localFont({
  src: '../public/fonts/bricolage.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '200 800',
});
const body = localFont({
  src: '../public/fonts/hanken.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '100 900',
});
export const metadata: Metadata = {
  metadataBase: origin,
  applicationName: 'Miso — Hire Me',
  robots: { index: false, follow: true },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div className="footer-top">
              <Link href="/" className="wordmark" aria-label="Miso home">
                miso<span>.</span>
              </Link>
              <p>
                Good at being a cat.
                <br />
                Open to making it your problem.
              </p>
              <nav aria-label="Footer navigation">
                <Link href="/my-offers/">My offers</Link>
                <Link href="/demo/">Try the demo</Link>
                <Link href="/the-fine-print/">The fine print</Link>
              </nav>
              <Mark />
            </div>
            <div className="footer-bottom">
              <p>{disclosure}</p>
              <span>A very personal portfolio.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
