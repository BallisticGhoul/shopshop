import { test, expect } from '@playwright/test';

// Tests for global navigation (Header) — present on every page.
// Regressions here impact the entire app.

test('header shows ShopShop logo/brand link on browse page', async ({ page }) => {
	await page.goto('/browse');
	// Header should contain a link back to home with the brand name
	const homeLink = page.getByRole('link', { name: /ShopShop/i }).first();
	await expect(homeLink).toBeVisible();
	await homeLink.click();
	await expect(page).toHaveURL('/');
});

test('header shows Cart link that navigates to /cart', async ({ page }) => {
	await page.goto('/browse');
	await page.getByRole('link', { name: /cart/i }).click();
	await expect(page).toHaveURL(/\/cart/);
});

test('header shows Log In link for unauthenticated users', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
});

test('dashboard page redirects unauthenticated users to login', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
