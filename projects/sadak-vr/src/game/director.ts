import {
  BufferGeometry,
  createSystem,
  Group,
  LineBasicMaterial,
  LineLoop,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  NoBlending,
  Object3D,
  Quaternion,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  VisibilityState,
  XRPlane,
  Grabbed,
  Hovered,
  OneHandGrabbable,
  PokeInteractable,
  Pressed,
  RayInteractable,
  type Entity,
  type SkinnedMesh,
  type UIKitMLAsset,
} from '@iwsdk/core';
import { Coin, MicButton, ReplyChoice } from '../sadak-components.js';
import { sfx } from './audio.js';
import { sadakAudio } from '../sadak-audio/index.js';
import { Chip, DialogueCard, YouCard } from './cards.js';
import { Coins, type HandIn } from './coins.js';
import {
  DISTRICT_REWARD,
  errandAt,
  FINALE,
  META,
  ORDER,
  PLAYER_SPEAKER,
  REACT_TOO_MUCH,
  RIDE_AFTER,
  allUtterances,
  type Errand,
  type Line,
  type Step,
} from './content.js';
import { Hands, type HandState } from './hands.js';
import type { ComfortLevel } from './levels.js';
import { Panels } from './panels.js';
import { learn, loadSave, markDay, recordVisit, writeSave, type Save } from './save.js';
import { scoreAttempt } from './score.js';
import { Mic, Speech } from './speech.js';
import { loadFonts } from './text.js';
import { buildStreet } from '../world/street.js';
import type { AutoRig, Spot, SpotId, StreetWorld, VendorRig } from '../world/types.js';

/**
 * The Sadak VR director: one IWSDK system that runs SADAK's district loop.
 *
 *  placing → reveal → per errand (SADAK pack order: auto, kachori, flowers, bus, paranthe, minaret):
 *    arrive (hail the auto / the bus pulls in) → intro card (first meeting) → recall (return visit)
 *    → per lesson step: npc → (task: pay) → player → result → (after: serve/pick)
 *    → done (+₹, toast) → ride (auto / bus / rickshaw) → … → finale
 *
 * The dialogue is SADAK's (components/Dialogue.tsx): the vendor's line in script, romanisation
 * and meaning; your line as romanised words; hold the mic and speak it, scored word by word
 * (any score above 0 passes), "Continue", "Try again", "Hear correct pronunciation".
 * Hands-first: touching your line says it for you, so every step completes without a voice.
 *
 * Everything lives under one `anchor` group whose origin is the real table top (+Z toward the
 * seated user). The street world is a child of the anchor and aligns the active stall with it.
 * Input goes through IWSDK components: RayInteractable + PokeInteractable (Hovered / Pressed)
 * on your line, the mic and the UIKit panels; OneHandGrabbable (Grabbed) on the coins.
 */

type Phase =
  | 'boot'
  | 'placing'
  | 'reveal'
  | 'arrive'
  | 'intro'
  | 'recall'
  | 'npc'
  | 'task'
  | 'player'
  | 'result'
  | 'after'
  | 'done'
  | 'ride'
  | 'finale';

const EYE = new Vector3(0, 0.45, 0.45); // default seated eye in anchor space
/** The UI root sits at the seated user's position on the table plane and turns toward whoever you talk to. */
const UI_ORIGIN = new Vector3(0, 0, 0.45);
// below: positions inside the UI root (anchor-local minus UI_ORIGIN when the UI faces forward)
const DIALOGUE_POS = new Vector3(0, 0.5, -0.85);
const GOAL_POS = new Vector3(0, 0.37, -0.52);
/** Your line: ~19° below eye level, half a metre away (Meta: primary UI 10–20° below gaze). */
const YOU_POS = new Vector3(0, 0.28, -0.5);
const MIC_POS = new Vector3(0.235, 0.28, -0.49);
/** Where the brass plate goes (anchor-local): within a seated arm's reach, right of the goods. */
const PLATE_POS = new Vector3(0.38, 0, -0.14);
/** UI yaw per spot: Raju talks from his auto, which pulls up on your right. */
const UI_YAW: Record<string, number> = { kachori: 0, flowers: 0, auto: -0.7, paranthe: 0, bus: 0, minaret: 0 };
/** Left end of the coin row (anchor-local): along the counter's near edge, right of the served food. */
const POUCH_POS = new Vector3(0.08, 0, 0.13);
const SERVE_POS = new Vector3(-0.02, 0.012, 0.16);
const BAG_POS = new Vector3(-0.24, 0.02, 0.15);
const REVEAL_FULL = 60;
/** Points for a line said by touching it (no microphone): any score above 0 passes in SADAK. */
const TOUCH_POINTS = 50;
const INTRO_MS = 2200; // SADAK's first-meeting card
const TAG = '[sadak]';
const TIER_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const;

interface RideHandle {
  readonly progress: number;
  readonly done: boolean;
  skip(): void;
}

export class SadakSystem extends createSystem({
  planes: { required: [XRPlane] },
  // IWSDK interaction: the InputSystem tags poked / pointed-at entities, the GrabSystem tags held ones
  youPressed: { required: [ReplyChoice, Pressed] },
  youHovered: { required: [ReplyChoice, Hovered] },
  micPressed: { required: [MicButton, Pressed] },
  coinsHeld: { required: [Coin, Grabbed] },
}) {
  private anchor!: Group;
  private readonly ui = new Group();
  private anchorEntity!: Entity;
  private ready = false;
  private street!: StreetWorld;
  private hands = new Hands();
  private speech = new Speech(import.meta.env.BASE_URL);
  private mic = new Mic();
  private save: Save = loadSave();
  private panels!: Panels;

  private dialogue!: DialogueCard;
  private you!: YouCard;
  private goal!: Chip;
  private title!: Chip;
  private toast!: Chip;
  private totalChip!: Chip;
  private micOrb!: Mesh;
  private micRing!: Mesh;
  private coins!: Coins;
  private placeMarker!: LineLoop;
  private youEntity!: Entity;
  private micEntity!: Entity;
  private coinEntities: Entity[] = [];

  private phase: Phase = 'boot';
  private phaseT = 0;
  private readonly phaseOnce = new Set<string>();
  private immersive = false;
  private errandIdx = 0;
  private stepIdx = 0;
  private slips = 0;
  private waitUntil = 0;
  private reveal = 0;
  private revealTarget = 0;
  private revealSpeed = 0;
  private picked = 0;
  private hailT = 0;
  private placeT = 0;
  private bothPinchT = 0;
  private toastT = 0;
  private lastPoints = 0;
  private stepPoints: number[] = [];
  private readonly met = new Set<string>();
  private ride: RideHandle | null = null;
  private cur: Errand = errandAt(0, 'medium');
  private readonly served: { obj: Object3D; from: Vector3; to: Vector3; t: number; bites: number; held: number }[] = [];
  private readonly bagged: Object3D[] = [];

  // input
  private keys = new Set<string>();
  private readonly handIn: HandIn[] = [
    { tracked: false, pinching: false, started: false, ended: false, p: new Vector3() },
    { tracked: false, pinching: false, started: false, ended: false, p: new Vector3() },
  ];
  private readonly tipLocal = [new Vector3(), new Vector3()];
  private readonly palmLocal = [new Vector3(), new Vector3()];
  private readonly lastPress = new Map<string, number>();

  // temps (no allocation in update)
  private readonly tA = new Vector3();
  private readonly tB = new Vector3();
  private readonly tC = new Vector3();
  private readonly tQ = new Quaternion();
  private readonly invM = new Matrix4();
  private readonly headLocal = new Vector3().copy(EYE);
  private readonly headWorld = new Vector3();
  private statT = 0;
  private logSeq = 0;
  private readonly logId = Math.random().toString(36).slice(2, 6);
  private readonly tableHit = { pos: new Vector3(), ok: false, height: 0.74 };

  // ───────────────────────── setup ─────────────────────────

  init(): void {
    void loadFonts().then(() => this.redrawAll());
    this.anchor = new Group();
    this.anchor.name = 'sadak-anchor';
    this.street = buildStreet(this.world.renderer);
    this.anchor.add(this.street.group);

    this.dialogue = new DialogueCard(0.6);
    this.dialogue.mesh.position.copy(DIALOGUE_POS);
    this.dialogue.opacity = 0;
    this.you = new YouCard(0.34);
    this.you.group.position.copy(YOU_POS);
    this.you.group.visible = false;
    this.goal = new Chip(0.4, 7);
    this.goal.mesh.position.copy(GOAL_POS);
    this.goal.opacity = 0;
    this.title = new Chip(0.8, 5);
    this.title.mesh.position.set(0, 0.42, -0.3);
    this.title.opacity = 0;
    this.toast = new Chip(0.42, 6);
    this.toast.mesh.position.set(0, 0.36, -0.2);
    this.toast.opacity = 0;
    this.totalChip = new Chip(0.11, 3.2);
    this.totalChip.opacity = 0;
    this.micOrb = new Mesh(
      new SphereGeometry(0.03, 24, 16),
      new MeshBasicMaterial({ color: 0xf08a1c, transparent: true, opacity: 0.95, toneMapped: false }),
    );
    this.micOrb.name = 'mic-orb';
    this.micOrb.position.copy(MIC_POS);
    this.micOrb.visible = false;
    this.micRing = new Mesh(
      new RingGeometry(0.036, 0.043, 40),
      new MeshBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.8, toneMapped: false, depthWrite: false }),
    );
    this.micOrb.add(this.micRing);
    this.coins = new Coins();
    this.coins.onClink = (big) => sfx.clink(big);
    this.coins.onPlate = (t) => this.onPlateTotal(t);
    this.ui.position.copy(UI_ORIGIN);
    this.ui.add(this.dialogue.mesh, this.goal.mesh, this.you.group, this.micOrb);
    this.anchor.add(this.ui, this.title.mesh, this.toast.mesh, this.totalChip.mesh, this.coins.group);

    // placement preview: the counter footprint in marigold
    const w = 0.42, d = 0.3;
    this.placeMarker = new LineLoop(
      new BufferGeometry().setFromPoints([
        new Vector3(-w, 0.003, -d), new Vector3(w, 0.003, -d), new Vector3(w, 0.003, d), new Vector3(-w, 0.003, d),
      ]),
      new LineBasicMaterial({ color: '#ffb000', toneMapped: false }),
    );
    this.placeMarker.visible = false;

    this.anchorEntity = this.world.createTransformEntity(this.anchor, { persistent: true });
    // No DepthOccludable: with the street covering the room, real objects would punch holes in
    // the UI. Your hands still cover it: the hand window (punchHands) writes depth.
    const uiEntity = this.world.createTransformEntity(this.ui, { parent: this.anchorEntity, persistent: true });
    this.youEntity = this.world.createTransformEntity(this.you.group, { parent: uiEntity, persistent: true }).addComponent(ReplyChoice, { slot: 0 });
    this.micEntity = this.world.createTransformEntity(this.micOrb, { parent: uiEntity, persistent: true }).addComponent(MicButton);
    const coinsEntity = this.world.createTransformEntity(this.coins.group, { parent: this.anchorEntity, persistent: true });
    this.coinEntities = this.coins.coins.map((c, i) =>
      this.world.createTransformEntity(c.mesh, { parent: coinsEntity, persistent: true }).addComponent(Coin, { value: c.value, slot: i }),
    );
    this.world.createTransformEntity(this.placeMarker as unknown as Object3D, { persistent: true });

    this.queries.youPressed.subscribe('qualify', () => this.press('you', () => this.sayByTouch()));
    this.queries.youHovered.subscribe('qualify', () => this.setYouHover(true));
    this.queries.youHovered.subscribe('disqualify', () => this.setYouHover(false));
    // SADAK's mic is hold-to-speak: press starts recording, release stops and scores
    this.queries.micPressed.subscribe('qualify', () => this.micDown());
    this.queries.micPressed.subscribe('disqualify', () => this.micUp());
    this.queries.coinsHeld.subscribe('qualify', (e) => this.coins.grabStart(e.getValue(Coin, 'slot') as number));
    this.queries.coinsHeld.subscribe('disqualify', (e) => this.coins.grabEnd(e.getValue(Coin, 'slot') as number));

    this.panels = new Panels(this.world, this.anchorEntity, uiEntity);
    void this.panels.load().then(() => this.wirePanels());
    this.ready = true;

    this.placeDesktop();
    this.startJourney(true);

    const onKey = (e: KeyboardEvent) => {
      this.keys.add(e.key.toLowerCase());
      if (import.meta.env.DEV && e.key === 'R' && e.shiftKey) {
        try { localStorage.clear(); } catch { /* */ }
        location.reload();
      }
    };
    const unlock = () => {
      sfx.unlock();
      sadakAudio.unlock(sfx.context ?? undefined);
      this.speech.preload(allUtterances());
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    (window as unknown as { __sadakPrimeMic?: () => void }).__sadakPrimeMic = () => void this.mic.prime().then((ok) => this.log('mic', `ok=${ok}`));
    this.cleanupFuncs.push(
      () => window.removeEventListener('keydown', onKey),
      () => window.removeEventListener('pointerdown', unlock),
      () => window.removeEventListener('keydown', unlock),
      this.world.visibilityState.subscribe((v) => this.onVisibility(v)),
    );
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).sadak = this;
  }

  /** Buttons on the UIKit panels; every press goes through one debounced handler. */
  private wirePanels(): void {
    const p = this.panels;
    p.on(p.actions, 'btn-continue', () => this.press('continue', () => this.continueStep()));
    p.on(p.actions, 'btn-retry', () => this.press('retry', () => this.retryStep()));
    p.on(p.actions, 'btn-hear', () => this.press('hear', () => this.hearCorrect()));
    p.on(p.ride, 'btn-skip', () => this.press('skip', () => this.ride?.skip()));
    p.on(p.finale, 'btn-explore', () => this.press('explore', () => this.keepExploring()));
    p.on(p.finale, 'btn-district', () => this.press('district', () => this.world.exitXR()));
    const welcome = this.world.getSceneObject<UIKitMLAsset>('welcome-panel');
    for (const lv of ['easy', 'medium', 'hard'] as ComfortLevel[]) {
      p.on(welcome, `level-${lv}`, () => this.setComfort(lv));
    }
    this.setComfort(this.save.comfort, true);
    this.refreshHud();
    this.cleanupFuncs.push(() => p.dispose());
    this.log('panels', 'ready');
  }

  /** SADAK's "Set your starting level" (Title.tsx). It sets where the first errand's level starts. */
  private setComfort(lv: ComfortLevel, quiet = false): void {
    this.save.comfort = lv;
    writeSave(this.save);
    const welcome = this.world.getSceneObject<UIKitMLAsset>('welcome-panel');
    for (const other of ['easy', 'medium', 'hard'] as ComfortLevel[]) {
      const on = other === lv;
      welcome?.getElementById(`level-${other}`)?.setProperties({
        borderColor: on ? '#ff7a1a' : '#3a3b40',
        backgroundColor: on ? '#4a2f12' : 'rgba(0,0,0,0)',
      });
    }
    if (!quiet) {
      sfx.select();
      this.log('comfort', `level=${lv}`);
      if (!this.immersive) this.startJourney(true);
    }
  }

  private redrawAll(): void {
    this.you.redraw();
    if (this.phase === 'npc' || this.phase === 'player' || this.phase === 'result' || this.phase === 'task') {
      this.showNpcCard(this.step.npc);
    }
  }

  private onVisibility(v: VisibilityState): void {
    const was = this.immersive;
    this.immersive = v !== VisibilityState.NonImmersive;
    const panel = this.world.getSceneObject?.('welcome-panel');
    if (panel) panel.visible = !this.immersive;
    if (v === VisibilityState.Visible) {
      try {
        this.world.session?.updateTargetFrameRate?.(72)?.catch?.(() => {});
        this.renderer.xr.setFoveation(0.4); // text-heavy
      } catch {
        /* optional */
      }
      sfx.unlock();
      sadakAudio.unlock(sfx.context ?? undefined);
      this.speech.preload(allUtterances());
    }
    if (this.immersive && !was) {
      this.speech.stop();
      sadakAudio.ambience.stop();
      sadakAudio.music.stop();
      this.setReveal(0, 0);
      this.hideUi();
      this.placeT = 0;
      this.met.clear(); // SADAK's first-meeting cards reset per session
      this.setPhase('placing');
    } else if (!this.immersive && was) {
      this.placeDesktop();
      this.startJourney(true);
    }
  }

  private placeDesktop(): void {
    this.anchor.position.set(0, 0.74, -0.5);
    this.anchor.quaternion.identity();
    this.tableHit.height = 0.74;
    this.street.setTableHeight(0.74);
  }

  // ───────────────────────── state helpers ─────────────────────────

  private get errand(): Errand {
    return this.cur;
  }

  /** The world spot for an errand (falls back to the kachori stall until a world provides it). */
  private spotId(id: string): SpotId {
    return (id in this.street.spots ? id : 'kachori') as SpotId;
  }

  private get spot(): Spot {
    return this.street.spots[this.spotId(this.errand.id)];
  }

  private get bus(): AutoRig | undefined {
    return (this.street as unknown as { bus?: AutoRig }).bus;
  }

  /** Who is speaking: the stall's vendor, or nobody animated at the auto (Raju sits in his auto). */
  private get speaker(): VendorRig | null {
    return this.errand.id === 'auto' ? null : this.spot.vendor;
  }

  private get step(): Step {
    return this.errand.steps[this.stepIdx];
  }

  /** Build the errand at ORDER[idx] at the lesson tier SADAK's ramp gives it. */
  private loadErrand(idx: number): void {
    this.errandIdx = idx % ORDER.length;
    this.cur = errandAt(this.errandIdx, this.save.comfort);
  }

  private startJourney(desktop: boolean): void {
    // a fresh day: no auto or bus waiting yet
    if (this.street.auto.parked) this.street.auto.leave();
    if (this.bus?.parked) this.bus.leave();
    this.loadErrand(0);
    this.stepIdx = 0;
    this.street.setActive(this.spotId(this.errand.id));
    this.resetGoods();
    this.refreshHud();
    if (desktop) {
      this.setReveal(REVEAL_FULL, 0);
      this.beginErrand();
    }
  }

  private resetGoods(): void {
    this.ui.rotation.y = UI_YAW[this.errand.id] ?? 0;
    for (const s of Object.values(this.street.spots)) s.plate.position.set(PLATE_POS.x, s.plate.position.y, PLATE_POS.z);
    this.served.length = 0;
    this.bagged.length = 0;
    for (const s of Object.values(this.street.spots)) for (const it of s.items) {
      it.visible = true;
      it.scale.setScalar(1);
      if (it.userData.home) it.position.copy(it.userData.home as Vector3);
      else it.userData.home = it.position.clone();
    }
  }

  private setPhase(p: Phase): void {
    this.phase = p;
    this.phaseT = 0;
    this.phaseOnce.clear();
    this.log('phase', `${p} errand=${this.errand?.id} step=${this.stepIdx}`);
  }

  private once(key: string): boolean {
    if (this.phaseOnce.has(key)) return false;
    this.phaseOnce.add(key);
    return true;
  }

  private log(event: string, rest = ''): void {
    if (!import.meta.env.DEV) return;
    console.info(`${TAG} #${this.logId}.${++this.logSeq} ${event} ${rest}`);
  }

  private hideUi(): void {
    this.dialogue.opacity = 0;
    this.goal.opacity = 0;
    this.totalChip.opacity = 0;
    this.you.group.visible = false;
    this.micOrb.visible = false;
    this.coins.setVisible(false);
    this.panels?.show('actions', false);
    this.panels?.show('intro', false);
    this.panels?.show('ride', false);
    this.panels?.show('finale', false);
  }

  /** SADAK's NPC card: "{name} · {role}" + "Level n · X lesson · step/total", then the three tiers. */
  private showNpcCard(line: Line, nativeOnly = false): void {
    const e = this.errand;
    const tag = `${e.vendor.name} · ${e.vendor.role}`.toUpperCase();
    const note = `Level ${this.errandIdx + 1} · ${TIER_LABEL[e.tier]} lesson · ${Math.min(this.stepIdx + 1, e.steps.length)}/${e.steps.length} · learning हिन्दी`;
    this.dialogue.set(tag, nativeOnly ? { hi: line.hi, ro: '', en: '' } : line, { note: nativeOnly ? `${e.vendor.name} remembers you` : note });
    this.dialogue.opacity = 1;
  }

  /** Vendor speaks a line: voice + NPC card + talking animation. Returns seconds. */
  private vendorSay(line: Line, nativeOnly = false): number {
    const dur = this.speech.say(this.errand.vendor.speaker, line.hi);
    this.speaker?.talk(dur);
    this.showNpcCard(line, nativeOnly);
    this.waitUntil = this.phaseT + dur + 0.3;
    this.log('say', `who=${this.errand.vendor.speaker} dur=${dur.toFixed(2)} hi=${line.hi}`);
    return dur;
  }

  private setGoal(text: string, tone: 'goal' | 'hint' | 'good' = 'goal'): void {
    this.goal.set(text, tone);
    this.goal.opacity = text ? 1 : 0;
  }

  private showToast(text: string): void {
    this.toast.set(text, 'good');
    this.toast.opacity = 1;
    this.toastT = 4; // SADAK's toast lasts 4 s
  }

  private refreshHud(): void {
    if (!this.panels?.loaded) return;
    const current = this.phase === 'finale' ? -1 : this.errandIdx;
    this.panels.setErrands(
      ORDER.map((id, i) => ({ done: this.save.completed.includes(id), now: i === current, note: META[id].done })),
      this.save.cash,
      this.save.xp,
    );
  }

  // ───────────────────────── main loop ─────────────────────────

  update(delta: number, time: number): void {
    if (!this.ready) return;
    if (this.world.visibilityState.peek() === VisibilityState.VisibleBlurred) return;
    const dt = Math.min(delta, 1 / 20);
    this.phaseT += dt;
    this.updateHead();
    this.updateHands(dt);
    this.checkReplace(dt);
    this.handleKeys();

    switch (this.phase) {
      case 'placing': this.updatePlacing(dt); break;
      case 'reveal': this.updateReveal(); break;
      case 'arrive': this.updateArrive(dt); break;
      case 'intro': this.updateIntro(); break;
      case 'recall': this.updateRecall(); break;
      case 'npc': this.updateNpc(); break;
      case 'task': this.updateTask(); break;
      case 'player': this.updatePlayer(); break;
      case 'result': this.updateResult(); break;
      case 'after': this.updateAfter(); break;
      case 'done': this.updateDone(); break;
      case 'ride': this.updateRide(); break;
      case 'finale': this.updateFinale(); break;
      default: break;
    }

    // reveal animation
    if (this.reveal !== this.revealTarget) {
      const step = this.revealSpeed * dt;
      this.reveal = Math.abs(this.revealTarget - this.reveal) <= step ? this.revealTarget : this.reveal + Math.sign(this.revealTarget - this.reveal) * step;
      this.street.setReveal(this.revealCurve(this.reveal));
    }
    if (this.toastT > 0) {
      this.toastT -= dt;
      this.toast.opacity = Math.max(0, Math.min(1, this.toastT / 0.4));
    }
    sadakAudio.ambience.update(dt);
    const duck = this.inDialogue() || this.speech.speaking || this.mic.state === 'recording';
    if (duck !== this.ducked) {
      this.ducked = duck;
      sadakAudio.music.duck(duck);
      sadakAudio.ambience.duck(duck);
    }
    this.punchHands(dt);
    this.updateServed(dt);
    this.coins.update(dt);
    this.syncInteractables();
    this.updateMic(time);
    this.animateYou(dt);
    this.faceViewer(this.dialogue.mesh);
    this.faceViewer(this.goal.mesh);
    this.faceViewer(this.title.mesh);
    this.faceViewer(this.toast.mesh);
    this.faceViewer(this.totalChip.mesh);
    this.panels.face(this.tA.copy(this.headLocal).applyMatrix4(this.anchor.matrixWorld));
    this.street.update(dt, time);
    this.spot.vendor.setLookAt(this.headLocal);
    this.keys.clear();

    if (import.meta.env.DEV) {
      this.statT += dt;
      if (this.statT > 4) {
        this.statT = 0;
        const r = this.renderer.info.render;
        this.log('stats', `calls=${r.calls} tris=${r.triangles} phase=${this.phase}`);
      }
    }
  }

  /** Reveal is driven linearly in "progress" units; the radius grows slowly near the table, then sweeps out. */
  private revealCurve(x: number): number {
    if (x <= 0) return 0;
    if (x >= REVEAL_FULL) return REVEAL_FULL;
    const u = x / REVEAL_FULL;
    return REVEAL_FULL * u * u * u;
  }
  private setReveal(target: number, seconds: number): void {
    this.revealTarget = target;
    if (seconds <= 0) {
      this.reveal = target;
      this.street.setReveal(this.revealCurve(target));
    } else this.revealSpeed = Math.abs(target - this.reveal) / seconds;
  }

  // ───────────────────────── input ─────────────────────────

  private updateHead(): void {
    (this.immersive ? this.player.head : this.camera).getWorldPosition(this.headWorld);
    this.anchor.updateWorldMatrix(true, false);
    this.invM.copy(this.anchor.matrixWorld).invert();
    this.headLocal.copy(this.headWorld).applyMatrix4(this.invM);
  }
  private updateHands(dt: number): void {
    const frame = this.xrFrame as XRFrame | undefined;
    const ref = this.renderer.xr.getReferenceSpace();
    const xr = this.input.xr;
    this.player.updateWorldMatrix(true, false);
    const now = performance.now();
    this.hands.both.forEach((h: HandState, i) => {
      const src = this.immersive ? xr.getPrimaryInputSource(h.side) : undefined;
      let sel = false;
      try {
        sel = xr.getSelectState(h.side).active;
      } catch {
        sel = false;
      }
      h.update(frame, ref, src, this.player.matrixWorld, sel, now, dt);
      const hi = this.handIn[i];
      hi.tracked = h.tracked;
      hi.pinching = h.pinching;
      hi.started = h.pinchStarted;
      hi.ended = h.pinchEnded;
      hi.p.copy(h.pinchPoint).applyMatrix4(this.invM);
      this.tipLocal[i].copy(h.indexTip).applyMatrix4(this.invM);
      this.palmLocal[i].copy(h.palm).applyMatrix4(this.invM);
    });
  }
  private pinchStarted(): boolean {
    return this.hands.left.pinchStarted || this.hands.right.pinchStarted;
  }

  private handleKeys(): void {
    if (this.keys.has('m')) {
      sfx.muted = !sfx.muted;
      sadakAudio.muted = sfx.muted;
    }
    if (this.keys.has('n')) {
      this.speech.stop();
      this.startJourney(!this.immersive);
    }
    if (import.meta.env.DEV && this.keys.has('l')) {
      const order: ComfortLevel[] = ['easy', 'medium', 'hard'];
      this.setComfort(order[(order.indexOf(this.save.comfort) + 1) % 3]);
    }
  }

  /** Both hands pinching for 1.5 s → place the stall again. */
  private checkReplace(dt: number): void {
    if (!this.immersive || this.phase === 'placing' || this.phase === 'task') {
      this.bothPinchT = 0;
      return;
    }
    if (this.hands.left.pinching && this.hands.right.pinching) {
      this.bothPinchT += dt;
      if (this.bothPinchT > 1.5) {
        this.bothPinchT = 0;
        this.speech.stop();
        this.setReveal(0, 0.8);
        this.hideUi();
        this.placeT = 0;
        this.setPhase('placing');
      }
    } else this.bothPinchT = 0;
  }
  private press(id: string, fn: () => void): void {
    const now = performance.now();
    if (now - (this.lastPress.get(id) ?? 0) < 600) return;
    this.lastPress.set(id, now);
    fn();
  }

  /** Only live targets take input: add or remove IWSDK interaction components each frame. */
  private syncInteractables(): void {
    const toggle = (e: Entity, on: boolean, grab = false) => {
      const C = grab ? OneHandGrabbable : RayInteractable;
      if (on && !e.hasComponent(C)) {
        e.addComponent(C);
        if (!grab) e.addComponent(PokeInteractable);
      } else if (!on && e.hasComponent(C)) {
        e.removeComponent(C);
        if (!grab) e.removeComponent(PokeInteractable);
      }
    };
    toggle(this.youEntity, this.phase === 'player' && this.you.group.visible && this.you.popT > 0.3);
    toggle(this.micEntity, this.phase === 'player' && this.micOrb.visible);
    this.coinEntities.forEach((e, i) => toggle(e, this.coins.grabbable(i), true));
  }

  // ───────────────────────── placement ─────────────────────────

  private findTable(): void {
    this.tableHit.ok = false;
    let best = Infinity;
    for (const e of this.queries.planes.entities) {
      const plane = e.getValue(XRPlane, '_plane') as XRPlane | undefined;
      const obj = e.object3D;
      if (!plane || !obj || plane.orientation !== 'horizontal') continue;
      const label = (plane as unknown as { semanticLabel?: string }).semanticLabel;
      obj.updateWorldMatrix(true, false);
      const y = obj.getWorldPosition(this.tA).y;
      const isTable = label === 'table' || label === 'desk' || (!label && y > 0.45 && y < 1.1);
      if (!isTable) continue;
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const p of plane.polygon) {
        this.tB.set(p.x, p.y, p.z);
        obj.localToWorld(this.tB);
        minX = Math.min(minX, this.tB.x); maxX = Math.max(maxX, this.tB.x);
        minZ = Math.min(minZ, this.tB.z); maxZ = Math.max(maxZ, this.tB.z);
      }
      const m = 0.2;
      const px = maxX - minX > 2 * m ? Math.min(maxX - m, Math.max(minX + m, this.headWorld.x)) : (minX + maxX) / 2;
      const pz = maxZ - minZ > 2 * m ? Math.min(maxZ - m, Math.max(minZ + m, this.headWorld.z)) : (minZ + maxZ) / 2;
      const d = Math.hypot(px - this.headWorld.x, pz - this.headWorld.z);
      const fwd = this.tB.set(0, 0, -1).applyQuaternion(this.player.head.getWorldQuaternion(this.tQ));
      const ang = Math.acos(Math.max(-1, Math.min(1, (fwd.x * (px - this.headWorld.x) + fwd.z * (pz - this.headWorld.z)) / (Math.hypot(fwd.x, fwd.z) * d + 1e-6))));
      if (ang > 1.2) continue;
      if (d < best && d < 2.2) {
        best = d;
        this.tableHit.pos.set(px, y, pz);
        this.tableHit.height = y;
        this.tableHit.ok = true;
      }
    }
    if (this.tableHit.ok) {
      // the counter's near edge (+0.3 m) should sit just in front of the chest
      const dx = this.tableHit.pos.x - this.headWorld.x;
      const dz = this.tableHit.pos.z - this.headWorld.z;
      const d = Math.hypot(dx, dz);
      const want = 0.5;
      if (d < want) {
        const k = want / Math.max(d, 1e-3);
        this.tableHit.pos.x = this.headWorld.x + dx * k;
        this.tableHit.pos.z = this.headWorld.z + dz * k;
      }
    }
  }
  private updatePlacing(dt: number): void {
    this.placeT += dt;
    this.findTable();
    const hand = this.hands.right.tracked ? this.hands.right : this.hands.left.tracked ? this.hands.left : null;
    const pos = this.tC;
    let ok = false;
    let msg = '';
    if (this.tableHit.ok) {
      pos.copy(this.tableHit.pos);
      ok = true;
      msg = 'Table found. Pinch to open your stall here.';
    } else if (hand && this.placeT < 8) {
      const fx = hand.pinchPoint.x - this.headWorld.x;
      const fz = hand.pinchPoint.z - this.headWorld.z;
      const len = Math.hypot(fx, fz) || 1;
      pos.set(hand.pinchPoint.x + (fx / len) * 0.25, hand.pinchPoint.y - 0.03, hand.pinchPoint.z + (fz / len) * 0.25);
      ok = true;
      msg = 'Hold your hand just above your table, then pinch.';
    } else {
      this.tA.set(0, 0, -0.55).applyQuaternion(this.player.head.getWorldQuaternion(this.tQ));
      pos.set(this.headWorld.x + this.tA.x, this.headWorld.y - 0.48, this.headWorld.z + this.tA.z);
      ok = this.placeT > 1.5;
      msg = 'No table found. Pinch to use a virtual counter.';
    }
    const yaw = Math.atan2(this.headWorld.x - pos.x, this.headWorld.z - pos.z);
    this.placeMarker.visible = true;
    this.placeMarker.position.copy(pos);
    this.placeMarker.rotation.set(0, yaw, 0);
    this.anchor.position.copy(pos);
    this.anchor.rotation.set(0, yaw, 0);
    this.setGoal(msg);
    this.ui.rotation.y = 0;
    this.goal.mesh.position.set(0, 0.12, -0.45);
    if (this.once('enter')) this.log('placing', `hasPlanes=${this.queries.planes.entities.size} roomCapture=${!!(this.world.session as unknown as { initiateRoomCapture?: unknown })?.initiateRoomCapture}`);

    if (ok && this.placeT > 0.6 && (this.pinchStarted() || this.keys.has(' '))) {
      this.placeMarker.visible = false;
      this.goal.mesh.position.copy(GOAL_POS);
      this.setGoal('');
      const h = this.tableHit.ok ? this.tableHit.height : Math.max(0.5, pos.y);
      this.street.setTableHeight(h);
      this.log('placed', `table=${this.tableHit.ok} height=${h.toFixed(2)} anchor=${JSON.stringify(this.anchor.position.toArray().map((v) => +v.toFixed(3)))} yaw=${yaw.toFixed(3)}`);
      this.startJourney(false);
      this.setPhase('reveal');
    }
  }

  // ───────────────────────── reveal: Old Delhi grows out of your table ─────────────────────────

  private updateReveal(): void {
    const t = this.phaseT;
    if (this.once('start')) {
      sfx.whoosh();
      this.setReveal(REVEAL_FULL, 5.5);
    }
    if (t > 1.2 && this.once('street')) {
      sadakAudio.ambience.start();
      sadakAudio.music.start('delhi');
    }
    if (t > 2.6 && this.once('swell')) for (let i = 0; i < 4; i++) setTimeout(() => sfx.reward(i), i * 280);
    this.title.set('सड़क · Chandni Chowk', 'title');
    this.title.opacity = t < 0.8 ? 0 : t < 4.6 ? Math.min(1, (t - 0.8) / 0.6) : Math.max(0, 1 - (t - 4.6) / 0.6);
    if (t > 5.4) {
      this.title.opacity = 0;
      this.beginErrand();
    }
  }

  // ───────────────────────── an errand ─────────────────────────

  private beginErrand(): void {
    this.stepIdx = 0;
    this.slips = 0;
    this.picked = 0;
    this.stepPoints = [];
    this.hideUi();
    this.street.setActive(this.spotId(this.errand.id));
    this.resetGoods();
    this.refreshHud();
    this.log('errand', `id=${this.errand.id} tier=${this.errand.tier} comfort=${this.save.comfort} steps=${this.errand.steps.length}`);
    // SADAK's location card: the place name slides in with a chime
    this.title.set(this.errand.place, 'title');
    this.title.opacity = 1;
    sadakAudio.chime();
    const place = this.errand.place;
    setTimeout(() => {
      if (this.phase !== 'finale' && this.errand.place === place) this.title.opacity = 0;
    }, 2600);
    this.hailT = 0;
    this.waitUntil = 0;
    this.setPhase('arrive');
  }

  /** Before the dialogue: raise a hand for the auto, or wait for the bus to pull in. */
  private updateArrive(dt: number): void {
    const how = this.errand.arrive;
    if (how === 'hail' && !this.street.auto.parked && !this.phaseOnce.has('hailed')) {
      if (this.once('hint')) {
        this.setGoal('Raise a hand high to stop an auto');
        sfx.horn(0.6, 0.6);
      }
      let up = false;
      for (let i = 0; i < 2; i++) if (this.hands.both[i].tracked && this.palmLocal[i].y > this.headLocal.y + 0.02) up = true;
      this.hailT = up ? this.hailT + dt : Math.max(0, this.hailT - dt * 2);
      if (this.hailT > 0.35 || this.keys.has('h') || (!this.immersive && this.phaseT > 3)) {
        this.log('hailed');
        this.phaseOnce.add('hailed');
        this.setGoal('');
        this.street.auto.arrive();
        sfx.putter(2.2, 0.7);
        setTimeout(() => sfx.horn(0.7, 1), 1800);
        this.waitUntil = this.phaseT + 2.4;
      }
      return;
    }
    if (how === 'bus' && this.bus && !this.bus.parked) {
      if (this.once('bus')) {
        this.setGoal('Wait at the stop: the bus is coming');
        this.bus.arrive();
        sfx.putter(2.6, 0.5);
      }
      return;
    }
    if (this.phaseT < this.waitUntil) return;
    this.setGoal('');
    this.beginTalk();
  }

  /** SADAK: a first meeting shows the intro card for 2.2 s, then the dialogue opens. */
  private beginTalk(): void {
    if (!this.met.has(this.errand.id) && this.panels.loaded) {
      this.met.add(this.errand.id);
      this.panels.setIntro(`${this.errand.kind} - ${this.errand.vendor.role}`.toUpperCase(), this.errand.title, this.errand.brief);
      this.panels.show('intro', true);
      sadakAudio.sfx.play('open');
      this.setPhase('intro');
      return;
    }
    this.afterIntro();
  }

  private updateIntro(): void {
    if (this.phaseT * 1000 < INTRO_MS && !this.keys.has(' ')) return;
    this.panels.show('intro', false);
    this.afterIntro();
  }

  private afterIntro(): void {
    const mem = this.save.vendors[this.errand.id];
    if (mem && mem.visits > 0) {
      this.setPhase('recall');
      this.vendorSay(this.errand.recall, true); // SADAK shows the recall line in script only
      this.log('greet', 'recall=true');
    } else {
      this.log('greet', 'recall=false');
      this.beginStep();
    }
  }

  private updateRecall(): void {
    if (this.phaseT > this.waitUntil || this.keys.has(' ')) this.beginStep();
  }

  private beginStep(): void {
    this.you.group.visible = false;
    this.micOrb.visible = false;
    this.panels.show('actions', false);
    this.setGoal('');
    this.setPhase('npc');
    this.vendorSay(this.step.npc);
  }

  /** SADAK: the mic is unavailable while the NPC speaks; when the audio ends the player's turn starts. */
  private updateNpc(): void {
    if (this.phaseT < this.waitUntil && !this.keys.has(' ')) return;
    const b = this.step.before;
    if (b?.kind === 'pay') this.beginPay(b.amount);
    else this.beginPlayer();
  }

  private beginPay(amount: number): void {
    this.setPhase('task');
    this.setGoal(this.step.goal);
    this.coins.reset(POUCH_POS, this.plateLocal(this.tB), amount);
    this.coins.setVisible(true);
    this.totalChip.set(`₹0 / ₹${amount}`);
    this.totalChip.mesh.position.copy(this.plateLocal(this.tB)).add(this.tA.set(0, 0.09, 0));
    this.totalChip.opacity = 1;
    this.log('pay', `amount=${amount}`);
    this.logTargets();
  }

  private plateLocal(out: Vector3): Vector3 {
    this.spot.plate.getWorldPosition(out);
    return out.applyMatrix4(this.invM);
  }

  private onPlateTotal(total: number): void {
    const b = this.step?.before;
    if (this.phase !== 'task' || b?.kind !== 'pay') return;
    this.totalChip.set(`₹${total} / ₹${b.amount}`, total === b.amount ? 'good' : 'goal');
    this.log('plate', `total=${total} want=${b.amount}`);
    if (total > b.amount) {
      this.vendorSay(REACT_TOO_MUCH);
      this.speaker?.gesture('shake');
      this.coins.returnLast();
      this.slips++;
    } else if (total === b.amount) {
      this.speaker?.gesture('receive');
      sfx.right();
      this.waitUntil = this.phaseT + 0.9;
    }
  }

  private updateTask(): void {
    const b = this.step.before;
    if (b?.kind !== 'pay') return;
    if (import.meta.env.DEV && this.keys.has('p')) this.devPay(b.amount);
    if (this.coins.plateTotal === b.amount && this.phaseT > this.waitUntil) {
      this.coins.sweepPlate();
      this.totalChip.opacity = 0;
      this.log('paid', `amount=${b.amount}`);
      setTimeout(() => this.coins.setVisible(false), 900);
      this.beginPlayer();
    }
  }

  /** Dev/test shortcut: put exact change on the plate. */
  private devPay(amount: number): void {
    let left = amount - this.coins.plateTotal;
    for (const c of this.coins.coins) {
      if (c.state !== 'tray' || c.value > left) continue;
      left -= c.value;
      c.pos.copy(this.plateLocal(this.tA)).add(this.tB.set(0, 0.05, 0));
      c.state = 'falling';
      if (left <= 0) break;
    }
  }

  // ───────────────────────── your turn (SADAK's Dialogue "player" and "result" phases) ─────────────────────────

  private beginPlayer(): void {
    this.setPhase('player');
    this.showNpcCard(this.step.npc);
    this.you.set(this.step.reply);
    this.you.group.visible = true;
    this.micOrb.visible = this.mic.available;
    this.setGoal('');
    this.panels.setActions(
      this.mic.available ? 'Hold the mic and speak the line, or touch it' : 'Touch your line to say it',
      null,
      { hear: true, retry: false, cont: false },
    );
    this.panels.show('actions', true);
    this.logTargets();
  }

  private setYouHover(on: boolean): void {
    this.you.hoverT = 0;
    if (on) sadakAudio.sfx.play('hover');
    if (this.phase === 'player') this.you.setState(on ? 'hover' : 'idle');
  }

  /** Hands-first: touching (or pointing and pinching at) your line says it for you. */
  private sayByTouch(): void {
    if (this.phase !== 'player') return;
    this.log('say-touch', `hi=${this.step.reply.hi}`);
    const dur = this.speech.say(PLAYER_SPEAKER, this.step.reply.hi);
    this.you.heard = '';
    this.you.verdicts = null;
    this.you.setState('said');
    this.showResult(TOUCH_POINTS, false, dur);
  }

  private updatePlayer(): void {
    if (this.keys.has('1')) this.sayByTouch();
    if (this.keys.has('h')) this.hearCorrect();
    if (this.keys.has('v')) {
      if (this.mic.state === 'recording') this.micUp();
      else this.micDown();
    }
  }

  /** SADAK's result: "+N pts"; above 0 shows "Continue", exactly 0 shows "Try again". */
  private showResult(points: number, spoken: boolean, delay = 0): void {
    this.lastPoints = points;
    this.setPhase('result');
    this.waitUntil = delay;
    this.micOrb.visible = false;
    if (points > 0) {
      this.stepPoints[this.stepIdx] = points;
      this.save.xp += points; // SADAK: every scored attempt adds its points to XP
      learn(this.save, this.step.reply.hi, spoken && points >= 70);
      writeSave(this.save);
      this.refreshHud();
      sadakAudio.sfx.play(points >= 72 ? 'success' : points >= 40 ? 'partial' : 'error');
      this.speaker?.gesture('nod');
    } else sadakAudio.sfx.play('error');
    this.panels.setActions(
      points > 0 ? (spoken ? 'Well said' : 'Said by touch') : "Say it again when you're ready.",
      `+${points} pts`,
      { hear: points < 100, retry: points === 0, cont: points > 0 },
    );
    this.log('result', `points=${points} spoken=${spoken} xp=${this.save.xp}`);
    setTimeout(() => this.logTargets(), 250);
  }

  private updateResult(): void {
    if (this.keys.has(' ')) this.continueStep();
    if (this.keys.has('r')) this.retryStep();
    if (this.keys.has('h')) this.hearCorrect();
  }

  private continueStep(): void {
    if (this.phase !== 'result' || this.lastPoints <= 0) return;
    sadakAudio.sfx.play('click');
    this.panels.show('actions', false);
    this.you.group.visible = false;
    this.log('continue', `step=${this.stepIdx}`);
    if (this.step.after) this.beginAfter();
    else this.nextStep();
  }

  private retryStep(): void {
    if (this.phase !== 'result' || this.lastPoints > 0) return;
    this.beginPlayer(); // SADAK: back to the player's turn without replaying the NPC line
  }

  /** SADAK's "Hear correct pronunciation": your line in the vendor's voice. */
  private hearCorrect(): void {
    if (this.phase !== 'player' && this.phase !== 'result') return;
    if (this.speech.speaking) return;
    this.speech.say(this.errand.vendor.speaker, this.step.reply.hi);
    this.log('hear', `hi=${this.step.reply.hi}`);
  }

  private animateYou(dt: number): void {
    if (!this.you.group.visible) return;
    this.you.popT += dt;
    const e = Math.max(0, Math.min(1, this.you.popT / 0.35));
    const back = e === 0 ? 0.01 : 1 + 2.2 * Math.pow(e - 1, 3) + 1.2 * Math.pow(e - 1, 2);
    this.you.group.scale.setScalar(Math.max(0.01, back));
    this.faceViewer(this.you.group);
  }

  // ───────────────────────── after a line: the vendor serves, or you pick goods ─────────────────────────

  private beginAfter(): void {
    const a = this.step.after!;
    this.setPhase('after');
    if (a.kind === 'serve') {
      this.speaker?.gesture('offer');
      sfx.whoosh();
      this.spot.items.slice(0, 2).forEach((obj, i) => {
        const from = obj.position.clone();
        const to = this.toItemSpace(obj, this.tA.copy(SERVE_POS).add(this.tB.set((i - 0.5) * 0.1, 0, 0))).clone();
        this.served.push({ obj, from, to, t: 0, bites: 0, held: -1 });
      });
      this.setGoal('Served! Pinch one and take a bite', 'good');
      this.waitUntil = 1.6;
    } else if (a.kind === 'pick') {
      this.picked = 0;
      this.speaker?.gesture('offer');
      this.setGoal(`Pinch ${a.count} garlands to take them`);
      this.logTargets();
    }
  }

  /** Convert an anchor-local position into `obj.parent`'s space. */
  private toItemSpace(obj: Object3D, local: Vector3): Vector3 {
    const w = local.applyMatrix4(this.anchor.matrixWorld);
    obj.parent!.updateWorldMatrix(true, false);
    return obj.parent!.worldToLocal(w);
  }

  private updateAfter(): void {
    const a = this.step.after!;
    if (a.kind === 'serve') {
      if (this.phaseT > this.waitUntil || this.keys.has(' ')) this.nextStep();
      return;
    }
    if (a.kind === 'pick') {
      for (const it of this.spot.items) {
        if (!it.visible || this.bagged.includes(it)) continue;
        it.getWorldPosition(this.tA).applyMatrix4(this.invM);
        it.scale.setScalar(1 + Math.sin(this.phaseT * 6) * 0.06);
        let take = this.keys.has('g');
        for (let i = 0; i < 2; i++) {
          const h = this.handIn[i];
          if (h.tracked && h.started && h.p.distanceTo(this.tA) < 0.07) take = true;
        }
        if (take) {
          this.keys.delete('g');
          it.scale.setScalar(1);
          this.bagged.push(it);
          const to = this.toItemSpace(it, this.tB.copy(BAG_POS).add(this.tC.set(0, 0.02 * this.picked, 0.04 * this.picked))).clone();
          this.served.push({ obj: it, from: it.position.clone(), to, t: 0, bites: -1, held: -1 });
          this.picked++;
          sfx.select();
          this.log('picked', `n=${this.picked}`);
          break;
        }
      }
      if (this.picked >= a.count) {
        this.setGoal('Got them!', 'good');
        if (this.once('gotall')) this.waitUntil = this.phaseT + 0.8;
        if (this.phaseT > this.waitUntil) this.nextStep();
      }
    }
  }

  /** Goods moving to you, and kachoris you can pick up and bite. */
  private updateServed(dt: number): void {
    for (const s of this.served) {
      if (s.t < 1) {
        s.t = Math.min(1, s.t + dt / 0.8);
        const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - Math.pow(-2 * s.t + 2, 2) / 2;
        s.obj.position.lerpVectors(s.from, s.to, e);
        s.obj.position.y += Math.sin(e * Math.PI) * 0.06;
        continue;
      }
      if (s.bites < 0 || !s.obj.visible) continue; // garlands just sit in your bag
      // pick up a kachori and bring it to your mouth
      s.obj.getWorldPosition(this.tA).applyMatrix4(this.invM);
      for (let i = 0; i < 2; i++) {
        const h = this.handIn[i];
        if (s.held < 0 && h.tracked && h.started && h.p.distanceTo(this.tA) < 0.06) s.held = i;
        if (s.held === i && (!h.pinching || h.ended)) {
          s.held = -1;
          s.to.copy(s.obj.position);
          s.from.copy(s.obj.position);
        }
      }
      if (s.held >= 0) {
        const p = this.toItemSpace(s.obj, this.tB.copy(this.handIn[s.held].p));
        s.obj.position.lerp(p, Math.min(1, dt * 25));
        if (this.tA.distanceTo(this.headLocal) < 0.14) {
          s.bites++;
          sfx.crunch();
          this.log('bite', `n=${s.bites}`);
          s.obj.scale.setScalar(1 - s.bites * 0.3);
          if (s.bites >= 3) {
            s.obj.visible = false;
            s.held = -1;
          } else {
            // bounce it away from the mouth a little so the next bite is deliberate
            s.held = -1;
            s.obj.position.y -= 0.08;
          }
        }
      }
    }
  }

  private nextStep(): void {
    this.stepIdx++;
    if (this.stepIdx < this.errand.steps.length) this.beginStep();
    else this.finishErrand();
  }

  /** SADAK's onComplete: success, then cash (first completion only), toast "Done: {title}", then the ride. */
  private finishErrand(): void {
    const first = !this.save.completed.includes(this.errand.id);
    if (first) {
      this.save.completed.push(this.errand.id);
      this.save.cash += this.errand.reward;
    }
    recordVisit(this.save, this.errand.id, this.slips);
    markDay(this.save);
    writeSave(this.save);
    this.hideUi();
    this.setPhase('done');
    sadakAudio.sfx.play('success');
    setTimeout(() => sadakAudio.sfx.play('cash'), 450);
    this.showToast(`Done: ${this.errand.title}`);
    this.speaker?.gesture(this.errand.id === 'auto' ? 'wave' : 'namaste');
    this.refreshHud();
    const pts = this.stepPoints.filter((p) => p > 0);
    this.log('errandDone', `id=${this.errand.id} slips=${this.slips} cash=${this.save.cash} xp=${this.save.xp} avg=${pts.length ? Math.round(pts.reduce((a, b) => a + b, 0) / pts.length) : 0}`);
  }

  private updateDone(): void {
    if (this.phaseT < 2.2 && !this.keys.has(' ')) return;
    if (this.errandIdx + 1 >= ORDER.length) {
      this.save.districtsDone++;
      writeSave(this.save);
      this.setPhase('finale');
      return;
    }
    const kind = RIDE_AFTER[this.errand.id];
    this.loadErrand(this.errandIdx + 1);
    this.startRide(kind ?? 'rickshaw');
  }

  // ───────────────────────── rides (SADAK rides.ts): the street moves past your seat ─────────────────────────

  private startRide(kind: 'auto' | 'bus' | 'rickshaw'): void {
    this.setPhase('ride');
    this.hideUi();
    this.panels.setRide(`Riding to ${this.errand.title}`);
    this.panels.show('ride', true);
    const ride = (this.street as unknown as { ride?: (to: SpotId, k: string) => RideHandle }).ride;
    this.ride = ride ? ride.call(this.street, this.spotId(this.errand.id), kind) : null;
    this.log('ride', `kind=${kind} to=${this.errand.id} world=${!!this.ride}`);
    if (kind === 'auto' || kind === 'bus') sfx.putter(3, 0);
    this.logTargets();
  }

  private updateRide(): void {
    if (this.keys.has(' ')) this.ride?.skip();
    if (this.ride) {
      if (!this.ride.done) return;
    } else {
      // no ride in this world build: fold the street into the table and open it at the next stall
      if (this.once('out')) {
        sfx.whoosh();
        this.setReveal(3, 1.1);
      }
      if (this.phaseT > 1.15 && this.once('swap')) {
        this.street.setActive(this.spotId(this.errand.id));
        this.resetGoods();
        this.setReveal(REVEAL_FULL, 2.6);
      }
      if (this.phaseT < 3.2 && !this.keys.has(' ')) return;
      this.setReveal(REVEAL_FULL, 0);
    }
    this.ride = null;
    this.panels.show('ride', false);
    this.log('arrived', `at=${this.errand.id}`);
    this.beginErrand();
  }

  // ───────────────────────── finale (SADAK's "PURANI SADAK SURVIVED") ─────────────────────────

  private updateFinale(): void {
    if (this.once('show')) {
      this.hideUi();
      this.panels.setFinale(`${DISTRICT_REWARD.toLocaleString('en-IN')} earned in Chandni Chowk`);
      this.panels.show('finale', true);
      for (let i = 0; i < 4; i++) setTimeout(() => sfx.reward(i), i * 280);
      this.refreshHud();
      this.log('finale', `title=${FINALE.title.replace(/ /g, '_')} cash=${this.save.cash} xp=${this.save.xp} phrases=${this.save.phrases.length} comfort=${this.save.comfort}`);
      setTimeout(() => this.logTargets(), 250);
    }
    if (this.keys.has('1')) this.keepExploring();
  }

  /** SADAK's "Keep exploring": the city stays playable; we go round the errands again (vendors remember you). */
  private keepExploring(): void {
    if (this.phase !== 'finale') return;
    sadakAudio.sfx.play('click');
    this.panels.show('finale', false);
    if (this.street.auto.parked) this.street.auto.leave();
    if (this.bus?.parked) this.bus.leave();
    this.loadErrand(0);
    this.log('round', 'again');
    this.startRide('rickshaw');
  }

  // ───────────────────────── voice (SADAK: hold to speak, saaras STT, word-by-word score) ─────────────────────────

  private micDown(): void {
    if (this.phase !== 'player' || this.speech.speaking) return;
    if (this.mic.start()) {
      sadakAudio.sfx.play('tap');
      this.you.setState('listening');
      this.panels.setActions('Listening...', null, { hear: false, retry: false, cont: false });
      this.log('mic', 'recording');
    }
  }

  private micUp(): void {
    if (this.mic.state !== 'recording') return;
    sadakAudio.sfx.play('tap');
    void this.finishVoice();
  }

  private async finishVoice(): Promise<void> {
    this.panels.setActions('Transcribing...', null, { hear: false, retry: false, cont: false });
    const res = await this.mic.stop(import.meta.env.BASE_URL);
    if (this.phase !== 'player') return;
    if ('error' in res || !res.transcript.trim()) {
      // SADAK: "Didn't catch that, try again." and stay in the player's turn
      this.log('stt', 'error' in res ? `error=${res.error}` : 'empty');
      this.you.heard = "Didn't catch that: try again.";
      this.you.setState('idle');
      sadakAudio.sfx.play('error');
      this.panels.setActions('Hold the mic and speak the line, or touch it', null, { hear: true, retry: false, cont: false });
      return;
    }
    const s = scoreAttempt(this.step.reply.hi, res.transcript);
    this.you.verdicts = s.verdicts;
    this.you.heard = `You said: "${res.transcript}"`;
    this.you.setState('said');
    this.log('stt', `transcript=${res.transcript} points=${s.points}`);
    this.showResult(s.points, true);
  }

  private updateMic(time: number): void {
    this.mic.sample();
    if (!this.micOrb.visible) return;
    const rec = this.mic.state === 'recording';
    const m = this.micOrb.material as MeshBasicMaterial;
    m.color.setHex(rec ? 0xe0342c : this.mic.state === 'thinking' ? 0xf5c518 : 0xf08a1c);
    this.micOrb.scale.setScalar(1 + (rec ? this.mic.level * 0.5 : Math.sin(time * 3) * 0.04));
    this.micRing.lookAt(this.tA.copy(this.headLocal).applyMatrix4(this.anchor.matrixWorld));
    // a hold longer than SADAK's longest line stops by itself
    if (rec && performance.now() - this.mic.startedAt > 9000) void this.finishVoice();
  }

  // ───────────────────────── helpers ─────────────────────────

  private ducked = false;

  /** SADAK ducks the music to silence while a dialogue (or the finale) is open. */
  private inDialogue(): boolean {
    const p = this.phase;
    return p === 'intro' || p === 'recall' || p === 'npc' || p === 'task' || p === 'player' || p === 'result' || p === 'after' || p === 'finale';
  }

  private handPunchT = 0;
  private handPunched = false;

  /**
   * Show your REAL hands over the virtual street: IWSDK's hand visual is an outline plus an
   * inner "stencil" mesh that writes (0,0,0,0) with normal blending (invisible). With no
   * blending it writes alpha 0, and Quest composites passthrough there: a hand-shaped window
   * onto the real hand. (Checked every second until found; the material is shared.)
   */
  private punchHands(dt: number): void {
    if (this.handPunched || !this.immersive) return;
    this.handPunchT += dt;
    if (this.handPunchT < 1) return;
    this.handPunchT = 0;
    this.scene.traverse((o) => {
      const m = (o as SkinnedMesh).isSkinnedMesh ? ((o as SkinnedMesh).material as ShaderMaterial) : null;
      if (m && (m as ShaderMaterial).isShaderMaterial && m.fragmentShader.includes('vec4(0,0,0,0)')) {
        m.blending = NoBlending;
        m.transparent = false;
        m.needsUpdate = true;
        this.handPunched = true;
      }
    });
    if (this.handPunched) this.log('hands', 'passthrough-window=on');
  }
  private faceViewer(o: Object3D): void {
    if (!o.visible) return;
    o.lookAt(this.tA.copy(this.headLocal).applyMatrix4(this.anchor.matrixWorld));
  }

  /** Dev log of world positions of everything a test must touch. */
  private logTargets(): void {
    if (!import.meta.env.DEV) return;
    this.anchor.updateWorldMatrix(true, true);
    const w = (o: Object3D) => o.getWorldPosition(this.tA).toArray().map((v) => +v.toFixed(3));
    const coins: { v: number; p: number[] }[] = [];
    this.coins.positions(coins, (v) => v.applyMatrix4(this.anchor.matrixWorld));
    const layout = {
      you: this.you.group.visible ? w(this.you.mesh) : null,
      mic: this.micOrb.visible ? w(this.micOrb) : null,
      plate: w(this.spot.plate),
      items: this.spot.items.map((it) => w(it)),
      coins: this.coins.visible ? coins : [],
      buttons: this.panels.buttonPositions(),
      head: this.headWorld.toArray().map((v) => +v.toFixed(3)),
    };
    this.log('targets', `phase=${this.phase} layout=${JSON.stringify(layout)}`);
  }
}
