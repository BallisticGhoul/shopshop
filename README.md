# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
deno run npm:sv@0.15.3 create --template minimal --types ts --install deno .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Testing

This project has two end-to-end suites that run against the same dev server.

**Playwright** starts the dev server itself:

```sh
npm run test:e2e
```

**Cypress** expects the dev server to already be running on
`http://localhost:5173`, so start it in a separate terminal first:

```sh
npm run dev
```

Then run the suite headlessly, or open the interactive runner:

```sh
npm run test:cypress
```

```sh
npm run cypress:open
```

Dependencies are installed with Deno (`deno install`), which is what populates
`node_modules`. Cypress needs its post-install script to download the test
runner binary, so allow it explicitly:

```sh
deno install --allow-scripts=npm:cypress
```
