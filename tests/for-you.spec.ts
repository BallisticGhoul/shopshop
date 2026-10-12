import { test, expect, type Page } from '@playwright/test';
import { waitForHydration } from './helpers';

/**
 * The For You page shows one page of randomly chosen shops. The order is
 * random on every load, so these assert on shape and behaviour rather than
 * on which shops appear.
 */

async function shopNames(page: Page): Promise<string[]> {
	return page.getByTestId('for-you-grid').getByRole('heading', { level: 3 }).allInnerTexts();
}

test('dashboard links to the For You page', async ({ page }) => {
	await page.goto('/dashboard');
	await page.getByTestId('nav-for-you').click();
	await page.waitForURL('**/dashboard/for-you');
	await expect(page.getByRole('heading', { name: 'For You', level: 1 })).toBeVisible();
});

test('home page links to the For You page when signed in', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('home-for-you').click();
	await page.waitForURL('**/dashboard/for-you');
	await expect(page.getByRole('heading', { name: 'For You', level: 1 })).toBeVisible();
});

test('shows one page of nine distinct shops', async ({ page }) => {
	await page.goto('/dashboard/for-you');
	const cards = page.getByTestId('for-you-grid').locator('a.card');
	await expect(cards).toHaveCount(9);

	const names = await shopNames(page);
	expect(new Set(names).size).toBe(names.length);
});

test('every card links to a shop page that opens', async ({ page }) => {
	await page.goto('/dashboard/for-you');
	const cards = page.getByTestId('for-you-grid').locator('a.card');
	for (const href of await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
		expect(href).toMatch(/^\/shops\/[^/]+$/);
	}

	const first = cards.first();
	const name = await first.getByRole('heading', { level: 3 }).innerText();
	await first.click();
	await page.waitForURL('**/shops/**');
	await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
});

test('shuffle picks a new selection', async ({ page }) => {
	await page.goto('/dashboard/for-you');
	await waitForHydration(page);
	const before = await shopNames(page);

	// A reshuffle can, very rarely, land on the same order — retry a few times.
	await expect
		.poll(
			async () => {
				await page.getByTestId('for-you-shuffle').click();
				await page.waitForLoadState('networkidle');
				return (await shopNames(page)).join('|');
			},
			{ intervals: [0, 0, 0, 0], timeout: 10_000 }
		)
		.not.toBe(before.join('|'));
	await expect(page.getByTestId('for-you-grid').locator('a.card')).toHaveCount(9);
});
