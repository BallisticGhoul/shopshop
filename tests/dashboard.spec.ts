import { test, expect } from '@playwright/test';

// ── Dashboard ──────────────────────────────────────────────────────────────

test('unauthenticated user is redirected away from /dashboard', async ({ page }) => {
	// Negative / security: the dashboard must not be accessible without a session.
	// An unauthenticated visit should redirect to the login page (or home).
	await page.goto('/dashboard');
	// Should NOT stay on /dashboard
	await expect(page).not.toHaveURL(/\/dashboard/);
	// Likely lands on login — confirm the login form is present
	await expect(page.locator('input[name="username"]')).toBeVisible();
});
