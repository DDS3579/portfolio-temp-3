'use client';

import { useEffect, useRef } from 'react';
import { useGraphMode, usePinnedMode } from '../lib/capabilities';
import { layout, scheduleMeasure, startLayout, useLayoutVersion } from '../lib/layout';
import { goToScene, handleAnchorClick, sceneIdFromHash } from '../lib/nav';
import { subscribe } from '../lib/ticker';
import { warnMissing } from '../lib/warn';
import { Graph } from './Graph';
import { Head } from './Head';

export function GraphSlot() {
  return useGraphMode() ? <Graph /> : null;
}

export function HeadSlot() {
  return usePinnedMode() ? <Head /> : null;
}

/** Scroll hairline: one transform write per frame, no React state. */
export function Hairline() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      subscribe(() => {
        const el = ref.current;
        if (el) {
          const range = layout.docH - layout.vh;
          el.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`;
        }
        return false;
      }, 9),
    [],
  );
  return <div ref={ref} className="scroll-hairline" aria-hidden="true" />;
}

/** No UI: measurement, anchor navigation, deep links, dev warnings. */
export function Behaviors() {
  const graphMode = useGraphMode();
  const pinned = usePinnedMode();
  const version = useLayoutVersion();
  const deepLinked = useRef(false);

  useEffect(() => {
    warnMissing();
    return startLayout();
  }, []);
  useEffect(() => scheduleMeasure(), [graphMode, pinned]);

  useEffect(() => {
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  useEffect(() => {
    const go = (instant: boolean) => {
      const id = sceneIdFromHash(window.location.hash);
      if (id) goToScene(id, instant);
    };
    if (layout.ready && !deepLinked.current) {
      deepLinked.current = true;
      go(true);
    }
    const onHash = () => go(false);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [version]);

  return null;
}