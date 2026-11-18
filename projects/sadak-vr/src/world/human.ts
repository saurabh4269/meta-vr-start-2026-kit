import {
  AnimationMixer,
  AssetManager,
  Group,
  LoopOnce,
  LoopRepeat,
  MathUtils,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
  type AnimationAction,
  type AnimationClip,
  type Bone,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  type SkinnedMesh,
} from '@iwsdk/core';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { revealPatch } from './sadak-city.js';
import type { Gesture, VendorRig } from './types.js';

/**
 * A VR character the way VR characters are usually built:
 * - a real body (MakeHuman, CC0) with textured skin, fitted clothes and hair
 *   meshes, on a game skeleton (UE-mannequin names, full fingers, eye bones):
 *   tools/humans/build_character.py -> public/humans/char-<id>.glb;
 * - motion-captured clips (idle, talking, gestures) through an AnimationMixer
 *   with crossfades, when the clip library is loaded (tools/humans/retarget.py
 *   -> public/humans/anims.glb); a procedural idle stands in until then;
 * - procedural layers on top of the clips, every frame: gaze (head, neck and
 *   eyes toward the user, clamped and smoothed), two-bone arm IK so a hand
 *   lands exactly where the table is, blinks, and lip sync (Meta/Oculus
 *   visemes from the voice's loudness and brightness, or a syllable rhythm
 *   when there is no audio).
 *
 * Frames: `root` is the holder (feet on the street, +Z toward the user and
 * the counter); counterY is the counter top in holder space.
 */

export const charKey = (id: string) => `char-${id}`;
export const ANIM_KEY = 'human-anims';

/** Loudness (0..1) and brightness (0..1) of the voice now playing; set by the director. */
export const voiceMeter = { level: 0, bright: 0 };

const DUR: Record<Gesture, [number, number, number]> = {
  offer: [4.2, 0.7, 0.7],
  receive: [3.6, 0.6, 0.6],
  wave: [2.4, 0.4, 0.5],
  nod: [1.5, 0.15, 0.25],
  shake: [1.5, 0.15, 0.25],
  namaste: [2.8, 0.6, 0.7],
};

const VISEMES = ['viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk', 'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR', 'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U'] as const;
/** Clip names (in anims.glb) per state, first match wins; see retarget.py. */
const CLIP_SETS = {
  idle: ['Idle'],
  talk: ['Talking'],
  fold: ['FoldArms'],
  drive: ['Driving'],
  rail: ['Rail'],
  wave: ['Wave'],
} as const;
type ClipState = keyof typeof CLIP_SETS;

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const _v = new Vector3();
const _w = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _c = new Vector3();
const _q = new Quaternion();
const _q2 = new Quaternion();
const _q3 = new Quaternion();
const _m = new Matrix4();
const USER_EYE = new Vector3(0, 0.45, 0.45);
const _look = new Vector3();
const _tL = new Vector3();
const _tR = new Vector3();
const _pn = new Vector3();
const _hp = new Vector3();
const _tp = new Vector3();
const _ax = new Vector3();
const _ay = new Vector3();

export type HumanOptions = {
  id: string;
  counter: Object3D;
  anchorMatrix: () => Matrix4;
  seed: number;
  standBack: number;
  /** Seated (driving): hands go to these holder-space points, legs bend. */
  seated?: { hands: [Vector3, Vector3]; hipY: number };
  /** Base clip instead of the standing idle (Raju driving, Suresh at the rail). */
  baseClip?: 'drive' | 'rail';
};

type Limb = { upper: Bone; lower: Bone; end: Bone; side: 1 | -1 };

export class HumanVendor implements VendorRig {
  readonly root = new Group();
  readonly hand = new Object3D();
  counterY = 0.74;
  ready = false;

  private body: Object3D | null = null;
  private bones: Record<string, Bone> = {};
  private faces: { mesh: Mesh; dict: Record<string, number> }[] = [];
  private mixer: AnimationMixer | null = null;
  private actions: Partial<Record<ClipState, AnimationAction>> = {};
  private restW = 1;
  private foldTimer = 12;
  private folding = 0;
  private current: AnimationAction | null = null;
  private limbs: { L: Limb; R: Limb } | null = null;
  private fwdLocal = { head: new Vector3(), neck: new Vector3(), eyeL: new Vector3(), eyeR: new Vector3() };
  private restQ = new Map<Bone, Quaternion>();

  private talkLeft = 0;
  private talkW = 0;
  private gestureState: { kind: Gesture; t: number; dur: number; tin: number; tout: number } | null = null;
  private lookAnchor: Vector3 | null = null;
  private idleLook = new Vector3();
  private idleTimer = 1;
  private lookingAway = false;
  private blinkTimer = 2;
  private blinkT = -1;
  private yaw = 0;
  private pitch = 0;
  private visemeW = new Float32Array(VISEMES.length);
  private syl = 0;
  private sylTimer = 0;
  private time = 0;
  private readonly rnd: () => number;

  constructor(private readonly o: HumanOptions) {
    this.root.name = `human-${o.id}`;
    this.hand.name = 'vendor-hand';
    let s = o.seed >>> 0 || 1;
    this.rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    this.tryBuild();
  }

  /** Build once the character's GLB is in the cache (assets can load after the street is built). */
  private tryBuild(): void {
    if (this.ready) return;
    const gltf = AssetManager.getGLTF(charKey(this.o.id), { shared: true });
    if (!gltf) return;
    const body = cloneSkinned(gltf.scene);
    body.name = `char-${this.o.id}`;
    const bones: Record<string, Bone> = {};
    body.traverse((x) => {
      if ((x as Bone).isBone) bones[x.name] = x as Bone;
      const m = x as SkinnedMesh;
      if (!m.isMesh) return;
      m.frustumCulled = false;
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as MeshStandardMaterial[];
      const fixed = mats.map((mat) => {
        const c = mat.clone();
        const cut = /hair|eyebrow|eyelash|high-poly/i.test(m.name + mat.name);
        c.transparent = /high-poly/i.test(m.name + mat.name);
        c.alphaTest = cut && !c.transparent ? 0.5 : 0;
        c.depthWrite = !c.transparent;
        c.side = cut ? 2 : 0;
        if (c.roughness !== undefined && !c.roughnessMap) c.roughness = Math.max(c.roughness, 0.6);
        c.metalness = 0;
        // SADAK's key light is set for cel bands; soft-lit cloth and skin need less of it.
        if (c.color) c.color.multiplyScalar(c.map ? 0.74 : 0.5);
        return revealPatch(c as Material);
      });
      m.material = Array.isArray(m.material) ? fixed : fixed[0];
      if (m.morphTargetDictionary && Object.keys(m.morphTargetDictionary).length) this.faces.push({ mesh: m, dict: m.morphTargetDictionary });
    });
    this.bones = bones;
    this.body = body;
    this.root.add(body);
    body.updateMatrixWorld(true);
    for (const b of Object.values(bones)) this.restQ.set(b, b.quaternion.clone());

    // Facing: the character looks along +Z (glTF from Blender's -Y). Record each look bone's forward in its own frame.
    // Measured in the holder's frame (the character may load after the holder is placed in the street).
    this.root.updateMatrixWorld(true);
    const fwdWorld = _v.set(0, 0, 1).applyQuaternion(this.root.getWorldQuaternion(_q3));
    for (const [k, n] of [['head', 'head'], ['neck', 'neck_01'], ['eyeL', 'eye_l'], ['eyeR', 'eye_r']] as const) {
      const b = bones[n];
      if (b) this.fwdLocal[k].copy(fwdWorld).applyQuaternion(b.getWorldQuaternion(_q).invert());
    }
    const limb = (side: 'l' | 'r', sg: 1 | -1): Limb => ({ upper: bones[`upperarm_${side}`], lower: bones[`lowerarm_${side}`], end: bones[`hand_${side}`], side: sg });
    if (bones.upperarm_l && bones.hand_r) this.limbs = { L: limb('l', 1), R: limb('r', -1) };

    // The director's hold point: the right palm, +Y out of the palm.
    const hr = bones.hand_r;
    if (hr) {
      const fing = bones.middle_01_r ?? bones.index_01_r;
      const thumb = bones.thumb_01_r;
      const hp = hr.getWorldPosition(new Vector3());
      const fd = fing ? fing.getWorldPosition(new Vector3()).sub(hp).normalize() : new Vector3(0, -1, 0);
      const td = thumb ? thumb.getWorldPosition(new Vector3()).sub(hp).normalize() : new Vector3(0, 0, 1);
      const palm = new Vector3().crossVectors(td, fd).normalize();
      const upH = new Vector3(0, 1, 0).applyQuaternion(this.root.getWorldQuaternion(new Quaternion()));
      if (palm.dot(upH) > 0) palm.negate(); // A-pose palms face down
      const at = hp.clone().addScaledVector(fd, 0.075).addScaledVector(palm, 0.025);
      hr.add(this.hand);
      this.hand.position.copy(hr.worldToLocal(at));
      _q.setFromUnitVectors(new Vector3(0, 1, 0), palm);
      this.hand.quaternion.copy(hr.getWorldQuaternion(_q2).invert().multiply(_q));
    }

    // Mocap clips ship inside each character's GLB (retargeted onto its own skeleton).
    const lib = gltf.animations?.length ? gltf : AssetManager.getGLTF(ANIM_KEY, { shared: true });
    if (lib?.animations?.length) {
      this.mixer = new AnimationMixer(body);
      const byName = new Map(lib.animations.map((c: AnimationClip) => [c.name, c] as const));
      for (const [state, names] of Object.entries(CLIP_SETS) as [ClipState, readonly string[]][]) {
        const clip = names.map((n) => byName.get(n)).find(Boolean);
        if (!clip) continue;
        const a = this.mixer.clipAction(clip);
        a.setLoop(state === 'wave' ? LoopOnce : LoopRepeat, Infinity);
        a.clampWhenFinished = state === 'wave';
        this.actions[state] = a;
      }
      this.play(this.o.baseClip ?? 'idle', 0);
      this.mixer.setTime(this.rnd() * 10);
    }
    this.ready = true;
  }

  private play(state: ClipState, fade = 0.45): void {
    const a = this.actions[state] ?? this.actions.idle;
    if (!a || a === this.current) return;
    a.reset().play();
    if (this.current) a.crossFadeFrom(this.current, fade, true);
    this.current = a;
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
    if (kind === 'wave' && this.actions.wave) this.play('wave', 0.25);
  }

  private gw(kind: Gesture): number {
    const g = this.gestureState;
    if (!g || g.kind !== kind) return 0;
    return ease(g.t / g.tin) * (1 - ease((g.t - (g.dur - g.tout)) / g.tout));
  }

  update(dt: number, time: number): void {
    if (!this.ready) this.tryBuild();
    if (!this.ready || !this.body) return;
    this.time = time;
    const b = this.bones;

    // ---- timers and the base layer (mocap or procedural idle) ----
    this.talkLeft = Math.max(0, this.talkLeft - dt);
    this.talkW += ((this.talkLeft > 0 ? 1 : 0) - this.talkW) * (1 - Math.exp(-dt * 6));
    if (this.gestureState) {
      this.gestureState.t += dt;
      if (this.gestureState.t >= this.gestureState.dur) this.gestureState = null;
    }
    if (this.mixer) {
      // Base clip: talking while speaking, else the idle, with the odd folded-arms rest.
      this.foldTimer -= dt;
      if (this.foldTimer <= 0 && this.talkLeft <= 0) {
        this.folding = this.folding > 0 ? 0 : 6 + this.rnd() * 4;
        this.foldTimer = this.folding > 0 ? this.folding : 14 + this.rnd() * 10;
      }
      const base: ClipState = this.o.baseClip ?? (this.talkLeft > 0 ? 'talk' : this.folding > 0 && this.foldTimer > 0 ? 'fold' : 'idle');
      if (this.talkLeft > 0) this.folding = 0;
      this.play(base, 0.5);
      this.mixer.update(dt);
    } else {
      this.proceduralIdle(time);
    }
    if (this.o.seated) {
      if (this.mixer && this.actions.drive) {
        // The driving clip sits; put its pelvis on this seat.
        const pel = b.pelvis;
        if (pel) {
          this.body.position.y = 0;
          this.body.updateMatrixWorld(true);
          const py = this.root.worldToLocal(pel.getWorldPosition(_w)).y;
          this.body.position.y = this.o.seated.hipY - py;
        }
      } else this.seat();
    }
    this.body.updateMatrixWorld(true);

    // ---- hands: rest on the counter, offer, receive, namaste, wave (no clip) ----
    const C = this.counterY;
    const back = this.o.standBack;
    const breath = Math.sin(time * 1.6 + this.o.seed);
    if (this.limbs) {
      const restY = Math.max(C + 0.08, 0.78);
      // Mocap moves the arms; when not talking the hands drift to rest on the counter.
      const restT = this.mixer ? (this.talkLeft > 0 || this.folding > 0 || this.o.baseClip === 'rail' ? 0 : 0.85) : 1;
      this.restW += (restT - this.restW) * (1 - Math.exp(-dt * 2.5));
      let wL = this.restW;
      let wR = wL;
      const tL = _tL.set(0.18, restY + breath * 0.004, back - 0.42);
      const tR = _tR.set(-0.18, restY + breath * 0.004, back - 0.42);
      if (this.o.seated) {
        tL.copy(this.o.seated.hands[0]);
        tR.copy(this.o.seated.hands[1]);
        wL = wR = 1;
      }
      const wo = this.gw('offer');
      const wr = this.gw('receive');
      const wn = this.gw('namaste');
      const ww = this.actions.wave ? 0 : this.gw('wave');
      if (wo > 0) { tR.lerp(_v.set(-0.06, C + 0.17, back - 0.16), wo); wR = Math.max(wR, wo); }
      if (wr > 0) { tR.lerp(_v.set(-0.03, C + 0.15, back - 0.22), wr); wR = Math.max(wR, wr); }
      if (wn > 0) {
        const sh = (b.upperarm_l?.getWorldPosition(_w).y ?? 1.4) - this.root.getWorldPosition(_c).y;
        tL.lerp(_v.set(0.02, sh - 0.25, 0.22), wn); tR.lerp(_v.set(-0.02, sh - 0.25, 0.22), wn);
        wL = Math.max(wL, wn); wR = Math.max(wR, wn);
      }
      if (ww > 0) {
        const sh = (b.upperarm_r?.getWorldPosition(_w).y ?? 1.4) - this.root.getWorldPosition(_c).y;
        tR.lerp(_v.set(-0.32 + Math.sin(this.gestureState!.t * 13) * 0.05, sh + 0.16, 0.18), ww);
        wR = Math.max(wR, ww);
      }
      if (wL > 0.001) this.reach(this.limbs.L, tL, wL);
      if (wR > 0.001) this.reach(this.limbs.R, tR, wR);
      // Palms: up to offer or receive, down to rest on the counter.
      if (wo + wr > 0.01) this.palm(this.limbs.R, _pn.set(0, 1, 0.2), Math.max(wo, wr));
      else if (wR > 0.01 && !this.o.seated) this.palm(this.limbs.R, _pn.set(0, -1, 0), wR * 0.8);
      if (wL > 0.01 && !this.o.seated && wn < 0.01) this.palm(this.limbs.L, _pn.set(0, -1, 0), wL * 0.8);
    }

    // ---- the counter is solid: lift any hand that dips into it (mocap doesn't know it's there) ----
    if (this.limbs && !this.o.seated) {
      for (const limb of [this.limbs.L, this.limbs.R]) this.keepAboveCounter(limb, C, back);
    }

    // ---- gaze: neck, head and eyes toward the user (or a glance away) ----
    const look = _look;
    if (this.lookAnchor) look.copy(this.lookAnchor).applyMatrix4(this.o.anchorMatrix());
    else {
      this.idleTimer -= dt;
      if (this.idleTimer <= 0) {
        this.lookingAway = !this.lookingAway && this.rnd() < 0.35;
        this.idleTimer = this.lookingAway ? 0.8 + this.rnd() * 1.4 : 2 + this.rnd() * 4;
        this.idleLook.set((this.rnd() - 0.5) * 3, 0.3 + this.rnd() * 1.2, 0.8 + this.rnd() * 2);
      }
      look.copy(this.lookingAway ? this.idleLook : USER_EYE);
      this.o.counter.localToWorld(look);
    }
    const nod = this.gw('nod') * Math.sin((this.gestureState?.t ?? 0) * Math.PI * 4.2) * 0.18 + this.gw('namaste') * 0.25;
    const shake = this.gw('shake') * Math.sin((this.gestureState?.t ?? 0) * Math.PI * 4.6) * 0.3;
    if (b.neck_01) this.aimLook(b.neck_01, this.fwdLocal.neck, look, 0.35, 0, 0, dt);
    if (b.head) this.aimLook(b.head, this.fwdLocal.head, look, 0.75, nod + this.talkW * Math.sin(time * 6.1) * 0.025, shake, dt);
    for (const [k, n] of [['eyeL', 'eye_l'], ['eyeR', 'eye_r']] as const) if (b[n]) this.aimLook(b[n], this.fwdLocal[k], look, 1, 0, 0, dt, 0.35);

    // ---- face: blinks and lip sync ----
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.blinkT = 0;
      this.blinkTimer = this.rnd() < 0.2 ? 0.3 : 2 + this.rnd() * 3.5;
    }
    let blink = 0;
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      const p = this.blinkT / 0.16;
      blink = p >= 1 ? 0 : 1 - Math.abs(1 - 2 * p);
      if (p >= 1) this.blinkT = -1;
    }
    this.lipSync(dt);
    for (const f of this.faces) {
      const inf = f.mesh.morphTargetInfluences!;
      const set = (n: string, v: number) => {
        const i = f.dict[n];
        if (i !== undefined) inf[i] = v;
      };
      set('eyeBlinkLeft', blink);
      set('eyeBlinkRight', blink);
      VISEMES.forEach((n, i) => set(n, this.visemeW[i]));
      set('mouthSmileLeft', 0.12 + this.gw('namaste') * 0.3 + this.gw('wave') * 0.3);
      set('mouthSmileRight', 0.12 + this.gw('namaste') * 0.3 + this.gw('wave') * 0.3);
      set('browInnerUp', this.talkW * Math.max(0, Math.sin(time * 2.7)) * 0.35);
    }
  }

  /** Visemes from the voice meter, or a syllable rhythm while talking with no audio. */
  private lipSync(dt: number): void {
    const target = new Float32Array(VISEMES.length);
    const lvl = voiceMeter.level;
    if (this.talkW > 0.05) {
      let open = 0;
      let shape = 0;
      if (lvl > 0.02) {
        open = Math.min(1, lvl * 3);
        shape = voiceMeter.bright;
      } else {
        this.sylTimer -= dt;
        if (this.sylTimer <= 0) {
          this.syl = Math.floor(this.rnd() * 6);
          this.sylTimer = 0.09 + this.rnd() * 0.12;
        }
        open = this.syl === 0 ? 0.05 : 0.45 + this.rnd() * 0.05;
        shape = this.syl / 5;
      }
      open *= this.talkW;
      // Bright sounds -> E/I, dark -> O/U, middle -> aa; closures -> PP/MM.
      const pick = shape > 0.75 ? 12 : shape > 0.55 ? 11 : shape > 0.35 ? 10 : shape > 0.2 ? 13 : 14;
      target[pick] = open;
      if (open < 0.08) target[1] = 0.6 * this.talkW;
    } else target[0] = 1;
    const k = 1 - Math.exp(-dt * 18);
    for (let i = 0; i < target.length; i++) this.visemeW[i] += (target[i] - this.visemeW[i]) * k;
  }

  /** Rotate `bone` so its forward (fwdLocal) turns toward `target` (world) by `weight`, plus nod/shake, clamped. */
  private aimLook(bone: Bone, fwdLocal: Vector3, target: Vector3, weight: number, nod: number, shake: number, dt: number, limit = 1.0): void {
    if (!fwdLocal.lengthSq()) return;
    const bw = bone.getWorldQuaternion(_q);
    const fwd = _v.copy(fwdLocal).applyQuaternion(bw);
    const pos = bone.getWorldPosition(_w);
    const dir = _a.subVectors(target, pos).normalize();
    // Clamp the turn.
    const ang = Math.acos(MathUtils.clamp(fwd.dot(dir), -1, 1));
    const t = ang > 1e-4 ? Math.min(1, limit / ang) * weight : 0;
    _q2.setFromUnitVectors(fwd, dir);
    _q3.identity().slerp(_q2, t);
    if (nod || shake) {
      const up = _ay.set(0, 1, 0);
      const right = _ax.crossVectors(up, fwd).normalize();
      _q2.setFromAxisAngle(right, nod);
      _q3.premultiply(_q2);
      _q2.setFromAxisAngle(up, shake);
      _q3.premultiply(_q2);
    }
    // World target = turn * current; local = parent^-1 * world.
    const want = _q2.copy(_q3).multiply(bw);
    const parentW = bone.parent!.getWorldQuaternion(_q3);
    bone.quaternion.copy(parentW.invert().multiply(want));
    bone.updateMatrixWorld(true);
    void dt;
  }

  /** Two-bone IK: put the end of `limb` at holder-space `target`, blended by `w`. Elbow bends out and down. */
  private reach(limb: Limb, targetHolder: Vector3, w: number): void {
    const T = _v.copy(targetHolder);
    this.root.localToWorld(T);
    const S = limb.upper.getWorldPosition(_w);
    const E = limb.lower.getWorldPosition(_a);
    const H = limb.end.getWorldPosition(_b);
    const a = S.distanceTo(E);
    const c = E.distanceTo(H);
    const d = _c.subVectors(T, S);
    let L = d.length();
    L = MathUtils.clamp(L, Math.abs(a - c) + 1e-3, a + c - 1e-3);
    d.normalize();
    // Pole: out to the side, down and back, in the holder's frame.
    const pole = new Vector3(limb.side * 0.6, -0.5, -0.6).transformDirection(this.root.matrixWorld);
    pole.addScaledVector(d, -pole.dot(d)).normalize();
    const cosA = MathUtils.clamp((a * a + L * L - c * c) / (2 * a * L), -1, 1);
    const elbow = S.clone().addScaledVector(d, a * cosA).addScaledVector(pole, a * Math.sqrt(1 - cosA * cosA));
    const endPos = S.clone().addScaledVector(d, L);
    // Upper arm: rotate so its child (elbow) goes to the new elbow.
    this.rotateTo(limb.upper, E, elbow, w);
    // Forearm: rotate so the hand goes to the target.
    const E2 = limb.lower.getWorldPosition(new Vector3());
    const H2 = limb.end.getWorldPosition(new Vector3());
    this.rotateTo(limb.lower, H2, endPos, w, E2);
  }

  /** Rotate `bone` (about its world position, or `pivot`) so world point `from` moves toward `to`, by weight w. */
  private rotateTo(bone: Bone, from: Vector3, to: Vector3, w: number, pivot?: Vector3): void {
    const P = pivot ?? bone.getWorldPosition(new Vector3());
    const u = from.clone().sub(P).normalize();
    const v = to.clone().sub(P).normalize();
    const turn = new Quaternion().setFromUnitVectors(u, v);
    const partial = new Quaternion().slerp(turn, w);
    const bw = bone.getWorldQuaternion(new Quaternion());
    const want = partial.multiply(bw);
    const parentW = bone.parent!.getWorldQuaternion(new Quaternion());
    bone.quaternion.copy(parentW.invert().multiply(want));
    bone.updateMatrixWorld(true);
  }

  /** If the hand or its fingertips are over the counter and below its top, raise the hand (IK) to sit on it. */
  private keepAboveCounter(limb: Limb, C: number, back: number): void {
    const side = limb.side === 1 ? 'l' : 'r';
    const tips = [limb.end, this.bones[`middle_03_${side}`], this.bones[`index_03_${side}`], this.bones[`thumb_03_${side}`]].filter(Boolean) as Bone[];
    let lowest = Infinity;
    const hand = this.root.worldToLocal(limb.end.getWorldPosition(_hp));
    for (const t of tips) {
      const p = this.root.worldToLocal(t.getWorldPosition(_tp));
      // Counter footprint in the holder frame: x within +-0.72, z from its back edge to the user's edge.
      if (Math.abs(p.x) < 0.72 && p.z > back - 0.5 && p.z < back + 0.22) lowest = Math.min(lowest, p.y);
    }
    const floor = C + 0.022;
    if (lowest >= floor) return;
    _tp.copy(hand);
    _tp.y += floor - lowest;
    this.reach(limb, _tp, 1);
  }

  /** Turn the hand so its palm faces `palmDir` (holder space), by w. */
  private palm(limb: Limb, palmDir: Vector3, w: number): void {
    const hand = limb.end;
    const fing = this.bones[limb.side === 1 ? 'middle_01_l' : 'middle_01_r'];
    const thumb = this.bones[limb.side === 1 ? 'thumb_01_l' : 'thumb_01_r'];
    if (!fing || !thumb) return;
    const hp = hand.getWorldPosition(new Vector3());
    const fd = fing.getWorldPosition(new Vector3()).sub(hp).normalize();
    const td = thumb.getWorldPosition(new Vector3()).sub(hp).normalize();
    const cur = new Vector3().crossVectors(td, fd).multiplyScalar(limb.side === 1 ? -1 : 1).normalize();
    const want = palmDir.clone().transformDirection(this.root.matrixWorld);
    want.addScaledVector(fd, -want.dot(fd)).normalize();
    if (!want.lengthSq()) return;
    const turn = new Quaternion().setFromUnitVectors(cur, want);
    const partial = new Quaternion().slerp(turn, w);
    const bw = hand.getWorldQuaternion(new Quaternion());
    const parentW = hand.parent!.getWorldQuaternion(new Quaternion());
    hand.quaternion.copy(parentW.invert().multiply(partial.multiply(bw)));
    hand.updateMatrixWorld(true);
  }

  /** No clip library: a natural idle from the rest pose (arms down, breathing, weight shift). */
  private proceduralIdle(time: number): void {
    const b = this.bones;
    for (const [bone, q] of this.restQ) bone.quaternion.copy(q);
    const breath = Math.sin(time * 1.6 + this.o.seed);
    const shift = Math.sin(time * 0.5 + this.o.seed * 0.7);
    this.body!.updateMatrixWorld(true);
    const fwd = new Vector3(0, 0, 1);
    if (b.pelvis) this.addWorldRot(b.pelvis, new Vector3(0, 0, 1), shift * 0.025);
    if (b.spine_02) this.addWorldRot(b.spine_02, new Vector3(1, 0, 0), 0.04 + breath * 0.012);
    if (b.spine_03) this.addWorldRot(b.spine_03, new Vector3(1, 0, 0), breath * 0.01);
    // Arms hang: from the A-pose, swing the upper arms down to the sides.
    for (const [up, lo, sg] of [['upperarm_l', 'lowerarm_l', 1], ['upperarm_r', 'lowerarm_r', -1]] as const) {
      const ub = b[up];
      const lb = b[lo];
      if (!ub || !lb) continue;
      this.body!.updateMatrixWorld(true);
      const S = ub.getWorldPosition(new Vector3());
      const E = lb.getWorldPosition(new Vector3());
      const down = new Vector3(sg * 0.12, -1, 0.05).transformDirection(this.root.matrixWorld);
      this.rotateTo(ub, E, S.clone().addScaledVector(down, S.distanceTo(E)), 1);
    }
    void fwd;
  }

  private addWorldRot(bone: Bone, axisHolder: Vector3, angle: number): void {
    const axis = axisHolder.clone().transformDirection(this.root.matrixWorld);
    const r = new Quaternion().setFromAxisAngle(axis, angle);
    const bw = bone.getWorldQuaternion(new Quaternion());
    const parentW = bone.parent!.getWorldQuaternion(new Quaternion());
    bone.quaternion.copy(parentW.invert().multiply(r.multiply(bw)));
    bone.updateMatrixWorld(true);
  }

  /** Seated: thighs forward, shins down. */
  private seat(): void {
    const b = this.bones;
    for (const [th, ca] of [['thigh_l', 'calf_l'], ['thigh_r', 'calf_r']] as const) {
      const t = b[th];
      const c = b[ca];
      if (!t || !c) continue;
      this.body!.updateMatrixWorld(true);
      const H = t.getWorldPosition(new Vector3());
      const K = c.getWorldPosition(new Vector3());
      const len = H.distanceTo(K);
      const fwd = new Vector3(0, -0.05, 1).transformDirection(this.root.matrixWorld);
      this.rotateTo(t, K, H.clone().addScaledVector(fwd, len), 1);
      const K2 = c.getWorldPosition(new Vector3());
      const foot = b[ca === 'calf_l' ? 'foot_l' : 'foot_r'];
      if (foot) {
        const F = foot.getWorldPosition(new Vector3());
        const down = new Vector3(0, -1, 0.1).transformDirection(this.root.matrixWorld);
        this.rotateTo(c, F, K2.clone().addScaledVector(down, K2.distanceTo(F)), 1);
      }
    }
  }
}

/** True once the character GLB for `id` is cached. */
export function humanLoaded(id: string): boolean {
  return !!AssetManager.getGLTF(charKey(id), { shared: true });
}

void _m;
