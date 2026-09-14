# Miso project rules

Read CHARACTER.md, PRODUCT.md, DESIGN.md, and docs/STATUS.md first; then docs/ARCHITECTURE.md for state or routing work.

- This is one fictional cat's personal portfolio. Miso speaks in first person. Never add an agency, marketplace, real booking, payment, contact collection, or live AI.
- Preserve the approved generated Miso reference and markings in CHARACTER.md. Future user photographs supersede generated visual authority.
- Next.js App Router, strict TypeScript, static export. All mutable visitor data remains in React and the versioned localStorage adapter. No application server, database, authentication, analytics, service keys, or IndexedDB.
- Keep public content, metadata, offer rules, storage, exports, and presentation separate. Use local fonts and assets. Never store image blobs in localStorage.
- Never claim durable saving until storage succeeds; require explicit choice for temporary memory mode. Mutations re-read current storage. Reset only namespaced app keys.
- Commands: npm run typecheck; npm run lint; npm test; npm run build; npm run preview; npm run test:browser (static preview running).
- Complete means all requested routes, local offer lifecycle, working downloads, responsive browser checks, and accurate QA/status documentation. Never report unrun checks as passed.
- Work locally; external publishing and messaging require explicit user authorization. Make routine reversible implementation decisions without approval rounds.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
