import { test, expect } from '@playwright/test';

const uniqueUser = () => `testuser_${Date.now()}`;

test.describe('Dashboard — auth guard', () => {
  test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Dashboard — authenticated', () => {
  let username: string;

  test.beforeEach(async ({ page }) => {
    username = uniqueUser();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows the welcome message with the username', async ({ page }) => {
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome, ${username}`) })).toBeVisible();
  });

  test('shows the empty state when user has no shops', async ({ page }) => {
    await expect(page.getByText("You haven't created any shops yet.")).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create your first shop →' })).toBeVisible();
  });

  test('New Shop button links to the create shop page', async ({ page }) => {
    await page.getByRole('link', { name: '+ New Shop' }).click();
    await expect(page).toHaveURL('/dashboard/shop/new');
  });
});
