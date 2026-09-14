import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3006',
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  reporter: [['list'], ['json', { outputFile: 'docs/browser-results.json' }]],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:3006',
    reuseExistingServer: true,
  },
});
