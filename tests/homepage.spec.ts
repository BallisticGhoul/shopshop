import { test, expect } from '@playwright/test';

// Regression: Homepage hero renders correctly for unauthenticated visitors
// and provides the expected navigation actions.

test('homepage shows ShopShop hero heading and tagline', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
});

test('homepage Browse Shops button navigates to /browse', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Browse Shops' }).click();
	await expect(page).toHaveURL(/\/browse/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});

test('homepage Log In button navigates to /login', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Log In' }).click();
	await expect(page).toHaveURL(/\/login/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
