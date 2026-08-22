import { test, expect } from '@playwright/test';

// Browse pagination — the app has 12 mock shops and paginated display.
// Pagination regressions mean users can't reach shops beyond the first page,
// causing invisible product discovery failures.

test.describe('Browse pagination', () => {
	test('browse page shows page metadata when there are multiple pages', async ({ page }) => {
		await page.goto('/browse');
		// With 12 shops and typical page sizes, pagination metadata should appear
		// The meta line either shows "X shops" or "Page 1 of Y"
		const meta = page.locator('.meta');
		await expect(meta).toBeVisible();
	});

	test('browse page shows search result count when query returns results', async ({ page }) => {
		await page.goto('/browse?q=placeholder');
		// Should show the result count string e.g. "12 results for "placeholder""
		await expect(page.locator('.meta')).toContainText('results for');
	});

	test('browse page shows no-results message for unmatched query', async ({ page }) => {
		await page.goto('/browse?q=xyzzy_no_match_ever');
		await expect(page.getByText(/No shops or products matched/)).toBeVisible();
	});

	test('clear search link appears after a search and navigates back to /browse', async ({ page }) => {
		await page.goto('/browse');
		await page.locator('input[name="q"]').fill('placeholder');
		await page.getByRole('button', { name: 'Search' }).click();
		await page.waitForURL(/\/browse\?q=/);

		const clearLink = page.getByRole('link', { name: 'Clear' });
		await expect(clearLink).toBeVisible();
		await clearLink.click();
		await expect(page).toHaveURL(/\/browse$/);
	});
});
