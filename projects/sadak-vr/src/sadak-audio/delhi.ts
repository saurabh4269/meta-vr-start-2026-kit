/*
 * Ported from SADAK, game_engine/lib/audio/music/cities.ts
 * (SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused in Sadak VR with the owner's permission).
 * Changes: only the Delhi composition (Qawwali, district "purani-sadak") is
 * kept, with the shared types and FORM it uses; its notes are verbatim.
 * The other nine cities are left in SADAK.
 */

/**
 * Delhi's music: Qawwali in raga Kafi, keherwa (8 beats x 2), 116 bpm,
 * Sa = MIDI 49 (C#3); tabla, claps, harmonium, sarangi, tanpura drone,
 * over a modern low end (a kick and a sub-bass).
 *
 * Phrases and patterns are written in the notation in theory.ts, one token
 * per step of the tala; a melodic phrase spans one or more whole cycles.
 */

import type { HeldName, KitName, PluckName, Space } from "./instruments.js";
import type { Raga, Tala } from "./theory.js";

export type Section = "intro" | "a" | "b" | "break";

export type MelodicPart = {
  voice: PluckName | HeldName | "sub";
  /** Octave from Sa: leads 1, the sub-bass -1. */
  octave: number;
  level: number;
  pan?: number;
  send?: number;
  phrases: Partial<Record<Section, string[]>>;
};

export type DrumPart = {
  kit: KitName;
  level: number;
  pan?: number;
  send?: number;
  /** One cycle each; the first is played most, the rest are variations. */
  patterns: Partial<Record<Section, string[]>>;
  /** Replaces the last cycle of a section: a tihai landing on sam. */
  fill?: string;
};

export type Composition = {
  id: string;
  name: string;
  /** MIDI note of Sa. */
  sa: number;
  raga: Raga;
  tala: Tala;
  bpm: number;
  space: Space;
  drone?: "tanpura" | "sruti";
  parts: MelodicPart[];
  drums: DrumPart[];
  /** The first section plays once; the rest loop. */
  form: { section: Section; cycles: number }[];
};

const FORM: Composition["form"] = [
  { section: "intro", cycles: 2 },
  { section: "a", cycles: 6 },
  { section: "b", cycles: 4 },
  { section: "break", cycles: 2 },
  { section: "a", cycles: 4 },
  { section: "b", cycles: 4 },
];

/* ---------------- Delhi: qawwali ---------------- */

const qawwali: Composition = {
  id: "purani-sadak",
  name: "Qawwali",
  sa: 49,
  raga: { name: "Kafi", swaras: ["S", "R", "g", "m", "P", "D", "n"] },
  tala: { name: "keherwa", beats: 8, sub: 2 },
  bpm: 116,
  space: "hall",
  drone: "tanpura",
  parts: [
    {
      voice: "harmonium",
      octave: 1,
      level: 0.75,
      pan: -0.1,
      send: 0.25,
      phrases: {
        intro: ["S - - - R - - - | g - - - - - R - | m - - - g - R - | S - - - - - - -"],
        a: [
          "P - m - g - R - | S - R - g - - -",
          "m - P - D - n - | D - P - m - - -",
          "S' - n - D - P - | m - g - R - S -",
          "R - g - m - P - | g - R - S - - -",
        ],
        b: ["S' R' g' R' S' n D P | m P D n S' - - -", "g' - R' - S' - n - | D P m g R - S -"],
      },
    },
    {
      voice: "sarangi",
      octave: 1,
      level: 0.55,
      pan: 0.3,
      send: 0.35,
      phrases: { b: ["_ _ _ _ ~P - - - | _ _ _ _ ~m - g -", "_ _ _ _ ~S' - n - | _ _ _ _ D - P -"] },
    },
    {
      voice: "sub",
      octave: -1,
      level: 0.85,
      phrases: { a: ["S - - - - - - - | m, - - - P, - - -"], b: ["S - - - S - - - | g - - - m - - -"] },
    },
  ],
  drums: [
    {
      kit: "tabla",
      level: 0.9,
      pan: 0.1,
      send: 0.18,
      patterns: {
        a: ["dha _ ge _ na _ ti _ | na _ ke _ dhi _ na _", "dha ge na ti na ke dhi na | dha ge na ti na ke dhi na"],
        b: ["dha _ ge na ti na ke _ | dha _ ge na dhi na ke _"],
        break: ["dha ge na ti na ke dhi na | dha ge na ti na ke dhi na"],
      },
      fill: "(dha ti) dha _ (dha ti) dha _ (dha ti) dha _ | dha _ _ ke _ _ _",
    },
    {
      kit: "perc",
      level: 0.55,
      pan: -0.2,
      send: 0.3,
      patterns: { a: ["c _ _ _ c _ _ _ | c _ _ _ c _ _ _"], b: ["c _ c _ c _ c _ | c _ c _ c _ c c"], break: ["c _ c _ c _ c _ | c _ c _ c _ c c"] },
    },
    { kit: "kick", level: 0.8, send: 0, patterns: { a: ["K _ _ _ _ _ _ _ | K _ _ _ _ _ _ _"], b: ["K _ _ _ K _ _ _ | K _ _ _ K _ _ _"] } },
  ],
  form: FORM,
};

export const COMPOSITIONS: Composition[] = [qawwali];

/** Each city's music, by our city key. */
export const CITY_MUSIC = { delhi: qawwali } as const satisfies Record<string, Composition>;
export type City = keyof typeof CITY_MUSIC;
