import { AssetManager, Group, MeshStandardMaterial, Vector3, type Bone, type Material, type Mesh, type Object3D, type SkinnedMesh } from '@iwsdk/core';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { revealPatch } from './sadak-city.js';
import type { PersonDims, PersonRig } from './people.js';

/**
 * The errand hosts as real human bodies: MakeHuman (MPFB in Blender, CC0
 * output) built by tools/humans/build_human.py into public/humans/*.glb,
 * dressed in SADAK's attireFor colours, on our VR rig's skeleton (same bone
 * names and hierarchy as people.ts), so the Vendor code (talk, gestures, arm
 * IK, gaze, blinks) drives them unchanged.
 *
 * On load each joint is made world-aligned at rest (identity rotation, the
 * convention people.ts builds its rig in) and the skeleton is re-bound there,
 * so the mesh keeps its exported rest shape.
 */

export const HUMAN_MODELS = ['kachori', 'flowers', 'auto', 'bus', 'paranthe', 'minaret'] as const;
export const humanKey = (id: string) => `vendor-${id}`;

let bodyMat: Material | null = null;
const _a = new Vector3();
const _b = new Vector3();

/** A fresh rig for a built vendor, or null if its GLB isn't loaded (people.ts falls back to the procedural rig). */
export function makeHumanRig(key: string, female: boolean): PersonRig | null {
  const gltf = AssetManager.getGLTF(key, { shared: true });
  if (!gltf) return null;
  const root = cloneSkinned(gltf.scene) as Group;
  root.name = key;
  root.updateMatrixWorld(true);

  const skinned: SkinnedMesh[] = [];
  const bones: Record<string, Bone> = {};
  root.traverse((o) => {
    if ((o as SkinnedMesh).isSkinnedMesh) skinned.push(o as SkinnedMesh);
    if ((o as Bone).isBone) bones[o.name] = o as Bone;
  });
  if (!skinned.length || !bones.root || !bones.wristR) return null;

  // World-aligned joints at rest: identity rotations, positions from the exported rest pose.
  const world = new Map<Bone, Vector3>();
  for (const b of Object.values(bones)) world.set(b, root.worldToLocal(b.getWorldPosition(new Vector3())));
  const rootParent = bones.root.parent!;
  root.attach(bones.root);
  void rootParent;
  const visit = (b: Bone) => {
    const w = world.get(b)!;
    const p = b.parent as Bone | null;
    const pw = p && world.get(p as Bone);
    b.quaternion.identity();
    b.scale.set(1, 1, 1);
    b.position.copy(pw ? _a.copy(w).sub(pw) : w);
    for (const c of b.children) if ((c as Bone).isBone) visit(c as Bone);
  };
  visit(bones.root);
  root.updateMatrixWorld(true);
  skinned[0].skeleton.calculateInverses();
  for (const m of skinned) if (m.skeleton !== skinned[0].skeleton) m.skeleton.calculateInverses();

  // Materials: the painted body (SADAK's clothes colours) with smooth, soft light: hard cel
  // bands blotch a real face at 0.7 m. Eyes, brows, lashes and teeth keep their textures.
  bodyMat ??= revealPatch(new MeshStandardMaterial({ name: 'human', vertexColors: true, roughness: 0.82, metalness: 0 }));
  let tris = 0;
  for (const m of skinned) {
    const g = m.geometry;
    tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    m.frustumCulled = false;
    if (g.attributes.color) {
      m.material = bodyMat;
    } else {
      const mat = (m.material as MeshStandardMaterial).clone();
      if (mat.transparent || /eyebrow|eyelash/i.test(m.name + mat.name)) {
        mat.transparent = false;
        mat.alphaTest = 0.5;
      }
      mat.roughness = 0.6;
      mat.metalness = 0;
      m.material = revealPatch(mat);
    }
  }

  const P = (n: string) => world.get(bones[n])!;
  const dims: PersonDims = {
    scale: 1,
    hipY: P('hips').y,
    waistY: P('spine').y,
    shoulderY: P('shoulderL').y,
    shoulderX: Math.abs(P('shoulderL').x),
    upperArm: _a.copy(P('shoulderL')).distanceTo(P('elbowL')),
    forearm: _b.copy(P('elbowL')).distanceTo(P('wristL')),
    headPivotY: P('head').y,
    eyeY: P('eyeL').y,
  };
  for (const n of ['lidL', 'lidR']) if (bones[n]) bones[n].userData.y = bones[n].position.y;
  return { mesh: root as unknown as SkinnedMesh, bones, dims, tris: Math.round(tris), female, kind: 'human' };
}

/** True when every vendor GLB is in the cache. */
export function humansReady(): boolean {
  return HUMAN_MODELS.every((id) => !!AssetManager.getGLTF(humanKey(id), { shared: true }));
}

/** Debug: names of meshes in a built rig. */
export function describeRig(r: PersonRig): string[] {
  const out: string[] = [];
  (r.mesh as unknown as Object3D).traverse((o) => {
    if ((o as Mesh).isMesh) out.push(o.name);
  });
  return out;
}
