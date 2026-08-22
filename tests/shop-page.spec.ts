import { test, expect } from '@playwright/test';

// Shop detail page — the primary product-discovery surface. Users browse
// products here and add them to cart, making it one of the highest-traffic pages.

test.describe('Shop detail page', () => {
	test('displays the shop name and description in the banner', async ({ page }) => {
		// Shop 1 is seeded in mock data
		await page.goto('/shops/1');
		await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
		await expect(page.getByText('A placeholder shop for testing and development purposes.')).toBeVisible();
	});

	test('lists products for the shop', async ({ page }) => {
		await page.goto('/shops/1');
		// Shop 1 has three mock products
		await expect(page.getByText('Placeholder Product A')).toBeVisible();
		await expect(page.getByText('Placeholder Product B')).toBeVisible();
		await expect(page.getByText('Placeholder Product C')).toBeVisible();
	});

	test('shows Sold out badge on out-of-stock products', async ({ page }) => {
		// Product B (p1-2) has stock: 0
		await page.goto('/shops/1');
		await expect(page.getByText('Sold out')).toBeVisible();
	});

	test('Add to cart button is disabled for out-of-stock products', async ({ page }) => {
		await page.goto('/shops/1');
		// Find the card containing "Placeholder Product B" and check its button
		const productBCard = page.locator('.card').filter({ hasText: 'Placeholder Product B' });
		const addBtn = productBCard.getByRole('button', { name: 'Add to cart' });
		await expect(addBtn).toBeDisabled();
	});

	test('Add to cart button is enabled for in-stock products', async ({ page }) => {
		await page.goto('/shops/1');
		const productACard = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
		const addBtn = productACard.getByRole('button', { name: 'Add to cart' });
		await expect(addBtn).toBeEnabled();
	});

	test('clicking Add to cart shows Added! confirmation', async ({ page }) => {
		await page.goto('/shops/1');
		const productACard = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
		await productACard.getByRole('button', { name: 'Add to cart' }).click();
		await expect(productACard.getByRole('button', { name: 'Added!' })).toBeVisible();
	});
});
