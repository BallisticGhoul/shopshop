import { test, expect } from '@playwright/test';

// ── Cart ───────────────────────────────────────────────────────────────────

test('empty cart shows empty state message and browse link', async ({ page }) => {
	// Edge case: visiting /cart with nothing in the cart must show a clear empty state
	// and a helpful link back to browsing — not a crash or blank page
	await page.goto('/cart');
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
});

test('empty cart empty-state browse link navigates to /browse', async ({ page }) => {
	// Happy path: the "Browse shops" link from an empty cart must land on /browse
	await page.goto('/cart');
	await page.getByRole('link', { name: 'Browse shops' }).click();
	await expect(page).toHaveURL(/\/browse/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});
