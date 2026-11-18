import { BackSide, Mesh, ShaderMaterial, type Object3D } from '@iwsdk/core';
import { REVEAL_GLSL, U } from './cel.js';

/**
 * SADAK's ink lines, VR edition.
 *
 * SADAK draws its ink in a full-screen pass (fx/celShader.ts: depth and
 * normal discontinuities, a dark warm line that fades out with distance).
 * A per-eye post pass is too expensive on a Quest, so each nearby building
 * gets an inverted hull instead: a second draw of its own geometry (shared
 * buffers, nothing copied) with back faces only, pushed out along the normal
 * by a screen-constant width that fades out with distance, like SADAK's
 * uInkFadeStart/End. Hulls are only drawn near the user (CityCull radius).
 */
export function createInkMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    name: 'sadak-ink',
    side: BackSide,
    uniforms: {
      uInkColor: U.uInkColor,
      uInkWidth: U.uInkWidth,
      uInkMin: U.uInkMin,
      uInkMax: U.uInkMax,
      uInkFade: { value: 28 },
      uRevealCenter: U.uRevealCenter,
      uRevealRadius: U.uRevealRadius,
      uRevealBand: U.uRevealBand,
      uRevealGlow: U.uRevealGlow,
      uFogColor: U.uFogColor,
      uFogNear: U.uFogNear,
      uFogFar: U.uFogFar,
      uFogMax: U.uFogMax,
    },
    vertexShader: /* glsl */ `
      uniform float uInkWidth;
      uniform float uInkMin;
      uniform float uInkMax;
      uniform float uInkFade;
      varying vec3 vWP;
      void main() {
        vec4 wp = modelMatrix * vec4( position, 1.0 );
        vec3 n = normalize( mat3( modelMatrix ) * normal );
        float d = distance( wp.xyz, cameraPosition );
        float w = clamp( uInkWidth * d, uInkMin, uInkMax ) * ( 1.0 - smoothstep( uInkFade * 0.6, uInkFade, d ) );
        wp.xyz += n * w - normalize( cameraPosition - wp.xyz ) * ( 2.0 * w );
        vWP = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInkColor;
      varying vec3 vWP;
      ${REVEAL_GLSL}
      void main() {
        float e = revealEdge( vWP );
        gl_FragColor = vec4( revealFinish( uInkColor, vWP, e ), 1.0 );
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Give every plain mesh under `root` an ink hull child (skips instanced, skinned, transparent and line meshes). */
export function addInkHulls(root: Object3D, ink: ShaderMaterial): number {
  const add: Mesh[] = [];
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh || o.userData.inkHull || o.userData.cullProxy) return;
    if ((o as unknown as { isInstancedMesh?: boolean }).isInstancedMesh || (o as unknown as { isSkinnedMesh?: boolean }).isSkinnedMesh) return;
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    if (!mat || mat.transparent || !m.geometry.attributes.normal) return;
    if (o.children.some((c) => c.userData.inkHull)) return;
    add.push(m);
  });
  for (const m of add) {
    const hull = new Mesh(m.geometry, ink);
    hull.name = `${m.name || 'mesh'}-ink`;
    hull.userData.inkHull = true;
    hull.renderOrder = 1;
    m.add(hull);
  }
  return add.length;
}
