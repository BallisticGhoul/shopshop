import { test, expect } from '@playwright/test';

/**
 * Cart page regression tests.
 *
 * The cart store is client-side (Svelte $state) and is empty on every
 * fresh page load. Tests that need items in the cart navigate to a shop
 * first to add them via the UI before proceeding to /cart.
 */

test('cart page shows empty state when cart has no items', async ({ page }) => {
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});

test('empty cart has a link back to browse', async ({ page }) => {
	await page.goto('/cart');
	const browseLink = page.getByRole('link', { name: 'Browse shops' });
	await expect(browseLink).toBeVisible();
});

test('cart page title is correct', async ({ page }) => {
	await page.goto('/cart');
	await expect(page).toHaveTitle('Cart — ShopShop');
});

test('adding a product and visiting cart shows the item', async ({ page }) => {
	// Add Placeholder Product A from shop 1
	await page.goto('/shops/1');
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await card.getByRole('button', { name: 'Add to cart' }).click();

	// Navigate to cart within the same browser context (same Svelte store)
	await page.goto('/cart');
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
});

test('cart shows correct subtotal for one item', async ({ page }) => {
	// Product A: $19.99 × 1 = $19.99
	await page.goto('/shops/1');
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await card.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/cart');
	// The subtotal and total should both show $19.99
	await expect(page.getByText('$19.99').first()).toBeVisible();
});

test('cart has Proceed to checkout button when items are present', async ({ page }) => {
	await page.goto('/shops/1');
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await card.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/cart');
	await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
});

test('removing an item from cart returns to empty state', async ({ page }) => {
	await page.goto('/shops/1');
	const card = page.locator('.card').filter({ hasText: 'Placeholder Product A' });
	await card.getByRole('button', { name: 'Add to cart' }).click();

	await page.goto('/cart');
	// Click the remove (✕) button for the item
	await page.getByRole('button', { name: 'Remove' }).click();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});
