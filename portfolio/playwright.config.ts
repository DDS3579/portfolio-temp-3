import { defineConfig, devices } from '@playwright/test';

// Run `npm run build` first: the tests hit the static export in out/.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  workers: 1,
  webServer: {
    command: 'npx serve out -l 3100 --no-clipboard',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  use: { baseURL: 'http://localhost:3100' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
});