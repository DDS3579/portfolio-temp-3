import { useSyncExternalStore } from 'react';

export interface SceneState {
  index: number; // -1 = outside the Work section
  hover: string; // space-separated lane ids raised by hover/focus (Stack, Graph)
  merged: boolean; // HEAD has reached the merge at Contact
}

let state: SceneState = { index: -1, hover: '', merged: false };
const listeners = new Set<() => void>();

export const sceneStore = {
  get: () => state,
  set(patch: Partial<SceneState>) {
    const next = { ...state, ...patch };
    if (next.index === state.index && next.hover === state.hover && next.merged === state.merged) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useScene<T extends string | number | boolean>(select: (s: SceneState) => T): T {
  return useSyncExternalStore(
    sceneStore.subscribe,
    () => select(state),
    () => select(state),
  );
}