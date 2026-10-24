import { test, expect } from '@playwright/test';

/**
 * Home page — migrated from cypress/e2e/home.cy.ts.
 *
 * Uses the .anon.spec.ts suffix because the test verifies the logged-out hero
 * UI (Log In / Browse Shops / Create a Shop links). It runs in the
 * chromium-anon project so no session cookie is present.
 */

test('shows the hero with logged-out actions and links through to browse', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('h1')).toContainText('ShopShop');
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();

	// Verify the three hero CTAs point to the right destinations.
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toHaveAttribute('href', '/browse');
	await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toHaveAttribute(
		'href',
		'/dashboard/shop/new'
	);

	// Following the Browse Shops link lands on the browse page.
	await page.getByRole('link', { name: 'Browse Shops' }).click();
	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});
