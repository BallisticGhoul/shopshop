import { test, expect } from '@playwright/test';

// Cart page — covers the /cart route.
// The cart state is managed client-side via a Svelte store, so
// a fresh session always starts with an empty cart.

test.describe('Cart page', () => {
	test('shows empty-cart message when cart is empty', async ({ page }) => {
		await page.goto('/cart');
		await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
		await expect(page.getByText('Your cart is empty.')).toBeVisible();
	});

	test('empty cart shows a link back to browse shops', async ({ page }) => {
		await page.goto('/cart');
		const link = page.getByRole('link', { name: 'Browse shops' });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', '/');
	});

	test('page title is "Cart — ShopShop"', async ({ page }) => {
		await page.goto('/cart');
		await expect(page).toHaveTitle('Cart — ShopShop');
	});
});
