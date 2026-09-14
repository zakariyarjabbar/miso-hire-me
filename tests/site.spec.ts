import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { services, work } from '../lib/content';
import { STORAGE_KEY } from '../lib/storage';
import type { Envelope } from '../lib/offers';
const records = (page: Page) =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || 'null') as Envelope | null,
    STORAGE_KEY,
  );
const routes = [
  '/',
  '/about/',
  '/work/',
  ...work.map((w) => `/work/${w.slug}/`),
  '/resume/',
  '/hire/',
  '/my-offers/',
  '/offer/',
  '/the-fine-print/',
  '/demo/',
];
async function sample(page: Page) {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Load sample offer' }).click();
  await expect(page).toHaveURL(/\/hire\//);
  await expect(page.getByLabel('Your friendly name or company nickname')).toHaveValue(
    'The Sunny Desk Studio',
  );
}
async function send(page: Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('button', { name: 'Send demo offer', exact: true })
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
  await expect(page).toHaveURL(/\/offer\/\?ref=MISO-/);
}

test('all static routes, local assets, public metadata and direct refresh work', async ({
  request,
  browser,
}) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html).toContain('<title>');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('property="og:image:width" content="1200"');
    const expected =
      work.find((w) => route === `/work/${w.slug}/`)?.slug ||
      (route === '/resume/' ? 'resume' : route === '/work/' ? 'laptop-warming' : 'home');
    expect(html, route).toContain(`http://localhost:3005/social/${expected}.png`);
    expect(html).not.toContain('og:image" content="http://localhost:3005/social/undefined');
    const images = [
      ...html.matchAll(/(?:src|href)="(\/(?:images|fonts|social|downloads)\/[^"?]+)"/g),
    ].map((m) => m[1]);
    for (const image of new Set(images))
      expect((await request.get(image)).status(), image).toBe(200);
  }
  for (const cover of ['home', 'resume', ...work.map((w) => w.slug)]) {
    const response = await request.get(`/social/${cover}.png`);
    expect(response.ok()).toBeTruthy();
    const meta = await sharp(await response.body()).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);
  }
  const unknown = await request.get('/a-box-that-does-not-exist/');
  expect(unknown.status()).toBe(404);
  expect(await unknown.text()).toContain('Even in the box.');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/work/box-04/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Box 04: Quality Assurance');
  await page.reload();
  await expect(page.getByText('My approach', { exact: true })).toBeVisible();
  await context.close();
});

test('sample counteroffer, duplicate guard, accepted terms, PNG and local-only reference', async ({
  page,
  browser,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await sample(page);
  await send(page);
  await expect(page.getByText('Increase imaginary treats from 2 to 4.')).toBeVisible();
  await expect(page.getByText('Let me keep the empty cardboard box.')).toBeVisible();
  const before = (await records(page))!;
  expect(before.offers).toHaveLength(1);
  expect(before.offers[0].originalOffer.keepBox).toBe(false);
  await page.getByRole('button', { name: 'Accept Miso’s terms' }).click();
  await expect(page.getByRole('heading', { name: 'An excellent decision.' })).toBeVisible();
  const accepted = (await records(page))!;
  expect(accepted.offers).toHaveLength(1);
  expect(accepted.offers[0].acceptedTerms?.treats).toBe(4);
  expect(accepted.offers[0].acceptedTerms?.keepBox).toBe(true);
  expect(accepted.offers[0].originalOffer.treats).toBe(2);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download “I hired Miso” PNG' }).click();
  const download = await downloadPromise;
  expect(await download.failure()).toBeNull();
  await mkdir('docs/examples', { recursive: true });
  await download.saveAs('docs/examples/i-hired-miso.png');
  const meta = await sharp(await readFile('docs/examples/i-hired-miso.png')).metadata();
  expect([meta.width, meta.height]).toEqual([1080, 1350]);
  await expect(page.locator('.card-preview')).toBeVisible();
  const localURL = page.url();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'An excellent decision.' })).toBeVisible();
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto(localURL);
  await expect(
    otherPage.getByText('This offer isn’t stored in this browser.', { exact: false }),
  ).toBeVisible();
  await other.close();
  await page.goto('/my-offers/');
  await expect(page.locator('.history-item')).toHaveCount(1);
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Withdraw', exact: true }).click();
  await expect(page.locator('.status-label')).toHaveText('Withdrawn');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Make my first offer' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('draft refresh, query role selection, validation and a long-name accepted card', async ({
  page,
}) => {
  await page.goto('/hire/?service=meeting-cameo');
  await expect(page.getByRole('radio', { name: 'Meeting Cameo', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'Creative Supervision', exact: true }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Enter a friendly name of 1–60 characters.')).toBeVisible();
  await expect(page.getByLabel('Your friendly name or company nickname')).toBeFocused();
  const longName = 'WWWWWWWWWW WWWWWWWWWW WWWWWWWWWW WWWWWWWWWW WWWWWWWWWW WWWWW';
  expect(longName.length).toBe(60);
  await page.getByLabel('Your friendly name or company nickname').fill(longName);
  await page
    .getByLabel('What is the job?')
    .fill('Please supervise the creative direction and preserve my very long studio name.');
  await page.getByLabel('Pretend engagement length').selectOption('60');
  await page.getByLabel('A sunny workspace', { exact: false }).check();
  await page.reload();
  await expect(
    page.getByRole('radio', { name: 'Creative Supervision', exact: true }),
  ).toBeChecked();
  await expect(page.getByLabel('Your friendly name or company nickname')).toHaveValue(longName);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('12 imaginary treats', { exact: true })).toBeVisible();
  await page.getByLabel('Your offer in imaginary treats').fill('51');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Enter a whole number from 0 to 50.')).toBeVisible();
  await page.getByLabel('Your offer in imaginary treats').fill('12');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Send demo offer' })).toBeVisible();
  await page.getByRole('button', { name: 'Send demo offer' }).click();
  await expect(page.getByRole('heading', { name: 'An excellent decision.' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download “I hired Miso” PNG' }).click();
  await (await downloadPromise).saveAs('docs/examples/i-hired-miso-long-name.png');
  expect((await records(page))!.offers[0].acceptedTerms?.displayName).toBe(longName);
});

test('a counteroffer can be edited coherently without duplicating history', async ({ page }) => {
  await sample(page);
  await send(page);
  const original = (await records(page))!.offers[0];
  await page.getByRole('button', { name: 'Edit my offer' }).click();
  await expect(page.getByLabel('Your friendly name or company nickname')).toHaveValue(
    original.currentOffer.displayName,
  );
  await page.getByRole('radio', { name: 'Yes, it’s yours' }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Your offer in imaginary treats').fill('4');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Send demo offer' }).click();
  await expect(page.getByRole('heading', { name: 'An excellent decision.' })).toBeVisible();
  const data = (await records(page))!;
  expect(data.offers).toHaveLength(1);
  expect(data.offers[0].id).toBe(original.id);
  expect(data.offers[0].originalOffer.treats).toBe(2);
  expect(data.offers[0].events.map((e) => e.type)).toEqual(['submitted', 'revised']);
});

test('blocked writes never claim saving and explicit temporary fallback survives navigation only', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('miso-hire-me:demo:'))
        throw new DOMException('Blocked for test', 'QuotaExceededError');
      return set.call(this, key, value);
    };
  });
  await page.goto('/hire/');
  await page.getByRole('button', { name: 'Use sample details' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Send demo offer' }).click();
  await expect(page).toHaveURL(/\/hire\//);
  await expect(
    page.getByText('Your offer has not been sent or saved.', { exact: false }),
  ).toBeVisible();
  expect(await records(page)).toBeNull();
  await page.getByRole('button', { name: 'Use temporary session' }).click();
  await page.getByRole('button', { name: 'Send demo offer' }).click();
  await expect(page.getByRole('heading', { name: 'An excellent decision.' })).toBeVisible();
  await expect(page.getByText('Temporary-session offer.', { exact: false })).toBeVisible();
  expect(await records(page)).toBeNull();
  await page.reload();
  await expect(
    page.getByText('This offer isn’t stored in this browser.', { exact: false }),
  ).toBeVisible();
});

test('corrupt storage recovery, confirmation cancellation and scoped reset', async ({ page }) => {
  await page.goto('/demo/');
  await page.evaluate((key) => {
    localStorage.setItem('unrelated-app:key', 'keep');
    localStorage.setItem(key, '{broken');
  }, STORAGE_KEY);
  await page.reload();
  await expect(page.getByText('Saved data could not be read.', { exact: false })).toBeVisible();
  page.once('dialog', (d) => d.dismiss());
  await page.getByRole('button', { name: 'Reset Miso’s local data' }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe('{broken');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Reset Miso’s local data' }).click();
  await expect(page.getByText('Miso’s local data has been reset.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-app:key'))).toBe('keep');
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test('same-origin tabs observe new offers and withdrawals', async ({ context, page }) => {
  const second = await context.newPage();
  await second.goto('/my-offers/');
  await sample(page);
  await send(page);
  await expect(second.locator('.history-item')).toHaveCount(1);
  await page.getByRole('button', { name: 'Accept Miso’s terms' }).click();
  await expect(second.locator('.status-label')).toHaveText('Accepted');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Withdraw offer', exact: true }).click();
  await expect(second.locator('.status-label')).toHaveText('Withdrawn');
});

test('keyboard interview, wake toggle, reduced motion and mobile navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const question = page.getByRole('button', { name: 'Where do you see yourself in five years?' });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('“In the same sunbeam. With better compensation.”')).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  await page.goto('/about/');
  const wake = page.getByRole('button', { name: 'Wake Miso', exact: true });
  await wake.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Let Miso nap' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Let Miso nap' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: false }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Résumé' })
    .click();
  await expect(page.locator('.resume-sheet')).toBeVisible();
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printRequested = 'true';
    };
  });
  await page.getByRole('button', { name: 'Print résumé' }).click();
  expect(await page.locator('body').getAttribute('data-print-requested')).toBe('true');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé PDF' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('miso-freelance-cat-resume.pdf');
  expect(await download.failure()).toBeNull();
});

test('work and service actions preselect their intended role', async ({ page }) => {
  for (const item of work) {
    await page.goto(`/work/${item.slug}/`);
    await page.getByRole('link', { name: 'Put me to work' }).click();
    await expect(
      page.getByRole('radio', {
        name: services.find((s) => s.id === item.service)!.name,
        exact: true,
      }),
    ).toBeChecked();
  }
  await page.goto('/');
  await page.locator('.service-item').filter({ hasText: 'Meeting Cameo' }).click();
  await expect(page.getByRole('radio', { name: 'Meeting Cameo', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Use sample details' }).click();
  await page.getByRole('radio', { name: 'Creative Supervision', exact: true }).check();
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Creative Supervision', exact: true })).toBeChecked();
  await page.goto('/');
  await page.locator('.service-item').filter({ hasText: 'Meeting Cameo' }).click();
  await expect(page.getByRole('radio', { name: 'Meeting Cameo', exact: true })).toBeChecked();
});

test('responsive composition and automated accessibility on representative public and form pages', async ({
  page,
}) => {
  await mkdir('docs/captures', { recursive: true });
  const issues: unknown[] = [];
  const overflows: unknown[] = [];
  for (const width of [360, 390, 720, 768, 1024, 1440])
    for (const route of ['/', '/about/', '/hire/', '/work/laptop-warming/', '/resume/']) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      if (dimensions.scroll > width + 1) overflows.push({ route, ...dimensions });
      if (width === 390 || width === 1440) {
        const name = route === '/' ? 'home' : route.split('/').filter(Boolean).join('-');
        await page.screenshot({ path: `docs/captures/${name}-${width}.png`, fullPage: true });
        if (route === '/')
          await page.screenshot({ path: `docs/captures/home-viewport-${width}.png` });
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        if (result.violations.length)
          issues.push({
            width,
            route,
            violations: result.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
            })),
          });
      }
    }
  await writeFile(
    'docs/accessibility-results.json',
    JSON.stringify({ issues, overflows }, null, 2),
  );
  expect(overflows).toEqual([]);
  expect(issues).toEqual([]);
});
