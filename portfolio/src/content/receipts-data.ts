import { readFileSync } from 'node:fs';
import { site } from './site';
import type { LinkRecord } from '../lib/receipts';

function githubJson(): { fetchedAt: string; total: number; publicRepos: number; weeks: { date: string; count: number }[][] } | null {
  try {
    return JSON.parse(readFileSync('src/content/generated/github.json', 'utf8'));
  } catch {
    return null;
  }
}

function linksJson(): Record<string, LinkRecord> | null {
  try {
    return JSON.parse(readFileSync('src/content/generated/links.json', 'utf8'));
  } catch {
    return null;
  }
}

const snap = githubJson();
const links = linksJson();

export const hasReceipts = snap !== null;

export const hidden: string[] = links
  ? Object.entries(links).filter(([, r]) => r.status === 'dead').map(([url]) => url)
  : [];

export const sameAs = [site.github, site.linkedin, site.x]
  .filter(Boolean)
  .filter((url) => !hidden.includes(url));
