import { test, expect } from '@playwright/test';

// Checkout — the final step of the purchase funnel. Any regression here directly
// prevents order completion. Covers form validation, disabled state, success
// confirmation, and empty-cart guard.

test.describe('Checkout', () => {
	test('shows empty cart message when visiting /checkout with no items', async ({ page }) => {
		await page.goto('/checkout');
		await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	});

	test('renders the checkout form with name and address fields', async ({ page }) => {
		// Seed the cart first
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/checkout');

		await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
		await expect(page.locator('input[name="name"]')).toBeVisible();
		await expect(page.locator('input[name="address"]')).toBeVisible();
	});

	test('Place order button is disabled when name or address is empty', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/checkout');

		// Both fields empty → button disabled
		await expect(page.getByRole('button', { name: 'Place order' })).toBeDisabled();

		// Fill only name → still disabled
		await page.locator('input[name="name"]').fill('Jane Doe');
		await expect(page.getByRole('button', { name: 'Place order' })).toBeDisabled();
	});

	test('Place order button is enabled when both fields are filled', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/checkout');

		await page.locator('input[name="name"]').fill('Jane Doe');
		await page.locator('input[name="address"]').fill('123 Test Street');
		await expect(page.getByRole('button', { name: 'Place order' })).toBeEnabled();
	});

	test('shows order summary with items and total on checkout page', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/checkout');

		await expect(page.getByRole('heading', { name: 'Order summary' })).toBeVisible();
		await expect(page.getByText('Placeholder Product A')).toBeVisible();
	});

	test('submitting the checkout form shows the order placed confirmation', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/checkout');

		await page.locator('input[name="name"]').fill('Jane Doe');
		await page.locator('input[name="address"]').fill('123 Test Street');
		await page.getByRole('button', { name: 'Place order' }).click();

		await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
		await expect(page.getByText('Jane Doe')).toBeVisible();
	});
});
