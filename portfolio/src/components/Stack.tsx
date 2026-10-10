'use client';

import { useState } from 'react';
import { disciplines, stackItems, usedByLane, usedByName, type Discipline } from '../content/stack';
import { sceneStore } from '../lib/store';
import { Reveal } from '../lib/useReveal';

export function Stack() {
  const [active, setActive] = useState<Discipline>('frontend');
  const [hovered, setHovered] = useState<string | null>(null);
  const tools = stackItems.filter((i) => i.category === active);
  const hit = tools.find((t) => t.name === hovered);

  const raise = (name: string, usedBy: string[]) => {
    setHovered(name);
    sceneStore.set({ hover: usedBy.map(usedByLane).join(' ') });
  };
  const lower = () => {
    setHovered(null);
    sceneStore.set({ hover: '' });
  };

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-pad">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h2 id="stack-title" className="display-section mb-16">What it runs on.</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {disciplines.map((d, i) => (
              <Reveal key={d.id} delay={i * 80}>
                <button
                  type="button"
                  className="stack-discipline"
                  aria-pressed={active === d.id}
                  onClick={() => setActive(d.id)}
                  onFocus={() => setActive(d.id)}
                  onMouseEnter={() => setActive(d.id)}
                >
                  {d.name}
                </button>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="stack-tools">
              {tools.map((t) => (
                <li key={t.name}>
                  {t.usedBy.length > 0 ? (
                    <button
                      type="button"
                      className="stack-tool"
                      onMouseEnter={() => raise(t.name, t.usedBy)}
                      onMouseLeave={lower}
                      onFocus={() => raise(t.name, t.usedBy)}
                      onBlur={lower}
                    >
                      {t.name}
                    </button>
                  ) : (
                    <span className="stack-tool is-plain">{t.name}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="data-line mt-8 min-h-6" aria-live="polite">
              {hit ? `Used in: ${hit.usedBy.map(usedByName).join(', ')}` : '\u00A0'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}