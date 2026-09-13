import { test, expect } from '@playwright/test';

/**
 * Browse page (extended) — migrated from cypress/e2e/browse.cy.ts.
 *
 * The existing tests/browse.spec.ts covers "lists shops" and "search by name".
 * This file covers the three remaining Cypress cases:
 *   - pagination to page 2
 *   - search-then-clear workflow
 *   - surface a shop when only its products match the query
 *   - empty state when nothing matches
 *
 * Uses .anon.spec.ts because browse is a public page and these tests work
 * without a session. Keeps them isolated from the authenticated project to
 * avoid any state leakage.
 *
 * Seed: 12 mock shops, page size 9. Only shop 1 has products.
 */

test('moves to the second page and shows the remaining shops', async ({ page }) => {
	await page.goto('/browse');

	await page.getByRole('link', { name: 'Next' }).first().click();

	await expect(page).toHaveURL(/[?&]page=2/);
	await expect(page.locator('a[href^="/shops/"]')).toHaveCount(3);
	await expect(page.locator('.meta', { hasText: 'Page 2 of 2' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 12' })).toBeVisible();
});

test('narrows results by shop name and restores them with Clear', async ({ page }) => {
	await page.goto('/browse');

	await page.locator('input[name="q"]').fill('12');
	await page.getByRole('button', { name: 'Search' }).click();

	await expect(page).toHaveURL(/\?q=12$/);
	await expect(page.locator('a[href^="/shops/"]')).toHaveCount(1);
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 12' })).toBeVisible();
	await expect(page.locator('.meta', { hasText: '1 result' })).toBeVisible();

	await page.getByRole('link', { name: 'Clear' }).click();

	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.locator('a[href^="/shops/"]')).toHaveCount(9);
});

test('surfaces a shop when the query only matches one of its products', async ({ page }) => {
	await page.goto('/browse?q=Product');

	await expect(page.locator('a[href^="/shops/"]')).toHaveCount(1);
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	await expect(page.locator('.meta', { hasText: '1 result' })).toBeVisible();
});

test('shows an empty state when nothing matches the query', async ({ page }) => {
	await page.goto('/browse?q=nonexistentquery');

	await expect(page.locator('a[href^="/shops/"]')).toHaveCount(0);
	await expect(page.getByText('No shops or products matched')).toBeVisible();
	await expect(page.locator('.meta', { hasText: '0 results' })).toBeVisible();
});
