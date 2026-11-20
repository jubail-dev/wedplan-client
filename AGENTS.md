<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# WedPlan client

Next.js 16 App Router frontend for a wedding-vendor marketplace. The API is a separate Express app at `../wedplan-server` (single `index.js`, port 5000) that owns services, bookings, transactions, and Stripe. This repo owns UI, Better Auth, and image upload; run the API separately, since dashboards and browse pages call it for all domain data.

Both apps share the MongoDB database `wedplan` and the `user` collection: Better Auth here writes users (`role`, `isBlocked`, subscription fields), the API reads them. Change user fields or roles in both repos or auth silently diverges.

## Commands

- `npm run dev` — Turbopack dev server. If one is already running, `next dev` prints its URL and PID instead of starting another (see `.next/dev/lock`).
- `npm run lint` — ESLint flat config.
- `npx tsc --noEmit` — typecheck; there is no npm script for it.
- `npm run build`
- npm only (`package-lock.json`). No test runner, CI, or formatter config exists.
- Lint and typecheck are not clean at baseline: `react-hooks/set-state-in-effect` fires across the `useEffect(() => { void fetch…() })` pages, and `add-service` currently has a `@base-ui` Select typing error. Compare against that baseline instead of fixing unrelated failures.

## Auth and API calls

- Better Auth runs in this app: `src/lib/auth.ts` (server), `src/lib/auth-client.ts` (client), catch-all `src/app/api/auth/[...all]/route.ts`. Extra user fields are `role` (`customer` | `vendor` | `admin`), `isBlocked`, `businessName`, `subscriptionPlan`, `subscriptionExpiresAt`.
- Public sign-up can only create customers/vendors (database hook in `auth.ts`). There is no admin-creation path; promote an admin directly in Mongo.
- To call the Express API, `fetch("/api/auth/token")` and send `Authorization: Bearer <token>`. That URL is a Better Auth JWT-plugin endpoint served by the catch-all route — there is no `token/route.ts`. The API re-checks role and `isBlocked` against Mongo, and the JWT carries the role, so role/block changes require signing in again.
- `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, and the API's `CLIENT_SIDE_URL` must be the same origin. The API verifies tokens against `${CLIENT_SIDE_URL}/api/auth/jwks` using that origin as both issuer and audience; a mismatch produces 401s.
- Env keys in `.env` (gitignored): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API_KEY`, `NEXT_PUBLIC_BASE_SERVER_URL`.
- Role gating lives in each dashboard layout (`src/app/dashboard/{admin,customer,vendor}/layout.tsx`) via `auth.api.getSession({ headers: await headers() })` and `redirect`. No middleware/proxy exists, so routes outside those layouts are public.
- Domain data is fetched client-side with plain `fetch` in effects/handlers, and responses use `{ success: boolean, ... }`. There is no SDK, schema layer, or shared types package; response interfaces are declared inline per file.

## Next.js 16 specifics

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, and a Tailwind CSS loader for Turbopack. Check `node_modules/next/dist/docs/` before using unfamiliar APIs.
- With Cache Components, request-time reads such as `headers()` must sit under `<Suspense>` or the segment must opt out with `export const instant = false` (dashboard layouts/pages already do this). Don't reintroduce legacy `export const dynamic` / `revalidate`.
- `next/image` only permits `i.ibb.co`. Uploads go through `POST /api/upload` (images only, ≤ 5 MB, imgbb) and return `{ success, imageUrl }`.

## UI conventions

- Tailwind v4 CSS-first: tokens live in `src/app/globals.css`; there is no `tailwind.config`. Existing pages hardcode the brand hex palette (`#FAF7F2` page background, `#D97985` primary, `#E9DED2` borders) and use `font-heading`; match the surrounding page.
- shadcn `base-nova` style built on `@base-ui/react`, not Radix. `cn` comes from the `cn` package, re-exported by `src/lib/utils.ts`; don't add `clsx`/`tailwind-merge`. Add primitives with `npx shadcn@latest add <component>`.
- Imports use the `@/*` → `src/*` alias.

## Don't trust

- `project-structure.txt` is a stale UTF-16 tree that references a removed `(auth)` route group; read the filesystem instead.
- Leave the managed `nextjs-agent-*` blocks in this file intact; `next dev` writes and re-adds them. `experimental.agentFeedback` also adds a feedback block when it detects an agent.
