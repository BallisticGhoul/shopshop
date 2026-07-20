import { test, expect } from '@playwright/test';

/**
 * Regression suite for PR #3 — "Shopshop Bug"
 *
 * The reported bug: when you click on a shop card to view it, the shop
 * page does not open / render correctly.
 *
 * These tests verify the full click-through from /browse to a live shop
 * detail page, direct URL navigation, proper page rendering, and the
 * 404 error path for non-existent shops.
 */

const uniqueUser = () => `testuser_${Date.now()}`;
const uniqueShop = () => `Regression Shop ${Date.now()}`;

// Helper: register a new user and create a shop, returning the shop name and its public URL
async function createUserWithShop(page: import('@playwright/test').Page) {
  const username = uniqueUser();
  const shopName = uniqueShop();

  // Register
  await page.goto('/register');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByLabel('Confirm password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL('/dashboard');

  // Create a shop
  await page.goto('/dashboard/shop/new');
  await page.getByLabel(/Shop name/).fill(shopName);
  await page.getByLabel(/Description/).fill('A shop used for regression testing.');
  await page.getByRole('button', { name: 'Create shop' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Find the public shop URL via the edit page's "View shop" link
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'Edit' }).first().click();
  await expect(page).toHaveURL(/\/dashboard\/shop\//);

  // Capture the shop's public URL from the "View shop →" link
  const viewShopLink = page.getByRole('link', { name: 'View shop →' });
  await expect(viewShopLink).toBeVisible();
  const shopUrl = await viewShopLink.getAttribute('href');

  return { username, shopName, shopUrl: shopUrl ?? '' };
}

test.describe('Shop open — click-through from browse (regression)', () => {
  test('clicking a shop card on /browse opens the shop detail page and renders the shop name', async ({ page }) => {
    // Arrange: create a shop so the browse page has at least one card
    const { shopName } = await createUserWithShop(page);

    // Act: navigate to browse and click the shop card
    await page.goto('/browse');

    // Find the card containing the shop we just created
    const shopCard = page.locator('section.shops .grid a').filter({ hasText: shopName });
    await expect(shopCard).toBeVisible();

    // This is the exact regression scenario: clicking the card must open the shop
    await shopCard.click();

    // Assert: the URL changed to a shop detail path
    await expect(page).toHaveURL(/\/shops\//);

    // Assert: the shop detail page rendered its heading with the correct name
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(shopName);
  });

  test('clicking a shop card on /browse opens the shop detail page and renders the shop description', async ({ page }) => {
    const { shopName } = await createUserWithShop(page);

    await page.goto('/browse');

    const shopCard = page.locator('section.shops .grid a').filter({ hasText: shopName });
    await expect(shopCard).toBeVisible();
    await shopCard.click();

    await expect(page).toHaveURL(/\/shops\//);

    // The description should be visible in the banner overlay
    await expect(page.getByText('A shop used for regression testing.')).toBeVisible();
  });

  test('the shop detail page banner section is visible after navigating from browse', async ({ page }) => {
    const { shopName } = await createUserWithShop(page);

    await page.goto('/browse');
    const shopCard = page.locator('section.shops .grid a').filter({ hasText: shopName });
    await expect(shopCard).toBeVisible();
    await shopCard.click();

    await expect(page).toHaveURL(/\/shops\//);

    // The banner overlay (containing shop name + description) must be in the DOM
    await expect(page.locator('.banner-overlay')).toBeVisible();
  });
});

test.describe('Shop open — direct URL navigation', () => {
  test('navigating directly to /shops/:id renders the shop detail page', async ({ page }) => {
    const { shopName, shopUrl } = await createUserWithShop(page);

    // Navigate directly to the shop URL (simulates typing the URL or using a bookmark)
    await page.goto(shopUrl);

    await expect(page).toHaveURL(/\/shops\//);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(shopName);
    await expect(page.getByText('A shop used for regression testing.')).toBeVisible();
  });

  test('navigating directly to /shops/:id shows the products section', async ({ page }) => {
    const { shopUrl } = await createUserWithShop(page);

    await page.goto(shopUrl);

    await expect(page).toHaveURL(/\/shops\//);

    // A new shop has no products — the empty state must be shown
    await expect(page.getByText('This shop has no products yet.')).toBeVisible();
  });

  test('navigating to a non-existent shop ID returns a 404 error', async ({ page }) => {
    const response = await page.goto('/shops/this-shop-does-not-exist-abc123');

    // The server should respond with 404
    expect(response?.status()).toBe(404);
  });
});

test.describe('Shop open — page title and meta', () => {
  test('the document title includes the shop name on the detail page', async ({ page }) => {
    const { shopName, shopUrl } = await createUserWithShop(page);

    await page.goto(shopUrl);

    await expect(page).toHaveTitle(new RegExp(shopName));
  });
});

test.describe('Shop open — navigation after opening', () => {
  test('can navigate back to /browse from a shop detail page via the header', async ({ page }) => {
    const { shopUrl } = await createUserWithShop(page);

    await page.goto(shopUrl);
    await expect(page).toHaveURL(/\/shops\//);

    // Use the header Browse link to go back
    await page.getByRole('link', { name: 'Browse' }).click();
    await expect(page).toHaveURL('/browse');
    await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
  });
});
