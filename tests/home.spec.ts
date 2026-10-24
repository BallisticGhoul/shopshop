import { test, expect } from '@playwright/test';

test.describe('home page', () => {
	test('shows the hero with logged-out actions and links through to browse', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1 })).toContainText('ShopShop');
		await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();

		await expect(page.getByRole('link', { name: 'Browse Shops' })).toHaveAttribute('href', '/browse');
		await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
		await expect(page.getByRole('link', { name: 'Create a Shop' })).toHaveAttribute('href', '/dashboard/shop/new');

		await page.getByRole('link', { name: 'Browse Shops' }).click();

		await expect(page).toHaveURL(/\/browse$/);
		await expect(page.getByRole('heading', { name: 'Browse Shops', level: 1 })).toBeVisible();
	});
});
