import { test, expect } from '@playwright/test';

const uniqueUser = () => `testuser_${Date.now()}`;
const uniqueShop = () => `Test Shop ${Date.now()}`;

test.describe('Create Shop', () => {
  test.beforeEach(async ({ page }) => {
    // Register and log in before each test
    const username = uniqueUser();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/dashboard');
    await page.goto('/dashboard/shop/new');
  });

  test('redirects unauthenticated users to /login', async ({ browser }) => {
    const page = await browser.newPage(); // fresh context — no session
    await page.goto('/dashboard/shop/new');
    await expect(page).toHaveURL(/\/login/);
    await page.close();
  });

  test('displays the create shop form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create a new shop' })).toBeVisible();
    await expect(page.getByLabel(/Shop name/)).toBeVisible();
    await expect(page.getByLabel(/Description/)).toBeVisible();
    await expect(page.getByLabel(/Banner image URL/)).toBeVisible();
  });

  test('Back to dashboard link works', async ({ page }) => {
    await page.getByRole('link', { name: '← Back to dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('successfully creates a shop and appears in dashboard', async ({ page }) => {
    const shopName = uniqueShop();
    await page.getByLabel(/Shop name/).fill(shopName);
    await page.getByLabel(/Description/).fill('A great test shop for automated testing.');
    await page.getByRole('button', { name: 'Create shop' }).click();

    // Should redirect to the new shop's edit page or dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Shop should appear in the dashboard list
    await page.goto('/dashboard');
    await expect(page.getByText(shopName)).toBeVisible();
  });

  test('newly created shop is visible on the browse page', async ({ page }) => {
    const shopName = uniqueShop();
    await page.getByLabel(/Shop name/).fill(shopName);
    await page.getByLabel(/Description/).fill('Visible on browse page.');
    await page.getByRole('button', { name: 'Create shop' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Browse should list the new shop
    await page.goto('/browse');
    await expect(page.getByText(shopName)).toBeVisible();
  });
});
