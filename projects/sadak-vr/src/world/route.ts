/**
 * Ride routes through the real street network (osm-data.ts), after SADAK's
 * world/route.ts and network.ts: the road graph's nodes are the OSM junctions,
 * each road an edge weighted by its length and how well the vehicle suits it;
 * a ride joins the nearest road at each end and takes the cheapest path.
 *
 * The path is then smoothed and given a speed profile for seated comfort:
 * speed capped per vehicle, the yaw rate held under 20 deg/s by slowing for
 * curves, and acceleration and braking at or under 1 m/s^2.
 */

import { ROADS, type OsmRoad } from './osm-data.js';
import type { RideKind } from './types.js';
import type { Pt } from './layout.js';

export const RIDE_SPEED: Record<RideKind, number> = { rickshaw: 2.5, auto: 6, bus: 5 };
export const MAX_ACCEL = 0.9;
export const MAX_YAW_RATE = (18 * Math.PI) / 180;

/** How much each vehicle dislikes a road class (x length). Infinity: never. */
function cost(kind: RideKind, r: OsmRoad): number {
  if (r.cls === 'footway' || r.cls === 'steps') return Infinity;
  const main = r.cls === 'secondary' || r.cls === 'primary' || r.cls === 'tertiary' || r.cls === 'trunk';
  if (kind === 'bus') return main ? 1 : r.cls === 'pedestrian' ? 6 : 2.5;
  if (kind === 'auto') return r.cls === 'pedestrian' ? 2.5 : 1;
  return main ? 1.6 : 1;
}

function len(pts: Pt[]): number {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

/** Nearest point on any usable road: road index, segment, param, arc length from the road's start. */
function project(kind: RideKind, x: number, z: number) {
  let best = { ri: -1, s: 0, d: Infinity, x: 0, z: 0 };
  ROADS.forEach((r, ri) => {
    if (!Number.isFinite(cost(kind, r))) return;
    let acc = 0;
    for (let i = 1; i < r.pts.length; i++) {
      const a = r.pts[i - 1];
      const b = r.pts[i];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const L2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L2));
      const px = a[0] + dx * t;
      const pz = a[1] + dz * t;
      const d = Math.hypot(px - x, pz - z);
      if (d < best.d) best = { ri, s: acc + Math.sqrt(L2) * t, d, x: px, z: pz };
      acc += Math.sqrt(L2);
    }
  });
  return best;
}

/** The part of a road's polyline between arc lengths s0 and s1 (either order). */
function slice(pts: Pt[], s0: number, s1: number): Pt[] {
  const rev = s1 < s0;
  const a = Math.min(s0, s1);
  const b = Math.max(s0, s1);
  const out: Pt[] = [];
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i];
    const q = pts[i + 1];
    const seg = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const at = (s: number): Pt => {
      const t = seg ? (s - acc) / seg : 0;
      return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    };
    if (acc + seg >= a && acc <= b) {
      if (!out.length) out.push(at(Math.max(a, acc)));
      if (acc + seg <= b) out.push(q);
      else {
        out.push(at(b));
        break;
      }
    }
    acc += seg;
  }
  return rev ? out.reverse() : out;
}

/** A route along roads from (ax, az) to (bx, bz) for `kind`, as a polyline. */
export function findRoute(kind: RideKind, ax: number, az: number, bx: number, bz: number): Pt[] {
  const A = project(kind, ax, az);
  const B = project(kind, bx, bz);
  if (A.ri < 0 || B.ri < 0) return [[ax, az], [bx, bz]];
  if (A.ri === B.ri) return slice(ROADS[A.ri].pts, A.s, B.s);
  // Graph: node id -> [road index, other node, cost].
  const adj = new Map<number, [number, number, number][]>();
  const lens = ROADS.map((r) => len(r.pts));
  ROADS.forEach((r, ri) => {
    const c = cost(kind, r);
    if (!Number.isFinite(c)) return;
    for (const [u, v] of [[r.a, r.b], [r.b, r.a]]) {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u)!.push([ri, v, lens[ri] * c]);
    }
  });
  // Dijkstra from both ends of A's road.
  const ra = ROADS[A.ri];
  const ca = cost(kind, ra);
  const dist = new Map<number, number>();
  const prev = new Map<number, [number, number]>();
  const open: [number, number][] = [];
  const push = (n: number, d: number, via: [number, number] | null) => {
    if (d < (dist.get(n) ?? Infinity)) {
      dist.set(n, d);
      if (via) prev.set(n, via);
      else prev.delete(n);
      open.push([d, n]);
    }
  };
  push(ra.a, A.s * ca, null);
  push(ra.b, (lens[A.ri] - A.s) * ca, null);
  const seen = new Set<number>();
  while (open.length) {
    open.sort((p, q) => p[0] - q[0]);
    const [d, n] = open.shift()!;
    if (seen.has(n)) continue;
    seen.add(n);
    for (const [ri, v, c] of adj.get(n) ?? []) push(v, d + c, [n, ri]);
  }
  const rb = ROADS[B.ri];
  const cb = cost(kind, rb);
  const viaA = (dist.get(rb.a) ?? Infinity) + B.s * cb;
  const viaB = (dist.get(rb.b) ?? Infinity) + (lens[B.ri] - B.s) * cb;
  const endNode = viaA <= viaB ? rb.a : rb.b;
  if (!Number.isFinite(Math.min(viaA, viaB))) return [[ax, az], [bx, bz]];
  // Walk back to A's road.
  const chain: [number, number][] = [];
  let n = endNode;
  while (prev.has(n)) {
    const [p, ri] = prev.get(n)!;
    chain.unshift([p, ri]);
    n = p;
  }
  const out: Pt[] = [];
  const append = (pts: Pt[]) => {
    for (const p of pts) {
      const q = out[out.length - 1];
      if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05) out.push(p);
    }
  };
  append(slice(ra.pts, A.s, n === ra.a ? 0 : lens[A.ri]));
  for (const [from, ri] of chain) {
    const r = ROADS[ri];
    append(from === r.a ? r.pts : [...r.pts].reverse());
  }
  append(slice(rb.pts, endNode === rb.a ? 0 : lens[B.ri], B.s));
  return out.length >= 2 ? out : [[ax, az], [bx, bz]];
}

/** Resample at `step` metres and round the corners (a few passes of Chaikin). */
export function smooth(pts: Pt[], step = 1): Pt[] {
  let p = pts;
  for (let k = 0; k < 4; k++) {
    const q: Pt[] = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i];
      const b = p[i + 1];
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  // Uniform resample.
  const L = len(p);
  const n = Math.max(2, Math.ceil(L / step));
  const out: Pt[] = [];
  let acc = 0;
  let i = 1;
  for (let k = 0; k <= n; k++) {
    const s = (L * k) / n;
    while (i < p.length - 1 && acc + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) < s) {
      acc += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      i++;
    }
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) || 1;
    const t = Math.max(0, Math.min(1, (s - acc) / seg));
    out.push([p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]);
  }
  return out;
}

/** Shift a polyline `o` metres to the left of travel (India keeps left). */
export function keepLeft(pts: Pt[], o: number): Pt[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const L = Math.hypot(dx, dz) || 1;
    // Left of travel in +x east / +z south is (dz, -dx).
    return [p[0] + (dz / L) * o, p[1] - (dx / L) * o] as Pt;
  });
}

/** A pose sampled along a leg: position, heading (unit travel direction), speed. */
export type Pose = { x: number; z: number; dx: number; dz: number; v: number };

/**
 * Time-parametrised motion along `pts` (resampled at 1 m): speed limited by
 * `vmax`, by the yaw-rate cap on curves, and by acceleration both ways.
 * `v0`, `v1`: speed at the start and the end.
 */
export class Leg {
  readonly pts: Pt[];
  readonly s: number[];
  readonly t: number[];
  readonly v: number[];
  readonly duration: number;
  readonly length: number;

  constructor(pts: Pt[], vmax: number, v0: number, v1: number) {
    this.pts = pts;
    const n = pts.length;
    const s = [0];
    for (let i = 1; i < n; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    this.s = s;
    this.length = s[n - 1];
    // Curvature limit, averaged over a 6 m window (a corner taken as a curve):
    // heading change per metre -> v <= yawRate / kappa.
    const head: number[] = [];
    for (let i = 0; i < n - 1; i++) head.push(Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]));
    head.push(head[head.length - 1] ?? 0);
    const v: number[] = new Array(n).fill(vmax);
    const W = 3;
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, i - W);
      const b = Math.min(n - 1, i + W);
      let dh = Math.abs(head[b] - head[a]);
      if (dh > Math.PI) dh = Math.PI * 2 - dh;
      const ds = s[b] - s[a] || 1;
      const kappa = dh / ds;
      if (kappa > 1e-4) v[i] = Math.max(0.8, Math.min(vmax, MAX_YAW_RATE / kappa));
    }
    v[0] = Math.min(v[0], v0);
    v[n - 1] = Math.min(v[n - 1], v1);
    for (let i = 1; i < n; i++) v[i] = Math.min(v[i], Math.sqrt(v[i - 1] ** 2 + 2 * MAX_ACCEL * (s[i] - s[i - 1])));
    for (let i = n - 2; i >= 0; i--) v[i] = Math.min(v[i], Math.sqrt(v[i + 1] ** 2 + 2 * MAX_ACCEL * (s[i + 1] - s[i])));
    this.v = v;
    const t = [0];
    for (let i = 1; i < n; i++) {
      const vm = Math.max(0.05, (v[i] + v[i - 1]) / 2);
      t.push(t[i - 1] + (s[i] - s[i - 1]) / vm);
    }
    this.t = t;
    this.duration = t[n - 1];
  }

  /** Pose at time `time` (clamped); heading from a short look-ahead so it turns smoothly. */
  at(time: number, out: Pose): Pose {
    const t = this.t;
    const n = t.length;
    const T = Math.max(0, Math.min(this.duration, time));
    let i = 1;
    let lo = 1;
    let hi = n - 1;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (t[m] < T) lo = m + 1;
      else hi = m;
    }
    i = lo;
    const f = (T - t[i - 1]) / ((t[i] - t[i - 1]) || 1);
    const p = this.pts;
    out.x = p[i - 1][0] + (p[i][0] - p[i - 1][0]) * f;
    out.z = p[i - 1][1] + (p[i][1] - p[i - 1][1]) * f;
    const a = p[Math.max(0, i - 2)];
    const b = p[Math.min(n - 1, i + 1)];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    out.dx = (b[0] - a[0]) / L;
    out.dz = (b[1] - a[1]) / L;
    out.v = this.v[i - 1] + (this.v[i] - this.v[i - 1]) * f;
    return out;
  }

  /** Arc length at `time`. */
  sAt(time: number): number {
    const p = this.at(time, { x: 0, z: 0, dx: 0, dz: 0, v: 0 });
    void p;
    const T = Math.max(0, Math.min(this.duration, time));
    let i = 1;
    while (i < this.t.length - 1 && this.t[i] < T) i++;
    const f = (T - this.t[i - 1]) / ((this.t[i] - this.t[i - 1]) || 1);
    return this.s[i - 1] + (this.s[i] - this.s[i - 1]) * f;
  }
}

/** The sub-polyline of `pts` between arc lengths a and b. */
export function cut(pts: Pt[], a: number, b: number): Pt[] {
  return slice(pts, a, b);
}
