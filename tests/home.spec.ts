import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the main heading and tagline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
    await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
  });

  test('header navigation links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Browse' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ShopShop' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
  });

  test('Browse Shops CTA navigates to /browse', async ({ page }) => {
    await page.getByRole('link', { name: 'Browse Shops' }).click();
    await expect(page).toHaveURL('/browse');
  });

  test('Log In CTA navigates to /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Log In' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('Create a Shop CTA redirects unauthenticated users to /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Create a Shop' }).click();
    // Unauthenticated users should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
