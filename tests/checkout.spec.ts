import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('shows empty state when cart is empty', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText('Nothing in your cart.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse shops' })).toBeVisible();
  });

  test.describe('with a cart item', () => {
    test.beforeEach(async ({ page }) => {
      // Add an item to the cart via the shop detail page
      await page.goto('/browse');
      const firstCard = page.locator('section.shops .grid a').first();
      if (await firstCard.count() === 0) test.skip();
      await firstCard.click();

      const addBtn = page.locator('.card button').filter({ hasText: 'Add to cart' }).first();
      if (await addBtn.count() === 0) test.skip();
      await addBtn.click();
      await expect(addBtn).toHaveText('Added!');
      await page.goto('/checkout');
    });

    test('displays the checkout form and order summary', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
      await expect(page.getByLabel('Name')).toBeVisible();
      await expect(page.getByLabel('Shipping address')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Order summary' })).toBeVisible();
    });

    test('Place order button is disabled when fields are empty', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Place order' })).toBeDisabled();
    });

    test('Place order button enables once both fields are filled', async ({ page }) => {
      await page.getByLabel('Name').fill('Jane Doe');
      await page.getByLabel('Shipping address').fill('123 Example St');
      await expect(page.getByRole('button', { name: 'Place order' })).toBeEnabled();
    });

    test('submitting the form shows the order success screen', async ({ page }) => {
      await page.getByLabel('Name').fill('Jane Doe');
      await page.getByLabel('Shipping address').fill('123 Example St');
      await page.getByRole('button', { name: 'Place order' }).click();

      await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();
      await expect(page.getByText('Jane Doe')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Back to browsing' })).toBeVisible();
    });

    test('cart is cleared after a successful order', async ({ page }) => {
      await page.getByLabel('Name').fill('Jane Doe');
      await page.getByLabel('Shipping address').fill('123 Example St');
      await page.getByRole('button', { name: 'Place order' }).click();
      await expect(page.getByRole('heading', { name: 'Order placed!' })).toBeVisible();

      // Cart badge in header should be gone
      await expect(page.locator('header .badge')).not.toBeVisible();
    });
  });
});
