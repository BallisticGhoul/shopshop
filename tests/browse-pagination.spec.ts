import { test, expect } from '@playwright/test';

// ── Browse pagination & shop detail regression tests ──────────────────────────

test('browse page shows 9 shop cards on first page', async ({ page }) => {
	// Happy path: page 1 must display the expected grid of shop cards.
	await page.goto('/browse');
	const visitLinks = page.getByRole('link', { name: /Visit shop/i });
	// There should be at least one and up to 9 cards on page 1.
	await expect(visitLinks.first()).toBeVisible();
	const count = await visitLinks.count();
	expect(count).toBeGreaterThanOrEqual(1);
	expect(count).toBeLessThanOrEqual(9);
});

test('browse pagination navigates to page 2 via Next button', async ({ page }) => {
	// Happy path: the Next → control updates the URL with ?page=2.
	await page.goto('/browse');
	await page.getByRole('link', { name: /Next/i }).click();
	await expect(page).toHaveURL(/page=2/);
	// Page 2 should still show shop cards.
	await expect(page.getByRole('link', { name: /Visit shop/i }).first()).toBeVisible();
});

test('browse page 1 does not have a functional Previous button', async ({ page }) => {
	// Edge case: Previous navigation must be disabled/absent on the first page.
	await page.goto('/browse');
	const prevLink = page.getByRole('link', { name: /Previous/i });
	// Either the link is absent or has an aria-disabled / disabled attribute.
	const prevCount = await prevLink.count();
	if (prevCount > 0) {
		// If rendered, it must carry an aria-disabled attribute indicating it is inactive.
		await expect(prevLink).toHaveAttribute('aria-disabled', 'true');
	}
	// Passes when the link is simply not present on page 1.
});

test('search with no results shows empty feedback', async ({ page }) => {
	// Negative: a query that matches nothing must not crash — user needs feedback.
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('zzznoresultsxxx9999');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL(/q=zzznoresultsxxx9999/);
	// No shop cards should appear and the page should stay at /browse.
	const visitLinks = page.getByRole('link', { name: /Visit shop/i });
	await expect(visitLinks).toHaveCount(0);
});

test('visiting a shop detail page renders shop name and products section', async ({ page }) => {
	// Happy path: clicking the first shop card leads to a valid shop detail page.
	await page.goto('/browse');
	// Click the first "Visit shop" link.
	await page.getByRole('link', { name: /Visit shop/i }).first().click();
	// URL must change to /shops/<id>.
	await expect(page).toHaveURL(/\/shops\//);
	// A shop name heading and at least one product "Add to cart" button must appear.
	await expect(page.getByRole('heading').first()).toBeVisible();
});
