import { logEntries } from '../content/log';
import { site } from '../content/site';
import { ventures } from '../content/ventures';

/** Dev-only: lists every [FILL] so nothing is silently missing. */
export function warnMissing() {
  if (process.env.NODE_ENV === 'production') return;
  const missing: string[] = [];
  (Object.keys(site) as (keyof typeof site)[]).forEach((k) => {
    if (site[k] == null) missing.push(`site.${k}`);
  });
  ventures.forEach((v) => {
    (['context', 'challenge', 'outcome'] as const).forEach((f) => {
      if (v.id !== 'digira' && !v[f]) missing.push(`ventures.${v.id}.${f}`);
    });
    if (v.id !== 'digira' && v.id !== 'nss' && v.id !== 'agency' && !v.role) missing.push(`ventures.${v.id}.role`);
  });
  logEntries.forEach((e) => {
    if (e.role === 'Placeholder') missing.push(`log.${e.id} is a PLACEHOLDER`);
    if (!e.duration) missing.push(`log.${e.id}.duration`);
    if (!e.description) missing.push(`log.${e.id}.description`);
  });
  if (missing.length) console.warn(`[FILL] ${missing.length} missing fields:\n${missing.join('\n')}`);
}