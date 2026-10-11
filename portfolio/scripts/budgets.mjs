import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

const gz = (p) => gzipSync(readFileSync(p)).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const html = readFileSync('out/index.html', 'utf8');

// Only what the browser really runs on this route (nomodule polyfills are skipped by modern browsers).
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
  .filter((m) => !/nomodule/i.test(m[0]))
  .map((m) => m[1].split('?')[0]);
const js = [...new Set(scripts)].map((src) => [src, gz(join('out', src))]).sort((a, b) => b[1] - a[1]);

const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1].split('?')[0]);
const cssBytes = [...new Set(styles)].reduce((n, href) => n + gz(join('out', href)), 0);

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const fontBytes = walk('out/_next/static').filter((f) => extname(f) === '.woff2').reduce((n, f) => n + statSync(f).size, 0);

const jsBytes = js.reduce((n, [, b]) => n + b, 0);
console.log('Largest scripts on this route (gzip):');
// Heuristic label from file contents, so we can see framework vs our code.
const label = (src) => {
  const t = readFileSync(join('out', src), 'utf8');
  if (/scroll-hairline|graph-wrap|pin-stage|head-body|contact-form/.test(t)) return 'OUR CODE';
  if (/Minified React error|react\.transitional\.element/.test(t)) return 'React';
  if (/__next_f|next-router-state-tree/i.test(t)) return 'Next runtime';
  if (/turbopack/i.test(src)) return 'Turbopack runtime';
  return '?';
};
js.slice(0, 8).forEach(([src, b]) => console.log(`  ${kb(b).padStart(9)}  ${label(src).padEnd(18)}${src}`));
console.log(`  HTML itself (gzip): ${kb(gzipSync(readFileSync('out/index.html')).length)}\n`);

// Our code = chunks labelled OUR CODE or '?' (conservative). Framework = the rest.
const ourBytes = js.filter(([src]) => ['OUR CODE', '?'].includes(label(src))).reduce((n, [, b]) => n + b, 0);
console.log(`Framework (React, Next router, runtime): ${kb(jsBytes - ourBytes)}  (informational)\n`);
const rows = [
  ['Our code (gzip)', ourBytes, 30],
  ['JS on this route (gzip)', jsBytes, 160],
  ['CSS (gzip)', cssBytes, 20],
  ['Fonts (woff2)', fontBytes, 110],
];
let failed = false;
for (const [name, bytes, max] of rows) {
  const over = bytes / 1024 > max;
  failed ||= over;
  console.log(`${over ? 'OVER' : 'ok  '}  ${name}: ${kb(bytes)} / ${max} KB`);
}
process.exit(failed ? 1 : 0);