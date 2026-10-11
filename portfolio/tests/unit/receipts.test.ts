import { describe, expect, it } from 'vitest';
import { levelFor, monthlyTotals, weekdayOf } from '../../src/lib/receipts';

describe('receipts helpers', () => {
  it('maps counts to ink levels', () => {
    expect(levelFor(0, 10)).toBe(0);
    expect(levelFor(1, 10)).toBe(1);
    expect(levelFor(3, 10)).toBe(2);
    expect(levelFor(6, 10)).toBe(3);
    expect(levelFor(10, 10)).toBe(4);
    expect(levelFor(5, 0)).toBe(0);
  });

  it('sums contributions per month, oldest first', () => {
    const weeks = [
      [{ date: '2026-09-30', count: 2 }, { date: '2026-10-01', count: 3 }],
      [{ date: '2026-10-08', count: 4 }],
    ];
    expect(monthlyTotals(weeks)).toEqual([
      { month: '2026-09', count: 2 },
      { month: '2026-10', count: 7 },
    ]);
  });

  it('puts Sunday in row 0', () => {
    expect(weekdayOf('2026-10-11')).toBe(0);
    expect(weekdayOf('2026-10-12')).toBe(1);
  });
});
