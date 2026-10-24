import { test, expect } from '@playwright/test';

// Regression: Checkout page (/checkout).
// Covers the empty-cart guard, disabled submit while fields are blank,
// and the success confirmation after a valid order.

test('checkout page shows empty-cart message when no items', async ({ page }) => {
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('checkout Place order button is disabled until name and address are filled', async ({ page }) => {
	// Add a product to cart first
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	await page.goto('/checkout');
	const placeOrderBtn = page.getByRole('button', { name: 'Place order' });

	// Button should be disabled when fields are empty
	await expect(placeOrderBtn).toBeDisabled();

	// Fill in name only — still disabled
	await page.getByLabel('Name').fill('Jane Doe');
	await expect(placeOrderBtn).toBeDisabled();

	// Fill in address too — should become enabled
	await page.getByLabel('Shipping address').fill('42 Example Street');
	await expect(placeOrderBtn).toBeEnabled();
});

test('checkout shows order confirmation after valid submission', async ({ page }) => {
	// Add a product to cart
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	await page.goto('/checkout');
	await page.getByLabel('Name').fill('Jane Doe');
	await page.getByLabel('Shipping address').fill('42 Example Street');
	await page.getByRole('button', { name: 'Place order' }).click();

	// Success state: "Order placed!" heading and customer name
	await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
	await expect(page.getByText('Jane Doe')).toBeVisible();
});
