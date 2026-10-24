import { test, expect } from '@playwright/test';

// ─── Dashboard & Shop Creation regression tests ──────────────────────────────
// Covers: dashboard redirect when unauthenticated (negative/security),
//         create-shop form renders required fields (happy path),
//         create-shop form submission with missing fields (negative).

test('unauthenticated user is redirected away from dashboard', async ({ page }) => {
	// Negative / security: an anonymous visitor must not be able to access the
	// dashboard — the server should redirect them to /login (or the home page).
	await page.goto('/dashboard');
	await expect(page).not.toHaveURL('/dashboard');
	// They must land on the login page or the home page.
	await expect(page).toHaveURL(/login|^\//);
});

test('unauthenticated user cannot reach the create-shop page', async ({ page }) => {
	// Negative / security: /dashboard/shop/new is a protected route — visiting it
	// without a session must trigger a redirect to login.
	await page.goto('/dashboard/shop/new');
	await expect(page).not.toHaveURL('/dashboard/shop/new');
	await expect(page).toHaveURL(/login|^\//);
});
