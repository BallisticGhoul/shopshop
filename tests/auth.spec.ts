import { test, expect } from '@playwright/test';

// ── Authentication regression tests ──────────────────────────────────────────

test('login page renders username and password fields', async ({ page }) => {
	// Happy path: the login form is accessible and shows expected fields.
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login with invalid credentials shows error message', async ({ page }) => {
	// Negative: wrong password must surface an inline error, not crash.
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('nonexistent_user_xyz');
	await page.locator('input[name="password"]').fill('wrongpassword123');
	await page.getByRole('button', { name: 'Log in' }).click();
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Invalid username or password');
});

test('login with empty fields shows validation error', async ({ page }) => {
	// Edge case: submitting blank credentials must not silently succeed.
	await page.goto('/login');
	// Clear any browser-autofilled values before submitting blank.
	await page.locator('input[name="username"]').fill('');
	await page.locator('input[name="password"]').fill('');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Form should stay on /login — no redirect to /dashboard.
	await expect(page).toHaveURL(/\/login/);
});

test('register with mismatched passwords shows error', async ({ page }) => {
	// Negative: passwords that do not match must be rejected server-side.
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('testuser_mismatch');
	await page.locator('input[name="password"]').fill('Password123!');
	await page.locator('input[name="confirm"]').fill('DifferentPassword!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Passwords do not match');
});

test('register with username shorter than 3 characters shows error', async ({ page }) => {
	// Edge case: minimum username length boundary (must be ≥ 3 chars).
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('ValidPass123!');
	await page.locator('input[name="confirm"]').fill('ValidPass123!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('at least 3 characters');
});
