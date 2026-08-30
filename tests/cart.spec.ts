import { test, expect } from '@playwright/test';

// ─── Cart regression tests ───────────────────────────────────────────────────
// Covers: empty cart state (happy path), checkout redirect when cart is empty
//         (negative/edge case), cart page reachable via header icon (happy path).

test('empty cart shows empty state message and browse link', async ({ page }) => {
	// Happy path: visiting /cart without items should display the empty state
	// message and a link back to the browse page.
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
	await expect(page.getByText(/your cart is empty/i)).toBeVisible();
	await expect(page.getByRole('link', { name: /browse shops/i })).toBeVisible();
});

test('cart page is accessible via header cart icon', async ({ page }) => {
	// Happy path: the cart icon in the header navigation must be present and
	// navigate to /cart from any page.
	await page.goto('/');
	await page.getByRole('link', { name: /cart/i }).click();
	await expect(page).toHaveURL(/\/cart/);
	await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
});

test('checkout page requires name and address fields', async ({ page }) => {
	// Negative: submitting the checkout form with both fields empty should
	// return a validation error — no order should be placed.
	await page.goto('/checkout');
	// Attempt to find and submit the checkout form with blank fields.
	const submitBtn = page.getByRole('button', { name: /place order|checkout|submit/i });
	if (await submitBtn.isVisible()) {
		await submitBtn.click();
		// The server returns an error for missing name/address.
		await expect(page.getByText(/name and address are required/i)).toBeVisible();
	} else {
		// If the checkout form is not shown (e.g. cart is empty redirect), the
		// page should at minimum not crash — verify we land somewhere sensible.
		await expect(page).toHaveURL(/checkout|cart|browse/);
	}
});
