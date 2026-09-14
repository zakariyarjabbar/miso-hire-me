# Verification record

Date: 11 September 2026. Local workspace: `project5`, package slug `miso-hire-me`. Production checks use the actual `out/` export over HTTP at `http://127.0.0.1:3006`. No external deployment was performed.

## Commands and results

| Check | Actual result |
| --- | --- |
| `npm run typecheck` | Passed, strict TypeScript |
| `npm run lint` | Passed, Next core-web-vitals and TypeScript ESLint configs |
| `npm test` | 15 passed, 0 failed; pure negotiation/lifecycle/storage tests |
| `npm run build` | Passed; static App Router output with all three generated work slugs |
| `npm run test:browser` | 10 passed, 0 failed; final run 20.1 seconds on Chromium |
| Responsive checks | No horizontal overflow on 5 representative pages at 360, 390, 720, 768, 1024 and 1440px: 30 combinations |
| axe WCAG A/AA checks | 0 reported violations across 5 representative pages at 390 and 1440px |
| PDF generation/inspection | Actual one-page A4 PDF generated, downloaded, rendered with Poppler, visually inspected and text-extracted |
| PNG download checks | Real 1080 × 1350 PNG downloaded for sample and 60-character wide-letter name; dimensions verified with sharp |
| Social metadata | All 12 site routes return HTML titles, canonical/OG/Twitter fields and the intended local cover; 5 covers verified at 1200 × 630 |
| Mechanical design detector | No findings in its bounded inspection; raw `design-detector.json` retained |
| Touch and link smoke check | Passed emulated mobile touch for menu, wake, interview and form; 19 local link targets returned successfully |

Raw browser results: [browser-results.json](browser-results.json). Accessibility/overflow results: [accessibility-results.json](accessibility-results.json). These checks support an accessibility effort, not a claim of audited WCAG conformance.

## Interaction scenarios actually exercised

- Direct navigation/refresh for all fixed routes and three work slugs; true 404 for an unknown path. A public work page renders with JavaScript disabled.
- Work and service links select the requested role, including when reusing an existing edited draft. Refresh preserves a visitor's later manual role choice.
- Visible validation and focus for missing name/job, out-of-range and non-integer treat amounts; duration/sunshine fee calculation.
- Sample counteroffer requests exactly 4 imaginary treats and keeping the empty box. Original proposal remains unchanged when final terms are accepted.
- Repeated submission clicks create one record. Counteroffer edit updates that same record; retrying unchanged edited terms does not add duplicate revision events. Duplicate accept/withdraw operations do not multiply history events.
- Accepted offers survive refresh. History, withdrawal, deletion, declined confirmation and confirmed scoped reset behave as described.
- Same-origin tabs observe new offers and status changes. A clean separate browser context shows the missing-local-record explanation for the same reference.
- Simulated blocked/full writes produce no durable success and do not navigate to a saved result. Explicit temporary mode permits the journey, retains state on client navigation, and loses it on refresh.
- Corrupt and unsupported-version storage is preserved until deliberate reset. Recoverable records remain readable. Unrelated storage keys survive reset.
- Keyboard Enter operates interview and wake state; nap state persists. Reduced motion disables smooth scrolling. Mobile menu links and the résumé print control work.
- PDF and card controls trigger actual browser downloads. Card fonts and cat image load before rendering; names remain complete, plain text, and inside the layout.

Storage failures are injected in isolated QA contexts. No attempt was made to fill the user's real browser storage. Cross-tab updates are best effort, not database transactions.

## Visual review

Inspected desktop/mobile homepage, About, offer form and laptop case study; résumé PDF; standard/long-name card; and all social covers at 360px wide plus centered square crops. Corrected caption/portrait overlap on phones, long-name wrapping, exact intrinsic image dimensions, and small-text/button contrast. A final confirmation showed the corrected compositions with no material clipping or broken imagery.

Files:

- [Desktop portfolio](captures/home-1440.png) and [mobile portfolio](captures/home-390.png)
- [Desktop first viewport](captures/home-viewport-1440.png) and [mobile first viewport](captures/home-viewport-390.png)
- [Desktop form](captures/hire-1440.png) and [mobile form](captures/hire-390.png)
- [Work story](captures/work-laptop-warming-1440.png) and [About](captures/about-1440.png)
- [Rendered résumé](captures/resume-pdf.png)
- [Downloaded sample card](examples/i-hired-miso.png) and [long-name card](examples/i-hired-miso-long-name.png)
- [Social thumbnail and square-crop sheet](captures/social-previews.png)

The photographic set uses one approved cat. Small generative continuity differences are recorded in ASSETS.md; the nap/awake pair is visually matched, not claimed to be pixel-identical. PDF text extraction inserts some spacing around kerned glyphs; the verification normalized whitespace, and rendered output is readable.

## Measured contrast

| Pair | Contrast |
| --- | --- |
| Paper on dark-tomato action button | 5.17:1 |
| Dark-tomato small text on powder blue | 4.75:1 |
| Dark-tomato small text on butter | 5.48:1 |
| Ink on paper | 15.34:1 |
| Muted body text on paper | 6.99:1 |
| Ink on powder blue | 10.97:1 |

The starting tomato remains a brand token/favicon color. Action surfaces use `#C73522`; small accent text uses `#AA2C1B`. Original paper-on-tomato was only 4.30:1 and was corrected. Raw ratios are in [contrast-results.json](contrast-results.json).

## Measured performance

One synthetic Chromium sample per page on the local gzip-compressed static preview: 390 × 844 viewport, cold cache, 4× CPU slowdown, 150ms latency, 1.6Mbps download / 750Kbps upload, no scroll or interaction. Browser QA was also running locally. These are lab observations, not field data, a Lighthouse score, or a guarantee on other devices.

| Page | LCP | CLS | Transferred bytes |
| --- | --- | --- | --- |
| Homepage | 1.860s | 0 | 453,864 |
| Offer builder | 0.712s | 0 | 254,111 |
| Laptop work story | 2.932s | 0 | 627,757 |

No external network requests were observed. The work story remains the heaviest representative page under this throttling profile. The mobile hero uses a 480 × 720 WebP (~62KB), with the larger transparent portrait retained on desktop and for exports. Initial form layout shift was 0.3448; reserving its hydration space reduced the measured final value to 0. Standard static-file text compression reduced unnecessary transfer overhead. Before/after reports are preserved in `performance-before.json` and [performance-results.json](performance-results.json).

## Honest limits and unrun checks

- No public hosting, public canonical-origin validation, or real messaging-platform preview fetch. Local metadata is intentionally local. Platform crops/caches can differ.
- No Safari/Firefox or physical-device test, manual screen-reader audit, certified accessibility audit, field performance dataset or measured interaction latency (INP).
- The 720px reflow check covers the effective layout width of a 1440px window at 200% zoom; a separate native browser text-only-zoom audit was not performed.
- Browser storage is user-editable and device-local. No cloud synchronization, real message delivery, animal booking, money, contract or public offer verification exists.

No known blocking functional defects remain in the requested local demo.
