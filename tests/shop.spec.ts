import { test, expect } from '@playwright/test';

/**
 * Individual shop page — product listing and sold-out state.
 * Runs in the authenticated chromium project (storageState from auth.setup.ts).
 */

test.describe('shop page', () => {
	test('lists the shop products and disables Add to cart for sold-out stock', async ({ page }) => {
		await page.goto('/shops/1');

		await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();

		// The seeded shop has exactly 3 product cards.
		await expect(page.locator('.card')).toHaveCount(3);

		// Product A is in stock: price visible and button enabled.
		const productA = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
		await expect(productA.locator('.price').filter({ hasText: '$19.99' })).toBeVisible();
		await expect(productA.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

		// Product B has stock 0: sold-out label and disabled button.
		const productB = page.locator('.card').filter({ hasText: 'Placeholder Product B' });
		await expect(productB.getByText('Sold out')).toBeVisible();
		await expect(productB.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
	});
});
