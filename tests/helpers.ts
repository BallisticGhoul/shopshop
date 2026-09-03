import type { Page } from '@playwright/test';

export const TEST_PASSWORD = 'correct-horse-battery-9';

export interface TestAccount {
	username: string;
	email: string;
	password: string;
}

/** Register a brand-new account. Leaves the browser signed in. */
export async function registerAccount(page: Page, prefix = 'qa'): Promise<TestAccount> {
	const username = `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
	const account = {
		username,
		email: `${username}@mailinator.com`,
		password: TEST_PASSWORD
	};

	await page.goto('/register');
	await page.fill('input[name="username"]', account.username);
	await page.fill('input[name="email"]', account.email);
	await page.fill('input[name="password"]', account.password);
	await page.fill('input[name="confirm"]', account.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('**/dashboard');

	return account;
}

/** Turn on TOTP for the signed-in user and return the shared secret. */
export async function enableTotp(page: Page): Promise<string> {
	const { totpCode } = await import('../src/lib/server/totp');
	await page.goto('/dashboard/security');
	await page.getByTestId('totp-begin').click();
	const secret = (await page.getByTestId('totp-secret').innerText()).trim();
	await page.getByTestId('totp-confirm-code').fill(await totpCode(secret));
	await page.getByTestId('totp-confirm').click();
	await page.getByTestId('recovery-codes').waitFor();
	return secret;
}

export async function signOut(page: Page): Promise<void> {
	await page.getByRole('button', { name: 'Log out' }).click();
	await page.waitForURL('http://localhost:5173/');
}

/** Open a mailbox, as a person would. */
export async function openMailbox(page: Page, address: string): Promise<void> {
	await page.goto(`/inbox/${encodeURIComponent(address.trim().toLowerCase())}`);
	await waitForHydration(page);
}

/**
 * Open the newest message and switch to its plain-text part, which is where
 * links are directly clickable — the same tab a QA suite drives on a hosted
 * mail viewer.
 */
export async function openLatestEmail(page: Page, address: string): Promise<void> {
	await openMailbox(page, address);
	await page.getByTestId('inbox-list').locator('a').first().click();
	await page.getByTestId('tab-text').click();
	await page.getByTestId('message-body').waitFor();
}

/** Pull the six-digit code out of the newest email's subject line. */
export async function readCodeFromLatestEmail(page: Page, address: string): Promise<string> {
	await openLatestEmail(page, address);
	const subject = await page.getByTestId('message-subject').innerText();
	const match = subject.match(/\b(\d{6})\b/);
	if (!match) throw new Error(`No six-digit code in subject: ${subject}`);
	return match[1];
}

/**
 * Wait until SvelteKit has taken over the page. Typing into a form before
 * this point can be lost: hydration reassigns input values from server data,
 * silently discarding anything already entered.
 */
export async function waitForHydration(page: Page): Promise<void> {
	await page.locator('html[data-hydrated]').waitFor();
}
