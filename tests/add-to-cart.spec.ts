import { test, expect } from '@playwright/test';

// Regression: Adding a product to the cart via ProductCard.
// Covers the "Added!" flash feedback and the header cart counter incrementing.

test('Add to cart button flashes "Added!" confirmation', async ({ page }) => {
	await page.goto('/shops/1');

	// Placeholder Product A is in stock (stock: 10)
	const addBtn = page.getByRole('button', { name: 'Add to cart' }).first();
	await addBtn.click();

	// Button briefly shows "Added!"
	await expect(addBtn).toHaveText('Added!');
	// After ~1.2 s it reverts — just verify the flash happened
	await expect(addBtn).toHaveText('Add to cart', { timeout: 3000 });
});

test('cart item count in header increments after adding a product', async ({ page }) => {
	await page.goto('/shops/1');

	// Grab the header cart link / badge before adding anything
	const cartLink = page.getByRole('link', { name: /cart/i });

	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	// The cart link should now include a count indicator (e.g. "Cart (1)")
	await expect(cartLink).toContainText('1');
});
