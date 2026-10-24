import { test, expect } from '@playwright/test';

// Homepage / landing page — the entry point for all users.
// Verifies the hero content and navigation CTA buttons are rendered correctly
// for both unauthenticated and authenticated states.

test.describe('Homepage', () => {
	test('renders the ShopShop hero heading and tagline', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
		await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
	});

	test('shows Browse Shops and Log In CTAs for unauthenticated users', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	});

	test('Browse Shops CTA navigates to /browse', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Browse Shops' }).click();
		await expect(page).toHaveURL(/\/browse/);
	});

	test('Log In CTA navigates to /login', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Log In' }).click();
		await expect(page).toHaveURL(/\/login/);
	});
});
