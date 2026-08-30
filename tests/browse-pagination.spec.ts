import { test, expect } from '@playwright/test';

// ─── Browse pagination & search edge-case regression tests ───────────────────
// Covers: first-page Previous button disabled (edge case), direct page
//         navigation via URL (edge case), search with no results (negative).

test('browse page 1 has Previous button disabled', async ({ page }) => {
	// Edge case: on the first page of paginated results the "← Previous" control
	// must be absent or non-functional — users should not be able to go before page 1.
	await page.goto('/browse?page=1');
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	// The Previous link must not be a clickable navigation element on page 1.
	const prevLink = page.getByRole('link', { name: /previous/i });
	const prevCount = await prevLink.count();
	if (prevCount > 0) {
		// If an element exists it must either be aria-disabled or not have a valid href.
		const ariaDisabled = await prevLink.first().getAttribute('aria-disabled');
		const href = await prevLink.first().getAttribute('href');
		const isDisabled = ariaDisabled === 'true' || !href || href === '#';
		expect(isDisabled).toBe(true);
	}
	// If prevCount is 0 that is also acceptable — the control is simply absent.
});

test('navigating to browse page 2 via URL renders shops', async ({ page }) => {
	// Edge case: deep-linking directly to page 2 must work without any prior
	// navigation — the grid should be populated.
	await page.goto('/browse?page=2');
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	// At least one shop card should be visible on page 2.
	await expect(page.getByRole('link', { name: /visit shop/i }).first()).toBeVisible();
});

test('search with no matching query shows no shops', async ({ page }) => {
	// Negative: searching for a nonsensical string that matches no shop or product
	// must result in an empty grid rather than a crash or unrelated results.
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('xyzzy_no_match_9999');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=xyzzy_no_match_9999');
	// There must be no "Visit shop →" cards when nothing matches.
	await expect(page.getByRole('link', { name: /visit shop/i })).toHaveCount(0);
});
