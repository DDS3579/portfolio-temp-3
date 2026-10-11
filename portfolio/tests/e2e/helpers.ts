import type { Page } from '@playwright/test';

export interface Dbg {
  index: number;
  phase: string;
  ladder: number;
  merged: boolean;
  layout: { pinTop: number; vh: number };
}

export const IDS = ['digira', 'agency', 'esports', 'education', 'nss', 'krishisaathi', 'neurosync', 'mirror'];

export const debug = (page: Page) =>
  page.evaluate(() => (window as unknown as { __graph: { debug: () => unknown } }).__graph.debug()) as Promise<Dbg>;

/** Loads the page and waits until HEAD's driver is running. */
export async function load(page: Page, hash = '') {
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
export async function lift(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 12));
  await page.waitForFunction(
    () => (window as unknown as { __graph: { debug: () => { phase: string } } }).__graph.debug().phase === 'live',
    null,
    { timeout: 5_000 },
  );
}

export async function scrollToScene(page: Page, k: number) {
  const { layout } = await debug(page);
  const L = layout.vh * 0.75;
  await page.evaluate((y) => window.scrollTo(0, y), layout.pinTop + k * L + L / 2);
  await page.waitForTimeout(1600); // spring settle
}

export async function centre(page: Page, selector: string) {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`no box for ${selector}`);
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}
