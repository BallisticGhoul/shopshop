describe('home page', () => {
	it('shows the hero with logged-out actions and links through to browse', () => {
		cy.visit('/');

		cy.get('h1').should('contain.text', 'ShopShop');
		cy.contains('p', 'Create and discover unique online shops.').should('be.visible');

		cy.contains('a', 'Browse Shops').should('have.attr', 'href', '/browse');
		cy.contains('a', 'Log In').should('have.attr', 'href', '/login');
		cy.contains('a', 'Create a Shop').should('have.attr', 'href', '/dashboard/shop/new');

		cy.contains('a', 'Browse Shops').click();

		cy.location('pathname').should('eq', '/browse');
		cy.contains('h1', 'Browse Shops').should('be.visible');
	});
});
