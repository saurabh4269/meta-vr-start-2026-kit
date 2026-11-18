/**
 * Sadak VR street world: cel-shaded Old Delhi round the user's table, built
 * on the real street network.
 *
 * Ported and adapted from SADAK (game_engine/lib/game: buildings.ts, props.ts,
 * people.ts, materials.ts, fx/toon.ts, fx/celShader.ts, fx/sky.ts,
 * fx/presets.ts, world/*, assets/delhi.ts, signage.ts, clutter.ts,
 * districts.ts puraniSadak theme, rides.ts / transit.ts / world/route.ts for
 * the rides). SADAK authors: ahmedfahim21, Parth Mittal, Apoorva Agrawal,
 * Mardav Gandhi; reused with the owner's permission. The cel-shaded look is
 * adapted from sakura-crossing by Kenton Wang
 * (https://github.com/Kenton-GMI/sakura-crossing), MIT License,
 * Copyright (c) 2026 Kenton Wang. Map data (c) OpenStreetMap contributors,
 * ODbL 1.0 (via SADAK's compiled Purani Sadak map, see osm-data.ts).
 *
 * Implements src/world/types.ts. Street frame = SADAK's map frame (+x east,
 * +z south, ground y = 0). Each spot stands where SADAK puts its errand, with
 * its own neighbourhood (layout.ts); only the active one is shown.
 * `setActive` moves the whole group so the active counter top lands on the
 * anchor origin; `ride` moves it along a route while a cabin stays with the
 * user.
 */

import { Group, MathUtils, Matrix4, Mesh, Quaternion, Vector3, type Material, type ShaderMaterial, type WebGLRenderer } from '@iwsdk/core';
import type { AutoRig, RideHandle, RideKind, Spot, SpotId, StreetWorld } from './types.js';
import { U, celMaterial, flatColourMaterial, syncLights } from './cel.js';
import { createAtlas } from './atlas.js';
import { triCount } from './kit.js';
import { STAND_BACK, dressingMesh, makeSpotItems } from './spots.js';
import { makePersonRig, type PersonOptions } from './people.js';
import { HumanVendor } from './human.js';
import { makeCounter, type Counter } from './counter.js';
import { makeAutoRig, makeBusRig, type AutoModel } from './props.js';
import { buildSadakCity, hashId } from './sadak-city.js';
import { attireFor } from '../sadak-engine/lib/game/attire';
import { makeContactShadows } from './shadows.js';
import { SPOTS, toLocal, toWorld, type Pt } from './layout.js';
import { ROADS } from './osm-data.js';
import { Leg, MAX_YAW_RATE, RIDE_SPEED, cut, findRoute, keepLeft, smooth, type Pose } from './route.js';
import { ROAD_DROP, makeCabin, type Cabin } from './cabins.js';

const IDS: SpotId[] = ['kachori', 'flowers', 'auto', 'paranthe', 'bus', 'minaret'];

/** Each stall's counter: width (counter frame) and the colour its planks lean toward. */
const COUNTER_LOOK: Record<SpotId, { width: number; tint: number; trim: number }> = {
  kachori: { width: 1.42, tint: 0x2f7f8c, trim: 0x3a2a1e },
  flowers: { width: 1.42, tint: 0x8a3324, trim: 0x3a2a1e },
  auto: { width: 1.3, tint: 0x6a4a32, trim: 0x2e2218 },
  paranthe: { width: 1.42, tint: 0x6a3a7a, trim: 0x3a2a1e },
  bus: { width: 1.3, tint: 0xc9b48e, trim: 0x8a7a62 },
  minaret: { width: 1.3, tint: 0x6a3a26, trim: 0x2e2218 },
};

/** SADAK's errand ids, kinds and roles (lib/game/tasks.ts, the Purani Sadak pack). */
const SADAK_HOSTS: [SpotId, string, 'shop' | 'temple', string][] = [
  ['kachori', 'purani-sadak-shop', 'shop', 'Kachori Wallah'],
  ['flowers', 'purani-sadak-temple', 'temple', 'Flower Seller'],
  ['paranthe', 'purani-sadak-paranthe', 'shop', 'Paratha Wallah'],
  ['minaret', 'purani-sadak-minaret', 'temple', 'Masjid Caretaker'],
];

/** Raju's parked auto (SADAK parks it beside its host): ahead and to the right of the user, in view, in the auto spot's counter frame. */
const AUTO_PARK: Pt = [1.45, -1.3];
/** Bus centre when stopped: its rear door beside the user. */
const BUS_PARK: Pt = [2.4, -1.6];

const _m = new Matrix4();
const _q = new Quaternion();
const _v = new Vector3();
const _s = new Vector3(1, 1, 1);

/** Vendors: looks and standing heights. */
const VENDOR_BASE: Record<SpotId, PersonOptions> = {
  kachori: { preset: 'kurta_pyjama', seed: 7, height: 1.72, skin: 0xa9744f, cloth1: 0xf1e6cc, cloth2: 0xe6e0d0, female: false, headwear: 'short', moustache: true, kit: ['towel'], kitColour: 0xff7a1a, hair: 0x1c1712 },
  flowers: { preset: 'sari', seed: 12, height: 1.65, skin: 0x8d5524, cloth1: 0xe8364f, cloth2: 0xf2b631, female: true, headwear: 'bun', bindi: true, bangles: 0x1b9e5a, hair: 0x14100c },
  // The chai-stall man at the auto stand (Raju is the auto's driver).
  // Raju, SADAK's auto host: he waits beside his parked auto and takes the wheel for the ride.
  auto: { preset: 'shirt_trousers', seed: 5, height: 1.7, skin: 0x8a5a3a, cloth1: 0x8f8a76, cloth2: 0x35302a, female: false, headwear: 'short', moustache: true, kit: ['towel'], hair: 0x1a1410 },
  paranthe: { preset: 'kurta_pyjama', seed: 33, height: 1.68, skin: 0x8d5524, cloth1: 0xf2ece0, cloth2: 0x3a3a48, female: false, headwear: 'short', moustache: true, kit: ['towel'], kitColour: 0x9a4fd0, hair: 0x1a1410 },
  bus: { preset: 'shirt_trousers', seed: 44, height: 1.71, skin: 0xa9744f, cloth1: 0x7f9fc8, cloth2: 0x2c3340, female: false, headwear: 'short', moustache: true, carry: 'bag', hair: 0x14100c },
  minaret: { preset: 'kurta_pyjama', seed: 55, height: 1.7, skin: 0xa9744f, cloth1: 0xf4f1ea, cloth2: 0xf4f1ea, female: false, headwear: 'topi', headColour: 0xffffff, kit: ['angavastram'], kitColour: 0x19c3b0, hair: 0x2a231c, beard: 0x3a332a },
};
/** SADAK's errand hosts (lib/game/tasks.ts): role, kind and voice decide what they wear. */
const HOSTS: Record<SpotId, { task: string; role: string; kind: string; speaker: string }> = {
  auto: { task: 'purani-sadak-auto', role: 'Auto Driver', kind: 'auto', speaker: 'aditya' },
  kachori: { task: 'purani-sadak-shop', role: 'Kachori Wallah', kind: 'shop', speaker: 'rohan' },
  flowers: { task: 'purani-sadak-temple', role: 'Flower Seller', kind: 'temple', speaker: 'ritu' },
  bus: { task: 'purani-sadak-bus', role: 'Bus Conductor', kind: 'bus', speaker: 'shubh' },
  paranthe: { task: 'purani-sadak-paranthe', role: 'Paratha Wallah', kind: 'shop', speaker: 'vijay' },
  minaret: { task: 'purani-sadak-minaret', role: 'Masjid Caretaker', kind: 'temple', speaker: 'shubh' },
};

/**
 * Each vendor dressed by SADAK's own attireFor (preset, clothes, headwear,
 * work kit), on our VR rig (face, height, skin and hair stay the rig's).
 * Kit our rig lacks maps to the nearest it has: the conductor's ticket bag
 * to a shoulder bag, a skullcap to a white topi.
 */
function vendorLook(id: SpotId): PersonOptions {
  const h = HOSTS[id];
  const a = attireFor(h, 'delhi', hashId(h.task));
  const base = VENDOR_BASE[id];
  const headwear = a.headwear === 'skullcap' || a.headwear === 'cap' ? 'topi' : a.headwear === 'turban' ? 'topi' : a.headwear;
  const kit = (a.kit ?? []).filter((k): k is 'apron' | 'towel' | 'angavastram' => k === 'apron' || k === 'towel' || k === 'angavastram');
  return {
    ...base,
    preset: (a.preset ?? base.preset) as PersonOptions['preset'],
    female: a.female ?? base.female,
    cloth1: a.cloth1 ?? base.cloth1,
    cloth2: a.cloth2 ?? base.cloth2,
    headwear: headwear ?? base.headwear,
    headColour: a.headColour ?? base.headColour,
    kit,
    kitColour: a.kitColour,
    carry: a.kit?.includes('ticketBag') ? 'bag' : base.carry,
  };
}
const VENDORS = Object.fromEntries(IDS.map((id) => [id, vendorLook(id)])) as Record<SpotId, PersonOptions>;

/** Raju at the wheel (the auto ride): the same man as the auto spot's host. */
const RAJU: PersonOptions = VENDORS.auto;

const CHORES: Record<SpotId, [Vector3, 'stir' | 'thread' | 'pour']> = {
  kachori: [new Vector3(0.5, 0.1, STAND_BACK - 0.4), 'stir'],
  flowers: [new Vector3(0, 0.05, STAND_BACK - 0.3), 'thread'],
  auto: [new Vector3(0, 0.06, STAND_BACK - 0.3), 'thread'],
  paranthe: [new Vector3(0, 0.06, STAND_BACK - 0.3), 'thread'],
  bus: [new Vector3(0, 0.06, STAND_BACK - 0.3), 'thread'],
  minaret: [new Vector3(0, 0.05, STAND_BACK - 0.3), 'thread'],
};

/** A vehicle's track past a spot: a road polyline, offset to pass through the park point, oriented so travel at the park is the counter's -Z. */
function vehicleTrack(id: SpotId, park: Pt): { pts: Pt[]; sPark: number } {
  const [px, pz] = toWorld(id, park[0], park[1]);
  let best = { ri: -1, d: Infinity };
  ROADS.forEach((r, ri) => {
    if (r.cls === 'footway' || r.cls === 'steps') return;
    for (let i = 1; i < r.pts.length; i++) {
      const a = r.pts[i - 1];
      const b = r.pts[i];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const L2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (pz - a[1]) * dz) / L2));
      const d = Math.hypot(a[0] + dx * t - px, a[1] + dz * t - pz);
      if (d < best.d) best = { ri, d };
    }
  });
  let pts: Pt[] = ROADS[best.ri].pts.map((p) => [p[0], p[1]] as Pt);
  // Travel at the park point must be the counter's -Z.
  const s = SPOTS[id];
  const fx = -Math.sin(s.yaw);
  const fz = -Math.cos(s.yaw);
  const near = nearestParam(pts, px, pz);
  const seg = [pts[near.i + 1][0] - pts[near.i][0], pts[near.i + 1][1] - pts[near.i][1]];
  if (seg[0] * fx + seg[1] * fz < 0) pts = pts.reverse();
  // Extend both ends straight on by 60 m.
  const ext = (a: Pt, b: Pt): Pt => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [b[0] + ((b[0] - a[0]) / L) * 60, b[1] + ((b[1] - a[1]) / L) * 60];
  };
  pts = [ext(pts[1], pts[0]), ...pts, ext(pts[pts.length - 2], pts[pts.length - 1])];
  pts = smooth(pts, 1);
  // Lateral offset through the park point.
  const n = nearestParam(pts, px, pz);
  const a = pts[n.i];
  const b = pts[n.i + 1];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const left = ((px - n.x) * ((b[1] - a[1]) / L) - (pz - n.z) * ((b[0] - a[0]) / L));
  pts = keepLeft(pts, left);
  const m = nearestParam(pts, px, pz);
  return { pts, sPark: m.s };
}

function nearestParam(pts: Pt[], x: number, z: number): { i: number; s: number; x: number; z: number } {
  let best = { i: 0, s: 0, d: Infinity, x: 0, z: 0 };
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const L = Math.hypot(dx, dz) || 1;
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (L * L)));
    const qx = a[0] + dx * t;
    const qz = a[1] + dz * t;
    const d = Math.hypot(qx - x, qz - z);
    if (d < best.d) best = { i, s: acc + L * t, d, x: qx, z: qz };
    acc += L;
  }
  return best;
}

function sampleTrack(pts: Pt[], s: number, out: Pose): Pose {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + seg >= s || i === pts.length - 1) {
      const t = seg ? Math.max(0, Math.min(1, (s - acc) / seg)) : 0;
      out.x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t;
      out.z = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
      out.dx = (pts[i][0] - pts[i - 1][0]) / (seg || 1);
      out.dz = (pts[i][1] - pts[i - 1][1]) / (seg || 1);
      return out;
    }
    acc += seg;
  }
  return out;
}

/* ------------------------------------------------------------------ */

export function buildStreet(renderer: WebGLRenderer | null = null): StreetWorld {
  const group = new Group();
  group.name = 'street';
  const atlas = createAtlas();

  const worldMat = celMaterial({ name: 'street', vertexColors: true, glow: true, atlas: atlas.texture, flat: true });
  const foodMat = celMaterial({ name: 'goods', vertexColors: true, glow: true, atlas: atlas.texture, flat: false });
  const peopleMat = celMaterial({ name: 'people', vertexColors: true, glow: true, atlas: atlas.texture, flat: false });
  const vehicleMat = celMaterial({ name: 'vehicles', vertexColors: true, glow: true, atlas: atlas.texture, flat: true, doubleSided: true });
  const backdropMat = flatColourMaterial({ vertexColors: true, atlas: atlas.texture, alphaTest: true, doubleSided: true, fog: 0.4 });
  const birdMat = celMaterial({ name: 'birds', vertexColors: true, glow: true, atlas: atlas.texture, flat: true, doubleSided: true });
  const kiteMat = flatColourMaterial({ vertexColors: true, atlas: atlas.texture, doubleSided: true, fog: 0.5 });
  const materials: Material[] = [worldMat, foodMat, peopleMat, vehicleMat, backdropMat, birdMat, kiteMat];

  // ---- lights: created once; the street's materials read them via uniforms ----
  // SADAK's own city (its code, map, theme, sky and lights): sadak-city.ts.
  const city = buildSadakCity(renderer);
  group.add(city.group);
  const { sun, hemi } = city;
  const ground = (id: SpotId) => city.groundAt(SPOTS[id].x, SPOTS[id].z);
  // The host errands stand where SADAK's engine stands their hosts (the auto
  // and the bus keep their kerbside spots, which the vehicles' tracks need).
  for (const [id, task, kind, role] of SADAK_HOSTS) {
    const p = city.placeHost(task, kind, role, STAND_BACK);
    Object.assign(SPOTS[id], { x: p.x, z: p.z, yaw: p.yaw });
  }

  const shadows = makeContactShadows(atlas.rect('shadow'));
  (shadows.mesh.material as ShaderMaterial).uniforms.uAtlas.value = atlas.texture;
  group.add(shadows.mesh);

  // ---- spots ----
  let tableH = 0.74;
  const realCounters = {} as Record<SpotId, Counter>;
  const spots = {} as Record<SpotId, Spot>;
  const dressings = {} as Record<SpotId, Mesh>;
  const vendors = {} as Record<SpotId, HumanVendor>;
  let active: SpotId = 'kachori';
  const anchorMatrix = () => group.parent?.matrixWorld ?? spots[active].counter.matrixWorld;
  IDS.forEach((id, i) => {
    const s = SPOTS[id];
    const counter = new Group();
    counter.name = `counter-${id}`;
    counter.position.set(s.x, ground(id) + tableH, s.z);
    counter.rotation.y = s.yaw;
    counter.visible = false;
    group.add(counter);
    // The counter on the user's real table: real wood, tinted toward the stall's colour (counter.ts).
    const real = makeCounter(COUNTER_LOOK[id], tableH);
    counter.add(real.group);
    realCounters[id] = real;
    const dressing = dressingMesh(id, atlas, tableH, worldMat);
    counter.add(dressing);
    dressings[id] = dressing;
    // A real character (tools/humans/build_character.py) with mocap and procedural layers (human.ts).
    const v = new HumanVendor({ id, counter, anchorMatrix, seed: 3 + i * 5, standBack: STAND_BACK });
    v.root.position.set(0, -tableH, -STAND_BACK);
    v.counterY = tableH;
    if (id !== 'bus') counter.add(v.root);
    vendors[id] = v;
    const parts = makeSpotItems(id, foodMat, counter);
    spots[id] = { id, counter, vendor: v, items: parts.items, plate: parts.plate };
    if (id !== 'bus') shadows.follow(v.root, 0.32, 0.26, 0.8);
  });

  // ---- vehicles: the auto (Raju driving) and the bus (Suresh at its door) ----
  type VehicleState = 'away' | 'arriving' | 'parked' | 'leaving';
  const makeVehicle = (id: SpotId, model: AutoModel, park: Pt, wheels: string[], wheelR: number, behind: number, ahead: number, arriveT: number, leaveT: number, swing: number) => {
    const root = new Group();
    root.name = `${model.mesh.name}-rig`;
    root.add(model.mesh);
    root.visible = false;
    spots[id].counter.add(root);
    const track = vehicleTrack(id, park);
    let state: VehicleState = 'away';
    let t = 0;
    let s = track.sPark - behind;
    let lastS = s;
    const pose: Pose = { x: 0, z: 0, dx: 0, dz: 1, v: 0 };
    const place = (sNow: number, side: number, pitch: number) => {
      sampleTrack(track.pts, sNow, pose);
      // Swing out toward the road's middle (the right of travel).
      const x = pose.x - pose.dz * side;
      const z = pose.z + pose.dx * side;
      const [lx, lz] = toLocal(id, x, z);
      const yaw = SPOTS[id].yaw;
      const c = Math.cos(yaw);
      const n = Math.sin(yaw);
      const ldx = pose.dx * c - pose.dz * n;
      const ldz = pose.dx * n + pose.dz * c;
      root.position.set(lx, -tableH, lz);
      root.rotation.set(0, Math.atan2(ldx, ldz), 0);
      model.bones.body.rotation.x = pitch;
    };
    const rig: AutoRig & { reset(): void; hideForRide(): void } = {
      root,
      arrive() {
        state = 'arriving';
        t = 0;
        root.visible = true;
      },
      leave() {
        if (state === 'away') return;
        state = 'leaving';
        t = 0;
      },
      get parked() {
        return state === 'parked';
      },
      update(dt: number) {
        if (state === 'away') return;
        t += dt;
        let side = 0;
        let pitch = 0;
        if (state === 'arriving') {
          const p = MathUtils.clamp(t / arriveT, 0, 1);
          const e = 1 - (1 - p) ** 3;
          s = track.sPark - behind * (1 - e);
          side = (1 - e) * swing;
          pitch = p > 0.6 ? Math.sin(((p - 0.6) / 0.4) * Math.PI) * 0.025 : 0;
          if (p >= 1) state = 'parked';
        } else if (state === 'leaving') {
          const p = MathUtils.clamp(t / leaveT, 0, 1);
          const e = p * p;
          s = track.sPark + ahead * e;
          side = e * swing * 0.7;
          pitch = -Math.sin(Math.min(1, p * 2.5) * Math.PI) * 0.02;
          if (p >= 1) {
            state = 'away';
            root.visible = false;
          }
        } else {
          s = track.sPark;
          pitch = Math.sin(t * 47) * 0.002;
        }
        const spin = (s - lastS) / wheelR;
        lastS = s;
        for (const w of wheels) model.bones[w].rotation.x += spin;
        place(s, side, pitch);
      },
      park() {
        state = 'parked';
        t = 0;
        s = track.sPark;
        lastS = s;
        root.visible = true;
        place(s, 0, 0);
      },
      reset() {
        state = 'away';
        root.visible = false;
      },
      hideForRide() {
        root.visible = false;
        state = 'away';
      },
    };
    place(s, swing, 0);
    return rig;
  };

  const autoModel = makeAutoRig(vehicleMat);
  const driver = makePersonRig({ ...RAJU, lod: 0 }, peopleMat);
  driver.mesh.name = 'auto-driver';
  driver.mesh.position.set(0, 0.99 - driver.dims.hipY * driver.dims.scale, 0.3);
  autoModel.mesh.add(driver.mesh);
  // engine.ts seatDriver(...).visible = false: the seat stays empty while Raju waits beside it.
  driver.mesh.visible = false;
  {
    const b = driver.bones;
    b.hipL.rotation.x = -1.45;
    b.hipR.rotation.x = -1.45;
    b.kneeL.rotation.x = 1.5;
    b.kneeR.rotation.x = 1.5;
    b.shoulderL.rotation.set(-0.95, 0, 0.12);
    b.shoulderR.rotation.set(-0.95, 0, -0.12);
    b.elbowL.rotation.x = -0.45;
    b.elbowR.rotation.x = -0.45;
    b.spine.rotation.x = 0.08;
  }
  const auto = makeVehicle('auto', autoModel, AUTO_PARK, ['wheelF', 'wheelL', 'wheelR'], 0.33, 18, 32, 2.2, 2.2, 1.1);
  shadows.follow(auto.root, 0.85, 1.45, 0.85);

  const busModel = makeBusRig(vehicleMat, atlas.rect('sign:route'));
  const bus = makeVehicle('bus', busModel, BUS_PARK, ['wheelFL', 'wheelFR', 'wheelRL', 'wheelRR'], 0.5, 34, 50, 3.4, 3.2, 1.4);
  // Suresh rides in the rear door, on its step, facing out (the user).
  const suresh = vendors.bus;
  suresh.root.position.set(1.02, 0.36, -1.6);
  suresh.root.rotation.y = Math.PI / 2;
  busModel.mesh.add(suresh.root);
  shadows.follow(bus.root, 1.3, 5.6, 0.8);

  // ---- ride cabins (built in the anchor frame; see `pin` below) ----
  const cabins: Record<RideKind, Cabin> = {
    rickshaw: makeCabin('rickshaw', vehicleMat, peopleMat, tableH, RAJU),
    auto: makeCabin('auto', vehicleMat, peopleMat, tableH, RAJU),
    bus: makeCabin('bus', vehicleMat, peopleMat, tableH, VENDORS.bus),
  };
  const cabinPin = new Group();
  cabinPin.name = 'cabin-pin';
  group.add(cabinPin);
  for (const k of Object.keys(cabins) as RideKind[]) cabinPin.add(cabins[k].group);

  // ---- placement ----
  /** Street-frame matrix of the user's frame (the anchor). */
  const userMatrix = new Matrix4();
  const showHood = (id: SpotId) => {
    shadows.clearStatics();
    const s = SPOTS[id];
    const [sx, sz] = toWorld(id, 0, -0.14);
    shadows.addStatic(sx, sz, id === 'auto' || id === 'bus' || id === 'minaret' ? 0.95 : 1.0, 0.6, s.yaw, 0.6);
  };
  let shownHood: SpotId | null = null;
  const applyUser = () => {
    _m.copy(userMatrix).invert();
    _m.decompose(group.position, group.quaternion, group.scale);
    cabinPin.position.setFromMatrixPosition(userMatrix);
    cabinPin.quaternion.setFromRotationMatrix(userMatrix);
    _v.setFromMatrixPosition(userMatrix);
    city.sky.sky.position.set(_v.x, 0, _v.z);
  };
  const place = () => {
    for (const id of IDS) {
      const s = spots[id];
      s.counter.position.y = ground(id) + tableH;
      s.counter.visible = id === active && !ride;
      vendors[id].root.position.y = id === 'bus' ? 0.36 : -tableH;
      vendors[id].counterY = id === 'bus' ? tableH - 0.36 : tableH;
    }
    if (shownHood !== active) {
      showHood(active);
      shownHood = active;
    }
    const c = spots[active].counter;
    c.updateMatrix();
    userMatrix.copy(c.matrix);
    applyUser();
  };

  // ---- reveal: the director's radius, narrowed while a ride cuts between places ----
  let revealRaw = 100;
  let rideReveal = Infinity;
  const applyReveal = () => {
    const raw = Math.min(revealRaw, rideReveal);
    group.visible = revealRaw > 0.001;
    city.setSkyVisible(raw >= 59.9);
    U.uRevealRaw.value = raw;
    U.uRevealRadius.value = raw >= 59.9 ? 1e9 : raw < 30 ? raw : raw / Math.max(1e-3, 1 - MathUtils.smoothstep(raw, 30, 60));
    U.uRevealBand.value = MathUtils.clamp(0.04 + raw * 0.025, 0.05, 0.6);
    U.uRevealGlow.value.setHex(0xffa21a).multiplyScalar(2.2 * (1 - MathUtils.smoothstep(raw, 45, 60)));
  };
  const setReveal = (r: number) => {
    revealRaw = Math.max(0, r);
    applyReveal();
  };

  // ---- rides ----
  type RideState = {
    kind: RideKind;
    from: SpotId;
    to: SpotId;
    legs: [Leg, Leg];
    /** Timeline marks (s). */
    t: number;
    tStart: number;
    tCut: number;
    tEnd: number;
    total: number;
    stage: 0 | 1 | 2 | 3;
    pose: Pose;
    lastYaw: number;
    yawRate: number;
    userYaw: number;
    snap: boolean;
    handle: RideHandle & { _done: boolean };
  };
  let ride: RideState | null = null;
  const CLOSE = 0.6;
  const RIDE_R = 2.6;
  const LEG_T: Record<RideKind, [number, number]> = { rickshaw: [6, 8], auto: [5, 6], bus: [6, 8] };

  const poseUser = (p: Pose, kind: RideKind) => {
    const yaw = Math.atan2(-p.dx, -p.dz);
    _q.setFromAxisAngle(_v.set(0, 1, 0), yaw);
    userMatrix.compose(_v.set(p.x, city.groundAt(p.x, p.z) + tableH + ROAD_DROP[kind], p.z), _q, _s);
    applyUser();
  };

  const finishRide = () => {
    if (!ride) return;
    const r = ride;
    ride = null;
    cabins[r.kind].group.visible = false;
    rideReveal = Infinity;
    applyReveal();
    r.handle._done = true;
    active = r.to;
    shownHood = null;
    place();
  };

  const startRide = (to: SpotId, kind: RideKind): RideHandle => {
    if (ride) finishRide();
    const from = active;
    if (to === from) {
      place();
      return { progress: 1, done: true, skip() {} };
    }
    // Start where the user is about to sit: in the parked auto or bus, else by the counter.
    let start: Pt = [SPOTS[from].x, SPOTS[from].z];
    if (kind === 'auto' && from === 'auto') start = toWorld('auto', AUTO_PARK[0], AUTO_PARK[1]);
    if (kind === 'bus' && from === 'bus') start = toWorld('bus', BUS_PARK[0], BUS_PARK[1]);
    const end: Pt = [SPOTS[to].x, SPOTS[to].z];
    const vmax = RIDE_SPEED[kind];
    const path = smooth(keepLeft(findRoute(kind, start[0], start[1], end[0], end[1]), kind === 'bus' ? 1.6 : 1.0), 1);
    let L = 0;
    for (let i = 1; i < path.length; i++) L += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    // Out of `from` for ~7 s, a cut under the reveal, into `to` for ~9 s.
    const dist = (T: number) => Math.max(4, vmax * T - (vmax * vmax) / (2 * 0.9));
    let d1 = dist(LEG_T[kind][0]);
    let d2 = dist(LEG_T[kind][1]);
    if (d1 + d2 > L) {
      d1 = L * 0.45;
      d2 = L - d1;
    }
    const leg1 = new Leg(cut(path, 0, d1), vmax, 0, vmax);
    const leg2 = new Leg(cut(path, L - d2, L), vmax, vmax, 0);
    const tStart = CLOSE;
    const tCut = tStart + leg1.duration;
    const tEnd = tCut + leg2.duration;
    const total = tEnd + 0.4 + CLOSE * 2;
    const handle = {
      _done: false,
      get progress(): number {
        return ride && ride.handle === handle ? Math.min(1, ride.t / ride.total) : 1;
      },
      get done(): boolean {
        return handle._done;
      },
      skip() {
        if (ride && ride.handle === handle) finishRide();
      },
    };
    ride = { kind, from, to, legs: [leg1, leg2], t: 0, tStart, tCut, tEnd, total, stage: 0, pose: { x: 0, z: 0, dx: 0, dz: 1, v: 0 }, lastYaw: 0, yawRate: 0, userYaw: 0, snap: true, handle };
    return handle;
  };

  const updateRide = (dt: number, time: number) => {
    const r = ride;
    if (!r) return;
    r.t += dt;
    const t = r.t;
    // Reveal: close before each switch, open after.
    const dip = (at: number) => {
      const d = Math.abs(t - at);
      return d >= CLOSE ? Infinity : RIDE_R + (60 - RIDE_R) * MathUtils.smoothstep(d / CLOSE, 0, 1) ** 2;
    };
    const tFinal = r.tEnd + 0.4 + CLOSE;
    rideReveal = Math.min(dip(r.tStart), dip(r.tCut), dip(tFinal));
    if (rideReveal >= 59) rideReveal = Infinity;
    applyReveal();
    if (r.stage === 0 && t >= r.tStart) {
      // Board: the counter and any parked vehicle go, the cabin comes.
      r.stage = 1;
      spots[r.from].counter.visible = false;
      if (r.from === 'auto') auto.hideForRide();
      if (r.from === 'bus') bus.hideForRide();
      cabins[r.kind].group.visible = true;
    }
    if (r.stage === 1 && t >= r.tCut) {
      r.stage = 2;
      r.snap = true;
      active = r.to;
      showHood(r.to);
      shownHood = r.to;
    }
    if (r.stage >= 1 && r.stage < 3) {
      const leg = r.stage === 1 ? r.legs[0] : r.legs[1];
      leg.at(r.stage === 1 ? t - r.tStart : t - r.tCut, r.pose);
      const yaw = Math.atan2(r.pose.dx, r.pose.dz);
      let dy = yaw - r.lastYaw;
      if (dy > Math.PI) dy -= Math.PI * 2;
      if (dy < -Math.PI) dy += Math.PI * 2;
      r.yawRate += ((dt > 0 ? dy / dt : 0) - r.yawRate) * Math.min(1, dt * 4);
      r.lastYaw = yaw;
      // Hold the user's yaw rate under the cap whatever the path does.
      if (r.snap) {
        r.userYaw = yaw;
        r.snap = false;
      } else {
        let d = yaw - r.userYaw;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        const cap = MAX_YAW_RATE * dt;
        r.userYaw += Math.max(-cap, Math.min(cap, d));
      }
      r.pose.dx = Math.sin(r.userYaw);
      r.pose.dz = Math.cos(r.userYaw);
      poseUser(r.pose, r.kind);
      cabins[r.kind].update(dt, time, r.pose.v, MathUtils.clamp(r.yawRate, -0.5, 0.5));
    }
    if (r.stage < 3 && t >= tFinal) {
      r.stage = 3;
      finishRide();
    }
  };

  setReveal(100);
  place();

  const world: StreetWorld & { bus: AutoRig } = {
    group,
    spots,
    auto,
    bus,
    setTableHeight(h: number) {
      tableH = MathUtils.clamp(h, 0.4, 1.2);
      for (const id of IDS) realCounters[id].setHeight(tableH);
      for (const id of IDS) {
        const old = dressings[id];
        const next = dressingMesh(id, atlas, tableH, worldMat);
        old.parent?.add(next);
        old.removeFromParent();
        old.geometry.dispose();
        dressings[id] = next;
      }
      for (const k of Object.keys(cabins) as RideKind[]) cabins[k].rebuild(tableH);
      place();
    },
    setReveal,
    setActive(id: SpotId) {
      if (ride) {
        const r = ride;
        ride = null;
        cabins[r.kind].group.visible = false;
        rideReveal = Infinity;
        applyReveal();
        r.handle._done = true;
      }
      active = id;
      place();
    },
    ride(to: SpotId, kind: RideKind) {
      return startRide(to, kind);
    },
    update(dt: number, time: number) {
      U.uTime.value = time;
      // Vendors and vehicles keep time even while hidden, so a gesture or an
      // arrival started under passthrough is where it should be on reveal.
      for (const id of IDS) vendors[id].update(dt, time);
      auto.update(dt, time);
      bus.update(dt, time);
      updateRide(dt, time);
      // Suresh only exists with his bus.
      suresh.root.visible = bus.root.visible;
      if (!group.visible) return;
      // Reveal sphere centre = the user's frame origin (the anchor), in world space.
      cabinPin.getWorldPosition(U.uRevealCenter.value);
      syncLights(sun, hemi);
      _v.setFromMatrixPosition(userMatrix);
      city.update(dt, time, _v.x, _v.z);
      shadows.update(group);
    },
  };
  // Debug and preview hooks (not part of the contract).
  group.userData.world = {
    materials,
    sun,
    hemi,
    atlas,
    city,
    cabins,
    rideInfo: () => (ride ? { kind: ride.kind, t: ride.t, total: ride.total, legs: ride.legs.map((l) => ({ length: l.length, duration: l.duration })) } : null),
    tris: () => {
      let n = 0;
      group.traverse((o) => {
        const m = o as Mesh;
        if (m.isMesh && m.visible) n += triCount(m.geometry) * ((o as unknown as { count?: number }).count ?? 1);
      });
      return n;
    },
    revealRaw: () => revealRaw,
  };
  return world;
}
