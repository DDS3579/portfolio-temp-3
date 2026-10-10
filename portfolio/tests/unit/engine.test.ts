import { describe, expect, it } from 'vitest';
import { lanes } from '../../src/content/graph';
import { laneX, resolveGraph } from '../../src/lib/graph/resolve';
import { HEAD_Y, SCENE_L, commitY, sceneAt, sceneCentre } from '../../src/lib/scenes/geometry';
import { createSpring, stepSpring } from '../../src/lib/spring';

const VIEWPORTS = [720, 900, 1080];
const PIN_TOP = 1234.5;
const BRANCHES = lanes.filter((l) => l.id !== 'main').map((l) => l.id);

describe('scene geometry', () => {
  it.each(VIEWPORTS)('HEAD sits on each commit at the dwell centre (vh=%i)', (vh) => {
    const L = vh * SCENE_L;
    BRANCHES.forEach((_, k) => {
      const scroll = sceneCentre(k, PIN_TOP, L);
      expect(sceneAt(scroll, PIN_TOP, L, vh)).toBe(k);
      expect(scroll + HEAD_Y * vh).toBeCloseTo(commitY(k, PIN_TOP, L, vh), 9);
    });
  });

  it.each(VIEWPORTS)('is monotonic and -1 far outside (vh=%i)', (vh) => {
    const L = vh * SCENE_L;
    let prev = -1;
    for (let s = PIN_TOP - vh; s < PIN_TOP + BRANCHES.length * L + vh; s += 7) {
      const i = sceneAt(s, PIN_TOP, L, vh);
      if (i < 0) continue;
      expect(i).toBeGreaterThanOrEqual(prev);
      prev = i;
    }
    expect(sceneAt(PIN_TOP - 0.6 * vh, PIN_TOP, L, vh)).toBe(-1);
    expect(sceneAt(PIN_TOP + BRANCHES.length * L + 0.6 * vh, PIN_TOP, L, vh)).toBe(-1);
    expect(sceneAt(PIN_TOP - 0.2 * vh, PIN_TOP, L, vh)).toBe(0);
  });
});

describe('resolveGraph', () => {
  it.each(VIEWPORTS)('forks end at HEAD y when the scene starts; merges land on main (vh=%i)', (vh) => {
    const L = vh * SCENE_L;
    const mergeEndY = 9000;
    const commits: Record<string, number> = {};
    BRANCHES.forEach((id, k) => (commits[id] = commitY(k, PIN_TOP, L, vh)));
    const g = resolveGraph({ commitY: commits, logY: [], mergeEndY, height: 9800 }, { vh, pinned: true });

    expect(g.lanes).toHaveLength(BRANCHES.length);
    g.lanes.forEach((lane, k) => {
      const m = lane.d.match(/^M [\d.]+ [\d.]+ C [\d.]+ [\d.]+ [\d.]+ [\d.]+ ([\d.]+) ([\d.]+) L [\d.]+ ([\d.]+) C/);
      expect(m).not.toBeNull();
      const [, endX, forkEnd, mergeStart] = m!.map(Number);
      expect(endX).toBe(laneX(lane.id));
      expect(forkEnd).toBeCloseTo(PIN_TOP + k * L + HEAD_Y * vh, 0);
      expect(mergeStart).toBeGreaterThan(forkEnd);
      expect(lane.d.endsWith(` ${laneX('main')} ${mergeEndY}`)).toBe(true);
    });
  });

  it('keeps every lane and dot inside the 96px gutter', () => {
    const xs = lanes.map((l) => laneX(l.id));
    expect(Math.max(...xs) + 3).toBeLessThan(96);
    expect(xs.every((x, i) => i === 0 || x > xs[i - 1])).toBe(true);
  });
});

describe('spring', () => {
  it('settles on the target without overshooting at 60fps', () => {
    const s = createSpring(12);
    let peak = 12;
    let moving = true;
    for (let i = 0; i < 600 && moving; i++) {
      moving = stepSpring(s, 76, 1 / 60);
      peak = Math.max(peak, s.value);
    }
    expect(moving).toBe(false);
    expect(s.value).toBe(76);
    expect(peak).toBeLessThanOrEqual(76.5);
  });
});