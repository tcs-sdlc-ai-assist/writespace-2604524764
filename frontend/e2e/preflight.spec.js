import { expect, test } from '@playwright/test';

/**
 * Capture text-based rendering evidence for the public landing page before release.
 *
 * @param {import('@playwright/test').Page} page Browser page under test.
 * @returns {string[]} Mutable collection of browser failures.
 */
function captureBrowserErrors(page) {
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

test('captures accessible structure and visual-preflight evidence for the public landing page', async ({ page }, testInfo) => {
  const errors = captureBrowserErrors(page);
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const accessibilityTree = await page.locator('body').ariaSnapshot();
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  const renderedHtml = await page.content();

  expect(accessibilityTree).toBeTruthy();
  expect(JSON.stringify(accessibilityTree)).toContain('WriteSpace');
  expect(bodyFont).not.toBe('');
  expect(renderedHtml).toContain('<main');
  await expect(page.getByRole('heading', { name: 'WriteSpace', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start Reading' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('landing-preflight-mobile.png'), fullPage: true });
  expect(errors).toEqual([]);
});
