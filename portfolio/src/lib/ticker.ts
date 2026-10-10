export type TickFn = (dt: number, now: number) => boolean; // return true while still animating

interface Sub {
  fn: TickFn;
  priority: number;
}

const subs: Sub[] = [];
export const ladder: { level: 0 | 1 | 2 } = { level: 0 };

let raf = 0;
let last = 0;
let running = false;
let listening = false;
const block: number[] = [];
const all: number[] = [];
const PERF = typeof location !== 'undefined' && new URLSearchParams(location.search).has('perf');

if (PERF) {
  Object.defineProperty(window, '__perf', {
    get() {
      const s = [...all].sort((a, b) => a - b);
      const q = (p: number) => (s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : 0);
      return { p50: q(0.5), p95: q(0.95), dropped: s.filter((d) => d > 20).length, level: ladder.level };
    },
  });
}

export function wake() {
  if (running || document.hidden) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

function frame(now: number) {
  const dtMs = now - last;
  last = now;
  let busy = false;
  for (const s of subs) if (s.fn(dtMs / 1000, now)) busy = true;
  if (busy) {
    guard(dtMs);
    raf = requestAnimationFrame(frame);
  } else {
    running = false;
    block.length = 0;
  }
}

/** Rolling p75 over 30 busy frames; above 20ms we step down and never back up. */
function guard(dtMs: number) {
  if (PERF) all.push(dtMs);
  block.push(dtMs);
  if (block.length < 30) return;
  const sorted = [...block].sort((a, b) => a - b);
  block.length = 0;
  if (sorted[Math.floor(sorted.length * 0.75)] > 20 && ladder.level < 2) {
    ladder.level = (ladder.level + 1) as 1 | 2;
  }
}

function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    running = false;
  } else wake();
}

export function subscribe(fn: TickFn, priority = 0): () => void {
  const sub: Sub = { fn, priority };
  subs.push(sub);
  subs.sort((a, b) => a.priority - b.priority);
  if (!listening) {
    listening = true;
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    document.addEventListener('visibilitychange', onVisibility);
  }
  wake();
  return () => {
    const i = subs.indexOf(sub);
    if (i >= 0) subs.splice(i, 1);
  };
}