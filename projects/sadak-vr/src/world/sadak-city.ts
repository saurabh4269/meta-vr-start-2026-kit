/**
 * SADAK's own Chandni Chowk, built by SADAK's own code.
 *
 * Everything here calls the vendored, unmodified SADAK engine
 * (src/sadak-engine/lib/game, see its README) the way SADAK's engine.ts does:
 * the compiled OpenStreetMap district (public/maps/purani-sadak.json), the
 * puraniSadak district theme, `buildWorld` (ground, roads, every building,
 * the Jama Masjid, the Red Fort, Gauri Shankar, markets, street furniture,
 * traffic, the crowd, animals, birds), its sky and skyline, its lights, and
 * its cel converter.
 *
 * What VR changes, and only here:
 * - SADAK's full-screen post pass (ink edges, depth haze, grade) cannot run
 *   per eye in WebXR, so its DELHI grade and haze are folded into each
 *   material's fragment shader (the same celGrade our own rigs use).
 * - Every material also gets the reveal sphere, so the city grows out of the
 *   user's real table.
 * - No shadow map (Quest budget).
 */

import { AmbientLight, Color, DirectionalLight, Group, HemisphereLight, Vector3, type Material, type Object3D, type WebGLRenderer } from '@iwsdk/core';
import { buildWorld, type World as SadakWorld } from '../sadak-engine/lib/game/world/index';
import type { MapData } from '../sadak-engine/lib/game/world/mapData';
import { SEED_DISTRICTS } from '../sadak-engine/lib/game/districts';
import { createCelifier } from '../sadak-engine/lib/game/fx/toon';
import { presetFor } from '../sadak-engine/lib/game/fx/presets';
import { createSky, type SkyRig } from '../sadak-engine/lib/game/fx/sky';
import { createMaterialLibrary } from '../sadak-engine/lib/game/materials';
import { createVehicleMaterials } from '../sadak-engine/lib/game/vehicles';
import { createTransitMaterial } from '../sadak-engine/lib/game/transit';
import { makeMissionShopStall } from '../sadak-engine/lib/game/assets/index';
import { makeBarberShop } from '../sadak-engine/lib/game/assets/barber';
import { BARBER_FACING, barberSignFor } from '../sadak-engine/lib/game/barber';
import { taskSpot } from '../sadak-engine/lib/game/world/mapData';
import { DETAIL } from '../sadak-engine/lib/game/world/buildings';
import mapJson from '../../public/maps/purani-sadak.json';
import { GRADE_GLSL, REVEAL_GLSL, U } from './cel.js';
import { CityCull } from './city-cull.js';
import { addInkHulls, createInkMaterial } from './ink.js';

export const DISTRICT_ID = 'purani-sadak';

export interface SadakCity {
  map: MapData;
  /** The district, lights and sky; add to the street group. */
  group: Group;
  world: SadakWorld;
  sky: SkyRig;
  sun: DirectionalLight;
  hemi: HemisphereLight;
  /** Ground height (m) at a street point. */
  groundAt(x: number, z: number): number;
  /** Streams detail, traffic and the crowd round `focus` (street coords). */
  update(dt: number, t: number, fx: number, fz: number): void;
  /** Show or hide the sky (ShaderMaterials have no reveal sphere). */
  setSkyVisible(on: boolean): void;
  /**
   * Where SADAK's engine stands an errand's host (buildTaskSites: the map's
   * task spot, or inside the real temple/mosque for a temple errand), with
   * SADAK's set piece beside it (the shop stall). Returns the host's point
   * and the direction (yaw) the user sits in, facing the host: SADAK's spot
   * yaw if that side is clear, else the nearest clear side.
   */
  placeHost(taskId: string, kind: 'shop' | 'temple', role: string, standBack: number): { x: number; z: number; yaw: number; hostYaw: number };
}

/** engine.ts hashId: stable seed from an NPC id. */
export function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Add the reveal sphere, the DELHI grade and haze to a built-in material. Idempotent. */
export function revealPatch<M extends Material>(mat: M): M {
  if (mat.userData.sadakReveal || (mat as unknown as { isShaderMaterial?: boolean }).isShaderMaterial) return mat;
  mat.userData.sadakReveal = true;
  const prev = mat.onBeforeCompile.bind(mat);
  const prevKey = mat.customProgramCacheKey.bind(mat);
  mat.onBeforeCompile = (shader, renderer) => {
    prev(shader, renderer);
    Object.assign(shader.uniforms, {
      uRevealCenter: U.uRevealCenter,
      uRevealRadius: U.uRevealRadius,
      uRevealBand: U.uRevealBand,
      uRevealGlow: U.uRevealGlow,
      uFogColor: U.uFogColor,
      uFogNear: U.uFogNear,
      uFogFar: U.uFogFar,
      uFogMax: U.uFogMax,
    });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRevealWP;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
  {
    vec4 rwp = vec4( transformed, 1.0 );
    #ifdef USE_BATCHING
      rwp = batchingMatrix * rwp;
    #endif
    #ifdef USE_INSTANCING
      rwp = instanceMatrix * rwp;
    #endif
    vRevealWP = ( modelMatrix * rwp ).xyz;
  }`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vRevealWP;\n${REVEAL_GLSL}\n${GRADE_GLSL}`)
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n  float revealE = revealEdge( vRevealWP );')
      .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb = revealFinish( celGrade( gl_FragColor.rgb ), vRevealWP, revealE );\n#include <tonemapping_fragment>');
  };
  mat.customProgramCacheKey = () => `${prevKey()}|sadakReveal`;
  mat.needsUpdate = true;
  return mat;
}

function patchTree(root: Object3D): void {
  root.traverse((o) => {
    const m = (o as unknown as { material?: Material | Material[] }).material;
    if (!m) return;
    if (Array.isArray(m)) m.forEach(revealPatch);
    else revealPatch(m);
  });
}

export function buildSadakCity(renderer: WebGLRenderer | null): SadakCity {
  const map = mapJson as unknown as MapData;
  const district = SEED_DISTRICTS.find((d) => d.id === DISTRICT_ID)!;
  const theme = district.theme;
  const group = new Group();
  group.name = 'sadak-city';

  // engine.ts: createSky(theme.sky, theme.buildings, { radius: half * 2.2, skylineInner: half + 25 })
  const sky = createSky(theme.sky, theme.buildings, { radius: map.half * 2.2, skylineInner: map.half + 25 });
  group.add(sky.sky, sky.skyline);

  // engine.ts buildLights(), verbatim (the sun casts no shadow map here).
  const spawn = map.spawn;
  group.add(new AmbientLight(0xffffff, theme.ambient * 0.3));
  const hemiGround = new Color(theme.hemiGround).lerp(new Color(0x8a80b8), 0.55);
  const hemi = new HemisphereLight(theme.hemiSky, hemiGround, theme.hemiIntensity);
  group.add(hemi);
  const sun = new DirectionalLight(theme.sunColour, theme.sunIntensity * 1.1);
  sun.position.set(spawn.x + 60, 90, spawn.z + 30);
  sun.target.position.set(spawn.x, 0, spawn.z);
  group.add(sun, sun.target);
  const fill = new DirectionalLight(new Color(theme.hemiSky).lerp(new Color(0xa99ce0), 0.4), theme.sunIntensity * 0.42);
  fill.position.set(-70, 40, -55);
  group.add(fill);
  const bounce = new DirectionalLight(theme.hemiGround, theme.sunIntensity * 0.12);
  bounce.position.set(-30, -20, 60);
  group.add(bounce);

  // SADAK's own knob for how far round the player buildings are fully detailed
  // (105 m on the desktop; its city-cover stills raise it). VR halves it:
  // beyond, SADAK's own massing blocks stand in, as they do past 105 m.
  DETAIL.near = 55;
  const celifier = createCelifier({ shadowTint: new Color(presetFor(district.id).celShadowTint) });
  const mats = renderer ? createMaterialLibrary(renderer) : undefined;
  const world = buildWorld(map, district, {
    mats,
    vehicleMats: createVehicleMaterials(),
    transitMat: createTransitMaterial(),
    // Streamed building detail is converted (and patched) as it arrives.
    toon: (m) => revealPatch(celifier.convert(m)),
  });
  group.add(world.group);

  // engine.ts buildBarberSite: the vibes-only barber shop in the gap the map
  // compiler left for it near the spawn (SADAK's barber errand itself is not in this port).
  {
    const { x, z, yaw } = map.barber;
    const anchor = new Group();
    anchor.name = 'sadak-barber';
    anchor.position.set(x, world.height.at(x, z), z);
    anchor.rotation.y = yaw;
    const shop = makeBarberShop(barberSignFor(district.language));
    shop.rotation.y = BARBER_FACING;
    anchor.add(shop);
    world.group.add(anchor);
    world.collide.box(x, z, 2.15, 1.75, yaw);
  }
  celifier.apply(world.group);
  patchTree(world.group);
  patchTree(sky.skyline);

  // engine.ts primes the world round the spawn; the director re-primes round the first spot.
  world.prime(new Vector3(spawn.x, 0, spawn.z));

  // SADAK's ink lines on buildings, monuments and set pieces (ink.ts).
  const ink = createInkMaterial();
  const inked = () => {
    for (const name of ['buildings', 'landmarks']) {
      const g = world.group.getObjectByName(name);
      if (g) addInkHulls(g, ink);
    }
    for (const c of group.children) if (c.name.startsWith('sadak-stall-')) addInkHulls(c, ink);
  };
  inked();
  // VR draw distance (see city-cull.ts). Landmarks, roads and ground are always drawn.
  const cull = new CityCull(
    world.group,
    [
      { name: 'landmarks', radius: Infinity },
      { name: 'roads', radius: Infinity },
      { name: 'areas', radius: Infinity },
      { name: 'buildings', radius: 130 },
      { name: 'crowd', radius: 40 },
      { name: 'traffic', radius: 60 },
    ],
    60,
    new Set(['buildings', 'street', 'markets', 'clutter']),
  );
  cull.beforeScan = inked;
  const focus = new Vector3();
  return {
    map,
    group,
    world,
    sky,
    sun,
    hemi,
    groundAt: (x, z) => world.height.at(x, z),
    update(dt, t, fx, fz) {
      focus.set(fx, 0, fz);
      world.update(dt, t, focus);
      cull.update(dt, fx, fz);
    },
    setSkyVisible(on) {
      sky.sky.visible = on;
    },
    placeHost(taskId, kind, role, standBack) {
      const spot = taskSpot(map, { id: taskId, kind });
      const anchor = { x: spot.x, z: spot.z, yaw: spot.yaw };
      const inner = kind === 'temple' ? world.innerNear(spot.x, spot.z, 120) : null;
      if (inner) Object.assign(anchor, { x: inner.x, z: inner.z, yaw: inner.yaw });
      if (kind === 'shop') {
        // engine.ts: the stall at anchor-local (-1.4, 0, -0.8), turned 30 degrees, and its collider.
        const seed = hashId(taskId);
        const stall = makeMissionShopStall(district.id, role, theme.canopies[seed % theme.canopies.length], seed, mats);
        const holder = new Group();
        holder.name = `sadak-stall-${taskId}`;
        holder.position.set(anchor.x, world.height.at(anchor.x, anchor.z), anchor.z);
        holder.rotation.y = anchor.yaw;
        stall.rotation.y = Math.PI / 6;
        stall.position.set(-1.4, 0, -0.8);
        holder.add(stall);
        group.add(holder);
        celifier.apply(holder);
        patchTree(holder);
        const c = Math.cos(anchor.yaw);
        const sn = Math.sin(anchor.yaw);
        world.collide.box(anchor.x - 1.4 * c - 0.8 * sn, anchor.z + 1.4 * sn - 0.8 * c, 1.4, 1.2, anchor.yaw + Math.PI / 6);
      }
      // The user sits facing the host across the real table: SADAK's facing first, then the nearest clear side.
      let yaw = anchor.yaw;
      for (const k of [0, 1, -1, 2, -2, 3, -3, 4]) {
        const a = anchor.yaw + (k * Math.PI) / 4;
        const dx = Math.sin(a);
        const dz = Math.cos(a);
        const at = (d: number, r: number) => world.collide.blocked(anchor.x + dx * d, anchor.z + dz * d, r);
        if (!at(standBack, 0.45) && !at(standBack + 0.6, 0.4) && !at(standBack + 1.1, 0.3)) {
          yaw = a;
          break;
        }
      }
      return {
        x: anchor.x + Math.sin(yaw) * standBack,
        z: anchor.z + Math.cos(yaw) * standBack,
        yaw,
        hostYaw: anchor.yaw,
      };
    },
  };
}
