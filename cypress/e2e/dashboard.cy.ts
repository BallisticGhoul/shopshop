describe('dashboard access', () => {
	it('redirects an anonymous visitor to the login page with a redirect back', () => {
		cy.visit('/dashboard');

		cy.location('pathname').should('eq', '/login');
		cy.location('search').should('eq', '?redirect=%2Fdashboard');
		cy.contains('h1', 'Log in').should('be.visible');
	});
});
