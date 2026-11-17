/**
 * Vendor life: breathing, weight shift, blinks, gaze, talking and gestures.
 *
 * The idle and breathing curves follow SADAK's people.ts `idlePose` (authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission). Everything else is new for VR: hands are placed with an
 * analytic two-bone IK so they land on the counter, over it (offer), palm up
 * (receive) or together (namaste) whatever the table height, and the hand
 * orientation is set in the body's frame and converted to the wrist.
 *
 * Frames: the vendor's `root` is a holder whose origin is between the feet on
 * the street, +Z toward the counter and the user. The counter top is at
 * holder y = counterY (the real table height).
 */

import { Group, MathUtils, Matrix4, Object3D, Quaternion, Vector3 } from '@iwsdk/core';
import type { Gesture, VendorRig } from './types.js';
import type { PersonRig } from './people.js';
import { mulberry32 } from './kit.js';

type GestureState = { kind: Gesture; t: number; dur: number; tin: number; tout: number };

const DUR: Record<Gesture, [number, number, number]> = {
  // [duration, ease-in, ease-out] seconds
  offer: [4.2, 0.7, 0.7],
  receive: [3.6, 0.6, 0.6],
  wave: [2.4, 0.4, 0.5],
  nod: [1.5, 0.15, 0.25],
  shake: [1.5, 0.15, 0.25],
  namaste: [2.8, 0.6, 0.7],
};

export type VendorOptions = {
  rig: PersonRig;
  /** The spot's counter frame (counter-top origin, +Z toward the user). */
  counter: Object3D;
  /** Anchor matrixWorld, for `setLookAt` points given in anchor space. */
  anchorMatrix: () => Matrix4;
  /** Where the left hand goes for idle chores (holder space, y relative to the counter top). */
  chore: Vector3;
  /** 'stir' circles over a kadhai, 'thread' small two-hand work, 'pour' lift and tip. */
  choreKind: 'stir' | 'thread' | 'pour';
  seed: number;
  /** Distance from the counter origin to the vendor's feet, along -Z. */
  standBack: number;
};

const _v = new Vector3();
const _w = new Vector3();
const _d = new Vector3();
const _e = new Vector3();
const _u = new Vector3();
const _f = new Vector3();
const _p = new Vector3();
const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _m = new Matrix4();
const _q = new Quaternion();
const _q2 = new Quaternion();
const USER_EYE = new Vector3(0, 0.45, 0.45);

function ease(t: number): number {
  return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
}

/** Holder-space hand orientation: fingers along `fingers`, palm facing `palm`. */
function handQuat(out: Quaternion, fingers: Vector3, palm: Vector3, side: 1 | -1): Quaternion {
  _y.copy(fingers).normalize().negate();
  _x.copy(palm).multiplyScalar(-side);
  _x.addScaledVector(_y, -_x.dot(_y)).normalize();
  _z.crossVectors(_x, _y);
  _m.makeBasis(_x, _y, _z);
  return out.setFromRotationMatrix(_m);
}

export class Vendor implements VendorRig {
  readonly root = new Group();
  readonly hand = new Object3D();
  counterY = 0.74;

  private readonly o: VendorOptions;
  private readonly b: PersonRig['bones'];
  private readonly rand: () => number;
  private talkLeft = 0;
  private talkW = 0;
  private gestureState: GestureState | null = null;
  private lookAnchor: Vector3 | null = null;
  private idleLook = new Vector3();
  private idleTimer = 0;
  private lookingAway = false;
  private blinkTimer = 1.5;
  private blinkT = -1;
  private choreTimer = 5;
  private choreT = -1;
  private readonly handL = new Vector3();
  private readonly handR = new Vector3();
  private readonly qL = new Quaternion();
  private readonly qR = new Quaternion();
  private lean = 0;
  private yaw = 0;
  private pitch = 0;
  private started = false;
  private readonly tL = new Vector3();
  private readonly tR = new Vector3();
  private readonly tqL = new Quaternion();
  private readonly tqR = new Quaternion();

  constructor(o: VendorOptions) {
    this.o = o;
    this.b = o.rig.bones;
    this.rand = mulberry32(o.seed);
    this.root.name = 'vendor';
    this.root.add(o.rig.mesh);
    // The director's hold point: palm centre, +Y out of the palm, real scale.
    const s = o.rig.dims.scale;
    this.hand.name = 'vendor-hand';
    this.hand.position.set(0.03, -0.065, 0.0);
    this.hand.rotation.z = -Math.PI / 2;
    this.hand.scale.setScalar(1 / s);
    this.b.wristR.add(this.hand);
    for (const k of ['neck', 'head']) this.b[k].rotation.order = 'YXZ';
    this.b.hips.userData.baseY = this.b.hips.position.y;
    this.idleTimer = 0.5 + this.rand() * 2;
  }

  talk(seconds: number): void {
    this.talkLeft = Math.max(0, seconds);
  }

  setLookAt(target: Vector3 | null): void {
    if (!target) this.lookAnchor = null;
    else (this.lookAnchor ??= new Vector3()).copy(target);
  }

  gesture(kind: Gesture): void {
    const [dur, tin, tout] = DUR[kind];
    this.gestureState = { kind, t: 0, dur, tin, tout };
  }

  /** 0..1 weight of the running gesture, or 0. */
  private gw(kind: Gesture): number {
    const g = this.gestureState;
    if (!g || g.kind !== kind) return 0;
    return ease(g.t / g.tin) * (1 - ease((g.t - (g.dur - g.tout)) / g.tout));
  }

  update(dt: number, time: number): void {
    const b = this.b;
    const dims = this.o.rig.dims;
    const s = dims.scale;
    const C = this.counterY;
    const rand = this.rand;

    // ---- timers ----
    this.talkLeft = Math.max(0, this.talkLeft - dt);
    this.talkW += ((this.talkLeft > 0 ? 1 : 0) - this.talkW) * (1 - Math.exp(-dt * 6));
    if (this.gestureState) {
      this.gestureState.t += dt;
      if (this.gestureState.t >= this.gestureState.dur) this.gestureState = null;
    }
    const busy = this.talkLeft > 0 || this.gestureState !== null;
    // Idle chore: every 7-13 s, ~3.2 s of stirring / threading / pouring.
    if (this.choreT >= 0) {
      this.choreT += dt;
      if (this.choreT > 3.2 || busy) this.choreT = -1;
    } else if (!busy) {
      this.choreTimer -= dt;
      if (this.choreTimer <= 0) {
        this.choreT = 0;
        this.choreTimer = 7 + rand() * 6;
      }
    }
    const chore = this.choreT >= 0 ? ease(this.choreT / 0.6) * (1 - ease((this.choreT - 2.6) / 0.6)) : 0;

    const wOffer = this.gw('offer');
    const wReceive = this.gw('receive');
    const wWave = this.gw('wave');
    const wNam = this.gw('namaste');
    const wNod = this.gw('nod');
    const wShake = this.gw('shake');
    const gt = this.gestureState?.t ?? 0;

    // ---- body: breathing, weight shift, lean ----
    const breath = Math.sin(time * 1.6 + this.o.seed);
    const shift = Math.sin(time * 0.5 + this.o.seed * 0.7);
    const leanT = 0.12 + 0.2 * wOffer + 0.14 * wReceive + 0.14 * wNam - 0.04 * this.talkW + 0.04 * chore;
    this.lean += (leanT - this.lean) * (1 - Math.exp(-dt * 5));
    b.spine.rotation.set(this.lean + breath * 0.008, shift * 0.03, -shift * 0.012);
    b.hips.rotation.set(0, shift * 0.02, shift * 0.025);
    b.hips.position.y = b.hips.userData.baseY + breath * 0.003;
    b.chest.scale.set(1 + breath * 0.012, 1 + breath * 0.006, 1 + breath * 0.02);
    b.hipL.rotation.set(-shift * 0.03, 0, 0.015);
    b.hipR.rotation.set(shift * 0.03, 0, -0.015);
    b.kneeL.rotation.x = 0.05 + Math.max(0, shift) * 0.05;
    b.kneeR.rotation.x = 0.05 + Math.max(0, -shift) * 0.05;

    // ---- hand targets (holder space) ----
    const shoulderH = dims.shoulderY * s;
    // Hands rest just over the counter's back edge; on a very low table they
    // stay at hip height rather than hanging off straight arms.
    const restY = Math.max(C + 0.1, 0.8);
    const restZ = this.o.standBack - 0.44;
    this.tL.set(0.17 + shift * 0.01, restY + breath * 0.004, restZ);
    this.tR.set(-0.17 + shift * 0.01, restY + breath * 0.004, restZ + 0.01);
    handQuat(this.tqL, _v.set(0.1, -0.35, 1), _w.set(0.15, -1, 0.1), 1);
    handQuat(this.tqR, _v.set(-0.1, -0.35, 1), _w.set(-0.15, -1, 0.1), -1);

    // Chore with the left hand (and a helping right hand when threading).
    if (chore > 0) {
      const c = this.o.chore;
      const ct = this.choreT;
      if (this.o.choreKind === 'stir') {
        _v.set(c.x + Math.cos(ct * 5) * 0.05, C + c.y + 0.12, c.z + Math.sin(ct * 5) * 0.04);
        this.tL.lerp(_v, chore);
        handQuat(_q, _v.set(0, -0.8, 0.6), _w.set(-1, -0.1, 0), 1);
        this.tqL.slerp(_q, chore);
      } else if (this.o.choreKind === 'thread') {
        _v.set(0.06, C + 0.12 + Math.sin(ct * 3) * 0.02, this.o.standBack - 0.36);
        this.tL.lerp(_v, chore);
        _v.set(-0.05, C + 0.13 + Math.sin(ct * 3 + 1.2) * 0.025, this.o.standBack - 0.34);
        this.tR.lerp(_v, chore);
        handQuat(_q, _v.set(-0.3, 0.1, 1), _w.set(-0.6, 0.6, 0), 1);
        this.tqL.slerp(_q, chore);
        handQuat(_q, _v.set(0.3, 0.1, 1), _w.set(0.6, 0.6, 0), -1);
        this.tqR.slerp(_q, chore);
      } else {
        const lift = Math.max(0, Math.sin(ct * 1.6));
        _v.set(c.x, C + c.y + 0.12 + lift * 0.1, c.z);
        this.tL.lerp(_v, chore);
        handQuat(_q, _v.set(0, -0.5 - lift * 0.3, 1), _w.set(-1, 0, 0), 1);
        this.tqL.slerp(_q, chore);
      }
    }

    // Talking: beats with the right hand in front of the chest, the left
    // joining in now and then.
    if (this.talkW > 0.001) {
      const tw = this.talkW;
      _v.set(
        -0.15 + Math.sin(time * 2.1) * 0.04,
        shoulderH - 0.36 + Math.abs(Math.sin(time * 4.3)) * 0.06 + Math.sin(time * 1.1) * 0.03,
        0.3 + Math.sin(time * 1.3) * 0.04,
      );
      this.tR.lerp(_v, tw);
      handQuat(_q, _v.set(-0.15, 0.25, 1), _w.set(0.45, 0.85, 0.1), -1);
      this.tqR.slerp(_q, tw);
      const left = Math.max(0, Math.sin(time * 0.7 + 1)) * tw;
      _v.set(0.14 + Math.sin(time * 1.7) * 0.03, shoulderH - 0.42 + Math.abs(Math.sin(time * 3.1 + 1)) * 0.04, 0.27);
      this.tL.lerp(_v, left);
      handQuat(_q, _v.set(0.15, 0.25, 1), _w.set(-0.45, 0.85, 0.1), 1);
      this.tqL.slerp(_q, left);
    }

    // Gestures override.
    const reach = (w: number, x: number, y: number, z: number, fingers: Vector3, palm: Vector3, side: 1 | -1) => {
      if (w <= 0) return;
      _p.set(x, y, z);
      handQuat(_q, fingers, palm, side);
      if (side === -1) {
        this.tR.lerp(_p, w);
        this.tqR.slerp(_q, w);
      } else {
        this.tL.lerp(_p, w);
        this.tqL.slerp(_q, w);
      }
    };
    const fwd = this.o.standBack;
    reach(wOffer, -0.07, C + 0.19, fwd - 0.16, _f.set(0.05, 0.1, 1), _u.set(0.0, 1, 0.15), -1);
    reach(wReceive, -0.03, C + 0.17, fwd - 0.22, _f.set(0.1, 0.25, 1), _u.set(0.1, 1, -0.1), -1);
    if (wWave > 0) {
      const sw = Math.sin(gt * 13) * 0.055;
      reach(wWave, -0.3 + sw, shoulderH + 0.14, 0.2, _f.set(sw * 3, 1, 0.1), _u.set(0, 0.1, 1), -1);
    }
    reach(wNam, 0.024, shoulderH - 0.26, 0.2, _f.set(0, 1, 0.35), _u.set(-1, 0, 0), 1);
    reach(wNam, -0.024, shoulderH - 0.26, 0.2, _f.set(0, 1, 0.35), _u.set(1, 0, 0), -1);

    // Smooth toward the targets (snap on the first frame).
    const k = this.started ? 1 - Math.exp(-dt * 9) : 1;
    this.handL.lerp(this.tL, k);
    this.handR.lerp(this.tR, k);
    this.qL.slerp(this.tqL, k);
    this.qR.slerp(this.tqR, k);

    // ---- gaze ----
    this.root.updateWorldMatrix(true, true);
    const look = _e;
    if (this.lookAnchor) {
      look.copy(this.lookAnchor).applyMatrix4(this.o.anchorMatrix());
    } else {
      this.idleTimer -= dt;
      if (this.idleTimer <= 0) {
        // Mostly the customer; now and then a glance down the street or at the goods.
        this.lookingAway = !this.lookingAway && rand() < 0.35;
        this.idleTimer = this.lookingAway ? 0.8 + rand() * 1.4 : 2 + rand() * 4;
        this.idleLook.set((rand() - 0.5) * 3, 0.3 + rand() * 1.2, 0.8 + rand() * 2);
        if (rand() < 0.4) this.idleLook.set((rand() - 0.5) * 0.4, 0.02, -0.15);
      }
      if (this.choreT >= 0) {
        look.set(this.o.chore.x, C + this.o.chore.y, this.o.chore.z);
        this.root.localToWorld(look);
      } else if (this.lookingAway) {
        look.copy(this.idleLook);
        this.o.counter.localToWorld(look);
      } else {
        look.copy(USER_EYE);
        this.o.counter.localToWorld(look);
      }
    }
    b.spine.worldToLocal(look);
    look.sub(_v.copy(b.neck.position).add(b.head.position));
    let yaw = Math.atan2(look.x, look.z);
    let pitch = Math.atan2(-look.y, Math.hypot(look.x, look.z));
    yaw = MathUtils.clamp(yaw, -1.15, 1.15);
    pitch = MathUtils.clamp(pitch, -0.45, 0.6);
    const kl = this.started ? 1 - Math.exp(-dt * 7) : 1;
    this.yaw += (yaw - this.yaw) * kl;
    this.pitch += (pitch - this.pitch) * kl;
    const nod = wNod * Math.sin(gt * Math.PI * 2 * 2.1) * 0.2 + wNam * 0.28;
    const shake = wShake * Math.sin(gt * Math.PI * 2 * 2.3) * 0.32;
    const tw = this.talkW;
    const bob = tw * (Math.sin(time * 6.1) * 0.03 + Math.sin(time * 9.7 + 1) * 0.018);
    const tilt = tw * Math.sin(time * 1.9) * 0.05 + wWave * 0.08 + Math.sin(time * 0.37 + this.o.seed) * 0.025;
    b.neck.rotation.set(this.pitch * 0.35, this.yaw * 0.35, 0);
    b.head.rotation.set(this.pitch * 0.65 + nod + bob, this.yaw * 0.65 + shake, tilt);
    // Eyes lead the head a little.
    const ex = MathUtils.clamp((yaw - this.yaw) * 0.02, -0.004, 0.004);
    b.eyeL.position.x = b.eyeL.userData.x ??= b.eyeL.position.x;
    b.eyeR.position.x = b.eyeR.userData.x ??= b.eyeR.position.x;
    b.eyeL.position.x += ex;
    b.eyeR.position.x += ex;

    // ---- face: blinks, mouth, brows ----
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.blinkT = 0;
      this.blinkTimer = rand() < 0.2 ? 0.25 : 2 + rand() * 3.5;
    }
    let lid = 1;
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      const p = this.blinkT / 0.15;
      lid = p >= 1 ? 1 : 0.08 + 0.92 * Math.abs(1 - 2 * p);
      if (p >= 1) this.blinkT = -1;
    }
    b.eyeL.scale.y = lid;
    b.eyeR.scale.y = lid;
    const syl = Math.max(0, Math.sin(time * 13.0) * 0.6 + Math.sin(time * 7.3 + 0.5) * 0.5 + 0.15);
    const open = tw * Math.min(1, syl);
    b.jaw.scale.set(1 - open * 0.15, 1 + open * 2.6, 1);
    const brow = tw * Math.max(0, Math.sin(time * 2.7)) * 0.006 + wWave * 0.005 + wReceive * 0.004;
    b.browL.position.y = (b.browL.userData.y ??= b.browL.position.y) + brow;
    b.browR.position.y = (b.browR.userData.y ??= b.browR.position.y) + brow;

    // ---- arms ----
    b.spine.updateMatrixWorld(true);
    this.solveArm(1, this.handL, this.qL);
    this.solveArm(-1, this.handR, this.qR);
    this.started = true;
  }

  /** Two-bone IK in the spine's frame, then the wrist from a holder-space orientation. */
  private solveArm(side: 1 | -1, targetHolder: Vector3, qHolder: Quaternion): void {
    const b = this.b;
    const dims = this.o.rig.dims;
    const sh = side === 1 ? b.shoulderL : b.shoulderR;
    const el = side === 1 ? b.elbowL : b.elbowR;
    const wr = side === 1 ? b.wristL : b.wristR;
    const a = dims.upperArm;
    const c = dims.forearm;

    const T = _v.copy(targetHolder);
    this.root.localToWorld(T);
    b.spine.worldToLocal(T);
    _d.subVectors(T, sh.position);
    let L = _d.length();
    L = MathUtils.clamp(L, Math.abs(a - c) + 1e-3, a + c - 1e-3);
    _d.normalize();
    const cosA = MathUtils.clamp((a * a + L * L - c * c) / (2 * a * L), -1, 1);
    const sinA = Math.sqrt(1 - cosA * cosA);
    // Elbow pole: out, down and back.
    _p.set(side * 0.55, -0.45, -0.7);
    _p.addScaledVector(_d, -_p.dot(_d)).normalize();
    _e.copy(sh.position).addScaledVector(_d, a * cosA).addScaledVector(_p, a * sinA);
    _u.subVectors(_e, sh.position).normalize();
    _f.copy(sh.position).addScaledVector(_d, L).sub(_e).normalize();
    _y.copy(_u).negate();
    _z.copy(_f).addScaledVector(_u, -_f.dot(_u));
    if (_z.lengthSq() < 1e-6) _z.copy(_p).negate().addScaledVector(_u, _p.dot(_u));
    _z.normalize();
    _x.crossVectors(_y, _z);
    _m.makeBasis(_x, _y, _z);
    sh.quaternion.setFromRotationMatrix(_m);
    const cosC = MathUtils.clamp((a * a + c * c - L * L) / (2 * a * c), -1, 1);
    el.rotation.set(-(Math.PI - Math.acos(cosC)), 0, 0);
    sh.updateMatrixWorld(true);

    // Wrist: desired world orientation = holder * hand; local = elbow^-1 * world.
    this.root.getWorldQuaternion(_q2);
    _q2.multiply(qHolder);
    el.getWorldQuaternion(_q).invert();
    wr.quaternion.copy(_q.multiply(_q2));
  }
}
