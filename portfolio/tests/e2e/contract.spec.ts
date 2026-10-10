import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

interface Dbg {
  index: number;
  phase: string;
  ladder: number;
  merged: boolean;
  layout: { pinTop: number; vh: number };
}

const IDS = ['digira', 'agency', 'esports', 'education', 'nss', 'krishisaathi', 'neurosync', 'mirror'];

const debug = (page: Page) =>
  page.evaluate(() => (window as unknown as { __graph: { debug: () => unknown } }).__graph.debug()) as Promise<Dbg>;

/** Loads the page and waits until HEAD's driver is running. */
async function load(page: Page, hash = '') {
  await page.goto(`/?debug=1${hash}`);
  await page.waitForFunction(
    () => {
      const w = window as unknown as { __graph?: { debug: () => { phase: string } } };
      return !!w.__graph && ['parked', 'live'].includes(w.__graph.debug().phase);
    },
    null,
    { timeout: 15_000 },
  );
}

/** First scroll lifts HEAD off the full stop; wait for it to become live. */
async function lift(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 12));
  await page.waitForFunction(
    () => (window as unknown as { __graph: { debug: () => { phase: string } } }).__graph.debug().phase === 'live',
    null,
    { timeout: 5_000 },
  );
}

async function scrollToScene(page: Page, k: number) {
  const { layout } = await debug(page);
  const L = layout.vh * 0.75;
  await page.evaluate((y) => window.scrollTo(0, y), layout.pinTop + k * L + L / 2);
  await page.waitForTimeout(1600); // spring settle
}

async function centre(page: Page, selector: string) {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`no box for ${selector}`);
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

test.describe('desktop contract', () => {
  test('no horizontal overflow at desktop widths', async ({ page }) => {
    for (const width of [1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(600);
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(sw, `scrollWidth at ${width}`).toBeLessThanOrEqual(iw);
    }
  });

  test('no console errors through a full pass', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await load(page);
    await lift(page);
    for (let k = 0; k < IDS.length; k++) await scrollToScene(page, k);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });

  test('HEAD takes over the full stop within 1px at t=2.6s', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => performance.now() > 2600);
    const head = await centre(page, '#head');
    const stop = await centre(page, '#hero-stop');
    expect(Math.abs(head.x - stop.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(head.y - stop.y)).toBeLessThanOrEqual(1);
  });

  test("HEAD sits on each scene's commit at the dwell centre", async ({ page }) => {
    await load(page);
    await lift(page);
    for (let k = 0; k < IDS.length; k++) {
      await scrollToScene(page, k);
      expect((await debug(page)).index, `index at scene ${k}`).toBe(k);
      const head = await centre(page, '#head');
      const commit = await centre(page, `.graph-commit[href="#scene-${IDS[k]}"]`);
      expect(Math.abs(head.y - commit.y), `y at ${IDS[k]}`).toBeLessThanOrEqual(1);
      expect(Math.abs(head.x - commit.x), `x at ${IDS[k]}`).toBeLessThanOrEqual(1);
    }
  });

  test('scene index is monotonic and reversible', async ({ page }) => {
    await load(page);
    await lift(page);
    const { layout } = await debug(page);
    const L = layout.vh * 0.75;
    const ys: number[] = [];
    for (let y = layout.pinTop - 100; y < layout.pinTop + 8 * L + 100; y += 150) ys.push(Math.round(y));
    const read = async (y: number) => {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(60);
      return (await debug(page)).index;
    };
    const down: number[] = [];
    for (const y of ys) down.push(await read(y));
    const up: number[] = [];
    for (const y of [...ys].reverse()) up.push(await read(y));
    const inRange = down.filter((i) => i >= 0);
    expect(inRange).toEqual([...inRange].sort((a, b) => a - b));
    expect(up.reverse()).toEqual(down);
  });

  test('#scene-esports deep link lands on that scene', async ({ page }) => {
    await load(page, '#scene-esports');
    await page.waitForTimeout(1200);
    expect((await debug(page)).index).toBe(2);
  });

  test('wash is neutral outside Work and matches the group inside', async ({ page }) => {
    await load(page);
    await lift(page);
    expect(await page.locator('.world-wash[data-on="true"]').count()).toBe(0);
    await scrollToScene(page, 6); // NeuroSync -> lab
    await expect(page.locator('.world-wash[data-on="true"]')).toHaveAttribute('data-scene', 'lab');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(900);
    expect(await page.locator('.world-wash[data-on="true"]').count()).toBe(0);
  });

  test('HEAD merges into main at Contact and grows to ~24px', async ({ page }) => {
    await load(page);
    await lift(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1800);
    await expect(page.locator('#head')).toHaveClass(/is-merged/);
    const b = await page.locator('#head .head-body').boundingBox();
    expect(b!.width).toBeGreaterThan(22);
    expect(b!.width).toBeLessThan(26);
    expect(Math.abs(b!.x + b!.width / 2 - 12)).toBeLessThanOrEqual(1);
  });

  test('inactive scenes are inert and focus never lands in them', async ({ page }) => {
    await load(page);
    await lift(page);
    await scrollToScene(page, 2);
    expect(await page.locator('article.scene[inert]').count()).toBe(IDS.length - 1);
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('[inert]')), `tab ${i}`).toBe(false);
    }
  });

  test('axe: no serious or critical violations (top, a scene, contact)', async ({ page }) => {
    await load(page);
    await lift(page);
    const spots: (() => Promise<void>)[] = [
      async () => void (await page.evaluate(() => window.scrollTo(0, 0))),
      () => scrollToScene(page, 3),
      async () => void (await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))),
    ];
    for (const go of spots) {
      await go();
      await page.waitForTimeout(500);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
    }
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('headline and all eight scenes are readable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('I build businesses');
    const scenes = page.locator('article.scene');
    await expect(scenes).toHaveCount(IDS.length);
    for (let i = 0; i < IDS.length; i++) await expect(scenes.nth(i)).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('stacked scenes, no HEAD, nothing pinned', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    expect(await page.locator('#head').count()).toBe(0);
    expect(await page.locator('.pin-stage').evaluate((el) => getComputedStyle(el).position)).not.toBe('sticky');
    await expect(page.locator('article.scene').first()).toBeVisible();
  });
});