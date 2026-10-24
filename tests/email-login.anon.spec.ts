import { test, expect } from '@playwright/test';
import { registerAccount, signOut, openLatestEmail, openMailbox } from './helpers';

/**
 * Email / magic-link sign-in flow — migrated from cypress/e2e/email-login.cy.ts.
 *
 * These specs run in the chromium-anon project (*.anon.spec.ts) because they
 * start unauthenticated, register fresh accounts, and exercise the full
 * magic-link journey through the local test inbox.
 */

test('signs in by following the emailed magic link', async ({ page }) => {
	const account = await registerAccount(page, 'magic');
	await signOut(page);

	// Request a magic-link for the fresh account.
	await page.goto('/login');
	await page.getByTestId('use-magic-link').click();
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	// Open the emailed link from the test inbox (text tab exposes a clickable link).
	await openLatestEmail(page, account.email);
	await page.getByTestId('message-link').click();

	// Should land on the dashboard, signed in as the new account.
	await page.waitForURL('**/dashboard');
	await expect(page.getByRole('link', { name: account.username })).toBeVisible();
});

test('shows the welcome message as unread, then marks it read once opened', async ({ page }) => {
	const account = await registerAccount(page, 'inbox');

	await openMailbox(page, account.email);
	// The welcome email should be counted as unread.
	await expect(page.getByTestId('mailbox-unread')).toContainText('1 unread');

	// Open the message.
	await page.getByTestId('inbox-list').locator('a').first().click();
	await expect(page.getByTestId('message-subject')).toHaveText('Welcome to ShopShop');

	// Revisit the mailbox — no more unread badge.
	await openMailbox(page, account.email);
	await expect(page.getByTestId('mailbox-unread')).toHaveCount(0);
});

test('exposes the raw multipart source of a message', async ({ page }) => {
	const account = await registerAccount(page, 'raw');

	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();

	await page.getByTestId('tab-raw').click();
	const raw = await page.getByTestId('message-raw').innerText();
	expect(raw).toContain('MIME-Version: 1.0');
	expect(raw).toContain('multipart/alternative; boundary=');
	expect(raw).toContain(`To: ${account.email}`);
});

test('inbox is reachable with no session, unlike the dashboard', async ({ page }) => {
	await page.context().clearCookies();

	// The inbox must be accessible while signed out.
	await page.goto('/inbox');
	await expect(page.getByRole('heading', { name: 'Test Inbox' })).toBeVisible();
	await expect(page.getByTestId('nav-inbox')).toBeVisible();

	// An empty mailbox returns an empty-state, not an error.
	await page.goto('/inbox/nobody@mailinator.com');
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();

	// Protected pages still redirect.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
