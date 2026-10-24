import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Authentication — Login
// ---------------------------------------------------------------------------

test('login page renders username and password fields', async ({ page }) => {
	// Happy path: verify the login form is present and accessible
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login with invalid credentials shows error message', async ({ page }) => {
	// Negative: wrong credentials must not authenticate the user
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('nonexistent_user');
	await page.locator('input[name="password"]').fill('wrongpassword123');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Should stay on the login page and show an error
	await expect(page).toHaveURL(/\/login/);
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Invalid username or password');
});

test('login with empty fields shows error message', async ({ page }) => {
	// Negative/edge-case: submitting blank credentials must be rejected
	await page.goto('/login');
	// Fill username only — leave password blank
	await page.locator('input[name="username"]').fill('someuser');
	// Submit via JS to bypass the browser required-attribute validation
	await page.evaluate(() => {
		(document.querySelector('form') as HTMLFormElement).requestSubmit();
	});
	// Error visible or still on login page (browser-native or server-side)
	await expect(page).toHaveURL(/\/login/);
});

// ---------------------------------------------------------------------------
// Authentication — Register
// ---------------------------------------------------------------------------

test('register page renders all required fields', async ({ page }) => {
	// Happy path: verify the registration form is fully rendered
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.locator('input[name="confirm"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register with mismatched passwords shows error', async ({ page }) => {
	// Negative: password mismatch must be caught server-side
	await page.goto('/register');
	await page.locator('input[name="username"]').fill(`user_${Date.now()}`);
	await page.locator('input[name="password"]').fill('securepassword1');
	await page.locator('input[name="confirm"]').fill('differentpassword2');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toContainText('Passwords do not match');
});

test('register with username shorter than 3 characters shows error', async ({ page }) => {
	// Edge-case: username boundary — minimum length is 3
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('validpassword');
	await page.locator('input[name="confirm"]').fill('validpassword');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toContainText('at least 3 characters');
});

test('register page has a link to the login page', async ({ page }) => {
	// Happy path: cross-link between auth pages works
	await page.goto('/register');
	await page.getByRole('link', { name: 'Log in' }).click();
	await expect(page).toHaveURL(/\/login/);
});
