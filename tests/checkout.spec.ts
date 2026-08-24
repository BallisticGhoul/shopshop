import { test, expect } from '@playwright/test';

// Edge case: visiting /checkout with an empty cart shows "Nothing in your cart"
test('checkout with empty cart shows empty-cart message', async ({ page }) => {
	// Navigate directly without adding anything to cart
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

// Happy path: full checkout flow (add item → fill details → place order → see confirmation)
test('checkout with cart item succeeds and shows order confirmation', async ({ page }) => {
	// Add an item to cart first
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();

	// Go to checkout
	await page.goto('/checkout');
	await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

	// Fill in customer details
	await page.locator('input[name="name"]').fill('Jane Tester');
	await page.locator('input[name="address"]').fill('42 Example Road');

	// Submit the order
	await page.getByRole('button', { name: 'Place order' }).click();

	// Confirmation screen
	await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
	await expect(page.getByText('Jane Tester')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Back to browsing' })).toBeVisible();
});

// Edge case: Place order button is disabled while name or address is empty
test('place order button is disabled when name or address is blank', async ({ page }) => {
	await page.goto('/shops/1');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await page.goto('/checkout');

	const submitBtn = page.getByRole('button', { name: 'Place order' });

	// Both fields empty — button must be disabled
	await expect(submitBtn).toBeDisabled();

	// Fill only name — still disabled
	await page.locator('input[name="name"]').fill('Jane Tester');
	await expect(submitBtn).toBeDisabled();

	// Fill address too — now enabled
	await page.locator('input[name="address"]').fill('42 Example Road');
	await expect(submitBtn).toBeEnabled();
});
