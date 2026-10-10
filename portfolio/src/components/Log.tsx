import { logEntries, originStory } from '../content/log';
import { Reveal } from '../lib/useReveal';

export function Log() {
  return (
    <section id="log" aria-labelledby="log-title" className="section-pad">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h2 id="log-title" className="display-section mb-6">Before and between</h2>
        </Reveal>
        {originStory && (
          <Reveal delay={80}>
            <p className="body-copy mb-12">{originStory}</p>
          </Reveal>
        )}

        <ol className="m-0 mt-12 list-none p-0">
          {logEntries.map((e, i) => (
            <li key={e.id} data-graph-anchor={`log-${e.id}`} className="hairline">
              <Reveal delay={i * 80}>
                <div className="grid grid-cols-12 items-start gap-4 py-8">
                  <h3 className="col-span-3 m-0 text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{e.title}</h3>
                  <p className="data-line col-span-3 m-0">{e.role}</p>
                  <div className="col-span-6">
                    {e.duration && <p className="data-line m-0 mb-2">{e.duration}</p>}
                    {e.description && <p className="m-0 text-[0.9375rem] text-[var(--color-muted)]">{e.description}</p>}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={200}>
          <p className="data-line mt-12">Lines show how the ventures relate, not when they happened.</p>
        </Reveal>
      </div>
    </section>
  );
}