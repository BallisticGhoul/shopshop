import { test, expect } from '@playwright/test';

// Regression: The dashboard (/dashboard) and shop-management routes are
// protected.  Unauthenticated requests must be redirected to /login.

test('unauthenticated visit to /dashboard redirects to /login', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});

test('unauthenticated visit to /dashboard/shop/new redirects to /login', async ({ page }) => {
	await page.goto('/dashboard/shop/new');
	await expect(page).toHaveURL(/\/login/);
});
