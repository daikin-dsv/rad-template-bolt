# RAD Template

This project couples a Next.js App Router application with a Vite bundle that ships Daikin design system web components and custom components. The README outlines the developer workflow and the conventions that support localization and web component loading.

## Getting Started

Install dependencies, set environment, and run the Next.js dev server:

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npx auth secret

npm run dev
```

By default the app is served at [http://localhost:3006](http://localhost:3006). The first load pulls in the prebuilt web components bundle from `public/webcomponents.js`.

### Configure `.env.local`

Authentication relies on NextAuth and a Keycloak provider. Before running the dev server, change `.env.example` to `.env.local` file in the project root (Next.js automatically reads it) with the required settings:

```bash
RAD_URL=replace-with-homepage-url
AUTH_SECRET=replace-with-a-generated-secret
AUTH_KEYCLOAK_ID=rad-test2
AUTH_KEYCLOAK_SECRET=ask-your-team-for-this
AUTH_KEYCLOAK_ISSUER=https://sso-dev.daikinlab.com/auth/realms/daikin
BYPASS_AUTH=false
```

`AUTH_SECRET` should be a strong random string (use `openssl rand -base64 32` if you need a new one) and the Keycloak credentials must match the realm/application assigned to your environment. Restart the dev server after updating these values.

Set `BYPASS_AUTH=true` if you want to skip the Keycloak login flow locally; the app will load with a mock developer session instead.

### Helpful Scripts

- `npm run dev:webcomponents` — rebuilds the web components bundle in watch mode while you iterate
- `npm run bundle:webcomponents` — produces a production bundle once
- `npm run build` — runs the Vite bundle step first (`prebuild`) and then the full Next.js production build

Run the web components watcher in a separate terminal whenever you edit files under `app/webcomponents.ts`.

## Testing

The project ships two complementary suites: quick Vitest-based component tests and Playwright end-to-end coverage.

- `npm run test:component` runs unit and component tests in watch mode with Vitest. Use `npm run test:component:coverage` for an instrumented run or `npm run test:component:ui` to inspect results in the Vitest UI.
- `ENV="local" npm run test:e2e` executes the Playwright suite headlessly. Make sure the Next.js dev server is running (`npm run dev`) and that your `.env.local` matches the target environment before starting the run.
- `ENV="local" npm run test:e2e:dev` launches the Playwright trace viewer so you can re-run scenarios interactively while debugging failures.

## Locale System (`app/locale`)

The locale layer is responsible for returning a typed `TextBundle` that feeds navigation labels, headers, and other copy rendered in `app/layout.tsx`.

- **Where translations live** — Each supported language exports a `TextBundle` from `app/locale/<locale>.ts`, and `app/locale/types.ts` defines the shared contract. Current locales are `en` and `ja`.
- **How locale is chosen** — `loadTexts(locale?: string)` receives the locale stored on the signed-in user (`session.user?.locale`). The helper normalizes values such as `ja-JP` to the base `ja` and falls back to English when the locale is missing or unsupported.
- **Adding a locale** — Add the language code to `SupportedLocale` in `types.ts`, create `app/locale/<code>.ts` that exports a `TextBundle`, and extend the `LOADERS` record in `index.ts`. The dynamic imports ensure new bundles are only loaded when requested.

Because the loader is async, any component that needs localized text should call `loadTexts` server-side (as `app/layout.tsx` does) and pass the resolved copy down through props. This keeps the initial render fully translated without an extra client round-trip.

## Web Components Integration

The project ships Daikin design system web components and custom UI in a single Vite-built bundle.

### `app/webcomponents.ts`

All custom elements are imported once from this file to avoid a flash of unstyled content (FOUC). It grabs:

- Design system primitives from `@daikin-oss/design-system-web-components`

`app/layout.tsx` synchronously requires the generated bundle by inserting `<script src="/webcomponents.js">` into the document head.

### `vite.config.ts`

Vite is configured in library mode to treat `app/webcomponents.ts` as the entry point and emit `public/webcomponents.js` with a UMD wrapper. Key details:

- `outDir: 'public'` lets Next.js serve the bundle as a static asset without additional routing.
- `emptyOutDir: false` prevents wiping other files in `public/` when rebuilding.
- `entryFileNames: 'webcomponents.js'` guarantees a stable filename that the layout can reference.
- Source maps and minification are enabled for debugging and production, respectively.

Any dependency you import into `app/webcomponents.ts` becomes part of this bundle. After updating imports, rerun `npm run bundle:webcomponents` (or keep `npm run dev:webcomponents` running) so the latest code is available to the Next.js app.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vite Library Mode Guide](https://vitejs.dev/guide/build.html#library-mode)
- [Daikin Design System Web Components](https://www.npmjs.com/package/@daikin-oss/design-system-web-components)

For deployment, follow the standard Next.js guidance or the platform instructions for your hosting provider (e.g., Vercel).
