import { test, expect } from '@playwright/test';

// ── Test 8: Edge case — empty cart shows correct empty state ──
test('cart page shows empty state when no items are in cart', async ({ page }) => {
	// Navigate directly to cart with no items added
	await page.goto('/cart');

	// Heading should still show "Your cart"
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();

	// Empty state message and browse link
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();

	// "Proceed to checkout" should NOT be visible when cart is empty
	await expect(page.getByRole('link', { name: 'Proceed to checkout' })).not.toBeVisible();
});
