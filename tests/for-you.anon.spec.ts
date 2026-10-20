import { test, expect } from '@playwright/test';

test('For You requires sign-in', async ({ page }) => {
	await page.goto('/dashboard/for-you');
	await page.waitForURL('**/login?redirect=%2Fdashboard%2Ffor-you');
});

test('home page For You button sends signed-out visitors to log in', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('home-for-you').click();
	await page.waitForURL('**/login?redirect=%2Fdashboard%2Ffor-you');
});
