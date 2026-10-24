import { test, expect } from '@playwright/test';

/**
 * Dashboard access — migrated from cypress/e2e/dashboard.cy.ts.
 *
 * Runs in the chromium-anon project (*.anon.spec.ts) so the browser starts
 * without a session cookie, matching the anonymous-visitor scenario.
 */

test('redirects an anonymous visitor to the login page with a redirect-back param', async ({
	page
}) => {
	await page.context().clearCookies();
	await page.goto('/dashboard');

	await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
