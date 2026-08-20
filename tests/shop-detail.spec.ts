import { test, expect } from '@playwright/test';

// Regression: Individual shop page (/shops/[id]) renders the banner, shop
// name, description, and product grid.  Shop "1" has 3 mock products.

test('shop detail page shows shop name in banner', async ({ page }) => {
	await page.goto('/shops/1');
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	// Page title should reflect the shop name
	await expect(page).toHaveTitle(/Placeholder Shop 1/);
});

test('shop detail page lists products', async ({ page }) => {
	await page.goto('/shops/1');
	// Shop 1 has Placeholder Product A, B, and C
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	await expect(page.getByText('Placeholder Product B')).toBeVisible();
	await expect(page.getByText('Placeholder Product C')).toBeVisible();
});

test('shop card on browse page links to correct shop detail', async ({ page }) => {
	await page.goto('/browse');
	// Click the first shop card
	await page.locator('a.card').first().click();
	// Should land on a /shops/[id] URL
	await expect(page).toHaveURL(/\/shops\/\d+/);
});

test('out-of-stock product shows Sold out badge and disabled Add to cart button', async ({ page }) => {
	// Placeholder Product B has stock: 0
	await page.goto('/shops/1');
	const productB = page.getByText('Placeholder Product B').locator('..').locator('..');
	await expect(productB.getByText('Sold out')).toBeVisible();
	await expect(productB.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
});
