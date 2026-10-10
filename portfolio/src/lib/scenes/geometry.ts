export const HEAD_Y = 0.4; // HEAD sits at 40% of the viewport height
export const SCENE_L = 0.75; // one scene = 75dvh of scroll
export const SCENE_COUNT = 8;

/** Scene index for a scroll position; -1 when the pinned stage is far from the viewport. */
export function sceneAt(scroll: number, pinTop: number, L: number, vh: number, count = SCENE_COUNT): number {
  const rel = scroll - pinTop;
  if (rel < -0.5 * vh || rel > count * L + 0.5 * vh) return -1;
  return Math.max(0, Math.min(count - 1, Math.floor(rel / L)));
}

/** Scroll position at which scene k is centred (HEAD sits on its commit). */
export const sceneCentre = (k: number, pinTop: number, L: number) => pinTop + k * L + L / 2;

/** Document y of scene k's commit. */
export const commitY = (k: number, pinTop: number, L: number, vh: number) => sceneCentre(k, pinTop, L) + HEAD_Y * vh;