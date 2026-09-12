import { test, expect } from '@playwright/test';
import { registerAccount, signOut, openMailbox } from './helpers';

/**
 * Email sign-in and inbox behaviour – migrated from cypress/e2e/email-login.cy.ts.
 *
 * All flows here start unauthenticated (chromium-anon project): registration
 * creates a fresh account per test, and magic-link tests rely on the inbox
 * being accessible without a session.
 */

test('signs in by following the emailed link', async ({ page }) => {
	const account = await registerAccount(page, 'magic');
	await signOut(page);

	// Request the magic link.
	await page.goto('/login');
	await page.getByTestId('use-magic-link').click();
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	// Open the inbox, pick the newest message and switch to its text part.
	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await page.getByTestId('tab-text').click();

	// Follow the sign-in link from the email body.
	await page.getByTestId('message-link').click();

	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('heading', { name: /^Welcome, / })).toBeVisible();
});

test('shows the welcome message as unread, then read once opened', async ({ page }) => {
	const account = await registerAccount(page, 'inbox');

	await openMailbox(page, account.email);
	await expect(page.getByTestId('mailbox-unread')).toContainText('1 unread');

	// Open the message.
	await page.getByTestId('inbox-list').locator('a').first().click();
	await expect(page.getByTestId('message-subject')).toHaveText('Welcome to ShopShop');

	// Revisit the mailbox – the unread badge should be gone.
	await openMailbox(page, account.email);
	await expect(page.getByTestId('mailbox-unread')).toHaveCount(0);
});

test('exposes the raw multipart source', async ({ page }) => {
	const account = await registerAccount(page, 'raw');

	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await page.getByTestId('tab-raw').click();

	const raw = await page.getByTestId('message-raw').innerText();
	expect(raw).toContain('MIME-Version: 1.0');
	expect(raw).toContain('multipart/alternative; boundary=');
	expect(raw).toContain(`To: ${account.email}`);
});

test('inbox access: reachable with no session, unlike the dashboard', async ({ page }) => {
	await page.context().clearCookies();

	// The inbox landing page is accessible without a session.
	await page.goto('/inbox');
	await expect(page.getByRole('heading', { name: 'Test Inbox' })).toBeVisible();
	await expect(page.getByTestId('nav-inbox')).toBeVisible();

	// An empty mailbox is also accessible.
	await page.goto('/inbox/nobody@mailinator.com');
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();

	// The dashboard remains protected.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
