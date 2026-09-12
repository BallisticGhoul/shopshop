import { test, expect } from '@playwright/test';

/**
 * Cart tests – migrated from cypress/e2e/cart.cy.ts.
 *
 * The cart lives in an in-memory Svelte store, so a full page load would reset
 * it. We add a product on the shop page, then navigate client-side to /cart via
 * the header link so the router keeps the store intact.
 */

test.describe('cart', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shops/1');

		// Wait for SvelteKit client hydration before interacting with buttons.
		// Prior to hydration the click handler is not attached and the add is a no-op.
		await page.locator('#svelte-announcer').waitFor();

		// Add "Placeholder Product A" to the cart.
		const productCard = page.locator('.card', { hasText: 'Placeholder Product A' });
		await productCard.getByRole('button', { name: 'Add to cart' }).click();

		// Confirm the badge incremented to 1.
		await expect(page.locator('.badge')).toHaveText('1');

		// Navigate to the cart via the header link (client-side navigation keeps the store).
		await page.getByRole('link', { name: 'Cart' }).click();
		await expect(page).toHaveURL(/\/cart$/);
	});

	test('shows the added product with its shop, subtotal and total', async ({ page }) => {
		await expect(page.locator('.badge')).toHaveText('1');

		await expect(page.locator('.name', { hasText: 'Placeholder Product A' })).toBeVisible();
		await expect(page.locator('.shop', { hasText: 'Placeholder Shop 1' })).toBeVisible();
		await expect(page.locator('.subtotal', { hasText: '$19.99' })).toBeVisible();
		await expect(page.locator('.total', { hasText: '$19.99' })).toBeVisible();
	});

	test('recalculates on a quantity change and empties when the item is removed', async ({
		page
	}) => {
		await page.getByRole('button', { name: 'Increase quantity' }).click();

		await expect(page.locator('.qty')).toHaveText('2');
		await expect(page.locator('.subtotal', { hasText: '$39.98' })).toBeVisible();
		await expect(page.locator('.badge')).toHaveText('2');

		await page.getByRole('button', { name: 'Remove' }).click();

		await expect(page.getByText('Your cart is empty.')).toBeVisible();
		await expect(page.locator('.badge')).toHaveCount(0);
	});
});
