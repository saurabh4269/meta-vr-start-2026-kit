import type { Group, Object3D, Vector3 } from '@iwsdk/core';

/**
 * Contract between the director (src/game/*) and the street world (src/world/*).
 *
 * Coordinates: the director owns an `anchor` group whose origin sits on the
 * user's REAL table top (y = 0 is the table surface), with local +Z pointing
 * toward the seated user (user's eyes at roughly (0, 0.45, 0.45)).
 * The director adds `StreetWorld.group` as a child of that anchor.
 * `setActive(id)` must position `group` so that the active spot's counter
 * origin coincides with the anchor origin (the real table becomes the stall
 * counter, the vendor stands behind it at -Z).
 */

export type SpotId = 'kachori' | 'flowers' | 'auto' | 'paranthe' | 'bus' | 'minaret';

export type Gesture = 'offer' | 'receive' | 'wave' | 'nod' | 'shake' | 'namaste';

export interface VendorRig {
  root: Object3D;
  /** Animate speaking (head bobs, hand gestures) for `seconds`. */
  talk(seconds: number): void;
  /** Look at a point given in ANCHOR-local coordinates (null = idle gaze). */
  setLookAt(target: Vector3 | null): void;
  gesture(kind: Gesture): void;
  /** The vendor's right hand; the director may parent a held item here. */
  hand: Object3D;
  update(dt: number, time: number): void;
}

export interface Spot {
  id: SpotId;
  /** Counter-top origin of this spot (street-local). */
  counter: Object3D;
  vendor: VendorRig;
  /**
   * Pickable goods on the counter, positioned in ANCHOR-local space once
   * active (children of the street group; the director reads world positions).
   * kachori: 2+ kachoris on leaf plates; flowers: 2+ marigold garlands;
   * paranthe: 2-3 paranthas on steel plates; auto, bus, minaret: none.
   */
  items: Object3D[];
  /** Small brass plate (thaali) on the vendor's side where the user drops coins. */
  plate: Object3D;
}

export interface AutoRig {
  root: Object3D;
  /** Drive in and stop beside the user's table (≈2 s). */
  arrive(): void;
  /** Drive away (≈2 s). */
  leave(): void;
  readonly parked: boolean;
  update(dt: number, time: number): void;
}

export type RideKind = 'rickshaw' | 'auto' | 'bus';

export interface RideHandle {
  /** 0..1 over the whole ride, including the stops at each end. */
  readonly progress: number;
  readonly done: boolean;
  /** Jump to the end: `to` becomes active at once. */
  skip(): void;
}

export interface StreetWorld {
  group: Group;
  spots: Record<SpotId, Spot>;
  auto: AutoRig;
  /** arrive(): the bus pulls into the stop beside the user; leave(): drives off. */
  bus: AutoRig;
  /** Real table height above the floor in metres (street ground sits this far below the counter top). */
  setTableHeight(h: number): void;
  /** Reveal radius in metres around the anchor origin: 0 = nothing (passthrough), >= 60 = the whole street. Edge glows marigold. */
  setReveal(radius: number): void;
  setActive(id: SpotId): void;
  /**
   * Ride from the active spot to `to`: the user sits in the vehicle, which
   * stays with the anchor (the user), while the street moves past along a real
   * route through the street network. Ends with `to` active (same pose as
   * setActive(to)).
   */
  ride(to: SpotId, kind: RideKind): RideHandle;
  update(dt: number, time: number): void;
}
