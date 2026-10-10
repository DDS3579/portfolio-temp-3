'use client';

import { useEffect, useState } from 'react';


const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Log', href: '#log' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kathmanduTime, setKathmanduTime] = useState('');


  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Kathmandu time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setKathmanduTime(formatter.format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Focus trap for mobile sheet
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 ${scrolled ? 'nav-glass' : ''}`}
      >
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Monogram */}
          <a
            href="#hero"
            className="font-bold text-xl tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DDS
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`relative inline-flex min-h-[44px] items-center px-1 text-sm transition-colors duration-300 ${
                  activeSection === link.href.slice(1) ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
                aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                    style={{ backgroundColor: 'var(--color-head)' }}
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Kathmandu time */}
            <span className="hidden sm:block data-line w-[4.5ch] text-right tabular-nums" title="Kathmandu local time">
              {kathmanduTime}
            </span>

            {/* Let's Build CTA */}
            <a
              href="#contact"
              data-action="form"
              className="hidden md:inline-flex btn-ghost text-sm py-2 px-4"
            >
              Let's Build
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 min-w-[44px] min-h-[44px] items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <span className="w-5 h-[1.5px] bg-[var(--color-text)] block" />
              <span className="w-5 h-[1.5px] bg-[var(--color-text)] block" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="sheet-overlay flex flex-col">
          <div
            className="flex items-center justify-between h-16"
            style={{ paddingLeft: 'var(--pad)', paddingRight: 'var(--pad)' }}
          >
            <span className="font-bold text-xl tracking-tight text-[var(--color-text)]" style={{ fontFamily: 'var(--font-display)' }}>DDS</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text)]"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-[var(--pad)] mt-8" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="display-section text-[var(--color-text)] py-3 block"
                style={{
                  opacity: 0,
                  transform: 'translateY(16px)',
                  animation: `hero-fade-up 0.5s var(--ease-reveal) ${200 + i * 80}ms forwards`,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto pb-12 px-[var(--pad)]">
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-solid w-full justify-center"
            >
              Let's Build
            </a>
            <p className="data-line mt-6 text-center">
              {kathmanduTime} · Kathmandu
            </p>
          </div>
        </div>
      )}
    </>
  );
}
