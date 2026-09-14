'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Arrow } from './ui';
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark" aria-label="Miso, home" onClick={() => setOpen(false)}>
          miso<span>.</span>
        </Link>
        <span className="header-title">Freelance Cat</span>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          {open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={open ? 'main-nav open' : 'main-nav'}
        >
          {[
            ['/about/', 'About'],
            ['/work/', 'Work'],
            ['/resume/', 'Résumé'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                path.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'page' : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/hire/" className="button small primary" onClick={() => setOpen(false)}>
            Hire me <Arrow diagonal />
          </Link>
        </nav>
      </div>
    </header>
  );
}
