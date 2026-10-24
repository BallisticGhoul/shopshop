import { test, expect } from '@playwright/test';

// Navigation / header — the persistent nav bar is present on every page.
// A broken nav means users can't reach any area of the app and affects
// all flows. High-impact, low-effort checks.

test.describe('Navigation and header', () => {
	test('header is visible on the homepage', async ({ page }) => {
		await page.goto('/');
		// The header component should be present
		await expect(page.locator('header')).toBeVisible();
	});

	test('header is visible on the browse page', async ({ page }) => {
		await page.goto('/browse');
		await expect(page.locator('header')).toBeVisible();
	});

	test('header is visible on the login page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('header')).toBeVisible();
	});

	test('header is visible on the register page', async ({ page }) => {
		await page.goto('/register');
		await expect(page.locator('header')).toBeVisible();
	});

	test('clicking the ShopShop logo in the header navigates to /', async ({ page }) => {
		await page.goto('/browse');
		// The logo/brand link in the header points to root
		await page.locator('header').getByRole('link', { name: /ShopShop/i }).click();
		await expect(page).toHaveURL(/^\//);
	});
});
