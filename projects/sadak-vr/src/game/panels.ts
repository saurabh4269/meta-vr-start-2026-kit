import {
  Object3D,
  PokeInteractable,
  RayInteractable,
  Vector3,
  type Entity,
  type UIKit,
  type UIKitMLAsset,
  type World,
} from '@iwsdk/core';

/**
 * Code-owned UIKit panels (public/ui/*.uikitml, registered in src/assets.ts):
 * SADAK's Errands HUD on the left of your table, the dialogue result row under
 * your line, the first-meeting card, the ride bar and the district finale.
 * Each visible panel is an IWSDK interactable (RayInteractable + PokeInteractable),
 * so its buttons take pokes and pinch-rays; hidden panels drop both components.
 */

type PanelName = 'hud' | 'actions' | 'intro' | 'ride' | 'finale';

interface Placed {
  panel: UIKitMLAsset;
  entity: Entity;
  /** faces the viewer each frame */
  face: boolean;
}

/** UIKit sizes are centimetres: scale = metres wide / (panel units / 100). */
const LAYOUT: Record<PanelName, { id: string; parent: 'anchor' | 'ui'; pos: [number, number, number]; scale: number; face: boolean }> = {
  hud: { id: 'hud-panel', parent: 'anchor', pos: [-0.66, 0.3, -0.24], scale: 0.06, face: true },
  actions: { id: 'actions-panel', parent: 'ui', pos: [0, 0.17, -0.47], scale: 0.065, face: true },
  intro: { id: 'intro-panel', parent: 'ui', pos: [0, 0.46, -0.8], scale: 0.09, face: true },
  ride: { id: 'ride-panel', parent: 'ui', pos: [0, 0.3, -0.62], scale: 0.07, face: true },
  finale: { id: 'finale-panel', parent: 'ui', pos: [0, 0.42, -0.78], scale: 0.095, face: true },
};

const BUTTONS: [PanelName, string][] = [
  ['actions', 'btn-continue'],
  ['actions', 'btn-retry'],
  ['actions', 'btn-hear'],
  ['ride', 'btn-skip'],
  ['finale', 'btn-explore'],
  ['finale', 'btn-district'],
];

export class Panels {
  loaded = false;
  private readonly placed = new Map<PanelName, Placed>();
  private readonly cleanups: (() => void)[] = [];
  private readonly v = new Vector3();

  constructor(
    private readonly world: World,
    private readonly anchorEntity: Entity,
    private readonly uiEntity: Entity,
  ) {}

  get hud(): UIKitMLAsset | undefined { return this.placed.get('hud')?.panel; }
  get actions(): UIKitMLAsset | undefined { return this.placed.get('actions')?.panel; }
  get intro(): UIKitMLAsset | undefined { return this.placed.get('intro')?.panel; }
  get ride(): UIKitMLAsset | undefined { return this.placed.get('ride')?.panel; }
  get finale(): UIKitMLAsset | undefined { return this.placed.get('finale')?.panel; }

  async load(): Promise<void> {
    try {
      await Promise.all(
        (Object.keys(LAYOUT) as PanelName[]).map(async (name) => {
          const l = LAYOUT[name];
          const panel = await this.world.assets.instantiate<UIKitMLAsset>(l.id);
          panel.scale.setScalar(l.scale);
          panel.position.set(...l.pos);
          panel.name = l.id;
          const entity = this.world.createTransformEntity(panel, {
            parent: l.parent === 'anchor' ? this.anchorEntity : this.uiEntity,
            persistent: true,
          });
          this.placed.set(name, { panel, entity, face: l.face });
          // runtime names so `xr list-targets` / run-sequence `press` can address the buttons
          for (const [p, id] of BUTTONS) if (p === name) {
            const el = panel.getElementById(id) as unknown as Object3D | undefined;
            if (el) el.name = id;
          }
          this.show(name, name === 'hud');
        }),
      );
      this.loaded = true;
    } catch (error) {
      console.error('[sadak] panel load failed', error);
    }
  }

  /** Listen for clicks (ray pinch, poke, mouse) on an element. */
  on(panel: UIKitMLAsset | undefined, id: string, fn: () => void): void {
    const el = panel?.getElementById(id) as unknown as { addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void } | undefined;
    if (!el?.addEventListener) return;
    el.addEventListener('click', fn);
    this.cleanups.push(() => el.removeEventListener?.('click', fn));
  }

  dispose(): void {
    for (const c of this.cleanups) c();
    this.cleanups.length = 0;
  }

  show(name: PanelName, on: boolean): void {
    const p = this.placed.get(name);
    if (!p) return;
    p.panel.visible = on;
    if (on && !p.entity.hasComponent(RayInteractable)) {
      p.entity.addComponent(RayInteractable);
      p.entity.addComponent(PokeInteractable);
    } else if (!on && p.entity.hasComponent(RayInteractable)) {
      p.entity.removeComponent(RayInteractable);
      p.entity.removeComponent(PokeInteractable);
    }
  }

  isShown(name: PanelName): boolean {
    return !!this.placed.get(name)?.panel.visible;
  }

  /** Turn visible panels toward the viewer (world-space head position). */
  face(headWorld: Vector3): void {
    for (const p of this.placed.values()) if (p.face && p.panel.visible) p.panel.lookAt(headWorld);
  }

  private text(panel: UIKitMLAsset | undefined, id: string, text: string): void {
    panel?.getElementById<UIKit.Text>(id)?.setProperties({ text });
  }

  private display(panel: UIKitMLAsset | undefined, id: string, on: boolean): void {
    panel?.getElementById(id)?.setProperties({ display: on ? 'flex' : 'none' });
  }

  /** SADAK's Errands card: ticks, the current errand highlighted, "{done} of {total}", cash and XP. */
  setErrands(rows: { done: boolean; now: boolean; note: string }[], cash: number, xp: number): void {
    const hud = this.hud;
    if (!hud) return;
    const done = rows.filter((r) => r.done).length;
    this.text(hud, 'count', done === rows.length ? 'All done' : `${done} of ${rows.length}`);
    hud.getElementById('fill')?.setProperties({ width: `${Math.round((done / rows.length) * 100)}%` });
    rows.forEach((r, i) => {
      this.display(hud, `done-${i}`, r.done);
      hud.getElementById(`row-${i}`)?.setProperties({ backgroundColor: r.now ? '#4a2f12' : 'rgba(0,0,0,0)' });
      if (r.done) this.text(hud, `sub-${i}`, r.note);
    });
    this.text(hud, 'cash', cash.toLocaleString('en-IN'));
    this.text(hud, 'xp', `${xp} XP`);
  }

  /** The result row: a status line, an optional "+N pts", and which buttons show. */
  setActions(status: string, points: string | null, show: { hear: boolean; retry: boolean; cont: boolean }): void {
    const a = this.actions;
    if (!a) return;
    this.text(a, 'status', status);
    this.display(a, 'points', points !== null);
    if (points !== null) this.text(a, 'points', points);
    this.display(a, 'btn-hear', show.hear);
    this.display(a, 'btn-retry', show.retry);
    this.display(a, 'btn-continue', show.cont);
  }

  setIntro(kicker: string, title: string, brief: string): void {
    this.text(this.intro, 'kicker', kicker);
    this.text(this.intro, 'title', title);
    this.text(this.intro, 'brief', brief);
  }

  setRide(label: string): void {
    this.text(this.ride, 'ride-label', label);
  }

  setFinale(earned: string): void {
    this.text(this.finale, 'earned', earned);
  }

  /** World positions of the visible buttons (dev logs for the emulator tests). */
  buttonPositions(): Record<string, number[]> {
    const out: Record<string, number[]> = {};
    for (const [name, id] of BUTTONS) {
      const p = this.placed.get(name);
      if (!p?.panel.visible) continue;
      const el = p.panel.getElementById(id) as unknown as Object3D | undefined;
      if (!el?.getWorldPosition) continue;
      el.updateWorldMatrix(true, false);
      out[id] = el.getWorldPosition(this.v).toArray().map((x) => +x.toFixed(3));
    }
    return out;
  }
}
