import { test, expect } from '@playwright/test';
import { registerAccount, signOut, openMailbox } from './helpers';

/**
 * The local inbox is meant to behave like a real mail system, not a log:
 * per-address mailboxes, unread state, multipart bodies, a source view,
 * search and deletion. These cover that behaviour directly.
 */

test('a new message arrives unread and is marked read when opened', async ({ page }) => {
	const account = await registerAccount(page, 'unread');

	await openMailbox(page, account.email);
	await expect(page.getByTestId('mailbox-unread')).toHaveText('1 unread');

	await page.getByTestId('inbox-list').locator('a').first().click();
	await expect(page.getByTestId('message-subject')).toHaveText('Welcome to ShopShop');

	await openMailbox(page, account.email);
	await expect(page.getByTestId('mailbox-unread')).toHaveCount(0);
});

test('mail is delivered to the addressed mailbox only', async ({ page }) => {
	const account = await registerAccount(page, 'routing');

	await openMailbox(page, account.email);
	await expect(page.getByTestId('inbox-list').locator('a')).toHaveCount(1);
	await expect(page.getByTestId('message-to')).toHaveCount(0);

	await openMailbox(page, `someone-else-${Date.now()}@mailinator.com`);
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();
});

test('addresses are case-insensitive, as real ones are', async ({ page }) => {
	const account = await registerAccount(page, 'CaseTest');

	await openMailbox(page, account.email.toUpperCase());
	await expect(page.getByTestId('inbox-list').locator('a')).toHaveCount(1);
});

test('a message carries both a text and an HTML part plus real headers', async ({ page }) => {
	const account = await registerAccount(page, 'parts');
	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();

	await expect(page.getByTestId('message-from')).toContainText('no-reply@shopshop.test');
	await expect(page.getByTestId('message-to')).toHaveText(account.email);
	await expect(page.getByTestId('message-id')).toContainText('@shopshop.test>');

	// HTML part renders in its own frame.
	await page.getByTestId('tab-html').click();
	const frame = page.frameLocator('[data-testid="message-html"]');
	await expect(frame.getByRole('heading')).toBeVisible();

	// Text part.
	await page.getByTestId('tab-text').click();
	await expect(page.getByTestId('message-body')).toContainText(account.username);

	// Source view is a real multipart document.
	await page.getByTestId('tab-raw').click();
	const raw = await page.getByTestId('message-raw').innerText();
	expect(raw).toContain('MIME-Version: 1.0');
	expect(raw).toContain('multipart/alternative; boundary=');
	expect(raw).toContain('Content-Type: text/plain; charset=utf-8');
	expect(raw).toContain('Content-Type: text/html; charset=utf-8');
	expect(raw).toContain(`To: ${account.email}`);
});

test('search filters a mailbox by subject and body', async ({ page }) => {
	const account = await registerAccount(page, 'search');
	await signOut(page);

	// A second message, so there is something to filter out.
	await page.goto('/login/email');
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	await openMailbox(page, account.email);
	await expect(page.getByTestId('inbox-list').locator('a')).toHaveCount(2);

	await page.getByTestId('mailbox-search').fill('sign-in link');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL((u) => u.searchParams.has('q'));
	await expect(page.getByTestId('inbox-list').locator('a')).toHaveCount(1);
	await expect(page.getByTestId('inbox-list')).toContainText('sign-in link');

	await page.getByTestId('mailbox-search').fill('nothing matches this');
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForURL((u) => u.searchParams.has('q'));
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();
});

test('a message can be deleted, and a mailbox emptied', async ({ page }) => {
	const account = await registerAccount(page, 'delete');

	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await page.getByTestId('delete-message').click();

	await expect(page).toHaveURL(/\/inbox\//);
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();

	await signOut(page);
	await page.goto('/login/email');
	await page.getByTestId('magic-email').fill(account.email);
	await page.getByTestId('magic-submit').click();
	await expect(page.getByTestId('magic-sent')).toBeVisible();

	await openMailbox(page, account.email);
	await page.getByTestId('empty-mailbox').click();
	await expect(page.getByTestId('emptied-notice')).toBeVisible();
});

test('the mailbox index lists addresses with unread counts', async ({ page }) => {
	const account = await registerAccount(page, 'index');

	await page.goto('/inbox');
	const row = page.getByTestId('mailbox-list').locator('a', { hasText: account.email });
	await expect(row).toBeVisible();
	await expect(row.getByTestId('unread-count')).toHaveText('1');

	// The jump form opens a mailbox directly.
	await page.locator('input[name="address"]').fill(account.email);
	await page.getByRole('button', { name: 'Open' }).click();
	await expect(page.getByTestId('mailbox-address')).toHaveText(account.email);
});

/**
 * The inbox must stay reachable without signing in. An emailed sign-in code
 * you can only read once already signed in would make the flow circular and
 * lock the account out entirely.
 */
test('the inbox is reachable with no session at all', async ({ page }) => {
	await page.context().clearCookies();

	await page.goto('/inbox');
	await expect(page.getByRole('heading', { name: 'Test Inbox' })).toBeVisible();

	await page.goto('/inbox/nobody@mailinator.com');
	await expect(page.getByTestId('mailbox-empty')).toBeVisible();

	// And it is findable from the header while signed out.
	await page.goto('/');
	await expect(page.getByTestId('nav-inbox')).toBeVisible();
	await page.getByTestId('nav-inbox').click();
	await expect(page).toHaveURL(/\/inbox$/);

	// Protected pages are still protected — the inbox is the deliberate hole.
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});

test('a signed-out user can read a message end to end', async ({ page }) => {
	const account = await registerAccount(page, 'signedout');
	await signOut(page);
	await page.context().clearCookies();

	await openMailbox(page, account.email);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await expect(page.getByTestId('message-subject')).toHaveText('Welcome to ShopShop');
	await page.getByTestId('tab-text').click();
	await expect(page.getByTestId('message-body')).toContainText(account.username);
});
