import { test, expect } from '@playwright/test';

test.describe('Browse Shops', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/browse');
  });

  test('displays the Browse Shops heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
  });

  test('shows the search form', async ({ page }) => {
    await expect(page.getByRole('searchbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('search filters shops by query', async ({ page }) => {
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('test');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/\/browse\?q=test/);
    // Results count or empty state should be visible
    await expect(page.locator('.meta')).toBeVisible();
  });

  test('clear button removes the search query', async ({ page }) => {
    await page.getByRole('searchbox').fill('test');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/q=test/);

    await page.getByRole('link', { name: 'Clear' }).click();
    await expect(page).toHaveURL('/browse');
    await expect(page.getByRole('link', { name: 'Clear' })).not.toBeVisible();
  });

  test('clicking a shop card navigates to the shop detail page', async ({ page }) => {
    // Only run this assertion if shops exist
    const shopCards = page.locator('.grid a');
    const count = await shopCards.count();
    if (count > 0) {
      await shopCards.first().click();
      await expect(page).toHaveURL(/\/shops\//);
    } else {
      // Show a notice if no shops are available to click
      await expect(page.getByText('No shops yet.')).toBeVisible();
    }
  });
});
