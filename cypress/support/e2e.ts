// Loaded before every spec file. Add custom commands or global hooks here.
import { totpCode } from '../../src/lib/server/totp';

export interface TestAccount {
	username: string;
	email: string;
	password: string;
}

export const TEST_PASSWORD = 'correct-horse-battery-9';

export function newAccount(prefix = 'cy'): TestAccount {
	const username = `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
	return { username, email: `${username}@mailinator.com`, password: TEST_PASSWORD };
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			registerAccount(account: TestAccount): Chainable<void>;
			enableTotp(): Chainable<string>;
			signOut(): Chainable<void>;
			/**
			 * Cypress's answer to Playwright's storageState: the cookie jar
			 * produced by the full login is cached under `account.username` and
			 * restored for every later test instead of replaying the UI.
			 */
			loginOnce(account: TestAccount, totpSecret: string): Chainable<void>;
		}
	}
}

Cypress.Commands.add('registerAccount', (account: TestAccount) => {
	cy.visit('/register');
	cy.get('html[data-hydrated]');
	cy.get('input[name="username"]').type(account.username);
	cy.get('input[name="email"]').type(account.email);
	cy.get('input[name="password"]').type(account.password);
	cy.get('input[name="confirm"]').type(account.password);
	cy.get('button[type="submit"]').click();
	cy.location('pathname').should('eq', '/dashboard');
});

Cypress.Commands.add('enableTotp', () => {
	cy.visit('/dashboard/security');
	cy.get('html[data-hydrated]');
	cy.get('[data-testid="totp-begin"]').click();
	return cy
		.get('[data-testid="totp-secret"]')
		.invoke('text')
		.then((raw) => {
			const secret = raw.trim();
			return cy.wrap(totpCode(secret)).then((code) => {
				cy.get('[data-testid="totp-confirm-code"]').type(code as unknown as string);
				cy.get('[data-testid="totp-confirm"]').click();
				cy.get('[data-testid="recovery-codes"]').should('be.visible');
				return cy.wrap(secret);
			});
		});
});

Cypress.Commands.add('signOut', () => {
	cy.contains('button', 'Log out').click();
	cy.location('pathname').should('eq', '/');
});

Cypress.Commands.add('loginOnce', (account: TestAccount, totpSecret: string) => {
	cy.session(
		account.username,
		() => {
			cy.visit('/login');
			cy.get('html[data-hydrated]');
			cy.get('input[name="username"]').type(account.username);
			cy.get('input[name="password"]').type(account.password);
			cy.get('button[type="submit"]').click();
			cy.location('pathname').should('eq', '/login/mfa');

			cy.wrap(totpCode(totpSecret)).then((code) => {
				cy.get('[data-testid="mfa-code"]').type(code as unknown as string);
				cy.get('[data-testid="mfa-submit"]').click();
			});
			cy.location('pathname').should('eq', '/dashboard');
		},
		{
			validate() {
				cy.getCookie('session').should('exist');
			}
		}
	);
});
