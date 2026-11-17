/**
 * Dev-only preview of the street world (not shipped; see world-preview.html).
 *
 * Renders buildStreet() with a plain WebGLRenderer, the app's camera near/far
 * (0.001 / 200, iwsdk.config.json) so depth fighting shows up here first, and
 * a flat grey background standing in for passthrough.
 *
 * Query params:
 *   spot=kachori|flowers|auto|paranthe|bus|minaret   view=seat|vendor|side|wide|street|top|awe|cover|up
 *   reveal=<m> (default 100)    t=<s> simulated seconds (default 6)
 *   gesture=offer|receive|wave|nod|shake|namaste (fired 1.4 s before t)
 *   talk=1                      table=<m> (default 0.74)
 *   arrive=1 (auto spot: auto arrives 3 s before t)   budget=1 (no culling)
 *   clean=1 (hide the HUD)      live=1 (keep animating)
 *   ride=<to>:<rickshaw|auto|bus> (ride starts 0.2 s in; t = seconds into the ride)
 *   busarrive=1 (bus spot: the bus arrives 4 s before t)   dpr=<n> pixel ratio
 * Keys: 1/2/3 spot, q/w/e/r/t view, g gesture cycle, k talk, a arrive/leave,
 *   [ / ] reveal radius.
 */

import { Color, Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer, type Bone, type Object3D } from '@iwsdk/core';
import { SPOTS, MASJID } from '../../src/world/layout.js';
import { buildStreet } from '../../src/world/street.js';
import type { Gesture, RideKind, SpotId } from '../../src/world/types.js';

const q = new URLSearchParams(location.search);
let spot = (q.get('spot') ?? 'kachori') as SpotId;
let view = q.get('view') ?? 'seat';
let reveal = Number(q.get('reveal') ?? 100);
const T = Number(q.get('t') ?? 6);
const table = Number(q.get('table') ?? 0.74);
const live = q.get('live') === '1';
if (q.get('clean') === '1') document.body.classList.add('clean');

const renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Number(q.get('dpr') ?? 1));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new Scene();
// Passthrough stand-in: a muted room grey.
scene.background = new Color(0x5f5a54);
const camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.001, 200);

// Director stand-in: the anchor on a 0.74 m table top in the room.
const anchor = new Group();
anchor.position.set(0, table, -0.55);
scene.add(anchor);
const t0 = performance.now();
const street = buildStreet();
const buildMs = performance.now() - t0;
anchor.add(street.group);
street.setTableHeight(table);
street.setActive(spot);
street.setReveal(reveal);

function findBone(root: Object3D, name: string): Bone | null {
  let b: Bone | null = null;
  root.traverse((o) => {
    if (!b && o.name === name && (o as Bone).isBone) b = o as Bone;
  });
  return b;
}

const SEAT_EYE = new Vector3(0, 0.45, 0.45);
/** Street views: [camera, target] in the street (map) frame. */
const STREET_VIEW: Record<SpotId, [[number, number, number], [number, number, number]]> = {
  kachori: [[8, 1.6, -322], [-110, 8, -332]],
  flowers: [[226, 1.6, -310], [120, 8, -318]],
  auto: [[-1, 1.6, -92], [-12, 4, -150]],
  bus: [[282.6, 1.6, -66], [287, 5, -150]],
  paranthe: [[-279, 1.6, -314], [-278, 6, -345]],
  minaret: [[96, 1.6, 279], [-10, 22, 282]],
};
void SPOTS;
const tmp = new Vector3();
function placeCamera() {
  anchor.updateMatrixWorld(true);
  const v = street.spots[spot].vendor;
  const head = findBone(v.root, 'head');
  const face = new Vector3();
  if (head) head.getWorldPosition(face);
  face.y += 0.08;
  camera.fov = 70;
  if (view === 'seat') {
    // Quest 3 sees ~96 deg vertically; 80 keeps the screenshot undistorted.
    camera.fov = 80;
    camera.position.copy(SEAT_EYE).applyMatrix4(anchor.matrixWorld);
    // Between the vendor's face and the goods: what a seated customer takes in.
    // With no vendor to look at (the bus not yet in), look ahead over the table.
    let shown = true;
    for (let o: Object3D | null = v.root; o; o = o.parent) if (!o.visible) shown = false;
    if (shown) camera.lookAt(tmp.copy(face).lerp(anchor.getWorldPosition(new Vector3()), 0.55));
    else camera.lookAt(new Vector3(0, 0.6, -2).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'vendor') {
    // 3/4 close-up from the user's right, at the vendor's eye height.
    const p = new Vector3(0.62, face.y - table + 0.02, -0.05);
    camera.position.copy(p).applyMatrix4(anchor.matrixWorld);
    camera.fov = 45;
    camera.lookAt(tmp.copy(face).add(new Vector3(0, -0.12, 0)));
  } else if (view === 'side') {
    // From the user's right, level with the counter: shows reach over the counter.
    camera.position.copy(new Vector3(1.45, 0.62, -0.25)).applyMatrix4(anchor.matrixWorld);
    camera.fov = 55;
    camera.lookAt(new Vector3(0, 0.42, -0.36).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'wide') {
    const W: Partial<Record<SpotId, [number, number, number]>> = { kachori: [-2.4, 1.0, 2.5], paranthe: [-3.4, 1.0, 1.5], auto: [-1.0, 1.0, 3.6], bus: [-2.6, 1.0, 3.6], minaret: [-2.6, 1.0, 3.6] };
    const w = W[spot] ?? [-2.6, 1.0, 3.6];
    camera.position.copy(new Vector3(w[0], w[1], w[2])).applyMatrix4(anchor.matrixWorld);
    camera.lookAt(new Vector3(0.2, 0.55, -0.9).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'street') {
    // Standing in the street near the spot, looking along it (street frame targets).
    const s2w = street.group.matrixWorld;
    const [from, to] = STREET_VIEW[spot];
    camera.position.copy(new Vector3(from[0], from[1], from[2]).applyMatrix4(s2w));
    camera.lookAt(new Vector3(to[0], to[1], to[2]).applyMatrix4(s2w));
    camera.fov = 75;
  } else if (view === 'ride') {
    // Seated in a vehicle, looking ahead past the driver.
    camera.fov = 90;
    camera.position.copy(SEAT_EYE).applyMatrix4(anchor.matrixWorld);
    camera.lookAt(new Vector3(0.0, 0.3, -3).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'rideside') {
    camera.fov = 90;
    camera.position.copy(SEAT_EYE).applyMatrix4(anchor.matrixWorld);
    camera.lookAt(new Vector3(-2.5, 0.4, -1.5).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'awe' || view === 'up') {
    // Seated, looking past the vendor up at what stands behind him.
    camera.fov = 90;
    camera.position.copy(SEAT_EYE).applyMatrix4(anchor.matrixWorld);
    camera.lookAt(new Vector3(0, view === 'up' ? 9 : 5, -14).applyMatrix4(anchor.matrixWorld));
  } else if (view === 'cover') {
    // SADAK's cover angle: high over the plaza east of the masjid, looking west.
    const s2w = street.group.matrixWorld;
    const r = MASJID.rot;
    const ax = Math.sin(r);
    const az = Math.cos(r);
    camera.position.copy(new Vector3(MASJID.x + ax * 165, 58, MASJID.z + az * 165).applyMatrix4(s2w));
    camera.lookAt(new Vector3(MASJID.x, 4, MASJID.z).applyMatrix4(s2w));
    camera.fov = 60;
  } else if (view === 'top') {
    camera.position.copy(new Vector3(6, 14, 18)).applyMatrix4(anchor.matrixWorld);
    camera.lookAt(new Vector3(0, -0.7, -4).applyMatrix4(anchor.matrixWorld));
  }
  // The cover shot stands outside the 178 m sky dome's reach: a longer far plane, preview only.
  camera.far = view === 'cover' ? 600 : 200;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

// Simulate to time T at 60 Hz so every animation is in a natural mid-state.
const gesture = q.get('gesture') as Gesture | null;
const talk = q.get('talk') === '1';
const vendor = () => street.spots[spot].vendor;
vendor().setLookAt(SEAT_EYE);
let t = 0;
const dt = 1 / 60;
const fireGestureAt = gesture ? Math.max(0, T - 1.4) : -1;
const arriveAt = q.get('arrive') === '1' ? Math.max(0, T - 3) : -1;
const busAt = q.get('busarrive') === '1' ? Math.max(0, T - 4) : -1;
const rideQ = q.get('ride');
let busFired = false;
let rideFired = false;
let rideStart = -1;
let fired = false;
let arrived = false;
const TT = rideQ ? T + 0.2 : T;
while (t < TT) {
  if (!fired && fireGestureAt >= 0 && t >= fireGestureAt) {
    vendor().gesture(gesture!);
    fired = true;
  }
  if (!arrived && arriveAt >= 0 && t >= arriveAt) {
    street.auto.arrive();
    arrived = true;
  }
  if (talk && Math.abs(t - (T - 2.5)) < dt / 2) vendor().talk(4);
  if (!busFired && busAt >= 0 && t >= busAt) {
    street.bus.arrive();
    busFired = true;
  }
  if (rideQ && !rideFired && t >= 0.2) {
    const [to, kind] = rideQ.split(':') as [SpotId, RideKind];
    street.ride(to, kind);
    rideFired = true;
    rideStart = t;
  }
  anchor.updateMatrixWorld(true);
  street.update(dt, t);
  t += dt;
}

(window as unknown as { __street: unknown; __camera: unknown }).__street = street;
(window as unknown as { __camera: unknown }).__camera = camera;
const budget = q.get('budget') === '1';
if (budget) street.group.traverse((o) => (o.frustumCulled = false));

const hud = document.getElementById('hud')!;
function frame() {
  placeCamera();
  anchor.updateMatrixWorld(true);
  street.update(live ? 1 / 60 : 0, t);
  if (live) t += 1 / 60;
  renderer.render(scene, camera);
  const info = renderer.info.render;
  let meshes = 0;
  street.group.traverse((o) => {
    if ((o as { isMesh?: boolean }).isMesh && o.visible) meshes++;
  });
  const wd = street.group.userData.world as { tris: () => number };
  const breakdown: Record<string, number> = {};
  street.group.traverse((o) => {
    const m = o as unknown as { isMesh?: boolean; geometry: { index: { count: number } | null; attributes: { position: { count: number } } }; count?: number; name: string };
    if (!m.isMesh) return;
    const n = Math.round((m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3) * (m.count ?? 1);
    const key = m.name.replace(/_\d+$/, '').replace(/^person_.*/, 'person') || 'unnamed';
    breakdown[key] = (breakdown[key] ?? 0) + n;
  });
  (window as unknown as { __breakdown: unknown }).__breakdown = breakdown;
  const ri = (street.group.userData.world as { rideInfo: () => unknown }).rideInfo();
  const stats = { calls: info.calls, triangles: info.triangles, meshes, allTris: wd.tris(), buildMs: Math.round(buildMs), spot, view, reveal, ride: ri, rideStart };
  (window as unknown as { __stats: unknown }).__stats = stats;
  hud.textContent = `${spot} · ${view} · reveal ${reveal}\ncalls ${info.calls} · tris ${info.triangles}\nmeshes ${meshes} · all tris ${stats.allTris} · build ${stats.buildMs} ms`;
  (window as unknown as { __ready: boolean }).__ready = true;
  if (live) requestAnimationFrame(frame);
}
frame();
if (document.fonts) document.fonts.ready.then(() => requestAnimationFrame(frame));

const GESTURES: Gesture[] = ['offer', 'receive', 'wave', 'nod', 'shake', 'namaste'];
let gi = 0;
addEventListener('keydown', (e) => {
  const spots: Record<string, SpotId> = { '1': 'kachori', '2': 'flowers', '3': 'auto', '4': 'paranthe', '5': 'bus', '6': 'minaret' };
  const views: Record<string, string> = { q: 'seat', w: 'vendor', e: 'wide', r: 'street', t: 'top' };
  if (spots[e.key]) {
    spot = spots[e.key];
    street.setActive(spot);
    vendor().setLookAt(SEAT_EYE);
  } else if (views[e.key]) view = views[e.key];
  else if (e.key === 'g') vendor().gesture(GESTURES[gi++ % GESTURES.length]);
  else if (e.key === 'k') vendor().talk(3);
  else if (e.key === 'a') (street.auto.parked ? street.auto.leave() : street.auto.arrive());
  else if (e.key === '[' || e.key === ']') {
    reveal = Math.max(0, reveal + (e.key === ']' ? 1 : -1) * Math.max(0.25, reveal * 0.2));
    street.setReveal(reveal);
  }
  if (!live) requestAnimationFrame(frame);
});
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  if (!live) requestAnimationFrame(frame);
});
