import { BoxGeometry, Color, Group, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader, type Texture } from '@iwsdk/core';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { revealPatch } from './sadak-city.js';

/**
 * The stall counter on the user's real table: real materials instead of flat
 * colour blocks. A bevelled hardwood top (Poly Haven wood_table_001, CC0), a
 * planked front and sides (weathered_brown_planks, CC0) tinted toward the
 * stall's colour, a darker edge trim and legs down to the street.
 *
 * Counter frame (spots.ts): top surface at y = 0, user edge at z = +0.2,
 * back edge at z = -0.49; the street is at y = -tableHeight.
 */

const base = `${import.meta.env.BASE_URL}textures/`;
const loader = new TextureLoader();
const cache = new Map<string, Texture>();
function tex(name: string, srgb: boolean, rx: number, ry: number): Texture {
  const key = `${name}|${rx}|${ry}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let src = cache.get(name);
  if (!src) {
    src = loader.load(base + name);
    src.wrapS = src.wrapT = RepeatWrapping;
    src.anisotropy = 4;
    if (srgb) src.colorSpace = SRGBColorSpace;
    cache.set(name, src);
  }
  const t = src.clone();
  t.repeat.set(rx, ry);
  t.needsUpdate = true;
  cache.set(key, t);
  return t;
}

export type CounterLook = { width: number; tint: number; trim: number };

export interface Counter {
  group: Group;
  setHeight(C: number): void;
}

const DEPTH = 0.69;
const Z = -0.145;

export function makeCounter(look: CounterLook, C: number): Counter {
  const group = new Group();
  group.name = 'counter-real';
  const w = look.width;

  const top = revealPatch(new MeshStandardMaterial({
    map: tex('wood_table_001_diff.jpg', true, w / 0.9, DEPTH / 0.9),
    normalMap: tex('wood_table_001_nor.jpg', false, w / 0.9, DEPTH / 0.9),
    roughness: 1,
    metalness: 0,
    color: new Color(0xc8b29a),
  }));
  const panel = revealPatch(new MeshStandardMaterial({
    map: tex('weathered_brown_planks_diff.jpg', true, w / 1.2, 1),
    normalMap: tex('weathered_brown_planks_nor.jpg', false, w / 1.2, 1),
    roughness: 0.9,
    color: new Color(look.tint).lerp(new Color(0xffffff), 0.45),
  }));
  const trim = revealPatch(new MeshStandardMaterial({ color: look.trim, roughness: 0.6 }));

  // Top: a bevelled slab whose upper face is the table plane.
  const slab = new Mesh(new RoundedBoxGeometry(w, 0.045, DEPTH, 3, 0.012), top);
  slab.position.set(0, -0.0225 - 0.0025, Z);
  slab.name = 'counter-top';
  group.add(slab);
  // A thin trim strip under the front lip.
  const lip = new Mesh(new BoxGeometry(w + 0.012, 0.03, 0.03), trim);
  lip.position.set(0, -0.06, 0.2 - 0.005);
  group.add(lip);

  // Body: front and side panels and legs, all hanging to the street.
  const body = new Group();
  group.add(body);
  const front = new Mesh(new BoxGeometry(w - 0.04, 1, 0.03), panel);
  const back = new Mesh(new BoxGeometry(w - 0.04, 1, 0.03), panel);
  const sides = [new Mesh(new BoxGeometry(0.03, 1, DEPTH - 0.08), panel), new Mesh(new BoxGeometry(0.03, 1, DEPTH - 0.08), panel)];
  const legs = [-1, 1].flatMap((sx) => [0.17, -0.45].map((z) => {
    const m = new Mesh(new RoundedBoxGeometry(0.06, 1, 0.06, 2, 0.01), trim);
    m.position.set(sx * (w / 2 - 0.035), 0, z);
    return m;
  }));
  const plinth = new Mesh(new BoxGeometry(w - 0.02, 0.06, 0.035), trim);
  body.add(front, back, ...sides, ...legs, plinth);

  const setHeight = (h: number) => {
    const H = h - 0.075; // from the street to under the top
    const cy = -h + H / 2;
    for (const m of [front, back, ...sides, ...legs]) {
      m.scale.y = H;
      m.position.y = cy;
    }
    front.position.z = 0.17;
    back.position.z = -0.46;
    sides[0].position.set(-(w / 2 - 0.035), cy, Z);
    sides[1].position.set(w / 2 - 0.035, cy, Z);
    plinth.position.set(0, -h + 0.03, 0.185);
  };
  setHeight(C);
  return { group, setHeight };
}
