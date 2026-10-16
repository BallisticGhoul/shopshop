import { test, expect } from '@playwright/test';

// The seeded catalogue is 12 mock shops and the page size is 9, so browse
// paginates into two pages. Only shop 1 has products.
const SHOP_CARD = 'a[href^="/shops/"]';

test.describe('browse page', () => {
	test('lists the first page of shops with pagination', async ({ page }) => {
		await page.goto('/browse');

		await expect(page.getByRole('heading', { name: 'Browse Shops', level: 1 })).toBeVisible();
		await expect(page.locator(SHOP_CARD)).toHaveCount(9);
		await expect(page.locator('.meta')).toContainText('Page 1 of 2');
		await expect(page.getByRole('heading', { name: 'Placeholder Shop 1', level: 3 })).toBeVisible();
	});

	test('moves to the second page and shows the remaining shops', async ({ page }) => {
		await page.goto('/browse');

		await page.getByRole('link', { name: 'Next' }).first().click();

		await expect(page).toHaveURL(/page=2/);
		await expect(page.locator(SHOP_CARD)).toHaveCount(3);
		await expect(page.locator('.meta')).toContainText('Page 2 of 2');
		await expect(page.getByRole('heading', { name: 'Placeholder Shop 12', level: 3 })).toBeVisible();
	});

	test('narrows results by shop name and restores them with Clear', async ({ page }) => {
		await page.goto('/browse');

		await page.locator('input[name="q"]').type('12');
		await page.getByRole('button', { name: 'Search' }).click();

		await expect(page).toHaveURL(/\?q=12$/);
		await expect(page.locator(SHOP_CARD)).toHaveCount(1);
		await expect(page.getByRole('heading', { name: 'Placeholder Shop 12', level: 3 })).toBeVisible();
		await expect(page.locator('.meta')).toContainText('1 result');

		await page.getByRole('link', { name: 'Clear' }).click();

		await expect(page).toHaveURL(/\/browse$/);
		await expect(page.locator(SHOP_CARD)).toHaveCount(9);
	});

	test('surfaces a shop when the query only matches one of its products', async ({ page }) => {
		await page.goto('/browse?q=Product');

		await expect(page.locator(SHOP_CARD)).toHaveCount(1);
		await expect(page.getByRole('heading', { name: 'Placeholder Shop 1', level: 3 })).toBeVisible();
		await expect(page.locator('.meta')).toContainText('1 result');
	});

	test('shows an empty state when nothing matches the query', async ({ page }) => {
		await page.goto('/browse?q=nonexistentquery');

		await expect(page.locator(SHOP_CARD)).toHaveCount(0);
		await expect(page.getByText('No shops or products matched')).toBeVisible();
		await expect(page.locator('.meta')).toContainText('0 results');
	});
});
