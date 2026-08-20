import { test, expect } from '@playwright/test';

// Regression: Registration page renders correctly and enforces
// server-side validation (password mismatch, short username).

test('register page renders all required fields', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.getByLabel('Username')).toBeVisible();
	// "Password" label appears twice (Password + Confirm password); target precisely
	await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
	await expect(page.getByLabel('Confirm password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register shows error when passwords do not match', async ({ page }) => {
	await page.goto('/register');
	await page.getByLabel('Username').fill('testuser99');
	await page.getByLabel('Password', { exact: true }).fill('password123');
	await page.getByLabel('Confirm password').fill('different456');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Passwords do not match.')).toBeVisible();
});

test('register shows error for username shorter than 3 characters', async ({ page }) => {
	await page.goto('/register');
	await page.getByLabel('Username').fill('ab');
	await page.getByLabel('Password', { exact: true }).fill('password123');
	await page.getByLabel('Confirm password').fill('password123');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
});

test('register page has link to log in', async ({ page }) => {
	await page.goto('/register');
	await page.getByRole('link', { name: 'Log in' }).click();
	await expect(page).toHaveURL(/\/login/);
});
