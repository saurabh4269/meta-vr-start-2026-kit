/**
 * Old Delhi terraced buildings.
 *
 * Ported from SADAK (game_engine/lib/game/buildings.ts `buildBuildingParts`,
 * `bakeBuilding`, the lived-in layer, and arch-details.ts chhajja, jali,
 * mughal arched heads, jharokha, chhatri; authors ahmedfahim21, Parth Mittal,
 * Apoorva Agrawal, Mardav Gandhi; reused with permission).
 *
 * Changes for Quest 3:
 *  - Street face only (terraces press against each other), lighter shop stock,
 *    fewer grille bars, so a detailed building is ~2-4k triangles.
 *  - Everything is baked straight into a vertex-coloured `Parts` list (the
 *    bakeBuilding idea taken to its end): the whole street is one material.
 *  - Layered parts (glass behind frames, boards on fascias) keep >= 4 cm of
 *    separation, because the app's camera near plane is 1 mm and anything
 *    thinner z-fights a few metres away.
 *  - `far` buildings are a box with painted storeys from the atlas.
 *
 * Local frame: footprint centred on x, street face at z = +d/2 facing +Z,
 * ground at y = 0.
 */

import { BoxGeometry, CylinderGeometry, IcosahedronGeometry, PlaneGeometry, SphereGeometry } from '@iwsdk/core';
import { Parts, boxNoBack, boxNoFront, mulberry32, pick } from './kit.js';
import type { Atlas } from './atlas.js';
import { GENERIC_SIGNS, STOCK_KINDS, WALLS } from './atlas.js';

export const FLOOR_H = 3.2;
export const GROUND_H = 4.0;
const SHOP_BAY_H = 2.9;
const SHOP_INSET = 0.4;

const TRIMS = [0xfaf4e8, 0xf6efe2, 0xffffff, 0xeee2c8];
const METAL = [0x2b2b30, 0x3a4048, 0x2f4f4f, 0x4a2e2a];
const AC_BODY = 0xe9e5da;
const AC_GRILLE = 0x3a3d42;
const SHADE_COLOURS = [0x3f7f8c, 0x9b3b2f, 0x6b8f3a, 0x46505c, 0xb07a2a];
const CLOTH_COLOURS = [0xd8342c, 0xf2b631, 0x2c7bd1, 0x2aa36b, 0xf06aa0, 0xffffff, 0x7c3fb0, 0xf08a24, 0x1f2f5a];
const PACKET_COLOURS = [0xe63b2e, 0xf7c52b, 0x2f9e44, 0x2266c4, 0xf08a24, 0xd6336c];
const GRAIN = [0xe8c36a, 0xd9a441, 0xb5651d, 0xc0392b, 0xf2d27a, 0x8b5a2b, 0xf4e6c4];
const CLOTH = [0xc2185b, 0xf5a623, 0x1f6f5c, 0x3b4ba8, 0xe8364f, 0x7b2d8b, 0xf2efe6, 0x2f9e44];
const BANGLES = [0xd7263d, 0x1b9e5a, 0xe8b923, 0xe0457b, 0x2a6fdb, 0x8e44ad];
const AWNINGS = [0xf0392b, 0x1fbf6b, 0xff8c1a, 0x2f6fb3, 0xf5c518];
const TANK = 0x26272b;
const POT = 0xb8583a;
const LEAF = [0x3f8f3a, 0x2f7a3a, 0x5aa33f];
const INTERIOR = 0x2c211c;
const SHELF = 0x7a5537;
const GLASS = 0x34506a;
const STEEL = 0xc9ced3;

export type BuildingSpec = {
  w: number;
  d: number;
  floors: number;
  seed: number;
  wall?: number;
  /** Bays whose ground floor is left open for a spot (its dressing builds the shop). */
  skipBays?: number[];
  /** Force the mughal look (arched heads, chhajja). Default true. */
  mughal?: boolean;
  /** 0 full 3D windows and lived-in layer; 1 painted windows, real masses. */
  lod?: 0 | 1;
  /** Ink fade distance for the masses (0 = none). */
  ink?: number;
};

/** Every box here faces the street on +Z; its -Z face is never seen, so it is not built. */
function slab(P: Parts, w: number, h: number, d: number, x: number, y: number, z: number, hex: number) {
  // The ink shell needs the closed box; the visible part keeps no back face.
  if (P.ink > 0) P.inkOnly(new BoxGeometry(w, h, d).translate(x, y, z));
  P.inked(0, () => P.add(boxNoBack(w, h, d).translate(x, y, z), hex));
}

/** Chhajja: the projecting drip eave on brackets (arch-details.ts). */
function chhajja(P: Parts, cx: number, cy: number, faceZ: number, w: number, depth: number, hex: number) {
  const eave = new BoxGeometry(w, 0.12, depth);
  eave.rotateX(-0.06);
  eave.translate(cx, cy, faceZ + depth / 2);
  P.add(eave, hex);
  slab(P, w, 0.16, 0.1, cx, cy - 0.05, faceZ + depth, hex);
  const n = w > 2.2 ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const bx = cx - w / 2 + (w * (i + 0.5)) / n;
    const brk = new BoxGeometry(0.14, 0.42, 0.3);
    brk.rotateX(0.5);
    brk.translate(bx, cy - 0.24, faceZ + 0.18);
    P.add(brk, hex);
  }
}

/** Pointed mughal arch head over an opening, as a fan of chords (arch-details.ts). */
function archHead(P: Parts, cx: number, cy: number, faceZ: number, w: number, hex: number) {
  const r = w / 2;
  const rise = r * 1.5;
  const segs = 4;
  const z = faceZ + 0.08;
  const pt = (t: number) => {
    const s = t < 0.5 ? t * 2 : (1 - t) * 2;
    const sign = t < 0.5 ? -1 : 1;
    return { x: sign * r * (1 - s), y: rise * Math.sin((s * Math.PI) / 2) };
  };
  for (let i = 0; i < segs; i++) {
    const p0 = pt(i / segs);
    const p1 = pt((i + 1) / segs);
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) continue;
    const seg = new BoxGeometry(len + 0.08, 0.12, 0.16);
    seg.rotateZ(Math.atan2(dy, dx));
    seg.translate(cx + (p0.x + p1.x) / 2, cy + (p0.y + p1.y) / 2, z);
    P.add(seg, hex);
  }
  slab(P, 0.18, 0.24, 0.2, cx, cy + rise, z, hex);
}

/** Jali: dark backing with a checker of proud studs (arch-details.ts). */
function jali(P: Parts, cx: number, cy: number, faceZ: number, w: number, h: number, dark: number, light: number, cell = 0.26) {
  slab(P, w, h, 0.06, cx, cy, faceZ + 0.03, dark);
  const ink = P.ink;
  P.ink = 0;
  const cols = Math.max(2, Math.round(w / cell));
  const rows = Math.max(2, Math.round(h / cell));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) continue;
      slab(P, (w / cols) * 0.55, (h / rows) * 0.55, 0.05, cx - w / 2 + (w * (c + 0.5)) / cols, cy - h / 2 + (h * (r + 0.5)) / rows, faceZ + 0.085, light);
    }
  }
  P.ink = ink;
}

function pottedPlant(P: Parts, x: number, y: number, z: number, rand: () => number) {
  const ink = P.ink;
  P.ink = 0;
  pottedPlantParts(P, x, y, z, rand);
  P.ink = ink;
}

function pottedPlantParts(P: Parts, x: number, y: number, z: number, rand: () => number) {
  P.cyl(0.15, 0.11, 0.24, x, y + 0.12, z, POT, 7);
  P.add(new IcosahedronGeometry(0.19 + rand() * 0.07, 0).translate(x, y + 0.4, z), pick(LEAF, rand));
}

function acUnit(P: Parts, x: number, y: number, faceZ: number) {
  P.inked(0, () => acUnitParts(P, x, y, faceZ));
}

function acUnitParts(P: Parts, x: number, y: number, faceZ: number) {
  const z = faceZ + 0.2;
  slab(P, 0.8, 0.52, 0.3, x, y, z, AC_BODY);
  P.add(new CylinderGeometry(0.18, 0.18, 0.04, 6).rotateX(Math.PI / 2).translate(x - 0.13, y, z + 0.16), AC_GRILLE);
  slab(P, 0.06, 0.06, 0.34, x - 0.3, y - 0.3, faceZ + 0.17, AC_GRILLE);
  slab(P, 0.06, 0.06, 0.34, x + 0.3, y - 0.3, faceZ + 0.17, AC_GRILLE);
}

function window(P: Parts, cx: number, cy: number, faceZ: number, ww: number, wh: number, trim: number, metal: number, rand: () => number) {
  const ink = P.ink;
  P.ink = 0;
  windowParts(P, cx, cy, faceZ, ww, wh, trim, metal, rand);
  P.ink = ink;
}

function windowParts(P: Parts, cx: number, cy: number, faceZ: number, ww: number, wh: number, trim: number, metal: number, rand: () => number) {
  const reveal = 0.16;
  const frame = 0.12;
  const zFrame = faceZ + reveal / 2;
  const zGlass = faceZ + 0.04;
  slab(P, ww + frame * 2, frame, reveal, cx, cy + wh / 2, zFrame, trim);
  slab(P, ww + frame * 2, frame, reveal, cx, cy - wh / 2, zFrame, trim);
  slab(P, frame, wh, reveal, cx - ww / 2, cy, zFrame, trim);
  slab(P, frame, wh, reveal, cx + ww / 2, cy, zFrame, trim);
  slab(P, ww + frame * 3, 0.1, 0.26, cx, cy - wh / 2 - 0.06, faceZ + 0.13, trim);
  archHead(P, cx, cy + wh / 2, faceZ, ww + frame * 2, trim);
  slab(P, ww, wh, 0.03, cx, cy, zGlass, GLASS);
  const r = rand();
  if (r > 0.9) {
    jali(P, cx, cy, zGlass + 0.02, ww, wh, metal, trim, 0.36);
  } else {
    // A mullion and transom, sometimes a grille in front.
    slab(P, 0.05, wh, 0.05, cx, cy, zGlass + 0.05, metal);
    slab(P, ww, 0.05, 0.05, cx, cy + wh * 0.18, zGlass + 0.05, metal);
    if (r > 0.6) {
      for (let i = 1; i <= 2; i++) slab(P, ww, 0.035, 0.04, cx, cy - wh / 2 + (wh * i) / 3, zGlass + 0.1, metal);
    }
  }
  if (rand() < 0.22) acUnit(P, cx + (rand() - 0.5) * 0.4, cy - wh / 2 - 0.5, faceZ);
  else if (rand() < 0.16) pottedPlant(P, cx + (rand() - 0.5) * ww * 0.6, cy - wh / 2 - 0.01, faceZ + 0.14, rand);
}

function balcony(P: Parts, cx: number, cy: number, faceZ: number, w: number, trim: number, metal: number, rand: () => number) {
  const depth = 0.85;
  slab(P, w, 0.14, depth, cx, cy, faceZ + depth / 2, trim);
  const railH = 0.85;
  const zEdge = faceZ + depth;
  const ink = P.ink;
  P.ink = 0;
  slab(P, w, 0.07, 0.07, cx, cy + railH, zEdge, metal);
  slab(P, 0.07, railH, 0.07, cx - w / 2, cy + railH / 2, zEdge, metal);
  slab(P, 0.07, railH, 0.07, cx + w / 2, cy + railH / 2, zEdge, metal);
  for (const s of [-1, 1]) slab(P, 0.07, railH, depth, cx + (s * w) / 2, cy + railH / 2, faceZ + depth / 2, metal);
  const n = Math.max(3, Math.round(w / 0.4));
  for (let i = 1; i < n; i++) slab(P, 0.035, railH, 0.035, cx - w / 2 + (w * i) / n, cy + railH / 2, zEdge, metal);
  if (rand() < 0.55) {
    const k = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < k; i++) {
      const cw = 0.3 + rand() * 0.25;
      const ch = 0.4 + rand() * 0.35;
      const x = cx - w / 2 + (w * (i + 0.5)) / k + (rand() - 0.5) * 0.15;
      slab(P, cw, ch, 0.03, x, cy + railH - ch / 2 + 0.04, zEdge + 0.07, pick(CLOTH_COLOURS, rand));
    }
  }
  if (rand() < 0.5) pottedPlant(P, cx - w / 2 + 0.3 + (w - 0.6) * rand(), cy + 0.07, faceZ + 0.45, rand);
  P.ink = ink;
}

function shopInterior(P: Parts, atlas: Atlas, cx: number, zBack: number, w: number, h: number, rand: () => number, lod: 0 | 1) {
  P.inked(0, () => shopInteriorParts(P, atlas, cx, zBack, w, h, rand, lod));
}

function shopInteriorParts(P: Parts, atlas: Atlas, cx: number, zBack: number, w: number, h: number, rand: () => number, lod: 0 | 1) {
  const kind = pick(STOCK_KINDS, rand);
  // Shelves of stock painted on the back wall, real goods at the shop mouth.
  P.tex(new PlaneGeometry(w, h).translate(cx, h / 2, zBack + 0.02), atlas.rect(`stock:${kind}`));
  if (lod === 1) return;
  const zf = zBack + 0.75;
  if (kind === 'cloth') {
    P.add(new CylinderGeometry(0.015, 0.015, w - 0.2, 4).rotateZ(Math.PI / 2).translate(cx, h - 0.25, zf), 0x8a6a4a);
    const n = Math.max(2, Math.floor(w / 0.55));
    for (let k = 0; k < n; k++) slab(P, 0.34, 1.3, 0.02, cx - w / 2 + 0.3 + (k * (w - 0.6)) / Math.max(1, n - 1), h - 0.9, zf, pick(CLOTH, rand));
  } else if (kind === 'grocer') {
    const n = Math.max(2, Math.floor(w / 0.6));
    for (let k = 0; k < n; k++) {
      const x = cx - w / 2 + 0.3 + (k * (w - 0.6)) / Math.max(1, n - 1);
      P.cyl(0.2, 0.22, 0.4, x, 0.2, zf, 0xd8c8a0, 6);
      P.cone(0.2, 0.14, x, 0.47, zf, pick(GRAIN, rand), 6);
    }
  } else if (kind === 'sweets') {
    slab(P, w - 0.2, 0.85, 0.5, cx, 0.43, zf, 0x8a6a4a);
    slab(P, w - 0.3, 0.5, 0.02, cx, 0.5, zf + 0.27, 0x9fc6d4);
    const n = Math.max(2, Math.floor(w / 0.5));
    for (let k = 0; k < n; k++) {
      const x = cx - w / 2 + 0.3 + (k * (w - 0.6)) / Math.max(1, n - 1);
      slab(P, 0.36, 0.04, 0.34, x, 0.875, zf, STEEL);
      slab(P, 0.3, 0.07, 0.28, x, 0.93, zf, pick([0xf5a623, 0xf4efe4, 0xe8702a, 0xffd23f, 0x8b5a2b], rand));
    }
  } else if (kind === 'steel') {
    for (let k = 0; k < 3; k++) for (let j = 0; j < 3 - k; j++) P.cyl(0.16, 0.18, 0.2, cx - 0.35 + j * 0.36 + k * 0.18, 0.1 + k * 0.2, zf, STEEL, 6);
  } else if (kind === 'bangles') {
    slab(P, w - 0.4, 0.8, 0.45, cx, 0.4, zf, 0x6f5238);
    slab(P, w - 0.45, 0.05, 0.4, cx, 0.82, zf, 0xcfe0ea);
  } else {
    // Packet strips hung at the entrance.
    for (let k = 0; k < 3; k++) {
      const x = cx - w / 2 + 0.4 + k * ((w - 0.8) / 2);
      for (let i = 0; i < 4; i++) slab(P, 0.2, 0.22, 0.03, x, h - 0.2 - i * 0.25, zf + 0.1, pick(PACKET_COLOURS, rand));
    }
  }
}

function shopfront(P: Parts, atlas: Atlas, cx: number, faceZ: number, w: number, bayW: number, wall: number, metal: number, rand: () => number, lod: 0 | 1) {
  const bayH = SHOP_BAY_H;
  const zBack = faceZ - SHOP_INSET;
  const zMid = faceZ - SHOP_INSET / 2;
  const pier = (bayW - w) / 2 + 0.15;
  slab(P, pier, bayH, SHOP_INSET, cx - w / 2 - pier / 2 + 0.15, bayH / 2, zMid, wall);
  slab(P, pier, bayH, SHOP_INSET, cx + w / 2 + pier / 2 - 0.15, bayH / 2, zMid, wall);
  slab(P, w, 0.3, SHOP_INSET, cx, bayH, zMid, wall);
  // Step up into the shop.
  slab(P, w, 0.2, SHOP_INSET + 0.3, cx, 0.1, faceZ - SHOP_INSET / 2 + 0.15, 0x9a8f80);
  if (rand() > 0.35) {
    shopInterior(P, atlas, cx, zBack, w - 0.3, bayH - 0.15, rand, lod);
  } else {
    P.inked(0, () => {
      for (let i = 0; i < 7; i++) slab(P, w - 0.3, bayH / 7 - 0.04, 0.08, cx, (bayH / 7) * (i + 0.5), zBack + 0.05, metal);
      slab(P, 0.3, 0.14, 0.14, cx, 0.35, zBack + 0.14, metal);
    });
  }
  // Signboard: frame in metal, painted face from the atlas, 6 cm proud of it.
  slab(P, w + 0.1, 0.78, 0.1, cx, bayH + 0.52, faceZ + 0.05, metal);
  const sign = pick(GENERIC_SIGNS, rand);
  P.tex(new PlaneGeometry(w - 0.04, 0.68).translate(cx, bayH + 0.52, faceZ + 0.16), atlas.rect(`sign:${sign}`));
  if (rand() > 0.35) {
    // Awning angled out over the pavement, two-tone stripes.
    const col = pick(AWNINGS, rand);
    const aw = new BoxGeometry(w, 0.06, 1.1);
    aw.rotateX(-0.32);
    aw.translate(cx, bayH + 1.08, faceZ + 0.6);
    P.add(aw, col);
    const lip = new BoxGeometry(w, 0.2, 0.05);
    lip.translate(cx, bayH + 0.82, faceZ + 1.14);
    P.add(lip, 0xf6efe2);
  }
}

function rooftop(P: Parts, w: number, d: number, height: number, rand: () => number) {
  const tanks = rand() < 0.7 ? 1 : 2;
  for (let i = 0; i < tanks; i++) {
    const tx = (rand() - 0.5) * (w - 1.8);
    const tz = (rand() - 0.5) * (d - 2.4);
    const th = 1.0 + rand() * 0.4;
    const base = height + 1.0;
    slab(P, 1.0, 0.08, 1.0, tx, base, tz, 0x3a3d42);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) slab(P, 0.06, 1.0, 0.06, tx + sx * 0.42, height + 0.5, tz + sz * 0.42, 0x3a3d42);
    P.cyl(0.52, 0.56, th, tx, base + th / 2, tz, TANK, 7);
    P.cyl(0.22, 0.3, 0.14, tx, base + th + 0.07, tz, TANK, 5);
  }
  if (rand() > 0.5) slab(P, 2.2, 2.2, 2.2, (rand() - 0.5) * (w - 3), height + 1.1, (rand() - 0.5) * (d - 3), 0xd8ccb4);
  if (rand() < 0.35) {
    const x = (rand() - 0.5) * (w - 1.5);
    const z = (rand() - 0.5) * (d - 1.5);
    P.cyl(0.04, 0.04, 1.6, x, height + 0.8, z, 0x9a9a95, 5);
    const dish = new CylinderGeometry(0.42, 0.08, 0.14, 8);
    dish.rotateX(-0.9);
    dish.rotateY(rand() * Math.PI * 2);
    dish.translate(x, height + 1.7, z);
    P.add(dish, 0xe6e4dc);
  }
}

function chhatri(P: Parts, cx: number, baseY: number, cz: number, s: number, hex: number) {
  P.inked(0, () => chhatriParts(P, cx, baseY, cz, s, hex));
}

function chhatriParts(P: Parts, cx: number, baseY: number, cz: number, s: number, hex: number) {
  const half = 0.5 * s;
  for (const [px, pz] of [[-half, -half], [half, -half], [-half, half], [half, half]]) P.cyl(0.09 * s, 0.09 * s, 1.4 * s, cx + px, baseY + 0.7 * s, cz + pz, hex, 4);
  slab(P, 1.35 * s, 0.14 * s, 1.35 * s, cx, baseY + 1.42 * s, cz, hex);
  P.add(new SphereGeometry(0.72 * s, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.55).translate(cx, baseY + 1.5 * s, cz), hex);
  P.cyl(0.04 * s, 0.04 * s, 0.5 * s, cx, baseY + 2.3 * s, cz, 0xe0b23a, 5);
}

/** Jharokha: corbelled bay window with a jali screen (arch-details.ts). */
function jharokha(P: Parts, cx: number, cy: number, faceZ: number, w: number, h: number, trim: number, metal: number) {
  const proj = 0.62;
  slab(P, w, 0.16, proj, cx, cy - h / 2, faceZ + proj / 2, trim);
  for (const bx of [-w / 2 + 0.2, 0, w / 2 - 0.2]) {
    const brk = new BoxGeometry(0.16, 0.5, 0.34);
    brk.rotateX(0.55);
    brk.translate(cx + bx, cy - h / 2 - 0.28, faceZ + 0.2);
    P.add(brk, trim);
  }
  for (const sx of [-w / 2, w / 2]) slab(P, 0.12, h, proj, cx + sx, cy, faceZ + proj / 2, trim);
  jali(P, cx, cy, faceZ + proj, w - 0.3, h - 0.2, metal, trim, 0.22);
  chhajja(P, cx, cy + h / 2 + 0.1, faceZ, w + 0.25, proj + 0.2, trim);
}

/** A detailed terraced building, street face only. */
export function buildBuilding(P: Parts, atlas: Atlas, spec: BuildingSpec): number {
  const { w, d, floors, seed } = spec;
  const rand = mulberry32(seed);
  const wall = spec.wall ?? pick(WALLS, rand);
  const trim = pick(TRIMS, rand);
  const metal = pick(METAL, rand);
  const height = GROUND_H + floors * FLOOR_H;
  const mughal = spec.mughal ?? true;
  const hasChhajja = mughal && rand() > 0.3;
  const hasJharokha = (spec.lod ?? 0) === 0 && floors >= 2 && rand() > 0.55;
  const hasChhatri = rand() > 0.6;
  const faceZ = d / 2;

  const bays = Math.max(1, Math.floor(w / 2.8));
  const bayW = w / bays;
  const skip = new Set(spec.skipBays ?? []);
  const inkWas = P.ink;
  P.ink = spec.ink ?? 0;
  // Core mass: ground floor inset for the shop bays (and hollowed 2.4 m deep
  // where a spot builds its own shop), full depth above.
  for (let b = 0; b < bays; b++) {
    const cx = -w / 2 + bayW * (b + 0.5);
    const front = skip.has(b) ? faceZ - 2.45 : faceZ - SHOP_INSET;
    slab(P, bayW, GROUND_H, front + d / 2, cx, GROUND_H / 2, (front - d / 2) / 2, wall);
  }
  const lod = spec.lod ?? 0;
  const wi = Math.max(0, WALLS.indexOf(wall));
  // Upper storeys: front and top as geometry, the party walls painted with
  // storeys from the atlas (exposed where a neighbour is lower or missing).
  const upH = height - GROUND_H;
  const upY = GROUND_H + upH / 2;
  if (P.ink > 0) P.inkOnly(new BoxGeometry(w, upH, d).translate(0, upY, 0));
  P.inked(0, () => {
    if (lod === 0) P.add(new PlaneGeometry(w, upH).translate(0, upY, d / 2), wall);
    P.add(new PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(0, height, 0), wall);
    for (const sx of [-1, 1]) {
      const segs = Math.max(1, Math.round(d / 8));
      for (let f = 0; f < floors; f++) {
        for (let k = 0; k < segs; k++) {
          const [u0, v0, u1, v1] = atlas.rect(`floor:${wi}:${(f + k + seed) % 2}`);
          const frac = Math.min(1, d / segs / 8);
          const g = new PlaneGeometry(d / segs, FLOOR_H).translate(-d / 2 + (d / segs) * (k + 0.5), GROUND_H + f * FLOOR_H + FLOOR_H / 2, 0).rotateY((sx * Math.PI) / 2).translate((sx * w) / 2, 0, 0);
          P.tex(g, [u0, v0, u0 + (u1 - u0) * frac, v1]);
        }
      }
    }
  });
  if (lod !== 0) {
    // Painted storeys are the street face.
    for (let f = 0; f < floors; f++) {
      for (let b = 0; b < bays; b++) {
        const [u0, v0, u1, v1] = atlas.rect(`floor:${wi}:${(f + b + seed) % 2}`);
        const k = (b + f) % 3;
        const g = new PlaneGeometry(bayW, FLOOR_H).translate(-w / 2 + bayW * (b + 0.5), GROUND_H + f * FLOOR_H + FLOOR_H / 2, faceZ);
        P.tex(g, [u0 + ((u1 - u0) * k) / 3, v0, u0 + ((u1 - u0) * (k + 1)) / 3, v1]);
      }
    }
  }
  slab(P, w, GROUND_H - SHOP_BAY_H, SHOP_INSET, 0, SHOP_BAY_H + (GROUND_H - SHOP_BAY_H) / 2, faceZ - SHOP_INSET / 2, wall);
  for (let b = 0; b < bays; b++) {
    if (skip.has(b)) continue;
    slab(P, bayW + (b === 0 || b === bays - 1 ? 0.15 : 0), 0.4, 0.5, -w / 2 + bayW * (b + 0.5), 0.2, faceZ - 0.05, trim);
  }
  for (let f = 1; f <= floors; f++) slab(P, w + 0.24, 0.16, 0.24, 0, GROUND_H + (f - 1) * FLOOR_H, faceZ + 0.06, trim);
  slab(P, w + 0.45, 0.3, d + 0.45, 0, height + 0.15, 0, trim);
  slab(P, w + 0.2, 0.75, d + 0.2, 0, height + 0.6, 0, wall);
  slab(P, w + 0.3, 0.1, d + 0.3, 0, height + 1.0, 0, trim);
  // Pilasters at the party walls: the vertical rhythm between neighbours.
  for (const s of [-1, 1]) slab(P, 0.3, height - GROUND_H, 0.14, s * (w / 2 - 0.15), GROUND_H + (height - GROUND_H) / 2, faceZ + 0.07, trim);

  for (let b = 0; b < bays; b++) {
    const cx = -w / 2 + bayW * (b + 0.5);
    if (skip.has(b)) {
      // Leave the bay open; the spot builds its own shop here. Keep the fascia.
      continue;
    }
    shopfront(P, atlas, cx, faceZ, bayW * 0.82, bayW, wall, metal, rand, lod);
  }
  for (let f = 0; f < floors; f++) {
    const cy = GROUND_H + f * FLOOR_H + FLOOR_H / 2;
    if (hasChhajja) chhajja(P, 0, cy + 1.08, faceZ, w * 0.96, 0.5, trim);
    for (let b = 0; b < bays; b++) {
      const cx = -w / 2 + bayW * (b + 0.5);
      if (hasJharokha && f === 1 && b === Math.floor(bays / 2)) {
        jharokha(P, cx, cy, faceZ, Math.min(2.2, bayW * 0.85), 1.8, trim, metal);
        continue;
      }
      if (lod === 0) window(P, cx, cy - 0.1, faceZ, Math.min(1.1, bayW * 0.42), 1.45, trim, metal, rand);
      if (rand() > (lod === 0 ? 0.6 : 0.72)) balcony(P, cx, GROUND_H + f * FLOOR_H + 0.1, faceZ, bayW * 0.8, trim, metal, rand);
    }
  }
  if (rand() < 0.7) {
    const px = (rand() > 0.5 ? 1 : -1) * (w / 2 - 0.35);
    P.cyl(0.07, 0.07, height, px, height / 2 + 0.3, faceZ + 0.22, pick([0x8d8f8a, 0x3d4a52, 0xd8d2c4], rand), 6);
  }
  P.inked(0, () => rooftop(P, w, d, height, rand));
  if (hasChhatri) chhatri(P, (rand() > 0.5 ? 1 : -1) * (w / 2 - 0.9), height + 1.05, faceZ - 0.9, 0.55 + rand() * 0.2, trim);
  P.ink = inkWas;
  return height;
}

/** A distant building: a box with painted storeys and a shop band from the atlas. */
export function buildFarBuilding(P: Parts, atlas: Atlas, spec: BuildingSpec): number {
  const { w, d, floors, seed } = spec;
  const rand = mulberry32(seed);
  const wi = spec.wall !== undefined ? Math.max(0, WALLS.indexOf(spec.wall)) : Math.floor(rand() * WALLS.length);
  const wall = WALLS[wi];
  const trim = pick(TRIMS, rand);
  const height = GROUND_H + floors * FLOOR_H;
  // The box has no street face: painted storeys from the atlas are the face.
  P.add(boxNoFront(w, height, d).translate(0, height / 2, 0), wall);
  slab(P, w, 0.8, d, 0, height + 0.4, 0, wall);
  const z = d / 2;
  const segs = Math.max(1, Math.round(w / 8));
  const sw = w / segs;
  for (let s = 0; s < segs; s++) {
    const cx = -w / 2 + sw * (s + 0.5);
    P.tex(new PlaneGeometry(sw, GROUND_H).translate(cx, GROUND_H / 2, z), atlas.rect(`shops:${wi}`));
    for (let f = 0; f < floors; f++) {
      P.tex(new PlaneGeometry(sw, FLOOR_H).translate(cx, GROUND_H + f * FLOOR_H + FLOOR_H / 2, z), atlas.rect(`floor:${wi}:${(f + s) % 2}`));
    }
  }
  slab(P, w + 0.3, 0.3, d + 0.3, 0, height + 0.15, 0, trim);
  if (rand() < 0.6) P.cyl(0.55, 0.55, 1.2, (rand() - 0.5) * (w - 2), height + 1.4, 0, TANK, 6);
  if (rand() < 0.4) chhatri(P, (rand() - 0.5) * (w - 2), height + 0.8, 0, 0.6, trim);
  return height;
}

export { SHOP_BAY_H, SHOP_INSET, SHADE_COLOURS };
