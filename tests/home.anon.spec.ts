import { test, expect } from '@playwright/test';

/**
 * Home page – migrated from cypress/e2e/home.cy.ts.
 *
 * Runs in the chromium-anon project (no storageState) so the hero shows the
 * logged-out call-to-action links that this test asserts on.
 */

test('shows the hero with logged-out actions and links through to browse', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /ShopShop/ })).toBeVisible();
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();

	// Verify all three CTA links point to the right destinations.
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toHaveAttribute(
		'href',
		'/browse'
	);
	await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toHaveAttribute(
		'href',
		'/dashboard/shop/new'
	);

	// Clicking "Browse Shops" navigates to the browse page.
	await page.getByRole('link', { name: 'Browse Shops' }).click();
	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});
