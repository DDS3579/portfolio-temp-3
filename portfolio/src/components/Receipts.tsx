import { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { levelFor, monthlyTotals, weekdayOf } from '@/lib/receipts';
import { hasReceipts } from '@/content/receipts-data';
import type { Snapshot } from '@/lib/receipts';

export const metadata: Metadata = {
  description: 'Build-time receipts: GitHub snapshot, contribution heatmap, and verified external links.',
};

function readSnap(): Snapshot | null {
  if (!hasReceipts) return null;
  try {
    return JSON.parse(readFileSync('src/content/generated/github.json', 'utf8')) as Snapshot;
  } catch {
    return null;
  }
}

function readLinks(): Record<string, { status: 'ok' | 'dead' | 'unknown'; checkedAt?: string }> | null {
  try {
    return JSON.parse(readFileSync('src/content/generated/links.json', 'utf8'));
  } catch {
    return null;
  }
}

const snap = readSnap();
const links = readLinks();

export default function Receipts() {
  if (!snap) return null;

  const totals = monthlyTotals(snap.weeks);
  const max = Math.max(...snap.weeks.flat().map((d) => d.count), 1);

  return (
    <section id="receipts" aria-labelledby="receipts-title" className="section-pad">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="receipts-title" className="display-section mb-2">Receipts</h2>
        <p className="data-line mb-10">
          Snapshot from GitHub, {new Date(snap.fetchedAt).toISOString().slice(0, 10)}.
          {links ? `${Object.keys(links).length} external links checked at build time.` : ''}
        </p>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left column: stats + heatmap */}
          <div className="lg:col-span-3">
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="data-line mb-1">Contributions</dt>
                <dd className="text-4xl font-bold tabular-nums">{snap.total.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="data-line mb-1">Public repos</dt>
                <dd className="text-4xl font-bold tabular-nums">{snap.publicRepos.toLocaleString()}</dd>
              </div>
            </dl>

            <p className="data-line mt-8 mb-4">Contribution activity by month:</p>
            <ul className="list-none m-0 p-0" aria-label="Monthly contribution totals">
              {totals.map(({ month, count }) => (
                <li key={month} className="data-line mb-1 flex gap-4">
                  <time dateTime={`${month}-01`} className="tabular-nums w-28">{month}</time>
                  <span className="tabular-nums font-medium">{count}</span>
                </li>
              ))}
            </ul>

            <p className="data-line mt-10 mb-4">Contribution heatmap (neutral ink, latest {snap.weeks.length} weeks):</p>
            <svg
              viewBox={`0 0 ${snap.weeks.length * 12 + 12} ${7 * 12 + 8}`}
              className="overflow-visible"
              role="img"
              aria-label="GitHub-style contribution heatmap"
            >
              {/* column headers: months */}
              {totals.map(({ month }, mi) => {
                const weekIndex = snap.weeks.findIndex((w) => w.some((d) => d.date.startsWith(month)));
                if (weekIndex < 0) return null;
                const x = 12 + weekIndex * 12 + 6;
                return (
                  <text key={month} x={x} y={4} className="text-[10px] fill-[var(--color-muted)]" textAnchor="middle">
                    {month.slice(2)}
                  </text>
                );
              })}
              {/* rows: weekdays (Sun..Sat) */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label, ri) => (
                <text key={label} x={6} y={12 + ri * 12 + 9} className="text-[10px] fill-[var(--color-muted)]">
                  {label}
                </text>
              ))}
              {/* cells */}
              {snap.weeks.map((week, wi) =>
                week.map((day) => {
                  const ri = weekdayOf(day.date);
                  const level = levelFor(day.count, max);
                  const x = 12 + wi * 12 + 2;
                  const y = 12 + ri * 12 + 2;
                  return (
                    <rect
                      key={day.date}
                      x={x}
                      y={y}
                      width={8}
                      height={8}
                      rx={1.5}
                      fill={level === 0 ? 'transparent' : `rgb(${80 + level * 40}, ${80 + level * 40}, ${90 + level * 35} / ${0.15 + level * 0.18})`}
                    />
                  );
                }),
              )}
            </svg>
          </div>

          {/* Right column: link verification table */}
          <div className="lg:col-span-2">
            <p className="data-line mb-4">External links verified at build time:</p>
            {links ? (
              <table className="w-full text-sm" aria-label="External link verification">
                <thead>
                  <tr className="data-line uppercase tracking-wider text-[var(--color-muted)]">
                    <th scope="col" className="pb-2 pr-4 text-left">Link</th>
                    <th scope="col" className="pb-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(links).map(([url, rec]) => {
                    const statusLabel =
                      rec.status === 'ok'
                        ? `checked ${new Date(rec.checkedAt!).toISOString().slice(0, 10)}`
                        : rec.status === 'dead'
                        ? 'dead — omitted'
                        : 'could not verify';
                    const statusClass =
                      rec.status === 'ok'
                        ? 'text-[var(--color-muted)]'
                        : rec.status === 'dead'
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-muted)]';
                    return (
                      <tr key={url} className="border-t border-[var(--color-border)]">
                        <td className="py-2 pr-4">
                          <span className="data-line break-all">{url.replace(/^https?:\/\//, '')}</span>
                        </td>
                        <td className={`py-2 text-lefttabular-nums ${statusClass}`}>{statusLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="data-line text-[var(--color-muted)]">Link verification skipped (offline build or no links.json).</p>
            )}
          </div>
        </div>      </div>
    </section>
  );
}


