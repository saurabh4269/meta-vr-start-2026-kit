/**
 * Geometry kit for the street: every part is baked with its colour, atlas UV
 * and transform, then merged, so a whole block of street is one draw call.
 *
 * Ported from SADAK (game_engine/lib/game/world/vc.ts `Parts`/`paint`,
 * buildings.ts `slab`/`bakeBuilding`, props.ts `mulberry32`; authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission). Extended with an atlas UV (one white texel for flat-coloured
 * parts, so painted signs and plain plaster share one material) and a
 * per-vertex `glow` (bulbs and lamp lenses), plus a rigid-skinning builder:
 * a character or vehicle with moving parts is one SkinnedMesh, one draw call.
 */

import {
  Bone,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Mesh,
  Skeleton,
  SkinnedMesh,
  SphereGeometry,
  Vector2,
  Vector3,
  type Material,
} from '@iwsdk/core';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Deterministic PRNG so the street looks identical on every load (props.ts). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(list: readonly T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length)];
}

/** UV rectangle in the atlas: [u0, v0, u1, v1]. */
export type UvRect = [number, number, number, number];

/** Centre of the atlas's white block (see atlas.ts). */
export const WHITE_UV: [number, number] = [32 / 2048, 1 - 32 / 2048];

const _c = new Color();

/**
 * Bakes a flat colour, white-texel UVs and a glow value into a geometry.
 * Non-indexed, so every primitive can merge into one list.
 */
export function paint(geo: BufferGeometry, hex: number, glow = 0): BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g !== geo) geo.dispose();
  _c.setHex(hex);
  const n = g.attributes.position.count;
  const cols = new Float32Array(n * 3);
  const uvs = new Float32Array(n * 2);
  const glows = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    _c.toArray(cols, i * 3);
    uvs[i * 2] = WHITE_UV[0];
    uvs[i * 2 + 1] = WHITE_UV[1];
    glows[i] = glow;
  }
  g.setAttribute('color', new BufferAttribute(cols, 3));
  g.setAttribute('uv', new BufferAttribute(uvs, 2));
  g.setAttribute('glow', new BufferAttribute(glows, 1));
  g.setAttribute('ink', new BufferAttribute(new Float32Array(n), 1));
  for (const k of Object.keys(g.attributes)) {
    if (!KEEP.has(k)) g.deleteAttribute(k);
  }
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}

const KEEP = new Set(['position', 'normal', 'color', 'uv', 'glow', 'ink']);

/** Remaps a geometry's own 0..1 UVs into an atlas rect, tinted `hex`. */
export function textured(geo: BufferGeometry, rect: UvRect, hex = 0xffffff, glow = 0): BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g !== geo) geo.dispose();
  const uv = g.attributes.uv as BufferAttribute;
  const [u0, v0, u1, v1] = rect;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
  }
  _c.setHex(hex);
  const n = g.attributes.position.count;
  const cols = new Float32Array(n * 3);
  const glows = new Float32Array(n).fill(glow);
  for (let i = 0; i < n; i++) _c.toArray(cols, i * 3);
  g.setAttribute('color', new BufferAttribute(cols, 3));
  g.setAttribute('glow', new BufferAttribute(glows, 1));
  g.setAttribute('ink', new BufferAttribute(new Float32Array(n), 1));
  for (const k of Object.keys(g.attributes)) {
    if (!KEEP.has(k)) g.deleteAttribute(k);
  }
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}

export function merge(list: BufferGeometry[]): BufferGeometry {
  if (!list.length) return new BufferGeometry();
  const g = mergeGeometries(list, false);
  if (!g) throw new Error('[world/kit] mergeGeometries failed (attribute mismatch)');
  list.forEach((p) => p.dispose());
  list.length = 0;
  return g;
}

export function triCount(g: BufferGeometry): number {
  return Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Ink: inverted-hull outlines merged into their parent                */
/* ------------------------------------------------------------------ */

/** Dark warm ink (SADAK's outline colour, fx/toon.ts). */
export const INK = 0x2a1a12;

/**
 * Ink fade distances (metres): the shell's width falls to nothing between
 * 0.6x and 1x this distance from the eye, so thin parts never outline far
 * away where depth precision is coarse.
 */
export const INK_FADE = { goods: 6, counter: 22, person: 30, crowd: 26, vehicle: 45, facade: 42, mid: 70, monument: 420 } as const;

const _n = new Vector3();
const _m2 = new Vector3();

/**
 * The inverted hull of a painted (non-indexed) part: the same triangles with
 * their winding reversed, so only the far side survives back-face culling,
 * each vertex carrying a mitred outward direction in `normal` (the normals of
 * every face meeting at that position, averaged and stretched so the shell
 * is the same thickness off each face) and its fade distance in `ink`. The
 * cel shader pushes ink vertices out by a screen-constant width; see cel.ts.
 */
export function inkShell(src: BufferGeometry, fade: number): BufferGeometry {
  const g = src.index ? src.toNonIndexed() : src;
  const p = g.attributes.position as BufferAttribute;
  const nrm = g.attributes.normal as BufferAttribute | undefined;
  const count = p.count - (p.count % 3);
  // Distinct normals per welded position.
  const weld = new Map<string, number[]>();
  const key = (i: number) => `${Math.round(p.getX(i) * 2000)},${Math.round(p.getY(i) * 2000)},${Math.round(p.getZ(i) * 2000)}`;
  const faceN = (i: number) => {
    if (nrm) return _n.set(nrm.getX(i), nrm.getY(i), nrm.getZ(i)).normalize();
    const t = i - (i % 3);
    _n.set(p.getX(t + 1) - p.getX(t), p.getY(t + 1) - p.getY(t), p.getZ(t + 1) - p.getZ(t));
    _m2.set(p.getX(t + 2) - p.getX(t), p.getY(t + 2) - p.getY(t), p.getZ(t + 2) - p.getZ(t));
    return _n.cross(_m2).normalize();
  };
  const keys: string[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const k = key(i);
    keys[i] = k;
    const n = faceN(i);
    if (!Number.isFinite(n.x)) continue;
    let list = weld.get(k);
    if (!list) weld.set(k, (list = []));
    let dup = false;
    for (let j = 0; j < list.length; j += 3) if (list[j] * n.x + list[j + 1] * n.y + list[j + 2] * n.z > 0.985) dup = true;
    if (!dup) list.push(n.x, n.y, n.z);
  }
  const miter = new Map<string, [number, number, number, number]>();
  for (const [k, l] of weld) {
    _n.set(0, 0, 0);
    for (let j = 0; j < l.length; j += 3) _n.x += l[j], _n.y += l[j + 1], _n.z += l[j + 2];
    if (_n.lengthSq() < 1e-6) _n.set(l[0], l[1], l[2]);
    _n.normalize();
    let lo = 1;
    for (let j = 0; j < l.length; j += 3) lo = Math.min(lo, _n.x * l[j] + _n.y * l[j + 1] + _n.z * l[j + 2]);
    miter.set(k, [_n.x, _n.y, _n.z, 1 / Math.max(0.4, lo)]);
  }
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  // Unit miter direction in `normal` (transforms renormalise normals) and its
  // stretch in `glow` (unused by ink fragments).
  const stretch = new Float32Array(count);
  for (let t = 0; t < count; t += 3) {
    // Reverse the winding: a, c, b.
    const order = [t, t + 2, t + 1];
    for (let v = 0; v < 3; v++) {
      const i = order[v];
      const o = (t + v) * 3;
      pos[o] = p.getX(i);
      pos[o + 1] = p.getY(i);
      pos[o + 2] = p.getZ(i);
      const m = miter.get(keys[i]) ?? [0, 1, 0, 0];
      nor[o] = m[0];
      nor[o + 1] = m[1];
      nor[o + 2] = m[2];
      stretch[t + v] = m[3];
    }
  }
  if (g !== src) g.dispose();
  const out = new BufferGeometry();
  out.setAttribute('position', new BufferAttribute(pos, 3));
  out.setAttribute('normal', new BufferAttribute(nor, 3));
  const cols = new Float32Array(count * 3);
  _c.setHex(INK);
  for (let i = 0; i < count; i++) _c.toArray(cols, i * 3);
  const uvs = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    uvs[i * 2] = WHITE_UV[0];
    uvs[i * 2 + 1] = WHITE_UV[1];
  }
  out.setAttribute('color', new BufferAttribute(cols, 3));
  out.setAttribute('uv', new BufferAttribute(uvs, 2));
  out.setAttribute('glow', new BufferAttribute(stretch, 1));
  out.setAttribute('ink', new BufferAttribute(new Float32Array(count).fill(fade), 1));
  return out;
}

/** Collects coloured parts and merges them into one geometry (vc.ts). */
export class Parts {
  readonly list: BufferGeometry[] = [];
  /** While > 0, every part added also gets an ink shell fading at this distance. */
  ink = 0;

  add(geo: BufferGeometry, hex: number, glow = 0): this {
    const g = paint(geo, hex, glow);
    this.list.push(g);
    if (this.ink > 0 && glow === 0) this.list.push(inkShell(g, this.ink));
    return this;
  }

  /** An ink shell only (e.g. the closed box behind an open-backed facade slab). */
  inkOnly(geo: BufferGeometry, fade = this.ink): this {
    if (fade > 0) this.list.push(inkShell(paint(geo, INK), fade));
    return this;
  }

  /** Runs `f` with ink on at `fade` (restores the previous setting). */
  inked(fade: number, f: () => void): this {
    const was = this.ink;
    this.ink = fade;
    try {
      f();
    } finally {
      this.ink = was;
    }
    return this;
  }

  /** Atlas-textured part (signs, painted storeys): never inked. */
  tex(geo: BufferGeometry, rect: UvRect, hex = 0xffffff, glow = 0): this {
    this.list.push(textured(geo, rect, hex, glow));
    return this;
  }

  /** Pre-painted geometry (from another Parts or a builder). */
  raw(geo: BufferGeometry): this {
    this.list.push(geo);
    return this;
  }

  box(w: number, h: number, d: number, x: number, y: number, z: number, hex: number, rotY = 0, glow = 0): this {
    const g = new BoxGeometry(w, h, d);
    if (rotY) g.rotateY(rotY);
    return this.add(g.translate(x, y, z), hex, glow);
  }

  /** Box rotated about X then Y, then placed. */
  boxR(w: number, h: number, d: number, x: number, y: number, z: number, hex: number, rx = 0, ry = 0, rz = 0): this {
    const g = new BoxGeometry(w, h, d);
    if (rz) g.rotateZ(rz);
    if (rx) g.rotateX(rx);
    if (ry) g.rotateY(ry);
    return this.add(g.translate(x, y, z), hex);
  }

  cyl(rTop: number, rBot: number, h: number, x: number, y: number, z: number, hex: number, seg = 10, glow = 0): this {
    return this.add(new CylinderGeometry(rTop, rBot, h, seg).translate(x, y, z), hex, glow);
  }

  cone(r: number, h: number, x: number, y: number, z: number, hex: number, seg = 8): this {
    return this.add(new ConeGeometry(r, h, seg).translate(x, y, z), hex);
  }

  sphere(r: number, x: number, y: number, z: number, hex: number, sx = 1, sy = 1, sz = 1, w = 8, h = 6, glow = 0): this {
    return this.add(new SphereGeometry(r, w, h).scale(sx, sy, sz).translate(x, y, z), hex, glow);
  }

  /** A dome sitting on y: an onion (`bulge` > 1) or a raised hemisphere (vc.ts). */
  dome(r: number, x: number, y: number, z: number, hex: number, bulge = 1.15, seg = 14): this {
    const pts: Vector2[] = [];
    const n = 10;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      let f: number;
      let h: number;
      if (bulge > 1.02) {
        const swell = 0.8 + 0.2 * Math.min(1, (bulge - 1) / 0.15);
        f = t < 0.38 ? swell + (1 - swell) * Math.sin((t / 0.38) * (Math.PI / 2)) : Math.pow(Math.cos(((t - 0.38) / 0.62) * (Math.PI / 2)), 1.25);
        h = 1.5;
      } else {
        f = Math.pow(Math.cos(t * (Math.PI / 2)), 0.9);
        h = 1.25;
      }
      pts.push(new Vector2(Math.max(0.001, r * f), t * r * h));
    }
    return this.add(new LatheGeometry(pts, seg).translate(x, y, z), hex);
  }

  geometry(): BufferGeometry {
    return merge(this.list);
  }

  get length(): number {
    return this.list.length;
  }
}

/** A Mughal onion dome striped in wedges round its axis (vc.ts `onion`). */
export function onion(P: Parts, r: number, x: number, y: number, z: number, colours: number[], wedges = 16): void {
  const pts: Vector2[] = [];
  const n = 10;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const f = t < 0.38 ? 0.8 + 0.2 * Math.sin((t / 0.38) * (Math.PI / 2)) : Math.pow(Math.cos(((t - 0.38) / 0.62) * (Math.PI / 2)), 1.25);
    pts.push(new Vector2(Math.max(0.001, r * f), t * r * 1.55));
  }
  if (colours.length === 1) {
    P.add(new LatheGeometry(pts, wedges).translate(x, y, z), colours[0]);
    return;
  }
  for (let i = 0; i < wedges; i++) {
    const g = new LatheGeometry(pts, 1, (i / wedges) * Math.PI * 2, (Math.PI * 2) / wedges);
    P.add(g.translate(x, y, z), colours[i % colours.length]);
  }
}

/** A tapering shaft striped in vertical wedges of `a` and `b` (vc.ts). */
export function stripedShaft(P: Parts, rTop: number, rBot: number, h: number, x: number, y: number, z: number, a: number, b: number, n = 12): void {
  for (let i = 0; i < n; i++) {
    const g = new CylinderGeometry(rTop, rBot, h, 1, 1, true, (i / n) * Math.PI * 2, (Math.PI * 2) / n);
    P.add(g.translate(x, y + h / 2, z), i % 2 ? b : a);
  }
}

/* ------------------------------------------------------------------ */

/**
 * Rigid skinning: each part belongs to exactly one bone (weight 1). Parts are
 * authored in the rig's bind pose, in rig space. The result is one
 * SkinnedMesh and one draw call however many moving parts it has.
 */
export class RigBuilder {
  readonly bones: Bone[] = [];
  private readonly byName = new Map<string, Bone>();
  private readonly parts: BufferGeometry[] = [];
  private readonly rest: Matrix4[] = [];
  /** While > 0, parts added get an ink shell on the same bone. */
  ink = 0;

  /** `pos` is in rig space (bind pose); hierarchy offsets are derived. */
  bone(name: string, parent: string | null, x: number, y: number, z: number): number {
    const b = new Bone();
    b.name = name;
    const world = new Matrix4().makeTranslation(x, y, z);
    if (parent) {
      const p = this.byName.get(parent);
      if (!p) throw new Error(`[world/kit] unknown bone ${parent}`);
      const pi = this.bones.indexOf(p);
      const pw = this.rest[pi];
      b.position.set(x - pw.elements[12], y - pw.elements[13], z - pw.elements[14]);
      p.add(b);
    } else {
      b.position.set(x, y, z);
    }
    this.bones.push(b);
    this.rest.push(world);
    this.byName.set(name, b);
    return this.bones.length - 1;
  }

  index(name: string): number {
    const b = this.byName.get(name);
    if (!b) throw new Error(`[world/kit] unknown bone ${name}`);
    return this.bones.indexOf(b);
  }

  /** Adds pre-painted geometry (from `paint`) bound to `bone`. */
  add(bone: string | number, geo: BufferGeometry): this {
    if (this.ink > 0) this.bind(bone, inkShell(geo, this.ink));
    return this.bind(bone, geo);
  }

  private bind(bone: string | number, geo: BufferGeometry): this {
    const bi = typeof bone === 'number' ? bone : this.index(bone);
    const n = geo.attributes.position.count;
    const si = new Uint16Array(n * 4);
    const sw = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      si[i * 4] = bi;
      sw[i * 4] = 1;
    }
    geo.setAttribute('skinIndex', new BufferAttribute(si, 4));
    geo.setAttribute('skinWeight', new BufferAttribute(sw, 4));
    this.parts.push(geo);
    return this;
  }

  /** Paints and adds every part of a Parts list to one bone. */
  addParts(bone: string | number, P: Parts): this {
    // Shells already made by P stay as they are.
    for (const g of P.list) this.bind(bone, g);
    P.list.length = 0;
    return this;
  }

  get(name: string): Bone {
    const b = this.byName.get(name);
    if (!b) throw new Error(`[world/kit] unknown bone ${name}`);
    return b;
  }

  build(material: Material): { mesh: SkinnedMesh; bones: Record<string, Bone>; tris: number } {
    const geo = merge(this.parts);
    const mesh = new SkinnedMesh(geo, material);
    const root = this.bones[0];
    mesh.add(root);
    mesh.updateMatrixWorld(true);
    mesh.bind(new Skeleton(this.bones));
    // Bones animate far outside the bind-pose bounds (an arm reaching over
    // the counter); characters are always near the user anyway.
    mesh.frustumCulled = false;
    const bones: Record<string, Bone> = {};
    for (const [k, v] of this.byName) bones[k] = v;
    return { mesh, bones, tris: triCount(geo) };
  }
}

function boxWithout(w: number, h: number, d: number, face: number): BufferGeometry {
  const g = new BoxGeometry(w, h, d);
  const idx = Array.from(g.index!.array);
  const f = g.groups[face];
  idx.splice(f.start, f.count);
  g.setIndex(idx);
  g.clearGroups();
  return g;
}

/** A box without its +Z face (a painted plane takes its place, no coplanar fight). */
export function boxNoFront(w: number, h: number, d: number): BufferGeometry {
  return boxWithout(w, h, d, 4);
}

/** A box without its -Z face: facade parts whose back is against a wall or faces away from the street. */
export function boxNoBack(w: number, h: number, d: number): BufferGeometry {
  return boxWithout(w, h, d, 5);
}

/** A plain merged mesh of a Parts list. */
export function partsMesh(P: Parts, material: Material, name = ''): Mesh {
  const m = new Mesh(P.geometry(), material);
  m.name = name;
  return m;
}
