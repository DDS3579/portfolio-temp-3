'use client';

import { ventures } from '../content/ventures';
import { useScene } from '../lib/store';

const GROUPS = ['digira', 'nss', 'lab'] as const;

export function World() {
  const index = useScene((s) => s.index);
  const group = index >= 0 ? ventures[index]?.group : null;
  return (
    <div className="world" aria-hidden="true">
      {GROUPS.map((g) => (
        <div key={g} data-scene={g} className="world-wash" data-on={group === g} />
      ))}
    </div>
  );
}