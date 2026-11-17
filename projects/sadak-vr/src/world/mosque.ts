/**
 * Jama Masjid, Delhi, and the gurdwara down Chandni Chowk.
 *
 * Ported from SADAK (game_engine/lib/game/world/mosque.ts
 * `congregationalMosque` with landmarks.ts's Delhi style, monuments.ts
 * `gurdwara`, `chhatri`, `archWindow`, vc.ts `steps`, `archedSlab`, `onion`,
 * `stripedShaft`; authors ahmedfahim21, Parth Mittal, Apoorva Agrawal,
 * Mardav Gandhi; reused with permission): red sandstone on a 5 m plinth, the
 * broad east stair, arcaded cloisters with a gate in each side, the prayer
 * hall across the west with eleven marble-framed bays round a tall pishtaq,
 * three white marble onion domes striped in black, two striped minarets with
 * balconies and domed kiosks, pavilions at the corners, the hauz in the court.
 *
 * VR changes: ink shells on the big masses (seen from 15 m at the minaret
 * spot, up to 120 m behind the gate), none on the thin trim; a `far` level
 * (no arcades, blind arches or kiosks, coarser domes) for the skyline copy
 * the other spots see.
 *
 * Local frame as every SADAK monument: footprint centred on the origin,
 * entrance (the east stair) on +z, prayer hall at -z, ground y = 0.
 */

import { CylinderGeometry, ExtrudeGeometry, Shape, TorusGeometry, BoxGeometry, type BufferGeometry } from '@iwsdk/core';
import { INK_FADE, Parts, onion, stripedShaft } from './kit.js';

const STONE = 0xb5563a;
const ACCENT = 0xf1ece2;
const MARBLE = 0xf4efe6;
const STRIPE = 0x2a2320;
const DEEP = 0x3a2c26;
const GOLD = 0xe0b23a;
const WATER = 0x3f7fc0;
const STRIPED = [MARBLE, MARBLE, MARBLE, STRIPE];

export type MasjidLod = 'near' | 'far';

/** A flight of steps rising toward local -z from y=0 to `rise`, foot of its middle at (x, z) (vc.ts). */
export function steps(P: Parts, w: number, rise: number, x: number, z: number, hex: number, rotY = 0): number {
  const n = Math.max(2, Math.round(rise / 0.17));
  const tread = 0.32;
  const r = rise / n;
  for (let i = 0; i < n; i++) {
    const g = new BoxGeometry(w, r * (i + 1), tread);
    g.translate(0, (r * (i + 1)) / 2, -tread * (i + 0.5));
    if (rotY) g.rotateY(rotY);
    // Every other step a shade darker, so a long flight reads as steps under flat light.
    P.add(g.translate(x, 0, z), i % 2 ? shadeOf(hex, 0.86) : hex);
  }
  return n * tread;
}

function shadeOf(hex: number, k: number): number {
  const r = Math.round(((hex >> 16) & 255) * k);
  const g = Math.round(((hex >> 8) & 255) * k);
  const b = Math.round((hex & 255) * k);
  return (r << 16) | (g << 8) | b;
}

/** A semicircular-arched opening `w` wide through a slab `d` thick (vc.ts). */
function archedSlab(w: number, spring: number, top: number, d: number): BufferGeometry {
  const s = new Shape();
  s.moveTo(-w / 2, spring);
  s.absarc(0, spring, w / 2, Math.PI, 0, true);
  s.lineTo(w / 2, spring);
  s.lineTo(w / 2, top);
  s.lineTo(-w / 2, top);
  s.closePath();
  return new ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 8 }).translate(0, 0, -d / 2);
}

/** An arched window: a dark opening with a round head, on a face at z (monuments.ts). Never inked. */
export function archWindow(P: Parts, x: number, y: number, z: number, w: number, h: number, col: number, rotY = 0): void {
  const g = new BoxGeometry(w, h - w / 2, 0.08).translate(0, (h - w / 2) / 2, 0);
  const head = new CylinderGeometry(w / 2, w / 2, 0.08, 10, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2).translate(0, h - w / 2, 0);
  P.inked(0, () => {
    for (const geo of [g, head]) P.add(geo.rotateY(rotY).translate(x, y, z), col);
  });
}

/** Small open pavilion: four pillars and a dome (monuments.ts). */
export function kiosk(P: Parts, x: number, y: number, z: number, s: number, stone: number, domeCol: number): void {
  P.inked(0, () => {
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) P.box(0.25 * s, 1.6 * s, 0.25 * s, x + a * 0.7 * s, y + 0.8 * s, z + b * 0.7 * s, stone);
    P.box(2 * s, 0.2 * s, 2 * s, x, y + 1.7 * s, z, stone);
  });
  P.dome(0.9 * s, x, y + 1.8 * s, z, domeCol, 1.15, 10);
}

/** Merges `sub` into `P` at (x, y, z) turned by `rot`. */
function put(P: Parts, sub: Parts, x: number, y: number, z: number, rot: number) {
  if (!sub.length) return;
  P.raw(sub.geometry().rotateY(rot).translate(x, y, z));
}

/** Octagonal domed pavilion on a roof corner. */
function pavilion(P: Parts, x: number, y: number, z: number, s: number, lod: MasjidLod) {
  if (lod === 'near') {
    P.inked(0, () => {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        P.box(0.22 * s, 1.7 * s, 0.22 * s, x + Math.sin(a) * s, y + 0.85 * s, z + Math.cos(a) * s, STONE);
      }
    });
  } else {
    P.cyl(s * 0.95, s * 0.95, 1.7 * s, x, y + 0.85 * s, z, STONE, 8);
  }
  P.cyl(s * 1.3, s * 1.3, 0.2 * s, x, y + 1.8 * s, z, STONE, 8);
  P.cyl(s * 0.8, s * 0.85, 0.35 * s, x, y + 2.05 * s, z, STONE, 8);
  onion(P, s * 0.85, x, y + 2.2 * s, z, STRIPED, lod === 'near' ? 16 : 8);
  P.inked(0, () => P.cyl(0.05 * s, 0.05 * s, 0.6 * s, x, y + 2.2 * s + s * 1.4, z, GOLD, 5));
}

/** Crenellations along x, `len` long, at height y, depth z. Not inked. */
function kanguras(P: Parts, len: number, y: number, z: number) {
  const n = Math.max(1, Math.floor(len / 1.3));
  P.inked(0, () => {
    for (let k = 0; k < n; k++) P.box(0.7, 0.6, 0.25, -len / 2 + (k + 0.5) * (len / n), y + 0.3, z, STONE);
  });
}

/** One run of cloister, `len` along x: outer wall at z 0..t, roof on arched piers out to `cd`. */
function cloister(len: number, cd: number, ch: number, lod: MasjidLod, ink: number): Parts {
  const P = new Parts();
  P.ink = ink;
  const t = 1.2;
  P.box(len, ch, t, 0, ch / 2, t / 2, STONE);
  P.box(len, 0.5, cd, 0, ch - 0.25, cd / 2, STONE);
  P.inked(0, () => P.box(len, 0.3, 0.1, 0, ch - 0.7, cd + 0.02, ACCENT));
  if (lod === 'far') {
    P.box(len, ch - 0.5, 0.7, 0, (ch - 0.5) / 2, cd - 0.35, STONE);
    return P;
  }
  P.box(len, 0.12, 0.9, 0, ch - 0.45, cd + 0.4, STONE);
  kanguras(P, len, ch, 0.15);
  kanguras(P, len, ch, cd - 0.15);
  const n = Math.max(1, Math.round(len / 3.8));
  const bay = len / n;
  const pz = cd - 0.35;
  for (let k = 0; k <= n; k++) {
    const u = -len / 2 + k * bay;
    P.box(0.7, ch - 0.5, 0.7, u, (ch - 0.5) / 2, pz, STONE);
    P.inked(0, () => P.box(0.9, 0.3, 0.9, u, 0.15, pz, ACCENT));
  }
  for (let k = 0; k < n; k++) {
    const u = -len / 2 + (k + 0.5) * bay;
    P.inked(0, () => P.add(archedSlab(bay - 0.7, ch * 0.42, ch - 0.5, 0.6).translate(u, 0, pz), STONE));
    archWindow(P, u, 0.3, t + 0.05, Math.min(2.2, bay * 0.55), ch * 0.6, DEEP);
  }
  return P;
}

/** A gatehouse: an arched passage `pw` wide through a block `gd` deep, its front a pishtaq framed in marble. */
function gate(pw: number, gd: number, H: number, main: boolean, lod: MasjidLod, ink: number): Parts {
  const P = new Parts();
  P.ink = ink;
  const pier = Math.max(2.2, pw * 0.45);
  const span = pw + pier * 2;
  const spring = Math.min(H * 0.45, pw * 0.9 + 1);
  for (const s of [-1, 1]) P.box(pier, H, gd, s * (pw / 2 + pier / 2), H / 2, gd / 2, STONE);
  const archTop = spring + pw / 2 + 0.6;
  P.add(archedSlab(pw, spring, archTop, gd).translate(0, 0, gd / 2), STONE);
  P.box(span, H - archTop, gd, 0, archTop + (H - archTop) / 2, gd / 2, STONE);
  // The passage's far end, dark, so the arch reads as an opening.
  P.inked(0, () => P.box(pw, archTop, 0.1, 0, archTop / 2, gd * 0.55, DEEP));
  P.inked(0, () => {
    for (const [z, f] of [[-0.03, -1], [gd + 0.03, 1]] as const) {
      // The pishtaq's marble frame, the arch's rim, roundels in the spandrels.
      P.box(span - 0.6, 0.35, 0.08, 0, H - 0.9, z, ACCENT);
      for (const s of [-1, 1]) P.box(0.35, H - 1.2, 0.08, s * (span / 2 - 0.5), (H - 1.2) / 2, z, ACCENT);
      P.box(pw + 1.6, 0.25, 0.08, 0, archTop + 0.1, z, ACCENT);
      for (const s of [-1, 1]) P.box(0.25, archTop, 0.08, s * (pw / 2 + 0.8), archTop / 2, z, ACCENT);
      P.add(new TorusGeometry(pw / 2 + 0.15, 0.16, 6, 20, Math.PI).translate(0, spring, z), ACCENT);
      if (lod === 'near') {
        for (const s of [-1, 1]) P.add(new CylinderGeometry(0.45, 0.45, 0.08, 12).rotateX(Math.PI / 2).translate(s * (pw / 2 + 0.2), archTop - 0.8, z + f * 0.02), ACCENT);
        if (H - archTop > 2.4) for (let k = -1; k <= 1; k++) archWindow(P, k * (span / 4), archTop + 0.6, z + f * 0.03, 0.9, 1.6, DEEP, f < 0 ? Math.PI : 0);
      }
    }
  });
  if (lod === 'near') {
    kanguras(P, span, H, 0.2);
    kanguras(P, span, H, gd - 0.2);
    // Guldastas at the pishtaq's corners, kiosks along the top.
    for (const s of [-1, 1]) {
      for (const z of [0.4, gd - 0.4]) {
        stripedShaft(P, 0.28, 0.34, 2.4, s * (span / 2 - 0.4), H, z, STONE, MARBLE, 8);
        onion(P, 0.4, s * (span / 2 - 0.4), H + 2.4, z, [MARBLE]);
      }
    }
    const kiosks = main ? 5 : 3;
    for (let k = 0; k < kiosks; k++) kiosk(P, -span / 2 + 1.6 + (k * (span - 3.2)) / (kiosks - 1), H, gd - 0.9, 0.55, MARBLE, MARBLE);
  }
  if (main) {
    const r = pw * 0.42;
    P.cyl(r * 0.9, r * 0.95, 1.2, 0, H + 0.6, gd / 2 + 0.5, ACCENT, 16);
    onion(P, r, 0, H + 1.2, gd / 2 + 0.5, STRIPED, lod === 'near' ? 32 : 12);
    P.inked(0, () => P.cyl(0.08, 0.08, 1.4, 0, H + 1.2 + r * 1.55 + 0.6, gd / 2 + 0.5, GOLD, 5));
  }
  return P;
}

/** A tall minaret: striped tiers, balconies, a domed kiosk on top. */
function minaret(P: Parts, x: number, z: number, y: number, h: number, lod: MasjidLod) {
  const r = Math.max(1.3, h * 0.045);
  const tiers = 3;
  const seg = lod === 'near' ? 16 : 8;
  for (let t = 0; t < tiers; t++) {
    const y0 = y + (h * t) / tiers;
    const hh = h / tiers;
    const r0 = r * (1 - t * 0.12);
    // One shell round the whole tier (the wedges are open strips).
    P.inkOnly(new CylinderGeometry(r0 * 0.9, r0, hh, 12).translate(x, y0 + hh / 2, z));
    P.inked(0, () => stripedShaft(P, r0 * 0.9, r0, hh, x, y0, z, STONE, MARBLE, seg));
    P.cyl(r0 * 1.5, r0 * 1.1, 0.5, x, y0 + hh - 0.1, z, ACCENT, seg);
    P.inked(0, () => P.cyl(r0 * 1.5, r0 * 1.5, 0.12, x, y0 + hh + 0.15, z, ACCENT, seg));
    P.cyl(r0 * 1.48, r0 * 1.48, 0.7, x, y0 + hh + 0.5, z, STONE, seg);
  }
  pavilion(P, x, y + h + 0.7, z, r * 0.75, lod);
}

/**
 * Delhi's Jama Masjid in a `w` x `d` footprint (SADAK draws it 130 m square,
 * modelExtent). Returns where the foot of the east stair is, local.
 */
export function buildJamaMasjid(P: Parts, w: number, d: number, lod: MasjidLod = 'near'): { stairFoot: number; stairW: number; plinth: number } {
  const ink = lod === 'near' ? INK_FADE.monument : 0;
  const was = P.ink;
  P.ink = ink;
  const ph = 5;
  // Plinth, the east stair, the side stairs.
  const n = Math.max(2, Math.round(ph / 0.17));
  const run = n * 0.32;
  const sr = run;
  const Wp = w - 2 * sr;
  const top = -d / 2;
  const front = d / 2 - run;
  const Dp = front - top;
  const zc = (top + front) / 2;
  P.box(Wp, ph, Dp, 0, ph / 2, zc, STONE);
  P.inked(0, () => P.box(Wp + 0.3, 0.35, Dp + 0.3, 0, ph - 0.45, zc, ACCENT));
  const stairW = Math.min(Wp * 0.28, 30);
  P.inked(0, () => steps(P, stairW, ph, 0, d / 2, STONE));
  for (const s of [-1, 1]) P.box(1, ph + 0.4, run, s * (stairW / 2 + 0.5), (ph + 0.4) / 2, d / 2 - run / 2, STONE);
  const sw = Math.min(Dp * 0.2, 22);
  for (const s of [-1, 1]) {
    const rot = s > 0 ? Math.PI / 2 : -Math.PI / 2;
    P.inked(0, () => steps(P, sw, ph, s * (w / 2), zc, STONE, rot));
    for (const f of [-1, 1]) P.box(sr, ph + 0.4, 1, s * (w / 2 - sr / 2), (ph + 0.4) / 2, zc + f * (sw / 2 + 0.5), STONE);
  }
  // Blind arcades round the plinth's faces (the shops under Delhi's).
  if (lod === 'near') {
    const cell = 3.4;
    for (let x = -Wp / 2 + cell / 2; x < Wp / 2; x += cell) {
      if (Math.abs(x) > stairW / 2 + 1.5) archWindow(P, x, 0.3, front + 0.03, 1.8, ph * 0.72, DEEP);
    }
    for (const s of [-1, 1]) {
      for (let z = top + cell / 2; z < front; z += cell) {
        if (Math.abs(z - zc) < sw / 2 + 1.5) continue;
        archWindow(P, s * (Wp / 2 + 0.03), 0.3, z, 1.8, ph * 0.72, DEEP, (s * Math.PI) / 2);
      }
    }
  }
  // The court's paving: pale sandstone over the plinth top.
  P.inked(0, () => P.box(Wp - 2, 0.04, Dp - 2, 0, ph + 0.02, zc, 0xd9b48c));

  // Cloisters on the east, north and south; gates in them.
  const cd = Math.min(7, Math.max(4.5, Wp * 0.055));
  const ch = Math.min(7, Math.max(5, Wp * 0.055));
  const pw = Math.min(7, Math.max(4, stairW * 0.3));
  const gd = cd + 2;
  const gateH = ch * 2.6;
  const gateSpan = pw + 2 * Math.max(2.2, pw * 0.45);
  const cink = lod === 'near' ? INK_FADE.monument : 0;
  const run2 = (x0: number, z0: number, x1: number, z1: number, rot: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 1) return;
    put(P, cloister(len, cd, ch, lod, cink), (x0 + x1) / 2, ph, (z0 + z1) / 2, rot);
  };
  const ex = Wp / 2;
  run2(-ex, front, -gateSpan / 2, front, Math.PI);
  run2(gateSpan / 2, front, ex, front, Math.PI);
  for (const s of [-1, 1]) {
    const rot = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    const x = s * ex;
    run2(x, top, x, zc - gateSpan / 2, rot);
    run2(x, zc + gateSpan / 2, x, front - cd, rot);
  }
  put(P, gate(pw, gd, gateH, true, lod, cink), 0, ph, front, Math.PI);
  for (const s of [-1, 1]) put(P, gate(pw, gd, gateH * 0.85, false, lod, cink), s * ex, ph, zc, s > 0 ? -Math.PI / 2 : Math.PI / 2);
  for (const sx of [-1, 1]) for (const z of [front - cd / 2, top + cd / 2]) pavilion(P, sx * (ex - cd / 2), ph + ch, z, cd * 0.28, lod);

  // The prayer hall across the west.
  const hw = Wp * 0.62;
  const hd = Math.min(Dp * 0.22, 24);
  const hh = Math.min(13, Math.max(8, Wp * 0.1));
  const hb = top + 1.2;
  const hf = hb + hd;
  const hz = (hb + hf) / 2;
  const y = ph;
  P.box(hw, hh, hd, 0, y + hh / 2, hz, STONE);
  for (const s of [-1, 1]) {
    const x0 = hw / 2;
    const x1 = ex - 1.2;
    if (x1 - x0 < 0.5) continue;
    P.box(x1 - x0, ch, 1.2, (s * (x0 + x1)) / 2, y + ch / 2, top + 0.6, STONE);
  }
  const bays = 11;
  const pishW = hw * 0.2;
  const side = (bays - 1) / 2;
  const bayW = (hw - pishW) / 2 / side;
  P.inked(0, () => {
    for (const s of [-1, 1]) {
      for (let k = 0; k < side; k++) {
        const x = s * (pishW / 2 + (k + 0.5) * bayW);
        P.box(bayW * 0.78, hh * 0.74, 0.06, x, y + hh * 0.37 + 0.2, hf + 0.03, ACCENT);
        archWindow(P, x, y + 0.3, hf + 0.07, bayW * 0.6, hh * 0.64, DEEP);
        P.box(0.32, hh, 0.12, x + (s * bayW) / 2, y + hh / 2, hf + 0.06, ACCENT);
      }
    }
    P.box(hw + 0.4, 0.35, hd + 0.4, 0, y + hh - 0.2, hz, ACCENT);
  });
  if (lod === 'near') kanguras(P, hw, y + hh, hf - 0.2);
  // The pishtaq: the tall central arch, framed in marble.
  const pishH = hh * 1.5;
  P.box(pishW, pishH, 2.2, 0, y + pishH / 2, hf + 1.1, STONE);
  P.inked(0, () => {
    P.box(pishW * 0.82, pishH * 0.86, 0.06, 0, y + pishH * 0.43 + 0.2, hf + 2.23, ACCENT);
    archWindow(P, 0, y + 0.3, hf + 2.27, pishW * 0.6, pishH * 0.76, DEEP);
    P.box(pishW * 0.5, 0.9, 0.06, 0, y + pishH * 0.9, hf + 2.24, 0x1f1a17);
  });
  if (lod === 'near') kanguras(P, pishW, y + pishH, hf + 2);
  for (const s of [-1, 1]) {
    stripedShaft(P, 0.36, 0.42, pishH * 0.22, s * (pishW / 2 - 0.35), y + pishH, hf + 1.9, STONE, MARBLE, 8);
    onion(P, 0.5, s * (pishW / 2 - 0.35), y + pishH * 1.22, hf + 1.9, [MARBLE]);
  }
  // Three white marble onions striped in black, on drums, gold finials.
  const r = Math.min(hw * 0.12, hd * 0.46);
  for (const [x, k] of [[0, 1], [-hw * 0.3, 0.74], [hw * 0.3, 0.74]] as const) {
    const rr = r * k;
    const dy = y + hh + (k === 1 ? pishH - hh - 1 : 0);
    P.cyl(rr * 0.92, rr * 0.96, rr * 0.7, x, dy + rr * 0.35, hz, ACCENT, 16);
    if (lod === 'near') for (let a = 0; a < 8; a++) {
      const t = (a / 8) * Math.PI * 2;
      archWindow(P, x + Math.sin(t) * rr * 0.95, dy + 0.1, hz + Math.cos(t) * rr * 0.95, rr * 0.22, rr * 0.5, DEEP, t);
    }
    onion(P, rr, x, dy + rr * 0.7, hz, STRIPED, lod === 'near' ? 32 : 16);
    P.inked(0, () => {
      P.cyl(0.1, 0.1, rr * 0.5, x, dy + rr * 0.7 + rr * 1.55 + rr * 0.25, hz, GOLD, 6);
      P.cone(0.3, 0.6, x, dy + rr * 0.7 + rr * 1.55 + rr * 0.6, hz, GOLD, 8);
    });
  }
  if (lod === 'near') for (const x of [-hw * 0.45, -hw * 0.15, hw * 0.15, hw * 0.45]) kiosk(P, x, y + hh, hf - 1.2, 0.7, MARBLE, MARBLE);
  // Minarets at the hall's ends.
  const mh = Math.min(40, Wp * 0.3);
  const mr = Math.max(1.3, mh * 0.045);
  for (const s of [-1, 1]) minaret(P, s * (hw / 2 + mr + 0.2), hf + mr, y, mh, lod);
  // The hauz in the court.
  if (lod === 'near') {
    const court0 = hf + 2.3;
    const court1 = front - cd;
    const cz = (court0 + court1) / 2;
    const tw = Math.min(14, (Wp - 2 * cd) * 0.18);
    const td = Math.min(11, (court1 - court0) * 0.22);
    P.box(tw + 1.2, 0.55, td + 1.2, 0, y + 0.27, cz, MARBLE);
    P.inked(0, () => P.box(tw, 0.57, td, 0, y + 0.29, cz, WATER));
  }
  P.ink = was;
  return { stairFoot: d / 2, stairW, plinth: ph };
}

/** Gurdwara Sis Ganj Sahib (monuments.ts `gurdwara`, Delhi: two storeys, white, gilded domes, the Nishan Sahib). */
export function buildGurdwara(P: Parts, w: number, d: number): void {
  const DARK = 0x2a2420;
  const SAFFRON = 0xf08a24;
  const rise = 0.8;
  const n = Math.max(2, Math.round(rise / 0.17));
  const run = n * 0.32;
  const ptop = -d / 2;
  const pfront = d / 2 - run;
  const depth = pfront - ptop;
  const zc = (ptop + pfront) / 2;
  P.box(w, rise, depth, 0, rise / 2, zc, MARBLE);
  steps(P, Math.max(3, Math.min(w * 0.45, 20)), rise, 0, d / 2, MARBLE);
  const y = rise;
  const s = Math.min(w * 0.72, depth * 0.72);
  const sz = zc - 0.5;
  const fh = 4.2;
  for (let k = 0; k < 2; k++) {
    const shrink = 1 - k * 0.08;
    P.box(s * shrink, fh, s * shrink, 0, y + fh * (k + 0.5), sz, MARBLE);
    P.box(s * shrink + 0.4, 0.3, s * shrink + 0.4, 0, y + fh * (k + 1), sz, 0xe8c85a);
    const half = (s * shrink) / 2;
    for (let q = 0; q < 4; q++) {
      const rot = (q * Math.PI) / 2;
      const c = Math.cos(rot);
      const sn = Math.sin(rot);
      for (let a = -1; a <= 1; a++) {
        const u = (a * s * shrink) / 3.4;
        archWindow(P, u * c + (half + 0.05) * sn, y + fh * k + 0.5, sz - u * sn + (half + 0.05) * c, s * 0.13, fh * 0.62, DARK, rot);
      }
    }
  }
  const top = y + fh * 2;
  const r = s * 0.28;
  P.cyl(r * 0.9, r * 0.95, 1.2, 0, top + 0.6, sz, MARBLE, 16);
  P.dome(r, 0, top + 1.2, sz, GOLD, 1.12, 16);
  P.cyl(0.1, 0.1, r * 0.9, 0, top + 1.2 + r * 1.5 + r * 0.45, sz, GOLD, 6);
  const k = s * 0.38;
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) kiosk(P, a * k, top, sz + b * k, s * 0.055, MARBLE, GOLD);
  const nx = w / 2 - 1.5;
  const nz = pfront - 2;
  P.cyl(0.12, 0.16, 16, nx, y + 8, nz, 0xd9d4c7, 6);
  P.box(0.05, 2, 3, nx, y + 14.6, nz + 1.5, SAFFRON);
  P.cone(0.35, 0.8, nx, y + 16.4, nz, GOLD, 6);
}

/** The Jama Masjid as a skyline silhouette (~1.5k triangles): plinth, walls, gate, hall, three striped onions, two minarets. */
export function masjidSilhouette(P: Parts, w: number, d: number): void {
  const ph = 5;
  const Wp = w - 2 * 9.3;
  const top = -d / 2;
  const front = d / 2 - 9.3;
  const Dp = front - top;
  const zc = (top + front) / 2;
  P.box(Wp, ph, Dp, 0, ph / 2, zc, STONE);
  const ch = 7;
  for (const [x, z, lw, ld] of [[0, front - 0.6, Wp, 1.2], [-Wp / 2 + 0.6, zc, 1.2, Dp], [Wp / 2 - 0.6, zc, 1.2, Dp]] as const) P.box(lw, ch, ld, x, ph + ch / 2, z, STONE);
  const gH = ch * 2.6;
  P.box(16, gH, 9, 0, ph + gH / 2, front - 4.5, STONE);
  P.box(10, gH * 0.8, 0.2, 0, ph + gH * 0.4, front + 0.05, ACCENT);
  P.box(6, gH * 0.6, 0.3, 0, ph + gH * 0.3, front + 0.1, DEEP);
  onion(P, 2.9, 0, ph + gH, front - 4, STRIPED, 8);
  const hw = Wp * 0.62;
  const hd = Math.min(Dp * 0.22, 24);
  const hh = 11;
  const hb = top + 1.2;
  const hz = hb + hd / 2;
  P.box(hw, hh, hd, 0, ph + hh / 2, hz, STONE);
  P.box(hw * 0.9, hh * 0.6, 0.2, 0, ph + hh * 0.4, hb + hd + 0.05, ACCENT);
  const pishH = hh * 1.5;
  P.box(hw * 0.2, pishH, 2.2, 0, ph + pishH / 2, hb + hd + 1.1, STONE);
  const r = Math.min(hw * 0.12, hd * 0.46);
  for (const [x, k] of [[0, 1], [-hw * 0.3, 0.74], [hw * 0.3, 0.74]] as const) {
    const rr = r * k;
    const dy = ph + hh + (k === 1 ? pishH - hh - 1 : 0);
    P.cyl(rr * 0.92, rr * 0.96, rr * 0.7, x, dy + rr * 0.35, hz, ACCENT, 10);
    onion(P, rr, x, dy + rr * 0.7, hz, STRIPED, 12);
  }
  const mh = Math.min(40, Wp * 0.3);
  const mr = Math.max(1.3, mh * 0.045);
  for (const s of [-1, 1]) {
    const x = s * (hw / 2 + mr + 0.2);
    const z = hb + hd + mr;
    stripedShaft(P, mr * 0.75, mr, mh, x, ph, z, STONE, MARBLE, 6);
    for (const f of [1 / 3, 2 / 3, 1]) P.cyl(mr * 1.4, mr * 1.4, 0.6, x, ph + mh * f, z, ACCENT, 8);
    P.dome(mr * 0.9, x, ph + mh + 0.6, z, MARBLE, 1.15, 8);
  }
}
