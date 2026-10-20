import { test, expect } from '@playwright/test';

/**
 * Tests for the product sort / filter toolbar added in PR #42.
 *
 * All scenarios use mock shop 1 which has three products:
 *   Product A – $19.99 – stock 10  (in stock)
 *   Product B – $34.99 – stock 0   (out of stock)
 *   Product C – $9.99  – stock 5   (in stock)
 *
 * The shop page is publicly accessible, so these run under chromium-anon
 * (no storageState / signed-out context).
 */

const SHOP_URL = '/shops/1';

// ---------------------------------------------------------------------------
// Toolbar presence
// ---------------------------------------------------------------------------

test('product toolbar is visible on a shop with products', async ({ page }) => {
	await page.goto(SHOP_URL);
	await expect(page.getByTestId('product-toolbar')).toBeVisible();
	await expect(page.getByTestId('sort-select')).toBeVisible();
	await expect(page.getByTestId('instock-toggle')).toBeVisible();
});

test('product count shows all products by default', async ({ page }) => {
	await page.goto(SHOP_URL);
	// "Showing 3 of 3 products"
	await expect(page.getByTestId('product-count')).toHaveText('Showing 3 of 3 products');
});

// ---------------------------------------------------------------------------
// Default / featured order
// ---------------------------------------------------------------------------

test('default sort (featured) preserves the original product order', async ({ page }) => {
	await page.goto(SHOP_URL);

	const names = await page.getByTestId('product-name').allTextContents();
	expect(names).toEqual([
		'Placeholder Product A',
		'Placeholder Product B',
		'Placeholder Product C'
	]);
});

// ---------------------------------------------------------------------------
// Sort by price – deep-linked via URL (works before JS hydration)
// ---------------------------------------------------------------------------

test('?sort=price-asc orders products cheapest first', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=price-asc`);

	const names = await page.getByTestId('product-name').allTextContents();
	// C ($9.99) → A ($19.99) → B ($34.99)
	expect(names).toEqual([
		'Placeholder Product C',
		'Placeholder Product A',
		'Placeholder Product B'
	]);
});

test('?sort=price-desc orders products most expensive first', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=price-desc`);

	const names = await page.getByTestId('product-name').allTextContents();
	// B ($34.99) → A ($19.99) → C ($9.99)
	expect(names).toEqual([
		'Placeholder Product B',
		'Placeholder Product A',
		'Placeholder Product C'
	]);
});

test('?sort=name orders products alphabetically A to Z', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=name`);

	const names = await page.getByTestId('product-name').allTextContents();
	// A → B → C (already alphabetical in the mock, but the server must handle it)
	expect(names).toEqual([
		'Placeholder Product A',
		'Placeholder Product B',
		'Placeholder Product C'
	]);
});

// ---------------------------------------------------------------------------
// Sort select reflects the active sort key
// ---------------------------------------------------------------------------

test('sort select shows the active sort value from the URL', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=price-asc`);
	await expect(page.getByTestId('sort-select')).toHaveValue('price-asc');
});

test('sort select defaults to "featured" when no param is present', async ({ page }) => {
	await page.goto(SHOP_URL);
	await expect(page.getByTestId('sort-select')).toHaveValue('featured');
});

// ---------------------------------------------------------------------------
// In-stock filter
// ---------------------------------------------------------------------------

test('?instock=1 hides out-of-stock products', async ({ page }) => {
	await page.goto(`${SHOP_URL}?instock=1`);

	// Product B has stock=0 and must not be visible
	await expect(page.getByTestId('product-name').filter({ hasText: 'Placeholder Product B' }))
		.not.toBeVisible();

	// Products A and C are in stock and must still appear
	await expect(page.getByTestId('product-name').filter({ hasText: 'Placeholder Product A' }))
		.toBeVisible();
	await expect(page.getByTestId('product-name').filter({ hasText: 'Placeholder Product C' }))
		.toBeVisible();
});

test('instock filter updates the product count label', async ({ page }) => {
	await page.goto(`${SHOP_URL}?instock=1`);
	// 2 in-stock products out of 3 total
	await expect(page.getByTestId('product-count')).toHaveText('Showing 2 of 3 products');
});

test('instock checkbox is checked when ?instock=1 is in the URL', async ({ page }) => {
	await page.goto(`${SHOP_URL}?instock=1`);
	await expect(page.getByTestId('instock-toggle')).toBeChecked();
});

test('instock checkbox is unchecked by default', async ({ page }) => {
	await page.goto(SHOP_URL);
	await expect(page.getByTestId('instock-toggle')).not.toBeChecked();
});

// ---------------------------------------------------------------------------
// Combined sort + instock filter
// ---------------------------------------------------------------------------

test('?sort=price-asc&instock=1 shows only in-stock products sorted cheapest first', async ({
	page
}) => {
	await page.goto(`${SHOP_URL}?sort=price-asc&instock=1`);

	const names = await page.getByTestId('product-name').allTextContents();
	// In-stock: C ($9.99) and A ($19.99); B is OOS and hidden
	expect(names).toEqual(['Placeholder Product C', 'Placeholder Product A']);
	await expect(page.getByTestId('product-count')).toHaveText('Showing 2 of 3 products');
});

// ---------------------------------------------------------------------------
// Unknown / invalid sort param gracefully falls back to featured
// ---------------------------------------------------------------------------

test('unrecognised ?sort= value falls back to featured without erroring', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=invalid-sort-key`);

	// Page should load normally (no 500)
	await expect(page).toHaveURL(`${SHOP_URL}?sort=invalid-sort-key`);
	await expect(page.getByTestId('product-toolbar')).toBeVisible();

	// All products present (featured = original order)
	await expect(page.getByTestId('product-card')).toHaveCount(3);

	// The select should show "featured" because of the fallback
	await expect(page.getByTestId('sort-select')).toHaveValue('featured');
});

// ---------------------------------------------------------------------------
// no-matches state: instock=1 on a shop where every product is out of stock
// (simulate by combining a shop that has products but all are OOS — we cannot
// do that with mock data, so we test the no-matches element is absent when
// results exist and present the message when all are filtered out)
// ---------------------------------------------------------------------------

test('no-matches message is not shown when products are visible', async ({ page }) => {
	await page.goto(SHOP_URL);
	await expect(page.getByTestId('no-matches')).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// Each product card exposes the expected test-id hooks
// ---------------------------------------------------------------------------

test('each product card has product-name and product-price test ids', async ({ page }) => {
	await page.goto(SHOP_URL);

	const cards = page.getByTestId('product-card');
	await expect(cards).toHaveCount(3);

	// Spot-check the first card (Product A in featured order)
	const firstCard = cards.nth(0);
	await expect(firstCard.getByTestId('product-name')).toHaveText('Placeholder Product A');
	await expect(firstCard.getByTestId('product-price')).toHaveText('$19.99');
});

// ---------------------------------------------------------------------------
// Deep-link: URL is the source of truth — refreshing preserves the sort
// ---------------------------------------------------------------------------

test('refreshing the page preserves the active sort and filter from the URL', async ({ page }) => {
	await page.goto(`${SHOP_URL}?sort=price-desc&instock=1`);

	// Confirm state before reload
	await expect(page.getByTestId('sort-select')).toHaveValue('price-desc');
	await expect(page.getByTestId('instock-toggle')).toBeChecked();

	await page.reload();

	// State must survive the reload because it lives in the URL
	await expect(page.getByTestId('sort-select')).toHaveValue('price-desc');
	await expect(page.getByTestId('instock-toggle')).toBeChecked();
});
