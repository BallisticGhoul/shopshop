import { test, expect } from '@playwright/test';

/**
 * Registration page regression tests.
 *
 * Covers the form UI, field constraints visible in the DOM, password
 * visibility toggles, and navigation to login. Actual account-creation
 * flows require an isolated DB and belong in a dedicated auth e2e suite.
 */

test('register page renders the create account form', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.getByLabel('Username')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByLabel('Confirm password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register page title is correct', async ({ page }) => {
	await page.goto('/register');
	await expect(page).toHaveTitle('Register — ShopShop');
});

test('register page has a link to login', async ({ page }) => {
	await page.goto('/register');
	const loginLink = page.getByRole('link', { name: 'Log in' });
	await expect(loginLink).toBeVisible();
	await loginLink.click();
	await expect(page).toHaveURL('/login');
});

test('username field enforces minlength of 3', async ({ page }) => {
	await page.goto('/register');
	// The minlength constraint is declared on the input element itself
	const usernameInput = page.getByLabel('Username');
	await expect(usernameInput).toHaveAttribute('minlength', '3');
});

test('password field is masked by default', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');
	await expect(page.getByLabel('Confirm password')).toHaveAttribute('type', 'password');
});

test('show password toggle works on password field', async ({ page }) => {
	await page.goto('/register');
	const passwordInput = page.getByLabel('Password');
	await passwordInput.fill('secret123');
	// There are two "Show password" buttons — grab the first (password field)
	await page.getByRole('button', { name: 'Show password' }).first().click();
	await expect(passwordInput).toHaveAttribute('type', 'text');
});
