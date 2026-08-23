import { test, expect } from '@playwright/test';

// Tests for user registration — the onboarding entry point for new users.

test('register page renders form with all required fields', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.getByLabel('Username')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByLabel('Confirm password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register shows error when passwords do not match', async ({ page }) => {
	await page.goto('/register');
	await page.getByLabel('Username').fill('testuser123');
	await page.getByLabel('Password').fill('password123');
	await page.getByLabel('Confirm password').fill('differentpassword');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Passwords do not match.')).toBeVisible();
});

test('register shows error when username is too short', async ({ page }) => {
	await page.goto('/register');
	await page.getByLabel('Username').fill('ab');
	await page.getByLabel('Password').fill('password123');
	await page.getByLabel('Confirm password').fill('password123');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
});

test('register page has link to login page', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
	await page.getByRole('link', { name: 'Log in' }).click();
	await expect(page).toHaveURL(/\/login/);
});
