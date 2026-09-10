import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Browse — Pagination
// ---------------------------------------------------------------------------

test('browse page pagination navigates to page 2 via Next link', async ({ page }) => {
	// Happy path: "Next →" button advances pagination and updates the URL
	await page.goto('/browse');
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();

	const nextLink = page.getByRole('link', { name: /next/i });
	await expect(nextLink).toBeVisible();
	await nextLink.click();
	await page.waitForURL(/[?&]page=2/);
	await expect(page).toHaveURL(/[?&]page=2/);
});

test('browse search with no matching results shows no shop cards', async ({ page }) => {
	// Negative: a query that matches nothing should result in an empty listing
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('zzz_no_match_xyz_1234567890');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL(/[?&]q=/);

	// No "Visit shop →" cards should appear in results
	await expect(page.getByRole('link', { name: 'Visit shop →' })).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Browse — Shop Detail
// ---------------------------------------------------------------------------

test('clicking a shop card navigates to the shop detail page', async ({ page }) => {
	// Happy path: shop card link leads to a /shops/<id> URL with the shop name
	await page.goto('/browse');
	const firstShopLink = page.getByRole('link', { name: 'Visit shop →' }).first();
	await firstShopLink.click();
	await page.waitForURL(/\/shops\//);
	// The detail page should render a heading (shop name)
	await expect(page.locator('h1')).toBeVisible();
	// Back-navigation link must be present
	await expect(page.getByRole('link', { name: /back/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Navigation — Home & header links
// ---------------------------------------------------------------------------

test('homepage renders primary call-to-action links', async ({ page }) => {
	// Happy path: the landing page exposes Browse, Log In, and Create a Shop CTA buttons
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toBeVisible();
});

test('unauthenticated user is redirected to login when accessing dashboard', async ({ page }) => {
	// Negative: accessing a protected route without a session must redirect to /login
	await page.goto('/dashboard');
	// The layout guard should redirect unauthenticated visitors to the login page
	await expect(page).toHaveURL(/\/login/);
});
