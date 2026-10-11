import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { debug, lift, load } from './helpers';

test.describe('type fits its container', () => {
  for (const width of [1024, 1280, 1440, 1920]) {
    test(`hero lines and scene names fit at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(600);

      const hero = await page.evaluate(() => ({
        box: document.querySelector('.hero-head')!.clientWidth,
        lines: [...document.querySelectorAll('.hero-rise')].map((el) => el.getBoundingClientRect().width),
        size: parseFloat(getComputedStyle(document.querySelector('.display-hero')!).fontSize),
      }));
      // Tuning number: how much of the container the widest line fills. Aim for ~92-97%.
      const fill = Math.max(...hero.lines) / hero.box;
      console.log(`hero @${width}: font ${hero.size.toFixed(0)}px, widest line fills ${(fill * 100).toFixed(0)}% of the container`);
      hero.lines.forEach((w, i) => expect(w, `hero line ${i + 1} @${width}`).toBeLessThanOrEqual(hero.box + 1));
      if (hero.size < 150) expect(fill, `hero fill @${width}`).toBeGreaterThanOrEqual(0.9); // 9.5rem cap applies above this

      const names = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('.display-scene')].map((h) => ({
          name: h.textContent ?? '',
          over: h.scrollWidth - h.clientWidth,
        })),
      );
      names.forEach((n) => expect(n.over, `scene name "${n.name}" @${width}`).toBeLessThanOrEqual(1));
    });
  }
});

test.describe('brief rules in the built CSS', () => {
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const css = walk('out/_next/static').filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), decl: m[2] }));

  test('hue tokens appear only in [data-scene] scopes, world washes and posters', () => {
    const allowed = /data-scene|\.world-wash|\.poster|^:root|^:host/;
    const bad = rules.filter((r) => /--color-hue-|var\(--hue\)/.test(r.decl) && !allowed.test(r.sel));
    expect(bad.map((r) => r.sel)).toEqual([]);
  });

  test('amber is never a text colour', () => {
    const bad = rules.filter((r) => /(^|;)\s*color\s*:\s*var\(--color-head/.test(r.decl));
    expect(bad.map((r) => r.sel)).toEqual([]);
  });

  test('no gradients anywhere', () => {
    expect(/(linear|radial|conic)-gradient\(/.test(css)).toBe(false);
  });
});

test('text contrast holds across the pinned section (24 positions, washes and posters included)', async ({ page }) => {
  test.setTimeout(180_000);
  await load(page);
  await lift(page);
  const { layout } = await debug(page);
  const L = layout.vh * 0.75;
  const start = layout.pinTop - 0.4 * layout.vh;
  const span = 8 * L + 0.8 * layout.vh;
  for (let i = 0; i < 24; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(start + (span * i) / 23));
    await page.waitForTimeout(800); // wash crossfade is 350ms
    const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    const summary = violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => String(n.target)).join(' | ')}`);
    expect(summary, `position ${i}`).toEqual([]);
  }
});
