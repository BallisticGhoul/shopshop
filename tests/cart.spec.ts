import { test, expect } from '@playwright/test';

// Happy path: /cart shows empty state when no items added
test('cart page shows empty state when cart is empty', async ({ page }) => {
	await page.goto('/cart');
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

// Happy path: adding a product from a shop page appears in cart
test('adding a product to cart shows it on the cart page', async ({ page }) => {
	// Shop 1 has "Placeholder Product A" (stock: 10)
	await page.goto('/shops/1');
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();

	// Click the Add to cart button for the first product
	const addButton = page.getByRole('button', { name: 'Add to cart' }).first();
	await addButton.click();

	// Navigate to cart and verify the item is listed
	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	// The checkout link should now be present
	await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
});

// Edge case: quantity increase button is disabled when stock limit is reached
test('cart quantity increase is disabled at stock limit', async ({ page }) => {
	// Add Product A (stock: 10) to cart
	await page.goto('/shops/1');
	const addButton = page.getByRole('button', { name: 'Add to cart' }).first();
	await addButton.click();

	await page.goto('/cart');
	// Increase quantity to exactly 10 (stock maximum)
	const increaseBtn = page.getByRole('button', { name: 'Increase quantity' });
	for (let i = 0; i < 9; i++) {
		await increaseBtn.click();
	}
	// At stock=10, the + button should be disabled
	await expect(increaseBtn).toBeDisabled();
});

// Happy path: removing an item from cart reverts to empty state
test('removing the only cart item shows empty state', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();

	// Remove the item
	await page.getByRole('button', { name: 'Remove' }).click();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});
