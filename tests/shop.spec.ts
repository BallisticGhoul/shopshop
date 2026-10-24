import { test, expect } from '@playwright/test';

test.describe('shop page', () => {
	test('lists the shop products and disables Add to cart for sold-out stock', async ({ page }) => {
		await page.goto('/shops/1');

		await expect(page.getByRole('heading', { name: 'Placeholder Shop 1', level: 1 })).toBeVisible();
		await expect(page.locator('.card')).toHaveCount(3);

		// Product A is in stock — price and button should be enabled
		const productA = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Placeholder Product A', level: 4 }) });
		await expect(productA.locator('.price')).toContainText('$19.99');
		await expect(productA.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

		// Product B has stock 0 — should show "Sold out" and a disabled button
		const productB = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Placeholder Product B', level: 4 }) });
		await expect(productB.getByText('Sold out')).toBeVisible();
		await expect(productB.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
	});
});
