import { test, expect } from '@playwright/test';

// Dashboard — covers the /dashboard route.
// The route is protected: unauthenticated visitors are redirected to /login.
// The dashboard/shop/new page is also covered with a basic smoke test.

test.describe('Dashboard (unauthenticated)', () => {
	test('redirects unauthenticated users to /login', async ({ page }) => {
		await page.goto('/dashboard');
		// The server-side guard sends a 303 → /login
		await expect(page).toHaveURL(/\/login/);
	});

	test('/dashboard redirect to login carries a redirect param', async ({ page }) => {
		await page.goto('/dashboard');
		// After redirect the URL should be /login (with optional ?redirect query)
		await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	});
});

test.describe('Create-shop page (unauthenticated)', () => {
	test('unauthenticated visit to /dashboard/shop/new redirects to login', async ({ page }) => {
		await page.goto('/dashboard/shop/new');
		await expect(page).toHaveURL(/\/login/);
	});
});
