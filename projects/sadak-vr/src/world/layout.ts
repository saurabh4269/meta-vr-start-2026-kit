/**
 * Where each errand's counter stands on SADAK's Purani Sadak map.
 *
 * The city itself is SADAK's own (sadak-city.ts). These are the counter
 * positions: the auto and bus keep their kerbside spots below (from SADAK's
 * map spots, turned so the vehicles pull up beside the user); the kachori,
 * flowers, paranthe and minaret spots are overwritten at build time with
 * where SADAK's engine stands each host (street.ts, SadakCity.placeHost).
 *
 * Frame: SADAK's map frame, metres, +x east, +z south.
 */

import type { SpotId } from './types.js';

export type Pt = [number, number];

/** Where each counter stands (world, ground level) and which way its user side faces (+Z = (sin yaw, cos yaw)). */
export type SpotDef = { x: number; z: number; yaw: number; label: string };

export const SPOTS: Record<SpotId, SpotDef> = {
  // West edge of Dariba Kalan, 4 m in from Chandni Chowk; the shop faces east
  // into the lane (SADAK's spot yaw 1.495), the boulevard on the user's right.
  kachori: { x: 3.45, z: -312.0, yaw: 1.495, label: 'Dariba Kalan corner, Chandni Chowk' },
  // Chandni Chowk's south frontage, just east of the Gauri Shankar temple.
  flowers: { x: 221.23, z: -304.53, yaw: 3.085, label: 'Gauri Shankar temple, Chandni Chowk' },
  // West edge of Dariba Kalan; the user faces north up the lane, the auto pulls up on their right.
  auto: { x: -3.92, z: -100.67, yaw: -0.144, label: 'Dariba Kalan' },
  // West footpath of Netaji Subhash Marg at the Lal Quila stop; the user faces north, the road on their right.
  bus: { x: 281.39, z: -91.1, yaw: -0.0326, label: 'Lal Quila bus stop, Netaji Subhash Marg' },
  // West side of Paranthe Wali Gali, 10 m in from Chandni Chowk (on the user's right).
  paranthe: { x: -278.92, z: -326.07, yaw: 1.5182, label: 'Paranthe Wali Gali' },
  // 7 m east of the foot of the Jama Masjid's east stair, facing up it.
  minaret: { x: 72.39, z: 277.03, yaw: 1.638, label: 'Jama Masjid, east stair' },
};

/** Counter-local (x, z) of a spot -> world (x, z). */
export function toWorld(id: SpotId, lx: number, lz: number): Pt {
  const s = SPOTS[id];
  const c = Math.cos(s.yaw);
  const n = Math.sin(s.yaw);
  return [s.x + lx * c + lz * n, s.z - lx * n + lz * c];
}

/** World (x, z) -> counter-local (x, z). */
export function toLocal(id: SpotId, x: number, z: number): Pt {
  const s = SPOTS[id];
  const c = Math.cos(s.yaw);
  const n = Math.sin(s.yaw);
  const dx = x - s.x;
  const dz = z - s.z;
  return [dx * c - dz * n, dx * n + dz * c];
}
