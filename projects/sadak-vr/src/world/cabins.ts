/**
 * Ride cabins: the rest frame round the seated user while the street moves
 * past. One per vehicle, built in the user's frame (anchor axes, origin on
 * the real table top, the real floor at y = -C), so the cabin never moves
 * relative to the user and the real table becomes part of it:
 *
 *  - rickshaw: the passenger seat under the folding hood, armrests, the
 *    front board over the table, the puller on his saddle pedalling ahead,
 *    the rear wheels turning beside the user's knees.
 *  - auto: the passenger bench, yellow canopy, chrome grab bars, green
 *    flanks, the driver's seat back over the table, Raju driving ahead with
 *    his hands on the handlebar, a marigold string at the windscreen.
 *  - bus: a window seat on the kerb side, the seat back in front over the
 *    table, rows of seats ahead, window frames without glass, roof lights,
 *    handrails, two passengers, Suresh standing in the aisle with his bag.
 *
 * Vehicle styling after SADAK (props.ts makeAuto, assets/delhi.ts
 * makeCycleRickshaw, monuments.ts parkedBus; authors ahmedfahim21, Parth
 * Mittal, Apoorva Agrawal, Mardav Gandhi; reused with permission).
 */

import { BoxGeometry, CylinderGeometry, Group, IcosahedronGeometry, Mesh, SphereGeometry, TorusGeometry, type Material } from '@iwsdk/core';
import { INK_FADE, Parts, mulberry32 } from './kit.js';
import { makePersonRig, type PersonOptions, type PersonRig } from './people.js';
import { HumanVendor } from './human.js';
import { Matrix4, Object3D, Vector3 } from '@iwsdk/core';
import { AUTO_GREEN, AUTO_YELLOW, BUS_GREEN } from './props.js';
import type { RideKind } from './types.js';

/** How far below the real floor the road is in each vehicle (the vehicle floor is the real floor). */
export const ROAD_DROP: Record<RideKind, number> = { rickshaw: 0.5, auto: 0.32, bus: 0.42 };

export type Cabin = {
  kind: RideKind;
  group: Group;
  rebuild(C: number): void;
  /** Animate: speed m/s, yaw rate rad/s, time. */
  update(dt: number, time: number, speed: number, yawRate: number): void;
};

const CHROME = 0xc2c6ca;
const DARK = 0x14161b;
const SEAT = 0x2a2622;

function seatedPose(r: PersonRig, armsForward: number) {
  const b = r.bones;
  b.hipL.rotation.x = -1.45;
  b.hipR.rotation.x = -1.45;
  b.kneeL.rotation.x = 1.5;
  b.kneeR.rotation.x = 1.5;
  b.shoulderL.rotation.set(-armsForward, 0, 0.18);
  b.shoulderR.rotation.set(-armsForward, 0, -0.18);
  b.elbowL.rotation.x = -0.5;
  b.elbowR.rotation.x = -0.5;
  b.spine.rotation.x = 0.1;
  for (const k of ['neck', 'head']) b[k].rotation.order = 'YXZ';
}

/** Cabin for `kind`. `rajuSpec`/`sureshSpec`: the vendors' looks, so the driver and conductor are the same men. */
export function makeCabin(kind: RideKind, mat: Material, peopleMat: Material, C0: number, spec: PersonOptions): Cabin {
  const group = new Group();
  group.name = `cabin-${kind}`;
  group.visible = false;
  let shell: Mesh | null = null;
  let C = C0;
  const people: { rig: PersonRig; role: 'driver' | 'puller' | 'conductor' | 'sitter'; seed: number }[] = [];
  /** The same characters as at the stalls (human.ts): Raju at the wheel, Suresh at the door. */
  const humans: HumanVendor[] = [];
  const lookAhead = new Object3D();
  lookAhead.position.set(0, 0, -7);
  lookAhead.rotation.y = Math.PI;
  const rigRoot = new Group();
  group.add(rigRoot);
  const wheels: Group[] = [];

  const build = () => {
    const P = new Parts();
    P.ink = INK_FADE.counter;
    if (kind === 'auto') autoCabin(P, C);
    else if (kind === 'rickshaw') rickshawCabin(P, C);
    else busCabin(P, C);
    const m = new Mesh(P.geometry(), mat);
    m.name = `cabin-${kind}-shell`;
    m.frustumCulled = false;
    if (shell) {
      shell.removeFromParent();
      shell.geometry.dispose();
    }
    shell = m;
    group.add(m);
    // People sit relative to the floor (y = -C).
    rigRoot.position.y = -C;
  };
  build();

  // ---- the people ----
  if (kind === 'auto') {
    // Raju on the driver's saddle 1 m ahead, facing the road, hands on the handlebar.
    const h = new HumanVendor({ id: 'auto', counter: lookAhead, anchorMatrix: () => new Matrix4(), seed: 5, standBack: 0,
      seated: { hands: [new Vector3(0.24, 1.0, 0.42), new Vector3(-0.24, 1.0, 0.42)], hipY: 0.62 }, baseClip: 'drive' });
    h.root.name = 'cabin-driver';
    h.root.position.set(0, 0, -1.05);
    h.root.rotation.y = Math.PI;
    rigRoot.add(h.root, lookAhead);
    humans.push(h);
    void spec;
  } else if (kind === 'rickshaw') {
    const r = makePersonRig({ preset: 'kurta_pyjama', seed: 911, lod: 0, height: 1.64, cloth1: 0xe8dcc0, cloth2: 0x8a7a5a, headwear: 'short', kit: ['towel'], kitColour: 0xf2efe6, moustache: true, skin: 0x6f4a30 }, peopleMat);
    r.mesh.name = 'cabin-puller';
    r.mesh.position.set(0, 0.86 - r.dims.hipY * r.dims.scale, -1.2);
    r.mesh.rotation.y = Math.PI;
    seatedPose(r, 1.0);
    r.bones.spine.rotation.x = 0.35;
    rigRoot.add(r.mesh);
    people.push({ rig: r, role: 'puller', seed: 2 });
    // Rear wheels beside the user, spinning.
    for (const sx of [-1, 1]) {
      const W = new Parts();
      W.ink = INK_FADE.vehicle;
      W.add(new TorusGeometry(0.46, 0.03, 5, 20).rotateY(Math.PI / 2), 0x161616);
      W.add(new CylinderGeometry(0.05, 0.05, 0.1, 6).rotateZ(Math.PI / 2), CHROME);
      W.inked(0, () => {
        for (let s = 0; s < 4; s++) W.add(new BoxGeometry(0.012, 0.9, 0.012).rotateX((Math.PI / 4) * s), CHROME);
      });
      const g = new Group();
      const wm = new Mesh(W.geometry(), mat);
      g.add(wm);
      g.position.set(sx * 0.66, 0.46 - ROAD_DROP.rickshaw, 0.55);
      rigRoot.add(g);
      wheels.push(g);
    }
  } else {
    // Suresh standing at the door, one hand up on the rail.
    const h = new HumanVendor({ id: 'bus', counter: rigRoot, anchorMatrix: () => new Matrix4(), seed: 44, standBack: 0, baseClip: 'rail' });
    h.root.name = 'cabin-conductor';
    h.root.position.set(1.0, 0, -1.0);
    h.root.rotation.y = -Math.PI / 2;
    rigRoot.add(h.root);
    humans.push(h);
    // Two passengers a few rows ahead.
    for (const [x, z, seed, preset] of [[0.05, -2.2, 41, 'sari'], [1.4, -3.0, 47, 'kurta_pyjama']] as const) {
      const p = makePersonRig({ preset, seed, lod: 1, height: 1.6 }, peopleMat);
      p.mesh.position.set(x, 0.46 - p.dims.hipY * p.dims.scale + 0.02, z + 0.1);
      seatedPose(p, 0.4);
      p.mesh.rotation.y = Math.PI;
      rigRoot.add(p.mesh);
      people.push({ rig: p, role: 'sitter', seed });
    }
  }

  let travelled = 0;
  return {
    kind,
    group,
    rebuild(c: number) {
      C = c;
      build();
    },
    update(dt, time, speed, yawRate) {
      travelled += speed * dt;
      // A tiny idle shake (engine, or the road under a rickshaw); no pitch or roll.
      const shake = kind === 'auto' ? Math.sin(time * 71) * 0.0012 + Math.sin(time * 23) * 0.0008 : kind === 'bus' ? Math.sin(time * 41) * 0.0008 : Math.abs(Math.sin(travelled * 2.1)) * 0.004 * Math.min(1, speed);
      group.position.y = shake;
      for (const w of wheels) w.rotation.x -= (speed * dt) / 0.46;
      for (const h of humans) {
        h.counterY = 0.9;
        h.update(dt, time);
      }
      for (const p of people) {
        const b = p.rig.bones;
        const breath = Math.sin(time * 1.6 + p.seed);
        b.chest.scale.set(1 + breath * 0.01, 1, 1 + breath * 0.015);
        if (p.role === 'puller') {
          const ped = travelled * 1.9;
          b.hipL.rotation.x = -1.25 + Math.sin(ped) * 0.38;
          b.hipR.rotation.x = -1.25 - Math.sin(ped) * 0.38;
          b.kneeL.rotation.x = 1.35 - Math.sin(ped) * 0.45;
          b.kneeR.rotation.x = 1.35 + Math.sin(ped) * 0.45;
          b.hips.rotation.z = Math.sin(ped) * 0.05;
          b.shoulderL.rotation.set(-1.0, 0, 0.12 + yawRate * 0.2);
          b.shoulderR.rotation.set(-1.0, 0, -0.12 + yawRate * 0.2);
          b.head.rotation.y = Math.sin(time * 0.31) * 0.25;
        } else if (p.role === 'driver') {
          // Steer into the turn; glance at the mirror now and then.
          b.spine.rotation.z = -yawRate * 0.15;
          b.shoulderL.rotation.set(-1.05, 0, 0.18 - yawRate * 0.25);
          b.shoulderR.rotation.set(-1.05, 0, -0.18 - yawRate * 0.25);
          b.head.rotation.y = Math.sin(time * 0.23) * 0.3 + yawRate * 0.6;
        } else if (p.role === 'conductor') {
          b.head.rotation.y = Math.sin(time * 0.27) * 0.4;
          b.spine.rotation.z = Math.sin(time * 0.9) * 0.02 - yawRate * 0.1;
        } else {
          b.head.rotation.y = Math.sin(time * 0.2 + p.seed) * 0.5 - 0.6;
        }
      }
    },
  };
}

function box(P: Parts, w: number, h: number, d: number, x: number, y: number, z: number, hex: number, glow = 0) {
  P.add(new BoxGeometry(w, h, d).translate(x, y, z), hex, glow);
}

function bar(P: Parts, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, r: number, hex: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const L = Math.hypot(dx, dy, dz);
  const g = new CylinderGeometry(r, r, L, 6);
  // Align +y with the bar.
  const ax = Math.atan2(Math.hypot(dx, dz), dy);
  const ay = Math.atan2(dx, dz);
  g.rotateX(ax).rotateY(ay).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  P.add(g, hex);
}

/** The surface over the real table: a ledge at the table top, its user edge at z = +0.2. */
function ledge(P: Parts, C: number, top: number, body: number, w = 1.34, depth = 0.7) {
  const zc = 0.2 - depth / 2;
  box(P, w, 0.04, depth, 0, -0.02, zc, top);
  box(P, w, C - 0.06, 0.05, 0, -C + (C - 0.06) / 2, 0.2 - depth + 0.03, body);
}

/** The driver's seat back under the user's hands: a padded vinyl roll, not a slab across the view. */
function seatBack(P: Parts, C: number) {
  const w = 1.0;
  box(P, w, 0.05, 0.3, 0, -0.025, 0.05, 0x4a3224);
  box(P, w - 0.04, 0.012, 0.26, 0, 0.002, 0.05, 0x5c3e2c);
  for (const x of [-0.25, 0, 0.25]) box(P, 0.012, 0.014, 0.26, x, 0.004, 0.05, 0x3a261a);
  box(P, w, C - 0.06, 0.06, 0, -C + (C - 0.06) / 2, -0.1, 0x3a2a20);
}

function autoCabin(P: Parts, C: number) {
  const f = -C; // floor
  const rand = mulberry32(5);
  // Floor pan and the green tub round the passenger compartment.
  box(P, 1.44, 0.04, 2.9, 0, f - 0.02, -0.35, DARK);
  for (const sx of [-1, 1]) {
    box(P, 0.06, 0.42, 1.25, sx * 0.74, f + 0.21, 0.42, AUTO_GREEN);
    box(P, 0.08, 0.06, 1.25, sx * 0.74, f + 0.45, 0.42, AUTO_GREEN);
  }
  box(P, 1.44, 0.6, 0.08, 0, f + 0.3, 1.08, AUTO_GREEN);
  // Passenger bench and its back.
  box(P, 1.3, 0.12, 0.48, 0, f + 0.44, 0.72, SEAT);
  box(P, 1.3, 0.62, 0.1, 0, f + 0.78, 1.02, SEAT);
  // The driver's seat back over the table, its top the table top.
  seatBack(P, C);
  // Canopy: roof, rear curtain, side quarters, frame.
  box(P, 1.5, 0.08, 2.75, 0, f + 1.98, -0.3, AUTO_YELLOW);
  box(P, 1.48, 0.86, 0.04, 0, f + 1.52, 1.12, AUTO_YELLOW);
  for (const sx of [-1, 1]) {
    box(P, 0.04, 0.6, 0.5, sx * 0.73, f + 1.66, 0.85, AUTO_YELLOW);
    bar(P, sx * 0.7, f + 0.45, 0.2, sx * 0.7, f + 1.95, 0.2, 0.022, DARK);
    bar(P, sx * 0.7, f + 0.45, -1.55, sx * 0.7, f + 1.95, -1.55, 0.022, DARK);
    // Chrome grab bar along the open side.
    bar(P, sx * 0.71, f + 0.95, 0.15, sx * 0.71, f + 0.95, 1.0, 0.016, CHROME);
    bar(P, sx * 0.71, f + 0.95, 0.15, sx * 0.71, f + 1.45, 0.15, 0.016, CHROME);
  }
  box(P, 1.48, 0.05, 0.05, 0, f + 1.93, 1.1, DARK);
  // Ahead: the driver's saddle, the cowl and windscreen frame, the handlebar.
  box(P, 0.42, 0.12, 0.38, 0, f + 0.56, -1.05, SEAT);
  box(P, 0.3, 0.5, 0.3, 0, f + 0.25, -1.05, DARK);
  box(P, 1.0, 0.9, 0.12, 0, f + 0.55, -1.75, AUTO_GREEN);
  box(P, 0.7, 0.32, 0.3, 0, f + 0.7, -1.88, AUTO_GREEN);
  for (const sx of [-1, 1]) bar(P, sx * 0.5, f + 1.0, -1.72, sx * 0.55, f + 1.92, -1.5, 0.025, DARK);
  box(P, 1.1, 0.06, 0.06, 0, f + 1.0, -1.72, DARK);
  box(P, 1.1, 0.07, 0.08, 0, f + 1.9, -1.52, DARK);
  bar(P, -0.36, f + 1.12, -1.48, 0.36, f + 1.12, -1.48, 0.016, CHROME);
  bar(P, 0, f + 1.0, -1.62, 0, f + 1.12, -1.48, 0.02, CHROME);
  box(P, 0.14, 0.1, 0.06, 0, f + 1.86, -1.45, 0xa8c8d4);
  // A string of marigolds and a lemon-chilli charm at the windscreen.
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    P.add(new IcosahedronGeometry(0.022, 0).translate(-0.45 + t * 0.9, f + 1.84 - Math.sin(t * Math.PI) * 0.12, -1.5), i % 2 ? 0xff8a12 : 0xffc21a);
  }
  P.add(new SphereGeometry(0.025, 6, 4).translate(0.3, f + 1.7, -1.5), 0xf2e04a);
  for (let k = 0; k < 3; k++) P.add(new CylinderGeometry(0.005, 0.012, 0.07, 5).translate(0.3, f + 1.62 - k * 0.04, -1.5), 0x2f8a3e);
  void rand;
}

function rickshawCabin(P: Parts, C: number) {
  const f = -C;
  const frame = 0x2e6f3e;
  const canopy = 0xf5c518;
  // Footboard and the frame forward to the puller's saddle.
  box(P, 1.1, 0.04, 1.0, 0, f - 0.02, -0.15, 0x7a5230);
  bar(P, 0, f - 0.05, -0.6, 0, f + 0.62, -1.25, 0.04, frame);
  bar(P, 0, f + 0.62, -1.25, 0, f + 0.9, -1.95, 0.03, CHROME);
  // Passenger seat (higher than a chair; the road is half a metre lower too).
  box(P, 1.15, 0.36, 0.62, 0, f + 0.3, 0.72, 0xc9a26a);
  box(P, 1.15, 0.55, 0.1, 0, f + 0.72, 1.06, 0xc9a26a);
  for (const sx of [-1, 1]) {
    bar(P, sx * 0.6, f + 0.48, 0.45, sx * 0.6, f + 0.78, 0.95, 0.02, frame);
    bar(P, sx * 0.6, f + 0.78, 0.95, sx * 0.6, f + 0.78, 0.3, 0.02, frame);
  }
  // The front board over the table.
  ledge(P, C, 0x8a5a3a, frame, 1.2);
  // Folding hood: a canvas half-dome behind and over the head (like a pram's),
  // a dark bow along its front edge and its stays down to the armrests.
  const hood = new SphereGeometry(1.0, 14, 7, 0, Math.PI, 0, Math.PI / 2).scale(0.68, 1.0, 0.9).translate(0, f + 0.78, 0.92);
  P.add(hood, canopy);
  for (let i = 0; i < 12; i++) {
    const a0 = (i / 12) * Math.PI;
    const a1 = ((i + 1) / 12) * Math.PI;
    bar(P, -Math.cos(a0) * 0.68, f + 0.78 + Math.sin(a0) * 1.0, 0.92, -Math.cos(a1) * 0.68, f + 0.78 + Math.sin(a1) * 1.0, 0.92, 0.018, DARK);
  }
  for (const sx of [-1, 1]) bar(P, sx * 0.62, f + 0.78, 0.6, sx * 0.66, f + 1.3, 0.92, 0.012, DARK);
  // Puller's saddle and handlebar, the front wheel.
  box(P, 0.2, 0.06, 0.3, 0, f + 0.88, -1.2, 0x1a1a1a);
  bar(P, -0.3, f + 1.12, -1.95, 0.3, f + 1.12, -1.95, 0.016, CHROME);
  const wf = new TorusGeometry(0.42, 0.03, 5, 18).rotateY(Math.PI / 2).translate(0, f - ROAD_DROP.rickshaw + 0.42, -2.0);
  P.add(wf, 0x161616);
  bar(P, 0, f + 0.9, -1.95, 0, f - ROAD_DROP.rickshaw + 0.42, -2.0, 0.02, CHROME);
}

function busCabin(P: Parts, C: number) {
  const f = -C;
  // The user sits in the kerb-side window seat; the aisle is on their right.
  const xl = -0.66;
  const xr = 1.78;
  const z0 = -7.2;
  const z1 = 2.6;
  const cream = 0xe8e2d0;
  const grey = 0x8a9096;
  box(P, xr - xl, 0.04, z1 - z0, (xl + xr) / 2, f - 0.02, (z0 + z1) / 2, 0x5a5f66);
  box(P, xr - xl, 0.06, z1 - z0, (xl + xr) / 2, f + 2.28, (z0 + z1) / 2, 0xf2efe6);
  for (const x of [0.35, 1.35]) box(P, 0.12, 0.02, z1 - z0 - 0.4, x, f + 2.24, (z0 + z1) / 2, 0xfff4d0, 1);
  // Side walls: panel to the sill, pillars, the band above the windows.
  for (const [x, s] of [[xl, -1], [xr, 1]] as const) {
    box(P, 0.06, 0.95, z1 - z0, x, f + 0.475, (z0 + z1) / 2, cream);
    box(P, 0.08, 0.06, z1 - z0, x - s * 0.02, f + 0.97, (z0 + z1) / 2, grey);
    box(P, 0.06, 0.28, z1 - z0, x, f + 2.14, (z0 + z1) / 2, cream);
    for (let z = z0 + 0.4; z < z1; z += 1.15) {
      if (s > 0 && Math.abs(z - 0) < 0.7) continue;
      box(P, 0.07, 1.04, 0.1, x, f + 1.5, z, BUS_GREEN);
    }
  }
  // The rear door opposite the aisle beside the user: a frame and its steps.
  box(P, 0.08, 2.0, 0.08, xr, f + 1.0, -0.62, grey);
  box(P, 0.08, 2.0, 0.08, xr, f + 1.0, 0.62, grey);
  // Seats: the user's, the one in front over the table, then rows ahead (both sides).
  const seat = (x: number, z: number, w: number) => {
    box(P, w, 0.1, 0.46, x, f + 0.44, z, 0x3a5f8a);
    box(P, w, 0.62, 0.08, x, f + 0.78, z + 0.26, 0x3a5f8a);
    box(P, 0.05, 0.42, 0.05, x, f + 0.2, z, grey);
    bar(P, x - w / 2 + 0.04, f + 1.12, z + 0.3, x + w / 2 - 0.04, f + 1.12, z + 0.3, 0.014, CHROME);
  };
  box(P, 0.95, 0.1, 0.46, -0.06, f + 0.44, 0.72, 0x3a5f8a);
  box(P, 0.95, 0.7, 0.08, -0.06, f + 0.82, 0.98, 0x3a5f8a);
  // The seat back in front: its top just above the table, the table as its tray.
  ledge(P, C, 0x5a5f66, 0x3a5f8a, 1.0);
  box(P, 1.0, 0.3, 0.08, 0, 0.13, -0.47, 0x3a5f8a);
  bar(P, -0.45, 0.32, -0.45, 0.45, 0.32, -0.45, 0.014, CHROME);
  for (let z = -1.25; z > z0 + 1.2; z -= 0.82) {
    seat(-0.06, z, 0.95);
    seat(1.35, z - 0.1, 0.75);
  }
  seat(1.35, 0.72, 0.75);
  // Handrails along the aisle and poles at every other row.
  for (const x of [0.62, 1.05]) bar(P, x, f + 1.98, z0 + 0.6, x, f + 1.98, z1 - 0.3, 0.016, CHROME);
  for (let z = -0.9; z > z0 + 1; z -= 1.64) bar(P, 0.62, f, z, 0.62, f + 1.98, z, 0.016, CHROME);
  // The driver's cab far ahead: a partition, the dashboard and windscreen frame.
  box(P, xr - xl, 1.1, 0.06, (xl + xr) / 2, f + 0.55, z0 + 0.6, grey);
  box(P, xr - xl, 0.5, 0.5, (xl + xr) / 2, f + 1.0, z0 + 0.2, 0x2a2622);
  box(P, xr - xl, 0.12, 0.1, (xl + xr) / 2, f + 2.1, z0, BUS_GREEN);
  for (const x of [xl, (xl + xr) / 2, xr]) box(P, 0.1, 1.2, 0.1, x, f + 1.65, z0, BUS_GREEN);
  // Rear wall behind the user.
  box(P, xr - xl, 2.3, 0.06, (xl + xr) / 2, f + 1.15, z1, cream);
}
