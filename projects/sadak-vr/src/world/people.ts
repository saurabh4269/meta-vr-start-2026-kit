/**
 * People: vendors and passers-by.
 *
 * Ported from SADAK (game_engine/lib/game/people.ts `makePerson`, presets,
 * palettes, `idlePose`/`gaitPose`; authors ahmedfahim21, Parth Mittal,
 * Apoorva Agrawal, Mardav Gandhi; reused with permission). Same silhouettes
 * (tapered limbs, lathe skull and jaw, a draped pallu, the kurta's long hem,
 * work kit), restructured for VR:
 *
 *  - The desktop rig merged the head into the torso, so it could not turn.
 *    Here every rigid part is bound to a bone of one SkinnedMesh (rigid
 *    skinning): head, jaw, eyes and brows move, and a whole person is one
 *    draw call instead of ~15.
 *  - The face is rebuilt for a viewer 0.7 m away: eyes at mid-head with a
 *    glint, brows, a nose, a mouth on a jaw bone, moustache and bindi options.
 *  - Real mitten hands with a thumb instead of a sphere, so an offered item
 *    sits on a palm.
 *  - Faces +Z; anatomical left is +X.
 */

import { BoxGeometry, CatmullRomCurve3, CylinderGeometry, LatheGeometry, SphereGeometry, TorusGeometry, Vector2, Vector3, BufferGeometry, Float32BufferAttribute, type Bone, type Material, type SkinnedMesh } from '@iwsdk/core';
import { INK_FADE, RigBuilder, mulberry32, paint, pick } from './kit.js';
import { makeHumanRig } from './humans.js';

export type PersonPreset = 'sari' | 'salwar_kameez' | 'lungi' | 'kurta_pyjama' | 'shirt_trousers';
export type Headwear = 'short' | 'bald' | 'bun' | 'braid' | 'topi' | 'dupatta';
export type KitPiece = 'apron' | 'towel' | 'angavastram';

export type PersonOptions = {
  preset?: PersonPreset;
  seed?: number;
  /** Standing height in metres, crown to sole. */
  height?: number;
  skin?: number;
  cloth1?: number;
  cloth2?: number;
  female?: boolean;
  headwear?: Headwear;
  headColour?: number;
  hair?: number;
  kit?: KitPiece[];
  kitColour?: number;
  moustache?: boolean;
  /** A short beard in this colour. */
  beard?: number;
  bindi?: boolean;
  bangles?: number;
  /** 0 hero (vendor, ~6-8k tris), 1 crowd (~1.5-2k tris). */
  lod?: 0 | 1;
  /** Ink fade distance (0 = no outline). Default: INK_FADE.person / crowd. */
  ink?: number;
  /** A built human body (humans.ts key, e.g. 'vendor-kachori'); falls back to this procedural rig if it isn't loaded. */
  model?: string;
  /** Something carried: a cloth bundle on the head or a shoulder bag. */
  carry?: 'none' | 'bundle' | 'bag';
};

export const SKIN_TONES = [0xa9744f, 0x8d5524, 0x6f4a30, 0xc48a5e, 0x5a3a24];
const SARI_COLOURS = [0xb23a48, 0x1f6f5c, 0xd4a017, 0x6a3f8f, 0xc65d2e, 0x2f5f8f];
const KURTA_COLOURS = [0xe8dcc0, 0x3f5b6b, 0x8a3324, 0x4a6741, 0xc9a15a];
const SHIRT_COLOURS = [0xe4e1d6, 0x3a5f7d, 0x7a4a3a, 0x556b2f, 0x9e9e8f];
const TROUSER_COLOURS = [0x2c3e50, 0x35302a, 0x4a4238, 0x24303a];
const LUNGI_COLOURS = [0x2f5f8f, 0x8a3324, 0x3f5b3f, 0x5a4a7a];
const HAIR_COLOURS = [0x14100c, 0x1c1712, 0x2a231c, 0x3a332a];

/** Rig dimensions (rig units = metres before the height scale). */
export type PersonDims = {
  scale: number;
  hipY: number;
  waistY: number;
  shoulderY: number;
  shoulderX: number;
  upperArm: number;
  forearm: number;
  headPivotY: number;
  eyeY: number;
};

export type PersonRig = {
  mesh: SkinnedMesh;
  bones: Record<string, Bone>;
  dims: PersonDims;
  tris: number;
  female: boolean;
  /** 'human': a MakeHuman body from humans.ts (real jaw and eyelid bones). */
  kind?: 'human' | 'procedural';
};

/* ------------------------------------------------------------------ */

function cylY(topR: number, botR: number, h: number, x: number, yTop: number, z: number, segs: number, sz = 1): BufferGeometry {
  return new CylinderGeometry(topR, botR, h, segs).scale(1, 1, sz).translate(x, yTop - h / 2, z);
}

function sph(r: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, w = 8, h = 6): BufferGeometry {
  return new SphereGeometry(r, w, h).scale(sx, sy, sz).translate(x, y, z);
}

function boxAt(w: number, h: number, d: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): BufferGeometry {
  const g = new BoxGeometry(w, h, d);
  if (rz) g.rotateZ(rz);
  if (rx) g.rotateX(rx);
  if (ry) g.rotateY(ry);
  return g.translate(x, y, z);
}

/** Skull-and-jaw silhouette via a lathe (people.ts headGeometry). */
function headGeometry(wS: number, hS: number, segs: number): BufferGeometry {
  const pts = [
    new Vector2(0.015, 0.0),
    new Vector2(0.05, 0.01),
    new Vector2(0.066, 0.022),
    new Vector2(0.078, 0.042),
    new Vector2(0.085, 0.064),
    new Vector2(0.09, 0.1),
    new Vector2(0.088, 0.125),
    new Vector2(0.082, 0.143),
    new Vector2(0.07, 0.162),
    new Vector2(0.053, 0.173),
    new Vector2(0.028, 0.182),
    new Vector2(0.0, 0.185),
  ];
  return new LatheGeometry(pts, segs).scale(wS, hS, wS);
}
const HEAD_LATHE_H = 0.185;

/** Lathe radius of the head profile at height fraction t (0 chin, 1 crown). */
function headRadiusAt(t: number): number {
  const prof = [
    [0, 0.015], [0.054, 0.05], [0.119, 0.066], [0.227, 0.078], [0.346, 0.085], [0.54, 0.09], [0.676, 0.088], [0.773, 0.082], [0.876, 0.07], [0.935, 0.053], [0.984, 0.028], [1, 0],
  ];
  for (let i = 1; i < prof.length; i++) {
    if (t <= prof[i][0]) {
      const [t0, r0] = prof[i - 1];
      const [t1, r1] = prof[i];
      return r0 + ((t - t0) / (t1 - t0)) * (r1 - r0);
    }
  }
  return 0;
}

/** A curved cloth ribbon (the sari's pallu), double-sided (people.ts curvedSheet). */
function curvedSheet(pts: Vector3[], width: (t: number) => number, segments: number): BufferGeometry {
  const curve = new CatmullRomCurve3(pts);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const up = new Vector3(0, 1, 0);
  const samples: { c: Vector3; side: Vector3; w: number }[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const c = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    let side = new Vector3().crossVectors(tangent, up);
    if (side.lengthSq() < 1e-6) side = new Vector3(1, 0, 0);
    side.normalize();
    samples.push({ c, side, w: width(t) });
  }
  for (let i = 0; i < segments; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    const a0 = a.c.clone().addScaledVector(a.side, -a.w / 2);
    const a1 = a.c.clone().addScaledVector(a.side, a.w / 2);
    const b0 = b.c.clone().addScaledVector(b.side, -b.w / 2);
    const b1 = b.c.clone().addScaledVector(b.side, b.w / 2);
    const n = new Vector3().crossVectors(b0.clone().sub(a0), a1.clone().sub(a0)).normalize();
    const push = (p: Vector3, nn: Vector3) => {
      positions.push(p.x, p.y, p.z);
      normals.push(nn.x, nn.y, nn.z);
      uvs.push(0, 0);
    };
    const m = n.clone().negate();
    push(a0, n); push(b0, n); push(a1, n);
    push(a1, n); push(b0, n); push(b1, n);
    push(a0, m); push(a1, m); push(b0, m);
    push(a1, m); push(b1, m); push(b0, m);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  return geo;
}

/* ------------------------------------------------------------------ */

export function makePersonRig(o: PersonOptions, material: Material): PersonRig {
  if (o.model) {
    const human = makeHumanRig(o.model, !!o.female);
    if (human) return human;
  }
  const seed = o.seed ?? 1;
  const rand = mulberry32(seed);
  const preset: PersonPreset = o.preset ?? 'shirt_trousers';
  const hero = (o.lod ?? 0) === 0;
  const seg = hero ? 12 : 6;
  const sphW = hero ? 9 : 5;
  const sphH = hero ? 6 : 4;

  const build = 0.98 + rand() * 0.18;
  const femaleRoll = rand();
  const female = o.female ?? (preset === 'sari' || preset === 'salwar_kameez' ? femaleRoll > 0.15 : femaleRoll > 0.72);
  const skin = o.skin ?? pick(SKIN_TONES, rand);
  const pool = preset === 'sari' ? SARI_COLOURS : preset === 'kurta_pyjama' ? KURTA_COLOURS : preset === 'lungi' ? LUNGI_COLOURS : SHIRT_COLOURS;
  const cloth1 = o.cloth1 ?? pick(pool, rand);
  const cloth2 = o.cloth2 ?? pick(TROUSER_COLOURS, rand);
  const hair = o.hair ?? pick(HAIR_COLOURS, rand);
  const DARK = 0x1a1210;
  const LIP = 0x6e2a24;

  // ---- skeleton (rig units, Sadak's numbers with the face rebuilt) ----
  const hipY = 0.9 * build ** 0.15;
  const kneeDrop = 0.44;
  const ankleDrop = 0.42;
  const footH = 0.07;
  const waistY = hipY + 0.08;
  const shoulderY = 1.44;
  const chinY = 1.545;
  const headTop = 1.78;
  const shoulderW = (0.22 + (female ? -0.015 : 0.025)) * build;
  const hipW = (0.19 + (female ? 0.02 : 0)) * build;
  const upperArm = hero ? 0.3 : 0.27;
  const forearm = hero ? 0.27 : 0.24;
  const torsoZ = 0.74; // torso is an oval, not a drum
  const scale = (o.height ?? 1.7) / headTop;

  // Heroes get a slightly larger head: friendlier at arm's length, and the
  // face reads from the seat. The crowd keeps Sadak's proportions.
  const headH = (headTop - chinY) * (hero ? 1.07 : 1);
  const headScaleY = headH / HEAD_LATHE_H;
  const headScaleXZ = hero ? 1.03 : 0.95;
  const headR = (t: number) => headRadiusAt(t) * headScaleXZ;
  const faceY = (t: number) => chinY + headH * t;
  /** z of the face surface at height fraction t and lateral x. */
  const faceZ = (t: number, x: number) => {
    const r = headR(t);
    return Math.sqrt(Math.max(0, r * r - x * x));
  };
  const eyeT = 0.5;
  const eyeY = faceY(eyeT);
  const headPivotY = chinY + 0.025;

  const R = new RigBuilder();
  // Ink on the silhouette parts; face details, buttons and jewellery stay clean.
  const inkFade = o.ink ?? (hero ? INK_FADE.person : INK_FADE.crowd);
  R.ink = inkFade;
  R.bone('root', null, 0, 0, 0);
  R.bone('hips', 'root', 0, hipY, 0);
  R.bone('hipL', 'hips', hipW * 0.55, hipY, 0);
  R.bone('kneeL', 'hipL', hipW * 0.55, hipY - kneeDrop, 0);
  R.bone('hipR', 'hips', -hipW * 0.55, hipY, 0);
  R.bone('kneeR', 'hipR', -hipW * 0.55, hipY - kneeDrop, 0);
  R.bone('spine', 'hips', 0, waistY, 0);
  R.bone('chest', 'spine', 0, waistY + 0.22, 0);
  R.bone('neck', 'spine', 0, shoulderY - 0.05, 0);
  R.bone('head', 'neck', 0, headPivotY, -0.01);
  R.bone('jaw', 'head', 0, faceY(0.2), faceZ(0.2, 0) - 0.004);
  R.bone('eyeL', 'head', 0.031, eyeY, faceZ(eyeT, 0.031) - 0.006);
  R.bone('eyeR', 'head', -0.031, eyeY, faceZ(eyeT, 0.031) - 0.006);
  R.bone('browL', 'head', 0.033, faceY(0.62), faceZ(0.62, 0.033));
  R.bone('browR', 'head', -0.033, faceY(0.62), faceZ(0.62, 0.033));
  const sx = shoulderW * 0.92;
  const sy = shoulderY - 0.04;
  for (const [side, s] of [['L', 1], ['R', -1]] as const) {
    R.bone(`shoulder${side}`, 'spine', s * sx, sy, 0);
    R.bone(`elbow${side}`, `shoulder${side}`, s * sx, sy - upperArm, 0);
    R.bone(`wrist${side}`, `elbow${side}`, s * sx, sy - upperArm - forearm, 0);
  }

  const add = (bone: string, g: BufferGeometry, hex: number, glow = 0, inked = true) => {
    const was = R.ink;
    if (!inked || glow > 0) R.ink = 0;
    R.add(bone, paint(g, hex, glow));
    R.ink = was;
  };
  /** Small details (buttons, stripes, jewellery): no outline. */
  const fine = (bone: string, g: BufferGeometry, hex: number, glow = 0) => add(bone, g, hex, glow, false);

  // ================= pelvis and long garments (hips) =================
  add('hips', cylY(hipW * 0.95, hipW, waistY - hipY + 0.02, 0, waistY + 0.02, 0, seg, torsoZ + 0.08), preset === 'sari' ? cloth1 : preset === 'shirt_trousers' ? cloth2 : cloth1);
  const torsoTopR = shoulderW * (preset === 'shirt_trousers' ? 0.8 : 0.85);
  const torsoBotR = hipW * 0.86;
  if (preset === 'salwar_kameez' || preset === 'kurta_pyjama') {
    const hemY = hipY - 0.34;
    add('hips', cylY(torsoBotR * 1.03, torsoBotR * 1.2, waistY - hemY, 0, waistY, 0, seg, torsoZ + 0.12), cloth1);
    // Side slits read as two darker lines on the hem.
    for (const s of [-1, 1]) fine('hips', boxAt(0.012, 0.18, 0.06, s * torsoBotR * 1.15, hemY + 0.09, 0), shade(cloth1, 0.7));
  }
  if (preset === 'sari') {
    add('hips', cylY(torsoBotR * 1.04, hipW * 1.32, waistY - 0.04, 0, waistY, 0, seg, 0.9), cloth1);
    // Border band at the hem and pleats down the front.
    add('hips', cylY(hipW * 1.31, hipW * 1.34, 0.07, 0, 0.11, 0, seg, 0.9), cloth2);
    for (let k = -2; k <= 2; k++) fine('hips', boxAt(0.016, waistY - 0.12, 0.02, k * 0.03, (waistY + 0.04) / 2, hipW * 1.06 + 0.02, -0.05), shade(cloth1, 0.82));
  }
  if (preset === 'lungi') {
    const hemY = hipY - 0.5;
    add('hips', cylY(hipW * 1.0, hipW * 1.25, waistY - hemY, 0, waistY, 0, seg, 0.85), cloth1);
  }

  // ================= torso (chest) =================
  const torsoH = shoulderY - waistY;
  add('chest', cylY(torsoTopR, torsoBotR, torsoH, 0, shoulderY, 0, seg, torsoZ), preset === 'sari' ? cloth1 : cloth1);
  // Sloped trapezius rising round the neck, so the head doesn't sit on a post.
  add('chest', sph(torsoTopR * 0.96, 0, shoulderY, 0, 1, 0.5, torsoZ, sphW, sphH), cloth1);
  const chestZ = torsoBotR * torsoZ + 0.01;
  if (preset === 'kurta_pyjama' || preset === 'salwar_kameez') {
    // Placket and buttons (kurta), or a neckline band (kameez).
    if (preset === 'kurta_pyjama') {
      fine('chest', boxAt(0.035, 0.2, 0.012, 0, shoulderY - 0.13, chestZ + 0.012), shade(cloth1, 0.86));
      if (hero) for (let k = 0; k < 3; k++) fine('chest', sph(0.006, 0, shoulderY - 0.07 - k * 0.055, chestZ + 0.02, 1, 1, 0.6, 6, 4), 0xe9dfc4);
      add('chest', cylY(0.054, 0.062, 0.03, 0, shoulderY + 0.105, -0.012, seg, 1), shade(cloth1, 0.9)); // band collar
    } else {
      fine('chest', boxAt(0.12, 0.012, 0.012, 0, shoulderY - 0.02, chestZ * 0.9, -0.4), cloth2);
    }
  }
  if (preset === 'shirt_trousers') {
    // Collar points and a breast pocket.
    for (const s of [-1, 1]) fine('chest', boxAt(0.06, 0.012, 0.05, s * 0.035, shoulderY + 0.035, chestZ * 0.75, -0.5, 0, s * 0.35), shade(cloth1, 1.08));
    fine('chest', boxAt(0.012, 0.32, 0.01, 0, shoulderY - 0.17, chestZ + 0.006), shade(cloth1, 0.85));
    if (hero) fine('chest', boxAt(0.08, 0.09, 0.008, 0.07, shoulderY - 0.13, chestZ + 0.004, 0, -0.12), shade(cloth1, 0.9));
    add('hips', cylY(hipW * 0.99, hipW * 0.99, 0.035, 0, waistY - 0.01, 0, seg, torsoZ + 0.1), 0x2a1e16); // belt
  }
  if (preset === 'sari') {
    // Blouse in the border colour, then the pallu drape over the left shoulder.
    add('chest', cylY(torsoTopR * 1.01, torsoTopR * 0.96, 0.2, 0, shoulderY + 0.005, 0, seg, torsoZ + 0.01), cloth2);
    const pallu = curvedSheet(
      [
        new Vector3(-hipW * 0.6, waistY - 0.02, chestZ + 0.03),
        new Vector3(shoulderW * 0.25, shoulderY - 0.22, chestZ + 0.04),
        new Vector3(shoulderW * 0.62, shoulderY + 0.04, chestZ * 0.3),
        new Vector3(shoulderW * 0.62, shoulderY + 0.02, -chestZ * 0.6),
        new Vector3(shoulderW * 0.5, shoulderY - 0.5, -chestZ - 0.04),
      ],
      (t) => 0.2 - t * 0.04,
      hero ? 14 : 6,
    );
    add('chest', pallu, cloth1);
    // Gold border along the pallu edge.
    const edge = curvedSheet(
      [
        new Vector3(-hipW * 0.6 - 0.07, waistY - 0.05, chestZ + 0.035),
        new Vector3(shoulderW * 0.25 - 0.08, shoulderY - 0.25, chestZ + 0.046),
        new Vector3(shoulderW * 0.62 - 0.1, shoulderY + 0.035, chestZ * 0.3 + 0.01),
      ],
      () => 0.03,
      hero ? 8 : 3,
    );
    fine('chest', edge, 0xf2c230);
  }

  // Work kit over the clothes.
  for (const piece of o.kit ?? []) {
    const kc = o.kitColour;
    if (piece === 'apron') {
      const c = kc ?? 0xf2efe6;
      add('hips', boxAt(hipW * 2.0, 0.55, 0.014, 0, waistY - 0.24, torsoBotR * (torsoZ + 0.2) + 0.012), c);
      add('chest', boxAt(hipW * 1.5, 0.34, 0.014, 0, shoulderY - 0.24, chestZ + 0.008), c);
      for (const s of [-1, 1]) add('chest', boxAt(0.016, 0.22, 0.012, s * 0.07, shoulderY + 0.02, chestZ - 0.03, -0.3), c);
    } else if (piece === 'towel') {
      const c = kc ?? 0xf2efe6;
      add('chest', boxAt(0.1, 0.035, chestZ * 2 + 0.04, -shoulderW * 0.72, shoulderY + 0.035, 0), c);
      add('chest', boxAt(0.1, 0.24, 0.016, -shoulderW * 0.72, shoulderY - 0.1, chestZ + 0.012), c);
      add('chest', boxAt(0.1, 0.28, 0.016, -shoulderW * 0.72, shoulderY - 0.12, -chestZ - 0.012), c);
      fine('chest', boxAt(0.102, 0.022, 0.018, -shoulderW * 0.72, shoulderY - 0.18, chestZ + 0.014), 0xc0392b);
      fine('chest', boxAt(0.102, 0.022, 0.018, -shoulderW * 0.72, shoulderY - 0.13, chestZ + 0.014), 0xc0392b);
    } else if (piece === 'angavastram') {
      const c = kc ?? 0xe8872a;
      add('chest', boxAt(0.07, 0.6, 0.014, 0, shoulderY - 0.24, chestZ + 0.012, 0, 0, -0.62), c);
      add('chest', boxAt(0.07, 0.6, 0.014, 0, shoulderY - 0.24, -chestZ - 0.012, 0, 0, 0.62), c);
    }
  }
  if (o.carry === 'bag') {
    add('chest', boxAt(0.16, 0.2, 0.08, shoulderW * 0.95, shoulderY - 0.42, 0.02), pick([0x5b3a22, 0x2f4f6f, 0x7a2a2a], rand));
    add('chest', boxAt(0.02, 0.62, 0.02, 0, shoulderY - 0.16, chestZ + 0.006, 0, 0, -0.62), 0x3a2a1a);
  }

  // ================= neck and head =================
  const neckBottom = shoulderY - 0.1;
  const neckTop = chinY + headH * 0.2;
  add('neck', cylY(0.043, 0.056, neckTop - neckBottom, 0, neckTop, -0.022, seg, 0.95), skin);
  add('head', headGeometry(headScaleXZ, headScaleY, hero ? 18 : 7).translate(0, chinY, 0), skin);
  // Ears.
  if (hero) for (const s of [-1, 1]) add('head', sph(0.022, s * (headR(0.5) + 0.004), faceY(0.5), -0.008, 0.45, 1.25, 0.8, sphW, sphH), shade(skin, 0.93));
  R.ink = 0;
  // Nose: a narrow bridge and a small rounded tip.
  add('head', sph(0.0115, 0, faceY(0.4), faceZ(0.4, 0) - 0.001, 0.78, 1.7, 1.1, sphW, sphH), shade(skin, 1.03));
  if (hero) add('head', sph(0.0085, 0, faceY(0.32), faceZ(0.32, 0) + 0.006, 1.45, 0.95, 1.05, sphW, sphH), shade(skin, 0.97));
  // Mouth on the jaw bone (opens when talking).
  add('jaw', sph(0.016, 0, faceY(0.2), faceZ(0.2, 0) - 0.001, 1.3, 0.4, 0.5, sphW, sphH), LIP);
  // Eyes: dark ovals with a glint, each on its own bone for blinks.
  for (const [side, s] of [['L', 1], ['R', -1]] as const) {
    const ex = s * 0.031;
    const ez = faceZ(eyeT, 0.031) - 0.006;
    add(`eye${side}`, sph(0.0125, ex, eyeY, ez, 0.92, 1.22, 0.62, sphW, sphH), DARK);
    if (hero) add(`eye${side}`, sph(0.0035, ex + 0.004, eyeY + 0.005, ez + 0.007, 1, 1, 0.6, 6, 4), 0xffffff, 0.6);
    if (hero) add(`brow${side}`, sph(0.016, s * 0.033, faceY(0.62), faceZ(0.62, 0.033) - 0.003, 1.45, 0.34, 0.55, sphW, sphH).rotateZ(0), hair);
  }
  if (o.moustache) add('head', sph(0.028, 0, faceY(0.255), faceZ(0.255, 0) + 0.0, 1.3, 0.32, 0.55, sphW, sphH), hair);
  if (o.beard !== undefined) {
    // Chin and jawline, on the head so talking does not stretch it.
    add('head', sph(0.05, 0, faceY(0.1), faceZ(0.1, 0) - 0.03, 1.15, 0.9, 0.75, sphW, sphH), o.beard);
    for (const s of [-1, 1]) add('head', sph(0.03, s * (headR(0.28) - 0.012), faceY(0.3), 0.01, 0.6, 1.4, 1.0, sphW, sphH), o.beard);
  }
  if (o.bindi) add('head', sph(0.0055, 0, faceY(0.66), faceZ(0.66, 0) + 0.001, 1, 1, 0.5, 6, 4), 0xc0102a, 0.3);

  R.ink = inkFade;
  // Hair / headwear.
  const crownY = chinY + headH;
  const hs = headScaleXZ / 0.95;
  const style: Headwear = o.headwear ?? (female ? (rand() < 0.6 ? 'bun' : 'braid') : rand() < 0.15 ? 'bald' : rand() < 0.3 ? 'topi' : 'short');
  if (style !== 'bald' && style !== 'topi') {
    // Hair cap hugging the crown, swept back, hairline above the forehead.
    add('head', sph(0.094 * hs, 0, crownY - 0.05, -0.016, 1.0, 0.66, 1.02, sphW + 2, sphH + 1), hair);
    if (hero) {
      // Sideburns and the back of the head, so the cap doesn't read as a helmet.
      for (const s of [-1, 1]) add('head', boxAt(0.012, 0.05, 0.03, s * (headR(0.55) - 0.002), faceY(0.6), -0.012), hair);
      add('head', sph(0.084 * hs, 0, faceY(0.55), -0.03, 1.0, 1.0, 0.85, sphW, sphH), hair);
    }
    if (hero && female) {
      // Hair drawn back over the ears to the nape, a centre parting with
      // sindoor, and gold jhumkas.
      for (const s of [-1, 1]) add('head', sph(0.05, s * (headR(0.55) - 0.012), faceY(0.6), -0.03, 0.55, 1.15, 1.2, sphW, sphH), hair);
      fine('head', boxAt(0.006, 0.006, 0.07, 0, crownY - 0.004, 0.03, 0.55), 0xb01020);
      for (const s of [-1, 1]) {
        add('head', sph(0.007, s * (headR(0.42) + 0.006), faceY(0.4), 0.0, 1, 1, 1, 6, 4), 0xe0b23a, 0.25);
        add('head', new CylinderGeometry(0.003, 0.011, 0.018, 6).translate(s * (headR(0.42) + 0.006), faceY(0.4) - 0.016, 0.0), 0xe0b23a, 0.25);
      }
    }
  }
  if (style === 'bun') add('head', sph(0.048, 0, crownY - 0.095, -0.1 * hs - 0.008, 1, 0.85, 0.9, sphW, sphH), hair);
  if (style === 'braid') {
    for (let i = 0; i < 4; i++) add('chest', cylY(0.026 * (1 - i * 0.15), 0.024 * (1 - i * 0.15), 0.12, 0, shoulderY + 0.1 - i * 0.12, -0.11 - i * 0.012, 6), hair);
  }
  if (style === 'topi') {
    add('head', sph(0.094, 0, crownY - 0.05, -0.016, 1.0, 0.62, 1.02, sphW, sphH), hair);
    add('head', new CylinderGeometry(0.086, 0.09, 0.05, seg).translate(0, crownY - 0.0, 0), o.headColour ?? 0xf4f1ea);
  }
  if (style === 'dupatta') {
    add('head', new SphereGeometry(0.104, sphW, sphH, 0, Math.PI * 2, 0, Math.PI * 0.62).translate(0, crownY - 0.07, -0.01), o.headColour ?? cloth2);
    add('neck', boxAt(0.2, 0.3, 0.02, 0, crownY - 0.24, -0.1, -0.12), o.headColour ?? cloth2);
  }
  if (o.carry === 'bundle') add('head', sph(0.1, 0, crownY + 0.04, 0, 1, 0.48, 1, sphW, sphH), pick([0xd8c8a0, 0xc65d2e, 0x2f5f8f], rand));

  // ================= legs =================
  const bareLeg = preset === 'sari' || preset === 'lungi';
  const legCol = preset === 'kurta_pyjama' || preset === 'salwar_kameez' || preset === 'shirt_trousers' ? cloth2 : cloth1;
  for (const [side, s] of [['L', 1], ['R', -1]] as const) {
    const lx = s * hipW * 0.55;
    const thighTop = 0.088 * build;
    const thighBot = 0.072 * build;
    const bag = preset === 'salwar_kameez' ? 1.6 : 1.0;
    const tc = bareLeg ? skin : legCol;
    add(`hip${side}`, cylY(thighTop * bag, thighBot * bag, kneeDrop, lx, hipY, 0, seg), tc);
    add(`hip${side}`, sph(thighTop * bag * 0.98, lx, hipY, 0, 1, 1, 1, sphW, sphH), tc);
    const shinLen = ankleDrop - footH;
    const kneeY = hipY - kneeDrop;
    if (bareLeg) {
      add(`knee${side}`, cylY(0.062 * build, 0.046 * build, shinLen, lx, kneeY, 0, seg), skin);
    } else {
      const cuff = preset === 'salwar_kameez' ? 0.034 : 0.05;
      add(`knee${side}`, cylY(thighBot * (preset === 'salwar_kameez' ? 1.3 : 1), cuff * build, shinLen, lx, kneeY, 0, seg), legCol);
      add(`knee${side}`, sph(thighBot * 0.96, lx, kneeY, 0, 1, 1, 1, sphW, sphH), legCol);
    }
    // Chappal: sole plus the foot.
    const fy = kneeY - shinLen;
    add(`knee${side}`, boxAt(0.075, 0.022, 0.24, lx, 0.011, 0.04), 0x4a3424);
    add(`knee${side}`, sph(0.04, lx, fy - footH * 0.45, 0.06, 0.95, 0.55, 2.0, sphW, sphH), skin);
  }

  // ================= arms =================
  const sleeveFull = preset === 'kurta_pyjama' || preset === 'salwar_kameez';
  const sleeveCloth = preset === 'sari' ? cloth2 : cloth1;
  for (const [side, s] of [['L', 1], ['R', -1]] as const) {
    const ax = s * sx;
    const upperR = 0.056 * build;
    const shortSleeve = preset === 'sari' || preset === 'lungi';
    if (shortSleeve) {
      add(`shoulder${side}`, cylY(upperR * 1.1, upperR * 1.05, 0.11, ax, sy + 0.005, 0, seg), sleeveCloth);
      add(`shoulder${side}`, cylY(upperR * 0.98, upperR * 0.86, upperArm - 0.08, ax, sy - 0.08, 0, seg), skin);
    } else {
      add(`shoulder${side}`, cylY(upperR * 1.12, upperR * 1.0, upperArm, ax, sy, 0, seg), sleeveCloth);
    }
    add(`shoulder${side}`, sph(upperR * 1.14, ax, sy + 0.01, 0, 1, 1, 1, sphW, sphH), shortSleeve ? sleeveCloth : sleeveCloth);
    const ey = sy - upperArm;
    const foreTop = 0.046 * build;
    const foreBot = 0.035 * build;
    if (sleeveFull) {
      add(`elbow${side}`, cylY(foreTop * 1.15, foreBot * 1.25, forearm - 0.02, ax, ey, 0, seg), sleeveCloth);
      add(`elbow${side}`, sph(foreTop * 1.15, ax, ey, 0, 1, 1, 1, sphW, sphH), sleeveCloth);
    } else {
      add(`elbow${side}`, cylY(foreTop, foreBot, forearm, ax, ey, 0, seg), skin);
      add(`elbow${side}`, sph(foreTop * 1.02, ax, ey, 0, 1, 1, 1, sphW, sphH), preset === 'shirt_trousers' ? sleeveCloth : skin);
      if (preset === 'shirt_trousers' && hero) add(`elbow${side}`, cylY(foreTop * 1.18, foreTop * 1.12, 0.06, ax, ey + 0.01, 0, seg), shade(sleeveCloth, 0.95)); // rolled cuff
    }
    if (o.bangles) {
      for (let k = 0; k < (hero ? 3 : 1); k++) fine(`elbow${side}`, new TorusGeometry(foreBot * 1.25, 0.005, 4, hero ? 14 : 8).rotateX(Math.PI / 2).translate(ax, ey - forearm + 0.035 + k * 0.012, 0), o.bangles);
    }
    // Mitten hand: palm faces the body (medial), thumb forward.
    const wy = ey - forearm;
    const med = -s; // medial direction in x
    if (!hero) {
      // Crowd: a mitten is a single squashed ball at this distance.
      add(`wrist${side}`, sph(0.042, ax, wy - 0.05, 0.004, 0.55, 1.2, 0.95, sphW, sphH), skin);
      continue;
    }
    add(`wrist${side}`, cylY(foreBot * 0.95, foreBot * 0.95, 0.03, ax, wy + 0.012, 0, seg), skin);
    add(`wrist${side}`, sph(0.04, ax, wy - 0.045, 0, 0.44, 1.05, 0.98, sphW, sphH), skin); // palm
    // Four fingers, three segments each, relaxed in a slight curl toward the palm.
    const fz = [0.021, 0.007, -0.007, -0.02];
    const fl = [0.068, 0.078, 0.074, 0.06];
    for (let i = 0; i < 4; i++) {
      let px = ax + med * 0.004;
      let py = wy - 0.078;
      const pz = fz[i];
      let ang = 0;
      [0.45, 0.32, 0.23].forEach((part, k) => {
        ang += [0.14, 0.3, 0.34][k];
        const len = fl[i] * part;
        const r = 0.0082 * (1 - k * 0.13);
        const dx = med * Math.sin(ang);
        const dy = -Math.cos(ang);
        const g = new CylinderGeometry(r * 0.9, r, len + r * 0.8, 6).rotateZ(med * ang).translate(px + (dx * len) / 2, py + (dy * len) / 2, pz);
        add(`wrist${side}`, g, k === 2 ? shade(skin, 0.97) : skin);
        px += dx * len;
        py += dy * len;
      });
    }
    const thumb = new CylinderGeometry(0.0105, 0.0095, 0.048, hero ? 8 : 5);
    thumb.rotateX(0.55).rotateZ(med * 0.35);
    add(`wrist${side}`, thumb.translate(ax + med * 0.012, wy - 0.045, 0.034), skin);
    add(`wrist${side}`, sph(0.011, ax + med * 0.018, wy - 0.066, 0.046, 1, 1, 1, 6, 4), skin);
  }

  const built = R.build(material);
  built.mesh.scale.setScalar(scale);
  built.mesh.name = `person_${preset}_${seed}`;
  return {
    mesh: built.mesh,
    bones: built.bones,
    tris: built.tris,
    female,
    dims: { scale, hipY, waistY, shoulderY: sy, shoulderX: sx, upperArm, forearm, headPivotY, eyeY },
  };
}

function shade(hex: number, k: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

/* ------------------------------------------------------------------ */

/**
 * Walk and idle for the crowd (people.ts `gaitPose`/`idlePose`, with the
 * elbows bending forward instead of back). Writes bone rotations directly.
 */
export function poseWalk(b: Record<string, Bone>, phase: number, amount: number, t: number): void {
  const sw = Math.sin(phase);
  const breath = Math.sin(t * 1.5);
  const stride = 0.5 * amount;
  b.hipL.rotation.x = -sw * stride;
  b.hipR.rotation.x = sw * stride;
  const soft = (x: number) => (x > 0 ? x * x : 0);
  b.kneeL.rotation.x = (soft(sw) * 1.0 + 0.05) * amount + 0.04 * (1 - amount);
  b.kneeR.rotation.x = (soft(-sw) * 1.0 + 0.05) * amount + 0.04 * (1 - amount);
  b.shoulderL.rotation.set(sw * 0.38 * amount + breath * 0.02, 0, 0.08);
  b.shoulderR.rotation.set(-sw * 0.38 * amount + breath * 0.02, 0, -0.08);
  b.elbowL.rotation.x = -(0.2 + soft(-sw) * 0.4) * amount - 0.12 * (1 - amount);
  b.elbowR.rotation.x = -(0.2 + soft(sw) * 0.4) * amount - 0.12 * (1 - amount);
  b.hips.position.y = b.hips.userData.baseY + Math.abs(Math.sin(phase * 2)) * 0.025 * amount + breath * 0.004;
  b.hips.rotation.y = sw * 0.06 * amount;
  b.spine.rotation.y = -sw * 0.08 * amount;
  b.hips.rotation.z = Math.sin(t * 0.55) * 0.02 * (1 - amount);
}
