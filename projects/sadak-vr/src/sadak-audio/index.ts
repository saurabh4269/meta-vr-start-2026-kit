/*
 * Sadak VR's game audio: SADAK's music, SFX, location chime and street
 * ambience behind one plain class.
 *
 * Replaces SADAK's React hook game_engine/lib/audio/useGameAudio.ts and the
 * module singletons in lib/audio/engine.ts (SADAK authors: ahmedfahim21,
 * Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused in Sadak VR with the
 * owner's permission). As in SADAK: music ducks to silence (0.35 s fade, 1.4 s
 * back) and the ambience to 0.15 while someone speaks; SFX, the chime and the
 * ambience share one SFX bus, so turning SFX off silences all three. Unlike
 * SADAK there is one AudioContext for everything (SADAK's music had its own),
 * no localStorage prefs (the director owns the toggles), and anything turned
 * off or muted stops its scheduler instead of playing into a zero gain.
 *
 *   import { sadakAudio } from './sadak-audio/index.js';
 *   sadakAudio.unlock();                 // in the Enter-XR click handler
 *   sadakAudio.music.start('delhi');
 *   sadakAudio.ambience.start();
 *   // each frame: sadakAudio.ambience.update(dt)
 *   sadakAudio.music.duck(true); sadakAudio.ambience.duck(true);  // NPC speaks
 *   sadakAudio.sfx.play('success');
 *
 * See docs/INTEGRATION-AUDIO.md.
 */

import { Ambience, CHANDNI_CHOWK, type Nearby } from "./ambience.js";
import { playPlaceChime } from "./chime.js";
import { CITY_MUSIC, type City } from "./delhi.js";
import { MusicEngine } from "./music.js";
import { SfxBank, SFX_NAMES, type SfxName } from "./sfx.js";

export type { Nearby, SfxName, City };
export { CHANDNI_CHOWK, SFX_NAMES };

export class SadakAudio {
  private ctx: AudioContext | null = null;
  /** Everything ends here: the master mute. */
  private root: GainNode | null = null;
  /** SFX, chime and ambience (SADAK's sfx master gain). */
  private sfxBus: GainNode | null = null;
  private engine: MusicEngine | null = null;
  private bank = new SfxBank();
  private amb = new Ambience();

  private isMuted = false;
  private musicOn = true;
  private sfxOn = true;
  private musicWanted: City | null = null;
  private ambienceWanted = false;
  private musicDucked = false;
  /** Nearby set before unlock, applied once bound. */
  private pendingNearby: Partial<Nearby> = {};

  /** The shared AudioContext, once unlocked. */
  get context(): AudioContext | null {
    return this.ctx;
  }

  /**
   * Create (or adopt) the AudioContext and resume it. Call from a user
   * gesture, e.g. the Enter XR click. Pass an existing context to share it
   * (IWSDK/three's, or the TTS player's). Calling again just resumes.
   */
  unlock(ctx?: AudioContext): void {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume().catch((e) => console.error("[sadak-audio] resuming", e));
      return;
    }
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) throw new Error("[sadak-audio] no Web Audio in this browser");
      ctx = new Ctor({ latencyHint: "interactive" });
    }
    this.ctx = ctx;
    if (ctx.state === "suspended") ctx.resume().catch((e) => console.error("[sadak-audio] resuming", e));

    this.root = ctx.createGain();
    this.root.gain.value = this.isMuted ? 0 : 1;
    this.root.connect(ctx.destination);
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.sfxOn ? 1 : 0;
    this.sfxBus.connect(this.root);

    this.engine = new MusicEngine({ context: ctx, destination: this.root });
    this.engine.setDucked(this.musicDucked);
    void this.bank.bind(ctx, this.sfxBus);
    this.amb.bind(ctx, this.sfxBus, CITY_MUSIC.delhi);
    this.amb.setNearby(this.pendingNearby);
    this.sync();
  }

  readonly music: { start(city: City): void; stop(): void; duck(on: boolean): void; enabled: boolean };
  readonly sfx: { play(name: SfxName): void; enabled: boolean };

  constructor() {
    const a = this;
    this.music = {
      /** Begin the city's music (again is a no-op). Before unlock it waits for unlock. */
      start(city: City): void {
        a.musicWanted = city;
        a.sync();
      },
      /** Fade out and stop scheduling. */
      stop(): void {
        a.musicWanted = null;
        a.engine?.stop();
      },
      /** Duck under an NPC line or the mic: to silence in 0.35 s; back in 1.4 s. */
      duck(on: boolean): void {
        a.musicDucked = on;
        a.engine?.setDucked(on);
      },
      /** Off stops the scheduler; on resumes the wanted piece from its intro. */
      set enabled(v: boolean) {
        a.musicOn = v;
        a.sync();
      },
      get enabled(): boolean {
        return a.musicOn;
      },
    };
    this.sfx = {
      play(name: SfxName): void {
        if (a.isMuted || !a.sfxOn) return;
        a.bank.play(name);
      },
      /** Off silences SFX, the chime and the ambience (one bus, as in SADAK). */
      set enabled(v: boolean) {
        a.sfxOn = v;
        if (a.ctx && a.sfxBus) a.sfxBus.gain.setTargetAtTime(v ? 1 : 0, a.ctx.currentTime, 0.05);
        a.sync();
      },
      get enabled(): boolean {
        return a.sfxOn;
      },
    };
  }

  /** The location-card chime: a rising figure in raga Kafi on santoor, and a manjira. */
  chime(): void {
    if (!this.ctx || !this.sfxBus || this.isMuted || !this.sfxOn) return;
    playPlaceChime(this.ctx, this.sfxBus, CITY_MUSIC.delhi);
  }

  readonly ambience = {
    start: (): void => {
      this.ambienceWanted = true;
      this.sync();
    },
    stop: (): void => {
      this.ambienceWanted = false;
      this.amb.stop();
    },
    /** Under dialogue: down to 0.15, as SADAK. */
    duck: (on: boolean): void => this.amb.setDucked(on),
    /** What is round the listener; any subset. Defaults: a busy Chandni Chowk (CHANDNI_CHOWK). */
    setNearby: (n: Partial<Nearby>): void => {
      if (this.ctx) this.amb.setNearby(n);
      else Object.assign(this.pendingNearby, n);
    },
    /** Call every frame with seconds since the last; allocation-free. */
    update: (dt: number): void => this.amb.update(dt),
    /** Testing: the azaan now, instead of at the next prayer time. */
    callAzaan: (): void => this.amb.callAzaan(),
    /** Testing: a temple bell now. */
    ringBell: (): void => this.amb.ringBell(),
  };

  /** Master mute: silences everything and stops the music and ambience schedulers. */
  set muted(v: boolean) {
    this.isMuted = v;
    if (this.ctx && this.root) this.root.gain.setTargetAtTime(v ? 0 : 1, this.ctx.currentTime, 0.05);
    this.sync();
  }
  get muted(): boolean {
    return this.isMuted;
  }

  /** Run exactly what is wanted and audible; stop the rest. */
  private sync(): void {
    if (!this.ctx || !this.engine) return;
    const musicLive = this.musicOn && !this.isMuted;
    this.engine.setEnabled(musicLive);
    if (this.musicWanted && musicLive) this.engine.start(CITY_MUSIC[this.musicWanted]);
    const ambLive = this.ambienceWanted && this.sfxOn && !this.isMuted;
    if (ambLive) this.amb.start();
    else this.amb.stop();
  }
}

/** The game's one audio system. */
export const sadakAudio = new SadakAudio();
