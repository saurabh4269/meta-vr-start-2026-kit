/**
 * Cel shading for the Sadak VR street.
 *
 * Ported from SADAK (game_engine/lib/game/fx/toon.ts, fx/celShader.ts and
 * fx/presets.ts DELHI_PRESET; authors ahmedfahim21, Parth Mittal, Apoorva
 * Agrawal, Mardav Gandhi; reused with permission). The ramp values, the
 * shadow-tint patch and the split-tone grade are adapted from sakura-crossing
 * (https://github.com/Kenton-GMI/sakura-crossing), MIT License,
 * Copyright (c) 2026 Kenton Wang.
 *
 * Differences from the desktop game, forced by Quest 3 standalone:
 *  - No post-processing. The ink pass is gone; the grade (split tone,
 *    saturation, temperature, soft highlight shoulder) runs at the end of
 *    every street fragment instead of in a full-screen pass.
 *  - Lighting is computed here from shared uniforms instead of three's light
 *    loop. The room scene has its own key light and ACES tone mapping; neither
 *    should touch the street, and the street must look the same whatever the
 *    director puts in the scene. The sun and hemisphere light are still real
 *    three.js lights (see street.ts) and `syncLights` copies them in.
 *  - Every street material shares one uniform set, so the reveal sphere, fog
 *    and sun are one write per frame for the whole world.
 */

import {
  Color,
  DoubleSide,
  FrontSide,
  ShaderMaterial,
  Vector3,
  type DirectionalLight,
  type HemisphereLight,
  type Side,
  type Texture,
} from '@iwsdk/core';

/** Marigold: the reveal edge, and the colour of the spot accents. */
export const MARIGOLD = 0xffa21a;

/** Uniforms shared by every street material (one object, many materials). */
export const U = {
  uSunDir: { value: new Vector3(-0.55, 0.5, 0.65).normalize() },
  uSunColor: { value: new Color(1, 0.9, 0.72) },
  uSkyColor: { value: new Color(0.62, 0.72, 0.86) },
  uGroundColor: { value: new Color(0.55, 0.42, 0.3) },
  uShadowTint: { value: new Color(0x8a7fb8) },
  uRamp: { value: new Vector3(0.36, 0.7, 1.0) },
  uRevealCenter: { value: new Vector3() },
  /** Effective cut radius (metres); 1e9 when fully revealed. */
  uRevealRadius: { value: 1e9 },
  /** Raw radius as the director set it: drives the sky's horizon-up reveal. */
  uRevealRaw: { value: 100 },
  uRevealBand: { value: 0.14 },
  uRevealGlow: { value: new Color(MARIGOLD).multiplyScalar(2.2) },
  uFogColor: { value: new Color(0xf2c592) },
  uFogNear: { value: 40 },
  uFogFar: { value: 230 },
  uFogMax: { value: 0.6 },
  uTime: { value: 0 },
  /** Ink outlines (inverted hulls, see kit.ts inkShell): colour, width in
   *  metres per metre of distance (screen-constant, ~0.13 deg), clamps. */
  uInkColor: { value: new Color(0x2a1a12) },
  uInkWidth: { value: 0.0022 },
  uInkMin: { value: 0.0011 },
  uInkMax: { value: 0.3 },
};

/** Copy the street's real lights into the shared uniforms (world space). */
export function syncLights(sun: DirectionalLight, hemi: HemisphereLight): void {
  sun.updateWorldMatrix(true, false);
  sun.target.updateWorldMatrix(true, false);
  const p = U.uSunDir.value.setFromMatrixPosition(sun.matrixWorld);
  const t = _v.setFromMatrixPosition(sun.target.matrixWorld);
  p.sub(t).normalize();
  U.uSunColor.value.copy(sun.color).multiplyScalar(sun.visible ? sun.intensity : 0);
  U.uSkyColor.value.copy(hemi.color).multiplyScalar(hemi.visible ? hemi.intensity : 0);
  U.uGroundColor.value.copy(hemi.groundColor).multiplyScalar(hemi.visible ? hemi.intensity : 0);
}
const _v = new Vector3();

/* ------------------------------------------------------------------ */

export const REVEAL_PARS = /* glsl */ `
uniform vec3 uRevealCenter;
uniform float uRevealRadius;
uniform float uRevealBand;
uniform vec3 uRevealGlow;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uFogMax;
`;

/**
 * The DELHI grade from fx/presets.ts, folded into the material: exposure and
 * a soft shoulder, violet-to-paper split tone, gain, saturation, warm white
 * balance. Linear in, linear out.
 */
export const GRADE = /* glsl */ `
vec3 celGrade( vec3 col ) {
  col *= 1.06;
  vec3 over = max( col - 0.78, 0.0 );
  col = min( col, vec3( 0.78 ) ) + 0.22 * ( 1.0 - exp( -over / 0.22 ) );
  float l = dot( col, vec3( 0.2126, 0.7152, 0.0722 ) );
  float k = smoothstep( 0.02, 0.55, l );
  col *= mix( vec3( 0.86, 0.84, 1.0 ), vec3( 1.0, 0.97, 0.9 ), k );
  col += 0.018 * ( 1.0 - k );
  col *= vec3( 1.06, 1.03, 1.0 );
  l = dot( col, vec3( 0.2126, 0.7152, 0.0722 ) );
  col = mix( vec3( l ), col, 1.18 );
  col.r += 0.006;
  col.b -= 0.006;
  return max( col, 0.0 );
}
`;

/** Discard outside the reveal sphere; returns 0..1 inside the glowing band. */
export const REVEAL_FN = /* glsl */ `
float revealEdge( vec3 wp ) {
  float d = distance( wp, uRevealCenter );
  if ( d > uRevealRadius ) discard;
  return 1.0 - smoothstep( 0.0, uRevealBand, uRevealRadius - d );
}
vec3 revealFinish( vec3 col, vec3 wp, float edge ) {
  float f = smoothstep( uFogNear, uFogFar, distance( wp, cameraPosition ) ) * uFogMax;
  col = mix( col, uFogColor, f );
  return mix( col, uRevealGlow, edge );
}
`;

const VERT = /* glsl */ `
#include <common>
#include <color_pars_vertex>
#include <skinning_pars_vertex>
#ifdef USE_GLOW
attribute float glow;
varying float vGlow;
#endif
#ifdef USE_ATLAS
varying vec2 vUv;
#endif
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
attribute float ink;
varying float vInk;
uniform float uInkWidth;
uniform float uInkMin;
uniform float uInkMax;

void main() {
  #include <color_vertex>
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 wp = vec4( transformed, 1.0 );
  vec3 wn = objectNormal;
  #ifdef USE_INSTANCING
    wp = instanceMatrix * wp;
    wn = mat3( instanceMatrix ) * wn;
  #endif
  wp = modelMatrix * wp;
  vInk = 0.0;
  if ( ink > 0.0 ) {
    // Inverted hull: push out along the mitred normal by a width that is
    // constant on screen and fades to nothing toward the part's ink distance,
    // and back along the view ray by twice that (silhouette unchanged), so
    // the shell never fights the surface in front of it.
    vec3 dn = normalize( mat3( modelMatrix ) * wn );
    #ifdef USE_GLOW
      dn *= glow;
    #endif
    float d = distance( wp.xyz, cameraPosition );
    float w = clamp( uInkWidth * d, uInkMin, uInkMax ) * ( 1.0 - smoothstep( ink * 0.6, ink, d ) );
    wp.xyz += dn * w - normalize( cameraPosition - wp.xyz ) * ( 2.0 * w );
    vInk = 1.0;
  }
  vWorldPos = wp.xyz;
  vWorldNormal = normalize( mat3( modelMatrix ) * wn );
  #ifdef USE_GLOW
    vGlow = glow;
  #endif
  #ifdef USE_ATLAS
    vUv = uv;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
  // Hook for IWSDK's DepthOccludable patch (a no-op chunk here: fog is off).
  #include <fog_vertex>
}
`;

const FRAG = /* glsl */ `
#include <common>
#include <color_pars_fragment>
uniform vec3 diffuse;
uniform float opacity;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uShadowTint;
uniform vec3 uRamp;
uniform vec3 uInkColor;
varying float vInk;
${REVEAL_PARS}
#ifdef USE_GLOW
varying float vGlow;
#endif
#ifdef USE_ATLAS
uniform sampler2D uAtlas;
varying vec2 vUv;
#endif
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
${GRADE}
${REVEAL_FN}

float celBand( float ndl ) {
  float w = fwidth( ndl ) + 0.002;
  float b1 = smoothstep( -0.333 - w, -0.333 + w, ndl );
  float b2 = smoothstep( 0.333 - w, 0.333 + w, ndl );
  return mix( uRamp.x, mix( uRamp.y, uRamp.z, b2 ), b1 );
}

void main() {
  vec4 diffuseColor = vec4( diffuse, opacity );
  float edge = revealEdge( vWorldPos );
  if ( vInk > 0.5 ) {
    #ifdef DOUBLE_SIDED
      // Only the hull's far side is ink; a double-sided material draws both.
      if ( !gl_FrontFacing ) discard;
    #endif
    gl_FragColor = vec4( revealFinish( uInkColor, vWorldPos, edge ), 1.0 );
    #include <colorspace_fragment>
    return;
  }
  vec3 albedo = diffuseColor.rgb;
  #ifdef USE_COLOR
    albedo *= vColor.rgb;
  #endif
  #ifdef USE_ATLAS
    vec4 tex = texture2D( uAtlas, vUv );
    #ifdef USE_ALPHATEST
      if ( tex.a < 0.5 ) discard;
    #endif
    albedo *= tex.rgb;
  #endif

  #ifdef FLAT_SHADED
    vec3 N = normalize( cross( dFdx( vWorldPos ), dFdy( vWorldPos ) ) );
    // A visible face always faces the eye; this also makes the derivative
    // normal independent of the render target's handedness.
    if ( dot( N, cameraPosition - vWorldPos ) < 0.0 ) N = -N;
  #else
    vec3 N = normalize( vWorldNormal );
    #ifdef DOUBLE_SIDED
      // Face the viewer so the inside of a tarp is lit like its outside.
      if ( dot( N, cameraPosition - vWorldPos ) < 0.0 ) N = -N;
    #endif
  #endif

  float ndl = dot( N, uSunDir );
  float band = celBand( ndl );
  vec3 direct = band * mix( uShadowTint, vec3( 1.0 ), band ) * uSunColor;
  vec3 hemi = mix( uGroundColor, uSkyColor, N.y * 0.5 + 0.5 );
  vec3 col = albedo * ( direct + hemi );

  #ifdef USE_RIM
    // Cheap ink: a dark line where the surface turns away from the eye.
    vec3 V = normalize( cameraPosition - vWorldPos );
    float rim = 1.0 - abs( dot( N, V ) );
    col *= mix( 1.0, 0.32, smoothstep( 0.72, 0.9, rim ) );
  #endif

  col = celGrade( col );
  #ifdef USE_GLOW
    col = mix( col, albedo * 1.5, vGlow );
  #endif
  col = revealFinish( col, vWorldPos, edge );
  gl_FragColor = vec4( col, diffuseColor.a );
  #include <colorspace_fragment>
}
`;

export type CelOptions = {
  color?: number;
  vertexColors?: boolean;
  /** Per-vertex `glow` attribute (0 lit, 1 self-lit). */
  glow?: boolean;
  atlas?: Texture | null;
  /** Faceted normals (the Sadak look). People and food use smooth. */
  flat?: boolean;
  doubleSided?: boolean;
  alphaTest?: boolean;
  /** Dark silhouette line (people). */
  rim?: boolean;
  name?: string;
};

/** A cel material wired to the shared street uniforms. */
export function celMaterial(o: CelOptions = {}): ShaderMaterial {
  const defines: Record<string, string> = {};
  if (o.glow) defines.USE_GLOW = '';
  if (o.atlas) defines.USE_ATLAS = '';
  if (o.alphaTest) defines.USE_ALPHATEST = '';
  if (o.rim) defines.USE_RIM = '';
  const side: Side = o.doubleSided ? DoubleSide : FrontSide;
  const m = new ShaderMaterial({
    name: o.name ?? 'cel',
    defines,
    uniforms: {
      ...U,
      diffuse: { value: new Color(o.color ?? 0xffffff) },
      opacity: { value: 1 },
      uAtlas: { value: o.atlas ?? null },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    vertexColors: o.vertexColors ?? false,
    side,
  });
  // WebGLPrograms honours flatShading on any material; the typings omit it for ShaderMaterial.
  Object.assign(m, { flatShading: o.flat ?? true });
  return m;
}

/* ------------------------------------------------------------------ */

/**
 * Unlit vertex-coloured material (the painted skyline flats, birds' bellies
 * in the far sky): fog-free, reveal-aware, graded.
 */
export function flatColourMaterial(o: { vertexColors?: boolean; color?: number; atlas?: Texture | null; alphaTest?: boolean; doubleSided?: boolean; fog?: number } = {}): ShaderMaterial {
  const defines: Record<string, string> = {};
  if (o.atlas) defines.USE_ATLAS = '';
  if (o.alphaTest) defines.USE_ALPHATEST = '';
  const m = new ShaderMaterial({
    name: 'unlit',
    defines,
    uniforms: { ...U, diffuse: { value: new Color(o.color ?? 0xffffff) }, uAtlas: { value: o.atlas ?? null }, uFogScale: { value: o.fog ?? 1 } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <color_pars_fragment>
      uniform vec3 diffuse;
      uniform float uFogScale;
      ${REVEAL_PARS}
      #ifdef USE_ATLAS
      uniform sampler2D uAtlas;
      varying vec2 vUv;
      #endif
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      ${GRADE}
      ${REVEAL_FN}
      void main() {
        float edge = revealEdge( vWorldPos );
        vec3 col = diffuse;
        #ifdef USE_COLOR
          col *= vColor.rgb;
        #endif
        #ifdef USE_ATLAS
          vec4 tex = texture2D( uAtlas, vUv );
          #ifdef USE_ALPHATEST
            if ( tex.a < 0.5 ) discard;
          #endif
          col *= tex.rgb;
        #endif
        col = celGrade( col );
        float f = smoothstep( uFogNear, uFogFar, distance( vWorldPos, cameraPosition ) ) * uFogMax * uFogScale;
        col = mix( col, uFogColor, f );
        col = mix( col, uRevealGlow, edge );
        gl_FragColor = vec4( col, 1.0 );
        #include <colorspace_fragment>
      }
    `,
    vertexColors: o.vertexColors ?? false,
    side: o.doubleSided ? DoubleSide : FrontSide,
  });
  return m;
}

/** For SADAK's own materials (sadak-city.ts revealPatch). */
export const REVEAL_GLSL = REVEAL_PARS + REVEAL_FN;
export const GRADE_GLSL = GRADE;
