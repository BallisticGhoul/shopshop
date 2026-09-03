import { test, expect } from '@playwright/test';

/**
 * These run in the authenticated project, so the browser starts with the
 * cookie jar saved by auth.setup.ts. No spec here touches the login form.
 */

test('reaches the dashboard without logging in', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/dashboard$/);
	await expect(page.getByRole('heading', { name: /^Welcome, / })).toBeVisible();
});

test('the restored cookie is the session cookie, and it is httpOnly', async ({ page }) => {
	await page.goto('/');
	const session = (await page.context().cookies()).find((c) => c.name === 'session');

	expect(session, 'storageState should carry a session cookie').toBeDefined();
	expect(session!.httpOnly).toBe(true);
	// The half-authenticated token must never be persisted alongside it.
	const pending = (await page.context().cookies()).find((c) => c.name === 'mfa_pending');
	expect(pending, 'a completed login should leave no pending-MFA cookie').toBeUndefined();
});

test('protected pages stay reachable across navigations', async ({ page }) => {
	await page.goto('/dashboard/security');
	await expect(page.getByTestId('totp-enabled')).toBeVisible();
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/dashboard$/);
});

test('discarding the cookie jar sends you back to the login form', async ({ page }) => {
	await page.context().clearCookies();
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
