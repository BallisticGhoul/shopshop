import { test, expect } from '@playwright/test';

// Login — a critical auth gate. Every protected feature (dashboard, shop creation)
// depends on this flow working correctly.

test.describe('Login', () => {
	test('renders the login form with username and password fields', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
	});

	test('shows an error for invalid credentials', async ({ page }) => {
		await page.goto('/login');
		await page.locator('input[name="username"]').fill('nonexistent_user_xyz');
		await page.locator('input[name="password"]').fill('wrongpassword');
		await page.getByRole('button', { name: 'Log in' }).click();
		await expect(page.getByText('Invalid username or password.')).toBeVisible();
	});

	test('password field is masked by default', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
	});

	test('show/hide password toggle changes input type', async ({ page }) => {
		await page.goto('/login');
		const passwordInput = page.locator('input[name="password"]');
		await expect(passwordInput).toHaveAttribute('type', 'password');
		await page.getByRole('button', { name: 'Show password' }).click();
		await expect(passwordInput).toHaveAttribute('type', 'text');
		await page.getByRole('button', { name: 'Hide password' }).click();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('has a link to the register page', async ({ page }) => {
		await page.goto('/login');
		await page.getByRole('link', { name: 'Register' }).click();
		await expect(page).toHaveURL(/\/register/);
	});
});
