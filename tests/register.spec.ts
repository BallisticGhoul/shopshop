import { test, expect } from '@playwright/test';

// ── Register ───────────────────────────────────────────────────────────────

test('register page renders all form fields', async ({ page }) => {
	// Happy path: registration form is accessible and complete
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.locator('input[name="confirm"]')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('register shows error when passwords do not match', async ({ page }) => {
	// Negative: mismatched passwords must be rejected with an inline error
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('testuser99');
	await page.locator('input[name="password"]').fill('SecurePass1!');
	await page.locator('input[name="confirm"]').fill('DifferentPass2!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Passwords do not match.')).toBeVisible();
	await expect(page).toHaveURL(/\/register/);
});

test('register shows error when username is too short (edge case)', async ({ page }) => {
	// Edge case: username boundary — less than 3 characters must be rejected
	await page.goto('/register');
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('SecurePass1!');
	await page.locator('input[name="confirm"]').fill('SecurePass1!');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
});
