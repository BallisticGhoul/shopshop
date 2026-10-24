import { test, expect } from '@playwright/test';

// The seeded catalogue has 12 mock shops; page size is 9, giving 2 pages.
const SHOP_CARD = 'a[href^="/shops/"]';

test('browse page lists shops', async ({ page }) => {
	await page.goto('/browse');
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
});

test('search matches shop names regardless of case', async ({ page }) => {
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('placeholder');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=placeholder');
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
});

// --- migrated from browse.cy.ts ---

test('lists the first page of shops with pagination controls', async ({ page }) => {
	await page.goto('/browse');

	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.locator(SHOP_CARD)).toHaveCount(9);
	await expect(page.locator('.meta').filter({ hasText: 'Page 1 of 2' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
});

test('moves to the second page and shows the remaining shops', async ({ page }) => {
	await page.goto('/browse');

	await page.getByRole('link', { name: 'Next' }).first().click();

	await expect(page).toHaveURL(/[?&]page=2/);
	await expect(page.locator(SHOP_CARD)).toHaveCount(3);
	await expect(page.locator('.meta').filter({ hasText: 'Page 2 of 2' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 12' })).toBeVisible();
});

test('narrows results by shop name and restores them with Clear', async ({ page }) => {
	await page.goto('/browse');

	await page.locator('input[name="q"]').fill('12');
	await page.getByRole('button', { name: 'Search' }).click();

	await expect(page).toHaveURL(/[?&]q=12/);
	await expect(page.locator(SHOP_CARD)).toHaveCount(1);
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 12' })).toBeVisible();
	await expect(page.locator('.meta').filter({ hasText: '1 result' })).toBeVisible();

	await page.getByRole('link', { name: 'Clear' }).click();

	await expect(page).toHaveURL(/\/browse$/);
	await expect(page.locator(SHOP_CARD)).toHaveCount(9);
});

test('surfaces a shop when the query only matches one of its products', async ({ page }) => {
	await page.goto('/browse?q=Product');

	await expect(page.locator(SHOP_CARD)).toHaveCount(1);
	await expect(page.getByRole('heading', { name: 'Placeholder Shop 1' })).toBeVisible();
	await expect(page.locator('.meta').filter({ hasText: '1 result' })).toBeVisible();
});

test('shows an empty state when nothing matches the query', async ({ page }) => {
	await page.goto('/browse?q=nonexistentquery');

	await expect(page.locator(SHOP_CARD)).toHaveCount(0);
	await expect(page.getByText('No shops or products matched')).toBeVisible();
	await expect(page.locator('.meta').filter({ hasText: '0 results' })).toBeVisible();
});
