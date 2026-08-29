import { test, expect } from '@playwright/test';

// ── Test 1: Happy path — valid credentials redirect to dashboard ──
test('login with valid credentials redirects to dashboard', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

	await page.getByLabel('Username').fill('testuser123');
	await page.getByLabel('Password').fill('password123');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Successful login lands on dashboard
	await page.waitForURL('**/dashboard');
	await expect(page).toHaveURL(/\/dashboard/);
});

// ── Test 2: Negative — wrong password shows error message ──
test('login with wrong password shows error message', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('testuser123');
	await page.getByLabel('Password').fill('definitelywrongpassword');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Should stay on /login and show error
	await expect(page).toHaveURL(/\/login/);
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Invalid username or password.');
});

// ── Test 3: Negative — empty credentials show error or prevent submission ──
test('login with empty fields shows validation error', async ({ page }) => {
	await page.goto('/login');

	// Submit without filling any fields
	await page.getByRole('button', { name: 'Log in' }).click();

	// The form uses HTML required — browser prevents submission,
	// so we should remain on /login with no redirect
	await expect(page).toHaveURL(/\/login/);
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});

// ── Test 4: Edge case — toggle password visibility ──
test('password visibility toggle switches input type', async ({ page }) => {
	await page.goto('/login');

	const passwordInput = page.getByLabel('Password');
	await expect(passwordInput).toHaveAttribute('type', 'password');

	// Click the eye button to reveal password
	await page.getByRole('button', { name: 'Show password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'text');

	// Click again to hide
	await page.getByRole('button', { name: 'Hide password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'password');
});
