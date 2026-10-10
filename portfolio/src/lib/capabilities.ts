import { useSyncExternalStore } from 'react';

export const MQ_GRAPH = '(min-width: 64rem)';
export const MQ_PINNED = '(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useGraphMode = () => useMedia(MQ_GRAPH);
export const usePinnedMode = () => useMedia(MQ_PINNED);