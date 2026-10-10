import { lanes } from '../../content/graph';

export const GUTTER_W = 96; // 6rem
export const LABEL_X = 100;
export const LANE_X0 = 12;
export const LANE_DX = 8;
export const FORK_CURVE = 140;
const MERGE_CURVE = 140;
const MERGE_STAGGER = 12;

export interface GraphAnchors {
  commitY: Record<string, number>;
  logY: number[];
  mergeEndY: number;
  height: number;
}
export interface GraphViewport {
  vh: number;
  pinned: boolean;
}
export interface ResolvedLane {
  id: string;
  label: string;
  x: number;
  commitY: number;
  d: string;
}
export interface ResolvedGraph {
  height: number;
  main: string;
  lanes: ResolvedLane[];
  logCommits: { x: number; y: number }[];
}

export const laneX = (id: string): number => LANE_X0 + Math.max(0, lanes.findIndex((l) => l.id === id)) * LANE_DX;

const r = (n: number) => Math.round(n * 10) / 10;

export function resolveGraph(a: GraphAnchors, viewport: GraphViewport): ResolvedGraph {
  // Pinned: a lane reaches its x exactly when its scene starts (HEAD y at scene start).
  const lead = viewport.pinned ? (viewport.vh * 0.75) / 2 + FORK_CURVE : FORK_CURVE + 80;
  const branches = lanes.filter((l) => l.id !== 'main');
  const mainX = laneX('main');
  const out: ResolvedLane[] = [];

  branches.forEach((lane, i) => {
    const cy = a.commitY[lane.id];
    if (cy === undefined) return;
    const x = laneX(lane.id);
    const px = laneX(lane.parent ?? 'main');
    const forkY = Math.max(0, cy - lead);
    const mergeLen = MERGE_CURVE + (branches.length - 1 - i) * MERGE_STAGGER;
    const mergeStart = a.mergeEndY - mergeLen;
    const d =
      `M ${px} ${r(forkY)} C ${px} ${r(forkY + FORK_CURVE * 0.55)} ${x} ${r(forkY + FORK_CURVE * 0.45)} ${x} ${r(forkY + FORK_CURVE)} ` +
      `L ${x} ${r(mergeStart)} ` +
      `C ${x} ${r(mergeStart + mergeLen * 0.55)} ${mainX} ${r(mergeStart + mergeLen * 0.45)} ${mainX} ${r(a.mergeEndY)}`;
    out.push({ id: lane.id, label: lane.label, x, commitY: cy, d });
  });

  return {
    height: a.height,
    main: `M ${mainX} 0 L ${mainX} ${r(a.mergeEndY)}`,
    lanes: out,
    logCommits: a.logY.map((y) => ({ x: mainX, y })),
  };
}