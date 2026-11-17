/**
 * Ambient life: passers-by, a cycle rickshaw, pigeons and kites.
 *
 * Pigeon geometry and flight after SADAK's world/birds.ts (`pigeonGeometry`,
 * circling with a scale-x wing flap); people from people.ts. Authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission. Everything here is cheap: crowd rigs are ~2k triangles and one
 * draw call each, birds and kites are one InstancedMesh each, and nothing
 * allocates per frame.
 */

import { BoxGeometry, Color, DoubleSide, Group, IcosahedronGeometry, InstancedMesh, Object3D, type Material, type ShaderMaterial } from '@iwsdk/core';
import { Parts, mulberry32, pick } from './kit.js';
import { makePersonRig, poseWalk, type PersonPreset, type PersonRig } from './people.js';
import { makeRickshawRig, type AutoModel } from './props.js';

type Walker = { rig: PersonRig; root: Group; path: Pt[] | null; len: number; s: number; speed: number; dir: 1 | -1; phase: number };
type Stander = { rig: PersonRig; root: Group; seed: number; look: number };
export type Pt = [number, number];

function plen(p: Pt[]): number {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return L;
}

/** Position and heading at arc length s along p. */
function along(p: Pt[], s: number, out: { x: number; z: number; dx: number; dz: number }) {
  let acc = 0;
  for (let i = 1; i < p.length; i++) {
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (acc + seg >= s || i === p.length - 1) {
      const t = seg ? Math.max(0, Math.min(1, (s - acc) / seg)) : 0;
      out.x = p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t;
      out.z = p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t;
      out.dx = (p[i][0] - p[i - 1][0]) / (seg || 1);
      out.dz = (p[i][1] - p[i - 1][1]) / (seg || 1);
      return out;
    }
    acc += seg;
  }
  return out;
}

const PRESETS: PersonPreset[] = ['sari', 'salwar_kameez', 'kurta_pyjama', 'shirt_trousers', 'shirt_trousers', 'lungi', 'kurta_pyjama', 'salwar_kameez'];

export type Life = {
  group: Group;
  update(dt: number, t: number): void;
  tris: number;
  /** Things that want a contact shadow: object, radius across, radius along. */
  movers: { obj: Object3D; rx: number; rz: number }[];
  /** Re-home the crowd, the rickshaw and the birds round a spot (world = street frame). */
  setHood(walks: Pt[][], ride: Pt[] | null, cx: number, cz: number): void;
};

export function makeLife(peopleMat: Material, vehicleMat: Material, birdMat: ShaderMaterial, kiteMat: ShaderMaterial): Life {
  const group = new Group();
  group.name = 'street-life';
  const rand = mulberry32(2024);
  let tris = 0;

  // ---- walkers: along the walking lines of the active spot's streets ----
  const walkers: Walker[] = [];
  for (let i = 0; i < 8; i++) {
    const rig = makePersonRig({ preset: PRESETS[i % PRESETS.length], seed: 300 + i * 17, lod: 1, height: 1.55 + rand() * 0.25, carry: rand() < 0.3 ? (rand() < 0.5 ? 'bundle' : 'bag') : 'none' }, peopleMat);
    tris += rig.tris;
    const root = new Group();
    root.add(rig.mesh);
    rig.bones.hips.userData.baseY = rig.bones.hips.position.y;
    group.add(root);
    walkers.push({ rig, root, path: null, len: 0, s: 0, speed: 0.95 + rand() * 0.45, dir: i % 2 ? 1 : -1, phase: rand() * 6 });
  }

  // ---- standers: shoppers loitering by the walking lines ----
  const standers: Stander[] = [];
  const sPresets: PersonPreset[] = ['salwar_kameez', 'sari', 'kurta_pyjama'];
  sPresets.forEach((preset, i) => {
    const rig = makePersonRig({ preset, seed: 500 + i * 31, lod: 1, height: 1.58 + rand() * 0.2 }, peopleMat);
    tris += rig.tris;
    const root = new Group();
    root.add(rig.mesh);
    rig.bones.hips.userData.baseY = rig.bones.hips.position.y;
    group.add(root);
    standers.push({ rig, root, seed: i * 1.7, look: 0 });
  });

  // ---- a cycle rickshaw with its puller, up and down the road ----
  const rick: AutoModel = makeRickshawRig(vehicleMat, 7);
  tris += rick.tris;
  const rickRoot = new Group();
  rickRoot.add(rick.mesh);
  const puller = makePersonRig({ preset: 'kurta_pyjama', seed: 911, lod: 1, height: 1.62, cloth1: 0xe8dcc0, headwear: 'short' }, peopleMat);
  tris += puller.tris;
  puller.mesh.position.set(0, 0.98 - puller.dims.hipY * puller.dims.scale, 1.1);
  rickRoot.add(puller.mesh);
  puller.bones.hips.userData.baseY = puller.bones.hips.position.y;
  group.add(rickRoot);
  let rickPath: Pt[] | null = null;
  let rickLen = 0;
  let rickS = 0;
  let rickDir = 1;
  const pose = { x: 0, z: 0, dx: 0, dz: 1 };
  let birdCx = 0;
  let birdCz = 0;

  // ---- pigeons: two flocks wheeling over the street ----
  const pigeon = new Parts();
  pigeon.add(new IcosahedronGeometry(0.12, 0).scale(1, 0.85, 1.6).translate(0, 0.14, 0), 0xffffff);
  pigeon.add(new IcosahedronGeometry(0.065, 0).translate(0, 0.25, 0.16), 0xffffff);
  pigeon.add(new BoxGeometry(0.03, 0.02, 0.05).translate(0, 0.24, 0.23), 0xe0a060);
  pigeon.add(new BoxGeometry(0.12, 0.02, 0.12).translate(0, 0.15, -0.2), 0xffffff);
  for (const s of [1, -1]) pigeon.add(new BoxGeometry(0.34, 0.02, 0.16).translate(s * 0.2, 0.17, 0), 0xffffff);
  const pgeo = pigeon.geometry().scale(1.4, 1.4, 1.4);
  const BIRDS = 20;
  const birds = new InstancedMesh(pgeo, birdMat, BIRDS);
  birds.name = 'pigeons';
  birds.frustumCulled = false;
  const BIRD_COL = [0x7c7f8a, 0x7c7f8a, 0x6d7280, 0x8b8e98, 0xefefef, 0x8a7563];
  const col = new Color();
  const birdState: { cx: number; cz: number; r: number; alt: number; speed: number; phase: number; a: number }[] = [];
  for (let i = 0; i < BIRDS; i++) {
    birds.setColorAt(i, col.setHex(pick(BIRD_COL, rand)));
    const flock = i < 12 ? 0 : 1;
    birdState.push({
      cx: flock === 0 ? -4 : -30,
      cz: flock === 0 ? 2 : 10,
      r: 7 + rand() * 6,
      alt: (flock === 0 ? 15 : 22) + rand() * 5,
      speed: (0.32 + rand() * 0.18) * (flock === 0 ? 1 : -1),
      phase: rand() * 10,
      a: rand() * Math.PI * 2,
    });
  }
  group.add(birds);
  tris += Math.round((pgeo.attributes.position.count / 3) * BIRDS);

  // ---- kites high over the rooftops ----
  const kite = new Parts();
  // A patang: a diamond with a cross spar and a short tail.
  kite.add(new BoxGeometry(0.62, 0.62, 0.01).rotateZ(Math.PI / 4).scale(1, 1.15, 1), 0xffffff);
  kite.add(new BoxGeometry(0.04, 0.08, 0.012).translate(0, -0.52, 0), 0xffffff);
  kite.add(new BoxGeometry(0.02, 0.4, 0.012).translate(0, -0.75, 0), 0xffffff);
  const kgeo = kite.geometry();
  const KITES = 6;
  const kites = new InstancedMesh(kgeo, kiteMat, KITES);
  kites.name = 'kites';
  kites.frustumCulled = false;
  (kiteMat as ShaderMaterial).side = DoubleSide;
  const kiteState: { x: number; y: number; z: number; ph: number }[] = [];
  const KITE_COL = [0xe8364f, 0xffc21a, 0x2f6fb3, 0x1fbf6b, 0xff7a1a, 0x7b2d8b];
  for (let i = 0; i < KITES; i++) {
    kites.setColorAt(i, col.setHex(KITE_COL[i]));
    kiteState.push({ x: -48 + i * 18 + rand() * 6, y: 32 + rand() * 18, z: (rand() - 0.5) * 50, ph: rand() * 6 });
  }
  group.add(kites);
  tris += Math.round((kgeo.attributes.position.count / 3) * KITES);

  const dummy = new Object3D();

  function update(dt: number, t: number) {
    for (const w of walkers) {
      if (!w.path) continue;
      w.s += w.dir * w.speed * dt;
      if (w.s > w.len) w.s -= w.len;
      if (w.s < 0) w.s += w.len;
      along(w.path, w.s, pose);
      w.phase += dt * w.speed * 5.2;
      w.root.position.set(pose.x, 0, pose.z);
      w.root.rotation.y = Math.atan2(pose.dx * w.dir, pose.dz * w.dir);
      poseWalk(w.rig.bones, w.phase, 1, t);
      w.rig.bones.head.rotation.y = Math.sin(t * 0.4 + w.phase * 0.01) * 0.25;
    }
    for (const s of standers) {
      poseWalk(s.rig.bones, 0, 0, t + s.seed);
      s.rig.bones.head.rotation.y = Math.sin(t * 0.3 + s.seed) * 0.5;
      s.rig.bones.head.rotation.x = 0.08 + Math.sin(t * 0.21 + s.seed) * 0.08;
    }
    // Rickshaw: slow, up and down its carriageway; wheels turn, the puller pedals.
    if (rickPath) {
      rickS += rickDir * dt * 2.1;
      if (rickS > rickLen) (rickS = rickLen), (rickDir = -1);
      if (rickS < 0) (rickS = 0), (rickDir = 1);
      along(rickPath, rickS, pose);
      // Keep left: offset to the left of travel on the way back.
      const o = rickDir > 0 ? 0 : 2.8;
      rickRoot.position.set(pose.x + pose.dz * o, 0, pose.z - pose.dx * o);
      rickRoot.rotation.y = Math.atan2(pose.dx * rickDir, pose.dz * rickDir);
    }
    const spin = rickS / 0.44;
    rick.bones.wheelF.rotation.x = spin;
    rick.bones.wheelL.rotation.x = spin * 0.9;
    rick.bones.wheelR.rotation.x = spin * 0.9;
    const pb = puller.bones;
    const ped = t * 5;
    pb.hipL.rotation.x = -1.2 + Math.sin(ped) * 0.35;
    pb.hipR.rotation.x = -1.2 - Math.sin(ped) * 0.35;
    pb.kneeL.rotation.x = 1.3 - Math.sin(ped) * 0.4;
    pb.kneeR.rotation.x = 1.3 + Math.sin(ped) * 0.4;
    pb.spine.rotation.x = 0.35;
    pb.shoulderL.rotation.set(-0.9, 0, 0.1);
    pb.shoulderR.rotation.set(-0.9, 0, -0.1);
    pb.elbowL.rotation.x = -0.4;
    pb.elbowR.rotation.x = -0.4;
    // Birds wheel and flap.
    for (let i = 0; i < BIRDS; i++) {
      const b = birdState[i];
      b.a += b.speed * dt;
      const x = birdCx + b.cx + Math.cos(b.a) * b.r;
      const z = birdCz + b.cz + Math.sin(b.a) * b.r;
      const y = b.alt + Math.sin(t * 0.7 + b.phase) * 1.2;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, -b.a + (b.speed > 0 ? Math.PI : 0), -Math.sign(b.speed) * 0.35);
      dummy.scale.set(0.55 + 0.45 * Math.abs(Math.sin(t * 11 + b.phase)), 1, 1);
      dummy.updateMatrix();
      birds.setMatrixAt(i, dummy.matrix);
    }
    birds.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < KITES; i++) {
      const k = kiteState[i];
      dummy.position.set(birdCx + k.x + Math.sin(t * 0.3 + k.ph) * 1.5, k.y + Math.sin(t * 0.5 + k.ph) * 0.8, birdCz + k.z);
      dummy.rotation.set(0.25 + Math.sin(t * 0.9 + k.ph) * 0.12, Math.sin(t * 0.2 + k.ph) * 0.6, Math.sin(t * 1.3 + k.ph) * 0.35);
      dummy.scale.setScalar(1.6);
      dummy.updateMatrix();
      kites.setMatrixAt(i, dummy.matrix);
    }
    kites.instanceMatrix.needsUpdate = true;
  }
  update(0, 0);
  const movers = [
    ...walkers.map((w) => ({ obj: w.root as Object3D, rx: 0.3, rz: 0.26 })),
    ...standers.map((s) => ({ obj: s.root as Object3D, rx: 0.3, rz: 0.26 })),
    { obj: rickRoot as Object3D, rx: 0.75, rz: 1.5 },
  ];
  function setHood(walks: Pt[][], ride: Pt[] | null, cx: number, cz: number) {
    birdCx = cx;
    birdCz = cz;
    const usable = walks.filter((w) => plen(w) > 8);
    walkers.forEach((w, i) => {
      const p = usable.length ? usable[i % usable.length] : null;
      w.path = p;
      w.len = p ? plen(p) : 0;
      w.s = rand() * w.len;
      w.root.visible = !!p;
    });
    // Standers at the far ends of the walking lines, facing across them.
    standers.forEach((st, i) => {
      const p = usable.length ? usable[(i * 3 + 1) % usable.length] : null;
      st.root.visible = !!p;
      if (!p) return;
      along(p, plen(p) * (i % 2 ? 0.85 : 0.12), pose);
      st.root.position.set(pose.x + pose.dz * 0.6, 0, pose.z - pose.dx * 0.6);
      st.root.rotation.y = Math.atan2(-pose.dz, pose.dx) + (i % 2 ? Math.PI : 0);
    });
    rickPath = ride;
    rickLen = ride ? plen(ride) : 0;
    rickS = rickLen * 0.3;
    rickRoot.visible = !!ride;
    update(0, 0);
  }
  return { group, update, tris, movers, setHood };
}
