import { test, expect } from '@playwright/test';

// Tests for the checkout page (/checkout) — the final and highest-risk step
// in the purchase funnel. Regressions here directly impact conversion.

test('checkout page shows empty state when cart is empty', async ({ page }) => {
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('checkout page renders form with Name and Shipping address fields when cart has items', async ({ page }) => {
	// Seed the cart by visiting shop 1 and adding a product
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/checkout');
	await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
	await expect(page.getByLabel('Name')).toBeVisible();
	await expect(page.getByLabel('Shipping address')).toBeVisible();
});

test('checkout Place order button is disabled until name and address are filled', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/checkout');
	const placeOrderBtn = page.getByRole('button', { name: 'Place order' });
	// Both fields empty → button disabled
	await expect(placeOrderBtn).toBeDisabled();
	// Fill only name
	await page.getByLabel('Name').fill('Test User');
	await expect(placeOrderBtn).toBeDisabled();
	// Fill address too
	await page.getByLabel('Shipping address').fill('123 Test Street');
	await expect(placeOrderBtn).toBeEnabled();
});

test('checkout shows order placed success screen after submitting valid details', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/checkout');
	await page.getByLabel('Name').fill('Test User');
	await page.getByLabel('Shipping address').fill('123 Test Street');
	await page.getByRole('button', { name: 'Place order' }).click();
	await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
	await expect(page.getByText('Test User')).toBeVisible();
});
