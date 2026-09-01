describe('shop page', () => {
	it('lists the shop products and disables Add to cart for sold-out stock', () => {
		cy.visit('/shops/1');

		cy.contains('h1', 'Placeholder Shop 1').should('be.visible');
		cy.get('.card').should('have.length', 3);

		cy.contains('h4', 'Placeholder Product A')
			.closest('.card')
			.within(() => {
				cy.contains('.price', '$19.99').should('be.visible');
				cy.contains('button', 'Add to cart').should('be.enabled');
			});

		// Product B has stock 0.
		cy.contains('h4', 'Placeholder Product B')
			.closest('.card')
			.within(() => {
				cy.contains('Sold out').should('be.visible');
				cy.contains('button', 'Add to cart').should('be.disabled');
			});
	});
});
