import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { IDS, lift, load, scrollToScene } from './helpers';

test.skip(!process.env.SHOTS, 'run with: npm run shots');
test.use({ viewport: { width: 1440, height: 900 } });

const OUT = 'shots';
test.beforeAll(() => mkdirSync(OUT, { recursive: true }));

test('hero timeline', async ({ page }) => {
  for (const t of [0.2, 1.0, 1.4, 2.6]) {
    await page.goto('/');
    await page.waitForFunction((ms) => performance.now() >= ms, t * 1000);
    await page.screenshot({ path: `${OUT}/hero-${t.toFixed(1)}s.png` });
  }
});

test('each venture scene at its dwell centre', async ({ page }) => {
  test.setTimeout(120_000);
  await load(page);
  await lift(page);
  for (let k = 0; k < IDS.length; k++) {
    await scrollToScene(page, k);
    await page.screenshot({ path: `${OUT}/scene-${k + 1}-${IDS[k]}.png` });
  }
});

test('log, stack, principles, contact', async ({ page }) => {
  test.setTimeout(120_000);
  await load(page);
  await lift(page);
  for (const id of ['log', 'stack', 'principles', 'contact']) {
    const box = await page.evaluate((sel) => {
      const r = document.querySelector(sel)!.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    }, `#${id}`);
    // Walk through the section so every reveal fires, then shoot the viewport at its top.
    for (let y = box.top; y < box.top + box.height; y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(350);
    }
    await page.evaluate((v) => window.scrollTo(0, v), box.top);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/section-${id}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/contact-merge.png` });
});
