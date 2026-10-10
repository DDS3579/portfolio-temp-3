'use client';

import { useMemo, useState } from 'react';
import { laneColor } from '../content/graph';
import { ventures } from '../content/ventures';
import { GUTTER_W, LABEL_X, resolveGraph } from '../lib/graph/resolve';
import { layout, useLayoutVersion } from '../lib/layout';
import { useScene } from '../lib/store';

const nameOf = (id: string) => ventures.find((v) => v.id === id)?.name ?? id;

export function Graph() {
  const version = useLayoutVersion();
  const index = useScene((s) => s.index);
  const hover = useScene((s) => s.hover);
  const [focused, setFocused] = useState('');

  const g = useMemo(() => {
    if (!layout.ready) return null;
    return resolveGraph(
      { commitY: layout.commitY, logY: layout.logY, mergeEndY: layout.mergeEndY, height: layout.mainH },
      { vh: layout.vh, pinned: layout.pinned },
    );
  }, [version]);

  if (!g) return null;

  const raised = new Set([index >= 0 ? ventures[index]?.id : '', focused, ...hover.split(' ')].filter(Boolean));
  const on = (id: string) => raised.has(id);

  const paths = (layer: 'idle' | 'lit') => (
    <>
      <path d={g.main} className={`lane lane-main lane-${layer}${on('main') ? ' on' : ''}`} stroke="var(--color-text)" />
      {g.lanes.map((l) => (
        <path key={l.id} d={l.d} className={`lane lane-${layer}${on(l.id) ? ' on' : ''}`} stroke={laneColor(l.id)} />
      ))}
    </>
  );

  return (
    <div className="graph-wrap" style={{ height: g.height }}>
      <svg className="graph-svg" width={GUTTER_W} height={g.height} viewBox={`0 0 ${GUTTER_W} ${g.height}`} aria-hidden="true">
        <defs>
          <clipPath id="graph-lit">
            <rect data-lit-mask="" x={0} y={0} width={GUTTER_W} height={g.height} transform="scale(1 0)" />
          </clipPath>
        </defs>
        <g>{paths('idle')}</g>
        <g clipPath="url(#graph-lit)">{paths('lit')}</g>
        {g.logCommits.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={3} className="commit on" fill="var(--color-text)" />
        ))}
        {g.lanes.map((l) => (
          <circle key={l.id} cx={l.x} cy={l.commitY} r={3} className={`commit${on(l.id) ? ' on' : ''}`} fill={laneColor(l.id)} />
        ))}
        {g.lanes
          .filter((l) => on(l.id))
          .map((l) => (
            <text key={l.id} x={LABEL_X} y={l.commitY + 4} className="graph-label">
              {l.label}
            </text>
          ))}
      </svg>

      <nav aria-label="Branches" className="graph-nav">
        {g.lanes.map((l) => (
          <a
            key={l.id}
            href={`#scene-${l.id}`}
            className="graph-commit"
            style={{ left: l.x - 8, top: l.commitY - 8 }}
            aria-label={`Branch: ${nameOf(l.id)}`}
            onMouseEnter={() => setFocused(l.id)}
            onMouseLeave={() => setFocused('')}
            onFocus={() => setFocused(l.id)}
            onBlur={() => setFocused('')}
          />
        ))}
      </nav>
    </div>
  );
}