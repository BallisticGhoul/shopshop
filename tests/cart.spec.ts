import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

test('empty cart shows empty-state message and browse link', async ({ page }) => {
	// Happy path: an empty cart must communicate clearly to the user
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	// The page should provide a path back to shopping
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('cart page is accessible via cart icon in the header', async ({ page }) => {
	// Happy path: the cart icon in the nav must link to /cart
	await page.goto('/');
	await page.getByRole('link', { name: 'Cart' }).click();
	await expect(page).toHaveURL(/\/cart/);
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
});

test('checkout link is not shown when cart is empty', async ({ page }) => {
	// Edge-case: "Proceed to checkout" button must not appear for an empty cart,
	// preventing users from reaching the checkout form with nothing to buy.
	await page.goto('/cart');
	await expect(page.getByRole('link', { name: /Proceed to checkout/i })).not.toBeVisible();
});
