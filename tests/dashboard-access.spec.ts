import { test, expect } from '@playwright/test';

// ── Dashboard access-guard & homepage navigation tests ────────────────────────

test('unauthenticated access to /dashboard redirects to login', async ({ page }) => {
	// Edge case / security: protected routes must not be reachable without a session.
	await page.goto('/dashboard');
	// Should redirect to /login (possibly with ?redirect=/dashboard).
	await expect(page).toHaveURL(/\/login/);
});

test('unauthenticated access to /dashboard/shop/new redirects to login', async ({ page }) => {
	// Edge case / security: the shop-creation page must also be guarded.
	await page.goto('/dashboard/shop/new');
	await expect(page).toHaveURL(/\/login/);
});

test('homepage shows Browse Shops, Log In, and Create a Shop CTAs', async ({ page }) => {
	// Happy path: the landing page must surface all three primary call-to-action buttons.
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toBeVisible();
});
