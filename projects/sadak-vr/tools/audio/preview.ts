/**
 * Dev-only preview of src/sadak-audio: a button for every SFX, the music
 * (start, duck, enable), the chime, the ambience with its inputs, and an
 * offline bounce of the music with level stats. `window.__audio` and
 * `window.renderMusic` are for the headless check (tools/audio/check.mjs).
 */
import { sadakAudio, SFX_NAMES, CHANDNI_CHOWK, type Nearby } from '../../src/sadak-audio/index.js';
import { MusicEngine } from '../../src/sadak-audio/music.js';
import { playPlaceChime } from '../../src/sadak-audio/chime.js';
import { CITY_MUSIC } from '../../src/sadak-audio/delhi.js';

const $ = <T extends HTMLElement = HTMLButtonElement>(id: string) => document.getElementById(id) as T;
const out = $<HTMLPreElement>('out');
const log = (s: string) => {
  out.textContent = `${s}\n${out.textContent ?? ''}`.slice(0, 4000);
};

function toggle(id: string, fn: (on: boolean) => void, initial = false) {
  let on = initial;
  const b = $(id);
  b.classList.toggle('on', on);
  b.onclick = () => {
    on = !on;
    b.classList.toggle('on', on);
    fn(on);
  };
}

$('unlock').onclick = () => {
  sadakAudio.unlock();
  log(`unlocked: ${sadakAudio.context?.state} @ ${sadakAudio.context?.sampleRate} Hz`);
};
toggle('mute', (on) => (sadakAudio.muted = on));

$('music-start').onclick = () => sadakAudio.music.start('delhi');
$('music-stop').onclick = () => sadakAudio.music.stop();
toggle('music-duck', (on) => sadakAudio.music.duck(on));
toggle('music-enabled', (on) => (sadakAudio.music.enabled = on), true);

for (const name of SFX_NAMES) {
  const b = document.createElement('button');
  b.textContent = name;
  b.onclick = () => sadakAudio.sfx.play(name);
  $('sfx').appendChild(b);
}
toggle('sfx-enabled', (on) => (sadakAudio.sfx.enabled = on), true);
$('chime').onclick = () => sadakAudio.chime();

$('amb-start').onclick = () => sadakAudio.ambience.start();
$('amb-stop').onclick = () => sadakAudio.ambience.stop();
toggle('amb-duck', (on) => sadakAudio.ambience.duck(on));
toggle('waiting', (on) => sadakAudio.ambience.setNearby({ waiting: on }));
$('bell').onclick = () => sadakAudio.ambience.ringBell();
$('azaan').onclick = () => sadakAudio.ambience.callAzaan();

const sliders: [keyof Nearby, number, number][] = [
  ['vehicles', 0, 24],
  ['people', 0, 60],
  ['templeDist', 0, 100],
  ['mosqueDist', 0, 400],
];
for (const [key, min, max] of sliders) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const value = document.createElement('output');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.value = String(CHANDNI_CHOWK[key]);
  value.textContent = input.value;
  input.oninput = () => {
    value.textContent = input.value;
    sadakAudio.ambience.setNearby({ [key]: Number(input.value) });
  };
  label.append(key, input, value);
  $('nearby').appendChild(label);
}

// The director's per-frame call, as the XR loop will make it.
let last = performance.now();
function frame(now: number) {
  sadakAudio.ambience.update((now - last) / 1000);
  last = now;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------------- offline bounce ---------------- */

type Stats = { seconds: number; sampleRate: number; rms: number; rmsDb: number; peak: number; over1: number; nonFinite: number; silentSeconds: number; perSecondRms: number[] };

function stats(buf: AudioBuffer): Stats {
  const sr = buf.sampleRate;
  const secs = Math.floor(buf.length / sr);
  let sum = 0;
  let peak = 0;
  let over1 = 0;
  let nonFinite = 0;
  const per = new Float64Array(secs);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) {
      const x = d[i];
      if (!Number.isFinite(x)) {
        nonFinite++;
        continue;
      }
      const a = Math.abs(x);
      if (a > peak) peak = a;
      if (a > 1) over1++;
      sum += x * x;
      const s = Math.floor(i / sr);
      if (s < secs) per[s] += x * x;
    }
  }
  const rms = Math.sqrt(sum / (buf.length * buf.numberOfChannels));
  const perSecondRms = Array.from(per, (v) => +Math.sqrt(v / (sr * buf.numberOfChannels)).toFixed(4));
  return {
    seconds: buf.length / sr,
    sampleRate: sr,
    rms: +rms.toFixed(4),
    rmsDb: +(20 * Math.log10(rms)).toFixed(1),
    peak: +peak.toFixed(4),
    over1,
    nonFinite,
    silentSeconds: perSecondRms.filter((v) => v < 1e-4).length,
    perSecondRms,
  };
}

async function renderMusic(seconds = 20, seed = 1): Promise<Stats> {
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, sr * seconds, sr);
  const engine = new MusicEngine({ context: ctx, offline: true, seed });
  engine.start(CITY_MUSIC.delhi);
  engine.renderUntil(seconds);
  return stats(await ctx.startRendering());
}

async function renderChime(): Promise<Stats> {
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, sr * 3, sr);
  playPlaceChime(ctx, ctx.destination, CITY_MUSIC.delhi, 0);
  return stats(await ctx.startRendering());
}

$('render').onclick = async () => {
  log('rendering…');
  const s = await renderMusic(20);
  log(JSON.stringify(s, null, 1));
};

Object.assign(window, { __audio: sadakAudio, renderMusic, renderChime });
