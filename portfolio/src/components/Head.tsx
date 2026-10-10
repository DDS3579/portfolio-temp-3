'use client';

import { useEffect } from 'react';
import { startDriver } from '../lib/driver';
import { useScene } from '../lib/store';

export function Head() {
  const merged = useScene((s) => s.merged);
  useEffect(() => startDriver(), []);
  return (
    <div id="head" className={`head${merged ? ' is-merged' : ''}`} aria-hidden="true">
      <div className="head-body" />
    </div>
  );
}