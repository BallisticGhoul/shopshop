import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/
		},
		{
			name: 'chromium',
			testIgnore: /.*\.anon\.spec\.ts/,
			use: {
				...devices['Desktop Chrome'],
				// Every spec starts already signed in, courtesy of the setup project.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},
		{
			// For specs that must start signed out (registration, magic link).
			name: 'chromium-anon',
			testMatch: /.*\.anon\.spec\.ts/,
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
