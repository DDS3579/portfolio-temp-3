import { mkdirSync, writeFileSync } from 'node:fs';
import { loadEnv } from './env.mjs';

loadEnv();
const login = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

if (!login || !token) {
  console.warn('[receipts] GITHUB_USERNAME / GITHUB_TOKEN not set: skipping the GitHub snapshot. The Receipts section will be omitted.');
  process.exit(0);
}

const query = `query($login:String!){user(login:$login){repositories(privacy:PUBLIC,ownerAffiliations:OWNER){totalCount}contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;

try {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio-receipts' },
    body: JSON.stringify({ query, variables: { login } }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors || !json.data?.user) throw new Error(JSON.stringify(json.errors ?? 'user not found'));

  const user = json.data.user;
  const cal = user.contributionsCollection.contributionCalendar;
  const out = {
    fetchedAt: new Date().toISOString(),
    login,
    total: cal.totalContributions,
    publicRepos: user.repositories.totalCount,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
  };
  mkdirSync('src/content/generated', { recursive: true });
  writeFileSync('src/content/generated/github.json', JSON.stringify(out));
  console.log(`[receipts] GitHub snapshot for ${login}: ${out.total} contributions, ${out.publicRepos} public repos.`);
} catch (e) {
  console.warn(`[receipts] GitHub snapshot failed (${e.message}). The Receipts section will be omitted.`);
}
