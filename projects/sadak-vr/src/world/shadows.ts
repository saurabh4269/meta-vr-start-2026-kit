/**
 * Contact shadows instead of shadow maps: one InstancedMesh of soft discs
 * (one draw call), static ones under stalls and parked vehicles and dynamic
 * ones that follow people and vehicles. Transparent, no depth write, and cut
 * by the same reveal sphere as the street.
 */

import { DoubleSide, InstancedBufferAttribute, InstancedMesh, Matrix4, NormalBlending, Object3D, PlaneGeometry, Quaternion, ShaderMaterial, Vector3 } from '@iwsdk/core';
import { U } from './cel.js';
import type { UvRect } from './kit.js';

type Follower = { obj: Object3D; rx: number; rz: number; strength: number };

export type ContactShadows = {
  mesh: InstancedMesh;
  addStatic(x: number, z: number, rx: number, rz: number, yaw?: number, strength?: number): void;
  /** Drop every static disc (followers stay). */
  clearStatics(): void;
  /** A disc under `obj`, on the street ground (y = 0 in street space). */
  follow(obj: Object3D, rx: number, rz?: number, strength?: number): void;
  update(street: Object3D): void;
};

export function makeContactShadows(rect: UvRect, max = 128): ContactShadows {
  const geo = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, rect[0] + uv.getX(i) * (rect[2] - rect[0]), rect[1] + uv.getY(i) * (rect[3] - rect[1]));
  const mat = new ShaderMaterial({
    name: 'contact-shadow',
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
    uniforms: { uAtlas: { value: null }, uRevealCenter: U.uRevealCenter, uRevealRadius: U.uRevealRadius, uShadowColor: { value: U.uShadowTint.value.clone().multiplyScalar(0.25) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      attribute float strength;
      varying float vStrength;
      void main() {
        vUv = uv;
        vStrength = strength;
        vec4 wp = modelMatrix * instanceMatrix * vec4( position, 1.0 );
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      uniform vec3 uRevealCenter;
      uniform float uRevealRadius;
      uniform vec3 uShadowColor;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vStrength;
      void main() {
        if ( distance( vWorldPos, uRevealCenter ) > uRevealRadius ) discard;
        float a = texture2D( uAtlas, vUv ).a * vStrength;
        if ( a < 0.01 ) discard;
        gl_FragColor = vec4( uShadowColor, a );
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new InstancedMesh(geo, mat, max);
  mesh.name = 'contact-shadows';
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  mesh.count = 0;
  const strengths = new Float32Array(max);
  const strengthAttr = new InstancedBufferAttribute(strengths, 1);
  geo.setAttribute('strength', strengthAttr);
  const followers: Follower[] = [];
  let statics = 0;
  const m = new Matrix4();
  const v = new Vector3();
  const s = new Vector3();
  const dir = new Vector3();
  const qs = new Quaternion();
  const qo = new Quaternion();
  const place = (i: number, x: number, z: number, rx: number, rz: number, yaw: number) => {
    m.makeRotationY(yaw);
    m.scale(s.set(rx * 2, 1, rz * 2));
    m.setPosition(x, 0.012, z);
    mesh.setMatrixAt(i, m);
  };
  return {
    mesh,
    addStatic(x, z, rx, rz, yaw = 0, strength = 0.8) {
      if (statics + followers.length >= max) return;
      // Statics are packed first; followers are appended after them each frame.
      place(statics, x, z, rx, rz, yaw);
      strengths[statics] = strength;
      statics++;
      mesh.count = statics + followers.length;
      mesh.instanceMatrix.needsUpdate = true;
      strengthAttr.needsUpdate = true;
    },
    clearStatics() {
      statics = 0;
      mesh.count = followers.length;
    },
    follow(obj, rx, rz = rx, strength = 0.85) {
      if (statics + followers.length >= max) return;
      followers.push({ obj, rx, rz, strength });
      mesh.count = statics + followers.length;
    },
    update(street) {
      for (let k = 0; k < followers.length; k++) {
        const f = followers[k];
        const i = statics + k;
        let shown = !!f.obj.parent;
        for (let o: Object3D | null = f.obj; o && o !== street; o = o.parent) if (!o.visible) shown = false;
        if (!shown) {
          m.makeScale(0, 0, 0);
          mesh.setMatrixAt(i, m);
          continue;
        }
        f.obj.getWorldPosition(v);
        street.worldToLocal(v);
        // Yaw in street space: the object's +Z, carried into the street's frame.
        street.getWorldQuaternion(qs).invert();
        f.obj.getWorldQuaternion(qo);
        dir.set(0, 0, 1).applyQuaternion(qs.multiply(qo));
        const yaw = Math.atan2(dir.x, dir.z);
        place(i, v.x, v.z, f.rx, f.rz, yaw);
        strengths[i] = f.strength;
      }
      mesh.instanceMatrix.needsUpdate = true;
      strengthAttr.needsUpdate = true;
    },
  };
}
