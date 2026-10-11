import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SKIP = ['divyadsharma.com.np', 'schema.org', 'w3.org'];
const files = readdirSync('src/content').filter((f) => f.endsWith('.ts')).map((f) => join('src/content', f));
const urls = [...new Set(files.flatMap((f) => readFileSync(f, 'utf8').match(/https?:\/\/[^\s'"`)<]+/g) ?? []))].filter(
  (u) => !SKIP.some((s) => u.includes(s)),
);

async function probe(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    // first try + two retries
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
      if (!res.ok) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(8000) });
      if (res.ok) return 'ok';
      if (res.status === 404 || res.status === 410) return 'dead';
      // 403, 429, 999, 5xx: the server won't tell us, so we can't verify
    } catch {
      // network error or timeout: retry
    }
  }
  return 'unknown';
}

const out = {};
for (const url of urls) {
  const status = await probe(url);
  out[url] = status === 'unknown' ? { status } : { status, checkedAt: new Date().toISOString() };
  if (status === 'dead') console.warn(`[receipts] DEAD link, will be omitted: ${url}`);
  else if (status === 'unknown') console.warn(`[receipts] could not verify (left unstamped): ${url}`);
}
mkdirSync('src/content/generated', { recursive: true });
writeFileSync('src/content/generated/links.json', JSON.stringify(out));
console.log(`[receipts] checked ${urls.length} external links.`);
