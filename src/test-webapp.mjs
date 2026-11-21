import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const out = '/tmp';
const ts = Math.floor(Date.now() / 1000);
const TOKEN = `BROWSER_TEST_Q_${ts}`;

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
const page = await ctx.newPage();

let report = [];
function log(title, detail, pass, note = '') {
  report.push({ title, pass, detail, note });
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + title + (note ? ' — ' + note : '') + (detail ? ' | ' + detail : ''));
}
let ctr = 1;
async function shot(name) {
  const p = `${out}/${name}_${ctr++}.png`;
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

try {
  // 1. Homepage loads
  const r = await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 });
  const loadOk = r && r.status() === 200;
  log('Homepage loads', `status ${r?.status()}`, loadOk, loadOk ? '' : 'did not return 200');
  await page.waitForTimeout(1800);

  // 2. Unified testimonials section checks
  const full = await page.content();
  const clientVoicesCount = (full.match(/Client Voices/g) || []).length;
  const trustedCount = (full.match(/Trusted by Growing Businesses/g) || []).length;
  log('Single Client Voices header', `ClientVoices=${clientVoicesCount} Trusted=${trustedCount}`,
    clientVoicesCount === 1 && trustedCount === 1,
    clientVoicesCount !== 1 || trustedCount !== 1 ? 'DUPLICATE HEADER' : '');

  const section = page.locator('section').filter({ hasText: 'Client Voices' }).first();
  const present = await section.isVisible().catch(() => false);
  log('Testimonials section visible', present ? 'YES' : 'NO', !present ? 'section not visible' : '');
  const sectionHtml = await section.innerHTML();
  const starsLine = /\d\.\d out of 5/.test(sectionHtml) ? 'YES' : 'NO';
  const ratingsCount = /(\d+)\+ ratings/.test(sectionHtml) ? 'YES' : 'NO';
  log('Rating summary line', `stars=${starsLine} counts=${ratingsCount}`,
    starsLine === 'YES' && ratingsCount === 'YES',
    !present || starsLine === 'NO' || ratingsCount === 'NO' ? 'missing summary line' : '');
  const fiveCount = await section.locator('text=5').count();
  const oneCount = await section.locator('text=1').count();
  const chartPresent = fiveCount > 0 && oneCount > 0;
  log('5-bar rating chart (bars 5..1 visible)', chartPresent ? 'YES' : 'NO',
    !chartPresent ? 'bar labels not found' : '');
  const p1 = await shot('homepage_testimonials');
  report[report.length - 1].screenshot = p1;
  console.log('screenshot:', p1);

  // 3. No duplicate quote carousel
  log('No duplicate carousel', 'single header above means no duplicate carousel header',
    clientVoicesCount === 1, clientVoicesCount !== 1 ? 'duplicate detected' : '');

  // 4. Admin panel
  const ar = await page.goto(`${BASE}/auth?returnTo=%2Fadmin`, { waitUntil: 'networkidle', timeout: 45000 });
  log('Admin auth redirect', `status ${ar?.status()}`, ar?.status() === 200, '');
  await page.waitForTimeout(2500);
  const adminHtml = await page.content();
  const hasLogin = /sign in|log in|sign-in|email|password/i.test(adminHtml);
  log('Admin shows auth wall', hasLogin ? 'YES' : 'NO', !hasLogin ? 'no auth UI detected' : '');
  const p2 = await shot('admin_auth');
  report[report.length - 1].screenshot = p2;
  console.log('screenshot:', p2);

} catch (e) {
  log('ERROR', '', false, e.message);
}

await browser.close();
console.log('\n=== SCREENSHOTS ===');
for (const r of report) if (r.screenshot) console.log(r.screenshot);
