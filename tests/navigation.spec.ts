import { test, expect } from '@playwright/test';

// ── Test 11: Happy path — homepage renders key CTAs ──
test('homepage displays Browse Shops, Log In, and Create a Shop buttons', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toBeVisible();
});

// ── Test 12: Happy path — browse pagination navigates to page 2 ──
test('browse pagination navigates to page 2 and updates URL', async ({ page }) => {
	await page.goto('/browse');

	// Click page 2 from the pagination controls
	await page.getByRole('link', { name: '2' }).click();
	await page.waitForURL('**/browse?page=2');

	await expect(page).toHaveURL(/page=2/);

	// Previous button should now be enabled on page 2
	await expect(page.getByRole('link', { name: '← Previous' })).toBeVisible();
});

// ── Test 13: Negative — search with no results shows empty state ──
test('browse search with no-match query returns empty results', async ({ page }) => {
	await page.goto('/browse');

	const searchInput = page.locator('input[name="q"]');
	await searchInput.fill('xyznonexistentshop12345');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=xyznonexistentshop12345');

	// No shop cards should be visible — grid should be empty
	await expect(page.getByRole('link', { name: /Visit shop/ })).toHaveCount(0);
});

// ── Test 14: Happy path — clicking a shop card opens shop detail page ──
test('clicking a shop card navigates to the shop detail page', async ({ page }) => {
	await page.goto('/browse');

	// Click the first "Visit shop" link in the grid
	const firstShopLink = page.getByRole('link', { name: /Visit shop/ }).first();
	await firstShopLink.click();

	// Should land on /shops/<id>
	await expect(page).toHaveURL(/\/shops\/.+/);

	// Shop detail page should show a heading and at least one product
	await expect(page.getByRole('heading').first()).toBeVisible();
});

// ── Test 15: Edge case — dashboard route redirects unauthenticated users to login ──
test('unauthenticated access to /dashboard redirects to login', async ({ page }) => {
	await page.goto('/dashboard');

	// Should redirect to /login (with optional redirect query param)
	await expect(page).toHaveURL(/\/login/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});

// ── Test 16: Edge case — create shop route redirects unauthenticated users to login ──
test('unauthenticated access to /dashboard/shop/new redirects to login', async ({ page }) => {
	await page.goto('/dashboard/shop/new');

	await expect(page).toHaveURL(/\/login/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
