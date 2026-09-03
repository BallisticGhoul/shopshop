import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5173',
		specPattern: 'cypress/e2e/**/*.cy.ts',
		supportFile: 'cypress/support/e2e.ts',
		viewportWidth: 1280,
		viewportHeight: 800,
		video: false,
		// The suite runs against a Vite dev server, which compiles a route the
		// first time it is requested. The 4s default is not enough for that on
		// a cold start, which showed up as setup hooks failing on the first run.
		defaultCommandTimeout: 10_000
	}
});
