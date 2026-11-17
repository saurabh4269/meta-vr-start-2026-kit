/**
 * Street furniture and vehicles.
 *
 * Ported from SADAK (props.ts `makeAuto`, `makeStreetLight`, `makeTree`;
 * assets/delhi.ts `makeCycleRickshaw`; clutter.ts poles, transformer, sagging
 * wires; authors ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi;
 * reused with permission). Vehicles are built on the rigid-skinning builder so
 * a moving auto (body, three spinning wheels) is one draw call; static copies
 * are baked into the street's merged geometry.
 */

import { BoxGeometry, CatmullRomCurve3, CylinderGeometry, IcosahedronGeometry, PlaneGeometry, SphereGeometry, TorusGeometry, TubeGeometry, Vector3, type BufferGeometry, type Material, type SkinnedMesh, type Bone } from '@iwsdk/core';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { INK_FADE, Parts, RigBuilder, mulberry32, paint, pick, textured, type UvRect } from './kit.js';

export const AUTO_GREEN = 0x2f8a3e;
export const AUTO_YELLOW = 0xf5c518;

type Sink = (bone: string, g: BufferGeometry, hex: number, glow?: number) => void;

/**
 * The Delhi auto-rickshaw (props.ts makeAuto): CNG-green body, yellow hood,
 * one front wheel and two at the back. Faces +Z, origin on the ground under
 * the middle. `sink` receives every part with the bone it rides on.
 */
function autoParts(add: Sink, body = AUTO_GREEN, hood = AUTO_YELLOW, lo = false): void {
  const dark = 0x14161b;
  const seat = 0x2a2622;
  const chrome = 0xc2c6ca;
  const rb = (w: number, h: number, d: number, seg: number, r: number) => (lo ? new BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, seg, r));
  const B = 'body';
  add(B, rb(1.4, 0.18, 2.2, 2, 0.06).translate(0, 0.5, -0.15), dark);
  add(B, rb(1.42, 0.62, 0.95, 2, 0.14).translate(0, 0.82, -0.8), body);
  for (const sx of [-1, 1]) add(B, rb(0.08, 0.38, 1.2, 1, 0.03).translate(sx * 0.68, 0.72, -0.25), body);
  add(B, rb(1.0, 0.16, 0.8, 1, 0.06).translate(0, 0.55, 0.62), body);
  add(B, rb(0.96, 0.95, 0.24, 2, 0.1).rotateX(-0.12).translate(0, 0.98, 0.98), body);
  add(B, rb(0.7, 0.3, 0.3, 2, 0.1).translate(0, 0.62, 1.12), body);
  add(B, new TorusGeometry(0.38, 0.06, 5, 10, Math.PI).rotateY(Math.PI / 2).translate(0, 0.36, 1.05), body);
  // Headlamp in a chrome ring, indicators; windscreen in a dark frame.
  add(B, new TorusGeometry(0.13, 0.03, 5, 12).rotateX(-0.12).translate(0, 1.18, 1.12), chrome);
  add(B, new SphereGeometry(0.11, 10, 8).translate(0, 1.18, 1.11), 0xfff3c4, 1);
  for (const sx of [-1, 1]) add(B, new BoxGeometry(0.1, 0.06, 0.05).translate(sx * 0.36, 1.32, 1.1), 0xffa21a, 1);
  add(B, new BoxGeometry(1.02, 0.52, 0.04).rotateX(-0.3).translate(0, 1.68, 0.86), 0xa8c8d4);
  add(B, new BoxGeometry(1.08, 0.05, 0.08).rotateX(-0.3).translate(0, 1.43, 0.94), dark);
  // Hood frame, canvas roof, rear curtain (a thick half-shell), side quarters.
  for (const [px, pz] of [[-0.6, 0.72], [0.6, 0.72], [-0.7, -1.18], [0.7, -1.18]]) add(B, new CylinderGeometry(0.03, 0.03, 0.9, 5).translate(px, 1.52, pz), dark);
  add(B, rb(1.5, 0.09, 1.95, 1, 0.04).translate(0, 1.97, -0.22), hood);
  add(B, new CylinderGeometry(0.72, 0.72, 1.5, 10, 1, true, 0, Math.PI / 2).rotateZ(Math.PI / 2).translate(0, 1.3, -0.5), hood);
  add(B, new BoxGeometry(1.46, 0.62, 0.04).translate(0, 1.2, -1.22), hood);
  for (const sx of [-1, 1]) add(B, new BoxGeometry(0.04, 0.72, 0.5).translate(sx * 0.72, 1.55, -0.95), hood);
  add(B, new BoxGeometry(0.6, 0.2, 0.03).translate(0, 1.62, -1.245), dark);
  add(B, new BoxGeometry(1.44, 0.06, 0.96).translate(0, 1.13, -0.8), dark);
  // Seats, handlebar, grab rail.
  add(B, rb(0.5, 0.14, 0.4, 1, 0.05).translate(0, 0.92, 0.32), seat);
  add(B, new CylinderGeometry(0.025, 0.025, 0.66, 5).rotateZ(Math.PI / 2).translate(0, 1.2, 0.66), chrome);
  add(B, new CylinderGeometry(0.02, 0.02, 0.35, 5).rotateX(-0.4).translate(0, 1.03, 0.74), chrome);
  add(B, rb(1.24, 0.16, 0.46, 1, 0.05).translate(0, 1.0, -0.62), seat);
  add(B, rb(1.24, 0.45, 0.1, 1, 0.04).translate(0, 1.3, -0.88), seat);
  add(B, new CylinderGeometry(0.018, 0.018, 1.3, 5).rotateZ(Math.PI / 2).translate(0, 1.45, 0.05), chrome);
  // Rear: mudguards, tail lamps, a blank plate, a yellow stripe on the tub.
  for (const sx of [-1, 1]) {
    add(B, new TorusGeometry(0.4, 0.06, 5, 10, Math.PI).rotateY(Math.PI / 2).translate(sx * 0.76, 0.36, -0.9), body);
    add(B, new BoxGeometry(0.12, 0.12, 0.05).translate(sx * 0.55, 0.92, -1.29), 0xff2a18, 1);
  }
  add(B, new BoxGeometry(0.46, 0.14, 0.03).translate(0, 0.74, -1.29), 0xe4e2d6);
  add(B, new BoxGeometry(1.44, 0.07, 0.97).translate(0, 0.62, -0.8), hood);
  // Wheels: tyre and hub on their own bones.
  for (const [bn, x, z] of [['wheelF', 0, 1.05], ['wheelL', 0.76, -0.9], ['wheelR', -0.76, -0.9]] as const) {
    add(bn, new CylinderGeometry(0.33, 0.33, 0.2, 12).rotateZ(Math.PI / 2).translate(x, 0.33, z), 0x16171a);
    add(bn, new CylinderGeometry(0.15, 0.15, 0.23, 8).rotateZ(Math.PI / 2).translate(x, 0.33, z), chrome);
    // Spokes on the hub so the spin reads.
    add(bn, new BoxGeometry(0.24, 0.05, 0.05).translate(x, 0.33, z), 0x8a8f94);
    add(bn, new BoxGeometry(0.24, 0.05, 0.05).rotateX(Math.PI / 2).translate(x, 0.33, z), 0x8a8f94);
  }
}

export type AutoModel = { mesh: SkinnedMesh; bones: Record<string, Bone>; tris: number };

export function makeAutoRig(material: Material): AutoModel {
  const R = new RigBuilder();
  R.ink = INK_FADE.vehicle;
  R.bone('root', null, 0, 0, 0);
  R.bone('body', 'root', 0, 0.45, 0);
  R.bone('wheelF', 'root', 0, 0.33, 1.05);
  R.bone('wheelL', 'root', 0.76, 0.33, -0.9);
  R.bone('wheelR', 'root', -0.76, 0.33, -0.9);
  autoParts((bone, g, hex, glow = 0) => {
    const was = R.ink;
    if (glow > 0) R.ink = 0;
    R.add(bone, paint(g, hex, glow));
    R.ink = was;
  });
  const built = R.build(material);
  built.mesh.name = 'auto';
  return built;
}

/** A static auto baked into the street (parked). */
export function autoStatic(P: Parts, x: number, z: number, rotY: number, body = AUTO_GREEN, hood = AUTO_YELLOW): void {
  autoParts((_b, g, hex, glow = 0) => {
    g.rotateY(rotY).translate(x, 0, z);
    P.add(g, hex, glow);
  }, body, hood, true);
}

/** Cycle rickshaw (assets/delhi.ts makeCycleRickshaw), faces +Z. */
function rickshawParts(add: Sink, seed: number): void {
  const rand = mulberry32(seed);
  const frame = pick([0x2e6f3e, 0x8e3b3b, 0x2e4f7a], rand);
  const canopy = pick([0xf5c518, 0xe74c3c, 0x27ae60, 0x2f6fb3], rand);
  const seat = 0xc9a26a;
  const black = 0x161616;
  const chrome = 0xcfd4d8;
  const B = 'body';
  add(B, new BoxGeometry(0.1, 0.1, 2.6).translate(0, 0.62, 0.2), frame);
  add(B, new CylinderGeometry(0.03, 0.03, 0.7, 5).rotateX(0.25).translate(0, 0.75, 1.62), chrome);
  add(B, new BoxGeometry(0.55, 0.05, 0.05).translate(0, 1.08, 1.8), chrome);
  add(B, new BoxGeometry(0.32, 0.06, 0.2).translate(0, 0.98, 1.1), seat);
  add(B, new CylinderGeometry(0.03, 0.03, 0.4, 5).translate(0, 0.78, 1.1), frame);
  add(B, new CylinderGeometry(0.12, 0.12, 0.06, 8).rotateZ(Math.PI / 2).translate(0, 0.36, 1.15), black);
  add(B, new BoxGeometry(1.3, 0.08, 0.08).translate(0, 0.46, -0.75), frame);
  add(B, new BoxGeometry(1.15, 0.36, 0.65).translate(0, 0.86, -0.72), seat);
  add(B, new BoxGeometry(1.15, 0.55, 0.1).translate(0, 1.2, -1.02), seat);
  for (const [x, z] of [[-0.58, -1.0], [0.58, -1.0], [-0.58, -0.38], [0.58, -0.38]]) add(B, new CylinderGeometry(0.02, 0.02, 1.1, 4).translate(x, 1.62, z), chrome);
  add(B, new BoxGeometry(1.3, 0.06, 1.4).rotateX(-0.08).translate(0, 2.18, -0.72), canopy);
  add(B, new CylinderGeometry(0.72, 0.72, 1.3, 8, 1, true, 0, Math.PI / 2).rotateZ(Math.PI / 2).rotateY(Math.PI).translate(0, 1.6, -0.65), canopy);
  for (const x of [-0.62, 0.62]) add(B, new BoxGeometry(0.12, 0.08, 0.7).translate(x, 0.95, -0.75), frame);
  for (const [bn, x, z, r] of [['wheelF', 0, 1.75, 0.42], ['wheelL', 0.62, -0.75, 0.46], ['wheelR', -0.62, -0.75, 0.46]] as const) {
    add(bn, new TorusGeometry(r, 0.035, 4, 16).rotateY(Math.PI / 2).translate(x, r, z), black);
    add(bn, new CylinderGeometry(0.05, 0.05, 0.1, 6).rotateZ(Math.PI / 2).translate(x, r, z), chrome);
    for (let s = 0; s < 3; s++) add(bn, new BoxGeometry(0.015, r * 1.9, 0.015).rotateX((Math.PI / 3) * s).translate(x, r, z), chrome);
  }
}

export function makeRickshawRig(material: Material, seed: number): AutoModel {
  const R = new RigBuilder();
  R.ink = INK_FADE.vehicle;
  R.bone('root', null, 0, 0, 0);
  R.bone('body', 'root', 0, 0.6, 0);
  R.bone('wheelF', 'root', 0, 0.42, 1.75);
  R.bone('wheelL', 'root', 0.62, 0.46, -0.75);
  R.bone('wheelR', 'root', -0.62, 0.46, -0.75);
  rickshawParts((bone, g, hex, glow = 0) => R.add(bone, paint(g, hex, glow)), seed);
  const built = R.build(material);
  built.mesh.name = 'rickshaw';
  return built;
}

export function rickshawStatic(P: Parts, x: number, z: number, rotY: number, seed: number): void {
  rickshawParts((_b, g, hex, glow = 0) => {
    g.rotateY(rotY).translate(x, 0, z);
    P.add(g, hex, glow);
  }, seed);
}

/* ------------------------------------------------------------------ */

/** Heritage lamp post with a lantern head, as on the redeveloped Chandni Chowk. */
export function lampPost(P: Parts, x: number, z: number): void {
  const black = 0x1d1e22;
  P.cyl(0.2, 0.24, 0.5, x, 0.25, z, black, 8);
  P.cyl(0.07, 0.1, 3.6, x, 2.3, z, black, 8);
  P.cyl(0.12, 0.12, 0.12, x, 4.1, z, black, 8);
  for (const s of [-1, 1]) {
    P.add(new BoxGeometry(0.7, 0.05, 0.05).translate(x + s * 0.35, 4.15, z), black);
    const lx = x + s * 0.72;
    P.cone(0.2, 0.22, lx, 4.32, z, black, 4);
    P.add(new BoxGeometry(0.24, 0.32, 0.24).translate(lx, 3.98, z), 0xffe6a8, 0.85);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) P.add(new BoxGeometry(0.03, 0.34, 0.03).translate(lx + dx * 0.12, 3.98, z + dz * 0.12), black);
    P.cone(0.05, 0.1, lx, 3.78, z, black, 4);
  }
}

/** Raised planter on the median, with a clipped shrub. */
export function planter(P: Parts, x: number, z: number, len: number, rand: () => number): void {
  P.add(new BoxGeometry(len, 0.5, 1.0).translate(x, 0.25, z), 0xcfc3ad);
  P.add(new BoxGeometry(len + 0.1, 0.08, 1.1).translate(x, 0.52, z), 0xe8ddc6);
  const n = Math.max(1, Math.round(len / 0.9));
  for (let i = 0; i < n; i++) {
    const px = x - len / 2 + (len * (i + 0.5)) / n;
    const col = rand() < 0.25 ? pick([0xd8336c, 0xf2a0b8, 0xffc21a], rand) : pick([0x3f8f3a, 0x4f9b3f, 0x2f7a3a], rand);
    P.add(new IcosahedronGeometry(0.42, 0).scale(1, 0.75, 1).translate(px, 0.82, z), col);
  }
}

/** Neem tree (props.ts makeTree, merged and coarser). */
export function tree(P: Parts, x: number, z: number, seed: number): void {
  const rand = mulberry32(seed);
  const h = 3.4 + rand() * 1.2;
  P.cyl(0.17, 0.3, h, x, h / 2, z, 0x6b5238, 6);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + rand();
    P.add(new CylinderGeometry(0.06, 0.11, 1.5, 4).rotateX(Math.sin(a) * 0.6).rotateZ(-Math.cos(a) * 0.6).translate(x + Math.cos(a) * 0.45, h - 0.1, z + Math.sin(a) * 0.45), 0x6b5238);
  }
  const base = [0x3f7f3a, 0x4f8f3f, 0x356f35, 0x5a9a45];
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const r = 0.9 + rand() * 0.5;
    const a = rand() * Math.PI * 2;
    const sp = 0.4 + rand() * 1.0;
    const c = pick(base, rand);
    const k = 0.75 + t * 0.4;
    const col = ((Math.min(255, ((c >> 16) & 255) * k) << 16) | (Math.min(255, ((c >> 8) & 255) * k) << 8) | Math.min(255, (c & 255) * k)) >>> 0;
    P.add(new IcosahedronGeometry(r, 0).scale(1, 0.8, 1).translate(x + Math.cos(a) * sp, h + 0.4 + t * 1.4, z + Math.sin(a) * sp), col);
  }
}

/** Utility pole with crossarms, insulators and a transformer box. */
export function pole(P: Parts, x: number, z: number, transformer: boolean): void {
  P.cyl(0.1, 0.14, 8.5, x, 4.25, z, 0x8a8a84, 6);
  for (const y of [7.2, 7.9]) {
    P.add(new BoxGeometry(0.08, 0.08, 1.6).translate(x, y, z), 0x5a5a56);
    for (const dz of [-0.7, -0.25, 0.25, 0.7]) P.add(new BoxGeometry(0.06, 0.12, 0.06).translate(x, y + 0.1, z + dz), 0xe8e2d6);
  }
  if (transformer) {
    P.add(new BoxGeometry(0.6, 0.9, 0.5).translate(x + 0.4, 5.6, z), 0x6a7064);
    P.add(new BoxGeometry(0.7, 0.08, 0.6).translate(x + 0.4, 5.1, z), 0x4a4a46);
    for (let i = 0; i < 3; i++) P.add(new BoxGeometry(0.06, 0.25, 0.06).translate(x + 0.25 + i * 0.15, 6.18, z), 0xb8bcc0);
  }
  // A meter box.
  P.add(new BoxGeometry(0.22, 0.3, 0.12).translate(x + 0.1, 3.0, z), 0xd8d2c4);
}

/** A sagging cable between two points (clutter.ts buildWireGeo, as a tube). */
export function wire(P: Parts, a: Vector3, b: Vector3, sag: number, r = 0.012, hex = 0x161616): void {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y -= sag;
  const q1 = a.clone().lerp(mid, 0.5);
  q1.y -= sag * 0.25;
  const q2 = b.clone().lerp(mid, 0.5);
  q2.y -= sag * 0.25;
  const curve = new CatmullRomCurve3([a, q1, mid, q2, b]);
  P.add(new TubeGeometry(curve, 8, r, 3, false), hex);
}

/** Bunting: a string of little triangular flags across the street. */
export function bunting(P: Parts, a: Vector3, b: Vector3, sag: number, seed: number): void {
  const rand = mulberry32(seed);
  wire(P, a, b, sag, 0.008, 0x3a3a3a);
  const n = Math.round(a.distanceTo(b) / 0.5);
  const dir = b.clone().sub(a);
  const yaw = Math.atan2(dir.x, dir.z);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const p = a.clone().lerp(b, t);
    p.y -= sag * 4 * t * (1 - t);
    const g = new CylinderGeometry(0.16, 0.0, 0.3, 3, 1).rotateY(Math.PI / 6).scale(1, 1, 0.08).rotateY(yaw + Math.PI / 2).translate(p.x, p.y - 0.15, p.z);
    P.add(g, pick([0xf0392b, 0xffc21a, 0x1fbf6b, 0x2f6fb3, 0xff8c1a, 0xf06aa0], rand));
  }
}

/** A parked scooter (clutter.ts buildScooterGeo, rebuilt). */
export function scooter(P: Parts, x: number, z: number, rotY: number, hex: number): void {
  const parts: [BufferGeometry, number][] = [
    [new BoxGeometry(0.34, 0.32, 1.2).translate(0, 0.42, 0), hex],
    [new BoxGeometry(0.3, 0.12, 0.55).translate(0, 0.66, -0.2), 0x1a1a1a],
    [new BoxGeometry(0.3, 0.7, 0.14).rotateX(-0.25).translate(0, 0.72, 0.5), hex],
    [new CylinderGeometry(0.02, 0.02, 0.6, 4).rotateZ(Math.PI / 2).translate(0, 1.08, 0.58), 0x2a2a2a],
    [new CylinderGeometry(0.2, 0.2, 0.1, 10).rotateZ(Math.PI / 2).translate(0, 0.2, 0.55), 0x16171a],
    [new CylinderGeometry(0.2, 0.2, 0.1, 10).rotateZ(Math.PI / 2).translate(0, 0.2, -0.45), 0x16171a],
  ];
  for (const [g, c] of parts) P.add(g.rotateY(rotY).translate(x, 0, z), c);
}

/* ------------------------------------------------------------------ */

export const BUS_GREEN = 0x2f8a3e;

/**
 * A generic city bus (no operator's logo or name): plain green livery with a
 * cream window band, a white roof with the AC pod, a Devanagari route board
 * front and side reading "कश्मीरी गेट", two doors on the kerb side (+x, its
 * left). 11.2 m long, faces +Z, origin on the ground under its middle.
 * `route` is the atlas rect of the route board. Wheels on their own bones.
 */
function busParts(add: Sink, tex: (bone: string, g: BufferGeometry) => void, route: UvRect): void {
  const B = 'body';
  const L = 11.2;
  const W = 2.5;
  const green = BUS_GREEN;
  const cream = 0xf2ead2;
  const glass = 0x3d5a73;
  const dark = 0x16181c;
  const z0 = -L / 2;
  // Lower body and window band: the off side whole, the kerb side (+x) in
  // pieces round the two doors, which stand open on a dark interior.
  const doors = [4.6, -1.6];
  const DW = 1.25;
  const runs: [number, number][] = [];
  let zc = -L / 2;
  for (const dz of [...doors].sort((a, b) => a - b)) {
    runs.push([zc, dz - DW / 2]);
    zc = dz + DW / 2;
  }
  runs.push([zc, L / 2]);
  add(B, new BoxGeometry(W / 2, 0.95, L).translate(-W / 4, 0.33 + 0.475, 0), green);
  add(B, new BoxGeometry(W / 2 - 0.02, 1.05, L - 0.1).translate(-W / 4, 1.28 + 0.525, -0.02), glass);
  for (const [a, b] of runs) {
    add(B, new BoxGeometry(W / 2, 0.95, b - a).translate(W / 4, 0.33 + 0.475, (a + b) / 2), green);
    add(B, new BoxGeometry(W / 2 - 0.02, 1.05, b - a).translate(W / 4 - 0.01, 1.28 + 0.525, (a + b) / 2), glass);
    add(B, new BoxGeometry(W / 2 + 0.02, 0.1, b - a).translate(W / 4, 1.32, (a + b) / 2), cream);
  }
  add(B, new BoxGeometry(W / 2 + 0.02, 0.1, L + 0.02).translate(-W / 4, 1.32, 0), cream);
  for (const dz of doors) {
    // The open doorway: a dark interior, a floor step, a grab pole, folded leaves.
    add(B, new BoxGeometry(0.06, 2.0, DW).translate(W / 2 - 1.0, 1.33, dz), 0x2a2622);
    add(B, new BoxGeometry(1.0, 0.06, DW).translate(W / 2 - 0.5, 0.36, dz), 0x5a5f66);
    add(B, new BoxGeometry(0.08, 2.0, 0.08).translate(W / 2 - 0.05, 1.33, dz - DW / 2), 0x9aa0a6);
    add(B, new BoxGeometry(0.08, 2.0, 0.08).translate(W / 2 - 0.05, 1.33, dz + DW / 2), 0x9aa0a6);
    add(B, new BoxGeometry(0.2, 1.86, 0.06).translate(W / 2 - 0.12, 1.33, dz - DW / 2 + 0.08), glass);
    add(B, new BoxGeometry(0.2, 1.86, 0.06).translate(W / 2 - 0.12, 1.33, dz + DW / 2 - 0.08), glass);
    add(B, new CylinderGeometry(0.02, 0.02, 2.0, 6).translate(W / 2 - 0.25, 1.33, dz + 0.3), 0xc2c6ca);
  }
  add(B, new BoxGeometry(W, 0.42, L).translate(0, 2.33 + 0.21, 0), green);
  add(B, new BoxGeometry(W - 0.1, 0.16, L - 0.2).translate(0, 2.83, 0), 0xe8e8e0);
  add(B, new BoxGeometry(1.6, 0.26, 2.6).translate(0, 3.04, -1.4), 0xd8d8d0);
  // Window pillars along both sides.
  for (const sx of [-1, 1]) {
    for (let z = z0 + 0.7; z < L / 2 - 1.6; z += 1.15) {
      if (sx > 0 && doors.some((dz) => Math.abs(z - dz) < DW / 2 + 0.1)) continue;
      add(B, new BoxGeometry(0.06, 1.0, 0.12).translate(sx * (W / 2 + 0.005), 1.8, z), green);
    }
  }
  // Front: windscreen, route board, headlamps, bumper, mirrors.
  add(B, new BoxGeometry(W - 0.2, 1.3, 0.06).translate(0, 1.72, L / 2 + 0.01), glass);
  add(B, new BoxGeometry(W, 0.4, 0.08).translate(0, 2.58, L / 2 + 0.01), dark);
  tex(B, new PlaneGeometry(1.9, 0.3).translate(0, 2.58, L / 2 + 0.06));
  add(B, new BoxGeometry(W + 0.04, 0.3, 0.16).translate(0, 0.48, L / 2 + 0.04), dark);
  for (const sx of [-1, 1]) {
    add(B, new BoxGeometry(0.34, 0.16, 0.06).translate(sx * 0.9, 0.82, L / 2 + 0.02), 0xfff3c4, 1);
    add(B, new BoxGeometry(0.06, 0.06, 0.5).rotateY(sx * 0.4).translate(sx * (W / 2 + 0.2), 2.2, L / 2 - 0.1), dark);
    add(B, new BoxGeometry(0.06, 0.4, 0.22).translate(sx * (W / 2 + 0.42), 1.95, L / 2 + 0.02), dark);
  }
  // Side route board over the front door.
  add(B, new BoxGeometry(0.04, 0.32, 1.3).translate(W / 2 + 0.01, 2.55, 2.0), dark);
  tex(B, new PlaneGeometry(1.2, 0.26).rotateY(Math.PI / 2).translate(W / 2 + 0.04, 2.55, 2.0));
  // Rear: window, tail lamps, bumper.
  add(B, new BoxGeometry(W - 0.4, 0.8, 0.06).translate(0, 1.9, -L / 2 - 0.01), glass);
  add(B, new BoxGeometry(W + 0.04, 0.3, 0.16).translate(0, 0.48, -L / 2 - 0.04), dark);
  for (const sx of [-1, 1]) add(B, new BoxGeometry(0.2, 0.3, 0.05).translate(sx * 1.0, 0.95, -L / 2 - 0.02), 0xff2a18, 1);
  // Wheel arches and wheels.
  for (const [bn, x, z] of [['wheelFL', 1.04, 3.2], ['wheelFR', -1.04, 3.2], ['wheelRL', 1.04, -3.4], ['wheelRR', -1.04, -3.4]] as const) {
    add(bn, new CylinderGeometry(0.5, 0.5, 0.3, 14).rotateZ(Math.PI / 2).translate(x, 0.5, z), 0x16171a);
    add(bn, new CylinderGeometry(0.26, 0.26, 0.32, 8).rotateZ(Math.PI / 2).translate(x, 0.5, z), 0xb8bcc0);
    add(bn, new BoxGeometry(0.33, 0.06, 0.4).translate(x, 0.5, z), 0x6a6f74);
  }
  void route;
}

export function makeBusRig(material: Material, route: UvRect): AutoModel {
  const R = new RigBuilder();
  R.ink = INK_FADE.vehicle;
  R.bone('root', null, 0, 0, 0);
  R.bone('body', 'root', 0, 0.5, 0);
  for (const [bn, x, z] of [['wheelFL', 1.04, 3.2], ['wheelFR', -1.04, 3.2], ['wheelRL', 1.04, -3.4], ['wheelRR', -1.04, -3.4]] as const) R.bone(bn, 'root', x, 0.5, z);
  busParts(
    (bone, g, hex, glow = 0) => {
      const was = R.ink;
      if (glow > 0) R.ink = 0;
      R.add(bone, paint(g, hex, glow));
      R.ink = was;
    },
    (bone, g) => {
      const was = R.ink;
      R.ink = 0;
      R.add(bone, textured(g, route));
      R.ink = was;
    },
    route,
  );
  const built = R.build(material);
  built.mesh.name = 'bus';
  return built;
}
