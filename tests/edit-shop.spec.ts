import { test, expect } from '@playwright/test';

/**
 * Tests for the shop edit page (/dashboard/shop/:id).
 *
 * This page lets the shop owner update shop details, manage products
 * (add / edit / delete), and delete the entire shop. It was not covered
 * by any existing test in the PR.
 */

const uniqueUser = () => `testuser_${Date.now()}`;
const uniqueShop = () => `Test Shop ${Date.now()}`;

// Helper: register a user and create a shop, returning the shop page URL
async function setupUserAndShop(page: import('@playwright/test').Page) {
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
  await page.getByLabel(/Description/).fill('A shop for testing purposes.');
  await page.getByRole('button', { name: 'Create shop' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Navigate to the edit page via the dashboard list
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'Edit' }).first().click();
  await expect(page).toHaveURL(/\/dashboard\/shop\//);

  return { username, shopName };
}

test.describe('Shop Edit — access control', () => {
  test('redirects unauthenticated users to /login', async ({ browser }) => {
    // Fresh context — no session cookie
    const page = await browser.newPage();
    await page.goto('/dashboard/shop/some-id');
    await expect(page).toHaveURL(/\/login/);
    await page.close();
  });
});

test.describe('Shop Edit — page structure', () => {
  test('displays shop name in heading and edit form', async ({ page }) => {
    const { shopName } = await setupUserAndShop(page);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(shopName);
    await expect(page.getByLabel(/Shop name/)).toBeVisible();
    await expect(page.getByLabel(/Description/)).toBeVisible();
    await expect(page.getByLabel(/Banner image URL/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  });

  test('Back to dashboard link navigates to /dashboard', async ({ page }) => {
    await setupUserAndShop(page);

    await page.getByRole('link', { name: '← Dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('View shop link navigates to the public shop page', async ({ page }) => {
    await setupUserAndShop(page);

    await page.getByRole('link', { name: 'View shop →' }).click();
    await expect(page).toHaveURL(/\/shops\//);
  });
});

test.describe('Shop Edit — update shop details', () => {
  test('successfully updates shop name and description', async ({ page }) => {
    const { shopName } = await setupUserAndShop(page);
    const updatedName = `${shopName} (updated)`;
    const updatedDesc = 'Updated description for testing.';

    await page.getByLabel(/Shop name/).fill(updatedName);
    await page.getByLabel(/Description/).fill(updatedDesc);
    await page.getByRole('button', { name: 'Save changes' }).click();

    // Expect a success message
    await expect(page.getByText('Shop updated.')).toBeVisible();
  });
});

test.describe('Shop Edit — products', () => {
  test('shows empty product state when shop has no products', async ({ page }) => {
    await setupUserAndShop(page);

    await expect(page.getByText('No products yet.')).toBeVisible();
  });

  test('adds a product and it appears in the product list', async ({ page }) => {
    await setupUserAndShop(page);

    // Expand the Add product panel
    await page.getByText('+ Add product').click();

    // Fill in required product fields
    await page.locator('.add-form').getByLabel('Name').fill('Widget A');
    await page.locator('.add-form').getByLabel('Price ($)').fill('9.99');
    await page.locator('.add-form').getByLabel('Stock').fill('10');
    await page.getByRole('button', { name: 'Add product' }).click();

    // Success message should appear
    await expect(page.getByText('Product added.')).toBeVisible();

    // The new product should be listed
    await expect(page.getByText('Widget A')).toBeVisible();
  });

  test('can edit a product after adding it', async ({ page }) => {
    await setupUserAndShop(page);

    // Add a product first
    await page.getByText('+ Add product').click();
    await page.locator('.add-form').getByLabel('Name').fill('Widget B');
    await page.locator('.add-form').getByLabel('Price ($)').fill('5.00');
    await page.locator('.add-form').getByLabel('Stock').fill('3');
    await page.getByRole('button', { name: 'Add product' }).click();
    await expect(page.getByText('Product added.')).toBeVisible();

    // Reload to get the product list
    await page.reload();

    // Click "Edit" on the first product
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // Inline form should appear
    await expect(page.locator('.product-edit')).toBeVisible();

    // Update the product name
    const nameInput = page.locator('.edit-form').getByLabel('Name');
    await nameInput.fill('Widget B (revised)');
    await page.getByRole('button', { name: 'Save product' }).click();

    await expect(page.getByText('Product updated.')).toBeVisible();
    await expect(page.getByText('Widget B (revised)')).toBeVisible();
  });
});

test.describe('Shop Edit — delete shop', () => {
  test('Danger zone section is visible with delete option', async ({ page }) => {
    await setupUserAndShop(page);

    await expect(page.getByRole('heading', { name: 'Danger zone' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete shop' })).toBeVisible();
  });
});
