import { test, expect } from '@playwright/test';

// Cart — a high-risk transactional page. Regressions here directly block
// users from completing purchases. Covers empty state, item management, and
// navigation to checkout.

test.describe('Cart', () => {
	test('shows empty state when cart has no items', async ({ page }) => {
		await page.goto('/cart');
		await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
		await expect(page.getByText('Your cart is empty.')).toBeVisible();
	});

	test('empty cart shows a link back to browse', async ({ page }) => {
		await page.goto('/cart');
		await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
	});

	test('shows cart items and subtotal after adding a product', async ({ page }) => {
		// Add a product to the cart via the shop page, then visit the cart
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/cart');

		await expect(page.getByText('Placeholder Product A')).toBeVisible();
		// Subtotal for qty 1 at $19.99
		await expect(page.getByText('$19.99')).toBeVisible();
	});

	test('can increase item quantity', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/cart');

		await page.getByRole('button', { name: 'Increase quantity' }).click();
		// Quantity should now be 2
		await expect(page.locator('.qty')).toHaveText('2');
	});

	test('can remove an item from the cart', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/cart');

		await page.getByRole('button', { name: 'Remove' }).click();
		// Cart should be empty again
		await expect(page.getByText('Your cart is empty.')).toBeVisible();
	});

	test('Proceed to checkout button links to /checkout', async ({ page }) => {
		await page.goto('/shops/1');
		await page.locator('.card').filter({ hasText: 'Placeholder Product A' }).getByRole('button', { name: 'Add to cart' }).click();
		await page.goto('/cart');

		await page.getByRole('link', { name: 'Proceed to checkout' }).click();
		await expect(page).toHaveURL(/\/checkout/);
	});
});
