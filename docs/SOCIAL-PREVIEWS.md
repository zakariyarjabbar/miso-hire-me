# Social previews

Five dedicated 1200 × 630 PNG covers are bundled in `public/social/`. They combine the actual local typefaces, generated Miso photographs, powder blue/butter/paper, and dark tomato lettering. Main title and cat are centered within a safe square crop. No personal visitor data appears in these images.

| Public route | Cover |
| --- | --- |
| / | home.png |
| /work/laptop-warming/ | laptop-warming.png |
| /work/box-04/ | box-04.png |
| /work/sofa-occupancy/ | sofa-occupancy.png |
| /resume/ | resume.png |

The work index deliberately uses laptop-warming.png. Other public and local-data routes use the public homepage cover. Every page has a route-specific title, description, canonical URL, Open Graph title/description/URL/image/dimensions/alt, and Twitter `summary_large_image` image/title/description/alt. Work metadata is derived from the same public typed record as the visible story. There are no inherited file-based `opengraph-image` overrides.

## Build-time origin
`NEXT_PUBLIC_SITE_ORIGIN` is the single optional non-secret setting, passed through `metadataBase` and `lib/metadata.ts`. The local default is `http://localhost:3005` (development server). Static output can be inspected on port 3006. Local metadata is intentionally local and is not a share-ready public deployment.

For a future explicitly authorized deployment, use the actual deployed HTTPS origin, for example by setting the variable in the build environment to that verified origin and running `npm run build` again. Do not invent a domain, publish a localhost canonical, or include offer nicknames/terms in tags. The origin validator rejects non-HTTP(S) URLs, paths, queries and fragments.

`npm run assets` deterministically rebuilds all covers; images are committed so an ordinary application build does not require an image-generation service. `npm run test:browser` checks static HTML tags, route/cover associations, local image responses and 1200 × 630 dimensions.

## Scope of verification
Local static HTML and image URLs are checked without authentication or JavaScript. A `noindex, follow` robots directive avoids indexing the demo while permitting fetches; no blanket crawler block is used. A final thumbnail/contact sheet is in `docs/captures/social-previews.png`.

No external publishing was authorized or performed. Actual Slack, X, LinkedIn or messaging-platform unfurls have not been tested. Those platforms can cache images or crop them differently; identical results across DMs are not guaranteed. Do not send messages to test previews without authorization.

Framework references verified for this implementation: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports) and [metadata/OG guidance](https://nextjs.org/docs/app/getting-started/metadata-and-og-images). Version-specific bundled guides in `node_modules/next/dist/docs` were also consulted.
