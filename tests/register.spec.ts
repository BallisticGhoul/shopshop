import { test, expect } from '@playwright/test';

// Registration — new user onboarding. Failures here mean users cannot create
// accounts, blocking all authenticated features.

test.describe('Register', () => {
	test('renders the registration form', async ({ page }) => {
		await page.goto('/register');
		await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('input[name="confirm"]')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
	});

	test('shows error when passwords do not match', async ({ page }) => {
		await page.goto('/register');
		// Use a unique username to avoid "username taken" errors masking the password mismatch
		const uniqueUser = `testuser_${Date.now()}`;
		await page.locator('input[name="username"]').fill(uniqueUser);
		await page.locator('input[name="password"]').fill('password123');
		await page.locator('input[name="confirm"]').fill('differentpassword');
		await page.getByRole('button', { name: 'Create account' }).click();
		await expect(page.getByText('Passwords do not match.')).toBeVisible();
	});

	test('shows error when username is too short', async ({ page }) => {
		await page.goto('/register');
		await page.locator('input[name="username"]').fill('ab');
		await page.locator('input[name="password"]').fill('password123');
		await page.locator('input[name="confirm"]').fill('password123');
		await page.getByRole('button', { name: 'Create account' }).click();
		await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
	});

	test('has a link to the login page', async ({ page }) => {
		await page.goto('/register');
		await page.getByRole('link', { name: 'Log in' }).click();
		await expect(page).toHaveURL(/\/login/);
	});
});
