import { test, expect } from '@playwright/test';

/**
 * Unauthenticated dashboard access.
 * Runs in the chromium-anon project (no storageState) so the browser
 * truly has no session when it visits /dashboard.
 */

test('redirects an anonymous visitor to the login page with a redirect back', async ({ page }) => {
	await page.goto('/dashboard');

	await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
