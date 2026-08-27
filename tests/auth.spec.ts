import { test, expect } from '@playwright/test';

// ─── Login ────────────────────────────────────────────────────────────────────

test('login page renders form elements', async ({ page }) => {
	// Happy path: the login form is fully present before any submission
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login with invalid credentials shows error message', async ({ page }) => {
	// Negative: wrong username/password must surface a visible error, not redirect
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('definitely_not_a_user');
	await page.locator('input[name="password"]').fill('wrongpassword123');
	await page.getByRole('button', { name: 'Log in' })).click();
	// Should stay on /login and display an error
	await expect(page).toHaveURL(/\/login/);
	await expect(page.locator('.error')).toBeVisible();
});

test('login with empty fields is blocked by required validation', async ({ page }) => {
	// Edge case: submitting a blank form must not reach the server (HTML5 required)
	await page.goto('/login');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Browser required validation keeps us on the same page
	await expect(page).toHaveURL(/\/login/);
});

// ─── Register ─────────────────────────────────────────────────────────────────

test('register page renders form with username, password, and confirm fields', async ({ page }) => {
	// Happy path: all registration fields are present
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.locator('input[name="confirm"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register with mismatched passwords shows error', async ({ page }) => {
	// Negative: confirm password that differs from password must be rejected
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('testuser_mismatch');
	await page.locator('input[name="password"]').fill('ValidPass99');
	await page.locator('input[name="confirm"]').fill('DifferentPass99');
	await page.getByRole('button', { name: 'Create account' }).click();
	// Should stay on /register and show an error
	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toBeVisible();
});

test('register link on login page navigates to register', async ({ page }) => {
	// Happy path: cross-link between auth pages works
	await page.goto('/login');
	await page.getByRole('link', { name: 'Register' }).click();
	await expect(page).toHaveURL(/\/register/);
});
