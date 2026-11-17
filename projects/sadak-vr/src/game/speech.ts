import { clipId } from './content.js';
import { sfx } from './audio.js';

/**
 * Voices: pre-recorded Sarvam bulbul:v3 clips (public/audio/tts/<id>.mp3, baked by
 * tools/bake-tts.ts) decoded once and played through the voice bus. Missing clips
 * fall back to the browser's Hindi speechSynthesis voice (if any); captions always
 * show the line, so nothing depends on audio.
 *
 * Mic: one getUserMedia stream (asked for on the Enter click), MediaRecorder per
 * attempt, POST /api/stt → Devanagari transcript.
 */

export class Speech {
  private readonly buffers = new Map<string, AudioBuffer | null>();
  private readonly pending = new Map<string, Promise<AudioBuffer | null>>();
  private current: AudioBufferSourceNode | null = null;
  private ticket = 0;
  /** performance.now() ms at which the current line ends. */
  endsAt = 0;

  constructor(private readonly base: string) {}

  private url(id: string): string {
    return `${this.base}audio/tts/${id}.mp3`;
  }

  private load(id: string): Promise<AudioBuffer | null> {
    if (this.buffers.has(id)) return Promise.resolve(this.buffers.get(id)!);
    const p0 = this.pending.get(id);
    if (p0) return p0;
    const ctx = sfx.context;
    if (!ctx) return Promise.resolve(null);
    const p = fetch(this.url(id))
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((b) => ctx.decodeAudioData(b))
      .catch(() => null)
      .then((buf) => {
        this.buffers.set(id, buf);
        this.pending.delete(id);
        return buf;
      });
    this.pending.set(id, p);
    return p;
  }

  /** Decode a batch in the background (after the audio context exists). */
  preload(lines: { speaker: string; text: string }[]): void {
    void (async () => {
      for (const l of lines) await this.load(clipId(l.speaker, l.text));
    })();
  }

  /** Estimated seconds for a line with no clip (Hindi ~13 chars/s). */
  static estimate(text: string): number {
    return 0.6 + text.length * 0.075;
  }

  /**
   * Speak a line. Returns its duration in seconds immediately if the clip is
   * decoded; otherwise starts loading and returns the estimate (the clip plays
   * as soon as it arrives if that is within 0.6 s).
   */
  say(speaker: string, text: string, rate = 1): number {
    this.stop();
    const ticket = ++this.ticket;
    const id = clipId(speaker, text);
    const buf = this.buffers.get(id);
    const now = performance.now();
    if (buf) {
      this.play(buf, rate);
      return buf.duration / rate;
    }
    const est = Speech.estimate(text) / rate;
    this.endsAt = now + est * 1000;
    if (buf === null) {
      this.fallback(text, rate);
      return est;
    }
    const asked = now;
    void this.load(id).then((b) => {
      if (performance.now() - asked > 600 || ticket !== this.ticket) return;
      if (b) this.play(b, rate);
      else this.fallback(text, rate);
    });
    return est;
  }

  private play(buf: AudioBuffer, rate: number): void {
    const ctx = sfx.context;
    if (!ctx || !sfx.voiceBus || sfx.muted) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    src.connect(sfx.voiceBus);
    src.start();
    this.current = src;
    this.endsAt = performance.now() + (buf.duration / rate) * 1000;
    sfx.setStreetLevel(0.45);
    src.onended = () => {
      if (this.current === src) {
        this.current = null;
        sfx.setStreetLevel(1);
      }
    };
  }

  private fallback(text: string, rate: number): void {
    try {
      const synth = window.speechSynthesis;
      if (!synth || sfx.muted) return;
      const v = synth.getVoices().find((x) => /^hi/i.test(x.lang));
      if (!v) return; // an English voice reading Devanagari is worse than silence
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v;
      u.lang = 'hi-IN';
      u.rate = 0.9 * rate;
      synth.speak(u);
    } catch {
      /* optional */
    }
  }

  stop(): void {
    this.ticket++;
    try {
      this.current?.stop();
    } catch {
      /* already stopped */
    }
    this.current = null;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* none */
    }
    sfx.setStreetLevel(1);
  }

  get speaking(): boolean {
    return performance.now() < this.endsAt;
  }
}

export type MicState = 'off' | 'ready' | 'recording' | 'thinking' | 'denied';

export class Mic {
  state: MicState = 'off';
  /** 0..1 input level while recording (drives the orb). */
  level = 0;
  private stream: MediaStream | null = null;
  private rec: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private analyser: AnalyserNode | null = null;
  private data: Uint8Array<ArrayBuffer> | null = null;
  startedAt = 0;
  lastLoudAt = 0;

  /** Call inside a user-gesture handler (the Enter click). Never throws. */
  async prime(): Promise<boolean> {
    if (this.stream) return true;
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return false;
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      this.state = 'ready';
      return true;
    } catch {
      this.state = 'denied';
      return false;
    }
  }

  get available(): boolean {
    return !!this.stream && this.state !== 'denied';
  }

  start(): boolean {
    if (!this.stream || this.state === 'recording' || this.state === 'thinking') return false;
    try {
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      this.rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
      this.chunks = [];
      this.rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
      this.rec.start();
      const ctx = sfx.context;
      if (ctx && !this.analyser) {
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 512;
        ctx.createMediaStreamSource(this.stream).connect(this.analyser);
        this.data = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));
      }
      this.state = 'recording';
      this.startedAt = this.lastLoudAt = performance.now();
      return true;
    } catch {
      return false;
    }
  }

  /** Per frame while recording: input level, and silence tracking for auto-stop. */
  sample(): void {
    if (this.state !== 'recording' || !this.analyser || !this.data) return;
    this.analyser.getByteTimeDomainData(this.data);
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      const v = (this.data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / this.data.length);
    this.level = Math.min(1, rms * 6);
    if (rms > 0.035) this.lastLoudAt = performance.now();
  }

  /** Stop and transcribe. Resolves to the transcript ('' if nothing heard) or an error. */
  stop(base: string): Promise<{ transcript: string } | { error: string }> {
    const rec = this.rec;
    if (!rec || this.state !== 'recording') return Promise.resolve({ error: 'not recording' });
    this.state = 'thinking';
    this.level = 0;
    return new Promise((resolve) => {
      rec.onstop = async () => {
        const blob = new Blob(this.chunks, { type: rec.mimeType || 'audio/webm' });
        try {
          const form = new FormData();
          form.append('audio', blob, 'reply.webm');
          const res = await fetch(`${base}api/stt`, { method: 'POST', body: form });
          const json = (await res.json()) as { transcript?: string; error?: string };
          resolve(res.ok ? { transcript: json.transcript ?? '' } : { error: json.error ?? `HTTP ${res.status}` });
        } catch (e) {
          resolve({ error: String(e) });
        } finally {
          this.state = 'ready';
        }
      };
      rec.stop();
    });
  }
}
