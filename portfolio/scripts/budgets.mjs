import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk('out/_next/static');
const total = (ext, gz) =>
  files.filter((f) => extname(f) === ext).reduce((n, f) => n + (gz ? gzipSync(readFileSync(f)).length : statSync(f).size), 0);

const rows = [
  ['JS, all chunks (gzip)', total('.js', true), 120],
  ['CSS (gzip)', total('.css', true), 20],
  ['Fonts (woff2)', total('.woff2', false), 110],
];

let failed = false;
for (const [name, bytes, max] of rows) {
  const kb = bytes / 1024;
  const over = kb > max;
  failed ||= over;
  console.log(`${over ? 'OVER' : 'ok  '}  ${name}: ${kb.toFixed(1)} KB / ${max} KB`);
}
process.exit(failed ? 1 : 0);