import { test, expect } from '@playwright/test';
import { registerAccount, signOut, openLatestEmail } from './helpers';

test('signs in by clicking the emailed link', async ({ page }) => {
	const account = await registerAccount(page, 'magic');
	await signOut(page);

	await page.goto('/login');
	await page.getByTestId('use-magic-link').click();
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	await openLatestEmail(page, account.email);
	await page.getByTestId('message-link').click();

	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('link', { name: account.username })).toBeVisible();
});

test('a magic link only works once', async ({ page }) => {
	const account = await registerAccount(page, 'once');
	await signOut(page);

	await page.goto('/login/email');
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	await openLatestEmail(page, account.email);
	const link = await page.getByTestId('message-link').getAttribute('href');
	expect(link).toBeTruthy();

	await page.goto(link!);
	await page.waitForURL('**/dashboard');
	await signOut(page);

	// Second use of the same token must be refused.
	await page.goto(link!);
	await expect(page).toHaveURL(/\/login\/email\?expired=1/);
	await expect(page.getByTestId('magic-expired')).toBeVisible();
});

test('an unknown address is not revealed as unknown', async ({ page }) => {
	await page.goto('/login/email');
	await page.getByTestId('magic-email').fill('nobody-here@mailinator.com');
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();
});
