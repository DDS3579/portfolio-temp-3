'use client';

'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { branchOf, contextOf, ventures, type Venture } from '../content/ventures';
import { stackFor } from '../content/stack';
import { usePinnedMode } from '../lib/capabilities';
import { goToScene } from '../lib/nav';
import { sceneStore, useScene } from '../lib/store';
import { LaneGlyph } from './LaneGlyph';

export function Work() {
  const pinned = usePinnedMode();
  const index = useScene((s) => s.index);
  const active = Math.max(0, index);
  const n = ventures.length;
  const stage = useRef<HTMLDivElement>(null);

  // Stacked layouts only: IntersectionObserver drives the wash and the active lane.
  useEffect(() => {
    if (pinned) return;
    const root = stage.current;
    if (!root) return;
    const band = { rootMargin: '-45% 0px -50% 0px' };
    const scenes = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) sceneStore.set({ index: Number((e.target as HTMLElement).dataset.sceneIndex) });
      });
    }, band);
    const edge = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) sceneStore.set({ index: -1 });
    }, band);
    root.querySelectorAll('[data-scene-index]').forEach((el) => scenes.observe(el));
    edge.observe(root);
    return () => {
      scenes.disconnect();
      edge.disconnect();
      sceneStore.set({ index: -1 });
    };
  }, [pinned]);

  return (
    <section id="work" aria-labelledby="work-title">
      <div className="section-pad" style={{ paddingBottom: 'clamp(1.5rem, 4vh, 3rem)' }}>
        <h2 id="work-title" className="display-section">Selected Work</h2>
        <p className="body-copy mt-4">
          A few projects that reflect product thinking, engineering, and design execution.
        </p>
      </div>

      <div id="work-pin" className="pin" style={{ '--scenes': n } as CSSProperties}>
        <div ref={stage} className="pin-stage">
          {ventures.map((v, k) => (
            <Scene key={v.id} venture={v} index={k} active={k === active} pinned={pinned} />
          ))}

          <div className="pin-controls">
            <button type="button" className="btn-ghost" disabled={active === 0} onClick={() => goToScene(ventures[active - 1].id)} aria-label="Previous branch">
              ← Prev
            </button>
            <span className="data-line tabular-nums" aria-hidden="true">
              {String(active + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
            </span>
            <button type="button" className="btn-ghost" disabled={active === n - 1} onClick={() => goToScene(ventures[active + 1].id)} aria-label="Next branch">
              Next →
            </button>
            <p className="sr-only" role="status" aria-live="polite">
              Branch {active + 1} of {n}: {ventures[active].name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Scene({ venture, index, active, pinned }: { venture: Venture; index: number; active: boolean; pinned: boolean }) {
  const ref = useRef<HTMLElement>(null);

  // Only pinned scenes are exclusive: inactive ones must not be focusable.
  useEffect(() => {
    ref.current?.toggleAttribute('inert', pinned && !active);
  }, [active, pinned]);

  const headingId = `${venture.id}-title`;
  return (
    <article
      ref={ref}
      id={`scene-${venture.id}`}
      data-scene={venture.group}
      data-active={active}
      data-scene-index={index}
      data-graph-anchor={venture.id}
      aria-hidden={pinned ? !active : undefined}
      aria-labelledby={headingId}
      className={`scene${index % 2 === 1 ? ' is-flip' : ''}`}
    >
      <div className="scene-text">
        <LaneGlyph laneId={venture.id} label={branchOf(venture.id)} />
        <SceneText venture={venture} headingId={headingId} />
      </div>
      <div className="scene-poster">
        <Poster venture={venture} />
      </div>
    </article>
  );
}

function SceneText({ venture, headingId }: { venture: Venture; headingId: string }) {
  const context = contextOf(venture);
  const stack = stackFor(venture.id);
  const meta = [branchOf(venture.id), venture.role].filter(Boolean).join(' · ');

  return (
    <>
      <h2 id={headingId} className="display-scene">{venture.name}</h2>
      <p className="scene-category">{venture.category}</p>
      <p className="data-line scene-meta">{meta}</p>
      {context && <p className="scene-copy">{context}</p>}
      {venture.challenge && (
        <p className="scene-copy scene-copy-sm"><span className="scene-key">Challenge</span> {venture.challenge}</p>
      )}
      {venture.outcome && (
        <p className="scene-copy scene-copy-sm"><span className="scene-key">Outcome</span> {venture.outcome}</p>
      )}
      {stack.length > 0 && <p className="data-line">{stack.join(' / ')}</p>}
      {venture.links.length > 0 && (
        <div className="scene-links">
          {venture.links.map((l) => (
            <a key={l.url} href={l.url} className="btn-ghost" target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </div>
      )}
    </>
  );
}

function Poster({ venture }: { venture: Venture }) {
  const words = venture.name.split(' ');
  const len = Math.max(...words.map((w) => w.length));
  return (
    <div className="poster" aria-hidden="true" style={{ '--len': len, '--tone': venture.tone } as CSSProperties}>
      <span className="poster-name">
        {words.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
    </div>
  );
}