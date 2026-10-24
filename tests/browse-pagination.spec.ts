import { test, expect } from '@playwright/test';

// Tests for browse page pagination — the app seeds 12 shops with PAGE_SIZE=9,
// so page 2 should always exist and is a critical navigation path.

test('browse page 1 shows up to 9 shops and pagination controls', async ({ page }) => {
	await page.goto('/browse');
	// 12 mock shops → 2 pages; pagination bar should be visible
	await expect(page.getByRole('link', { name: 'Next →' })).toBeVisible();
	// Page 1 shops are visible
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
});

test('browse page 2 loads via pagination Next link', async ({ page }) => {
	await page.goto('/browse');
	await page.getByRole('link', { name: 'Next →' }).first().click();
	await expect(page).toHaveURL(/page=2/);
	// Shops on page 2 (shops 10–12 given PAGE_SIZE=9)
	await expect(page.getByText('Placeholder Shop 10')).toBeVisible();
});

test('browse page shows search results count meta text', async ({ page }) => {
	await page.goto('/browse?q=Placeholder');
	// All 12 shops match "Placeholder"; meta should say "12 results"
	await expect(page.getByText(/12 results/)).toBeVisible();
});

test('browse search with no results shows empty state message', async ({ page }) => {
	await page.goto('/browse?q=xyznonexistent');
	await expect(page.getByText(/No shops or products matched/)).toBeVisible();
});
