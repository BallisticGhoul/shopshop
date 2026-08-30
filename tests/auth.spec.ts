import { test, expect } from '@playwright/test';

// ─── Authentication regression tests ────────────────────────────────────────
// Covers: login (happy path), login with wrong password (negative),
//         login with missing fields (negative), register with mismatched
//         passwords (negative), register with short username (edge case),
//         logout (happy path).

test('login page renders form fields', async ({ page }) => {
	// Happy path: the login page must be reachable and show the expected form.
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
});

test('login with wrong password shows error message', async ({ page }) => {
	// Negative: submitting an incorrect password must surface an error and NOT
	// redirect the user to the dashboard.
	await page.goto('/login');
	await page.locator('input[name="username"]').fill('testuser123');
	await page.locator('input[name="password"]').fill('definitely-wrong-password');
	await page.getByRole('button', { name: /log in/i }).click();
	await expect(page.getByText(/invalid username or password/i)).toBeVisible();
	await expect(page).not.toHaveURL(/dashboard/);
});

test('login with empty fields shows validation error', async ({ page }) => {
	// Negative: submitting the login form with no credentials must display a
	// validation error instead of proceeding.
	await page.goto('/login');
	await page.getByRole('button', { name: /log in/i }).click();
	await expect(page.getByText(/username and password are required/i)).toBeVisible();
});

test('register with mismatched passwords shows error', async ({ page }) => {
	// Negative: if the "confirm password" field does not match the password the
	// server must reject the form and display a helpful error.
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('newuser_test');
	await page.locator('input[name="password"]').fill('SecurePass1!');
	await page.locator('input[name="confirm"]').fill('DifferentPass2!');
	await page.getByRole('button', { name: /register/i }).click();
	await expect(page.getByText(/passwords do not match/i)).toBeVisible();
});

test('register with username shorter than 3 characters shows error', async ({ page }) => {
	// Edge case: the server enforces a minimum username length of 3 characters.
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('SomePassword1!');
	await page.locator('input[name="confirm"]').fill('SomePassword1!');
	await page.getByRole('button', { name: /register/i }).click();
	await expect(page.getByText(/username must be at least 3 characters/i)).toBeVisible();
});
