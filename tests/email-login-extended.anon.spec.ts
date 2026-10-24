import { test, expect } from '@playwright/test';
import { registerAccount, signOut, openLatestEmail } from './helpers';

/**
 * Email sign-in and inbox behaviour — migrated from cypress/e2e/email-login.cy.ts.
 *
 * The existing magic-link.anon.spec.ts already covers the "signs in by clicking
 * the emailed link" flow. This file covers the three remaining Cypress cases:
 *   - mailbox unread → read state transition
 *   - raw multipart source view
 *   - inbox reachable with no session while dashboard stays protected
 *
 * All tests use .anon.spec.ts so they start without a session (chromium-anon
 * project), matching the original Cypress intent.
 */

test('shows the welcome message as unread, then read once opened', async ({ page }) => {
	const account = await registerAccount(page, 'cyinbox');

	await page.goto(`/inbox/${encodeURIComponent(account.email)}`);
	await expect(page.getByTestId('mailbox-unread')).toContainText('1 unread');

	await page.getByTestId('inbox-list').locator('a').first().click();
	await expect(page.getByTestId('message-subject')).toHaveText('Welcome to ShopShop');

	// Revisit the mailbox — unread badge must be gone.
	await page.goto(`/inbox/${encodeURIComponent(account.email)}`);
	await expect(page.getByTestId('mailbox-unread')).toHaveCount(0);
});

test('exposes the raw multipart source', async ({ page }) => {
	const account = await registerAccount(page, 'cyraw');

	await page.goto(`/inbox/${encodeURIComponent(account.email)}`);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await page.getByTestId('tab-raw').click();

	const rawText = await page.getByTestId('message-raw').innerText();
	expect(rawText).toContain('MIME-Version: 1.0');
	expect(rawText).toContain('multipart/alternative; boundary=');
	expect(rawText).toContain(`To: ${account.email}`);
});

test('inbox is reachable with no session, unlike the dashboard', async ({ page }) => {
	// Start with a completely clean context — no session at all.
	await page.context().clearCookies();

	await page.goto('/inbox');
	await expect(page.getByRole('heading', { name: 'Test Inbox' })).toBeVisible();
	await expect(page.getByTestId('nav-inbox')).toBeVisible();

	// An empty mailbox for an unknown address is fine.
	await page.goto('/inbox/nobody@mailinator.com');
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();

	// Dashboard is still gated — anonymous visitor is redirected to login.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});
