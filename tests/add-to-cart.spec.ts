import { test, expect } from '@playwright/test';

// Tests for the Add to Cart interaction on the shop detail page.
// This is the primary commerce action and the highest-risk interactive flow.

test('add to cart button adds an in-stock product and shows Added! feedback', async ({ page }) => {
	await page.goto('/shops/1');
	// "Placeholder Product A" has stock: 10
	const addBtn = page.getByRole('button', { name: 'Add to cart' }).first();
	await expect(addBtn).toBeEnabled();
	await addBtn.click();
	// Button briefly shows "Added!" confirmation
	await expect(addBtn).toHaveText('Added!');
});

test('add to cart button is disabled for out-of-stock product', async ({ page }) => {
	await page.goto('/shops/1');
	// "Placeholder Product B" has stock: 0; its card shows "Sold out" and button is disabled
	const soldOutCard = page.locator('.card').filter({ hasText: 'Placeholder Product B' });
	const disabledBtn = soldOutCard.getByRole('button', { name: 'Add to cart' });
	await expect(disabledBtn).toBeDisabled();
});

test('cart count in header increments after adding a product', async ({ page }) => {
	await page.goto('/shops/1');
	// Add one item to cart
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	// The header should show a cart count of at least 1
	await expect(page.getByText('1')).toBeVisible();
});
