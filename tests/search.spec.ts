import { test, expect } from '@playwright/test';

test('search returns shops matching by name', async ({ page }) => {
	await page.goto('/browse');
	await page.locator('input[name="q"]').fill('Placeholder');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL('**/browse?q=Placeholder');
	await expect(page.getByText('Placeholder Shop 1')).toBeVisible();
});