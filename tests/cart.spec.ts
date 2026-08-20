import { test, expect } from '@playwright/test';

// Regression: Cart page (/cart) — empty state, item interactions, and
// subtotal / total calculations.

test('cart page shows empty state message when no items', async ({ page }) => {
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});

test('cart page has link back to browse when empty', async ({ page }) => {
	await page.goto('/cart');
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('added product appears in cart with correct price', async ({ page }) => {
	// Add Placeholder Product A ($19.99) to cart from the shop page
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await expect(page.getByRole('button', { name: 'Add to cart' }).first()).toHaveText('Added!');

	// Navigate to cart
	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	await expect(page.getByText('$19.99')).toBeVisible();
});

test('remove button removes item from cart', async ({ page }) => {
	// Add an item first
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();

	// Click the remove (✕) button
	await page.getByRole('button', { name: 'Remove' }).click();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});

test('cart shows Proceed to checkout button when items are present', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	await page.goto('/cart');
	await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
});
