import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = process.env.MISO_PREVIEW_URL || 'http://127.0.0.1:3005';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
  const response = await page.goto(`${base}/resume/`);
  if (!response?.ok()) throw new Error('The résumé page must be running before export.');
  await page.locator('.resume-sheet').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.querySelectorAll('.resume-sheet img')).map((image) => image.decode()),
    );
  });
  await mkdir('public/downloads', { recursive: true });
  await page.pdf({
    path: 'public/downloads/miso-freelance-cat-resume.pdf',
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(
    'Generated résumé PDF from the actual print view, with loaded local fonts and portrait.',
  );
} finally {
  await browser.close();
}
