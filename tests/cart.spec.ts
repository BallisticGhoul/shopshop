import { test, expect } from '@playwright/test';

// ─── Cart ─────────────────────────────────────────────────────────────────────

test('empty cart shows correct empty state message and browse link', async ({ page }) => {
	// Happy path: visiting /cart with no items shows the empty-state UI
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('checkout page shows empty state when cart is empty', async ({ page }) => {
	// Edge case: navigating to /checkout with no cart items must not show a
	// broken form — it should display the "nothing in cart" fallback UI.
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	// The "Place order" form must NOT be present
	await expect(page.getByRole('button', { name: 'Place order' })).not.toBeVisible();
});

test('cart icon in header is accessible from homepage', async ({ page }) => {
	// Happy path: cart link is always reachable from global nav
	await page.goto('/');
	const cartLink = page.getByRole('link', { name: 'Cart' });
	await expect(cartLink).toBeVisible();
	await cartLink.click();
	await expect(page).toHaveURL(/\/cart/);
});
