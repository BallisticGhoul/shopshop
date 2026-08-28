import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Homepage & Global Navigation
// ---------------------------------------------------------------------------

test('homepage renders main heading and call-to-action buttons', async ({ page }) => {
	// Happy path: the landing page must present the brand and primary CTAs
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
});

test('browse navigation link in header goes to browse page', async ({ page }) => {
	// Happy path: global nav "Browse" must always resolve to /browse
	await page.goto('/');
	await page.getByRole('link', { name: 'Browse' }).first().click();
	await expect(page).toHaveURL(/\/browse/);
});

test('search with no results shows empty or zero-match state', async ({ page }) => {
	// Edge-case: a query that should match nothing must not crash or show
	// arbitrary results — the page must still be functional.
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('zzznoresultsxxx9999');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=zzznoresultsxxx9999');
	// The browse page heading must still be visible (page is not broken)
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	// No shop cards from a nonsense query — "Placeholder Shop 1" must not appear
	await expect(page.getByText('Placeholder Shop 1')).not.toBeVisible();
});
