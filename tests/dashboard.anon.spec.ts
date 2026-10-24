import { test, expect } from '@playwright/test';

/**
 * Dashboard anonymous-access behaviour – migrated from cypress/e2e/dashboard.cy.ts.
 *
 * Runs in the chromium-anon project (no storageState) so the browser starts
 * without a session, which is the precondition this test exercises.
 */

test('redirects an anonymous visitor to the login page with a redirect-back param', async ({
	page
}) => {
	await page.goto('/dashboard');

	await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
