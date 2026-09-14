# Architecture

## Static application
Next.js 16.3.4 App Router, React 19.3.0, strict TypeScript. `output: 'export'`, `trailingSlash: true`, and unoptimized Next Image serving pre-optimized bundled WebP. A native picture source selects the smaller mobile hero. Build-rendered public pages and metadata work without JavaScript. `generateStaticParams` emits exactly three known work slugs. No application server, Server Actions, runtime route handlers, middleware, databases, authentication, or credentials.

`lib/content.ts` contains typed service IDs, base fees, work stories, interview answers, and image alt text. Layout, public pages and case-study content are Server Components evaluated during build. Header, interview, nap toggle, and local offer views are small client boundaries.

## Offer model
`lib/offers.ts` owns pure validation, minimum fees, exact missing terms, idempotent submission, revisions, acceptance and withdrawal. Drafts have UUID-based stable IDs, step, fields, timestamps, and optional edit/reference/prefill context. Submitted records retain original and current input, required terms, authored response, accepted terms, status, and ISO event timestamps. A retry keeps one record. An explicit counteroffer edit revises the same record while retaining its original proposal. Accepting terms never decreases a larger offered amount.

Form fields remain plain text. No HTML insertion. Validation trims names/jobs, checks lengths, restricts durations/service IDs, and requires whole-number treats from 0 through 50. Plain nickname only; no contact fields. `/hire/?service=…` preselects a service and preserves an explicitly changed selection after refresh.

Browser-created references use `/offer/?ref=MISO-…` on a fixed statically exported route. Query reads sit inside Suspense. Personal terms never enter build metadata. An unknown local reference explains the browser boundary.

## Storage and hydration
`lib/storage.ts` provides one versioned envelope at `miso-hire-me:demo:v1`, containing draft, offers, and awake preference. `useSyncExternalStore` exposes a browser-independent server snapshot, then reads after subscribing. It never writes empty defaults during hydration. The public layout stays visible while private records hydrate.

The form reserves space in both its Suspense and local-data hydration fallbacks so the footer does not jump through the viewport during loading. The adapter validates parsed structures, deduplicates readable records, keeps recoverable items from damaged envelopes, and blocks automatic writes when data is damaged or from an unsupported version. It preserves the raw storage value until explicit scoped reset. The current implementation deliberately does not migrate unknown schemas.

Mutations re-read storage immediately before applying a change. Storage events synchronize active same-origin tabs; reconnecting a local view refreshes its snapshot. Acceptance checks that the visible offer still matches the latest stored record. These are best-effort local safeguards, not database transactions: truly simultaneous writes can still race.

Writing must succeed before the state is published as saved. Blocked/full storage yields actionable error text and no success navigation. Explicit temporary mode stores only in the tab's JavaScript memory; navigation inside the application retains it, refreshing/closing loses it. It is never silently enabled. Reset enumerates and removes only keys beginning `miso-hire-me:demo:` after native confirmation. `localStorage.clear()` is never called.

## Downloads and covers
`lib/card-export.ts` lazily loads two explicit FontFace objects and the bundled transparent portrait. Canvas renders a 1080 × 1350 PNG using accepted terms. Long names are fitted to the available area. Blob URLs exist only in memory and are revoked; the original images and PNG are never persisted in storage. Download feedback reports a requested download, not an unverifiable filesystem save.

`scripts/export-resume.mjs` prints the actual résumé route through Chromium after local fonts and portrait load. The committed PDF is available without JavaScript; its source is the same readable print CSS used by the Print button.

`scripts/build-artifacts.mjs` uses bundled fonts and photography with @napi-rs/canvas to generate five committed 1200 × 630 PNG covers. Static metadata comes from `lib/metadata.ts`, with one build-time public origin. See SOCIAL-PREVIEWS.md.

## Development-only dependencies
Playwright/axe, tsx, TypeScript, ESLint, sharp and canvas are authoring or QA tools; no browser interaction calls these tools or a runtime service. `scripts/serve.mjs` is a local HTTP static-file server with ordinary gzip text compression and HEAD support, not an application backend.
