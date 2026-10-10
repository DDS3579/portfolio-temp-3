import { ventures } from '../content/ventures';
import { laneX } from './graph/resolve';
import { layout, layoutStore, sceneL } from './layout';
import { HEAD_Y, sceneAt } from './scenes/geometry';
import { createSpring, stepSpring } from './spring';
import { sceneStore } from './store';
import { ladder, subscribe, wake } from './ticker';

const HEAD_SIZE = 10;
const HEAD_HALF = HEAD_SIZE / 2;
const LIFT_MS = 900;
const READY_AT = 1800; // ms after navigation start: after the full stop has ignited

type Phase = 'wait' | 'parked' | 'lifting' | 'live';

export function startDriver(): () => void {
  const head = document.getElementById('head');
  if (!head) return () => undefined;

  const x = createSpring(laneX('main'));
  let phase: Phase = 'wait';
  let lastScroll = -1;
  let mask: SVGRectElement | null = null;
  let lift = 0;

  const place = (px: number, py: number, scale = 1) => {
    head.style.transform = `translate3d(${px - HEAD_HALF}px, ${py - HEAD_HALF}px, 0) scale(${scale})`;
  };
  const setMask = (s: number) => {
    if (!mask || !mask.isConnected) mask = document.querySelector<SVGRectElement>('[data-lit-mask]');
    mask?.setAttribute('transform', `scale(1 ${s.toFixed(4)})`);
  };

  const tick = (dt: number): boolean => {
    if (!layout.ready) return true;
    const sy = window.scrollY;
    const headY = layout.vh * HEAD_Y;

    if (phase === 'wait') {
      if (performance.now() < READY_AT) return true;
      head.style.opacity = '1';
      document.documentElement.dataset.headLive = '1'; // hides the in-flow full stop
      phase = sy > 4 || !layout.stop ? 'live' : 'parked';
    }

    if (phase === 'parked') {
      const stop = layout.stop;
      if (stop && sy <= 4) {
        place(stop.x, stop.y, stop.size / HEAD_SIZE); // exactly on the full stop
        return false;
      }
      phase = 'lifting'; // first scroll: lift off into the main lane
      head.classList.add('is-lifting');
      place(laneX('main'), headY);
      lift = window.setTimeout(() => {
        head.classList.remove('is-lifting');
        x.value = laneX('main');
        x.velocity = 0;
        phase = 'live';
        wake();
      }, LIFT_MS);
      return false;
    }

    if (phase === 'lifting') return false;

    const L = sceneL();
    const idx = sceneAt(sy, layout.pinTop, L, layout.vh);
    const rel = sy - layout.pinTop;
    const riding = rel >= 0 && rel < ventures.length * L ? idx : -1; // HEAD rides a branch only while pinned
    const target = laneX(riding >= 0 ? ventures[riding].id : 'main');
    sceneStore.set({ index: idx, merged: sy + headY >= layout.mergeEndY - 8 });

    let moving = false;
    if (ladder.level >= 2) {
      head.style.opacity = '0';
      setMask(0);
    } else {
      head.style.opacity = '1';
      if (ladder.level === 1) {
        x.value = target;
        x.velocity = 0;
      } else moving = stepSpring(x, target, dt);
      place(x.value, headY);
      setMask(Math.min(1, Math.max(0, (sy + headY) / layout.mainH)));
    }

    const scrolled = sy !== lastScroll;
    lastScroll = sy;
    return moving || scrolled;
  };

  if (process.env.NODE_ENV !== 'production' || location.search.includes('debug=1')) {
    Object.assign(window, {
      __graph: { debug: () => ({ ...sceneStore.get(), phase, ladder: ladder.level, headX: x.value, layout }) },
    });
  }

  const off = subscribe(tick, 0);
  const offLayout = layoutStore.subscribe(wake);
  return () => {
    off();
    offLayout();
    window.clearTimeout(lift);
    head.style.opacity = '0';
    head.classList.remove('is-lifting');
    delete document.documentElement.dataset.headLive;
    sceneStore.set({ index: -1, merged: false });
  };
}