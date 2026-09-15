import { expect, test } from '@playwright/test';

function captureBrowserErrors(page) {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
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

test('admin manages dashboard posts and local accounts while protected accounts remain undeletable', async ({ page }) => {
  const errors = captureBrowserErrors(page);
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'WriteSpace overview' })).toBeVisible();
  await expect(page.getByText('Total Posts')).toBeVisible();
  await expect(page.getByText('Total Users', { exact: true })).toBeVisible();
  await expect(page.getByText('Total Admins')).toBeVisible();
  await expect(page.getByText('Total users (non-admin)')).toBeVisible();

  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByLabel('Display name').fill('Governed Writer');
  await page.getByLabel('Username').fill('governed');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.getByText('Governed Writer was created.')).toBeVisible();
  await expect(page.getByText('Governed Writer', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Delete' }).first()).toHaveAttribute('title', 'Default admin cannot be deleted.');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).last().click();
  await expect(page.getByText('Governed Writer was deleted.')).toBeVisible();
  await expect(page.getByText('Governed Writer', { exact: true })).toHaveCount(0);

  await page.evaluate(() => window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'latest', title: 'Admin removable', authorName: 'Admin', createdAt: '2024-04-01T00:00:00.000Z' }])));
  await page.getByRole('link', { name: 'WriteSpace' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No posts have been published yet.')).toBeVisible();
  expect(errors).toEqual([]);
});
