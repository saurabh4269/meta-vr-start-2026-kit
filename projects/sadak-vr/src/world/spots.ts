/**
 * The three spots where the user's real table becomes a counter.
 *
 * Stall vocabulary adapted from SADAK (props.ts `makeStall`, assets/delhi.ts
 * `makeJalebiStall`/`makeStreetMandir`, buildings.ts shop interiors; authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission), rebuilt at arm's length for a seated user.
 *
 * Counter frame: origin on the counter top where the anchor sits, +Z toward
 * the user, y = 0 the table surface, the street ground at y = -C (C = real
 * table height). The static dressing is rebuilt when C changes (it spans the
 * ground to the canopy); items and the plate are separate meshes, children of
 * the counter, so their local position IS anchor-local when the spot is
 * active.
 */

import { BoxGeometry, CylinderGeometry, Group, IcosahedronGeometry, LatheGeometry, Mesh, Object3D, PlaneGeometry, SphereGeometry, TorusGeometry, Vector2, type BufferGeometry, type Material } from '@iwsdk/core';
import { INK_FADE, Parts, mulberry32, pick } from './kit.js';
import type { Atlas } from './atlas.js';
import type { SpotId } from './types.js';

export const STAND_BACK = 0.66;
/** Distance from the counter origin back to the shop facade (shop-bay spots). */
export const FACADE = 1.35;
export const SPOT_COLOUR: Record<SpotId, number> = { kachori: 0xff7a1a, flowers: 0xe8364f, auto: 0xf5c518, paranthe: 0xb05cff, bus: 0x2f8fff, minaret: 0x19c3b0 };

const WOOD = 0x7a5230;
const WOOD_DK = 0x4a3424;
const BAMBOO = 0xb08a52;
const STEEL = 0xc9ced3;
const BRASS = 0xd4a64a;
const IRON = 0x2b2a2a;
const MARIGOLD_O = 0xff8a12;
const MARIGOLD_Y = 0xffc21a;
const LEAF = 0x3f8f3a;

/** Item placement (counter-local x, z) per spot. */
export const ITEM_POS: Record<SpotId, [number, number][]> = {
  kachori: [[-0.17, -0.06], [0, -0.06], [0.17, -0.06]],
  flowers: [[-0.17, -0.07], [0, -0.07], [0.17, -0.07]],
  auto: [],
  paranthe: [[-0.17, -0.06], [0, -0.06], [0.17, -0.06]],
  bus: [],
  minaret: [],
};
export const PLATE_POS: Record<SpotId, [number, number]> = {
  kachori: [0.1, -0.34],
  flowers: [0.18, -0.34],
  auto: [0.16, -0.33],
  paranthe: [0.2, -0.35],
  bus: [0.16, -0.33],
  minaret: [0.16, -0.33],
};

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

function lathe(profile: [number, number][], segs: number): BufferGeometry {
  return new LatheGeometry(profile.map(([r, y]) => new Vector2(r, y)), segs);
}

/** A kachori on a leaf plate (pattal) with a spoon of aloo sabzi. Origin: plate bottom. */
export function kachoriItem(mat: Material, seed: number): Mesh {
  const rand = mulberry32(seed);
  const P = new Parts();
  P.ink = INK_FADE.goods;
  // Pattal: a shallow bowl of stitched leaves, darker rim.
  P.add(lathe([[0.001, 0.0], [0.05, 0.002], [0.072, 0.012], [0.08, 0.02], [0.077, 0.021], [0.068, 0.014], [0.045, 0.006], [0.001, 0.005]], 18), 0x7d8f3c);
  P.add(new TorusGeometry(0.077, 0.004, 4, 18).rotateX(Math.PI / 2).translate(0, 0.02, 0), 0x5f6f2c);
  // Kachori: a puffed disc, golden with a lighter blistered top.
  // A flat, puffed disc: deep golden-brown rim, a paler blistered top.
  P.add(new SphereGeometry(0.05, 20, 12).scale(1, 0.36, 1).translate(0.008, 0.022, -0.004), 0x8a5024);
  P.add(new SphereGeometry(0.044, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.42).scale(1, 0.42, 1).translate(0.008, 0.026, -0.004), 0xb07842);
  for (let i = 0; i < 6; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.008 + rand() * 0.024;
    P.add(new SphereGeometry(0.006 + rand() * 0.004, 6, 4).scale(1, 0.5, 1).translate(0.008 + Math.cos(a) * r, 0.04 - r * 0.25, -0.004 + Math.sin(a) * r), 0xc8965a);
  }
  // Aloo sabzi beside it, and a green chutney dot.
  P.add(new SphereGeometry(0.026, 10, 6).scale(1.2, 0.45, 1).translate(-0.042, 0.012, 0.034), 0x9a5a26);
  P.add(new SphereGeometry(0.012, 8, 5).scale(1.2, 0.5, 1).translate(0.042, 0.01, 0.038), 0x4f8f2a);
  const m = new Mesh(P.geometry(), mat);
  m.name = 'kachori';
  return m;
}

/** A coiled marigold garland lying flat. Origin: counter contact, centre. */
export function garlandItem(mat: Material, seed: number): Mesh {
  const rand = mulberry32(seed);
  const P = new Parts();
  P.ink = INK_FADE.goods;
  const n = 22;
  const R = 0.068;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const leaf = i % 6 === 5;
    if (leaf) {
      P.add(new SphereGeometry(0.014, 6, 4).scale(1.6, 0.35, 0.8).rotateY(-a + 0.4).translate(x, 0.012, z), LEAF);
    } else {
      const col = i % 2 ? MARIGOLD_O : MARIGOLD_Y;
      // Each bloom: a ruffled ball (two squashed spheres).
      // A ruffled bloom: two faceted balls turned against each other.
      P.add(new IcosahedronGeometry(0.0185, 0).scale(1, 0.85, 1).translate(x, 0.016, z), col);
      P.add(new IcosahedronGeometry(0.015, 0).rotateY(0.6 + rand()).rotateX(0.5).translate(x + (rand() - 0.5) * 0.004, 0.022, z), col === MARIGOLD_O ? 0xff9f2e : 0xffd23f);
    }
  }
  // A red tassel and thread where the ends meet.
  P.add(new SphereGeometry(0.01, 6, 4).translate(R + 0.012, 0.012, 0), 0xc0102a);
  P.add(new CylinderGeometry(0.003, 0.003, 0.05, 4).rotateZ(Math.PI / 2).translate(R + 0.04, 0.01, 0.004), 0xc0102a);
  const m = new Mesh(P.geometry(), mat);
  m.name = 'garland';
  return m;
}

/** Brass thaali (or a steel tray at the chai stall). Origin: bottom centre. */
export function plateItem(mat: Material, steel: boolean): Mesh {
  const P = new Parts();
  P.ink = INK_FADE.goods;
  const col = steel ? STEEL : BRASS;
  P.add(lathe([[0.001, 0.0], [0.1, 0.0], [0.112, 0.004], [0.118, 0.016], [0.122, 0.02], [0.114, 0.02], [0.106, 0.008], [0.09, 0.005], [0.001, 0.005]], 26), col);
  // Engraved ring that catches the light.
  P.add(new TorusGeometry(0.06, 0.0025, 3, 22).rotateX(Math.PI / 2).translate(0, 0.006, 0), steel ? 0xe8ecef : 0xf0cc6a);
  const m = new Mesh(P.geometry(), mat);
  m.name = 'plate';
  return m;
}

/* ------------------------------------------------------------------ */
/* Dressing helpers                                                    */
/* ------------------------------------------------------------------ */

function box(P: Parts, w: number, h: number, d: number, x: number, y: number, z: number, hex: number, glow = 0) {
  P.add(new BoxGeometry(w, h, d).translate(x, y, z), hex, glow);
}

/** A sloped canopy (awning): back edge at (zBack, yBack), front at (zFront, yFront). */
function canopy(P: Parts, w: number, zBack: number, yBack: number, zFront: number, yFront: number, hex: number, stripe: number) {
  const dz = zFront - zBack;
  const dy = yFront - yBack;
  const len = Math.hypot(dz, dy);
  const ang = Math.atan2(-dy, dz);
  const strips = 8;
  for (let i = 0; i < strips; i++) {
    const sw = w / strips;
    const g = new BoxGeometry(sw, 0.03, len);
    g.rotateX(ang);
    g.translate(-w / 2 + sw * (i + 0.5), (yBack + yFront) / 2, (zBack + zFront) / 2);
    P.add(g, i % 2 ? hex : stripe);
  }
  // Valance: a scalloped band along the front edge.
  const n = Math.round(w / 0.16);
  box(P, w + 0.02, 0.05, 0.03, 0, yFront - 0.02, zFront + 0.01, hex);
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w * (i + 0.5)) / n;
    P.add(new CylinderGeometry(0.075, 0.075, 0.02, 8, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI).translate(x, yFront - 0.04, zFront + 0.015), i % 2 ? hex : stripe);
  }
}

/** A bare bulb on a flex, warm and self-lit. */
function bulb(P: Parts, x: number, yTop: number, z: number, drop: number) {
  P.cyl(0.004, 0.004, drop, x, yTop - drop / 2, z, 0x1a1a1a, 4);
  P.cyl(0.014, 0.014, 0.03, x, yTop - drop - 0.012, z, 0x2a2a2a, 6);
  P.sphere(0.03, x, yTop - drop - 0.045, z, 0xfff0b8, 1, 1.2, 1, 10, 8, 1);
}

/** A basket heaped with loose flowers or snacks. */
function heapBasket(P: Parts, x: number, z: number, r: number, basket: number, heap: number[], rand: () => number, n = 14) {
  P.add(lathe([[0.001, 0], [r * 0.8, 0], [r, 0.07], [r * 1.02, 0.08], [r * 0.95, 0.08], [r * 0.78, 0.01], [0.001, 0.01]], 14).translate(x, 0, z), basket);
  P.add(new SphereGeometry(r * 0.9, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5).scale(1, 0.42, 1).translate(x, 0.07, z), heap[0]);
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand()) * r * 0.8;
    const y = 0.07 + Math.sqrt(Math.max(0, 1 - (rr / (r * 0.9)) ** 2)) * r * 0.38;
    P.add(new IcosahedronGeometry(0.02 + rand() * 0.008, 0).rotateY(rand() * 3).translate(x + Math.cos(a) * rr, y, z + Math.sin(a) * rr), pick(heap, rand));
  }
}

/** A hanging strand of marigolds. */
function strand(P: Parts, x: number, yTop: number, z: number, len: number, seed: number) {
  const n = Math.round(len / 0.038);
  for (let i = 0; i < n; i++) P.add(new IcosahedronGeometry(0.02, 0).rotateY(i).translate(x + Math.sin(i * 0.7 + seed) * 0.004, yTop - i * 0.038, z), i % 2 ? MARIGOLD_O : MARIGOLD_Y);
  P.sphere(0.012, x, yTop - n * 0.036 - 0.01, z, 0xc0102a, 1, 1.4, 1, 5, 4);
}

/** The shop recess behind a shop-bay spot: walls, shelves of stock, the board. */
function shopBay(P: Parts, atlas: Atlas, C: number, sign: string, kind: 'kachori' | 'flowers' | 'paranthe', rand: () => number) {
  const g = -C; // ground
  const zF = -FACADE; // facade plane
  const zB = zF - 2.4; // back wall
  const ow = 2.6;
  const oh = 2.2;
  const wallCol = kind === 'kachori' ? 0x3f5a54 : kind === 'paranthe' ? 0x5c4a3a : 0x5a3f52;
  const floor = 0x5e5248;
  // Floor, back wall, side walls, ceiling: a lit-but-dim room.
  box(P, ow + 0.2, 0.06, 2.4, 0, g + 0.03, (zF + zB) / 2, floor);
  box(P, ow + 0.2, oh + 0.8, 0.1, 0, g + (oh + 0.8) / 2, zB, wallCol);
  // Side walls start 2 cm outside the frame's inner face (no coplanar overlap).
  for (const s of [-1, 1]) box(P, 0.1, oh + 0.8, 2.4, s * (ow / 2 + 0.07), g + (oh + 0.8) / 2, (zF + zB) / 2, shade(wallCol, 0.85));
  box(P, ow + 0.2, 0.1, 2.4, 0, g + oh + 0.05, (zF + zB) / 2, shade(wallCol, 0.7));
  // Facade frame round the opening, with a painted wall band for the board.
  // (2-3 cm proud of the building's facade plane so the two never z-fight.)
  const frame = kind === 'kachori' ? 0xf6efe2 : 0xfaf4e8;
  box(P, ow + 0.4, 0.7, 0.32, 0, g + oh + 0.35, zF - 0.13, frame);
  box(P, 0.24, oh, 0.32, -(ow / 2 + 0.12), g + oh / 2, zF - 0.13, frame);
  box(P, 0.24, oh, 0.32, ow / 2 + 0.12, g + oh / 2, zF - 0.13, frame);
  // A raised plinth step into the shop.
  box(P, ow, 0.18, 0.5, 0, g + 0.09, zF - 0.2, 0x9a8f80);
  // Signboard: frame then the painted face 5 cm proud.
  box(P, 2.0, 0.5, 0.06, 0, g + oh + 0.33, zF + 0.03, 0x2a1e16);
  P.tex(new PlaneGeometry(1.9, 0.44).translate(0, g + oh + 0.33, zF + 0.09), atlas.rect(`sign:${sign}`));
  // Shelves up the back wall with stock.
  for (let i = 0; i < 3; i++) {
    const y = g + 0.75 + i * 0.45;
    box(P, ow - 0.3, 0.04, 0.32, 0, y, zB + 0.2, 0x8a6a4a);
    let x = -ow / 2 + 0.25;
    while (x < ow / 2 - 0.3) {
      if (kind === 'kachori' || kind === 'paranthe') {
        // Steel dabbas and glass jars of namkeen (ghee tins and atta at the paratha shop).
        const r = 0.07 + rand() * 0.03;
        const h = 0.16 + rand() * 0.12;
        const col = rand() < 0.4 ? STEEL : pick([0xe8c36a, 0xd9a441, 0xc0392b, 0xf2d27a, 0x8b5a2b], rand);
        P.cyl(r, r, h, x + r, y + 0.02 + h / 2, zB + 0.2, col, 6);
        if (col !== STEEL) P.cyl(r * 1.05, r * 1.05, 0.035, x + r, y + 0.04 + h, zB + 0.2, rand() < 0.5 ? 0xd62828 : 0x2266c4, 6);
        x += r * 2 + 0.05;
      } else {
        // Bundled garlands, coconut, incense packets, brass lamps.
        const t = rand();
        if (t < 0.4) {
          P.cyl(0.08, 0.08, 0.12, x + 0.08, y + 0.08, zB + 0.2, pick([MARIGOLD_O, MARIGOLD_Y, 0xd81b3a], rand), 6);
          x += 0.2;
        } else if (t < 0.6) {
          P.sphere(0.07, x + 0.07, y + 0.09, zB + 0.2, 0x7a5232, 1, 0.9, 1, 6, 4);
          x += 0.17;
        } else if (t < 0.8) {
          box(P, 0.12, 0.2, 0.05, x + 0.06, y + 0.12, zB + 0.2, pick([0x7b2d8b, 0x1f6f5c, 0xe8364f, 0xf5a623], rand));
          x += 0.16;
        } else {
          P.cone(0.05, 0.1, x + 0.06, y + 0.07, zB + 0.2, BRASS, 8);
          x += 0.15;
        }
      }
    }
  }
  // Sacks and tins on the floor at the back.
  for (let i = 0; i < 4; i++) {
    const x = -ow / 2 + 0.35 + i * 0.6;
    P.cyl(0.2, 0.23, 0.45, x, g + 0.25, zB + 0.75, 0xcdb88a, 6);
    P.cone(0.2, 0.12, x, g + 0.5, zB + 0.75, kind !== 'flowers' ? pick([0xe8c36a, 0xd9a441, 0xf4e6c4], rand) : pick([MARIGOLD_O, MARIGOLD_Y, 0xf0f0e8], rand), 8);
  }
  // A tube light on the back wall (self-lit) and a wall calendar.
  // Tube light on the side wall, vertical, clear of the vendor's head from the seat.
  box(P, 0.04, 0.9, 0.04, ow / 2 - 0.0, g + 1.55, zF - 1.6, 0xfff8e0, 1);
  box(P, 0.36, 0.5, 0.02, 0.85, g + 1.45, zB + 0.07, 0xf2efe6);
  box(P, 0.3, 0.28, 0.025, 0.85, g + 1.55, zB + 0.075, kind === 'flowers' ? 0x3a6fb0 : 0xd06a2a);
}

/** Wooden counter body: top at y=0, user edge at z=+0.2, back at z=-0.48. */
function counterBody(P: Parts, C: number, w: number, top: number, body: number) {
  const g = -C;
  box(P, w, 0.045, 0.7, 0, -0.025, -0.14, top);
  box(P, w + 0.03, 0.03, 0.73, 0, -0.06, -0.14, shade(body, 0.8));
  // Front and back panels with legs, so it stands on the street.
  box(P, w, C - 0.12, 0.04, 0, g + (C - 0.12) / 2 + 0.05, 0.18, body);
  box(P, w, C - 0.12, 0.04, 0, g + (C - 0.12) / 2 + 0.05, -0.46, shade(body, 0.85));
  for (const s of [-1, 1]) {
    box(P, 0.04, C - 0.12, 0.64, s * (w / 2 - 0.02), g + (C - 0.12) / 2 + 0.05, -0.14, shade(body, 0.9));
    for (const z of [0.17, -0.45]) box(P, 0.07, C, 0.07, s * (w / 2 - 0.03), g + C / 2, z, WOOD_DK);
  }
  // Painted band along the user-facing edge.
  box(P, w + 0.01, 0.08, 0.05, 0, -0.1, 0.19, 0xf5c53a);
}

function shade(hex: number, k: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

/* ------------------------------------------------------------------ */
/* Per-spot dressing                                                   */
/* ------------------------------------------------------------------ */

export function dressKachori(P: Parts, atlas: Atlas, C: number): void {
  const rand = mulberry32(41);
  const g = -C;
  shopBay(P, atlas, C, 'kachori', 'kachori', rand);
  counterBody(P, C, 1.42, 0xd8dde0, 0x2f7f8c);
  // Kadhai on its iron ring stove, oil shimmering, kachoris frying.
  const kx = 0.5;
  const kz = -0.38;
  P.cyl(0.15, 0.17, 0.08, kx, 0.04, kz, IRON, 12);
  P.add(new TorusGeometry(0.16, 0.012, 4, 14).rotateX(Math.PI / 2).translate(kx, 0.085, kz), 0x1a1a1a);
  P.add(lathe([[0.001, 0.085], [0.09, 0.09], [0.15, 0.12], [0.19, 0.16], [0.2, 0.17], [0.19, 0.17], [0.18, 0.16]], 18).translate(kx, 0, kz), 0x33302c);
  P.add(new CylinderGeometry(0.175, 0.175, 0.006, 20).translate(kx, 0.148, kz), 0xc99a3a, 0.25);
  for (let i = 0; i < 4; i++) {
    const a = i * 1.7;
    P.sphere(0.042, kx + Math.cos(a) * 0.08, 0.156, kz + Math.sin(a) * 0.07, 0x9a6230, 1, 0.38, 1, 10, 6);
  }
  for (const s of [-1, 1]) P.add(new TorusGeometry(0.03, 0.008, 4, 8).rotateY(Math.PI / 2).translate(kx + s * 0.205, 0.165, kz), 0x1a1a1a);
  // Jhara (slotted spoon) resting across the rim.
  P.add(new CylinderGeometry(0.007, 0.007, 0.42, 5).rotateZ(1.25).rotateY(0.5).translate(kx - 0.1, 0.22, kz + 0.06), 0x9aa0a6);
  P.add(new CylinderGeometry(0.05, 0.05, 0.006, 10).rotateX(0.3).translate(kx + 0.06, 0.16, kz - 0.02), 0x9aa0a6);
  // Paraat heaped with kachoris.
  P.add(lathe([[0.001, 0], [0.18, 0.0], [0.21, 0.035], [0.2, 0.038], [0.17, 0.006], [0.001, 0.006]], 20).translate(-0.42, 0, -0.29), STEEL);
  const heap: [number, number, number][] = [];
  for (let ring = 0; ring < 3; ring++) {
    const n = ring === 0 ? 1 : ring === 1 ? 6 : 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring;
      const r = ring * 0.07;
      heap.push([-0.42 + Math.cos(a) * r, 0.028 + (2 - ring) * 0.028, -0.29 + Math.sin(a) * r]);
    }
  }
  for (const [x, y, z] of heap) P.sphere(0.046, x, y - 0.006, z, rand() < 0.5 ? 0x8a5024 : 0x9a5e2c, 1, 0.38, 1, 14, 7);
  // Steel bowl of aloo sabzi with a ladle, stack of pattals, chutney jars.
  P.add(lathe([[0.001, 0], [0.06, 0], [0.085, 0.05], [0.088, 0.06], [0.08, 0.06], [0.06, 0.012], [0.001, 0.012]], 16).translate(-0.5, 0, 0.01), STEEL);
  P.cyl(0.078, 0.078, 0.01, -0.5, 0.05, 0.01, 0xb8662a, 14);
  P.add(new CylinderGeometry(0.006, 0.006, 0.24, 5).rotateZ(-0.9).translate(-0.44, 0.12, 0.01), 0x9aa0a6);
  for (let i = 0; i < 7; i++) P.add(lathe([[0.001, 0], [0.06, 0.002], [0.075, 0.012], [0.07, 0.013], [0.001, 0.006]], 14).translate(0.47, i * 0.008, 0.04), i % 2 ? 0x7d8f3c : 0x6f8034);
  for (const [x, col] of [[0.6, 0x4f8f2a], [0.64, 0xb8402a]] as const) {
    P.cyl(0.035, 0.035, 0.09, x, 0.045, -0.06 + (x - 0.6) * 1.5, STEEL, 10);
    P.cyl(0.031, 0.031, 0.005, x, 0.09, -0.06 + (x - 0.6) * 1.5, col, 10);
  }
  // Awning, poles, bulb, a small tray of fresh dough balls at the back.
  canopy(P, 2.9, -FACADE, g + 2.86, 0.38, g + 2.12, 0xff7a1a, 0xfff1d6);
  for (const s of [-1, 1]) P.cyl(0.035, 0.04, 2.12, s * 1.38, g + 1.06, 0.36, BAMBOO, 6);
  bulb(P, 0.3, g + 2.45, -0.5, 0.28);
  bulb(P, -0.75, g + 2.4, -0.2, 0.22);
  for (let i = 0; i < 6; i++) P.sphere(0.03, 0.62 + (i % 3) * 0.06 - 0.06, 0.02, -0.42 + Math.floor(i / 3) * 0.06, 0xf0e2c0, 1, 0.75, 1, 8, 5);
  // On the street, by the counter: a gas cylinder and a crate.
  P.cyl(0.15, 0.15, 0.58, 0.95, g + 0.29, -0.55, 0xc8302a, 10);
  P.cyl(0.05, 0.06, 0.08, 0.95, g + 0.62, -0.55, 0x9aa0a6, 8);
  box(P, 0.45, 0.32, 0.36, -0.98, g + 0.16, -0.6, 0x3a78c2);
  box(P, 0.42, 0.04, 0.33, -0.98, g + 0.34, -0.6, 0x2a5a92);
}

export function dressFlowers(P: Parts, atlas: Atlas, C: number): void {
  const rand = mulberry32(73);
  const g = -C;
  shopBay(P, atlas, C, 'flowers', 'flowers', rand);
  counterBody(P, C, 1.42, 0xb08458, 0x8a3324);
  // A banana leaf lining the counter top.
  P.add(new BoxGeometry(1.25, 0.004, 0.5).translate(0, 0.004, -0.24), 0x3f8f3a);
  P.add(new BoxGeometry(0.02, 0.006, 0.5).translate(0, 0.006, -0.24), 0x6fae4a);
  heapBasket(P, -0.45, -0.28, 0.2, 0x9a6b3a, [MARIGOLD_O, MARIGOLD_Y, 0xff9f2e], rand, 18);
  heapBasket(P, 0.5, -0.28, 0.16, 0x9a6b3a, [0xc8102e, 0xe02a4a, 0xa00c22], rand, 12);
  // Coiled garlands stacked at the left front, lotus on the right.
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      P.add(new IcosahedronGeometry(0.018, 0).rotateY(i + k).translate(-0.52 + Math.cos(a) * 0.06, 0.016 + k * 0.03, 0.02 + Math.sin(a) * 0.06), (i + k) % 2 ? MARIGOLD_O : MARIGOLD_Y);
    }
  }
  for (let i = 0; i < 3; i++) {
    const x = 0.44 + i * 0.07;
    P.add(new SphereGeometry(0.03, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6).scale(1, 1.2, 1).translate(x, 0.03, 0.02), 0xf2a0b8);
    P.sphere(0.012, x, 0.055, 0.02, 0xf8d0dc, 1, 1, 1, 5, 4);
  }
  // A brass lota and a tray of incense.
  P.add(lathe([[0.001, 0], [0.04, 0], [0.055, 0.04], [0.04, 0.08], [0.025, 0.095], [0.032, 0.11], [0.001, 0.11]], 14).translate(0.62, 0, -0.06), BRASS);
  // Awning with strands of marigold hanging at its edge, clear of the vendor's face.
  canopy(P, 2.9, -FACADE, g + 2.86, 0.38, g + 2.12, 0xe8364f, 0xfff1d6);
  for (const s of [-1, 1]) P.cyl(0.035, 0.04, 2.12, s * 1.38, g + 1.06, 0.36, BAMBOO, 6);
  for (let i = 0; i < 4; i++) {
    for (const s of [-1, 1]) strand(P, s * (0.78 + i * 0.1), g + 2.08 - (s > 0 ? 0 : 0.01), 0.33, 0.5 + ((i * 37) % 5) * 0.07, i);
  }
  // A garland draped as a swag across the front bar.
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const x = -1.3 + t * 2.6;
    const y = g + 2.05 - Math.sin(t * Math.PI) * 0.16;
    P.add(new IcosahedronGeometry(0.022, 0).rotateY(i).translate(x, y, 0.37), i % 2 ? MARIGOLD_O : MARIGOLD_Y);
  }
  bulb(P, 0.35, g + 2.45, -0.55, 0.28);
  // A bucket of water with lotus stems by the counter.
  P.cyl(0.17, 0.14, 0.34, 0.98, g + 0.17, -0.6, 0x2f6fb3, 10);
  P.cyl(0.16, 0.16, 0.01, 0.98, g + 0.33, -0.6, 0x5a8fb8, 10);
  for (let i = 0; i < 4; i++) P.cyl(0.006, 0.006, 0.35, 0.95 + i * 0.03, g + 0.5, -0.6, 0x4f8f3a, 4);
}

/** The small temple next to the flower stall (assets/delhi.ts makeStreetMandir, rebuilt). */
export function streetMandir(P: Parts, atlas: Atlas, x: number, g: number, z: number): void {
  const stone = 0xf3eadb;
  const saffron = 0xe8702a;
  const red = 0xb8322a;
  box(P, 3.4, 0.4, 3.0, x, g + 0.2, z, 0xd9c9a8);
  for (let i = 0; i < 2; i++) box(P, 1.4, 0.13, 0.3, x, g + 0.065 + i * 0.13, z + 1.65 - i * 0.3, 0xd9c9a8);
  box(P, 2.2, 2.3, 2.0, x, g + 1.55, z - 0.2, stone);
  box(P, 2.4, 0.14, 2.2, x, g + 2.75, z - 0.2, saffron);
  // Shikhara: stacked, tapering, saffron-banded.
  let w = 1.9;
  let y = g + 2.82;
  for (let t = 0; t < 5; t++) {
    const h = 0.5 - t * 0.05;
    box(P, w, h, w * 0.9, x, y + h / 2, z - 0.2, t % 2 ? saffron : stone);
    w *= 0.78;
    y += h;
  }
  P.dome(0.3, x, y, z - 0.2, saffron, 1.0, 10);
  P.cyl(0.03, 0.03, 1.0, x, y + 0.85, z - 0.2, 0x8a6a4a, 5);
  const flag = new BoxGeometry(0.5, 0.32, 0.02);
  flag.translate(x + 0.26, y + 1.18, z - 0.2);
  P.add(flag, 0xf08a24);
  // Torana: pillars, lintel, a cusped arch, the sanctum door dark inside.
  for (const s of [-1, 1]) {
    box(P, 0.22, 2.0, 0.22, x + s * 0.8, g + 1.4, z + 1.0, stone);
    box(P, 0.3, 0.12, 0.3, x + s * 0.8, g + 2.42, z + 1.0, saffron);
  }
  box(P, 1.9, 0.22, 0.28, x, g + 2.55, z + 1.0, red);
  box(P, 0.9, 1.5, 0.06, x, g + 1.15, z + 0.82, 0x2a1c16);
  P.add(new CylinderGeometry(0.45, 0.45, 0.06, 12, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2).translate(x, g + 1.9, z + 0.83), 0x2a1c16);
  // An oil lamp glowing in the doorway, bells, a garland over the door.
  P.sphere(0.05, x, g + 0.95, z + 0.86, 0xffc860, 1, 1.3, 1, 6, 5, 1);
  for (const s of [-1, 1]) {
    P.cyl(0.004, 0.004, 0.3, x + s * 0.55, g + 2.3, z + 1.05, 0x2a2a2a, 3);
    P.add(new CylinderGeometry(0.02, 0.07, 0.11, 8).translate(x + s * 0.55, g + 2.1, z + 1.05), BRASS);
  }
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    P.add(new IcosahedronGeometry(0.03, 0).rotateY(i).translate(x - 0.75 + t * 1.5, g + 2.36 - Math.sin(t * Math.PI) * 0.22, z + 1.16), i % 2 ? MARIGOLD_O : MARIGOLD_Y);
  }
  // Name board over the lintel and a low compound wall.
  P.tex(new PlaneGeometry(1.5, 0.36).translate(x, g + 2.92, z + 0.95), atlas.rect('sign:mandir'));
  for (const s of [-1, 1]) box(P, 0.9, 0.7, 0.2, x + s * 1.35, g + 0.75, z + 1.4, 0xe8dcc6);
}

export function dressChai(P: Parts, atlas: Atlas, C: number): void {
  const rand = mulberry32(97);
  const g = -C;
  counterBody(P, C, 1.3, 0x9c7a52, 0x6a4a32);
  // Stove and a pateela of chai on the boil, a steel kettle, glasses, rusk jars.
  const sx = -0.38;
  const sz = -0.29;
  box(P, 0.3, 0.07, 0.26, sx, 0.035, sz, 0x1e2226);
  P.add(new TorusGeometry(0.07, 0.012, 4, 12).rotateX(Math.PI / 2).translate(sx, 0.075, sz), 0x3a5fa8, 0.6);
  P.add(lathe([[0.001, 0.08], [0.11, 0.08], [0.115, 0.1], [0.115, 0.24], [0.12, 0.25], [0.11, 0.25], [0.105, 0.24]], 18).translate(sx, 0, sz), 0xb8bec4);
  P.cyl(0.105, 0.105, 0.008, sx, 0.215, sz, 0xc8a27a, 16);
  P.add(new CylinderGeometry(0.008, 0.008, 0.18, 5).rotateZ(Math.PI / 2).translate(sx + 0.2, 0.2, sz), 0x2a2a2a);
  P.add(lathe([[0.001, 0], [0.08, 0], [0.09, 0.08], [0.07, 0.16], [0.03, 0.19], [0.035, 0.21], [0.001, 0.21]], 14).translate(0.4, 0, -0.22), STEEL);
  P.add(new CylinderGeometry(0.012, 0.018, 0.12, 6).rotateZ(-0.9).translate(0.33, 0.12, -0.22), STEEL);
  // Cutting chai in small glasses: the tea shows through, a pale rim on top.
  for (let i = 0; i < 6; i++) {
    const x = -0.12 + (i % 3) * 0.075;
    const z = -0.1 - Math.floor(i / 3) * 0.075;
    const full = i < 4;
    P.cyl(0.025, 0.021, full ? 0.06 : 0.075, x, full ? 0.04 : 0.0475, z, full ? 0xb5834e : 0xd8e8ec, 8);
    if (full) P.cyl(0.026, 0.025, 0.018, x, 0.079, z, 0xe2eef0, 8);
  }
  box(P, 0.3, 0.012, 0.19, -0.045, 0.006, -0.137, STEEL);
  for (const [x, z, lid] of [[-0.56, -0.36, 0xe8702a], [0.6, -0.4, 0xd62828]] as const) {
    P.cyl(0.07, 0.07, 0.2, x, 0.1, z, 0xdfe8ea, 10);
    P.cyl(0.062, 0.062, 0.14, x, 0.08, z, 0xd9a441, 10);
    P.cyl(0.074, 0.074, 0.03, x, 0.215, z, lid, 10);
  }
  // Blue tarp on bamboo poles (clear of the side where the auto pulls up).
  const tz0 = -1.1;
  const tz1 = 0.5;
  for (const [px, pz] of [[-0.82, tz0], [0.82, tz0], [-0.82, tz1], [0.82, tz1]] as const) P.cyl(0.03, 0.035, 2.2, px, g + 1.1, pz, BAMBOO, 6);
  canopy(P, 1.9, tz0, g + 2.28, tz1 + 0.05, g + 2.1, 0x4a90d0, 0x7ab4e6);
  bulb(P, 0.0, g + 2.18, -0.35, 0.22);
  // Board on a pole behind the stall.
  P.cyl(0.03, 0.03, 2.3, -0.62, g + 1.15, -1.25, WOOD_DK, 5);
  box(P, 1.0, 0.36, 0.05, -0.62, g + 1.95, -1.25, 0x2a1e16);
  P.tex(new PlaneGeometry(0.94, 0.3).translate(-0.62, g + 1.95, -1.21), atlas.rect('sign:chai'));
  // Stools for customers, a crate, a water matka on a stand.
  for (const [x, z] of [[-0.95, 0.75], [0.0, 1.2]] as const) {
    P.cyl(0.17, 0.15, 0.04, x, g + 0.44, z, 0x2f9e44, 10);
    for (let k = 0; k < 4; k++) P.cyl(0.015, 0.015, 0.42, x + Math.cos(k * 1.57) * 0.11, g + 0.21, z + Math.sin(k * 1.57) * 0.11, 0x2f9e44, 4);
  }
  box(P, 0.45, 0.3, 0.35, -0.9, g + 0.15, -0.65, 0xd13b30);
  P.sphere(0.2, 0.95, g + 0.62, -0.65, 0xa8583a, 1, 0.95, 1, 10, 7);
  P.cyl(0.07, 0.08, 0.06, 0.95, g + 0.82, -0.65, 0xa8583a, 8);
  P.cyl(0.16, 0.2, 0.42, 0.95, g + 0.21, -0.65, WOOD_DK, 6);
  void rand;
}


/** Mohan's paratha counter in Paranthe Wali Gali: a tava on its burner, a rolling board, a stack of paranthas, steel bowls of chutney. */
export function dressParanthe(P: Parts, atlas: Atlas, C: number): void {
  const rand = mulberry32(131);
  const g = -C;
  shopBay(P, atlas, C, 'paranthe', 'paranthe', rand);
  counterBody(P, C, 1.42, 0xc9ced3, 0x6a3a7a);
  // Tava: a broad iron griddle on a ring burner, two paranthas frying in ghee.
  const tx = -0.46;
  const tz = -0.33;
  box(P, 0.34, 0.06, 0.3, tx, 0.03, tz, 0x1e2226);
  P.add(new TorusGeometry(0.08, 0.012, 4, 12).rotateX(Math.PI / 2).translate(tx, 0.065, tz), 0x3a5fa8, 0.6);
  P.add(lathe([[0.001, 0.07], [0.15, 0.072], [0.2, 0.082], [0.215, 0.09], [0.205, 0.092], [0.15, 0.084], [0.001, 0.082]], 22).translate(tx, 0, tz), 0x2a2622);
  P.add(new CylinderGeometry(0.17, 0.17, 0.004, 20).translate(tx, 0.086, tz), 0xc9a24a, 0.2);
  for (const [dx, dz] of [[-0.06, 0.03], [0.07, -0.04]] as const) paranthaDisc(P, tx + dx, 0.09, tz + dz, 0.07, rand);
  // A flat steel spatula resting on the tava's rim.
  P.add(new BoxGeometry(0.07, 0.004, 0.09).translate(tx + 0.16, 0.096, tz + 0.12), 0xb8bec4);
  P.add(new CylinderGeometry(0.006, 0.006, 0.2, 5).rotateX(Math.PI / 2).rotateY(-0.6).translate(tx + 0.22, 0.1, tz + 0.2), 0x2a2622);
  // Chakla and belan (rolling board and pin) with a rolled-out parantha.
  P.cyl(0.11, 0.1, 0.025, 0.0, 0.03, -0.37, 0x9a6a3a, 18);
  for (let k = 0; k < 3; k++) P.cyl(0.012, 0.014, 0.02, Math.cos(k * 2.1) * 0.07, 0.008, -0.37 + Math.sin(k * 2.1) * 0.07, 0x6a4424, 5);
  P.cyl(0.075, 0.075, 0.004, 0.0, 0.044, -0.37, 0xead9b0, 16);
  P.add(new CylinderGeometry(0.015, 0.015, 0.3, 8).rotateZ(Math.PI / 2).rotateY(0.3).translate(0.0, 0.06, -0.28), 0xb08458);
  // A stack of paranthas on a steel plate at the back right.
  P.add(lathe([[0.001, 0], [0.1, 0.0], [0.12, 0.03], [0.115, 0.032], [0.095, 0.005], [0.001, 0.005]], 18).translate(0.52, 0, -0.39), STEEL);
  for (let i = 0; i < 6; i++) paranthaDisc(P, 0.52 + (rand() - 0.5) * 0.01, 0.01 + i * 0.011, -0.39 + (rand() - 0.5) * 0.01, 0.075, rand);
  // Steel bowls of chutney: mint, red chilli-garlic, sweet tamarind; a pot of white butter.
  for (const [z, col] of [[-0.24, 0x4f8f2a], [-0.12, 0xb8402a], [0.0, 0x7a3a1a]] as const) {
    P.add(lathe([[0.001, 0], [0.03, 0], [0.046, 0.035], [0.048, 0.04], [0.042, 0.04], [0.028, 0.006], [0.001, 0.006]], 14).translate(0.63, 0, z), STEEL);
    P.cyl(0.04, 0.04, 0.006, 0.63, 0.032, z, col, 12);
  }
  P.cyl(0.05, 0.045, 0.07, -0.6, 0.035, -0.08, 0xc8c2b4, 10);
  P.sphere(0.035, -0.6, 0.075, -0.08, 0xfff4d0, 1, 0.55, 1, 8, 5);
  // A tin of ghee on the floor by the counter; a crate of potatoes.
  P.cyl(0.13, 0.13, 0.32, 0.95, g + 0.16, -0.6, 0xd8b84a, 10);
  P.cyl(0.12, 0.12, 0.01, 0.95, g + 0.32, -0.6, 0xf2d27a, 10);
  box(P, 0.45, 0.3, 0.36, -0.98, g + 0.15, -0.6, 0x8a5a3a);
  for (let i = 0; i < 7; i++) P.sphere(0.045, -1.12 + (i % 4) * 0.09, g + 0.32, -0.66 + Math.floor(i / 4) * 0.1, 0xb98a4a, 1, 0.8, 1, 6, 4);
  // Purple awning (Mohan's colour), bamboo poles, two bulbs.
  canopy(P, 2.9, -FACADE, g + 2.86, 0.38, g + 2.12, 0x8a3fb8, 0xfff1d6);
  for (const sx of [-1, 1]) P.cyl(0.035, 0.04, 2.12, sx * 1.38, g + 1.06, 0.36, BAMBOO, 6);
  bulb(P, 0.3, g + 2.45, -0.5, 0.28);
  bulb(P, -0.7, g + 2.4, -0.2, 0.22);
}

/** A parantha: a round golden flatbread with browned blisters. */
function paranthaDisc(P: Parts, x: number, y: number, z: number, r: number, rand: () => number) {
  P.add(new CylinderGeometry(r, r * 0.98, 0.009, 18).translate(x, y + 0.0045, z), 0xe8c07a);
  P.inked(0, () => {
    for (let i = 0; i < 5; i++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * r * 0.75;
      P.add(new CylinderGeometry(0.008 + rand() * 0.007, 0.01, 0.002, 7).translate(x + Math.cos(a) * rr, y + 0.0095, z + Math.sin(a) * rr), 0x9a6a34);
    }
  });
}

/** A folded stuffed parantha on a small steel plate with a dab of white butter and achaar. Origin: plate bottom. */
export function paranthaItem(mat: Material, seed: number): Mesh {
  const rand = mulberry32(seed);
  const P = new Parts();
  P.ink = INK_FADE.goods;
  P.add(lathe([[0.001, 0.0], [0.07, 0.0], [0.082, 0.008], [0.088, 0.014], [0.083, 0.015], [0.074, 0.006], [0.001, 0.005]], 24), STEEL);
  P.add(new CylinderGeometry(0.066, 0.066, 0.01, 22).translate(0, 0.011, 0), 0xe8c07a);
  P.add(new CylinderGeometry(0.064, 0.064, 0.01, 12, 1, false, 0, Math.PI).translate(0.004, 0.021, 0.008), 0xecc888);
  P.inked(0, () => {
    for (let i = 0; i < 6; i++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * 0.045;
      P.add(new CylinderGeometry(0.008 + rand() * 0.006, 0.01, 0.002, 7).translate(Math.cos(a) * rr, 0.027, Math.sin(a) * rr * 0.5 + 0.02), 0x9a6a34);
    }
  });
  P.add(new BoxGeometry(0.018, 0.012, 0.018).rotateY(0.4).translate(-0.02, 0.033, 0.02), 0xfff2c8);
  P.sphere(0.012, 0.055, 0.012, -0.035, 0xb8402a, 1.3, 0.5, 1, 8, 5);
  const m = new Mesh(P.geometry(), mat);
  m.name = 'parantha';
  return m;
}

/** Imran's ticket desk at the foot of the masjid stair: a ledger, a ticket roll, a shoe rack beside it. */
export function dressMasjidDesk(P: Parts, atlas: Atlas, C: number): void {
  const rand = mulberry32(211);
  const g = -C;
  counterBody(P, C, 1.3, 0x8a5a3a, 0x6a3a26);
  // A green cloth over the top, a ledger open with a pen, a roll of tickets, a brass bell.
  box(P, 1.22, 0.004, 0.6, 0, 0.003, -0.15, 0x1f6f5c);
  box(P, 0.36, 0.02, 0.26, -0.36, 0.015, -0.34, 0xf4efe0);
  box(P, 0.012, 0.024, 0.26, -0.36, 0.017, -0.34, 0x8a3324);
  P.add(new CylinderGeometry(0.005, 0.005, 0.13, 5).rotateZ(Math.PI / 2).rotateY(0.5).translate(-0.3, 0.032, -0.3), 0x1a1a6a);
  P.add(new CylinderGeometry(0.045, 0.045, 0.06, 14).rotateZ(Math.PI / 2).translate(0.45, 0.046, -0.4), 0xf2e6c4);
  P.add(new BoxGeometry(0.05, 0.002, 0.14).translate(0.52, 0.004, -0.33), 0xf2e6c4);
  P.add(lathe([[0.001, 0], [0.04, 0], [0.045, 0.02], [0.03, 0.06], [0.012, 0.075], [0.006, 0.09], [0.001, 0.09]], 12).translate(0.62, 0, -0.42), BRASS);
  // The ticket board on a stand.
  P.cyl(0.02, 0.02, 1.6, -0.75, g + 0.8, -0.45, WOOD_DK, 5);
  box(P, 0.62, 0.3, 0.04, -0.75, g + 1.75, -0.45, 0x2a1e16);
  P.tex(new PlaneGeometry(0.58, 0.26).translate(-0.75, g + 1.75, -0.425), atlas.rect('sign:ticket'));
  // Shoe rack: shoes off before the stair.
  const rx = 1.15;
  for (const y of [0.0, 0.3, 0.6]) box(P, 0.5, 0.025, 1.0, rx, g + 0.08 + y, -0.4, WOOD);
  for (const sz of [-0.88, 0.08]) for (const sx of [-0.22, 0.22]) box(P, 0.04, 0.72, 0.04, rx + sx, g + 0.4, -0.4 + sz + 0.4, WOOD_DK);
  for (let i = 0; i < 9; i++) {
    const y = g + 0.11 + Math.floor(i / 3) * 0.3;
    const z = -0.75 + (i % 3) * 0.3 + (rand() - 0.5) * 0.04;
    const col = pick([0x4a3424, 0x1a1a1a, 0x8a5a3a, 0xc8a070, 0x2f4f6f], rand);
    for (const k of [-0.05, 0.05]) box(P, 0.26, 0.03, 0.09, rx + (rand() - 0.5) * 0.06, y + 0.015, z + k, col);
  }
  // A clay water pot on a stand and a low stool.
  P.sphere(0.18, -1.05, g + 0.6, -0.55, 0xa8583a, 1, 0.95, 1, 10, 7);
  P.cyl(0.06, 0.07, 0.06, -1.05, g + 0.78, -0.55, 0xa8583a, 8);
  P.cyl(0.14, 0.18, 0.4, -1.05, g + 0.2, -0.55, WOOD_DK, 6);
}

/**
 * The Lal Quila stop: the user's table is the stop's sandstone ledge (a
 * folded newspaper, a bottle of water); the shelter behind it, its name
 * board, the stop sign. No desk: Suresh arrives at the bus door.
 */
export function dressBusLedge(P: Parts, atlas: Atlas, C: number): void {
  const g = -C;
  counterBody(P, C, 1.3, 0xd9c9a8, 0xb8a888);
  box(P, 0.3, 0.012, 0.22, -0.4, 0.006, -0.3, 0xece6d6);
  box(P, 0.26, 0.004, 0.02, -0.4, 0.014, -0.34, 0x5a5650);
  P.cyl(0.032, 0.032, 0.2, -0.55, 0.1, -0.08, 0xcfe6f0, 10);
  P.cyl(0.02, 0.02, 0.03, -0.55, 0.215, -0.08, 0x2f6fb3, 8);
  const z0 = -1.5;
  const z1 = -6.2;
  const xb = -1.45;
  const xf = 0.55;
  for (const z of [z0, z1, (z0 + z1) / 2]) {
    P.cyl(0.04, 0.04, 2.55, xb, g + 1.27, z, 0x8a9096, 6);
    P.cyl(0.04, 0.04, 2.55, xf, g + 1.27, z, 0x8a9096, 6);
  }
  P.add(new BoxGeometry(2.4, 0.08, z0 - z1 + 0.4).rotateZ(0.06).translate((xb + xf) / 2, g + 2.6, (z0 + z1) / 2), 0x2f7a4a);
  box(P, 2.5, 0.22, 0.06, (xb + xf) / 2, g + 2.52, z0 + 0.2, 0xf2efe6);
  box(P, 0.05, 1.7, z0 - z1, xb, g + 1.35, (z0 + z1) / 2, 0xe9e5da);
  box(P, 0.04, 1.2, 1.8, xb + 0.04, g + 1.5, (z0 + z1) / 2 - 0.8, 0xf2b631);
  box(P, 0.42, 0.05, z0 - z1 - 0.4, xb + 0.26, g + 0.46, (z0 + z1) / 2, 0x8a9096);
  for (const z of [z0 - 0.4, z1 + 0.4]) box(P, 0.05, 0.44, 0.05, xb + 0.4, g + 0.22, z, 0x5a5f66);
  box(P, 2.0, 0.42, 0.08, (xb + xf) / 2, g + 2.95, z0 - 0.8, 0x1d7a46);
  P.tex(new PlaneGeometry(1.9, 0.36).translate((xb + xf) / 2, g + 2.95, z0 - 0.75), atlas.rect('sign:busstop'));
  for (const sx of [xb + 0.3, xf - 0.3]) P.cyl(0.03, 0.03, 0.35, sx, g + 2.78, z0 - 0.8, 0x8a9096, 5);
  // Bus stop sign on its pole at the kerb behind the user.
  P.cyl(0.035, 0.035, 2.6, 0.78, g + 1.3, 2.9, 0x8a9096, 6);
  box(P, 0.5, 0.36, 0.04, 0.78, g + 2.5, 2.9, 0x1d7a46);
  P.tex(new PlaneGeometry(0.46, 0.3).translate(0.78, g + 2.5, 2.925), atlas.rect('sign:busstop'));
  // A dustbin and a crate of water bottles on the footpath.
  P.cyl(0.18, 0.15, 0.6, -1.15, g + 0.3, 0.9, 0x2f6fb3, 10);
  box(P, 0.4, 0.28, 0.3, -1.05, g + 0.14, -0.8, 0x3a78c2);
}


/** Group wrapper used by street.ts: one dressing mesh per spot, rebuilt on table-height change. */
export function dressingMesh(id: SpotId, atlas: Atlas, C: number, mat: Material): Mesh {
  const P = new Parts();
  P.ink = INK_FADE.counter;
  if (id === 'kachori') dressKachori(P, atlas, C);
  else if (id === 'flowers') dressFlowers(P, atlas, C);
  else if (id === 'paranthe') dressParanthe(P, atlas, C);
  else if (id === 'bus') dressBusLedge(P, atlas, C);
  else if (id === 'minaret') dressMasjidDesk(P, atlas, C);
  else dressChai(P, atlas, C);
  const m = new Mesh(P.geometry(), mat);
  m.name = `dressing-${id}`;
  return m;
}

export type SpotParts = { counter: Group; items: Object3D[]; plate: Object3D };

export function makeSpotItems(id: SpotId, foodMat: Material, counter: Group): SpotParts {
  const items: Object3D[] = [];
  ITEM_POS[id].forEach(([x, z], i) => {
    const it = id === 'kachori' ? kachoriItem(foodMat, 11 + i) : id === 'paranthe' ? paranthaItem(foodMat, 31 + i) : garlandItem(foodMat, 21 + i);
    it.name = `${id}-item-${i}`;
    it.position.set(x, 0, z);
    it.rotation.y = (i - 1) * 0.5;
    counter.add(it);
    items.push(it);
  });
  const plate = plateItem(foodMat, id === 'auto' || id === 'bus');
  plate.name = `${id}-plate`;
  plate.position.set(PLATE_POS[id][0], 0, PLATE_POS[id][1]);
  counter.add(plate);
  return { counter, items, plate };
}
