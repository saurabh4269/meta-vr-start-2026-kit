/**
 * Pre-record every scripted line with Sarvam bulbul:v3 into public/audio/tts/*.mp3
 * (run once after content changes; existing clips are skipped).
 *   node tools/bake-tts.ts            # reads SARVAM_API_KEY from .env.local or the environment
 *   node tools/bake-tts.ts --force    # re-record everything
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { allUtterances, clipId } from '../src/game/content.ts';
import { synthesize } from '../server/sarvam.ts';

function loadKey(): string {
  if (process.env.SARVAM_API_KEY) return process.env.SARVAM_API_KEY.trim();
  for (const f of ['.env.local', '.env']) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, 'utf8').match(/^SARVAM_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    if (m) return m[1].trim();
  }
  console.error('No SARVAM_API_KEY: add it to .env.local (gitignored) and re-run.');
  process.exit(1);
}

const key = loadKey();
const force = process.argv.includes('--force');
const out = 'public/audio/tts';
mkdirSync(out, { recursive: true });
const list = allUtterances();
const manifest: Record<string, string> = {};
let made = 0, skipped = 0, failed = 0;
for (const { speaker, text } of list) {
  const id = clipId(speaker, text);
  manifest[id] = `${speaker}: ${text}`;
  const file = `${out}/${id}.mp3`;
  if (!force && existsSync(file)) { skipped++; continue; }
  try {
    writeFileSync(file, await synthesize(text, speaker, key));
    made++;
    console.log(`ok   ${id}  ${text}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${id}  ${text}: ${(e as Error).message}`);
  }
  await new Promise((r) => setTimeout(r, 250));
}
writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
console.log(`\n${list.length} lines: ${made} recorded, ${skipped} already there, ${failed} failed.`);
if (failed) process.exit(2);
