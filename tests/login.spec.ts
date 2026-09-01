import { test, expect } from '@playwright/test';

// ── Login ──────────────────────────────────────────────────────────────────

test('login page renders form fields', async ({ page }) => {
	// Verify the login page loads and displays all required form elements
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login with invalid credentials shows error message', async ({ page }) => {
	// Negative: wrong credentials must surface an inline error, not crash or redirect
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('notarealuser');
	await page.locator('input[name="password"]').fill('wrongpassword123');
	await page.getByRole('button', { name: 'Log in' }).click();
	await expect(page.getByText('Invalid username or password.')).toBeVisible();
	// Should remain on login page after failure
	await expect(page).toHaveURL(/\/login/);
});

test('login page link navigates to register page', async ({ page }) => {
	// Happy path: the "Register" link on the login page must work
	await page.goto('/login');
	await page.getByRole('link', { name: 'Register' }).click();
	await expect(page).toHaveURL(/\/register/);
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
});
