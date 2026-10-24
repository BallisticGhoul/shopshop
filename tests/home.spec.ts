import { test, expect } from '@playwright/test';

/**
 * Home page regression tests.
 *
 * Covers the landing hero: branding, tagline, and the navigation CTAs
 * shown to unauthenticated visitors. The authenticated variant is not
 * tested here because the app uses cookie-based sessions and there is
 * no shared auth fixture yet — that state is covered in dashboard.spec.ts.
 */

test('home page shows ShopShop branding and tagline', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'ShopShop' })).toBeVisible();
	await expect(page.getByText('Create and discover unique online shops.')).toBeVisible();
});

test('home page has Browse Shops CTA for unauthenticated visitors', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
});

test('home page has Log In CTA for unauthenticated visitors', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
});

test('Browse Shops link on home page navigates to /browse', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Browse Shops' }).click();
	await expect(page).toHaveURL('/browse');
	await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
});

test('Log In link on home page navigates to /login', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Log In' }).click();
	await expect(page).toHaveURL('/login');
});
