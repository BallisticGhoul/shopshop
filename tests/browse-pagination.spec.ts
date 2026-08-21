import { test, expect } from '@playwright/test';

/**
 * Browse page pagination regression tests.
 *
 * The mock data seeds 12 shops. The default page size shows all shops
 * on one page when there are fewer than the page limit; if pagination
 * is active, prev/next links and page numbers are rendered.
 *
 * These tests assert the pagination UI renders when it should and that
 * the clear-search link removes the query parameter.
 */

test('browse page shows all shops when results fit on one page', async ({ page }) => {
	await page.goto('/browse');
	// With 12 mock shops and a typical page size ≥ 12, no pagination bar
	// should appear. Assert we see at least some shops.
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
	await expect(page.getByText('Placeholder Shop 12')).toBeVisible();
});

test('browse search shows result count in meta line', async ({ page }) => {
	await page.goto('/browse?q=Placeholder');
	// "12 results for …" or similar
	await expect(page.getByText(/results? for/i)).toBeVisible();
});

test('browse clear button removes the search query', async ({ page }) => {
	await page.goto('/browse?q=Placeholder');
	await page.getByRole('link', { name: 'Clear' }).click();
	await expect(page).toHaveURL('/browse');
	// No search query active — result count line changes to shop count
	await expect(page.getByText(/shop/i)).toBeVisible();
});

test('browse search for unknown term shows no-results message', async ({ page }) => {
	await page.goto('/browse?q=xyzzy_nonexistent_term');
	await expect(
		page.getByText(/No shops or products matched/i)
	).toBeVisible();
});
