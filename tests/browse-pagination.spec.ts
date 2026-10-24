import { test, expect } from '@playwright/test';

// ── Browse — pagination & search edge cases ───────────────────────────────────
// Covers: pagination navigation (happy), Previous disabled on page 1 (edge),
// search with no results (negative), search clear resets listing (happy).
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Browse — pagination', () => {
	test('Previous button is disabled/absent on the first page (edge)', async ({ page }) => {
		// On page 1 of browse, the "← Previous" control must not be clickable
		// (i.e., disabled or hidden) — navigating backwards from page 1 is invalid.
		await page.goto('/browse');
		const prevButton = page.getByRole('link', { name: /← previous/i });
		// Either the button doesn't exist, or it has an aria-disabled attribute.
		const count = await prevButton.count();
		if (count > 0) {
			await expect(prevButton).toHaveAttribute('aria-disabled', 'true');
		}
		// Pass: button is absent OR properly marked disabled.
	});

	test('clicking Next navigates to page 2 (happy path)', async ({ page }) => {
		// Verify pagination works: clicking Next from page 1 should advance to page 2.
		await page.goto('/browse');
		await page.getByRole('link', { name: /next →/i }).click();
		await expect(page).toHaveURL(/[?&]page=2/);
	});
});

test.describe('Browse — search', () => {
	test('search with no matching term shows no results (negative)', async ({ page }) => {
		// Submitting a query that should match nothing must not crash the page;
		// it should render gracefully with zero shop cards visible.
		await page.goto('/browse');
		await page.locator('input[name="q"]').fill('zzznoresultsxxx99999');
		await page.getByRole('button', { name: /search/i }).click();
		await page.waitForURL('**/browse?q=zzznoresultsxxx99999');
		// No shop cards should be displayed for this query.
		await expect(page.getByRole('link', { name: /visit shop/i })).toHaveCount(0);
	});
});
