export function Footer() {
  return (
    <footer className="page-offset hairline px-[var(--pad)] py-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[var(--color-muted)]">© Divya Darsheel Sharma</span>
          <span className="data-line">Built with React and Vite</span>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a href="#hero" className="inline-flex min-h-[44px] items-center text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">Back to top ↑</a>
          <span className="data-line">Kathmandu 27.7172° N, 85.3240° E</span>
        </div>
      </div>
    </footer>
  );
}