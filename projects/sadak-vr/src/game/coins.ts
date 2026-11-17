import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from '@iwsdk/core';

/**
 * Rupee coins you pinch from your pouch, carry, and drop on the vendor's brass
 * plate. Generic coin faces (a ₹ numeral and a lotus-like rosette), no state
 * emblems. Coins are ~1.25× real size so tracked fingers can pick them reliably.
 * All positions are in anchor-local space (table top = y 0, +Z toward the user).
 */

export interface HandIn {
  tracked: boolean;
  pinching: boolean;
  started: boolean;
  ended: boolean;
  /** pinch point, anchor-local */
  p: Vector3;
}

type CoinState = 'tray' | 'held' | 'falling' | 'plate' | 'gone' | 'off';

export interface Coin {
  mesh: Mesh;
  value: number;
  home: Vector3;
  pos: Vector3;
  vel: Vector3;
  state: CoinState;
  hand: number;
  spin: number;
  /** landing order on the plate (to hand back the coin that overpaid) */
  landed: number;
}

const R = 0.0175; // radius (27 mm coin × 1.3)
const T = 0.0035;
const GRAB_R = 0.04;
const PLATE_R = 0.1;

function face(value: number, ring: boolean): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const outer = ring ? '#d9b44a' : '#c9cdd2';
  const inner = ring ? '#cfd3d8' : '#d6b85a';
  g.fillStyle = outer;
  g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
  g.fillStyle = inner;
  g.beginPath(); g.arc(128, 128, 92, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(80,60,20,0.55)';
  g.lineWidth = 5;
  g.beginPath(); g.arc(128, 128, 118, 0, Math.PI * 2); g.stroke();
  // rosette ticks
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    g.beginPath();
    g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100);
    g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112);
    g.stroke();
  }
  g.fillStyle = '#3a2a10';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `700 ${value >= 10 ? 96 : 120}px 'Mukta', system-ui, sans-serif`;
  g.fillText(`₹${value}`, 128, 134);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export class Coins {
  readonly group = new Group();
  readonly coins: Coin[] = [];
  readonly pouch: Object3D;
  /** Sum on the plate. */
  plateTotal = 0;
  onClink: (big: boolean) => void = () => {};
  onPlate: (total: number) => void = () => {};
  private readonly plate = new Vector3();
  private readonly tmp = new Vector3();
  private active = false;
  private landings = 0;

  /** A pool of coins; each payment shows enough of them to cover the price with some to spare. */
  constructor(denoms: number[] = [10, 10, 10, 20, 20, 20, 20, 20, 20, 20]) {
    this.group.name = 'coins';
    const side10 = new MeshStandardMaterial({ color: 0xc9b06a, metalness: 0.85, roughness: 0.32 });
    const side20 = new MeshStandardMaterial({ color: 0xd7b752, metalness: 0.85, roughness: 0.3 });
    const geo10 = new CylinderGeometry(R, R, T, 32);
    const geo20 = new CylinderGeometry(R, R, T, 12); // the ₹20 coin is twelve-sided
    const top10 = new MeshStandardMaterial({ map: face(10, true), metalness: 0.7, roughness: 0.35 });
    const top20 = new MeshStandardMaterial({ map: face(20, false), metalness: 0.7, roughness: 0.35 });
    // a red cloth (rumaal) the coins are laid out on, in one left-to-right row:
    // IWSDK's near grab takes the coin nearest your PALM, so a row across your reach
    // keeps the coin under your fingers the one you get
    const pouchMat = new MeshStandardMaterial({ color: 0x8c1d3a, roughness: 0.9 });
    const pouch = new Mesh(new BoxGeometry(1, 0.006, 0.075), pouchMat);
    pouch.name = 'coin-pouch';
    this.pouch = pouch;
    this.group.add(pouch);
    denoms.forEach((v, i) => {
      const m = new Mesh(v === 20 ? geo20 : geo10, [v === 20 ? side20 : side10, v === 20 ? top20 : top10, v === 20 ? side20 : side10]);
      m.name = `coin-${v}-${i}`;
      m.castShadow = true;
      this.group.add(m);
      this.coins.push({ mesh: m, value: v, home: new Vector3(), pos: new Vector3(), vel: new Vector3(), state: 'tray', hand: -1, spin: Math.random() * 6, landed: 0 });
    });
    this.setVisible(false);
  }

  /** Lay the coins out on the pouch at `at` (anchor-local), plate centre at `plate`. */
  reset(at: Vector3, plate: Vector3, amount = 40): void {
    this.plate.copy(plate);
    this.plateTotal = 0;
    this.landings = 0;
    // twenties to cover the price, and two tens for change-making and mistakes
    let twenties = Math.min(7, Math.ceil(amount / 20));
    let tens = 2;
    const shown = this.coins.filter((c) => (c.value === 20 ? twenties-- > 0 : tens-- > 0));
    for (const c of this.coins) if (!shown.includes(c)) {
      c.state = 'off';
      c.mesh.visible = false;
    }
    const n = shown.length;
    const gap = 0.07;
    this.pouch.scale.x = n * gap + 0.03;
    this.pouch.position.set(at.x + ((n - 1) * gap) / 2, 0.003, at.z);
    shown.forEach((c, i) => {
      c.home.set(at.x + i * gap, 0.006 + T / 2, at.z);
      c.pos.copy(c.home);
      c.vel.set(0, 0, 0);
      c.state = 'tray';
      c.hand = -1;
      c.mesh.position.copy(c.pos);
      c.mesh.rotation.set(0, c.spin, 0);
      c.mesh.visible = true;
    });
  }

  setVisible(v: boolean): void {
    this.active = v;
    this.group.visible = v;
  }

  get visible(): boolean {
    return this.active;
  }

  /** Coins currently on the plate (for the vendor to take). */
  sweepPlate(): void {
    for (const c of this.coins) if (c.state === 'plate') c.state = 'gone';
  }

  /** Return the most recently placed plate coin (overpaid). */
  returnLast(): void {
    let last: Coin | null = null;
    for (const c of this.coins) if (c.state === 'plate' && (!last || c.landed > last.landed)) last = c;
    if (!last) return;
    last.state = 'falling';
    last.pos.y += 0.02;
    last.vel.set(0.15, 0.9, 0.55); // tossed back toward you
    this.recount();
  }

  private recount(): void {
    let t = 0;
    for (const c of this.coins) if (c.state === 'plate') t += c.value;
    if (t !== this.plateTotal) {
      this.plateTotal = t;
      this.onPlate(t);
    }
  }

  /** IWSDK's GrabSystem picked coin `i` up (Grabbed added). */
  grabStart(i: number): void {
    const c = this.coins[i];
    if (!c || c.state === 'off' || c.state === 'gone') return;
    const wasPlate = c.state === 'plate';
    c.state = 'held';
    if (wasPlate) this.recount();
  }

  /** The hand let go (Grabbed removed): the coin falls from where it is. */
  grabEnd(i: number): void {
    const c = this.coins[i];
    if (!c || c.state !== 'held') return;
    c.pos.copy(c.mesh.position);
    c.vel.set(0, 0, 0);
    c.state = 'falling';
  }

  /** Whether coin `i` should be grabbable right now. */
  grabbable(i: number): boolean {
    const st = this.coins[i]?.state;
    return this.active && (st === 'tray' || st === 'plate' || st === 'held');
  }

  update(dt: number): void {
    if (!this.active) return;
    // falling / landing
    for (const c of this.coins) {
      if (c.state === 'off') continue;
      if (c.state === 'falling') {
        c.vel.y -= 9.8 * dt;
        c.pos.addScaledVector(c.vel, dt);
        c.vel.x *= 0.96;
        c.vel.z *= 0.96;
        const onPlate = Math.hypot(c.pos.x - this.plate.x, c.pos.z - this.plate.z) < PLATE_R;
        const floor = onPlate ? 0.014 + T / 2 + this.stackOn(c) : T / 2;
        if (c.pos.y <= floor) {
          c.pos.y = floor;
          const off = Math.abs(c.pos.x) > 0.6 || c.pos.z > 0.45 || c.pos.z < -0.6;
          if (off) {
            // fell off the counter: it rolls back into your pouch
            c.pos.copy(c.home);
            c.state = 'tray';
          } else {
            c.state = onPlate ? 'plate' : 'tray';
            if (onPlate) c.landed = ++this.landings;
            if (onPlate) {
              // settle it into the plate
              this.tmp.set(c.pos.x - this.plate.x, 0, c.pos.z - this.plate.z);
              if (this.tmp.length() > PLATE_R * 0.6) this.tmp.setLength(PLATE_R * 0.6);
              c.pos.x = this.plate.x + this.tmp.x;
              c.pos.z = this.plate.z + this.tmp.z;
            } else c.home.copy(c.pos);
          }
          this.onClink(c.value >= 20);
          this.recount();
        }
      }
      if (c.state === 'gone') {
        // slide toward the vendor and vanish
        c.pos.z -= dt * 0.6;
        c.pos.y += dt * 0.15;
        if (c.pos.z < this.plate.z - 0.3) c.mesh.visible = false;
      }
      if (c.state === 'held') {
        c.pos.copy(c.mesh.position); // the GrabSystem moves the mesh
        continue;
      }
      c.mesh.position.copy(c.pos);
      c.mesh.rotation.set(0, c.spin, 0);
    }
  }

  /** Small vertical offset so coins on the plate stack instead of interpenetrating. */
  private stackOn(c: Coin): number {
    let n = 0;
    for (const o of this.coins) if (o !== c && o.state === 'plate' && o.pos.distanceTo(c.pos) < R * 1.6) n++;
    return n * T;
  }

  /** World-space positions for tests: coin centres. */
  positions(out: { v: number; p: number[] }[], toWorld: (v: Vector3) => Vector3): void {
    out.length = 0;
    for (const c of this.coins) {
      if (c.state === 'gone' || c.state === 'off') continue;
      const w = toWorld(this.tmp.copy(c.pos));
      out.push({ v: c.value, p: [+w.x.toFixed(3), +w.y.toFixed(3), +w.z.toFixed(3)] });
    }
  }
}
