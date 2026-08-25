import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Authentication — Login
// ---------------------------------------------------------------------------

test('login page renders username and password fields', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login with invalid credentials shows error message', async ({ page }) => {
	// Negative: wrong username / password must not authenticate the user
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('nonexistent_user_xyz');
	await page.locator('input[name="password"]').fill('wrongpassword123');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Should stay on /login and display an error
	await expect(page).toHaveURL(/\/login/);
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Invalid username or password.');
});

test('login with empty fields shows validation error', async ({ page }) => {
	// Negative: submitting with blank fields must be rejected
	await page.goto('/login');
	// Bypass HTML5 required by removing the attribute, then submit
	await page.locator('input[name="username"]').evaluate((el) => el.removeAttribute('required'));
	await page.locator('input[name="password"]').evaluate((el) => el.removeAttribute('required'));
	await page.getByRole('button', { name: 'Log in' }).click();

	await expect(page).toHaveURL(/\/login/);
	await expect(page.locator('.error')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Authentication — Register
// ---------------------------------------------------------------------------

test('register with mismatched passwords shows error', async ({ page }) => {
	// Negative: passwords that do not match must be rejected
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('testuser_mismatch');
	await page.locator('input[name="password"]').fill('Password123!');
	await page.locator('input[name="confirm"]').fill('DifferentPassword!');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toContainText('Passwords do not match.');
});

test('register with username shorter than 3 characters shows error', async ({ page }) => {
	// Edge-case: username boundary — must be at least 3 characters
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('Password123!');
	await page.locator('input[name="confirm"]').fill('Password123!');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toContainText('at least 3 characters');
});
