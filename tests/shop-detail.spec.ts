import { test, expect } from '@playwright/test';

// Tests for the shop detail page (/shops/[id]) — the core product discovery surface.

test('shop detail page renders shop name and description in banner', async ({ page }) => {
	// Shop 1 is seeded via mockShops in development
	await page.goto('/shops/1');
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	await expect(page.getByText('A placeholder shop for testing and development purposes.')).toBeVisible();
});

test('shop detail page lists products for shop 1', async ({ page }) => {
	await page.goto('/shops/1');
	// Shop 1 has 3 mock products (A, B, C)
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	await expect(page.getByText('Placeholder Product B')).toBeVisible();
	await expect(page.getByText('Placeholder Product C')).toBeVisible();
});

test('shop detail page shows sold-out badge for out-of-stock product', async ({ page }) => {
	// Placeholder Product B has stock: 0 → should display "Sold out"
	await page.goto('/shops/1');
	await expect(page.getByText('Sold out')).toBeVisible();
});

test('shop detail page shows page title including shop name', async ({ page }) => {
	await page.goto('/shops/1');
	await expect(page).toHaveTitle(/Placeholder Shop 1/);
});
