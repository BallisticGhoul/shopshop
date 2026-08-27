import { test, expect } from '@playwright/test';

// ─── Browse — advanced ────────────────────────────────────────────────────────

test('browse pagination shows Next button and navigates to page 2', async ({ page }) => {
	// Happy path: pagination controls work and URL updates correctly
	await page.goto('/browse');
	const nextBtn = page.getByRole('link', { name: 'Next →' });
	await expect(nextBtn).toBeVisible();
	await nextBtn.click();
	await expect(page).toHaveURL(/\/browse\?.*page=2/);
});

test('browse search with no matching term shows no results', async ({ page }) => {
	// Edge case: a nonsense search query should return an empty result set,
	// not crash or redirect — the browse page must still render.
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('xzqy_no_match_99999');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL(/\/browse\?q=xzqy_no_match_99999/);
	// Page heading must still be present
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	// No shop cards should be visible
	await expect(page.getByRole('link', { name: /Visit shop/i })).toHaveCount(0);
});

test('clicking a shop card navigates to the shop detail page', async ({ page }) => {
	// Happy path: shop cards are navigable links pointing to /shops/{id}
	await page.goto('/browse');
	const firstVisitLink = page.getByRole('link', { name: /Visit shop/i }).first();
	await expect(firstVisitLink).toBeVisible();
	await firstVisitLink.click();
	await expect(page).toHaveURL(/\/shops\//);
});

test('dashboard route redirects unauthenticated users to login', async ({ page }) => {
	// Negative / security: protected dashboard must not be accessible without a session
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
