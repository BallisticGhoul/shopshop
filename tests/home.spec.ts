import { test, expect } from '@playwright/test';

// Home / landing page — covers the root / route.
// As a guest, the page shows "Browse Shops", "Log In", and "Create a Shop" CTAs.

test.describe('Home page', () => {
	test('renders the ShopShop hero heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	});

	test('page title is "ShopShop"', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('ShopShop');
	});

	test('shows tagline text', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
	});

	test('guest sees Browse Shops and Log In CTAs', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	});

	test('Browse Shops link points to /browse', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Browse Shops' })).toHaveAttribute('href', '/browse');
	});

	test('Log In link points to /login', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
	});
});
