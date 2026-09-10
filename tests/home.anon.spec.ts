import { test, expect } from '@playwright/test';

/**
 * Home page — migrated from cypress/e2e/home.cy.ts.
 *
 * Runs in the chromium-anon project (*.anon.spec.ts) because the test
 * validates the logged-out hero view, which must not be obscured by an
 * authenticated session.
 */

test('shows the hero with logged-out actions and links through to browse', async ({ page }) => {
	await page.context().clearCookies();
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1 })).toContainText('ShopShop');
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();

	// Verify the CTA links target the correct paths.
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toHaveAttribute(
		'href',
		'/browse'
	);
	await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toHaveAttribute(
		'href',
		'/dashboard/shop/new'
	);

	// Clicking Browse Shops navigates to the browse page.
	await page.getByRole('link', { name: 'Browse Shops' }).click();
	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});
