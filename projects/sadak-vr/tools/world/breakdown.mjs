// Dev-only: print the street's triangle count per mesh name (preview server on :8096).
import { chromium } from 'playwright';

const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
p.on('console', (m) => { if (m.text().startsWith('[world]')) console.log(m.text()); });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(`http://127.0.0.1:8096/world-preview.html?spot=${process.argv[2] ?? 'kachori'}&view=top&budget=1&clean=1`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const bd = await p.evaluate(() => window.__breakdown);
const st = await p.evaluate(() => window.__stats);
for (const [k, v] of Object.entries(bd).sort((a, c) => c[1] - a[1])) console.log(String(v).padStart(8), k);
console.log('stats', JSON.stringify(st));
await b.close();
