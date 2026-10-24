import { test, expect } from '@playwright/test';

/**
 * Shop detail page regression tests.
 *
 * Shop 1 is seeded with three products via mock data (shop id "1").
 * This covers the banner, product grid, and sold-out badge rendering.
 */

test('shop detail page shows the shop name in the banner', async ({ page }) => {
	await page.goto('/shops/1');
	// The shop name appears as an h1 inside the banner overlay
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
});

test('shop detail page shows the shop description', async ({ page }) => {
	await page.goto('/shops/1');
	await expect(
		page.getByText('A placeholder shop for testing and development purposes.')
	).toBeVisible();
});

test('shop detail page lists products for a shop with products', async ({ page }) => {
	await page.goto('/shops/1');
	// Shop 1 has Placeholder Product A, B, and C in mock data
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	await expect(page.getByText('Placeholder Product B')).toBeVisible();
	await expect(page.getByText('Placeholder Product C')).toBeVisible();
});

test('sold-out badge is shown for products with zero stock', async ({ page }) => {
	await page.goto('/shops/1');
	// Placeholder Product B has stock: 0 in mock data
	await expect(page.getByText('Sold out')).toBeVisible();
});

test('shop detail page sets page title from the shop name', async ({ page }) => {
	await page.goto('/shops/1');
	await expect(page).toHaveTitle('Placeholder Shop 1 — ShopShop');
});

test('shop with no products shows empty-state message', async ({ page }) => {
	// Shop 2 has no products in mock data
	await page.goto('/shops/2');
	await expect(page.getByText('This shop has no products yet.')).toBeVisible();
});
