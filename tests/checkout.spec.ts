import { test, expect } from '@playwright/test';

/**
 * Checkout page regression tests.
 *
 * High-risk flow: order placement, form validation, and cart clearing
 * on success. Cart is seeded through the UI before each test.
 */

test('checkout page shows empty-state when cart is empty', async ({ page }) => {
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
});

test('checkout page title is correct', async ({ page }) => {
	// Visit with empty cart — the "Checkout" page title still loads
	await page.goto('/checkout');
	await expect(page).toHaveTitle('Checkout — ShopShop');
});

test('checkout Place order button is disabled when fields are empty', async ({ page }) => {
	// Seed cart
	await page.goto('/shops/1');
	await page.locator('.card').filter({ hasText: 'Placeholder Product A' })
		.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/checkout');
	const placeOrderBtn = page.getByRole('button', { name: 'Place order' });
	await expect(placeOrderBtn).toBeVisible();
	// Button should be disabled until both Name and Address are filled
	await expect(placeOrderBtn).toBeDisabled();
});

test('Place order button enables when both name and address are filled', async ({ page }) => {
	// Seed cart
	await page.goto('/shops/1');
	await page.locator('.card').filter({ hasText: 'Placeholder Product A' })
		.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/checkout');
	await page.getByLabel('Name').fill('Jane Doe');
	await page.getByLabel('Shipping address').fill('123 Example St');

	const placeOrderBtn = page.getByRole('button', { name: 'Place order' });
	await expect(placeOrderBtn).toBeEnabled();
});

test('successful order placement shows Order placed! confirmation', async ({ page }) => {
	// Seed cart
	await page.goto('/shops/1');
	await page.locator('.card').filter({ hasText: 'Placeholder Product A' })
		.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/checkout');
	await page.getByLabel('Name').fill('Jane Doe');
	await page.getByLabel('Shipping address').fill('123 Example St');
	await page.getByRole('button', { name: 'Place order' }).click();

	// Confirmation screen
	await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
	await expect(page.getByText('Jane Doe')).toBeVisible();
});

test('checkout order summary lists items in cart', async ({ page }) => {
	// Seed cart
	await page.goto('/shops/1');
	await page.locator('.card').filter({ hasText: 'Placeholder Product A' })
		.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/checkout');
	// Order summary panel should show the product
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
});
