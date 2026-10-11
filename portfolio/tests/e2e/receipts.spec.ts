import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

const FILE = 'src/content/generated/github.json';

test('Receipts is absent without data; with data its table and heatmap match the JSON', async ({ page }) => {
  await page.goto('/');
  if (!existsSync(FILE)) {
    await expect(page.locator('#receipts')).toHaveCount(0);
    return;
  }
  const snap = JSON.parse(readFileSync(FILE, 'utf8')) as { fetchedAt: string; weeks: { date: string; count: number }[][] };
  await expect(page.locator('#receipts')).toHaveCount(1);

  const expected: Record<string, number> = {};
  for (const d of snap.weeks.flat()) expected[d.date.slice(0, 7)] = (expected[d.date.slice(0, 7)] ?? 0) + d.count;
  const rows = await page
    .locator('#receipts table tbody tr')
    .evaluateAll((trs) => trs.map((tr) => [...tr.querySelectorAll('th, td')].map((c) => c.textContent ?? '')));
  expect(Object.fromEntries(rows.map((r) => [r[0], Number(r[1])]))).toEqual(expected);

  expect(await page.locator('#receipts svg rect').count()).toBe(snap.weeks.flat().length);
  await expect(page.locator('#receipts')).toContainText(`Snapshot from GitHub, ${snap.fetchedAt.slice(0, 10)}`);
});
