// The seeded catalogue is 12 mock shops and the page size is 9, so browse
// paginates into two pages. Only shop 1 has products.
const SHOP_CARD = 'a[href^="/shops/"]';

describe('browse page', () => {
	it('lists the first page of shops with pagination', () => {
		cy.visit('/browse');

		cy.contains('h1', 'Browse Shops').should('be.visible');
		cy.get(SHOP_CARD).should('have.length', 9);
		cy.contains('.meta', 'Page 1 of 2').should('be.visible');
		cy.contains('h3', 'Placeholder Shop 1').should('be.visible');
	});

	it('moves to the second page and shows the remaining shops', () => {
		cy.visit('/browse');

		cy.contains('a', 'Next').first().click();

		cy.location('search').should('include', 'page=2');
		cy.get(SHOP_CARD).should('have.length', 3);
		cy.contains('.meta', 'Page 2 of 2').should('be.visible');
		cy.contains('h3', 'Placeholder Shop 12').should('be.visible');
	});

	it('narrows results by shop name and restores them with Clear', () => {
		cy.visit('/browse');

		cy.get('input[name="q"]').type('12');
		cy.contains('button', 'Search').click();

		cy.location('search').should('eq', '?q=12');
		cy.get(SHOP_CARD).should('have.length', 1);
		cy.contains('h3', 'Placeholder Shop 12').should('be.visible');
		cy.contains('.meta', '1 result').should('be.visible');

		cy.contains('a', 'Clear').click();

		cy.location('search').should('eq', '');
		cy.get(SHOP_CARD).should('have.length', 9);
	});

	it('surfaces a shop when the query only matches one of its products', () => {
		cy.visit('/browse?q=Product');

		cy.get(SHOP_CARD).should('have.length', 1);
		cy.contains('h3', 'Placeholder Shop 1').should('be.visible');
		cy.contains('.meta', '1 result').should('be.visible');
	});

	it('shows an empty state when nothing matches the query', () => {
		cy.visit('/browse?q=nonexistentquery');

		cy.get(SHOP_CARD).should('not.exist');
		cy.contains('No shops or products matched').should('be.visible');
		cy.contains('.meta', '0 results').should('be.visible');
	});
});
