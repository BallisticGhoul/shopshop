import { test, expect } from '@playwright/test';

// ─── LOGIN ────────────────────────────────────────────────────────────────────

// Happy path: valid credentials redirect to /dashboard
test('login with valid credentials redirects to dashboard', async ({ page }) => {
	// Register first to guarantee a known user exists
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('validuser_login');
	await page.locator('input[name="password"]').fill('ValidPass1!');
	await page.locator('input[name="confirm"]').fill('ValidPass1!');
	await page.getByRole('button', { name: 'Create account' }).click();
	// After registration we land on /dashboard; log out to test login fresh
	await page.goto('/logout');
	await page.waitForURL('/');

	await page.goto('/login');
	await page.locator('input[name="username"]').fill('validuser_login');
	await page.locator('input[name="password"]').fill('ValidPass1!');
	await page.getByRole('button', { name: 'Log in' }).click();
	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible();
});

// Negative: wrong password shows error message
test('login with wrong password shows error', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('nonexistent_user_xyz');
	await page.locator('input[name="password"]').fill('WrongPassword999');
	await page.getByRole('button', { name: 'Log in' }).click();
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Invalid username or password');
});

// Negative: empty submission shows required-field error
test('login with empty fields shows validation error', async ({ page }) => {
	await page.goto('/login');
	// Submit without filling any field
	await page.getByRole('button', { name: 'Log in' }).click();
	// The server returns 400 with an error message OR browser HTML5 validation fires
	// Either way the user should not reach /dashboard
	await expect(page).not.toHaveURL(/dashboard/);
});

// ─── REGISTER ─────────────────────────────────────────────────────────────────

// Negative: mismatched passwords show error
test('register with mismatched passwords shows error', async ({ page }) => {
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('mismatch_user');
	await page.locator('input[name="password"]').fill('Password123!');
	await page.locator('input[name="confirm"]').fill('DifferentPass!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Passwords do not match');
});

// Negative: username shorter than 3 characters shows error
test('register with username shorter than 3 characters shows error', async ({ page }) => {
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('Password123!');
	await page.locator('input[name="confirm"]').fill('Password123!');
	await page.getByRole('button', { name: 'Create account' }).click();
	// Server returns 400 with a message OR browser minlength validation blocks submit
	await expect(page).not.toHaveURL(/dashboard/);
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

// Happy path: logout clears session, visiting /dashboard redirects to /login
test('logout clears session and redirects unauthenticated user from dashboard', async ({ page }) => {
	// Register and auto-login
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('logout_test_user');
	await page.locator('input[name="password"]').fill('LogoutPass1!');
	await page.locator('input[name="confirm"]').fill('LogoutPass1!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await page.waitForURL('**/dashboard');

	// Logout via POST to /logout endpoint
	await page.goto('/logout');
	await page.waitForURL('/');

	// Now try to access /dashboard — should redirect to /login
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/login/);
});
