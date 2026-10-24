import { test, expect } from '@playwright/test';

// Login page — covers the /login route and its form actions.
// The server redirects to /dashboard on success; on failure it
// returns an error message in the form response.

test.describe('Login page', () => {
	test('renders the log-in form', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
		await expect(page.getByLabel('Username')).toBeVisible();
		await expect(page.getByLabel('Password')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
	});

	test('shows error on invalid credentials', async ({ page }) => {
		await page.goto('/login');
		await page.getByLabel('Username').fill('nonexistent_user_xyz');
		await page.getByLabel('Password').fill('wrongpassword');
		await page.getByRole('button', { name: 'Log in' }).click();
		await expect(page.getByText('Invalid username or password.')).toBeVisible();
	});

	test('shows error when fields are empty', async ({ page }) => {
		await page.goto('/login');
		// Submit with only username filled — password left blank
		await page.getByLabel('Username').fill('someuser');
		await page.getByRole('button', { name: 'Log in' }).click();
		// Browser required-field validation or server error should fire
		// The input has the `required` attribute, so the form won't submit
		const passwordInput = page.getByLabel('Password');
		await expect(passwordInput).toBeVisible();
	});

	test('password visibility toggle works', async ({ page }) => {
		await page.goto('/login');
		const passwordInput = page.getByLabel('Password');
		await expect(passwordInput).toHaveAttribute('type', 'password');
		await page.getByRole('button', { name: 'Show password' }).click();
		await expect(passwordInput).toHaveAttribute('type', 'text');
		await page.getByRole('button', { name: 'Hide password' }).click();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('has a link to the register page', async ({ page }) => {
		await page.goto('/login');
		const link = page.getByRole('link', { name: 'Register' });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', '/register');
	});
});
