// Regenerates the README screenshots from the production build.
// Usage: npm run build && npm run screenshots
import { chromium } from '@playwright/test';
import { preview } from 'astro';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import astroConfig from '../astro.config.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = new URL('../docs/screenshots/', import.meta.url);
const port = 4322; // not 4321, so a running dev server does not get in the way
// The site is served under its base path (/helix-website/), as on GitHub Pages.
const url = `http://localhost:${port}${(astroConfig.base ?? '/').replace(/\/+$/, '')}/`;

// The two reference sizes of the design system. Mobile is captured at 2× so it stays sharp in the README.
const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };

const shots = [
  { file: 'desktop.png', device: desktop },
  { file: 'desktop-full.png', device: desktop, fullPage: true },
  { file: 'mobile.png', device: mobile },
  { file: 'mobile-principles.png', device: mobile, scrollTo: '#principles .panel' },
  { file: 'mobile-menu.png', device: mobile, openMenu: true },
];

if (!existsSync(new URL('../dist/index.html', import.meta.url))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const server = await preview({ root, server: { port }, logLevel: 'error' });
const browser = await chromium.launch();

try {
  for (const shot of shots) {
    // Reduced motion: every element is in its final state, no entrance animation half-way through.
    const page = await browser.newPage({ ...shot.device, reducedMotion: 'reduce' });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('canvas[data-sunset].is-ready').waitFor();
    if (shot.scrollTo) {
      // Line the element up 24 px under the header, so no text is left half-hidden behind it.
      await page.locator(shot.scrollTo).evaluate((el) => {
        const header = document.querySelector('[data-header]');
        const offset = (header?.getBoundingClientRect().height ?? 0) + 24;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset);
      });
      await page.locator('[data-header].is-scrolled').waitFor();
    }
    if (shot.openMenu) {
      await page.locator('[data-menu-toggle]').click();
      await page.getByRole('navigation', { name: 'Mobile' }).waitFor();
      // Park the pointer on the empty panel so the close button is not caught in its hover state.
      await page.mouse.move(shot.device.viewport.width / 2, shot.device.viewport.height - 40);
    }
    await page.screenshot({
      path: fileURLToPath(new URL(shot.file, outDir)),
      fullPage: shot.fullPage ?? false,
    });
    await page.close();
    console.log(`docs/screenshots/${shot.file}`);
  }
} finally {
  await browser.close();
  await server.stop();
}
