import { test, expect } from '@playwright/test';

// Tests for the cart page (/cart) — a key step in the purchase funnel.

test('cart page shows empty state when no items in cart', async ({ page }) => {
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});

test('cart page shows item after adding a product from a shop', async ({ page }) => {
	// Add a product from shop 1 first
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	// Navigate to cart
	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
});

test('cart page shows Proceed to checkout button when cart has items', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/cart');
	await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
});

test('cart page allows removing an item', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/cart');
	// Remove the item using the Remove button
	await page.getByRole('button', { name: 'Remove' }).click();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});
