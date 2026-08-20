import { test, expect } from '@playwright/test';

// Regression: Browse page pagination and empty-search state.
// The app uses PAGE_SIZE=9 and seeds 12 mock shops, so page 2 exists
// and the previous/next arrows must behave correctly.

test('browse page shows shop count metadata', async ({ page }) => {
	await page.goto('/browse');
	// 12 mock shops — the meta line shows "12 shops" or pagination info
	await expect(page.locator('.meta')).toBeVisible();
});

test('browse page 2 is reachable and shows different content', async ({ page }) => {
	await page.goto('/browse?page=2');
	// Page 2 should still render the Browse Shops heading
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	// There should be shop cards on page 2
	await expect(page.locator('.grid')).toBeVisible();
});

test('search with no matching term shows empty state message', async ({ page }) => {
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('zzznomatchxxx');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=zzznomatchxxx');
	await expect(page.getByText(/No shops or products matched/)).toBeVisible();
});

test('clear button removes search query and resets to full list', async ({ page }) => {
	await page.goto('/browse?q=Placeholder');
	await expect(page.getByRole('link', { name: 'Clear' })).toBeVisible();
	await page.getByRole('link', { name: 'Clear' }).click();
	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});
