import { test, expect } from '@playwright/test';

test.describe('dashboard access', () => {
	test('redirects an anonymous visitor to the login page with a redirect back', async ({ page }) => {
		await page.goto('/dashboard');

		await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
		await expect(page.getByRole('heading', { name: 'Log in', level: 1 })).toBeVisible();
	});
});
