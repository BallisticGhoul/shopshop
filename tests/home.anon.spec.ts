import { test, expect } from '@playwright/test';

/**
 * Home page smoke test — runs anonymously (chromium-anon project) because the
 * hero and CTA links shown here are the logged-out view of the landing page.
 */

test('shows the hero with logged-out actions and links through to browse', async ({ page }) => {
	await page.goto('/');

	// Hero heading and tagline.
	await expect(page.getByRole('heading', { name: /ShopShop/ })).toBeVisible();
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();

	// CTA links point at the correct destinations.
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
