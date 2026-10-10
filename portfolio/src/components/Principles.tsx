import { principles } from '../content/log';
import { Reveal } from '../lib/useReveal';

export function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="section-pad">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h2 id="principles-title" className="display-section mb-24 max-w-[18ch] leading-[1.05]">
            I don't just build software. I build systems, products, and businesses.
          </h2>
        </Reveal>
        <ol className="m-0 list-none p-0">
          {principles.map((p, i) => (
            <li key={p.number} className="hairline">
              <Reveal delay={i * 100}>
                <div className="grid grid-cols-12 items-start gap-4 py-10">
                  <span className="data-line col-span-1">{p.number}</span>
                  <h3 className="col-span-4 m-0 text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                  <p className="col-span-6 col-start-7 m-0 text-[var(--color-muted)]">{p.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}