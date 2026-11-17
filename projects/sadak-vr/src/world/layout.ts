/**
 * The real Old Delhi round each spot, from OpenStreetMap via SADAK's map.
 *
 * Every spot sits where SADAK puts its errand on the Purani Sadak map
 * (scripts/osm/build.ts output, public/maps/purani-sadak.json; see
 * osm-data.ts): the kachori stall at the Dariba Kalan corner of Chandni Chowk,
 * Sunita's flowers by the Gauri Shankar temple, Raju's auto in Dariba Kalan,
 * the Lal Quila bus stop on Netaji Subhash Marg, Mohan in Paranthe Wali Gali
 * and Imran at the foot of the Jama Masjid's east stair. Round each one this
 * builds a neighbourhood the way SADAK does (world/roads.ts, buildings.ts,
 * network.ts, the plots its compiler lays along every frontage): Chandni
 * Chowk's two red sandstone carriageways with the median of planters and
 * heritage lamps between them, pavements, tarmac and kerbs on the main road,
 * every frontage plot as one of SADAK's terraced facades (full detail near the
 * spot, painted windows further out, painted boxes beyond), real OSM
 * footprints extruded with painted storeys, wires over the lanes, and the
 * landmarks: the Jama Masjid, Sis Ganj Sahib, the Gauri Shankar temple, the
 * Red Fort's wall across from the bus stop.
 *
 * Ported and adapted from SADAK (game_engine/lib/game/world/*; authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission). Map data (c) OpenStreetMap contributors, ODbL 1.0.
 *
 * Frame: SADAK's map frame, metres, +x east, +z south, street ground y = 0.
 * Only the active spot's neighbourhood is shown; they are 100 to 600 m apart.
 */

import { BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, ExtrudeGeometry, PlaneGeometry, Shape, ShapeUtils, Vector2, Vector3 } from '@iwsdk/core';
import { AREAS, BUILDINGS, LANDMARKS, PLOTS, ROADS, type OsmRoad } from './osm-data.js';
import { INK_FADE, Parts, WHITE_UV, mulberry32, onion, pick, stripedShaft, type UvRect } from './kit.js';
import { FLOOR_H, GROUND_H, buildBuilding, buildFarBuilding } from './buildings.js';
import { WALLS, type Atlas } from './atlas.js';
import { autoStatic, lampPost, planter, pole, rickshawStatic, scooter, tree, wire } from './props.js';
import { buildGurdwara, buildJamaMasjid, masjidSilhouette } from './mosque.js';
import { FACADE, streetMandir } from './spots.js';
import type { SpotId } from './types.js';

export type Pt = [number, number];

/** Where each counter stands (world, ground level) and which way its user side faces (+Z = (sin yaw, cos yaw)). */
export type SpotDef = { x: number; z: number; yaw: number; label: string };

export const SPOTS: Record<SpotId, SpotDef> = {
  // West edge of Dariba Kalan, 4 m in from Chandni Chowk; the shop faces east
  // into the lane (SADAK's spot yaw 1.495), the boulevard on the user's right.
  kachori: { x: 3.45, z: -312.0, yaw: 1.495, label: 'Dariba Kalan corner, Chandni Chowk' },
  // Chandni Chowk's south frontage, just east of the Gauri Shankar temple.
  flowers: { x: 221.23, z: -304.53, yaw: 3.085, label: 'Gauri Shankar temple, Chandni Chowk' },
  // West edge of Dariba Kalan; the user faces north up the lane, the auto pulls up on their right.
  auto: { x: -3.92, z: -100.67, yaw: -0.144, label: 'Dariba Kalan' },
  // West footpath of Netaji Subhash Marg at the Lal Quila stop; the user faces north, the road on their right.
  bus: { x: 281.39, z: -91.1, yaw: -0.0326, label: 'Lal Quila bus stop, Netaji Subhash Marg' },
  // West side of Paranthe Wali Gali, 10 m in from Chandni Chowk (on the user's right).
  paranthe: { x: -278.92, z: -326.07, yaw: 1.5182, label: 'Paranthe Wali Gali' },
  // 7 m east of the foot of the Jama Masjid's east stair, facing up it.
  minaret: { x: 72.39, z: 277.03, yaw: 1.638, label: 'Jama Masjid, east stair' },
};

/** Jama Masjid as SADAK places it (landmark + modelExtent 130 m). */
export const MASJID = { x: -0.9, z: 282, rot: 1.638, w: 130, d: 130 };

/** Counter-local (x, z) of a spot -> world (x, z). */
export function toWorld(id: SpotId, lx: number, lz: number): Pt {
  const s = SPOTS[id];
  const c = Math.cos(s.yaw);
  const n = Math.sin(s.yaw);
  return [s.x + lx * c + lz * n, s.z - lx * n + lz * c];
}

/** World (x, z) -> counter-local (x, z). */
export function toLocal(id: SpotId, x: number, z: number): Pt {
  const s = SPOTS[id];
  const c = Math.cos(s.yaw);
  const n = Math.sin(s.yaw);
  const dx = x - s.x;
  const dz = z - s.z;
  return [dx * c - dz * n, dx * n + dz * c];
}

/** Counter-local boxes [x0, x1, z0, z1] kept clear of plots and OSM footprints (the spot builds its own). */
const CLEAR: Record<SpotId, [number, number, number, number][]> = {
  kachori: [[-4.6, 4.6, -11, 2.4]],
  flowers: [[-4.6, 4.6, -11, 2.6]],
  paranthe: [[-4.6, 4.6, -11, 1.8]],
  auto: [[-1.3, 3.2, -4, 4]],
  bus: [[-2.2, 4.0, -7, 3]],
  minaret: [[-8, 6, -10, 6]],
};

/* ------------------------------------------------------------------ */
/* Polylines                                                           */
/* ------------------------------------------------------------------ */

function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05) out.push(p);
  }
  return out;
}

/** Left-of-travel mitred normals (+x east, +z south), as roads.ts. */
function miter(pts: Pt[]): Pt[] {
  const n: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[i];
    const c = pts[Math.min(pts.length - 1, i + 1)];
    const d1 = unit(b[0] - a[0], b[1] - a[1]) ?? unit(c[0] - b[0], c[1] - b[1]) ?? [1, 0];
    const d2 = unit(c[0] - b[0], c[1] - b[1]) ?? d1;
    const n1: Pt = [d1[1], -d1[0]];
    const n2: Pt = [d2[1], -d2[0]];
    const m = unit(n1[0] + n2[0], n1[1] + n2[1]) ?? n1;
    const k = 1 / Math.max(0.4, m[0] * n1[0] + m[1] * n1[1]);
    n.push([m[0] * k, m[1] * k]);
  }
  return n;
}

function unit(x: number, z: number): Pt | null {
  const L = Math.hypot(x, z);
  return L < 1e-6 ? null : [x / L, z / L];
}

function length(pts: Pt[]): number {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

/** Point and unit tangent at arc length s. */
export function sampleAt(pts: Pt[], s: number): { x: number; z: number; dx: number; dz: number } {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (acc + seg >= s || i === pts.length - 1) {
      const t = seg ? Math.max(0, Math.min(1, (s - acc) / seg)) : 0;
      return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, dx: (b[0] - a[0]) / (seg || 1), dz: (b[1] - a[1]) / (seg || 1) };
    }
    acc += seg;
  }
  const p = pts[0];
  return { x: p[0], z: p[1], dx: 1, dz: 0 };
}

/** Cut `from` metres off the start and `to` off the end (roads.ts trimPolyline). */
function trim(pts: Pt[], from: number, to: number): Pt[] | null {
  const L = length(pts);
  if (from + to >= L - 0.5) return null;
  const out: Pt[] = [];
  const s1 = L - to;
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const at = (s: number): Pt => {
      const t = seg ? (s - acc) / seg : 0;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    };
    if (acc + seg >= from && acc <= s1) {
      if (!out.length) out.push(at(Math.max(from, acc)));
      if (acc + seg <= s1) out.push(b);
      else {
        out.push(at(s1));
        break;
      }
    }
    acc += seg;
  }
  return out.length >= 2 ? out : null;
}

/** The longest run of the polyline inside the circle (cx, cz, r), resampled at the circle. */
function clipToCircle(pts: Pt[], cx: number, cz: number, r: number): Pt[] | null {
  const inside = (p: Pt) => Math.hypot(p[0] - cx, p[1] - cz) <= r;
  const cross = (a: Pt, b: Pt): Pt => {
    // Bisect along a->b for the circle crossing.
    let lo = 0;
    let hi = 1;
    const ain = inside(a);
    for (let k = 0; k < 20; k++) {
      const m = (lo + hi) / 2;
      const p: Pt = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
      if (inside(p) === ain) lo = m;
      else hi = m;
    }
    return [a[0] + (b[0] - a[0]) * lo, a[1] + (b[1] - a[1]) * lo];
  };
  const runs: Pt[][] = [];
  let cur: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (inside(p)) {
      if (!cur.length && i > 0) cur.push(cross(p, pts[i - 1]));
      cur.push(p);
    } else {
      if (cur.length) {
        cur.push(cross(pts[i - 1], p));
        runs.push(cur);
        cur = [];
      } else if (i > 0) {
        // A segment can pass through the circle with both ends outside.
        const a = pts[i - 1];
        const s = segDist(cx, cz, a, p);
        if (s.d < r) {
          const mid: Pt = [a[0] + (p[0] - a[0]) * s.t, a[1] + (p[1] - a[1]) * s.t];
          runs.push([cross(mid, a), mid, cross(mid, p)]);
        }
      }
    }
  }
  if (cur.length) runs.push(cur);
  let best: Pt[] | null = null;
  for (const run of runs) if (run.length >= 2 && (!best || length(run) > length(best))) best = run;
  return best && length(best) > 0.5 ? best : null;
}

function segDist(px: number, pz: number, a: Pt, b: Pt): { d: number; t: number } {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const L = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (pz - a[1]) * dz) / L));
  return { d: Math.hypot(a[0] + dx * t - px, a[1] + dz * t - pz), t };
}

function nearestOn(pts: Pt[], x: number, z: number): { d: number; x: number; z: number } {
  let best = { d: Infinity, x: 0, z: 0 };
  for (let i = 1; i < pts.length; i++) {
    const s = segDist(x, z, pts[i - 1], pts[i]);
    if (s.d < best.d) best = { d: s.d, x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * s.t, z: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * s.t };
  }
  return best;
}

function pointInPoly(x: number, z: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/* ------------------------------------------------------------------ */
/* Raw geometry with the kit's attribute set                            */
/* ------------------------------------------------------------------ */

const _col = new Color();

/** Triangles (flat xyz list, wound counter-clockwise from above) into a kit-compatible geometry. */
function rawGeo(pos: number[], uv: number[] | null, colours: number[] | number): BufferGeometry {
  const n = pos.length / 3;
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  const col = new Float32Array(n * 3);
  if (typeof colours === 'number') {
    _col.setHex(colours);
    for (let i = 0; i < n; i++) _col.toArray(col, i * 3);
  } else col.set(colours);
  g.setAttribute('color', new BufferAttribute(col, 3));
  const uvs = new Float32Array(n * 2);
  if (uv) uvs.set(uv);
  else for (let i = 0; i < n; i++) (uvs[i * 2] = WHITE_UV[0]), (uvs[i * 2 + 1] = WHITE_UV[1]);
  g.setAttribute('uv', new BufferAttribute(uvs, 2));
  g.setAttribute('glow', new BufferAttribute(new Float32Array(n), 1));
  g.setAttribute('ink', new BufferAttribute(new Float32Array(n), 1));
  g.computeVertexNormals();
  return g;
}

/** Apron height: the ground sinks gently away from the spot so the paving laid on it never shares a depth with it far away (the app's near plane is 1 mm). */
const sink = (r: number) => -0.05 - 0.0062 * r;

/**
 * A strip between signed offsets o0 < o1 (left of travel positive) at height
 * y, tiled with an atlas cell every `tile` metres (or one flat colour).
 */
function ribbon(P: Parts, raw: Pt[], o0: number, o1: number, y: number, rect: UvRect | null, tile: number, hex = 0xffffff) {
  const pts = dedupe(raw);
  if (pts.length < 2) return;
  const n = miter(pts);
  const pos: number[] = [];
  const uv: number[] = [];
  const [u0, v0, u1, v1] = rect ?? [0, 0, 1, 1];
  const across = rect ? Math.max(1, Math.ceil((o1 - o0) / tile - 1e-3)) : 1;
  const at = (i: number, o: number) => [pts[i][0] + n[i][0] * o, pts[i][1] + n[i][1] * o];
  let s = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    // Split the segment at tile boundaries along it.
    const cuts = [0];
    if (rect) for (let k = Math.floor(s / tile) + 1; k * tile < s + seg - 1e-3; k++) cuts.push((k * tile - s) / seg);
    cuts.push(1);
    for (let c = 0; c < cuts.length - 1; c++) {
      const ta = cuts[c];
      const tb = cuts[c + 1];
      const sa = s + ta * seg;
      const sb = s + tb * seg;
      const base = Math.floor((sa + 1e-4) / tile) * tile;
      for (let k = 0; k < across; k++) {
        const oa = o0 + (k * (o1 - o0)) / across;
        const ob = o0 + ((k + 1) * (o1 - o0)) / across;
        const corner = (t: number, o: number) => {
          const p = at(i, o);
          const q = at(i + 1, o);
          return [p[0] + (q[0] - p[0]) * t, y, p[1] + (q[1] - p[1]) * t];
        };
        const A = corner(ta, oa);
        const B = corner(tb, oa);
        const C = corner(tb, ob);
        const D = corner(ta, ob);
        // o grows to the left of travel; wind so the face points up.
        pos.push(...A, ...B, ...D, ...B, ...C, ...D);
        if (rect) {
          const fa = (sa - base) / tile;
          const fb = Math.min(1, (sb - base) / tile);
          const ga = ((oa - o0) % tile) / tile;
          const gb = Math.min(1, ga + (ob - oa) / tile);
          const U = (f: number) => u0 + (u1 - u0) * f;
          const V = (f: number) => v0 + (v1 - v0) * f;
          uv.push(U(fa), V(ga), U(fb), V(ga), U(fa), V(gb), U(fb), V(ga), U(fb), V(gb), U(fa), V(gb));
        }
      }
    }
    s += seg;
  }
  P.raw(rawGeo(pos, rect ? uv : null, hex));
}

/** A vertical skirt along offset o from y0 down to y1, facing out (sign +1 left, -1 right). */
function skirt(P: Parts, raw: Pt[], o: number, y0: number, y1: number, face: 1 | -1, hex: number) {
  const pts = dedupe(raw);
  if (pts.length < 2) return;
  const n = miter(pts);
  const pos: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = [pts[i][0] + n[i][0] * o, pts[i][1] + n[i][1] * o];
    const b = [pts[i + 1][0] + n[i + 1][0] * o, pts[i + 1][1] + n[i + 1][1] * o];
    const A = [a[0], y0, a[1]];
    const B = [b[0], y0, b[1]];
    const C = [b[0], y1, b[1]];
    const D = [a[0], y1, a[1]];
    if (face > 0) pos.push(...A, ...B, ...D, ...D, ...B, ...C);
    else pos.push(...A, ...D, ...B, ...B, ...D, ...C);
  }
  P.raw(rawGeo(pos, null, hex));
}

/* ------------------------------------------------------------------ */
/* The neighbourhood                                                   */
/* ------------------------------------------------------------------ */

export type Hood = {
  near: BufferGeometry;
  far: BufferGeometry;
  /** Walking lines for the crowd (world). */
  walks: Pt[][];
  /** A carriageway for the cycle rickshaw, or null. */
  ride: Pt[] | null;
  /** Static contact shadows: [x, z, rx, rz, yaw, strength]. */
  shadows: [number, number, number, number, number, number][];
  /** Bearing (radians, atan2(dx, dz)) toward the Jama Masjid, for the skyline gap. */
  masjidBearing: number;
  /** Triangles per category (debug). */
  stats: Record<string, number>;
};

const triOf = (P: Parts) => P.list.reduce((n, g) => n + (g.index ? g.index.count : g.attributes.position.count) / 3, 0);

const R_NEAR = 24;
const R_MID = 40;
const R_FAR = 104;
const R_BACK = 60;
const R_GROUND = 176;

const isMain = (r: OsmRoad) => r.cls === 'secondary' || r.cls === 'primary' || r.cls === 'tertiary' || r.cls === 'trunk';
const isLane = (r: OsmRoad) => r.cls === 'residential' || r.cls === 'service' || r.cls === 'living_street' || r.cls === 'unclassified';
const isChowk = (r: OsmRoad) => r.name === 'Chandni Chowk';

/** How far a road's own surface reaches from its centreline on each side. */
const reach = (r: OsmRoad) => (isChowk(r) ? 6.5 : r.w / 2 + r.foot);

export function buildHood(id: SpotId, atlas: Atlas): Hood {
  const spot = SPOTS[id];
  const cx = spot.x;
  const cz = spot.z;
  const near = new Parts();
  const far = new Parts();
  const stats: Record<string, number> = {};
  let mark = { n: 0, f: 0 };
  const tally = (k: string) => {
    const n = triOf(near);
    const f = triOf(far);
    stats[k + ':near'] = (stats[k + ':near'] ?? 0) + n - mark.n;
    stats[k + ':far'] = (stats[k + ':far'] ?? 0) + f - mark.f;
    mark = { n, f };
  };
  const rand = mulberry32(Math.round(cx * 13 + cz * 7) >>> 0);
  const shadows: Hood['shadows'] = [];
  const walks: Pt[][] = [];
  let ride: Pt[] | null = null;
  const dist = (x: number, z: number) => Math.hypot(x - cx, z - cz);
  const cleared = (x: number, z: number, pad = 0) => {
    const [lx, lz] = toLocal(id, x, z);
    return CLEAR[id].some(([x0, x1, z0, z1]) => lx > x0 - pad && lx < x1 + pad && lz > z0 - pad && lz < z1 + pad);
  };

  // ---------------- ground: an apron of lane setts, sinking with distance ----------------
  {
    const parks = AREAS.filter((a) => a.kind === 'park' || a.kind === 'plaza' || a.kind === 'market');
    const groundCol = (x: number, z: number): number => {
      for (const a of parks) if (pointInPoly(x, z, a.pts)) return a.kind === 'park' ? 0x8fb36a : 0xd2c2a2;
      return 0xbcae96;
    };
    const tile = 2.4;
    const N = 15; // +/- 36 m textured
    const rect = atlas.rect('setts');
    const pos: number[] = [];
    const uv: number[] = [];
    const col: number[] = [];
    const v = (x: number, z: number) => [x, sink(dist(x, z)), z];
    for (let i = -N; i < N; i++) {
      for (let j = -N; j < N; j++) {
        const x0 = Math.round(cx / tile) * tile + i * tile;
        const z0 = Math.round(cz / tile) * tile + j * tile;
        const A = v(x0, z0);
        const B = v(x0 + tile, z0);
        const C = v(x0 + tile, z0 + tile);
        const D = v(x0, z0 + tile);
        pos.push(...A, ...D, ...B, ...B, ...D, ...C);
        const [u0, v0, u1, v1] = rect;
        uv.push(u0, v1, u0, v0, u1, v1, u1, v1, u0, v0, u1, v0);
        _col.setHex(groundCol(x0 + tile / 2, z0 + tile / 2));
        for (let k = 0; k < 6; k++) col.push(_col.r, _col.g, _col.b);
      }
    }
    near.raw(rawGeo(pos, uv, col));
    // Coarse cells beyond, flat colour.
    const big = 12;
    const ox = Math.round(cx / tile) * tile - N * tile;
    const oz = Math.round(cz / tile) * tile - N * tile;
    const span = N * tile * 2;
    const fpos: number[] = [];
    const fcol: number[] = [];
    const M = Math.ceil((R_GROUND - span / 2) / big);
    for (let i = -M; i < span / big + M; i++) {
      for (let j = -M; j < span / big + M; j++) {
        const x0 = ox + i * big;
        const z0 = oz + j * big;
        if (x0 >= ox - 1e-3 && x0 + big <= ox + span + 1e-3 && z0 >= oz - 1e-3 && z0 + big <= oz + span + 1e-3) continue;
        if (dist(x0 + big / 2, z0 + big / 2) > R_GROUND + big) continue;
        const A = v(x0, z0);
        const B = v(x0 + big, z0);
        const C = v(x0 + big, z0 + big);
        const D = v(x0, z0 + big);
        fpos.push(...A, ...D, ...B, ...B, ...D, ...C);
        _col.setHex(groundCol(x0 + big / 2, z0 + big / 2));
        for (let k = 0; k < 6; k++) fcol.push(_col.r, _col.g, _col.b);
      }
    }
    far.raw(rawGeo(fpos, null, fcol));
  }

  tally('ground');
  // ---------------- roads ----------------
  const roads = ROADS.map((r) => ({ r, pts: clipToCircle(r.pts, cx, cz, R_GROUND - 8) })).filter((x): x is { r: OsmRoad; pts: Pt[] } => !!x.pts);
  const chowk = roads.filter((x) => isChowk(x.r));
  const paving = atlas.rect('paving');
  const pavement = atlas.rect('pavement');
  const tarmac = atlas.rect('tarmac');
  for (const { r, pts } of roads) {
    const d0 = Math.min(...pts.map((p) => dist(p[0], p[1])));
    const textured = d0 < 70;
    if (isChowk(r)) {
      // Red sandstone carriageway (the cover's paving), pale kerb lines.
      ribbon(textured ? near : far, pts, -r.w / 2, r.w / 2, 0.03, textured ? paving : null, 2.4, textured ? 0xffffff : 0xb9543a);
      // Which side is the other carriageway? The pavement goes on the far side.
      const mid = sampleAt(pts, length(pts) / 2);
      let left = false;
      let right = false;
      for (const o of chowk) {
        if (o.r === r) continue;
        const q = nearestOn(o.pts, mid.x, mid.z);
        if (q.d > 7 && q.d < 16) {
          const side = (q.x - mid.x) * mid.dz - (q.z - mid.z) * mid.dx;
          // Left of travel is (dz, -dx).
          if (side > 0) left = true;
          else right = true;
        }
      }
      const P = textured ? near : far;
      if (!left) ribbon(P, pts, r.w / 2, 6.6, 0.03, textured ? pavement : null, 2.0, textured ? 0xffffff : 0xd9c9a8);
      if (!right) ribbon(P, pts, -6.6, -r.w / 2, 0.03, textured ? pavement : null, 2.0, textured ? 0xffffff : 0xd9c9a8);
      if (!left) skirt(P, pts, 6.6, 0.03, -1.2, 1, 0xa89a80);
      if (!right) skirt(P, pts, -6.6, 0.03, -1.2, -1, 0xa89a80);
      // The edge toward the median.
      if (left) skirt(P, pts, r.w / 2, 0.03, -1.2, 1, 0xa89a80);
      if (right) skirt(P, pts, -r.w / 2, 0.03, -1.2, -1, 0xa89a80);
      // The median toward the other carriageway, built once (from the eastbound side).
      if (right && mid.dx > 0) median(near, far, pts, chowk.filter((o) => o.r !== r).map((o) => o.pts), dist, rand, shadows);
      if (d0 < 45) {
        for (const o of [-2.6, 2.6]) walks.push(offset(pts, o));
        if (!left) walks.push(offset(pts, 5.4));
        if (!right) walks.push(offset(pts, -5.4));
        if (!ride || d0 < Math.min(...ride.map((p) => dist(p[0], p[1])))) ride = offset(pts, left ? 1.4 : -1.4);
      }
    } else if (isMain(r)) {
      const P = textured ? near : far;
      ribbon(P, pts, -r.w / 2, r.w / 2, 0.0, textured ? tarmac : null, 3.0, textured ? 0xffffff : 0x5a5650);
      // Lane paint: a dashed centre line.
      if (textured) {
        const L = length(pts);
        for (let s = 1; s < L - 2; s += 6) {
          const a = sampleAt(pts, s);
          const g = new BoxGeometry(0.14, 0.01, 2.6).rotateY(Math.atan2(a.dx, a.dz)).translate(a.x + a.dx * 1.3, 0.006, a.z + a.dz * 1.3);
          near.add(g, 0xf2efe6);
        }
      }
      if (r.foot > 0) {
        for (const s of [-1, 1] as const) {
          const o0 = r.w / 2;
          const o1 = r.w / 2 + r.foot;
          if (s > 0) ribbon(P, pts, o0, o1, 0.15, textured ? pavement : null, 2.0, textured ? 0xffffff : 0xd9c9a8);
          else ribbon(P, pts, -o1, -o0, 0.15, textured ? pavement : null, 2.0, textured ? 0xffffff : 0xd9c9a8);
          // Kerb: painted black and yellow in Delhi; a pale stone face here.
          skirt(P, pts, s * o0, 0.15, -0.02, (-s) as 1 | -1, 0xe8e0c8);
          skirt(P, pts, s * o1, 0.15, -1.2, s, 0xa89a80);
          if (d0 < 45) walks.push(offset(pts, s * (o0 + r.foot / 2)));
        }
      }
      skirt(P, pts, -r.w / 2, 0.0, -1.2, -1, 0x4a4640);
      skirt(P, pts, r.w / 2, 0.0, -1.2, 1, 0x4a4640);
    } else if (r.cls === 'pedestrian') {
      const P = textured ? near : far;
      ribbon(P, pts, -r.w / 2, r.w / 2, 0.03, textured ? pavement : null, 2.0, textured ? 0xffffff : 0xd9c9a8);
      skirt(P, pts, -r.w / 2, 0.03, -1.2, -1, 0xa89a80);
      skirt(P, pts, r.w / 2, 0.03, -1.2, 1, 0xa89a80);
      if (d0 < 45) for (const o of [-1.6, 1.6]) walks.push(offset(pts, o));
    } else if (isLane(r) && d0 < 45) {
      // Lanes are the apron itself (stone setts); walkers keep to the edges.
      for (const o of [-1.4, 1.4]) walks.push(offset(pts, Math.min(o, r.w / 2 - 0.6) * Math.sign(o)));
    }
  }

  tally('roads');
  // ---------------- wires and poles over the lanes ----------------
  for (const { r, pts } of roads) {
    if (!isLane(r)) continue;
    const seg = clipToCircle(pts, cx, cz, 42);
    if (!seg) continue;
    const L = length(seg);
    const poles: Vector3[] = [];
    let side = 1;
    for (let s = 3 + rand() * 6; s < L - 2; s += 13 + rand() * 6) {
      const a = sampleAt(seg, s);
      const nx = a.dz;
      const nz = -a.dx;
      const o = (r.w / 2 + 0.25) * side;
      const px = a.x + nx * o;
      const pz = a.z + nz * o;
      if (cleared(px, pz, 1.5) || dist(px, pz) < 3) continue;
      if (chowk.some((c) => nearestOn(c.pts, px, pz).d < 7.5)) continue;
      pole(near, px, pz, rand() < 0.15);
      poles.push(new Vector3(px, 7.9, pz));
      side = -side;
    }
    for (let i = 0; i < poles.length - 1; i++) {
      for (let k = 0; k < 3; k++) {
        const p = poles[i].clone().add(new Vector3(0, -k * 0.4, 0));
        const q = poles[i + 1].clone().add(new Vector3(0, -((k + i) % 3) * 0.4, 0));
        wire(near, p, q, 0.5 + rand() * 0.9, 0.014);
      }
      // A service drop to a first-floor window.
      const a = sampleAt(seg, (i + 0.5) * (L / Math.max(1, poles.length)));
      const sd = rand() < 0.5 ? 1 : -1;
      wire(near, poles[i].clone().add(new Vector3(0, -1.0, 0)), new Vector3(a.x + a.dz * sd * (r.w / 2 + 0.3), 5.2 + rand(), a.z - a.dx * sd * (r.w / 2 + 0.3)), 0.4, 0.012);
    }
  }

  tally('wires');
  // ---------------- frontage plots: SADAK's terraces ----------------
  let lod0 = 0;
  for (const [x, z, rot, w, d, floors, front, seed] of PLOTS) {
    const r = dist(x, z);
    if (r > R_FAR || (!front && r > R_BACK)) continue;
    // Clear if any corner or the centre falls in the spot's own footprint.
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const corners: Pt[] = [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * w * 0.5) * c + (v * d * 0.5) * s, z - (u * w * 0.5) * s + (v * d * 0.5) * c]);
    if (corners.some(([px, pz]) => cleared(px, pz))) continue;
    const Q = new Parts();
    let lod: 0 | 1 | 2 = front && r < R_NEAR ? 0 : front && r < R_MID ? 1 : 2;
    if (lod === 0 && lod0 >= 10) lod = 1;
    const spec = { w, d, floors, seed, wall: WALLS[seed % WALLS.length], lod: (lod === 0 ? 0 : 1) as 0 | 1, ink: lod === 0 ? INK_FADE.facade : 0 };
    if (lod === 0) lod0++;
    if (lod < 2) buildBuilding(Q, atlas, spec);
    else if (front) buildFarBuilding(Q, atlas, spec);
    else backBlock(Q, w, d, floors, spec.wall, rand, r < 50 ? atlas : null);
    // Footing down to the sunken ground.
    Q.add(new BoxGeometry(w, 1.2, d).translate(0, -0.6, 0), 0x8a7a64);
    (lod < 2 ? near : far).raw(Q.geometry().rotateY(rot).translate(x, 0, z));
    tally(`plots${lod}`);
  }

  // ---------------- real OSM footprints ----------------
  BUILDINGS.forEach((b, bi) => {
    const pts = dedupe(b.pts);
    if (pts.length > 3 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 0.1) pts.pop();
    if (pts.length < 3) return;
    const ctr = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length] as Pt, [0, 0] as Pt);
    let dmin = Infinity;
    for (const p of pts) dmin = Math.min(dmin, dist(p[0], p[1]));
    if (dmin > R_FAR) return;
    if (pts.some(([px, pz]) => cleared(px, pz)) || cleared(ctr[0], ctr[1])) return;
    extrudeFootprint(dmin < R_MID ? near : far, atlas, pts, b.h, bi, dmin < 70, dmin < 40 ? INK_FADE.facade : 0);
  });

  tally('osm');
  // ---------------- landmarks ----------------
  for (const l of LANDMARKS) {
    const r = dist(l.x, l.z);
    if (l.model === 'gurdwara_small' && r < 175) {
      const Q = new Parts();
      Q.ink = r < 40 ? INK_FADE.facade : 0;
      buildGurdwara(Q, 26, 26);
      far.raw(Q.geometry().rotateY(l.rot).translate(l.x, 0, l.z));
    } else if (l.model === 'temple' && r < 175) {
      // The Gauri Shankar temple: SADAK's street mandir, at the real temple's size.
      const Q = new Parts();
      Q.ink = r < 40 ? INK_FADE.facade : 0;
      streetMandir(Q, atlas, 0, 0, 0);
      const g = Q.geometry().scale(1.9, 1.75, 1.9);
      g.translate(0, 0, 1.0);
      Q.add(new BoxGeometry(9, 1.2, 9).translate(0, -0.6, 0), 0x8a7a64);
      const footing = Q.geometry();
      (r < R_MID ? near : far).raw(g.rotateY(l.rot).translate(l.x, 0, l.z));
      far.raw(footing.rotateY(l.rot).translate(l.x, 0, l.z));
      shadows.push([l.x, l.z, 4.2, 4.2, l.rot, 0.35]);
    }
  }
  // Jama Masjid: in full at the minaret spot, a skyline silhouette elsewhere.
  const mdx = MASJID.x - cx;
  const mdz = MASJID.z - cz;
  const mdist = Math.hypot(mdx, mdz);
  const masjidBearing = Math.atan2(mdx, mdz);
  if (mdist < 200) {
    const Q = new Parts();
    buildJamaMasjid(Q, MASJID.w, MASJID.d, 'near');
    Q.add(new BoxGeometry(MASJID.w, 1.2, MASJID.d).translate(0, -0.6, 0), 0x8a5a44);
    far.raw(Q.geometry().rotateY(MASJID.rot).translate(MASJID.x, 0, MASJID.z));
  } else {
    // Seen over the rooftops at its true bearing, drawn in at 150 m and
    // enlarged a little so its domes and minarets clear the nearer roofs.
    const D = 150;
    const k = Math.min(1, (D / mdist) * 1.9);
    const Q = new Parts();
    masjidSilhouette(Q, MASJID.w, MASJID.d);
    const g = Q.geometry().rotateY(MASJID.rot).scale(k, k, k);
    g.translate(cx + (mdx / mdist) * D, -0.4, cz + (mdz / mdist) * D);
    far.raw(g);
  }
  // The Red Fort's wall across the grounds from the Lal Quila stop.
  if (dist(350, -90) < 150) fortWall(far, 352, -260, 352, 80);

  tally('landmarks');
  // ---------------- the spot's own shop building ----------------
  shopBuilding(id, near, atlas);

  // ---------------- spot-specific furniture ----------------
  parkedTraffic(id, near, rand, shadows);

  tally('shop+parked');
  // Keep walkers off the user's chair and the stall.
  const keep = walks
    .map((w) => clipToCircle(w, cx, cz, 44))
    .filter((w): w is Pt[] => !!w && length(w) > 8 && w.every(([x, z]) => !cleared(x, z, 0.8) && dist(x, z) > 2.8));
  return { near: near.geometry(), far: far.geometry(), walks: keep, ride: ride && !(ride as Pt[]).some(([x, z]) => dist(x, z) < 2.8) ? clipToCircle(ride, cx, cz, 48) : null, shadows, masjidBearing, stats };
}

function offset(pts: Pt[], o: number): Pt[] {
  const p = dedupe(pts);
  const n = miter(p);
  return p.map((q, i) => [q[0] + n[i][0] * o, q[1] + n[i][1] * o] as Pt);
}

/** Chandni Chowk's median: a raised sandstone strip with planters and heritage lamps (the redeveloped street). */
function median(near: Parts, far: Parts, pts: Pt[], others: Pt[][], dist: (x: number, z: number) => number, rand: () => number, shadows: Hood['shadows']) {
  const L = length(pts);
  const line: Pt[] = [];
  const widths: number[] = [];
  for (let s = 0; s <= L; s += 3) {
    const a = sampleAt(pts, s);
    let best = { d: Infinity, x: 0, z: 0 };
    for (const o of others) {
      const q = nearestOn(o, a.x, a.z);
      const side = (q.x - a.x) * a.dz - (q.z - a.z) * a.dx;
      if (side < 0 && q.d < best.d) best = q;
    }
    if (best.d < 7 || best.d > 16) continue;
    line.push([(a.x + best.x) / 2, (a.z + best.z) / 2]);
    widths.push(best.d - 8);
  }
  if (line.length < 2) return;
  const w = Math.max(1.2, Math.min(3.4, widths.reduce((a, b) => a + b, 0) / widths.length - 0.3));
  const d0 = Math.min(...line.map((p) => dist(p[0], p[1])));
  const P = d0 < 70 ? near : far;
  ribbon(P, line, -w / 2, w / 2, 0.18, null, 1, 0xcfc3ad);
  skirt(P, line, w / 2, 0.18, -1.0, 1, 0xe8e0d0);
  skirt(P, line, -w / 2, 0.18, -1.0, -1, 0xe8e0d0);
  // Lamps and planters every 13 m, the nearest with full detail.
  const ML = length(line);
  for (let s = 4; s < ML - 4; s += 13) {
    const a = sampleAt(line, s);
    const yaw = Math.atan2(a.dz, a.dx);
    const r = dist(a.x, a.z);
    if (r > 120) continue;
    const Q = new Parts();
    if (r < 45) Q.ink = INK_FADE.facade;
    lampPost(Q, 0, 0);
    if (s + 6.5 < ML - 2) planter(Q, 6.5, 0, Math.min(5.5, w * 2.2), rand);
    const g = Q.geometry().rotateY(-yaw).translate(a.x, 0.18, a.z);
    (r < 70 ? near : far).raw(g);
    const b = sampleAt(line, s + 6.5);
    shadows.push([b.x, b.z, 2.9, 0.62, -yaw, 0.45]);
  }
}

/** A back-lot block seen over the frontage: a box with a parapet and a tank; painted storeys on every side when near. */
function backBlock(P: Parts, w: number, d: number, floors: number, wall: number, rand: () => number, atlas: Atlas | null) {
  const h = GROUND_H + floors * FLOOR_H - 0.8;
  if (!atlas) P.add(new BoxGeometry(w, h, d).translate(0, h / 2, 0), shadeHex(wall, 0.92));
  else P.add(new PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(0, h, 0), shadeHex(wall, 0.92));
  P.add(new BoxGeometry(w + 0.2, 0.25, d + 0.2).translate(0, h + 0.12, 0), 0xf2ead8);
  if (rand() < 0.45) P.cyl(0.5, 0.5, 1.1, (rand() - 0.5) * (w - 1.5), h + 0.8, (rand() - 0.5) * (d - 1.5), 0x26272b, 6);
  if (!atlas) return;
  const wi = Math.max(0, WALLS.indexOf(wall));
  for (let k = 0; k < 4; k++) {
    const len = k % 2 ? d : w;
    const off = (k % 2 ? w : d) / 2;
    const frac = Math.min(1, len / 8);
    const gh = GROUND_H - 0.8;
    P.add(new PlaneGeometry(len, gh).translate(0, gh / 2, off).rotateY((k * Math.PI) / 2), shadeHex(wall, 0.85));
    for (let f = 0; f < floors; f++) {
      const y = GROUND_H + f * FLOOR_H + FLOOR_H / 2 - 0.8;
      const [u0, v0, u1, v1] = atlas.rect(`floor:${wi}:${(f + k) % 2}`);
      P.tex(new PlaneGeometry(len, FLOOR_H).translate(0, y, off).rotateY((k * Math.PI) / 2), [u0, v0, u0 + (u1 - u0) * frac, v1]);
    }
  }
}

function shadeHex(hex: number, k: number): number {
  return _col.setHex(hex).multiplyScalar(k).getHex();
}

/** An OSM footprint extruded to its height: painted storeys and a shop band on every wall, a flat roof. */
function extrudeFootprint(P: Parts, atlas: Atlas, pts: Pt[], h: number, seed: number, painted: boolean, ink: number) {
  const wi = seed % WALLS.length;
  const wall = WALLS[wi];
  // Winding: outward normal test.
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const out = area > 0 ? 1 : -1;
  const floors = Math.max(1, Math.floor((h - GROUND_H) / FLOOR_H));
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 0.2) continue;
    const dx = (b[0] - a[0]) / len;
    const dz = (b[1] - a[1]) / len;
    const nx = dz * out;
    const nz = -dx * out;
    const yaw = Math.atan2(nx, nz);
    const segs = Math.max(1, Math.round(len / 8));
    const sl = len / segs;
    for (let k = 0; k < segs; k++) {
      const mx = a[0] + dx * sl * (k + 0.5);
      const mz = a[1] + dz * sl * (k + 0.5);
      const frac = Math.min(1, sl / 8);
      const quad = (y0: number, y1: number, cell: string | null) => {
        const g = new PlaneGeometry(sl, y1 - y0).translate(0, (y0 + y1) / 2, 0).rotateY(yaw).translate(mx, 0, mz);
        if (cell && painted) {
          const [u0, v0, u1, v1] = atlas.rect(cell);
          P.tex(g, [u0, v0, u0 + (u1 - u0) * frac, v1]);
        } else P.add(g, wall);
      };
      quad(-1.2, GROUND_H, `shops:${wi}`);
      for (let f = 0; f < floors; f++) quad(GROUND_H + f * FLOOR_H, GROUND_H + (f + 1) * FLOOR_H, `floor:${wi}:${(f + k) % 2}`);
      if (GROUND_H + floors * FLOOR_H < h - 0.05) quad(GROUND_H + floors * FLOOR_H, h, null);
    }
  }
  // Roof and parapet line.
  const contour = pts.map((p) => new Vector2(p[0], p[1]));
  const tris = ShapeUtils.triangulateShape(contour, []);
  const pos: number[] = [];
  for (const [i, j, k] of tris) {
    // Wind counter-clockwise seen from above (+y): in x/z with +z south that is clockwise in (x, z).
    const A = [pts[i][0], h, pts[i][1]];
    const B = [pts[j][0], h, pts[j][1]];
    const C = [pts[k][0], h, pts[k][1]];
    const cross = (B[0] - A[0]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[0] - A[0]);
    if (cross < 0) pos.push(...A, ...B, ...C);
    else pos.push(...A, ...C, ...B);
  }
  P.raw(rawGeo(pos, null, 0xd8ccb4));
  if (ink > 0) {
    const s = new Shape(contour.map((p) => new Vector2(p.x, -p.y)));
    const g = new ExtrudeGeometry(s, { depth: h + 1.2, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, -1.2, 0);
    P.inkOnly(g, ink);
  }
}

/** The Red Fort's curtain wall: red sandstone, crenellated, round bastions with chhatris. */
function fortWall(P: Parts, x0: number, z0: number, x1: number, z1: number) {
  const STONE = 0xb04a32;
  const len = Math.hypot(x1 - x0, z1 - z0);
  const yaw = Math.atan2(x1 - x0, z1 - z0);
  const Q = new Parts();
  const H = 18;
  Q.add(new BoxGeometry(5, H, len).translate(0, H / 2 - 1, 0), STONE);
  Q.add(new BoxGeometry(5.4, 0.6, len).translate(0, H * 0.55, 0), 0xc9b28a);
  for (let s = -len / 2 + 1; s < len / 2; s += 2.2) Q.add(new BoxGeometry(0.6, 1.4, 1.2).translate(-2.4, H - 0.3, s), STONE);
  for (let s = -len / 2 + 20; s < len / 2; s += 70) {
    Q.add(new CylinderGeometry(6, 7, H + 2, 12).translate(-1, (H + 2) / 2 - 1, s), STONE);
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) Q.add(new BoxGeometry(0.5, 3.2, 0.5).translate(-1 + a * 2, H + 2.6, s + b * 2), 0xe9dcc4);
    Q.add(new BoxGeometry(5.4, 0.4, 5.4).translate(-1, H + 4.4, s), 0xe9dcc4);
    onion(Q, 2.4, -1, H + 4.6, s, [0xf4efe6], 10);
  }
  void stripedShaft;
  P.raw(Q.geometry().rotateY(yaw).translate((x0 + x1) / 2, 0, (z0 + z1) / 2));
}

/** The building round a shop-bay spot: SADAK's terrace with its middle bay left open for the stall's own shop. */
function shopBuilding(id: SpotId, P: Parts, atlas: Atlas) {
  const look: Partial<Record<SpotId, { wall: number; floors: number; seed: number }>> = {
    kachori: { wall: 0x8fc9a6, floors: 3, seed: 1931 },
    flowers: { wall: 0xf5c53a, floors: 3, seed: 977 },
    paranthe: { wall: 0xe0722f, floors: 3, seed: 1872 },
  };
  const l = look[id];
  if (!l) return;
  const s = SPOTS[id];
  const Q = new Parts();
  buildBuilding(Q, atlas, { w: 8.4, d: 9, floors: l.floors, seed: l.seed, wall: l.wall, skipBays: [1], lod: 0, ink: INK_FADE.facade });
  Q.add(new BoxGeometry(8.4, 1.2, 9).translate(0, -0.6, 0), 0x8a7a64);
  const g = Q.geometry().translate(0, 0, -FACADE - 4.5);
  if (id === 'kachori') {
    // The corner onto Chandni Chowk (local +x): a shopfront veneer on the side wall.
    const V = new Parts();
    buildBuilding(V, atlas, { w: 8.8, d: 0.8, floors: l.floors, seed: 4411, wall: 0xf28fa0, lod: 1, ink: INK_FADE.facade });
    P.raw(V.geometry().rotateY(Math.PI / 2).translate(4.05, 0, -FACADE - 4.5).rotateY(s.yaw).translate(s.x, 0, s.z));
  }
  P.raw(g.rotateY(s.yaw).translate(s.x, 0, s.z));
}

/** Parked rickshaws, scooters and autos near each spot (baked into the near mesh). */
function parkedTraffic(id: SpotId, P: Parts, rand: () => number, shadows: Hood['shadows']) {
  const place: [number, number, number, 'auto' | 'rickshaw' | 'scooter' | 'tree'][] = {
    // [counter-local x, z, yaw (local), kind]
    kachori: [[5.4, -4.0, 0.15, 'scooter'], [-5.2, 1.4, Math.PI / 2 + 0.1, 'scooter'], [8.6, 5.0, Math.PI / 2 + 0.2, 'rickshaw'], [10.5, -6.5, -Math.PI / 2, 'rickshaw']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter'][],
    flowers: [[-8.6, 3.0, Math.PI / 2, 'rickshaw'], [6.0, 1.0, 0.1, 'scooter'], [9.5, 6.5, -Math.PI / 2 + 0.2, 'rickshaw']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter'][],
    auto: [[-1.6, -6.5, 0.05, 'scooter'], [-1.5, 7.0, -0.1, 'scooter'], [2.4, -14, Math.PI, 'rickshaw']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter'][],
    bus: [[3.8, 13, Math.PI, 'auto'], [3.8, -16, Math.PI, 'auto'], [-1.6, 4.5, 0.05, 'scooter'], [-3.0, -8.5, 0, 'tree'], [-3.0, 10.5, 0, 'tree'], [14, 20, 0, 'tree'], [16, -12, 0, 'tree']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter' | 'tree'][],
    paranthe: [[-1.4, 4.8, 0.0, 'scooter'], [-1.2, -5.6, 0.1, 'scooter']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter'][],
    minaret: [[-9, 9, 1.4, 'rickshaw'], [5, 11, -1.2, 'rickshaw'], [11, -4, 0.3, 'tree'], [11, 10, 0.3, 'tree']] as [number, number, number, 'auto' | 'rickshaw' | 'scooter' | 'tree'][],
  }[id];
  const s = SPOTS[id];
  for (const [lx, lz, lyaw, kind] of place) {
    const [x, z] = toWorld(id, lx, lz);
    const yaw = s.yaw + lyaw;
    const Q = new Parts();
    if (kind !== 'tree') Q.ink = INK_FADE.vehicle;
    if (kind === 'auto') autoStatic(Q, 0, 0, 0);
    else if (kind === 'rickshaw') rickshawStatic(Q, 0, 0, 0, Math.floor(rand() * 50));
    else if (kind === 'scooter') scooter(Q, 0, 0, 0, pick([0x2f6fb3, 0xd8342c, 0x1a1a1a, 0xf2efe6, 0x2aa36b], rand));
    else tree(Q, 0, 0, Math.floor(rand() * 999));
    P.raw(Q.geometry().rotateY(yaw).translate(x, 0, z));
    if (kind === 'auto') shadows.push([x, z, 0.85, 1.45, yaw, 0.75]);
    else if (kind === 'rickshaw') shadows.push([x, z, 0.75, 1.5, yaw, 0.7]);
    else if (kind === 'scooter') shadows.push([x, z, 0.3, 0.7, yaw, 0.6]);
    else shadows.push([x, z, 1.4, 1.4, 0, 0.4]);
  }
}

export { FACADE };
