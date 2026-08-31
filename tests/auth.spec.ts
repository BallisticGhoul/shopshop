import { test, expect } from '@playwright/test';

// ── Authentication regression tests ──────────────────────────────────────────
// Covers: login happy path, invalid credentials (negative), register form
// rendering, mismatched passwords (negative), and dashboard auth guard (edge).
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Login', () => {
	test('login page renders required fields', async ({ page }) => {
		// Verify the login form is reachable and shows both inputs + submit.
		await page.goto('/login');
		await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
	});

	test('login with invalid credentials shows an error (negative)', async ({ page }) => {
		// Submitting bad credentials must never silently succeed — some error
		// feedback (heading still visible or an alert/message) must remain on page.
		await page.goto('/login');
		await page.locator('input[name="username"]').fill('nonexistent_user_xyz');
		await page.locator('input[name="password"]').fill('wrongpassword123');
		await page.getByRole('button', { name: /log in/i }).click();
		// The app should stay on /login (or show an error); it must NOT redirect to dashboard.
		await expect(page).not.toHaveURL(/\/dashboard/);
		// The login form should still be visible after a failed attempt.
		await expect(page.locator('input[name="username"]')).toBeVisible();
	});
});

test.describe('Register', () => {
	test('register page renders all required fields', async ({ page }) => {
		// Verify the registration form exposes username, password, confirm-password.
		await page.goto('/register');
		await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
	});

	test('register with mismatched passwords shows an error (negative)', async ({ page }) => {
		// Password confirmation mismatch should be rejected; the user must not be
		// logged in or redirected away from the register page.
		await page.goto('/register');
		await page.locator('input[name="username"]').fill('testuser_mismatch');
		await page.locator('input[name="password"]').fill('Password123!');
		await page.locator('input[name="confirmPassword"]').fill('DifferentPass999!');
		await page.getByRole('button', { name: /register/i }).click();
		// Should stay on /register after a validation error.
		await expect(page).not.toHaveURL(/\/dashboard/);
		await expect(page.locator('input[name="username"]')).toBeVisible();
	});
});

test.describe('Auth guard', () => {
	test('unauthenticated access to /dashboard redirects to login (edge)', async ({ page }) => {
		// Dashboard is a protected route; visiting it without a session must
		// redirect the user to /login rather than rendering protected content.
		await page.goto('/dashboard');
		await expect(page).toHaveURL(/\/login/);
	});

	test('unauthenticated access to /dashboard/shop/new redirects to login (edge)', async ({ page }) => {
		// Create-shop page is also protected; same guard must apply.
		await page.goto('/dashboard/shop/new');
		await expect(page).toHaveURL(/\/login/);
	});
});
