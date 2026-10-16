import { test, expect } from '@playwright/test';

/**
 * Cart tests — migrated from cypress/e2e/cart.cy.ts.
 *
 * The cart lives in an in-memory Svelte store, so a full page load would
 * reset it. We navigate to /cart by clicking the header Cart link so the
 * SvelteKit client-side router keeps the store intact.
 *
 * These run in the authenticated (chromium) project: the store is attached
 * to the page session, not the account, but starting signed-in gives us a
 * stable browsing context without any auth redirects.
 */

test.beforeEach(async ({ page }) => {
	await page.goto('/shops/1');

	// Wait for SvelteKit to hydrate before interacting with reactive handlers.
	await page.locator('#svelte-announcer').waitFor();

	// Add "Placeholder Product A" to the cart.
	const productCard = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await productCard.getByRole('button', { name: 'Add to cart' }).click();

	// Confirm the badge updated before navigating away.
	await expect(page.locator('.badge')).toHaveText('1');

	// Navigate client-side so the in-memory store is preserved.
	await page.getByRole('link', { name: 'Cart' }).click();
	await expect(page).toHaveURL(/\/cart$/);
});

test('shows the added product with its shop, subtotal and total', async ({ page }) => {
	// Badge still shows 1 after client-side navigation.
	await expect(page.locator('.badge')).toHaveText('1');

	await expect(page.locator('.name')).toContainText('Placeholder Product A');
	await expect(page.locator('.shop')).toContainText('Placeholder Shop 1');
	await expect(page.locator('.subtotal')).toContainText('$19.99');
	await expect(page.locator('.total')).toContainText('$19.99');
});

test('recalculates on a quantity change and empties when the item is removed', async ({
	page
}) => {
	// Increase quantity by 1.
	await page.getByRole('button', { name: 'Increase quantity' }).click();

	await expect(page.locator('.qty')).toHaveText('2');
	await expect(page.locator('.subtotal')).toContainText('$39.98');
	await expect(page.locator('.badge')).toHaveText('2');

	// Remove the item entirely.
	await page.getByRole('button', { name: 'Remove' }).click();

	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.locator('.badge')).toHaveCount(0);
});
