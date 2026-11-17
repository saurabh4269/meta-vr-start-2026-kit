import { InstancedMesh, Matrix4, Sphere, Vector3, type Mesh, type Object3D } from '@iwsdk/core';

/**
 * Distance culling for SADAK's city in VR (SADAK's code itself is untouched).
 *
 * SADAK draws the whole 800 m district every frame; a desktop GPU copes, a
 * Quest does not. Two mechanisms, both outside SADAK's own objects' state:
 * - Plain meshes: drawn only within a radius of the user, by toggling render
 *   layer 0 (SADAK never touches layers, so its own `visible` logic stays its own).
 * - Instanced meshes (the crowd, lamps, planters, clutter, market tarps):
 *   the source stays where SADAK writes it but is never drawn; a proxy
 *   sharing its geometry and material draws only the instances in range.
 */

export interface CullRule {
  /** Top-level child name under SADAK's world group. */
  name: string;
  /** Radius in metres; Infinity = never culled. */
  radius: number;
}

interface Proxy {
  src: InstancedMesh;
  dst: InstancedMesh;
  radius: number;
  srcVersion: number;
}

interface Plain {
  mesh: Mesh;
  radius: number;
  static: boolean;
  centre: Vector3;
  r: number;
}

const _s = new Sphere();
const _inv = new Matrix4();
const _rel = new Matrix4();

export class CityCull {
  private readonly proxies: Proxy[] = [];
  private readonly plains: Plain[] = [];
  private readonly seen = new WeakSet<Object3D>();
  private plainIdx = 0;
  private rescan = 0;
  private lastX = Infinity;
  private lastZ = Infinity;

  constructor(
    private readonly world: Object3D,
    private readonly rules: CullRule[],
    private readonly fallback: number,
    private readonly staticNames: Set<string>,
  ) {
    this.scan();
  }

  private radiusFor(top: string): number {
    return this.rules.find((r) => r.name === top)?.radius ?? this.fallback;
  }

  /** Find meshes not seen before (SADAK streams building detail in later). */
  private scan(): void {
    for (const top of this.world.children) {
      const radius = this.radiusFor(top.name);
      if (!Number.isFinite(radius)) continue;
      const isStatic = this.staticNames.has(top.name);
      top.traverse((o) => {
        if (this.seen.has(o)) return;
        const m = o as Mesh;
        if (!m.isMesh || o.userData.cullProxy) return;
        this.seen.add(o);
        if ((o as InstancedMesh).isInstancedMesh) {
          const src = o as InstancedMesh;
          const dst = new InstancedMesh(src.geometry, src.material, src.instanceMatrix.count);
          dst.name = `${src.name || 'inst'}-near`;
          dst.userData.cullProxy = true;
          dst.frustumCulled = false;
          dst.count = 0;
          if (src.instanceColor) dst.instanceColor = src.instanceColor.clone() as typeof src.instanceColor;
          src.parent!.add(dst);
          dst.position.copy(src.position);
          dst.quaternion.copy(src.quaternion);
          dst.scale.copy(src.scale);
          src.layers.disable(0);
          this.proxies.push({ src, dst, radius, srcVersion: -1 });
        } else {
          if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
          this.plains.push({ mesh: m, radius, static: isStatic, centre: new Vector3(), r: -1 });
        }
      });
    }
  }

  update(dt: number, fx: number, fz: number): void {
    this.rescan += dt;
    if (this.rescan > 1) {
      this.rescan = 0;
      this.scan();
    }
    // Everything below works in SADAK's world frame (= the street frame).
    this.world.updateWorldMatrix(true, false);
    _inv.copy(this.world.matrixWorld).invert();
    const moved = Math.hypot(fx - this.lastX, fz - this.lastZ) > 2;
    if (moved) {
      this.lastX = fx;
      this.lastZ = fz;
    }
    for (const p of this.proxies) this.updateProxy(p, fx, fz, moved);
    // Plain meshes: a slice per frame (all of them within ~0.25 s), or all at once after a jump.
    const n = this.plains.length;
    const slice = moved ? n : Math.ceil(n / 18);
    for (let k = 0; k < slice && n; k++) {
      this.plainIdx = (this.plainIdx + 1) % n;
      this.updatePlain(this.plains[this.plainIdx], fx, fz);
    }
  }

  private updatePlain(p: Plain, fx: number, fz: number): void {
    const m = p.mesh;
    if (!p.static || p.r < 0) {
      if (p.r < 0) m.updateWorldMatrix(true, false);
      _s.copy(m.geometry.boundingSphere!).applyMatrix4(_rel.multiplyMatrices(_inv, m.matrixWorld));
      p.centre.copy(_s.center);
      p.r = _s.radius;
    }
    const d = Math.hypot(p.centre.x - fx, p.centre.z - fz) - p.r;
    if (d < p.radius) m.layers.enable(0);
    else m.layers.disable(0);
  }

  private updateProxy(p: Proxy, fx: number, fz: number, moved: boolean): void {
    const src = p.src;
    const ver = src.instanceMatrix.version;
    if (!moved && ver === p.srcVersion) return;
    p.srcVersion = ver;
    const a = src.instanceMatrix.array as Float32Array;
    const b = p.dst.instanceMatrix.array as Float32Array;
    const ca = src.instanceColor?.array as Float32Array | undefined;
    const cb = p.dst.instanceColor?.array as Float32Array | undefined;
    // Instance positions are in the source's local frame: map them into SADAK's world frame.
    src.updateWorldMatrix(true, false);
    const e = _rel.multiplyMatrices(_inv, src.matrixWorld).elements;
    const r2 = p.radius * p.radius;
    let k = 0;
    for (let i = 0; i < src.count; i++) {
      const o = i * 16;
      // Skip instances SADAK has scaled to zero (hidden parts).
      if (a[o] === 0 && a[o + 5] === 0 && a[o + 10] === 0 && a[o + 1] === 0) continue;
      const x = a[o + 12], y = a[o + 13], z = a[o + 14];
      const dx = e[0] * x + e[4] * y + e[8] * z + e[12] - fx;
      const dz = e[2] * x + e[6] * y + e[10] * z + e[14] - fz;
      if (dx * dx + dz * dz > r2) continue;
      const q = k * 16;
      for (let j = 0; j < 16; j++) b[q + j] = a[o + j];
      if (ca && cb) {
        cb[k * 3] = ca[i * 3];
        cb[k * 3 + 1] = ca[i * 3 + 1];
        cb[k * 3 + 2] = ca[i * 3 + 2];
      }
      k++;
    }
    p.dst.count = k;
    p.dst.instanceMatrix.needsUpdate = true;
    if (p.dst.instanceColor) p.dst.instanceColor.needsUpdate = true;
  }
}
