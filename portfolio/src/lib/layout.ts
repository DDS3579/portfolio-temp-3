import { useSyncExternalStore } from 'react';
import { ventures } from '../content/ventures';
import { MQ_PINNED } from './capabilities';
import { SCENE_L, commitY } from './scenes/geometry';

export interface Layout {
  ready: boolean;
  pinned: boolean;
  vh: number;
  docH: number;
  mainH: number;
  pinTop: number; // document y where the pinned stage sticks
  mergeEndY: number; // document y where every lane lands in main
  commitY: Record<string, number>; // lane id -> document y of its commit
  logY: number[]; // document y of each Log row centre
  stop: { x: number; y: number; size: number } | null; // hero full stop (viewport == document at scroll 0)
}

export const layout: Layout = {
  ready: false,
  pinned: false,
  vh: 0,
  docH: 0,
  mainH: 0,
  pinTop: 0,
  mergeEndY: 0,
  commitY: {},
  logY: [],
  stop: null,
};

export const sceneL = () => layout.vh * SCENE_L;

let version = 0;
const listeners = new Set<() => void>();

export const layoutStore = {
  get: () => version,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export const useLayoutVersion = () => useSyncExternalStore(layoutStore.subscribe, layoutStore.get, layoutStore.get);

function measure() {
  const main = document.getElementById('main-content');
  if (!main) return;
  const sy = window.scrollY;
  const centre = (el: Element) => {
    const b = el.getBoundingClientRect();
    return b.top + sy + b.height / 2;
  };

  layout.vh = window.innerHeight;
  layout.pinned = window.matchMedia(MQ_PINNED).matches;
  layout.docH = document.documentElement.scrollHeight;
  layout.mainH = main.getBoundingClientRect().height;

  const pin = document.getElementById('work-pin');
  layout.pinTop = pin ? pin.getBoundingClientRect().top + sy : 0;

  const L = layout.vh * SCENE_L;
  const commits: Record<string, number> = {};
  ventures.forEach((v, k) => {
    if (layout.pinned && pin) {
      commits[v.id] = commitY(k, layout.pinTop, L, layout.vh);
      return;
    }
    const el = document.querySelector(`[data-graph-anchor="${v.id}"]`);
    if (el) commits[v.id] = centre(el);
  });
  layout.commitY = commits;

  layout.logY = Array.from(document.querySelectorAll('[data-graph-anchor^="log-"]')).map(centre);

  const contact = document.querySelector('[data-graph-anchor="contact"]');
  layout.mergeEndY = contact ? contact.getBoundingClientRect().top + sy + 120 : layout.mainH;

  const stop = document.getElementById('hero-stop');
  if (stop) {
    const b = stop.getBoundingClientRect();
    layout.stop = { x: b.left + b.width / 2, y: b.top + sy + b.height / 2, size: b.width };
  }

  layout.ready = true;
  version++;
  listeners.forEach((l) => l());
}

let pending = 0;
export function scheduleMeasure() {
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(measure);
}

export function startLayout(): () => void {
  const ro = new ResizeObserver(scheduleMeasure);
  ro.observe(document.body);
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('load', scheduleMeasure);
  void document.fonts.ready.then(scheduleMeasure);
  scheduleMeasure();
  return () => {
    ro.disconnect();
    window.removeEventListener('resize', scheduleMeasure);
    window.removeEventListener('load', scheduleMeasure);
    cancelAnimationFrame(pending);
  };
}