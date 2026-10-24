import { test, expect } from '@playwright/test';

// Tests covering the home/landing page — the primary entry point for all users.

test('home page renders ShopShop heading and tagline', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
});

test('home page Browse Shops link navigates to /browse', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Browse Shops' }).first().click();
	await expect(page).toHaveURL(/\/browse/);
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});

test('home page shows Log In and Create a Shop links for unauthenticated users', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Create a Shop' })).toBeVisible();
});
