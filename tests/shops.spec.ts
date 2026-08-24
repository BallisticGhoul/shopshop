import { test, expect } from '@playwright/test';

// Happy path: visiting a valid shop page shows name, description, and products
test('shop detail page shows shop info and products', async ({ page }) => {
	await page.goto('/shops/1');
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	// Shop 1 has products in mock data
	await expect(page.getByText('Placeholder Product A')).toBeVisible();
});

// Negative: visiting a non-existent shop ID returns a 404 error
test('shop detail page returns 404 for non-existent shop ID', async ({ page }) => {
	const response = await page.goto('/shops/9999999');
	// SvelteKit throws error(404) — page title or body should reflect this
	expect(response?.status()).toBe(404);
});

// Edge case: search query with no matching results shows no shop cards
test('search with no matching results shows no shop listings', async ({ page }) => {
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('zzz_no_match_xyz_12345');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=zzz_no_match_xyz_12345');
	// None of the placeholder shops should appear
	await expect(page.getByText('Placeholder Shop 1')).not.toBeVisible();
});

// Negative: accessing /dashboard without being logged in redirects to /login
test('dashboard redirects unauthenticated users to login', async ({ page }) => {
	// Fresh context — no session cookie
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/login/);
	// The redirect URL should include the original destination
	await expect(page).toHaveURL(/redirect=%2Fdashboard/);
});
