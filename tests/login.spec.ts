import { test, expect } from '@playwright/test';

// Tests for the login page — a critical auth gate for all authenticated features.

test('login page renders form with username and password fields', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.getByLabel('Username')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login page shows error for invalid credentials', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Username').fill('nonexistentuser');
	await page.getByLabel('Password').fill('wrongpassword');
	await page.getByRole('button', { name: 'Log in' }).click();
	await expect(page.getByText('Invalid username or password.')).toBeVisible();
});

test('login page has link to register page', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
	await page.getByRole('link', { name: 'Register' }).click();
	await expect(page).toHaveURL(/\/register/);
});

test('login page toggle shows and hides password', async ({ page }) => {
	await page.goto('/login');
	const passwordInput = page.getByLabel('Password');
	await expect(passwordInput).toHaveAttribute('type', 'password');
	await page.getByRole('button', { name: 'Show password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'text');
	await page.getByRole('button', { name: 'Hide password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'password');
});
