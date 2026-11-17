/*
 * Ported from SADAK, game_engine/lib/audio/music/chime.ts
 * (SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused in Sadak VR with the owner's permission).
 * Changes: takes the context, output and composition as arguments instead
 * of reading SADAK's module singletons and district table; the notes,
 * santoor, manjira, timing and 0.15 level are verbatim.
 */

/**
 * The chime when the location card shows: a quick rising figure in the
 * city's own raga on santoor, capped with a manjira's ching. Plays through
 * the SFX bus, so the SFX mute silences it.
 */

import type { Composition } from "./delhi.js";
import { PERC, pluck, type Ctx } from "./instruments.js";
import { midiToHz, swaraHz, type Swara } from "./theory.js";

/** Sa, the raga's third and fifth notes, and Sa above. */
export function chimeNotes(swaras: Swara[]): [Swara, number][] {
  const third = swaras[Math.min(2, swaras.length - 1)];
  const fifth = swaras.includes("P") ? "P" : swaras[Math.min(4, swaras.length - 1)];
  return [
    ["S", 1],
    [third, 1],
    [fifth, 1],
    ["S", 2],
  ];
}

export function playPlaceChime(ctx: Ctx, sfxOut: AudioNode, c: Composition, when = ctx.currentTime): void {
  const out = ctx.createGain();
  out.gain.value = 0.15;
  out.connect(sfxOut);
  const sa = midiToHz(c.sa);
  const t = when + 0.02;
  const strings = pluck(ctx, out, "santoor");
  chimeNotes(c.raga.swaras).forEach(([s, o], i) => strings.note(t + i * 0.085, { hz: swaraHz(sa, s, o), dur: 1.2, vel: 0.95 - i * 0.08 }));
  PERC(sa)(ctx, out, t + 0.3, "m", 0.4);
  // Live only: an offline bounce renders after this returns.
  if (ctx instanceof AudioContext) setTimeout(() => out.disconnect(), 3000);
}
