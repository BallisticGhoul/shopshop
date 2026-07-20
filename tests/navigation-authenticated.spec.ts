import { test, expect } from '@playwright/test';

/**
 * Regression suite for PR #1 — "Browse shops" from the dashboard doesn't
 * navigate to the browsing menu.
 *
 * The bug lives on the homepage, where a logged-in user sees a "Browse Shops"
 * CTA. This suite verifies that CTA (and every other navigation path available
 * to authenticated users) lands on the correct page.
 */

const uniqueUser = () => `testuser_${Date.now()}`;

// Helper: register a new account and land on /dashboard
async function registerAndLogin(page: import('@playwright/test').Page) {
  const username = uniqueUser();
  await page.goto('/register');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByLabel('Confirm password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL('/dashboard');
  return username;
}

test.describe('Homepage — authenticated navigation', () => {
  test('Browse Shops CTA navigates to /browse for a logged-in user (regression)', async ({ page }) => {
    // This is the exact scenario reported in PR #1:
    // pressing "Browse Shops" from the homepage should take the user to /browse.
    await registerAndLogin(page);
    await page.goto('/');

    // The logged-in hero shows a "Browse Shops" primary button
    const browseBtn = page.getByRole('link', { name: 'Browse Shops' });
    await expect(browseBtn).toBeVisible();
    await browseBtn.click();

    await expect(page).toHaveURL('/browse');
    await expect(page.getByRole('heading', { name: 'Browse Shops' })).toBeVisible();
  });

  test('My Dashboard CTA navigates to /dashboard for a logged-in user', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'My Dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('Create a Shop CTA navigates to /dashboard/shop/new for a logged-in user', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Create a Shop' }).click();
    await expect(page).toHaveURL('/dashboard/shop/new');
    await expect(page.getByRole('heading', { name: 'Create a new shop' })).toBeVisible();
  });

  test('shows welcome-back message with username on homepage when logged in', async ({ page }) => {
    const username = await registerAndLogin(page);
    await page.goto('/');

    await expect(page.getByText(new RegExp(`Welcome back.*${username}`, 'i'))).toBeVisible();
  });

  test('homepage shows Browse / My Dashboard / Create a Shop actions when logged in', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Browse Shops' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create a Shop' })).toBeVisible();
  });
});

test.describe('Header navigation — authenticated', () => {
  test('Browse link in header navigates to /browse', async ({ page }) => {
    await registerAndLogin(page);

    // The header's nav Browse link should always be present and functional
    await page.getByRole('link', { name: 'Browse' }).click();
    await expect(page).toHaveURL('/browse');
  });

  test('username link in header navigates to /dashboard', async ({ page }) => {
    const username = await registerAndLogin(page);
    await page.goto('/');

    // The header shows the username as a link to /dashboard
    await page.getByRole('link', { name: username }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('ShopShop logo link in header navigates to /', async ({ page }) => {
    await registerAndLogin(page);

    // Navigate away from home, then use the logo link
    await page.goto('/browse');
    await page.getByRole('link', { name: 'ShopShop' }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('header does not show Log in or Register links when authenticated', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).not.toBeVisible();
  });
});
