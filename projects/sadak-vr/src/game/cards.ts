import { CanvasTexture, Group, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from '@iwsdk/core';
import type { Line } from './content.js';
import type { WordVerdict } from './score.js';
import { FONT_BODY, FONT_DISPLAY, roundRect, wrap } from './text.js';

/**
 * Three-tier language cards drawn with Canvas2D (it shapes Devanagari; uikit can't):
 *   Devanagari (large) · romanisation · English meaning (small, muted).
 * Two kinds: the vendor's dialogue card, and the player's reply cards (pokeable).
 * Fit-to-card: each tier shrinks until it fits, never clipped.
 */

const INK = '#2a1606';
const PAPER = '#fbf1dc';
const SAFFRON = '#f08a1c';
const VERDICT: Record<WordVerdict, string> = { green: '#1f9d55', yellow: '#c98a00', red: '#d0342c' };

export type CardState = 'idle' | 'hover' | 'right' | 'wrong' | 'glow' | 'dim';

interface Tier {
  text: string;
  font: string;
  weight: number;
  size: number;
  color: string;
  colors?: string[]; // per-word colours
}

function fitTier(ctx: CanvasRenderingContext2D, t: Tier, maxW: number, maxLines: number): { lines: string[]; size: number } {
  let size = t.size;
  for (let i = 0; i < 16; i++) {
    ctx.font = `${t.weight} ${size}px ${t.font}`;
    const lines = wrap(ctx, t.text, maxW);
    if (lines.length <= maxLines && Math.max(...lines.map((l) => ctx.measureText(l).width)) <= maxW) return { lines, size };
    size *= 0.92;
  }
  ctx.font = `${t.weight} ${size}px ${t.font}`;
  return { lines: wrap(ctx, t.text, maxW), size };
}

/** Draw tiers centred vertically in [top, bottom]. Per-word colours only when the tier fits one line. */
function drawTiers(ctx: CanvasRenderingContext2D, tiers: Tier[], cx: number, top: number, bottom: number, maxW: number, gap: number): void {
  // fit each tier to the width, then shrink all tiers together until the block fits the height
  let scale = 1;
  let fitted = tiers.map((t) => ({ t, ...fitTier(ctx, t, maxW, 2) }));
  let heights = fitted.map((f) => f.lines.length * f.size * 1.22);
  let total = heights.reduce((a, b) => a + b, 0) + gap * (tiers.length - 1);
  for (let i = 0; i < 12 && total > bottom - top; i++) {
    scale *= 0.92;
    fitted = tiers.map((t) => ({ t, ...fitTier(ctx, { ...t, size: t.size * scale }, maxW, 2) }));
    heights = fitted.map((f) => f.lines.length * f.size * 1.22);
    total = heights.reduce((a, b) => a + b, 0) + gap * (tiers.length - 1);
  }
  let y = top + (bottom - top - total) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitted.forEach((f, i) => {
    ctx.font = `${f.t.weight} ${f.size}px ${f.t.font}`;
    f.lines.forEach((ln, j) => {
      const ly = y + (j + 0.5) * f.size * 1.22;
      if (f.t.colors && f.lines.length === 1) {
        const words = ln.split(' ');
        const space = ctx.measureText(' ').width;
        const widths = words.map((w) => ctx.measureText(w).width);
        let x = cx - (widths.reduce((a, b) => a + b, 0) + space * (words.length - 1)) / 2;
        ctx.textAlign = 'left';
        words.forEach((w, k) => {
          ctx.fillStyle = f.t.colors![k] ?? f.t.color;
          ctx.fillText(w, x, ly);
          x += widths[k] + space;
        });
        ctx.textAlign = 'center';
      } else {
        ctx.fillStyle = f.t.color;
        ctx.fillText(ln, cx, ly);
      }
    });
    y += heights[i] + gap;
  });
}

abstract class CanvasCard {
  readonly mesh: Mesh;
  protected readonly canvas = document.createElement('canvas');
  protected readonly ctx: CanvasRenderingContext2D;
  protected readonly texture: CanvasTexture;
  protected readonly material: MeshBasicMaterial;
  readonly width: number;
  readonly height: number;

  constructor(widthM: number, aspect: number, px = 1024) {
    this.width = widthM;
    this.height = widthM / aspect;
    this.canvas.width = px;
    this.canvas.height = Math.round(px / aspect);
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.minFilter = LinearFilter;
    this.texture.generateMipmaps = false;
    this.material = new MeshBasicMaterial({ map: this.texture, transparent: true, depthWrite: false, toneMapped: false });
    this.mesh = new Mesh(new PlaneGeometry(widthM, this.height), this.material);
    this.mesh.renderOrder = 12;
  }

  set opacity(v: number) {
    this.material.opacity = v;
    this.mesh.visible = v > 0.01;
  }

  get opacity(): number {
    return this.material.opacity;
  }
}

/** The vendor's line: speaker tag + Devanagari + romanisation + English. */
export class DialogueCard extends CanvasCard {
  private key = '';

  constructor(widthM = 0.5) {
    super(widthM, 2.35);
  }

  set(tag: string, line: Line, opts: { showMeaning?: boolean; note?: string } = {}): void {
    const k = `${tag}|${line.hi}|${opts.showMeaning}|${opts.note ?? ''}`;
    if (k === this.key) return;
    this.key = k;
    const { ctx, canvas } = this;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // speech bubble: cream paper, saffron rule, a tail pointing up toward the speaker
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    roundRect(ctx, 14, 40, W - 28, H - 64, 46);
    ctx.fillStyle = PAPER;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(W / 2 - 34, 42);
    ctx.lineTo(W / 2, 4);
    ctx.lineTo(W / 2 + 34, 42);
    ctx.closePath();
    ctx.fillStyle = PAPER;
    ctx.fill();
    roundRect(ctx, 14, 40, W - 28, H - 64, 46);
    ctx.lineWidth = 7;
    ctx.strokeStyle = SAFFRON;
    ctx.stroke();
    // tag chip
    if (tag) {
      ctx.font = `700 34px ${FONT_BODY}`;
      const tw = ctx.measureText(tag).width + 44;
      roundRect(ctx, 46, 22, tw, 50, 25);
      ctx.fillStyle = SAFFRON;
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(tag, 68, 48);
    }
    const tiers: Tier[] = [
      { text: line.hi, font: FONT_BODY, weight: 700, size: 104, color: INK },
      { text: line.ro, font: FONT_BODY, weight: 600, size: 52, color: '#7a4a1c' },
    ];
    if (opts.showMeaning !== false) tiers.push({ text: `“${line.en}”`, font: FONT_BODY, weight: 500, size: 42, color: '#6b6258' });
    if (opts.note) tiers.push({ text: opts.note, font: FONT_BODY, weight: 600, size: 38, color: '#b0560f' });
    drawTiers(ctx, tiers, W / 2, 84, H - 34, W - 120, 8);
    this.texture.needsUpdate = true;
  }
}

/** A reply the player can say by poking it. */
export class ReplyCard extends CanvasCard {
  readonly group = new Group();
  line: Line | null = null;
  correct = false;
  hint = '';
  state: CardState = 'idle';
  verdicts: WordVerdict[] | null = null;
  /** Animation: shake on wrong, pop on right. */
  shakeT = 0;
  popT = 0;
  hoverT = 0;
  previewed = false;
  private key = '';

  constructor(widthM = 0.17) {
    super(widthM, 1.75, 768);
    this.group.add(this.mesh);
  }

  setLine(line: Line, correct: boolean, hint = ''): void {
    this.line = line;
    this.correct = correct;
    this.hint = hint;
    this.verdicts = null;
    this.state = 'idle';
    this.shakeT = this.popT = this.hoverT = 0;
    this.previewed = false;
    this.redraw();
  }

  setState(s: CardState): void {
    if (s === this.state) return;
    this.state = s;
    this.redraw();
  }

  redraw(): void {
    if (!this.line) return;
    const k = `${this.line.hi}|${this.state}|${this.verdicts?.join(',') ?? ''}`;
    if (k === this.key) return;
    this.key = k;
    const { ctx, canvas } = this;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const s = this.state;
    const fill = s === 'right' ? '#e3f6e6' : s === 'wrong' ? '#fbe2df' : s === 'dim' ? 'rgba(240,228,205,0.55)' : PAPER;
    const rule = s === 'right' ? '#1f9d55' : s === 'wrong' ? '#d0342c' : s === 'glow' || s === 'hover' ? '#ffb000' : SAFFRON;
    ctx.save();
    ctx.shadowColor = s === 'glow' ? 'rgba(255,190,40,0.95)' : 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = s === 'glow' ? 40 : 14;
    ctx.shadowOffsetY = s === 'glow' ? 0 : 5;
    roundRect(ctx, 22, 22, W - 44, H - 44, 38);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
    roundRect(ctx, 22, 22, W - 44, H - 44, 38);
    ctx.lineWidth = s === 'hover' || s === 'glow' ? 12 : 7;
    ctx.strokeStyle = rule;
    ctx.stroke();
    // small speaker glyph: "touch lightly to hear, push through to say"
    ctx.fillStyle = s === 'dim' ? '#c8b48f' : '#d9821f';
    ctx.beginPath();
    ctx.moveTo(52, 66); ctx.lineTo(66, 66); ctx.lineTo(84, 50); ctx.lineTo(84, 98); ctx.lineTo(66, 82); ctx.lineTo(52, 82);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath(); ctx.arc(86, 74, 14, -0.9, 0.9); ctx.stroke();
    const ink = s === 'dim' ? '#9c8a70' : INK;
    const tiers: Tier[] = [
      {
        text: this.line.hi, font: FONT_BODY, weight: 700, size: 92, color: ink,
        colors: this.verdicts?.map((v) => VERDICT[v]),
      },
      { text: this.line.ro, font: FONT_BODY, weight: 600, size: 48, color: s === 'dim' ? '#a8916f' : '#7a4a1c', colors: this.verdicts?.map((v) => VERDICT[v]) },
      { text: this.line.en, font: FONT_BODY, weight: 500, size: 38, color: s === 'dim' ? '#b3a690' : '#6b6258' },
    ];
    drawTiers(ctx, tiers, W / 2, 70, H - 40, W - 110, 4);
    this.texture.needsUpdate = true;
  }
}

/** A floating instruction chip (goal, hints, totals). Plain sans, high contrast. */
export class Chip extends CanvasCard {
  private key = '';
  constructor(widthM = 0.3, aspect = 6) {
    super(widthM, aspect, 1024);
  }

  set(text: string, tone: 'goal' | 'hint' | 'good' | 'title' = 'goal'): void {
    const k = `${text}|${tone}`;
    if (k === this.key) return;
    this.key = k;
    const { ctx, canvas } = this;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (!text) {
      this.texture.needsUpdate = true;
      return;
    }
    const bg = tone === 'hint' ? 'rgba(120,40,10,0.92)' : tone === 'good' ? 'rgba(18,92,52,0.92)' : tone === 'title' ? 'rgba(30,12,4,0.72)' : 'rgba(26,16,8,0.86)';
    roundRect(ctx, 6, 6, W - 12, H - 12, (H - 12) / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = tone === 'title' ? 7 : 5;
    ctx.strokeStyle = tone === 'hint' ? '#ffb36b' : tone === 'good' ? '#7fe0a8' : SAFFRON;
    ctx.stroke();
    const fit = fitTier(ctx, { text, font: tone === 'title' ? FONT_DISPLAY : FONT_BODY, weight: tone === 'title' ? 400 : 600, size: H * (tone === 'title' ? 0.56 : 0.46), color: '#fff' }, W - H * 0.8, tone === 'title' ? 1 : 2);
    ctx.font = `${tone === 'title' ? 400 : 600} ${fit.size}px ${tone === 'title' ? FONT_DISPLAY : FONT_BODY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (tone === 'title') {
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = tone === 'title' ? '#ffe2a8' : '#fff7ea';
    const lh = fit.size * 1.18;
    fit.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, H / 2 + (i - (fit.lines.length - 1) / 2) * lh));
    ctx.shadowBlur = 0;
    this.texture.needsUpdate = true;
  }
}

/** SADAK's verdict colours (globals.css): green #00d696, yellow #ff7a05, red #fa2c37. */
const SADAK_VERDICT: Record<WordVerdict, string> = { green: '#00b07a', yellow: '#ff7a05', red: '#fa2c37' };

export type YouState = 'idle' | 'hover' | 'listening' | 'said';

/**
 * SADAK's "You" card (components/Dialogue.tsx): the line to say back as romanised words only
 * (one span per word, coloured green/yellow/red by the scorer after an attempt) and its
 * meaning; after an attempt, "You said: ...". Poke it to say it by hand.
 */
export class YouCard extends CanvasCard {
  readonly group = new Group();
  line: Line | null = null;
  state: YouState = 'idle';
  verdicts: WordVerdict[] | null = null;
  heard = '';
  popT = 0;
  hoverT = 0;
  private key = '';

  constructor(widthM = 0.34) {
    super(widthM, 2.6, 1024);
    this.group.add(this.mesh);
  }

  set(line: Line): void {
    this.line = line;
    this.verdicts = null;
    this.heard = '';
    this.state = 'idle';
    this.popT = 0;
    this.hoverT = 0;
    this.redraw();
  }

  setState(s: YouState): void {
    if (s === this.state) return;
    this.state = s;
    this.redraw();
  }

  redraw(): void {
    if (!this.line) return;
    const k = `${this.line.ro}|${this.state}|${this.verdicts?.join(',') ?? ''}|${this.heard}`;
    if (k === this.key) return;
    this.key = k;
    const { ctx, canvas } = this;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const s = this.state;
    const rule = s === 'listening' ? '#fa2c37' : s === 'hover' ? '#ffb000' : s === 'said' ? '#00b07a' : SAFFRON;
    ctx.save();
    ctx.shadowColor = s === 'hover' ? 'rgba(255,190,40,0.9)' : 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = s === 'hover' ? 36 : 14;
    ctx.shadowOffsetY = s === 'hover' ? 0 : 5;
    roundRect(ctx, 18, 18, W - 36, H - 36, 40);
    ctx.fillStyle = PAPER;
    ctx.fill();
    ctx.restore();
    roundRect(ctx, 18, 18, W - 36, H - 36, 40);
    ctx.lineWidth = s === 'idle' ? 7 : 12;
    ctx.strokeStyle = rule;
    ctx.stroke();
    // "YOU" chip
    ctx.font = `700 30px ${FONT_BODY}`;
    roundRect(ctx, 44, 40, 104, 46, 23);
    ctx.fillStyle = '#2a1606';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOU', 96, 64);
    if (s === 'listening') {
      ctx.fillStyle = '#fa2c37';
      ctx.textAlign = 'right';
      ctx.fillText('● listening', W - 48, 64);
    }
    const tiers: Tier[] = [
      { text: this.line.ro, font: FONT_BODY, weight: 700, size: 92, color: INK, colors: this.verdicts?.map((v) => SADAK_VERDICT[v]) },
      { text: this.line.en, font: FONT_BODY, weight: 500, size: 46, color: '#6b6258' },
    ];
    if (this.heard) tiers.push({ text: this.heard, font: FONT_BODY, weight: 600, size: 38, color: '#7a4a1c' });
    drawTiers(ctx, tiers, W / 2, 100, H - 40, W - 120, 10);
    this.texture.needsUpdate = true;
  }
}
