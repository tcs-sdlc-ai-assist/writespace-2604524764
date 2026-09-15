import { expect, test } from '@playwright/test';

/**
 * Capture browser console errors and uncaught page failures for the mobile navigation journey.
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

test('an authenticated administrator can use every mobile navigation role link', async ({ page }, testInfo) => {
  const errors = captureBrowserErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem('writespace_session', JSON.stringify({
      userId: 'admin', username: 'admin', displayName: 'Admin', role: 'Admin',
    }));
  });

  await page.goto('/blogs');

  await expect(page.getByRole('heading', { name: 'All blogs' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('authenticated-mobile-blogs.png') });
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  await expect(page.getByRole('link', { name: 'All Blogs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Write', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();

  await page.getByRole('link', { name: 'Write', exact: true }).click();
  await expect(page).toHaveURL(/\/write$/);
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page).toHaveURL(/\/users$/);
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  await page.getByRole('link', { name: 'All Blogs' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('heading', { name: 'All blogs' })).toBeVisible();
  expect(errors).toEqual([]);
});
