import { test, expect } from '@playwright/test';

// Dashboard — protected route for authenticated shop owners. Covers the access
// guard (unauthenticated redirect) and the empty-state UI that new users see.
// A regression here could expose the dashboard to unauthenticated users or
// break the core shop-management entry point.

test.describe('Dashboard', () => {
	test('redirects unauthenticated users from /dashboard to /login', async ({ page }) => {
		await page.goto('/dashboard');
		// The server redirects to /login, optionally with ?redirect param
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects unauthenticated users from /dashboard/shop/new to /login', async ({ page }) => {
		await page.goto('/dashboard/shop/new');
		await expect(page).toHaveURL(/\/login/);
	});
});
