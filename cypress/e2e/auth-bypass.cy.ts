import { newAccount, type TestAccount } from '../support/e2e';

/**
 * The Cypress counterpart to Playwright's storageState: one full login
 * (password + TOTP), cached by cy.session and restored for every later test.
 */
describe('cookie-based login bypass', () => {
	const account: TestAccount = newAccount('bypass');
	let totpSecret: string;

	before(() => {
		cy.registerAccount(account);
		cy.enableTotp().then((secret) => {
			totpSecret = secret;
		});
		cy.signOut();
	});

	beforeEach(() => {
		cy.loginOnce(account, totpSecret);
	});

	it('reaches the dashboard without replaying the login', () => {
		cy.visit('/dashboard');
		cy.location('pathname').should('eq', '/dashboard');
		cy.contains('h1', `Welcome, ${account.username}`).should('be.visible');
	});

	it('restores an httpOnly session cookie and no pending-MFA cookie', () => {
		cy.getCookie('session').should('exist').and('have.property', 'httpOnly', true);
		cy.getCookie('mfa_pending').should('not.exist');
	});

	it('keeps access across separate protected pages', () => {
		cy.visit('/dashboard/security');
		cy.get('[data-testid="totp-enabled"]').should('be.visible');
		cy.visit('/dashboard');
		cy.location('pathname').should('eq', '/dashboard');
	});

	it('falls back to the login page once the cookies are cleared', () => {
		cy.clearCookies();
		cy.visit('/dashboard');
		cy.location('pathname').should('eq', '/login');
	});
});
