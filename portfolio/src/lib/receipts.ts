export interface Day {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Snapshot {
  fetchedAt: string;
  login: string;
  total: number;
  publicRepos: number;
  weeks: Day[][];
}

export type LinkStatus = 'ok' | 'dead' | 'unknown';

export interface LinkRecord {
  status: LinkStatus;
  checkedAt?: string;
}

/** Ink level 0..4 for a contribution count, given the max in the dataset. */
export function levelFor(count: number, max: number): number {
  if (max <= 0) return 0;
  const ratio = count / max;
  if (ratio === 0) return 0;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

/** Sum contributions per month, oldest month first. */
export function monthlyTotals(weeks: Day[][]): { month: string; count: number }[] {
  const map = new Map<string, number>();
  for (const week of weeks) {
    for (const day of week) {
      const month = day.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + day.count);
    }
  }
  return [...map.entries()]
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/** Sunday = 0 .. Saturday = 6, for heatmap column placement. */
export function weekdayOf(date: string): number {
  const d = new Date(date + 'T00:00:00Z');
  return ((d.getUTCDay() + 7) % 7);
}
