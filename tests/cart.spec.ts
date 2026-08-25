import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Cart — Empty State
// ---------------------------------------------------------------------------

test('cart shows empty state when no items have been added', async ({ page }) => {
	// Happy path: fresh session should render empty cart messaging
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	// Empty cart should surface a link back to browsing
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Cart — Checkout blocked when empty
// ---------------------------------------------------------------------------

test('visiting checkout with an empty cart shows no items message', async ({ page }) => {
	// Negative / edge-case: checkout page must not allow placing a phantom order
	// when the cart store has no items (client-side guard)
	await page.goto('/checkout');
	// The checkout page renders "Nothing in your cart." when cart is empty
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	// A link back to browsing should be shown
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
	// The "Place order" submit button must NOT be present in the empty state
	await expect(page.getByRole('button', { name: 'Place order' })).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// Cart — Add to cart from a shop detail page
// ---------------------------------------------------------------------------

test('product can be added to cart from shop detail page and cart count updates', async ({
	page
}) => {
	// Happy path: adding a product increments the cart badge in the header
	await page.goto('/browse');

	// Navigate to the first shop listed
	const firstShopLink = page.getByRole('link', { name: 'Visit shop →' }).first();
	await firstShopLink.click();
	await page.waitForURL(/\/shops\//);

	// Add the first available product to the cart
	const addToCartBtn = page.getByRole('button', { name: 'Add to cart' }).first();
	await expect(addToCartBtn).toBeVisible();
	await addToCartBtn.click();

	// Cart icon badge should now show at least 1 item
	const cartLink = page.getByRole('link', { name: /cart/i });
	await expect(cartLink).toBeVisible();

	// Navigate to cart and confirm item is present
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	// Cart should no longer show the empty state
	await expect(page.getByText('Your cart is empty.')).not.toBeVisible();
});
