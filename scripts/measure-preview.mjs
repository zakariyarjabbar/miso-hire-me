import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const origin = process.env.MISO_PREVIEW_URL || 'http://127.0.0.1:3006';
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const route of ['/', '/hire/', '/work/laptop-warming/']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.__misoMetrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__misoMetrics.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__misoMetrics.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const external = [];
    page.on('request', (req) => {
      if (!req.url().startsWith(origin)) external.push(req.url());
    });
    await page.goto(origin + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    results.push(
      await page.evaluate(
        ({ route, external }) => {
          const nav = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource');
          return {
            route,
            viewport: '390 × 844',
            lcpMs: Math.round(window.__misoMetrics.lcp),
            cls: Number(window.__misoMetrics.cls.toFixed(4)),
            domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
            transferredBytes: resources.reduce((sum, r) => sum + r.transferSize, nav.transferSize),
            scriptTransferredBytes: resources
              .filter((r) => r.initiatorType === 'script')
              .reduce((sum, r) => sum + r.transferSize, 0),
            requests: resources.length + 1,
            externalRequests: external,
          };
        },
        { route, external },
      ),
    );
    await context.close();
  }
} finally {
  await browser.close();
}
const report = {
  kind: 'Single synthetic Chromium run per route, local static HTTP server with gzip text compression. Not field data or a Lighthouse score.',
  conditions:
    '390 × 844 viewport; cache disabled; 4× CPU slowdown; 150 ms latency; 1.6 Mbps download and 750 Kbps upload. No interaction or scroll.',
  results,
};
await writeFile('docs/performance-results.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
