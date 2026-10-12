import { test, expect } from '@playwright/test';

test('For You requires sign-in', async ({ page }) => {
	await page.goto('/dashboard/for-you');
	await page.waitForURL('**/login?redirect=%2Fdashboard%2Ffor-you');
});

test('home page hides the For You button when signed out', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
	await expect(page.getByTestId('home-for-you')).toHaveCount(0);
});
