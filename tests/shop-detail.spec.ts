import { test, expect, type Page } from '@playwright/test';

// Navigate to the first available shop from /browse
async function goToFirstShop(page: Page) {
  await page.goto('/browse');
  const firstCard = page.locator('section.shops .grid a').first();
  await firstCard.waitFor({ state: 'visible' });
  await firstCard.click();
  await expect(page).toHaveURL(/\/shops\//);
}

test.describe('Shop Detail', () => {
  test('displays shop name as heading', async ({ page }) => {
    await goToFirstShop(page);
    // The shop name is rendered as an H1 inside the banner overlay
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('shows product cards for shops with products', async ({ page }) => {
    await goToFirstShop(page);
    const products = page.locator('.grid .card');
    const count = await products.count();
    if (count > 0) {
      await expect(products.first()).toBeVisible();
      // Each card has a price and an Add to cart / Sold out button
      await expect(products.first().getByRole('button', { name: /Add to cart|Sold out/ })).toBeVisible();
    } else {
      await expect(page.getByText('This shop has no products yet.')).toBeVisible();
    }
  });

  test('clicking Add to cart updates the cart badge in the header', async ({ page }) => {
    await goToFirstShop(page);
    const addBtn = page.locator('.card button').filter({ hasText: 'Add to cart' }).first();
    const count = await addBtn.count();
    if (count === 0) {
      test.skip(); // No in-stock products available
      return;
    }
    await addBtn.click();
    // Button should briefly say "Added!"
    await expect(addBtn).toHaveText('Added!');
    // Cart badge in header should show at least 1
    await expect(page.locator('header .badge')).toBeVisible();
  });

  test('out-of-stock products show Sold out badge and disabled button', async ({ page }) => {
    await goToFirstShop(page);
    const soldOutBadge = page.locator('.sold-out').first();
    const count = await soldOutBadge.count();
    if (count > 0) {
      await expect(soldOutBadge).toBeVisible();
      // The containing card's button should be disabled
      const card = page.locator('.card').filter({ has: soldOutBadge }).first();
      await expect(card.getByRole('button')).toBeDisabled();
    }
  });
});
