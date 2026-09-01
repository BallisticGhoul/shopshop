// The cart lives in an in-memory Svelte store, so a full page load (cy.visit)
// would reset it. Reach /cart by clicking the header link, which the SvelteKit
// router handles client-side and therefore keeps the store intact.
describe('cart', () => {
	beforeEach(() => {
		cy.visit('/shops/1');

		// SvelteKit injects #svelte-announcer only once the client app has
		// hydrated. Clicking before that point is a no-op, because the button's
		// handler is not attached yet.
		cy.get('#svelte-announcer').should('exist');

		cy.contains('h4', 'Placeholder Product A')
			.closest('.card')
			.contains('button', 'Add to cart')
			.click();

		cy.get('.badge').should('have.text', '1');

		cy.get('a[aria-label="Cart"]').click();
		cy.location('pathname').should('eq', '/cart');
	});

	it('shows the added product with its shop, subtotal and total', () => {
		cy.get('.badge').should('have.text', '1');

		cy.contains('.name', 'Placeholder Product A').should('be.visible');
		cy.contains('.shop', 'Placeholder Shop 1').should('be.visible');
		cy.contains('.subtotal', '$19.99').should('be.visible');
		cy.contains('.total', '$19.99').should('be.visible');
	});

	it('recalculates on a quantity change and empties when the item is removed', () => {
		cy.get('button[aria-label="Increase quantity"]').click();

		cy.get('.qty').should('have.text', '2');
		cy.contains('.subtotal', '$39.98').should('be.visible');
		cy.get('.badge').should('have.text', '2');

		cy.get('button[aria-label="Remove"]').click();

		cy.contains('Your cart is empty.').should('be.visible');
		cy.get('.badge').should('not.exist');
	});
});
