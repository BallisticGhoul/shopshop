import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

test('checkout page with empty cart shows empty-state and browse link', async ({ page }) => {
	// Edge-case: navigating directly to /checkout with no cart items must not
	// display the checkout form — it should show an empty-state message instead.
	await page.goto('/checkout');
	await expect(page.getByText('Nothing in your cart.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
	// The "Place order" button must not be visible
	await expect(page.getByRole('button', { name: 'Place order' })).not.toBeVisible();
});

test('checkout page title is correct', async ({ page }) => {
	// Happy path: basic page metadata check
	await page.goto('/checkout');
	await expect(page).toHaveTitle(/Checkout — ShopShop/);
});

test('dashboard redirects unauthenticated users to login', async ({ page }) => {
	// Security/negative: protected routes must redirect to /login when there is
	// no active session, preventing unauthorised access to the dashboard.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
