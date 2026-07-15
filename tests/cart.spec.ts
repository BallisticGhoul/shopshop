import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('shows empty state when cart has no items', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
  });

  test.describe('with an item in the cart', () => {
    // Add a product before each test in this group
    test.beforeEach(async ({ page }) => {
      await page.goto('/browse');
      const firstCard = page.locator('section.shops .grid a').first();
      if (await firstCard.count() === 0) test.skip();

      await firstCard.click();
      const addBtn = page.locator('.card button').filter({ hasText: 'Add to cart' }).first();
      if (await addBtn.count() === 0) test.skip();

      await addBtn.click();
      await expect(addBtn).toHaveText('Added!');
      await page.goto('/cart');
    });

    test('displays the added item in the cart', async ({ page }) => {
      await expect(page.locator('.item')).toHaveCount(1);
    });

    test('increases item quantity with the + button', async ({ page }) => {
      const qty = page.locator('.qty');
      await expect(qty).toHaveText('1');
      await page.getByRole('button', { name: 'Increase quantity' }).click();
      await expect(qty).toHaveText('2');
    });

    test('decreases item quantity with the − button', async ({ page }) => {
      // First increase to 2 so we can decrease
      await page.getByRole('button', { name: 'Increase quantity' }).click();
      await expect(page.locator('.qty')).toHaveText('2');
      await page.getByRole('button', { name: 'Decrease quantity' }).click();
      await expect(page.locator('.qty')).toHaveText('1');
    });

    test('removes item with the × button and shows empty state', async ({ page }) => {
      await page.getByRole('button', { name: 'Remove' }).click();
      await expect(page.getByText('Your cart is empty.')).toBeVisible();
    });

    test('displays total price and Proceed to checkout link', async ({ page }) => {
      await expect(page.locator('.total')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
    });
  });
});
