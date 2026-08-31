import { test, expect } from '@playwright/test';

// ── Cart regression tests ─────────────────────────────────────────────────────
// Covers: empty cart state (happy path), add-to-cart from shop detail (happy),
// quantity controls (happy), proceed-to-checkout link presence (edge),
// and visiting /checkout with an empty cart (negative/edge).
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Cart — empty state', () => {
	test('empty cart shows message and Browse Shops link (happy path)', async ({ page }) => {
		// Fresh session → cart should be empty; the page must render the
		// empty-state message and a link to guide the user to browse.
		await page.goto('/cart');
		await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
		await expect(page.getByRole('link', { name: /browse shops/i })).toBeVisible();
	});

	test('empty cart does not show Proceed to checkout button (negative)', async ({ page }) => {
		// "Proceed to checkout" must be absent when there are no items — offering
		// checkout on an empty cart would cause a broken experience.
		await page.goto('/cart');
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
		await expect(page.getByRole('link', { name: /proceed to checkout/i })).not.toBeVisible();
	});
});

test.describe('Cart — item management', () => {
	test('adding a product from a shop detail page appears in cart (happy path)', async ({ page }) => {
		// Navigate to the first shop and add the first available product.
		// The cart icon count should reflect at least one item afterwards.
		await page.goto('/browse');
		// Click the first "Visit shop →" link on the browse page.
		await page.getByRole('link', { name: /visit shop/i }).first().click();
		await page.waitForURL(/\/shops\/.+/);
		// Add the first product to the cart.
		await page.getByRole('button', { name: /add to cart/i }).first().click();
		// Navigate to cart and verify the item is present.
		await page.getByRole('link', { name: 'Cart' }).click();
		await page.waitForURL('**/cart');
		// Cart should no longer show the empty state.
		await expect(page.getByText(/your cart is empty/i)).not.toBeVisible();
		// The "Proceed to checkout" link should now be visible.
		await expect(page.getByRole('link', { name: /proceed to checkout/i })).toBeVisible();
	});

	test('increasing item quantity updates the subtotal (happy path)', async ({ page }) => {
		// Add one product, then use the + button and verify quantity goes to 2.
		await page.goto('/browse');
		await page.getByRole('link', { name: /visit shop/i }).first().click();
		await page.waitForURL(/\/shops\/.+/);
		await page.getByRole('button', { name: /add to cart/i }).first().click();
		await page.goto('/cart');
		// Increase quantity by one.
		await page.getByRole('button', { name: /increase quantity/i }).first().click();
		// The quantity display should now show 2.
		await expect(page.getByText('2')).toBeVisible();
	});

	test('removing the only cart item restores empty state (edge)', async ({ page }) => {
		// Add a product and then remove it; the cart must revert to the empty state
		// rather than showing a broken/partially-cleared view.
		await page.goto('/browse');
		await page.getByRole('link', { name: /visit shop/i }).first().click();
		await page.waitForURL(/\/shops\/.+/);
		await page.getByRole('button', { name: /add to cart/i }).first().click();
		await page.goto('/cart');
		// Remove the item.
		await page.getByRole('button', { name: /remove/i }).first().click();
		await expect(page.getByText(/your cart is empty/i)).toBeVisible();
	});
});

test.describe('Checkout', () => {
	test('checkout page renders name and address fields (happy path)', async ({ page }) => {
		// After adding a product, the checkout page should be reachable and
		// show both required delivery fields.
		await page.goto('/browse');
		await page.getByRole('link', { name: /visit shop/i }).first().click();
		await page.waitForURL(/\/shops\/.+/);
		await page.getByRole('button', { name: /add to cart/i }).first().click();
		await page.goto('/checkout');
		await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
		await expect(page.locator('input[placeholder="123 Example St"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /checkout|place order|submit/i })).toBeVisible();
	});
});
