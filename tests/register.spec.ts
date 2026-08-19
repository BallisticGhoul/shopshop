import { test, expect } from '@playwright/test';

// Register page — covers the /register route and its form actions.
// Successful registration redirects to /dashboard; errors are
// displayed inline in the form.

test.describe('Register page', () => {
	test('renders the create-account form', async ({ page }) => {
		await page.goto('/register');
		await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
		await expect(page.getByLabel('Username')).toBeVisible();
		await expect(page.getByLabel('Password')).toBeVisible();
		await expect(page.getByLabel('Confirm password')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
	});

	test('shows error when passwords do not match', async ({ page }) => {
		await page.goto('/register');
		// Use a unique username to avoid "already taken" interference
		const username = `testuser_${Date.now()}`;
		await page.getByLabel('Username').fill(username);
		await page.getByLabel('Password').fill('password123');
		await page.getByLabel('Confirm password').fill('different456');
		await page.getByRole('button', { name: 'Create account' }).click();
		await expect(page.getByText('Passwords do not match.')).toBeVisible();
	});

	test('shows error when username is too short (< 3 characters)', async ({ page }) => {
		await page.goto('/register');
		await page.getByLabel('Username').fill('ab');
		await page.getByLabel('Password').fill('password123');
		await page.getByLabel('Confirm password').fill('password123');
		await page.getByRole('button', { name: 'Create account' }).click();
		await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
	});

	test('password visibility toggle works on both fields', async ({ page }) => {
		await page.goto('/register');

		// Password field
		const passwordInput = page.getByLabel('Password');
		await expect(passwordInput).toHaveAttribute('type', 'password');
		await page.getByRole('button', { name: 'Show password' }).first().click();
		await expect(passwordInput).toHaveAttribute('type', 'text');

		// Confirm password field
		const confirmInput = page.getByLabel('Confirm password');
		await expect(confirmInput).toHaveAttribute('type', 'password');
		await page.getByRole('button', { name: 'Show password' }).nth(1).click();
		await expect(confirmInput).toHaveAttribute('type', 'text');
	});

	test('has a link back to the login page', async ({ page }) => {
		await page.goto('/register');
		const link = page.getByRole('link', { name: 'Log in' });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', '/login');
	});
});
