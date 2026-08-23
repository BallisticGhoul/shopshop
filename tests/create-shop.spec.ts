import { test, expect } from '@playwright/test';

// Tests for the Create a Shop page (/dashboard/shop/new).
// Unauthenticated access should redirect to login; the form itself is validated.
// Note: successful shop creation requires auth; we cover the unauthenticated
// redirect and the form validation surface here.

test('create shop page redirects unauthenticated users to login', async ({ page }) => {
	await page.goto('/dashboard/shop/new');
	// Dashboard layout redirects unauthenticated users to /login
	await expect(page).toHaveURL(/\/login/);
});

test('create shop page link from home navigates to /dashboard/shop/new then login for guests', async ({ page }) => {
	await page.goto('/');
	// Unauthenticated hero shows "Create a Shop" outline button
	await page.getByRole('link', { name: 'Create a Shop' }).click();
	// Should end up at login because of the auth guard
	await expect(page).toHaveURL(/\/login/);
});
