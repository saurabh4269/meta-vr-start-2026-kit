// Dev-only: evaluate an expression against the preview page's `__street` (preview server on :8096).
// Usage: node tools/world/probe.mjs "<query>" "<js expression using s = window.__street>"
import { chromium } from 'playwright';

const [query = 'spot=kachori&view=seat', expr = 'Object.keys(s)'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 320, height: 200 } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
p.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text()); });
await p.goto(`http://127.0.0.1:8096/world-preview.html?${query}&clean=1`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
console.log(await p.evaluate(`(() => { const s = window.__street; return JSON.stringify(${expr}); })()`));
await b.close();
