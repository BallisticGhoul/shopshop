import { test, expect } from '@playwright/test';

/**
 * The cart lives in an in-memory Svelte store, so a full page load would
 * reset it. Navigate to /cart by clicking the header link so that the
 * SvelteKit router handles it client-side and the store stays intact.
 *
 * Each test begins on /shops/1, waits for hydration, adds "Placeholder
 * Product A" to the cart, then navigates to /cart via the header icon.
 */

test.describe('cart', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shops/1');

		// SvelteKit hydration guard: the client app must have taken over before
		// we click anything, otherwise event handlers are not yet attached.
		await page.locator('html[data-hydrated]').waitFor();

		// Add Placeholder Product A to the cart.
		const productA = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
		await productA.getByRole('button', { name: 'Add to cart' }).click();

		// Confirm the badge updated before navigating away.
		await expect(page.locator('.badge')).toHaveText('1');

		// Navigate to the cart page via the header link (client-side routing
		// keeps the Svelte store intact).
		await page.getByRole('link', { name: 'Cart' }).click();
		await expect(page).toHaveURL(/\/cart$/);
	});

	test('shows the added product with its shop, subtotal and total', async ({ page }) => {
		// Badge should still reflect 1 item.
		await expect(page.locator('.badge')).toHaveText('1');

		// Product details visible in the cart.
		await expect(page.locator('.name').filter({ hasText: 'Placeholder Product A' })).toBeVisible();
		await expect(page.locator('.shop').filter({ hasText: 'Placeholder Shop 1' })).toBeVisible();
		await expect(page.locator('.subtotal').filter({ hasText: '$19.99' })).toBeVisible();
		await expect(page.locator('.total').filter({ hasText: '$19.99' })).toBeVisible();
	});

	test('recalculates on a quantity change and empties when the item is removed', async ({
		page
	}) => {
		// Increase quantity to 2 and verify the subtotal recalculates.
		await page.getByRole('button', { name: 'Increase quantity' }).click();

		await expect(page.locator('.qty')).toHaveText('2');
		await expect(page.locator('.subtotal').filter({ hasText: '$39.98' })).toBeVisible();
		await expect(page.locator('.badge')).toHaveText('2');

		// Remove the item and verify the cart becomes empty.
		await page.getByRole('button', { name: 'Remove' }).click();

		await expect(page.getByText('Your cart is empty.')).toBeVisible();
		await expect(page.locator('.badge')).toHaveCount(0);
	});
});
