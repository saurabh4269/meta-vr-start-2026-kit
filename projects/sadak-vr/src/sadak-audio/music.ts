/*
 * Ported from SADAK, game_engine/lib/audio/music/engine.ts
 * (SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused in Sadak VR with the owner's permission).
 * Changes: the performance (scheduler, phrase choice, tihai, drone,
 * humanising), master level 0.27, compressor and duck fades (0.35 s down,
 * 1.4 s back) are verbatim. The engine no longer creates its own
 * AudioContext: it plays into a context and output node it is given (Sadak
 * VR shares one context), and `offline` replaces "a context was passed" as
 * the switch for bounce mode. `setEnabled(false)` stops the scheduler
 * outright (SADAK only gained it to zero) so a muted Quest does no music work;
 * enabling again restarts the composition from its intro.
 */

/**
 * Performs a {@link Composition}: a look-ahead scheduler that lays down one
 * tala cycle at a time, a little before it is due.
 *
 * Each cycle it reads the form (intro once, then the sections round and
 * round), picks each part's phrase or pattern for the section (varying, and
 * never the same phrase twice running), plays the drums' tihai on a
 * section's last cycle, and keeps the drone going. Timing is humanised a
 * few milliseconds and sam gets the accent.
 *
 * Works on a live AudioContext (the game) or an OfflineAudioContext (a
 * bounce: pass `offline: true`, call `renderUntil` with the length, then
 * startRendering).
 */

import { COMPOSITIONS, type Composition, type DrumPart, type MelodicPart, type Section } from "./delhi.js";
import {
  channel,
  held,
  HELD,
  impulse,
  KITS,
  KIT_GAIN,
  pluck,
  PLUCKS,
  sruti,
  sub,
  tanpura,
  type Channel,
  type Ctx,
  type Drone,
  type Kit,
  type Voice,
} from "./instruments.js";
import { midiToHz, parsePattern, parsePhrase, rng, stepsPerCycle, swaraHz, SWARA_RATIO, type Pattern, type Phrase, type Swara } from "./theory.js";

/** Overall music level: present, but under the voice. */
export const MASTER_LEVEL = 0.27;
export const DUCK_FADE = 0.35;
export const RESUME_FADE = 1.4;
/** How far ahead cycles are laid down, seconds. */
const LOOKAHEAD = 0.8;

type PartState = { part: MelodicPart; voice: Voice; ch: Channel; phrases: Map<Section, Phrase[]>; current: Phrase | null; startCycle: number; last: number; prevHz: number | null };
type DrumState = { part: DrumPart; kit: Kit; ch: Channel; patterns: Map<Section, Pattern[]>; fill: Pattern | null };

/** The swara above `s` in the raga, for a gamaka's oscillation. */
function upper(c: Composition, s: Swara, octave: number, saHz: number): number {
  const order = c.raga.swaras.map((x) => SWARA_RATIO[x]).sort((a, b) => a - b);
  const r = SWARA_RATIO[s];
  const next = order.find((x) => x > r + 1e-6);
  return next ? saHz * next * Math.pow(2, octave) : saHz * 2 * order[0] * Math.pow(2, octave);
}

class Performance {
  readonly c: Composition;
  private bus: GainNode;
  private reverb: ConvolverNode;
  private wet: GainNode;
  private parts: PartState[];
  private drums: DrumState[];
  private drone: Drone | null;
  private rand: () => number;
  private saHz: number;
  private stepSec: number;
  private steps: number;
  private next: number;
  private cycle = 0;
  private formIndex = 0;
  private inSection = 0;

  constructor(private ctx: Ctx, out: AudioNode, c: Composition, start: number, seed: number) {
    this.c = c;
    this.rand = rng(seed);
    this.saHz = midiToHz(c.sa);
    this.steps = stepsPerCycle(c.tala);
    this.stepSec = 60 / (c.bpm * c.tala.sub);
    this.next = start;

    this.bus = ctx.createGain();
    this.bus.gain.value = 0;
    this.bus.gain.setTargetAtTime(1, start, 0.4);
    this.bus.connect(out);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = impulse(ctx, c.space);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.9;
    this.reverb.connect(this.wet);
    this.wet.connect(this.bus);

    this.parts = c.parts.map((p) => {
      const ch = channel(ctx, this.bus, this.reverb, p);
      const voice = p.voice === "sub" ? sub(ctx, ch.input) : p.voice in PLUCKS ? pluck(ctx, ch.input, p.voice as keyof typeof PLUCKS) : held(ctx, ch.input, p.voice as keyof typeof HELD);
      const phrases = new Map<Section, Phrase[]>();
      for (const [s, list] of Object.entries(p.phrases)) phrases.set(s as Section, list!.map(parsePhrase));
      return { part: p, voice, ch, phrases, current: null, startCycle: 0, last: -1, prevHz: null };
    });
    this.drums = c.drums.map((d) => {
      const ch = channel(ctx, this.bus, this.reverb, d);
      const patterns = new Map<Section, Pattern[]>();
      for (const [s, list] of Object.entries(d.patterns)) patterns.set(s as Section, list!.map(parsePattern));
      return { part: d, kit: KITS[d.kit](this.saHz), ch, patterns, fill: d.fill ? parsePattern(d.fill) : null };
    });
    if (c.drone) {
      const ch = channel(ctx, this.bus, this.reverb, { level: c.drone === "tanpura" ? 0.32 : 0.5, send: 0.35 });
      this.drone = c.drone === "tanpura" ? tanpura(ctx, ch.input, this.saHz) : sruti(ctx, ch.input, this.saHz);
    } else this.drone = null;
  }

  /** Lay down every cycle that starts before `until`. */
  scheduleUntil(until: number) {
    while (this.next < until) {
      this.play(this.next);
      this.next += this.steps * this.stepSec;
    }
  }

  /** If a throttled tab let the clock run past us, rejoin at the next cycle. */
  catchUp(now: number) {
    if (this.next < now) {
      const len = this.steps * this.stepSec;
      this.next += Math.ceil((now - this.next) / len) * len;
    }
  }

  private play(t: number) {
    const form = this.c.form;
    const { section, cycles } = form[this.formIndex];
    const last = this.inSection === cycles - 1;
    const cycleLen = this.steps * this.stepSec;
    // A new section starts every part on a fresh phrase.
    if (this.inSection === 0) for (const p of this.parts) p.current = null;

    this.drone?.cycle(t, cycleLen);

    for (const d of this.drums) {
      const list = d.patterns.get(section);
      if (!list) continue;
      const pat = last && d.fill && section !== "intro" ? d.fill : list[this.rand() < 0.65 ? 0 : Math.floor(this.rand() * list.length)];
      for (const s of pat.strokes) {
        const jitter = d.part.kit === "kick" ? 0 : (this.rand() - 0.5) * 0.008;
        const accent = s.at === 0 ? 1.15 : 1;
        const vel = Math.min(1.1, (0.82 + this.rand() * 0.18) * accent);
        d.kit(this.ctx, d.ch.input, t + s.at * this.stepSec + jitter, s.bol, vel * KIT_GAIN[d.part.kit]);
      }
    }

    for (const p of this.parts) {
      const list = p.phrases.get(section);
      if (!list) {
        p.current = null;
        p.prevHz = null;
        continue;
      }
      // A phrase may span several cycles: start a new one only when the
      // last has run out, and never the same one twice running.
      const spent = p.current ? (this.cycle - p.startCycle) * this.steps >= p.current.steps : true;
      if (spent) {
        let k = Math.floor(this.rand() * list.length);
        if (list.length > 1 && k === p.last) k = (k + 1) % list.length;
        p.current = list[k];
        p.last = k;
        p.startCycle = this.cycle;
      }
      const phrase = p.current!;
      const from = (this.cycle - p.startCycle) * this.steps;
      for (const e of phrase.events) {
        if (e.at < from || e.at >= from + this.steps) continue;
        const octave = e.octave + p.part.octave;
        const hz = swaraHz(this.saHz, e.swara, octave);
        const at = t + (e.at - from) * this.stepSec + (p.part.voice === "sub" ? 0 : (this.rand() - 0.5) * 0.01);
        p.voice.note(at, {
          hz,
          dur: e.len * this.stepSec,
          vel: 0.85 + this.rand() * 0.15,
          slideFrom: e.slide && p.prevHz ? p.prevHz : undefined,
          gamaka: e.gamaka,
          upHz: e.gamaka ? upper(this.c, e.swara, octave, this.saHz) : undefined,
        });
        p.prevHz = hz;
      }
    }

    this.cycle++;
    this.inSection++;
    if (this.inSection >= cycles) {
      this.inSection = 0;
      this.formIndex = this.formIndex + 1 < form.length ? this.formIndex + 1 : 1;
    }
  }

  /** Fade out and let go of everything. */
  end(t: number) {
    this.bus.gain.cancelScheduledValues(t);
    this.bus.gain.setTargetAtTime(0, t, 0.35);
    for (const p of this.parts) p.voice.dispose(t + 1.5);
    this.drone?.dispose(t + 1.5);
    const all = [...this.parts.map((p) => p.ch), ...this.drums.map((d) => d.ch)];
    setTimeout(() => {
      for (const ch of all) ch.dispose();
      this.bus.disconnect();
      this.reverb.disconnect();
      this.wet.disconnect();
    }, 3500);
  }
}

export type MusicEngineOptions = {
  /** The context to play in: the shared live one, or an OfflineAudioContext. */
  context: Ctx;
  /** Where the ducked music goes (default: the context's destination). */
  destination?: AudioNode;
  /** A bounce: no timer; call `renderUntil` then `startRendering`. */
  offline?: boolean;
  seed?: number;
};

export class MusicEngine {
  private ctx: Ctx;
  private master: GainNode;
  private duck: GainNode;
  private comp: DynamicsCompressorNode;
  private perf: Performance | null = null;
  /** The composition asked for, kept while disabled so enabling resumes it. */
  private wanted: Composition | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private enabled = true;
  private ducked = false;
  private disposed = false;
  private seed: number;

  constructor(private opts: MusicEngineOptions) {
    this.seed = opts.seed ?? Math.floor(Math.random() * 1e9);
    const ctx = (this.ctx = opts.context);
    // Glue: a gentle compressor over the whole ensemble, then level, then duck.
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -18;
    this.comp.knee.value = 12;
    this.comp.ratio.value = 3;
    this.comp.attack.value = 0.01;
    this.comp.release.value = 0.25;
    this.master = ctx.createGain();
    this.master.gain.value = MASTER_LEVEL;
    this.duck = ctx.createGain();
    this.duck.gain.value = 1;
    this.comp.connect(this.master);
    this.master.connect(this.duck);
    this.duck.connect(opts.destination ?? ctx.destination);
  }

  /** The composition playing (or wanted while disabled). */
  get playing(): Composition | null {
    return this.wanted;
  }

  /** Begin (or switch to) a composition; the same one again is a no-op. */
  start(c: Composition): void {
    if (this.disposed) return;
    this.wanted = c;
    if (!this.enabled) return;
    if (this.perf?.c.id === c.id) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.1;
    this.perf?.end(ctx.currentTime);
    this.perf = new Performance(ctx, this.comp, c, t, this.seed++);
    this.applyDuck();
    if (!this.opts.offline) {
      this.perf.scheduleUntil(ctx.currentTime + LOOKAHEAD);
      if (this.timer === null) this.timer = setInterval(this.tick, 100);
    }
  }

  private tick = (): void => {
    if (!this.perf) return;
    this.perf.catchUp(this.ctx.currentTime);
    this.perf.scheduleUntil(this.ctx.currentTime + LOOKAHEAD);
  };

  /** Offline: lay down everything up to `seconds`. */
  renderUntil(seconds: number): void {
    this.perf?.scheduleUntil(seconds);
  }

  /** Off: fade out and stop scheduling (no CPU). On: start the wanted piece again. */
  setEnabled(on: boolean): void {
    if (this.enabled === on) return;
    this.enabled = on;
    if (!on) {
      this.halt();
    } else if (this.wanted) {
      const c = this.wanted;
      this.start(c);
    }
  }

  /** Fade under an NPC line or the mic; back in after. */
  setDucked(ducked: boolean): void {
    this.ducked = ducked;
    this.applyDuck();
  }

  /** Leave the district: fade out, keep the context for the next one. */
  stop(): void {
    this.wanted = null;
    this.halt();
  }

  dispose(): void {
    if (this.disposed) return;
    this.stop();
    this.disposed = true;
    setTimeout(() => this.duck.disconnect(), 4000);
  }

  private halt(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    if (this.perf) this.perf.end(this.ctx.currentTime);
    this.perf = null;
  }

  private applyDuck(): void {
    const silent = this.ducked;
    const t = this.ctx.currentTime;
    this.duck.gain.cancelScheduledValues(t);
    this.duck.gain.setTargetAtTime(silent ? 0 : 1, t, silent ? DUCK_FADE : RESUME_FADE);
  }
}

export { COMPOSITIONS };
