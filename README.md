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

## Auth, email and MFA

Three flows exist specifically so they can be exercised by automated tests.

### The local inbox

ShopShop has its own pretend mail system. Nothing is delivered anywhere —
messages are written to Deno KV and read back at **`/inbox`** — so there is no
provider account, no API key and no DNS involved. It behaves like a real mail
system on purpose:

- **Per-address mailboxes.** `/inbox` lists every address that has mail with
  unread counts; `/inbox/<address>` is that mailbox. Addresses are matched
  case-insensitively, as real ones are.
- **Unread state.** Messages arrive unread and are marked read when opened.
- **Multipart bodies.** Every message has a `text/plain` and a `text/html`
  part. The message view has **HTML**, **Text** and **Source** tabs; the HTML
  part renders in a sandboxed frame, and Source shows the full RFC 5322
  `multipart/alternative` document, headers and `Message-ID` included.
- **Search and deletion.** Filter a mailbox by subject or body, delete a single
  message, or empty the mailbox.
- **Delivery delay.** `DELIVERY_DELAY_MS` in `src/lib/server/mail.ts` is 0 by
  default. Raise it and a sent message is not immediately visible, forcing
  specs to poll for arrival the way they would against a real provider.

Tests read mail straight off the page in the same browser session, so email
flows are deterministic — nothing to poll and nothing to flake.

> **The inbox is deliberately open.** `/inbox` needs no session, and it must
> stay that way: a sign-in code you could only read once already signed in
> would make the email login flow circular. Only `/dashboard/*` is gated.

### Sign-in routes

| Route | Flow |
| --- | --- |
| `/login` | Username + password. Redirects to `/login/mfa` if TOTP is on. |
| `/login/email` | Passwordless: enter an email, click the link that arrives. |
| `/login/mfa` | Second factor — authenticator code, emailed code, or recovery code. |
| `/dashboard/security` | Enrol or disable TOTP; issues one-time recovery codes. |

TOTP is RFC 6238 implemented on Web Crypto (`src/lib/server/totp.ts`) with no
dependencies, verified against the RFC's published test vectors. Enrollment
shows the secret and an `otpauth://` URI for manual entry — there is no QR
code, which also makes it scriptable.

Between password and second factor the user holds a **`mfa_pending`** cookie,
stored under a separate KV prefix from real sessions. It grants no access on
its own.

### Reusing a login across tests

Both suites do the expensive login once and restore the cookie jar afterwards.

**Playwright** — `tests/auth.setup.ts` runs as a `setup` project dependency,
registers a user, enrols TOTP, signs in through the full challenge, and saves
`playwright/.auth/user.json`. The `chromium` project loads it via
`storageState`, so every spec starts signed in. Specs that must start signed
out are named `*.anon.spec.ts` and run in the `chromium-anon` project.

**Cypress** — `cy.loginOnce(account, totpSecret)` wraps `cy.session()`, which
caches and restores the same cookie jar. See `cypress/e2e/auth-bypass.cy.ts`.

> The dev server keeps KV in memory, so **sessions do not survive a restart**.
> A `storageState` file from an earlier run points at a session that no longer
> exists; the browser is then silently signed out rather than erroring. The
> setup project regenerates it every run, which is why it is a `dependencies`
> entry rather than something cached between runs.

> Typing into a form before SvelteKit hydrates can lose the input, because
> hydration reassigns values rendered from server data. The root layout sets
> `<html data-hydrated>` once the client takes over; `waitForHydration()` in
> `tests/helpers.ts` waits for it before interacting with such forms.
