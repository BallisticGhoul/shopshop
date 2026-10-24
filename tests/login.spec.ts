import { test, expect } from '@playwright/test';

/**
 * Login page regression tests.
 *
 * Covers the login form UI, validation error display, and the
 * show/hide password toggle. End-to-end authentication flows
 * (successful login + redirect) require a live database and are
 * excluded here; they belong in an auth e2e suite with proper setup.
 */

test('login page renders the login form', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	await expect(page.getByLabel('Username')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('login page has a link to register', async ({ page }) => {
	await page.goto('/login');
	const registerLink = page.getByRole('link', { name: 'Register' });
	await expect(registerLink).toBeVisible();
	await registerLink.click();
	await expect(page).toHaveURL('/register');
});

test('login page title is correct', async ({ page }) => {
	await page.goto('/login');
	await expect(page).toHaveTitle('Log In — ShopShop');
});

test('password field is masked by default', async ({ page }) => {
	await page.goto('/login');
	const passwordInput = page.getByLabel('Password');
	await expect(passwordInput).toHaveAttribute('type', 'password');
});

test('show password toggle reveals password text', async ({ page }) => {
	await page.goto('/login');
	const passwordInput = page.getByLabel('Password');
	await passwordInput.fill('mysecret');
	// Toggle show password
	await page.getByRole('button', { name: 'Show password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'text');
	// Toggle back to hidden
	await page.getByRole('button', { name: 'Hide password' }).click();
	await expect(passwordInput).toHaveAttribute('type', 'password');
});
