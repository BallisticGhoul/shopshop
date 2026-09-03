import { test, expect } from '@playwright/test';
import { totpCode } from '../src/lib/server/totp';
import { registerAccount, enableTotp, signOut, readCodeFromLatestEmail } from './helpers';

test('password alone is not enough once TOTP is on', async ({ page }) => {
	const account = await registerAccount(page, 'totp');
	await enableTotp(page);
	await signOut(page);

	await page.goto('/login');
	await page.fill('input[name="username"]', account.username);
	await page.fill('input[name="password"]', account.password);
	await page.click('button[type="submit"]');

	await expect(page).toHaveURL(/\/login\/mfa/);

	// The half-authenticated state must not open protected pages.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});

test('completes sign-in with an authenticator code', async ({ page }) => {
	const account = await registerAccount(page, 'totp');
	const secret = await enableTotp(page);
	await signOut(page);

	await page.goto('/login');
	await page.fill('input[name="username"]', account.username);
	await page.fill('input[name="password"]', account.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/login/mfa**');

	await page.getByTestId('mfa-code').fill(await totpCode(secret));
	await page.getByTestId('mfa-submit').click();

	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('link', { name: account.username })).toBeVisible();
});

test('rejects a wrong authenticator code', async ({ page }) => {
	const account = await registerAccount(page, 'totp');
	await enableTotp(page);
	await signOut(page);

	await page.goto('/login');
	await page.fill('input[name="username"]', account.username);
	await page.fill('input[name="password"]', account.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/login/mfa**');

	await page.getByTestId('mfa-code').fill('000000');
	await page.getByTestId('mfa-submit').click();

	await expect(page.getByTestId('mfa-error')).toBeVisible();
	await expect(page).toHaveURL(/\/login\/mfa/);
});

test('completes sign-in with a code sent by email instead', async ({ page }) => {
	const account = await registerAccount(page, 'emailotp');
	await enableTotp(page);
	await signOut(page);

	await page.goto('/login');
	await page.fill('input[name="username"]', account.username);
	await page.fill('input[name="password"]', account.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/login/mfa**');

	await page.getByTestId('mfa-email-code').click();
	await expect(page.getByTestId('mfa-code-sent')).toBeVisible();

	const code = await readCodeFromLatestEmail(page, account.email);

	await page.goto('/login/mfa');
	await page.getByTestId('mfa-code').fill(code);
	await page.getByTestId('mfa-submit').click();

	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('link', { name: account.username })).toBeVisible();
});
