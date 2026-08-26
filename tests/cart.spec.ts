import { test, expect } from '@playwright/test';

// ── Cart regression tests ─────────────────────────────────────────────────────

test('empty cart shows empty state message and browse link', async ({ page }) => {
	// Happy path: visiting /cart with no items must display a helpful empty state.
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('checkout page with empty cart shows empty state instead of form', async ({ page }) => {
	// Edge case: navigating directly to /checkout with an empty cart must not
	// show the checkout form — the app should guard against empty-cart checkout.
	await page.goto('/checkout');
	// Either redirect away or show an empty/guard message — no "Place order" button.
	const placeOrderButton = page.getByRole('button', { name: 'Place order' });
	await expect(placeOrderButton).not.toBeVisible();
});
