import { test as setup, expect } from '@playwright/test';
import { totpCode } from '../src/lib/server/totp';

/**
 * Pays for the expensive login exactly once per run: register, enrol TOTP,
 * sign out, then sign back in through the full password + second-factor
 * challenge. The resulting cookie jar is written to disk and every other
 * spec loads it via `storageState`, skipping the UI login entirely.
 */

export const AUTH_FILE = 'playwright/.auth/user.json';

const PASSWORD = 'correct-horse-battery-9';

setup('create authenticated storage state', async ({ page }) => {
	// A fresh account per run: the dev server's KV is in-memory and is wiped
	// whenever it restarts, so nothing may be assumed to already exist.
	const username = `qa_${Date.now().toString(36)}`;
	const email = `${username}@mailinator.com`;

	await page.goto('/register');
	await page.fill('input[name="username"]', username);
	await page.fill('input[name="email"]', email);
	await page.fill('input[name="password"]', PASSWORD);
	await page.fill('input[name="confirm"]', PASSWORD);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/dashboard');

	// Enrol a second factor, so the login being bypassed is a genuinely
	// multi-step one rather than a single form post.
	await page.goto('/dashboard/security');
	await page.getByTestId('totp-begin').click();
	const totpSecret = (await page.getByTestId('totp-secret').innerText()).trim();
	await page.getByTestId('totp-confirm-code').fill(await totpCode(totpSecret));
	await page.getByTestId('totp-confirm').click();
	await expect(page.getByTestId('recovery-codes')).toBeVisible();

	await page.getByRole('button', { name: 'Log out' }).click();
	await page.waitForURL('http://localhost:5173/');

	// The full sign-in path, exercised once.
	await page.goto('/login');
	await page.fill('input[name="username"]', username);
	await page.fill('input[name="password"]', PASSWORD);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/login/mfa**');
	await page.getByTestId('mfa-code').fill(await totpCode(totpSecret));
	await page.getByTestId('mfa-submit').click();
	await page.waitForURL('**/dashboard');

	await expect(page.getByRole('link', { name: username })).toBeVisible();

	// Playwright creates the directory for us.
	await page.context().storageState({ path: AUTH_FILE });

	console.log(`[setup] authenticated as ${username} (${email}); state -> ${AUTH_FILE}`);
});
