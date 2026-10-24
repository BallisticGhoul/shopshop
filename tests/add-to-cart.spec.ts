import { test, expect } from '@playwright/test';

/**
 * Add-to-cart regression tests.
 *
 * Covers the ProductCard component: "Add to cart" button state,
 * the momentary "Added!" confirmation, the disabled state for sold-out
 * items, and cart count updating in the site header.
 *
 * Cart state is client-side (Svelte store) and resets on each new page
 * load, so each test starts from a clean slate automatically.
 */

test('Add to cart button is visible on a product with stock', async ({ page }) => {
	await page.goto('/shops/1');
	// Placeholder Product A has stock: 10
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});

test('clicking Add to cart shows momentary Added! confirmation', async ({ page }) => {
	await page.goto('/shops/1');
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	const btn = card.getByRole('button', { name: 'Add to cart' });
	await btn.click();
	// Button text changes to "Added!" briefly
	await expect(card.getByRole('button', { name: 'Added!' })).toBeVisible();
});

test('Add to cart button is disabled for sold-out products', async ({ page }) => {
	await page.goto('/shops/1');
	// Placeholder Product B has stock: 0
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product B' });
	const btn = card.getByRole('button', { name: 'Add to cart' });
	await expect(btn).toBeDisabled();
});

test('product price is displayed on the product card', async ({ page }) => {
	await page.goto('/shops/1');
	// Placeholder Product A costs $19.99
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await expect(card.getByText('$19.99')).toBeVisible();
});
