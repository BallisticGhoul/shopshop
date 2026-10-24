import { test, expect } from '@playwright/test';

/**
 * Dashboard access — migrated from cypress/e2e/dashboard.cy.ts.
 *
 * Uses the .anon.spec.ts suffix so it runs without a storageState (signed out)
 * in the chromium-anon project, matching the original Cypress intent.
 */

test('redirects an anonymous visitor to the login page with a redirect back', async ({ page }) => {
	await page.goto('/dashboard');

	await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
