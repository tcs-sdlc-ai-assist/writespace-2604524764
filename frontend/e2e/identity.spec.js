import { expect, test } from '@playwright/test';

/**
 * Fail a browser journey when the application logs an error or throws on the page.
 *
 * @param {import('@playwright/test').Page} page Browser page under test.
 * @returns {string[]} Mutable list of captured browser failures.
 */
function captureBrowserErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/**
 * Assert a browser journey completed without client-side errors.
 *
 * @param {string[]} errors Captured browser failures.
 * @returns {void}
 */
function expectNoBrowserErrors(errors) {
  expect(errors).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem('writespace_e2e_initialized')) {
      window.localStorage.clear();
      window.sessionStorage.setItem('writespace_e2e_initialized', 'true');
    }
  });
});

test('admin login redirects to the admin route and stores the required session', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'WriteSpace overview' })).toBeVisible();
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_session')))).resolves.toEqual({
    userId: 'admin', username: 'admin', displayName: 'Admin', role: 'Admin',
  });
  expectNoBrowserErrors(errors);
});

test('invalid credentials remain inline and do not create a session', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.goto('/login');
  await page.getByLabel('Username').fill('bad');
  await page.getByLabel('Password').fill('bad');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
  await expect(page.evaluate(() => window.localStorage.getItem('writespace_session'))).resolves.toBeNull();
  expectNoBrowserErrors(errors);
});

test('registration persists the local user and user session', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.goto('/register');
  await page.getByLabel('Display name').fill('Ada Writer');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password', { exact: true }).fill('password');
  await page.getByLabel('Confirm password').fill('password');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('heading', { name: 'All blogs' })).toBeVisible();
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_users'))[0])).resolves.toMatchObject({
    displayName: 'Ada Writer', username: 'ada', role: 'user',
  });
  await expect(page.evaluate(() => JSON.parse(window.localStorage.getItem('writespace_session')))).resolves.toMatchObject({
    username: 'ada', displayName: 'Ada Writer', role: 'user',
  });
  expectNoBrowserErrors(errors);
});

test('a guest is redirected when their initial navigation targets a protected path', async ({ page }) => {
  const errors = captureBrowserErrors(page);

  await page.goto('/write');

  await expect(page).toHaveURL(/\/login$/);
  expectNoBrowserErrors(errors);
});

test('a non-admin initial admin entry redirects to blogs and logout clears the session', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.addInitScript(() => {
    window.localStorage.setItem('writespace_session', JSON.stringify({
      userId: 'reader', username: 'reader', displayName: 'Reader', role: 'user',
    }));
  });

  await page.goto('/admin');

  await expect(page).toHaveURL(/\/blogs$/);
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('menuitem', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.evaluate(() => window.localStorage.getItem('writespace_session'))).resolves.toBeNull();
  expectNoBrowserErrors(errors);
});
