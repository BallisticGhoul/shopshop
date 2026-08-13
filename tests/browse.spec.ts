import { test, expect } from '@playwright/test';

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
