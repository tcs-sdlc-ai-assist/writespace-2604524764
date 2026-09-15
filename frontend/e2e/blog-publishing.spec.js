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
    window.localStorage.clear();
  });
});

test('a user publishes, reloads, edits, blocks another author, and deletes their own blog', async ({ page }) => {
  const errors = captureBrowserErrors(page);

  await page.goto('/register');
  await page.getByLabel('Display name').fill('Ada Writer');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password').fill('password');
  await page.getByLabel('Confirm password').fill('password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/blogs$/);

  await page.getByRole('link', { name: 'Write a blog' }).first().click();
  await page.getByLabel('Title').fill('Local persistence');
  await page.getByLabel('Content').fill('A first line\nA second line');
  await page.getByRole('button', { name: 'Publish blog' }).click();
  await expect(page.getByRole('heading', { name: 'Local persistence' })).toBeVisible();

  const createdPost = await page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_posts'))[0]);
  const ownerSession = await page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_session')));
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

  await page.evaluate(() => {
    window.localStorage.setItem('writespace_session', JSON.stringify({
      userId: 'another-author', username: 'other', displayName: 'Other Writer', role: 'user',
    }));
  });
  await page.goto(`/edit/${createdPost.id}`);
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('heading', { name: 'Local persistence', level: 3 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);

  await page.evaluate((session) => {
    window.localStorage.setItem('writespace_session', JSON.stringify(session));
  }, ownerSession);
  await page.goto(`/blog/${createdPost.id}`);
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Delete post' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByText('No blogs yet. Be the first to write one!')).toBeVisible();
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_posts')))).resolves.toEqual([]);
  expect(errors).toEqual([]);
});
