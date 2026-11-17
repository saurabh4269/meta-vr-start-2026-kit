/**
 * Golden-hour sky, painted clouds and a hazy skyline.
 *
 * Adapted from SADAK (fx/sky.ts `makeDome`, `makeClouds`, `makeSkyline`;
 * authors ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused
 * with permission). The dome and cloud approach is adapted from
 * sakura-crossing (https://github.com/Kenton-GMI/sakura-crossing), MIT
 * License, Copyright (c) 2026 Kenton Wang.
 *
 * VR changes: the dome carries a soft sun glow (no bloom pass), lives inside
 * the 200 m far plane, and reveals from the horizon up as the reveal radius
 * goes 42 -> 60 m, with the same marigold edge as the street. Clouds are
 * atlas cards and the skyline is vertex-coloured flats, one draw call for both.
 */

import { BackSide, BoxGeometry, Color, CylinderGeometry, Mesh, PlaneGeometry, ShaderMaterial, SphereGeometry } from '@iwsdk/core';
import { Parts, mulberry32, pick } from './kit.js';
import { U } from './cel.js';
import type { Atlas } from './atlas.js';

/** Zenith -> horizon, golden hour over Old Delhi. */
const STOPS = ['#4a80bd', '#7ea9d0', '#c4c4c6', '#f2c99a', '#f6a764'];

export function makeDome(radius: number): Mesh {
  const mat = new ShaderMaterial({
    name: 'sky',
    side: BackSide,
    depthWrite: false,
    uniforms: {
      uStops: { value: STOPS.map((s) => new Color(s)) },
      uSunDir: U.uSunDir,
      uRevealRaw: U.uRevealRaw,
      uRevealGlow: U.uRevealGlow,
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uStops[5];
      uniform vec3 uSunDir;
      uniform float uRevealRaw;
      uniform vec3 uRevealGlow;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize( vDir );
        float e = clamp( d.y, 0.0, 1.0 );
        // Reveal from the horizon up: the band climbs as the radius goes 42 -> 60.
        float thr = 42.0 + 18.0 * sqrt( e );
        if ( uRevealRaw < thr ) discard;
        float q = floor( e * 28.0 ) / 28.0;
        e = mix( e, q, 0.3 );
        vec3 c = uStops[4];
        c = mix( c, uStops[3], smoothstep( 0.0, 0.08, e ) );
        c = mix( c, uStops[2], smoothstep( 0.06, 0.22, e ) );
        c = mix( c, uStops[1], smoothstep( 0.18, 0.5, e ) );
        c = mix( c, uStops[0], smoothstep( 0.42, 0.95, e ) );
        // Sun: a soft warm halo and a small hot disc.
        float s = max( dot( d, normalize( uSunDir ) ), 0.0 );
        c += vec3( 1.0, 0.68, 0.34 ) * pow( s, 6.0 ) * 0.32;
        c += vec3( 1.0, 0.82, 0.55 ) * pow( s, 60.0 ) * 0.6;
        // A warm band all round the horizon, strongest toward the sun.
        c = mix( c, vec3( 0.98, 0.62, 0.36 ), ( 1.0 - smoothstep( 0.0, 0.16, e ) ) * ( 0.25 + 0.35 * s ) );
        c = mix( c, vec3( 1.0, 0.96, 0.85 ), smoothstep( 0.9985, 0.9992, s ) );
        float edge = 1.0 - smoothstep( 0.0, 1.5, uRevealRaw - thr );
        c = mix( c, uRevealGlow, edge * step( uRevealRaw, 59.9 ) );
        gl_FragColor = vec4( c, 1.0 );
        #include <colorspace_fragment>
      }
    `,
  });
  const dome = new Mesh(new SphereGeometry(radius, 32, 16), mat);
  dome.name = 'sky-dome';
  dome.frustumCulled = false;
  dome.renderOrder = -10;
  return dome;
}

/**
 * Clouds (atlas cards, two-tone like fx/sky.ts) and two rings of skyline
 * flats pulled toward the haze. Everything sits between 105 and 170 m from
 * `centre` so it stays inside the camera's far plane from every spot.
 */
export function backdropParts(atlas: Atlas, cx: number, cz: number, palette: number[], gap: number | null = null, seed = 4242): Parts {
  const P = new Parts();
  const rand = mulberry32(seed);
  const haze = new Color(0xf2c99a);
  const hazeHex = (hex: number, k: number) => new Color(hex).lerp(haze, k).getHex();
  // Skyline: boxes in two rings, coloured from the district palette.
  for (const ring of [{ r: 146, depth: 10, pull: 0.55, hMin: 12, hMax: 30 }, { r: 160, depth: 8, pull: 0.7, hMin: 18, hMax: 44 }]) {
    const n = Math.round((Math.PI * 2 * ring.r) / 14);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand() * 0.04;
      // Leave the masjid's sightline clear (gap: its bearing, atan2(dx, dz)).
      if (gap !== null) {
        const ga = Math.atan2(Math.cos(gap), Math.sin(gap));
        if (Math.abs(Math.atan2(Math.sin(a - ga), Math.cos(a - ga))) < 0.3) continue;
      }
      const r = ring.r + rand() * ring.depth;
      const w = 9 + rand() * 11;
      const h = ring.hMin + rand() * (ring.hMax - ring.hMin);
      const col = hazeHex(pick(palette, rand), ring.pull + (rand() - 0.5) * 0.06);
      const g = new BoxGeometry(w, h, 6 + rand() * 6).translate(0, h / 2, 0);
      g.rotateY(-a + Math.PI / 2).translate(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r);
      P.add(g, col);
      if (rand() > 0.6) {
        const th = 3 + rand() * 8;
        P.add(new BoxGeometry(w * 0.45, th, 4).translate(0, h + th / 2, 0).rotateY(-a + Math.PI / 2).translate(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r), col);
      }
      if (rand() > 0.7) P.add(new CylinderGeometry(0.9, 0.9, 1.6, 6).translate(cx + Math.cos(a) * r, h + 0.8, cz + Math.sin(a) * r), hazeHex(0x26272b, ring.pull));
    }
  }
  // Clouds: a light card over a slightly larger shade card behind it.
  const light = 0xfff6ea;
  const shade = new Color(0xc9c2dc).getHex();
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + (rand() - 0.5) * 0.3;
    const r = 168 + rand() * 6;
    const w = 40 + rand() * 50;
    const h = w * 0.36;
    const y = 30 + rand() * 35;
    const cell = atlas.rect(rand() < 0.5 ? 'cloud0' : 'cloud1');
    const yaw = -a - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const pz = cz + Math.sin(a) * r;
    P.tex(new PlaneGeometry(w, h).translate(0, -h * 0.08, -1.5).rotateY(yaw).translate(px, y, pz), cell, shade);
    P.tex(new PlaneGeometry(w * 0.94, h * 0.9).translate(-w * 0.02, h * 0.04, 0).rotateY(yaw).translate(px, y, pz), cell, light);
  }
  return P;
}
