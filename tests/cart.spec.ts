import { test, expect } from '@playwright/test';

// The cart lives in an in-memory Svelte store, so a full page navigation (goto)
// would reset it. Reach /cart by clicking the header link, which the SvelteKit
// router handles client-side and therefore keeps the store intact.
test.describe('cart', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shops/1');

		// SvelteKit injects #svelte-announcer only once the client app has
		// hydrated. Clicking before that point is a no-op, because the button's
		// handler is not attached yet.
		await expect(page.locator('#svelte-announcer')).toBeAttached();

		// Add "Placeholder Product A" to the cart
		const productCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Placeholder Product A', level: 4 }) });
		await productCard.getByRole('button', { name: 'Add to cart' }).click();

		await expect(page.locator('.badge')).toHaveText('1');

		await page.getByRole('link', { name: 'Cart' }).click();
		await expect(page).toHaveURL(/\/cart$/);
	});

	test('shows the added product with its shop, subtotal and total', async ({ page }) => {
		await expect(page.locator('.badge')).toHaveText('1');

		await expect(page.locator('.name')).toContainText('Placeholder Product A');
		await expect(page.locator('.shop')).toContainText('Placeholder Shop 1');
		await expect(page.locator('.subtotal')).toContainText('$19.99');
		await expect(page.locator('.total')).toContainText('$19.99');
	});

	test('recalculates on a quantity change and empties when the item is removed', async ({ page }) => {
		await page.getByRole('button', { name: 'Increase quantity' }).click();

		await expect(page.locator('.qty')).toHaveText('2');
		await expect(page.locator('.subtotal')).toContainText('$39.98');
		await expect(page.locator('.badge')).toHaveText('2');

		await page.getByRole('button', { name: 'Remove' }).click();

		await expect(page.getByText('Your cart is empty.')).toBeVisible();
		await expect(page.locator('.badge')).toHaveCount(0);
	});
});
