/**
 * All effects are synthesised with WebAudio (no files to license):
 * coin clinks, card taps, a right/wrong cue, reward swells, a bite crunch,
 * and a Chandni Chowk street bed (crowd murmur, auto horns, cycle-rickshaw bells).
 * Voices are Sarvam clips played by speech.ts through `voiceBus`.
 * (Core synth helpers adapted from this author's Chausar entry.)
 */
export class Sfx {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private noiseBuf!: AudioBuffer;
  private streetTimer: number | null = null;
  private murmur: { src: AudioBufferSourceNode; g: GainNode } | null = null;
  voiceBus: GainNode | null = null;

  muted = false;

  /** Must be called from a user gesture (the Enter-AR click). */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        const comp = this.ctx.createDynamicsCompressor();
        this.master.connect(comp).connect(this.ctx.destination);
        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 0.22;
        this.musicBus.connect(this.master);
        this.voiceBus = this.ctx.createGain();
        this.voiceBus.gain.value = 1.0;
        this.voiceBus.connect(this.ctx.destination); // voices skip the compressor
        const len = this.ctx.sampleRate * 2;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  private get t(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  private out(pan = 0, bus?: AudioNode): AudioNode {
    const ctx = this.ctx!;
    if (pan === 0) return bus ?? this.master;
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(bus ?? this.master);
    return p;
  }

  private noise(
    dur: number,
    filterType: BiquadFilterType,
    freq: number,
    q: number,
    gain: number,
    when = 0,
    pan = 0,
    freqEnd?: number,
  ): void {
    const ctx = this.ctx!;
    const t0 = this.t + when;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.setValueAtTime(freq, t0);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(this.out(pan));
    src.start(t0, Math.random() * 1.5);
    src.stop(t0 + dur + 0.05);
  }

  private tone(
    freq: number,
    dur: number,
    gain: number,
    type: OscillatorType = 'sine',
    when = 0,
    attack = 0.002,
    pan = 0,
    freqEnd?: number,
    bus?: AudioNode,
  ): void {
    const ctx = this.ctx!;
    const t0 = this.t + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.out(pan, bus));
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  private ok(): boolean {
    return !!this.ctx && !this.muted;
  }

  thud(intensity = 1, pan = 0): void {
    if (!this.ok()) return;
    this.noise(0.09, 'lowpass', 700, 1, 0.6 * Math.min(1, intensity), 0, pan);
  }
  /** Piece tap. `pitch` scales the note (e.g. rise by step along a hop path). */
  tap(pan = 0, pitch = 1): void {
    if (!this.ok()) return;
    this.tone((520 + Math.random() * 60) * pitch, 0.07, 0.3, 'sine', 0, 0.001, pan);
    this.noise(0.03, 'bandpass', 1800 * pitch, 2, 0.15, 0, pan);
  }
  /** One wave of a reward reveal; call with wave 0..n-1 for a rising swell. */
  reward(wave: number, of = 4): void {
    if (!this.ok()) return;
    const k = Math.min(1, wave / Math.max(1, of - 1));
    const sa = 523.25 * Math.pow(2, (wave * 4) / 12); // rises a major third per wave
    [1, 1.25, 1.5, 2].forEach((m, i) => this.tone(sa * m, 0.45 + k * 0.4, 0.035 + 0.03 * k, 'sine', i * 0.035, 0.004));
    this.noise(0.25 + k * 0.3, 'highpass', 5000, 0.7, 0.05 + 0.06 * k, 0, 0, 9000);
    if (wave === of - 1) this.tone(sa * 0.5, 1.6, 0.09, 'triangle', 0.05, 0.02);
  }
  whoosh(): void {
    if (!this.ok()) return;
    this.noise(0.35, 'bandpass', 500, 1.2, 0.25, 0, 0, 2400);
  }
  sparkle(): void {
    if (!this.ok()) return;
    [1760, 2217, 2637, 3520].forEach((f, i) =>
      this.tone(f, 0.5, 0.05, 'sine', i * 0.05),
    );
  }
  select(): void {
    if (!this.ok()) return;
    this.tone(880, 0.12, 0.12, 'triangle');
    this.tone(1320, 0.18, 0.08, 'sine', 0.05);
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  /** A coin landing: bright metallic partials, pitch by denomination. */
  clink(big = false, pan = 0): void {
    if (!this.ok()) return;
    const f = (big ? 2350 : 2900) * (0.97 + Math.random() * 0.06);
    [1, 2.76, 5.4].forEach((m, i) => this.tone(f * m * 0.5, 0.35 - i * 0.08, 0.09 / (i + 1), 'sine', 0, 0.001, pan));
    this.noise(0.03, 'highpass', 6000, 0.7, 0.12, 0, pan);
  }

  /** Soft "not quite" cue (never harsh: this is a lesson). */
  nope(): void {
    if (!this.ok()) return;
    this.tone(392, 0.16, 0.09, 'triangle');
    this.tone(330, 0.22, 0.08, 'triangle', 0.12);
  }

  /** Correct reply: two rising bell notes. */
  right(): void {
    if (!this.ok()) return;
    [659.25, 987.77].forEach((f, i) => {
      this.tone(f, 1.1, 0.07, 'sine', i * 0.09, 0.003);
      this.tone(f * 2.76, 0.5, 0.012, 'sine', i * 0.09, 0.002);
    });
  }

  crunch(): void {
    if (!this.ok()) return;
    for (let i = 0; i < 5; i++) this.noise(0.05, 'bandpass', 1400 + Math.random() * 2600, 1.5, 0.25, i * 0.045 + Math.random() * 0.02);
  }

  /** Auto-rickshaw two-stroke putter + its squeaky horn. */
  horn(pan = 0, far = 1): void {
    if (!this.ok()) return;
    const g = 0.09 * far;
    this.tone(620, 0.16, g, 'square', 0, 0.01, pan);
    this.tone(620, 0.22, g, 'square', 0.22, 0.01, pan);
  }

  putter(dur = 2.2, pan = 0): void {
    if (!this.ok()) return;
    for (let t = 0; t < dur; t += 0.075) this.noise(0.05, 'lowpass', 380, 2, 0.1 * (1 - t / (dur * 1.4)), t, pan);
  }

  bell(pan = 0, far = 1): void {
    if (!this.ok()) return;
    for (let i = 0; i < 2; i++) [1, 2.4, 3.9].forEach((m, j) => this.tone(2100 * m * 0.5, 0.4, (0.05 / (j + 1)) * far, 'sine', i * 0.12, 0.001, pan));
  }

  /** The street bed: a murmuring crowd plus distant horns and bells at random. */
  startStreet(): void {
    if (!this.ctx || this.murmur) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 520;
    bp.Q.value = 0.9;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.23;
    const lg = ctx.createGain();
    lg.gain.value = 180;
    lfo.connect(lg).connect(bp.frequency);
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    g.gain.setTargetAtTime(0.11, ctx.currentTime, 1.5);
    src.connect(bp).connect(g).connect(this.musicBus);
    src.start();
    lfo.start();
    this.murmur = { src, g };
    const tick = () => {
      if (!this.ctx || this.muted) return;
      const r = Math.random();
      const pan = Math.random() * 2 - 1;
      if (r < 0.45) this.horn(pan, 0.35 + Math.random() * 0.4);
      else if (r < 0.75) this.bell(pan, 0.4 + Math.random() * 0.4);
    };
    this.streetTimer = window.setInterval(tick, 2600);
  }

  stopStreet(): void {
    if (this.streetTimer !== null) window.clearInterval(this.streetTimer);
    this.streetTimer = null;
    if (this.murmur && this.ctx) {
      const m = this.murmur;
      m.g.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.6);
      window.setTimeout(() => m.src.stop(), 3000);
    }
    this.murmur = null;
  }

  /** Duck the street under speech. */
  setStreetLevel(v: number): void {
    if (this.ctx) this.musicBus.gain.setTargetAtTime(0.22 * v, this.t, 0.25);
  }
}

export const sfx = new Sfx();
