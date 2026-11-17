/*
 * Ported from SADAK, game_engine/lib/audio/sfx.ts and engine.ts
 * (SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused in Sadak VR with the owner's permission).
 * Changes: the effect -> clip map, levels (0.35, hover 0.18, partial = the
 * "open" pop at 0.22) and the 90 ms hover debounce are verbatim. "toggleOn"/
 * "toggleOff" are named "switchOn"/"switchOff" here. Instead of a module
 * singleton that creates its own AudioContext, the bank is bound to the
 * shared context and SFX bus by SadakAudio, and every clip is decoded once up
 * front (SADAK decoded lazily on first play) so the first tap in XR is not
 * late. A disabled bank starts no sources at all.
 */

import type { SoundAsset } from "./assets/types.js";
import { click001Sound } from "./assets/click-001.js";
import { clickSoftSound } from "./assets/click-soft.js";
import { close001Sound } from "./assets/close-001.js";
import { coinCollectSound } from "./assets/coin-collect.js";
import { errorBuzzSound } from "./assets/error-buzz.js";
import { hoverTickSound } from "./assets/hover-tick.js";
import { notificationPopSound } from "./assets/notification-pop.js";
import { successChimeSound } from "./assets/success-chime.js";
import { switchOffSound } from "./assets/switch-off.js";
import { switchOnSound } from "./assets/switch-on.js";

/** Names of the available sound effects. */
export type SfxName = "click" | "tap" | "success" | "partial" | "error" | "cash" | "open" | "hover" | "switchOn" | "switchOff" | "close";

/** Effect name -> asset it plays, and the volume it plays at (see VOLUME below). */
const SFX_LIBRARY: Record<SfxName, { asset: SoundAsset; volume?: number }> = {
  click: { asset: click001Sound },
  tap: { asset: clickSoftSound },
  hover: { asset: hoverTickSound },
  open: { asset: notificationPopSound },
  close: { asset: close001Sound },
  switchOn: { asset: switchOnSound },
  switchOff: { asset: switchOffSound },
  success: { asset: successChimeSound },
  // Reuses the "open" pop at a lower volume rather than a dedicated asset —
  // a partial-credit line is a lesser event than a fresh dialogue opening.
  partial: { asset: notificationPopSound, volume: 0.22 },
  error: { asset: errorBuzzSound },
  cash: { asset: coinCollectSound },
};

export const SFX_NAMES = Object.keys(SFX_LIBRARY) as SfxName[];

/** Level for all effects relative to the source clip; they sit under voice and music. */
export const VOLUME = 0.35;
/** Hover plays much quieter than a deliberate click. */
const HOVER_VOLUME = 0.18;
/** Minimum gap between hover ticks, so sweeping a ray across several
 *  buttons doesn't machine-gun the sound. */
const HOVER_DEBOUNCE_MS = 90;

function bytesOf(dataUri: string): ArrayBuffer {
  const bin = atob(dataUri.slice(dataUri.indexOf(",") + 1));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export class SfxBank {
  private ctx: BaseAudioContext | null = null;
  private out: AudioNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private pending = new Map<string, Promise<AudioBuffer | null>>();
  private lastHoverAt = -1e9;
  enabled = true;

  /** Bind to a context and output, and decode every clip once. */
  bind(ctx: BaseAudioContext, out: AudioNode): Promise<unknown> {
    this.ctx = ctx;
    this.out = out;
    this.buffers.clear();
    this.pending.clear();
    return Promise.all(SFX_NAMES.map((n) => this.decode(SFX_LIBRARY[n].asset.dataUri)));
  }

  private decode(uri: string): Promise<AudioBuffer | null> {
    const ctx = this.ctx!;
    let p = this.pending.get(uri);
    if (!p) {
      p = ctx.decodeAudioData(bytesOf(uri)).then(
        (b) => {
          this.buffers.set(uri, b);
          return b;
        },
        (e) => {
          console.error("[sadak-audio] decoding an SFX clip", e);
          return null;
        }
      );
      this.pending.set(uri, p);
    }
    return p;
  }

  /** Play a named effect (no-op before unlock or while disabled). */
  play(name: SfxName): void {
    if (!this.enabled || !this.ctx || !this.out) return;
    let volume: number;
    if (name === "hover") {
      const now = performance.now();
      if (now - this.lastHoverAt < HOVER_DEBOUNCE_MS) return;
      this.lastHoverAt = now;
      volume = HOVER_VOLUME;
    } else volume = SFX_LIBRARY[name].volume ?? VOLUME;
    const uri = SFX_LIBRARY[name].asset.dataUri;
    const buf = this.buffers.get(uri);
    if (buf) this.start(buf, volume);
    else void this.decode(uri).then((b) => b && this.start(b, volume));
  }

  private start(buffer: AudioBuffer, volume: number): void {
    const ctx = this.ctx!;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.out!);
    source.start(0);
  }
}
