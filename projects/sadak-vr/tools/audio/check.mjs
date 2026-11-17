// Dev-only: headless check of tools/audio/preview.html (preview server on :8097).
// Presses every button, lets the street play, fails on any console error, then
// bounces 20 s of the music offline and prints its level stats.
//   npx vite --config tools/audio/vite.config.ts &   node tools/audio/check.mjs
import { chromium } from 'playwright';

const URL_ = process.env.PREVIEW_URL ?? 'http://127.0.0.1:8097/tools/audio/preview.html';
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(URL_, { waitUntil: 'load' });
const click = (sel) => page.click(sel);
await click('#unlock');
await click('#music-start');
await click('#amb-start');
for (const b of await page.$$('#sfx button')) {
  await b.click();
  await page.waitForTimeout(120);
}
await click('#chime');
await click('#bell');
await click('#azaan');
await click('#waiting');
await page.waitForTimeout(3000);
await click('#music-duck');
await click('#amb-duck');
await page.waitForTimeout(1500);
await click('#music-duck');
await click('#amb-duck');
await click('#mute');
await page.waitForTimeout(500);
await click('#mute');
await click('#music-enabled');
await click('#music-enabled');
await click('#sfx-enabled');
await click('#sfx-enabled');
await page.waitForTimeout(3000);

const live = await page.evaluate(() => ({ state: window.__audio.context.state, t: window.__audio.context.currentTime }));

// Live levels at the master output (an analyser on the private root gain).
const levels = await page.evaluate(async () => {
  const a = window.__audio;
  const ctx = a.context;
  const an = ctx.createAnalyser();
  an.fftSize = 2048;
  a.root.connect(an);
  const buf = new Float32Array(an.fftSize);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rms = async (ms) => {
    let s = 0;
    let n = 0;
    const end = performance.now() + ms;
    while (performance.now() < end) {
      an.getFloatTimeDomainData(buf);
      for (const x of buf) s += x * x;
      n += buf.length;
      await wait(40);
    }
    return +Math.sqrt(s / n).toFixed(4);
  };
  const out = {};
  a.ambience.stop();
  await wait(2500);
  out.musicOnly = await rms(2000);
  a.music.duck(true);
  await wait(1500);
  out.musicDucked = await rms(1000);
  a.music.duck(false);
  a.music.stop();
  a.ambience.start();
  await wait(3000);
  out.ambienceOnly = await rms(3000);
  a.ambience.duck(true);
  await wait(1500);
  out.ambienceDucked = await rms(2000);
  a.ambience.duck(false);
  a.music.start('delhi');
  await wait(4000);
  out.both = await rms(2000);
  a.muted = true;
  await wait(600);
  out.muted = await rms(1000);
  a.muted = false;
  return out;
});
const music = await page.evaluate(() => window.renderMusic(20, 1));
const music2 = await page.evaluate(() => window.renderMusic(20, 7));
const chime = await page.evaluate(() => window.renderChime());
await browser.close();

const brief = (s) => ({ ...s, perSecondRms: s.perSecondRms.join(' ') });
console.log(JSON.stringify({ live, levels, music: brief(music), musicSeed7: brief(music2), chime: brief(chime), errors }, null, 1));
const bad = errors.length || music.rms < 0.01 || music.peak > 1 || music.nonFinite || music.silentSeconds > 0 || chime.peak > 1 || chime.rms < 1e-3;
process.exit(bad ? 1 : 0);
