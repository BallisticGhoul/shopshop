import { test, expect } from '@playwright/test';

// ── Browse — Advanced Scenarios ────────────────────────────────────────────

test('browse pagination: page 2 is accessible via Next button', async ({ page }) => {
	// Happy path: clicking "Next →" should advance to page 2 and update the URL
	await page.goto('/browse');
	await page.getByRole('link', { name: 'Next →' }).click();
	await expect(page).toHaveURL(/[?&]page=2/);
});

test('browse search with no matching term shows no shop cards', async ({ page }) => {
	// Negative: a query that matches nothing should return an empty result set,
	// not an error or the full listing
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('xyznonexistentshop99999');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL(/[?&]q=xyznonexistentshop99999/);
	// No shop card with "Visit shop" links should be visible
	await expect(page.getByRole('link', { name: /Visit shop/i })).not.toBeVisible();
});

test('browse search clear resets results to full listing', async ({ page }) => {
	// Happy path: after a filtered search, clicking "Clear" restores the full listing
	await page.goto('/browse?q=placeholder');
	await page.getByRole('link', { name: 'Clear' }).click();
	await expect(page).toHaveURL(/\/browse(\?.*)?$/);
	// The unfiltered page should contain multiple shop cards
	await expect(page.getByRole('link', { name: /Visit shop/i }).first()).toBeVisible();
});
