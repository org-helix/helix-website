import { defineConfig, devices } from '@playwright/test';
import astroConfig from './astro.config.mjs';
import { withBase } from './src/lib/url';

// Not 4321: a dev server left running there must never be tested in place of the build.
const PORT = 4323;
const isCI = Boolean(process.env['CI']);
// The site is served under its base path (/helix-website/), exactly as on GitHub Pages.
// Tests navigate with relative URLs ('./', './404') so they follow it.
const BASE_URL = `http://localhost:${PORT}${withBase('', astroConfig.base ?? '/')}`;

// End-to-end tests run against the production build (`npm run build` first).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    // The two reference sizes of the design system: 1440 × 900 and 390 × 844.
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: BASE_URL,
    // Always a fresh preview of dist/: if the port is taken, fail loudly instead of testing something else.
    reuseExistingServer: false,
  },
});
