import { test, expect } from '@playwright/test';

// ── Test 5: Negative — mismatched passwords show error ──
test('register with mismatched passwords shows error', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

	await page.getByLabel('Username').fill('newuser_test');
	// Fill password fields via name attributes to avoid label ambiguity
	await page.locator('input[name="password"]').fill('MyPassword1!');
	await page.locator('input[name="confirm"]').fill('DifferentPassword!');
	await page.getByRole('button', { name: 'Create account' }).click();

	// Should remain on register and display mismatch error
	await expect(page).toHaveURL(/\/register/);
	await expect(page.locator('.error')).toBeVisible();
	await expect(page.locator('.error')).toContainText('Passwords do not match.');
});

// ── Test 6: Edge case — username shorter than 3 characters is rejected ──
test('register with username shorter than 3 characters shows error', async ({ page }) => {
	await page.goto('/register');

	// Two-character username — below the min length of 3
	await page.locator('input[name="username"]').fill('ab');
	await page.locator('input[name="password"]').fill('ValidPass1!');
	await page.locator('input[name="confirm"]').fill('ValidPass1!');
	await page.getByRole('button', { name: 'Create account' }).click();

	// Browser-side minlength="3" should block submission; user stays on /register
	await expect(page).toHaveURL(/\/register/);
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
});

// ── Test 7: Negative — empty form shows validation errors ──
test('register with empty form fields stays on page', async ({ page }) => {
	await page.goto('/register');

	// Submit without any input
	await page.getByRole('button', { name: 'Create account' }).click();

	// HTML required attributes prevent submission — stays on /register
	await expect(page).toHaveURL(/\/register/);
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
});
