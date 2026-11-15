import { expect, test } from '@playwright/test';
import { nav } from '../../src/content/site';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
});

test.describe('desktop navigation', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'desktop only');

  test('shows the inline nav and hides the menu button', async ({ page }) => {
    const main = page.getByRole('navigation', { name: 'Main' });
    await expect(main).toBeVisible();
    await expect(main.getByRole('link')).toHaveCount(nav.length);
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
  });

  test('scrolls to a section when its link is clicked', async ({ page }) => {
    const [first] = nav;
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link').first().click();
    await expect(page).toHaveURL(new RegExp(`${first.href}$`));
    await expect(page.locator(first.href)).toBeInViewport();
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'mobile only');

  test('opens and closes the menu from the button', async ({ page }) => {
    const toggle = page.locator('[data-menu-toggle]');
    const menu = page.getByRole('navigation', { name: 'Mobile' });

    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Close menu');
    await expect(menu.getByRole('link')).toHaveCount(nav.length);

    await toggle.click();
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAccessibleName('Open menu');
  });

  test('closes with Escape and returns focus to the button', async ({ page }) => {
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('closes after choosing a section', async ({ page }) => {
    const [first] = nav;
    await page.locator('[data-menu-toggle]').click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link').first().click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${first.href}$`));
  });

  test('stacks the hero buttons at full width', async ({ page }) => {
    const row = page.locator('.hero .ds-btn-row');
    const rowBox = await row.boundingBox();
    for (const button of await row.locator('.ds-btn').all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeCloseTo(rowBox?.width ?? 0, 0);
    }
  });
});
