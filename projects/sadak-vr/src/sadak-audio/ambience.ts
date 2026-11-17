/*
 * Ported from SADAK, game_engine/lib/audio/ambience.ts
 * (SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused in Sadak VR with the owner's permission).
 * Changes: SADAK fed this from its live traffic and crowd simulation (a list
 * of vehicles and a map of temples and mosques). Sadak VR has no traffic
 * simulation, so the director sets counts and distances instead
 * (`setNearby`), and a fixed pool of virtual vehicles stands in for the
 * real ones: each has a kind, a distance and a bearing that drift, and honks
 * by SADAK's own rules (rate per kind, far more often when held up). The
 * sounds themselves are verbatim: the rumble, the crowd murmur's formant
 * bands, every horn (car two-tone 415/523, auto pip-pip 1050/1180, bus bray
 * 233/277, scooter beep 720, rickshaw bell 2350/3100), the temple bells, the
 * chant in the city's raga, the azaan's takbir line, the prayer times by
 * India's clock, the "hall" room, levels, and the duck to 0.15. Only the
 * temple chant is kept (no gurdwara on our street). `update(dt)` runs every
 * XR frame but does its work at SADAK's 10 Hz and allocates nothing on that
 * path; Web Audio nodes are created only when a horn, bell, chant line or
 * the azaan actually sounds. One noise buffer is shared by every bed.
 */

/**
 * The street's sound, synthesised and placed round the listener:
 *
 *  - traffic: an engine rumble that swells with the vehicles near you, and
 *    horns from the vehicles themselves (a car's two-tone blare, an auto's
 *    pip-pip, a bus's low bray, a scooter's beep), far more often from one
 *    held up by someone in the road;
 *  - the crowd: a murmur that rises with how many people are about;
 *  - temples: bells rung now and then, and a soft chant in the city's raga
 *    when you're close;
 *  - mosques: the azaan, heard once from a distance at the prayer times of
 *    the real clock (India's), just the opening takbir, never looped.
 *
 * Everything plays through the SFX bus, so the SFX mute silences it, and it
 * ducks under dialogue with the music.
 */

import type { Composition } from "./delhi.js";
import { held, impulse, type Voice } from "./instruments.js";
import { midiToHz, swaraHz, type Swara } from "./theory.js";

/** What is round the listener, set by the director (any subset, any time). */
export type Nearby = {
  /** Vehicles within earshot (~70 m): sets the rumble and how many can honk. */
  vehicles: number;
  /** People within ~25 m: sets the crowd murmur (25 or more is full). */
  people: number;
  /** Metres to the nearest temple (Infinity: none). Bells within 70 m, chant within 40 m. */
  templeDist: number;
  /** Metres to the nearest mosque (Infinity: none, so no azaan). */
  mosqueDist: number;
  /** Traffic is held up (someone in the road, or our auto stuck): the nearest few honk insistently. */
  waiting: boolean;
  /** Optional: the temple's direction from the listener's facing, radians, positive to the right. */
  templeBearing?: number;
  /** Optional: the mosque's direction from the listener's facing, radians, positive to the right. */
  mosqueBearing?: number;
};

/**
 * A busy Chandni Chowk afternoon at the street's stalls: a dozen vehicles in
 * earshot, a thick crowd, the street mandir beside the flower stall about
 * 20 m off, and Jama Masjid closing the west end about 110 m away.
 */
export const CHANDNI_CHOWK: Required<Nearby> = {
  vehicles: 12,
  people: 30,
  templeDist: 20,
  mosqueDist: 110,
  waiting: false,
  templeBearing: 1.1,
  mosqueBearing: -1.4,
};

/** The five prayers, as minutes after midnight in India (a year-round average). */
export const PRAYERS: [string, number][] = [
  ["fajr", 5 * 60 + 6],
  ["dhuhr", 12 * 60 + 30],
  ["asr", 16 * 60 + 36],
  ["maghrib", 18 * 60 + 24],
  ["isha", 19 * 60 + 48],
];
/** Minutes after a prayer's time that its azaan may still be heard (arriving late). */
const AZAAN_WINDOW = 10;

/** Which prayer's azaan is due at `ms` (epoch milliseconds), by India's clock: its index, or -1. */
export function azaanDueIndex(ms: number): number {
  const ist = (Math.floor(ms / 60000) + 330) % 1440;
  for (let i = 0; i < PRAYERS.length; i++) {
    const after = ist - PRAYERS[i][1];
    if (after >= 0 && after < AZAAN_WINDOW) return i;
  }
  return -1;
}

const rand = Math.random;

/* ---------------- the virtual traffic ---------------- */

type VehicleKind = "car" | "auto" | "bus" | "bike" | "rickshaw";
/** Old Delhi's mix: rickshaws and autos, scooters, cars, the odd bus. */
const KIND_CYCLE: VehicleKind[] = ["auto", "rickshaw", "bike", "car", "auto", "rickshaw", "bike", "auto", "car", "rickshaw", "bike", "bus"];
const MAX_VEHICLES = 24;
/** How many of the nearest are held up when `waiting`. */
const HELD_UP = 3;

/** A temple's two recitation lines (swara, octave, seconds), rise and fall round Sa. */
function templeLines(m: Composition): [Swara, number, number][][] {
  const second = m.raga.swaras[1];
  const third = m.raga.swaras[2];
  return [
    [["S", 0, 1.2], [second, 0, 0.6], ["S", 0, 0.6], ["S", 0, 1.8]],
    [["S", 0, 0.6], [third, 0, 0.9], [second, 0, 0.6], ["S", 0, 1.9]],
  ];
}

export class Ambience {
  private ctx: BaseAudioContext | null = null;
  private dest: AudioNode | null = null;
  private music: Composition | null = null;
  private out: GainNode | null = null;
  private duck: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private trafficGain: GainNode | null = null;
  private crowdGain: GainNode | null = null;
  private beds: AudioScheduledSourceNode[] = [];
  private noiseBuf: AudioBuffer | null = null;
  private ducked = false;
  private running = false;

  private readonly n: Required<Nearby> = { ...CHANDNI_CHOWK };

  // Virtual vehicles, preallocated.
  private readonly vKind: VehicleKind[] = [];
  private readonly vDist = new Float64Array(MAX_VEHICLES);
  private readonly vBearing = new Float64Array(MAX_VEHICLES);
  private readonly vDrift = new Float64Array(MAX_VEHICLES);
  private readonly vLastHonk = new Float64Array(MAX_VEHICLES);

  private acc = 0;
  private nextBell = NaN;
  private chant: { voice: Voice; gain: GainNode; next: number; step: number } | null = null;
  private chantLines: { hz: number; dur: number }[][] = [];
  private lastAzaanKey = -1;
  private azaanLine: [number, number][] = [];

  constructor() {
    for (let i = 0; i < MAX_VEHICLES; i++) {
      this.vKind.push(KIND_CYCLE[i % KIND_CYCLE.length]);
      this.place(i);
      this.vDrift[i] = (rand() < 0.5 ? -1 : 1) * (0.02 + rand() * 0.1);
      this.vLastHonk[i] = -99;
    }
    // A Hijaz-coloured line (komal re, shuddh ga) round a D.
    const sa = 294;
    const at = (s: Swara, o = 0) => swaraHz(sa, s, o);
    this.azaanLine = [
      [at("S"), 0.6], [at("G"), 1.4], [at("m"), 0.5], [at("G"), 0.9], [at("r"), 0.45], [at("S"), 1.6],
      [at("S"), 0.5], [at("m"), 1.6], [at("P"), 0.6], [at("m"), 0.7], [at("G"), 0.5], [at("r"), 0.5], [at("S"), 2.2],
    ];
  }

  /** Bind to the shared context, the SFX bus, and the city's music (for the chant's raga). */
  bind(ctx: BaseAudioContext, dest: AudioNode, music: Composition): void {
    if (this.running) this.stop();
    this.ctx = ctx;
    this.dest = dest;
    this.music = music;
    const sa = midiToHz(music.sa);
    this.chantLines = templeLines(music).map((line) => line.map(([s, o, dur]) => ({ hz: swaraHz(sa, s, o), dur })));
    // The noise every bed shares: 3 s, looped from different offsets.
    const b = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuf = b;
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Begin the street's sound (again is a no-op). */
  start(): void {
    const ctx = this.ctx;
    if (this.running || !ctx || !this.dest) return;
    this.running = true;
    this.duck = ctx.createGain();
    this.duck.gain.value = this.ducked ? 0.15 : 1;
    this.duck.connect(this.dest);
    this.out = ctx.createGain();
    this.out.gain.value = 0.55;
    this.out.connect(this.duck);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = impulse(ctx, "hall");
    const wet = ctx.createGain();
    wet.gain.value = 0.7;
    this.reverb.connect(wet);
    wet.connect(this.out);

    // The rumble: low noise, the sum of engines and tyres.
    this.trafficGain = ctx.createGain();
    this.trafficGain.gain.value = 0;
    this.trafficGain.connect(this.out);
    const rumble = this.noise(0);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    const hum = ctx.createBiquadFilter();
    hum.type = "peaking";
    hum.frequency.value = 95;
    hum.gain.value = 9;
    rumble.connect(lp);
    lp.connect(hum);
    hum.connect(this.trafficGain);

    // The murmur: voices' formant bands over noise, each breathing on its own.
    this.crowdGain = ctx.createGain();
    this.crowdGain.gain.value = 0;
    this.crowdGain.connect(this.out);
    let k = 1;
    for (const [hz, q, g, rate] of [[480, 3, 0.9, 0.7], [1150, 4, 0.55, 1.1], [2500, 5, 0.25, 1.6]]) {
      const src = this.noise(k++ * 0.73);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = hz;
      bp.Q.value = q;
      const amp = ctx.createGain();
      amp.gain.value = g * 0.6;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const depth = ctx.createGain();
      depth.gain.value = g * 0.35;
      lfo.connect(depth);
      depth.connect(amp.gain);
      src.connect(bp);
      bp.connect(amp);
      amp.connect(this.crowdGain);
      lfo.start();
      this.beds.push(lfo);
    }
    this.acc = 0.1; // set the bed levels on the first update
    this.nextBell = NaN;
  }

  stop(): void {
    if (!this.running || !this.ctx || !this.duck) return;
    this.running = false;
    const t = this.ctx.currentTime;
    this.duck.gain.setTargetAtTime(0, t, 0.3);
    const beds = this.beds;
    const duck = this.duck;
    this.chant?.voice.dispose(t);
    setTimeout(() => {
      beds.forEach((b) => b.stop());
      duck.disconnect();
    }, 1500);
    this.beds = [];
    this.chant = null;
    this.duck = this.out = this.reverb = this.trafficGain = this.crowdGain = null;
  }

  setDucked(ducked: boolean): void {
    this.ducked = ducked;
    if (!this.ctx || !this.duck) return;
    this.duck.gain.setTargetAtTime(ducked ? 0.15 : 1, this.ctx.currentTime, ducked ? 0.3 : 1.2);
  }

  /** Change any of what is round the listener. */
  setNearby(p: Partial<Nearby>): void {
    const n = this.n;
    if (p.vehicles !== undefined) n.vehicles = Math.max(0, Math.min(MAX_VEHICLES, Math.round(p.vehicles)));
    if (p.people !== undefined) n.people = Math.max(0, p.people);
    if (p.templeDist !== undefined) n.templeDist = Math.max(0, p.templeDist);
    if (p.mosqueDist !== undefined) n.mosqueDist = Math.max(0, p.mosqueDist);
    if (p.templeBearing !== undefined) n.templeBearing = p.templeBearing;
    if (p.mosqueBearing !== undefined) n.mosqueBearing = p.mosqueBearing;
    if (p.waiting !== undefined && p.waiting !== n.waiting) {
      n.waiting = p.waiting;
      // The held-up ones are right there, behind and beside us.
      if (p.waiting) for (let i = 0; i < HELD_UP; i++) this.vDist[i] = 4 + rand() * 6;
    }
  }

  /** Every frame is fine: the work runs at SADAK's 10 Hz, without allocating. */
  update(dt: number): void {
    if (!this.running) return;
    this.acc += dt;
    if (this.acc < 0.1) return;
    const step = Math.min(this.acc, 0.5);
    this.acc = 0;
    const ctx = this.ctx!;
    const n = this.n;
    const t = ctx.currentTime;

    // Traffic: the rumble swells with nearby, moving vehicles.
    let rumble = 0;
    for (let i = 0; i < n.vehicles; i++) {
      const heldUp = n.waiting && i < HELD_UP;
      this.vBearing[i] += this.vDrift[i] * step;
      const d = this.vDist[i];
      const kind = this.vKind[i];
      // Moving at ~5 m/s, crawling when held up.
      const speed = n.waiting ? 0.5 : 5;
      rumble += Math.exp(-d / 22) * (0.4 + Math.min(1, speed / 8) * 0.6) * (kind === "bus" ? 1.8 : kind === "bike" ? 0.5 : 1);
      // Horns: now and then, and insistently when held up.
      const rate = heldUp ? 0.7 : kind === "auto" || kind === "bike" ? 0.05 : 0.025;
      if (t - this.vLastHonk[i] > (heldUp ? 1.2 : 4) && rand() < rate * step) {
        this.vLastHonk[i] = t;
        this.honk(kind, this.vBearing[i], d);
        // Past us and gone; another takes its place (the held-up ones stay put).
        if (!heldUp && rand() < 0.5) this.place(i);
      }
    }
    this.trafficGain!.gain.setTargetAtTime(Math.min(0.6, rumble * 0.12), t, 0.4);
    this.crowdGain!.gain.setTargetAtTime(Math.min(0.5, (n.people / 25) * 0.5), t, 0.8);

    this.worship(t);
    this.azaan(t);
  }

  /** Sound the azaan now from the mosque (for testing; it normally waits for a prayer time). */
  callAzaan(): void {
    if (!this.running || !this.ctx) return;
    const d = Number.isFinite(this.n.mosqueDist) ? this.n.mosqueDist : 300;
    this.callFrom(this.n.mosqueBearing, d, this.ctx.currentTime);
  }

  /** Ring the temple bell now (for testing). */
  ringBell(): void {
    if (!this.running || !this.ctx) return;
    this.bell(Math.min(this.n.templeDist, 70));
  }

  /* ---------------- traffic ---------------- */

  /** A fresh vehicle somewhere in the street round us. */
  private place(i: number): void {
    this.vDist[i] = 5 + rand() * rand() * 55;
    this.vBearing[i] = (rand() * 2 - 1) * Math.PI;
  }

  private honk(kind: VehicleKind, bearing: number, d: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + 0.02;
    const g = ctx.createGain();
    const level = 0.5 / (1 + d / 7);
    const pan = ctx.createStereoPanner();
    pan.pan.value = panFor(bearing);
    g.connect(pan);
    pan.connect(this.out!);
    // Each vehicle's own: pitch pairs, length, and how many blasts.
    const voice =
      kind === "bus"
        ? { hz: [233, 277], dur: 0.7, blasts: 1, wave: "sawtooth" as OscillatorType }
        : kind === "auto"
          ? { hz: [1050, 1180], dur: 0.12, blasts: 2 + Math.floor(rand() * 2), wave: "square" as OscillatorType }
          : kind === "rickshaw"
            ? { hz: [2350, 3100], dur: 0.07, blasts: 2 + Math.floor(rand() * 2), wave: "sine" as OscillatorType }
            : kind === "bike"
              ? { hz: [720], dur: 0.18, blasts: 2, wave: "square" as OscillatorType }
              : { hz: [415, 523], dur: 0.35 + rand() * 0.35, blasts: rand() < 0.4 ? 2 : 1, wave: "sawtooth" as OscillatorType };
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = voice.hz[0] * 2;
    bp.Q.value = 0.8;
    bp.connect(g);
    for (let b = 0; b < voice.blasts; b++) {
      const at = t + b * (voice.dur + 0.09);
      for (const hz of voice.hz) {
        const o = ctx.createOscillator();
        o.type = voice.wave;
        o.frequency.value = hz * (0.98 + rand() * 0.04);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0, at);
        og.gain.linearRampToValueAtTime(level, at + 0.015);
        og.gain.setValueAtTime(level, at + voice.dur - 0.03);
        og.gain.linearRampToValueAtTime(0, at + voice.dur);
        o.connect(og);
        og.connect(bp);
        o.start(at);
        o.stop(at + voice.dur + 0.05);
      }
    }
    setTimeout(() => pan.disconnect(), (voice.blasts * (voice.dur + 0.1) + 1) * 1000);
  }

  /* ---------------- worship ---------------- */

  private worship(t: number) {
    const ctx = this.ctx!;
    const d = this.n.templeDist;
    // Bells from the temple in earshot, at its own pace (a small temple).
    if (d <= 70) {
      if (Number.isNaN(this.nextBell)) this.nextBell = t + rand() * 4;
      if (t >= this.nextBell) {
        this.bell(d);
        this.nextBell = t + 8 + rand() * 9;
      }
    } else this.nextBell = NaN;

    // A chant from the temple when it's close by.
    const range = 40;
    const near = d < range;
    if (this.chant && !near) {
      this.chant.gain.gain.setTargetAtTime(0, t, 0.8);
      this.chant.voice.dispose(t + 3);
      this.chant = null;
    }
    if (near && !this.chant) {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const pan = ctx.createStereoPanner();
      pan.pan.value = panFor(this.n.templeBearing);
      gain.connect(pan);
      pan.connect(this.out!);
      pan.connect(this.reverb!);
      this.chant = { voice: held(ctx, gain, "chant"), gain, next: t + 0.3, step: 0 };
    }
    if (this.chant) {
      const c = this.chant;
      const level = 0.4 * Math.max(0, 1 - d / range);
      c.gain.gain.setTargetAtTime(level, t, 0.6);
      if (t >= c.next) c.next = t + this.phrase(c.voice, t, c.step++);
    }
  }

  /** One chanted line in the city's raga; returns its length in seconds. */
  private phrase(v: Voice, t: number, step: number): number {
    const line = this.chantLines[step % this.chantLines.length];
    let at = t;
    for (let i = 0; i < line.length; i++) {
      v.note(at, { hz: line[i].hz, dur: line[i].dur, vel: 0.85 });
      at += line[i].dur;
    }
    return at - t + 1.2;
  }

  private bell(d: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + 0.02;
    const g = ctx.createGain();
    const pan = ctx.createStereoPanner();
    pan.pan.value = panFor(this.n.templeBearing);
    g.connect(pan);
    pan.connect(this.out!);
    pan.connect(this.reverb!);
    const level = 0.35 / (1 + d / 10);
    // A big temple bell, or a quick run of the hand bell.
    const hand = rand() < 0.5;
    const base = hand ? 1320 + rand() * 200 : 520 + rand() * 80;
    const strikes = hand ? 3 + Math.floor(rand() * 4) : 1;
    for (let k = 0; k < strikes; k++) {
      const at = t + k * 0.16;
      for (const [r, a, dec] of [[1, 1, hand ? 0.9 : 3.5], [2.01, 0.45, hand ? 0.6 : 2.5], [2.76, 0.3, hand ? 0.4 : 1.8], [5.4, 0.12, 0.5]]) {
        const o = ctx.createOscillator();
        o.frequency.value = base * r;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0, at);
        og.gain.linearRampToValueAtTime(level * a, at + 0.004);
        og.gain.exponentialRampToValueAtTime(0.0001, at + dec);
        o.connect(og);
        og.connect(g);
        o.start(at);
        o.stop(at + dec + 0.05);
      }
    }
    setTimeout(() => pan.disconnect(), 5000);
  }

  /* ---------------- the azaan ---------------- */

  private azaan(t: number) {
    if (!Number.isFinite(this.n.mosqueDist)) return;
    const ms = Date.now();
    const due = azaanDueIndex(ms);
    if (due < 0) return;
    // Once per prayer per (India's) day.
    const key = Math.floor((ms + 330 * 60000) / 86400000) * 8 + due;
    if (key === this.lastAzaanKey) return;
    this.lastAzaanKey = key;
    // From the nearest mosque, whatever the distance.
    this.callFrom(this.n.mosqueBearing, this.n.mosqueDist, t);
  }

  /** The opening takbir, twice: distant, filtered by the streets between. */
  private callFrom(bearing: number, d: number, t: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.value = Math.max(0.08, 0.3 / (1 + d / 120));
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1700;
    const pan = ctx.createStereoPanner();
    pan.pan.value = panFor(bearing) * 0.6;
    g.connect(lp);
    lp.connect(pan);
    pan.connect(this.out!);
    pan.connect(this.reverb!);
    const v = held(ctx, g, "azaan");
    let time = t + 0.3;
    let prev: number | undefined;
    for (const [hz, dur] of this.azaanLine) {
      v.note(time, { hz, dur, vel: 0.9, slideFrom: prev });
      prev = hz;
      time += dur;
    }
    v.dispose(time + 1);
    setTimeout(() => pan.disconnect(), (time - t + 4) * 1000);
  }

  /* ---------------- helpers ---------------- */

  private noise(offset: number): AudioBufferSourceNode {
    const src = this.ctx!.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.start(0, offset);
    this.beds.push(src);
    return src;
  }
}

/** -1 left .. 1 right, from a bearing off the listener's facing (as SADAK's panFor). */
function panFor(bearing: number): number {
  return Math.max(-1, Math.min(1, Math.sin(bearing) * 0.8));
}
