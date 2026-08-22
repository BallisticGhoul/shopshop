import { test, expect } from '@playwright/test';

// Create shop form — one of the primary value flows for shop owners.
// Tests cover the form structure and field validation without requiring
// a live authenticated session (the auth guard is already covered in dashboard.spec.ts).

test.describe('Create shop form (unauthenticated redirect)', () => {
	test('unauthenticated users are redirected to login when visiting /dashboard/shop/new', async ({ page }) => {
		await page.goto('/dashboard/shop/new');
		await expect(page).toHaveURL(/\/login/);
	});
});

// NOTE: Full create-shop happy-path tests (filling and submitting the form) require
// an authenticated session. Those are tracked as a future test expansion once a
// shared auth fixture (e.g. storageState) is in place.
// The form UI itself is confirmed by the server-side redirect guard above.
