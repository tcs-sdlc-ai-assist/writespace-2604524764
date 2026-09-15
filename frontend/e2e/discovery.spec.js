import { expect, test } from '@playwright/test';

/**
 * Track browser console and uncaught-page failures for one public journey.
 *
 * @param {import('@playwright/test').Page} page Browser page under test.
 * @returns {string[]} Mutable collection populated as failures occur.
 */
function capturePageErrors(page) {
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

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
});

test('renders public discovery content and the local empty state without browser errors', async ({ page }) => {
  const errors = capturePageErrors(page);

  await page.goto('/');

  await expect(page.getByRole('link', { name: 'WriteSpace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'WriteSpace', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start Reading' })).toHaveAttribute('href', '/login');
  await expect(page.getByText('No posts yet — check back soon!')).toBeVisible();
  await expect(page.getByText('Write Freely')).toBeVisible();
  await expect(page.getByText('Private & Local')).toBeVisible();
  await expect(page.getByText('Instant & Fast')).toBeVisible();
  expect(errors).toEqual([]);
});

test('renders local latest posts and protects a direct guest post route', async ({ page }) => {
  const errors = capturePageErrors(page);

  await page.addInitScript(() => {
    window.localStorage.setItem(
      'writespace_posts',
      JSON.stringify([
        { id: 'older', title: 'Older local draft', content: 'Older content', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'latest', title: 'Latest local draft', content: 'A current local preview', createdAt: '2024-04-01T00:00:00.000Z' },
      ]),
    );
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Latest local draft', level: 3 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read post' }).first()).toHaveAttribute('href', '/blog/latest');

  await page.goto('/blog/latest');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText('Login')).toBeVisible();
  expect(errors).toEqual([]);
});
