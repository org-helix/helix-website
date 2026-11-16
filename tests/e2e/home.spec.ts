import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { hero, nav, projects, site } from '../../src/content/site';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('renders the home page with one h1 and its metadata', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle(site.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    site.description,
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(hero.titleLine);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(hero.titleAccent);
});

test('every nav entry targets a section that exists', async ({ page }) => {
  await page.goto('./');
  for (const item of nav) {
    await expect(page.locator(item.href)).toHaveCount(1);
  }
});

test('shows a single primary button per page', async ({ page }) => {
  await page.goto('./');
  // The skip link is styled as primary but only visible while focused.
  await expect(page.locator('.ds-btn--primary:not(.skip)')).toHaveCount(1);
});

test('external links open in a new tab safely and say so', async ({ page }) => {
  await page.goto('./');
  const external = page.locator('a[target="_blank"]');
  expect(await external.count()).toBeGreaterThan(0);
  for (const link of await external.all()) {
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toContainText('(opens in a new tab)');
  }
});

test('has no horizontal scroll', async ({ page }) => {
  await page.goto('./');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('paints the hero illustration', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('canvas[data-sunset]')).toHaveClass(/is-ready/);
});

test('presents netlix with a screenshot and a download link', async ({ page }) => {
  await page.goto('./');
  const section = page.locator('#projects');
  await expect(section.getByRole('heading', { level: 3, name: 'netlix' })).toBeVisible();

  const shot = section.getByRole('img', { name: projects.netlix.image.alt });
  await shot.scrollIntoViewIfNeeded();
  await expect(shot).toHaveJSProperty('complete', true);
  expect(await shot.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  for (const download of projects.netlix.downloads) {
    await expect(
      section.getByRole('link', { name: new RegExp(`^${download.system} ${download.kind}`) }),
    ).toHaveAttribute('href', download.href);
  }
});

test('header gains a background once the page is scrolled', async ({ page }) => {
  await page.goto('./');
  const header = page.locator('[data-header]');
  await expect(header).not.toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).toHaveClass(/is-scrolled/);
});

test('keeps its privacy promise: no cookies, no third-party requests', async ({
  page,
  context,
  baseURL,
}) => {
  const foreign: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(baseURL ?? '') && !url.startsWith('data:')) foreign.push(url);
  });

  await page.goto('./', { waitUntil: 'networkidle' });

  expect(foreign).toEqual([]);
  expect(await context.cookies()).toEqual([]);
});

test('has no detectable accessibility violation', async ({ page }) => {
  await page.goto('./');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('skip link is the first tab stop and jumps to the content', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('404 page renders and links back home', async ({ page, baseURL }) => {
  const response = await page.goto('./404');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist.');
  await page.getByRole('link', { name: 'Back to the home page' }).click();
  await expect(page).toHaveURL(baseURL ?? '');
});

test('internal links and assets stay under the base path', async ({ page, baseURL }) => {
  await page.goto('./');
  const basePath = new URL(baseURL ?? '').pathname;
  const urls = await page
    .locator('a[href^="/"], link[href^="/"], script[src^="/"]')
    .evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('href') ?? el.getAttribute('src') ?? ''),
    );
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) expect(url, url).toMatch(new RegExp(`^${basePath}`));
});
