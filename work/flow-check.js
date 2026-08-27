const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4174/prototype.html');
  await page.getByRole('button', { name: 'Start fresh application' }).click();
  await page.getByRole('button', { name: 'Continue to address' }).click();
  await page.getByRole('button', { name: 'Continue to documents' }).click();
  await page.getByRole('button', { name: 'Review readiness' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Continue to appointment' }).click();
  await page.getByRole('button', { name: 'PSK Bengaluru, Lalbagh' }).click();
  await page.locator('[data-day="0"]').click();
  await page.locator('[data-slot="0"]').click();
  await page.getByRole('button', { name: 'Mock pay and book' }).click();
  console.log((await page.locator('h1').textContent()).trim());
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
