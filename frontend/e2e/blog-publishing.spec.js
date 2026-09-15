import { expect, test } from '@playwright/test';

/**
 * Capture browser console errors and uncaught page failures for a complete publishing journey.
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

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem('writespace_e2e_initialized')) {
      window.localStorage.clear();
      window.sessionStorage.setItem('writespace_e2e_initialized', 'true');
    }
  });
});

test('a user publishes, reloads, edits, and deletes their own blog', async ({ page }) => {
  const errors = captureBrowserErrors(page);

  await page.goto('/register');
  await page.getByLabel('Display name').fill('Ada Writer');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password', { exact: true }).fill('password');
  await page.getByLabel('Confirm password').fill('password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('heading', { name: 'All blogs' })).toBeVisible();

  await page.getByRole('link', { name: 'Write a blog' }).first().click();
  await page.getByLabel('Title').fill('Local persistence');
  await page.getByLabel('Content').fill('A first line\nA second line');
  await page.getByRole('button', { name: 'Publish blog' }).click();
  await expect(page.getByRole('heading', { name: 'Local persistence' })).toBeVisible();

  const createdPost = await page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_posts'))[0]);
  expect(createdPost).toMatchObject({
    title: 'Local persistence', content: 'A first line\nA second line', authorName: 'Ada Writer', authorRole: 'user',
  });
  expect(createdPost.createdAt).toEqual(expect.any(String));

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Local persistence' })).toBeVisible();
  await page.getByRole('link', { name: 'Edit post' }).click();
  await page.getByLabel('Content').fill('An edited and persisted line');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('An edited and persisted line')).toBeVisible();
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_posts'))[0].content)).resolves.toBe('An edited and persisted line');

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Delete post' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByText('No blogs yet. Be the first to write one!')).toBeVisible();
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_posts')))).resolves.toEqual([]);
  expect(errors).toEqual([]);
});

test('a non-owner initial edit entry returns to blogs without edit controls', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.addInitScript(() => {
    window.localStorage.setItem('writespace_session', JSON.stringify({
      userId: 'another-author', username: 'other', displayName: 'Other Writer', role: 'user',
    }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      {
        id: 'owned-post',
        title: 'Local persistence',
        content: 'An edited and persisted line',
        createdAt: '2024-04-01T00:00:00.000Z',
        authorId: 'ada',
        authorName: 'Ada Writer',
        authorRole: 'user',
      },
    ]));
  });

  await page.goto('/edit/owned-post');

  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('heading', { name: 'Local persistence', level: 3 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
  expect(errors).toEqual([]);
});
