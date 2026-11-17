// Dev-only: headless screenshots of world-preview.html into artifacts/world/.
// Usage: node tools/world/shoot.mjs [name=query ...]   (preview server on :8096)
// With no args, shoots the standard set (every spot x seat/vendor/wide, reveals).
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.PREVIEW_URL ?? 'http://127.0.0.1:8096/world-preview.html';
const OUT = new URL('../../artifacts/world/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const std = [];
for (const spot of ['kachori', 'flowers', 'auto', 'paranthe', 'bus', 'minaret']) {
  for (const view of ['seat', 'vendor', 'wide', 'street']) std.push([`${spot}-${view}`, `spot=${spot}&view=${view}`]);
  std.push([`${spot}-budget`, `spot=${spot}&view=seat&budget=1`]);
}
std.push(['bus-arrived', 'spot=bus&view=seat&busarrive=1&t=8']);
std.push(['bus-arrived-wide', 'spot=bus&view=wide&busarrive=1&t=8']);
std.push(['bus-arrived-budget', 'spot=bus&view=seat&busarrive=1&t=8&budget=1']);
std.push(['auto-arrived', 'spot=auto&view=seat&arrive=1&t=8']);
std.push(['auto-arrived-budget', 'spot=auto&view=seat&arrive=1&t=8&budget=1']);
std.push(['minaret-awe', 'spot=minaret&view=awe']);
std.push(['minaret-up', 'spot=minaret&view=up']);
std.push(['masjid-cover', 'spot=minaret&view=cover']);
for (const r of [2, 60]) std.push([`reveal-${r}`, `spot=kachori&view=seat&reveal=${r}`]);
std.push(['reveal-2-wide', 'spot=kachori&view=wide&reveal=2']);
std.push(['ride-rickshaw', 'spot=kachori&view=ride&ride=flowers:rickshaw&t=4']);
std.push(['ride-rickshaw-side', 'spot=kachori&view=rideside&ride=flowers:rickshaw&t=12']);
std.push(['ride-auto', 'spot=auto&view=ride&ride=paranthe:auto&t=4']);
std.push(['ride-auto-side', 'spot=auto&view=rideside&ride=paranthe:auto&t=12']);
std.push(['ride-bus', 'spot=bus&view=ride&ride=minaret:bus&t=5']);
std.push(['ride-bus-side', 'spot=bus&view=rideside&ride=minaret:bus&t=12']);
std.push(['ride-bus-budget', 'spot=bus&view=ride&ride=minaret:bus&t=5&budget=1']);
std.push(['kachori-offer', 'spot=kachori&view=side&gesture=offer&t=7']);
std.push(['paranthe-talk', 'spot=paranthe&view=seat&talk=1&t=7']);
std.push(['minaret-namaste', 'spot=minaret&view=side&gesture=namaste&t=7']);
std.push(['bus-receive', 'spot=bus&view=seat&busarrive=1&gesture=receive&t=9']);

const jobs = process.argv.length > 2 ? process.argv.slice(2).map((a) => a.split('=').length > 1 ? [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)] : [a, a]) : std;

// GPU via ANGLE/GL when available (WORLD_GL=swiftshader forces software).
const gl = process.env.WORLD_GL ?? 'gl';
const browser = await chromium.launch({ args: [`--use-angle=${gl}`, '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.type(), m.text().slice(0, 400)); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
const stats = {};
for (const [name, query] of jobs) {
  await page.goto(`${BASE}?${query}&clean=1`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  await page.waitForTimeout(400);
  stats[name] = await page.evaluate(() => window.__stats);
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log(name, JSON.stringify(stats[name]));
}
writeFileSync(`${OUT}stats.json`, JSON.stringify(stats, null, 2));
await browser.close();
