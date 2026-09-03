import { newAccount, type TestAccount } from '../support/e2e';

describe('email sign-in link', () => {
	const account: TestAccount = newAccount('cymagic');

	before(() => {
		cy.registerAccount(account);
		cy.signOut();
	});

	it('signs in by following the emailed link', () => {
		cy.visit('/login');
		cy.get('[data-testid="use-magic-link"]').click();
		cy.get('[data-testid="magic-email"]').type(account.email);
		cy.get('[data-testid="magic-submit"]').click();
		cy.get('[data-testid="magic-sent"]').should('be.visible');

		cy.visit(`/inbox/${encodeURIComponent(account.email)}`);
		cy.get('[data-testid="inbox-list"] a').first().click();
		cy.get('[data-testid="tab-text"]').click();
		cy.get('[data-testid="message-link"]')
			.invoke('attr', 'href')
			.then((href) => {
				cy.visit(href as string);
			});

		cy.location('pathname').should('eq', '/dashboard');
		cy.contains('h1', `Welcome, ${account.username}`).should('be.visible');
	});
});

describe('the local mailbox behaves like a mail client', () => {
	const account: TestAccount = newAccount('cyinbox');

	before(() => {
		cy.registerAccount(account);
	});

	it('shows the welcome message as unread, then read once opened', () => {
		cy.visit(`/inbox/${encodeURIComponent(account.email)}`);
		cy.get('[data-testid="mailbox-unread"]').should('contain', '1 unread');

		cy.get('[data-testid="inbox-list"] a').first().click();
		cy.get('[data-testid="message-subject"]').should('have.text', 'Welcome to ShopShop');

		cy.visit(`/inbox/${encodeURIComponent(account.email)}`);
		cy.get('[data-testid="mailbox-unread"]').should('not.exist');
	});

	it('exposes the raw multipart source', () => {
		cy.visit(`/inbox/${encodeURIComponent(account.email)}`);
		cy.get('[data-testid="inbox-list"] a').first().click();
		cy.get('[data-testid="tab-raw"]').click();
		cy.get('[data-testid="message-raw"]')
			.should('contain', 'MIME-Version: 1.0')
			.and('contain', 'multipart/alternative; boundary=')
			.and('contain', `To: ${account.email}`);
	});
});

describe('inbox access', () => {
	it('is reachable with no session, unlike the dashboard', () => {
		cy.clearCookies();

		cy.visit('/inbox');
		cy.contains('h1', 'Test Inbox').should('be.visible');
		cy.get('[data-testid="nav-inbox"]').should('be.visible');

		cy.visit('/inbox/nobody@mailinator.com');
		cy.get('[data-testid="mailbox-empty"]').should('be.visible');

		cy.visit('/dashboard');
		cy.location('pathname').should('eq', '/login');
	});
});
