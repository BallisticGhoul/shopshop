import { test, expect } from '@playwright/test';

/**
 * Shop page — migrated from cypress/e2e/shop.cy.ts.
 *
 * Verifies the product listing for a seeded shop, including the sold-out
 * disabled state for a product with stock 0.
 */

test('lists the shop products and disables Add to cart for sold-out stock', async ({ page }) => {
	await page.goto('/shops/1');

	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	await expect(page.locator('.card')).toHaveCount(3);

	// Product A is in stock — price visible and button enabled.
	const productA = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await expect(productA.locator('.price')).toContainText('$19.99');
	await expect(productA.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

	// Product B has stock 0 — sold-out label and disabled button.
	const productB = page.locator('.card').filter({ hasText: 'Placeholder Product B' });
	await expect(productB.getByText('Sold out')).toBeVisible();
	await expect(productB.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
});
