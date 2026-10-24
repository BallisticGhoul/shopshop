import { test, expect } from '@playwright/test';

/**
 * Shop page — migrated from cypress/e2e/shop.cy.ts.
 *
 * Runs in the authenticated project. Only shop 1 has products in the seeded
 * catalogue, so all assertions target /shops/1.
 */

test('lists the shop products and disables Add to cart for sold-out stock', async ({ page }) => {
	await page.goto('/shops/1');

	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	await expect(page.locator('.card')).toHaveCount(3);

	// Product A has stock — button must be enabled.
	const productA = page.locator('.card', { hasText: 'Placeholder Product A' });
	await expect(productA.locator('.price', { hasText: '$19.99' })).toBeVisible();
	await expect(productA.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

	// Product B has stock 0 — button must be disabled and "Sold out" shown.
	const productB = page.locator('.card', { hasText: 'Placeholder Product B' });
	await expect(productB.getByText('Sold out')).toBeVisible();
	await expect(productB.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
});
