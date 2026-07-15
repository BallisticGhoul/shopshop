import { test, expect } from '@playwright/test';

// Use a timestamp-based username to avoid collisions across runs
const uniqueUser = () => `testuser_${Date.now()}`;

test.describe('Registration', () => {
  test('registers a new account and redirects to dashboard', async ({ page }) => {
    const username = uniqueUser();
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome, ${username}`) })).toBeVisible();
  });

  test('shows error when passwords do not match', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Username').fill(uniqueUser());
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('different456');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Passwords do not match.')).toBeVisible();
  });

  test('shows error for username shorter than 3 characters', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Username').fill('ab');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible();
  });

  test('shows error when username is already taken', async ({ page }) => {
    // Register once
    const username = uniqueUser();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Log out and try to register again with the same username
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('That username is already taken.')).toBeVisible();
  });

  test('redirects already-logged-in user away from /register', async ({ page }) => {
    // Register and stay logged in
    const username = uniqueUser();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Visiting /register should redirect back to /dashboard
    await page.goto('/register');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Login', () => {
  let sharedUser: string;

  test.beforeAll(async ({ browser }) => {
    // Create one shared user for all login tests
    sharedUser = uniqueUser();
    const page = await browser.newPage();
    await page.goto('/register');
    await page.getByLabel('Username').fill(sharedUser);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.close();
  });

  test('logs in with valid credentials and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

    await page.getByLabel('Username').fill(sharedUser);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome, ${sharedUser}`) })).toBeVisible();
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(sharedUser);
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Invalid username or password.')).toBeVisible();
  });

  test('show/hide password toggle works', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('redirects already-logged-in user away from /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(sharedUser);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.goto('/login');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Logout', () => {
  test('logs out and hides the dashboard link', async ({ page }) => {
    // Register and log in
    const username = uniqueUser();
    await page.goto('/register');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('button', { name: 'Log out' }).click();

    // Should show login/register in header again
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });
});
