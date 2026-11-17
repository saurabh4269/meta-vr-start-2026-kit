/**
 * The street's single texture atlas, painted with Canvas2D at build time.
 *
 * Signboards adapted from SADAK (game_engine/lib/game/signage.ts: enamel
 * board palette, painted inset border, local script large with a small
 * English line; facade painting after props.ts `facadeTexture`; authors
 * ahmedfahim21, Parth Mittal, Apoorva Agrawal, Mardav Gandhi; reused with
 * permission). Everything that needs a picture shares this one 2048² canvas,
 * so signs, distant facades, paving, the masjid's prayer hall and the clouds
 * cost one texture. Flat-coloured geometry samples the white block at the
 * top-left (kit.ts WHITE_UV).
 *
 * Devanagari is shaped by the browser's canvas text. The atlas paints with
 * whatever face is available and repaints once when web fonts finish loading
 * (the director loads Mukta / Tiro Devanagari Hindi / Rozha One).
 */

import { CanvasTexture, LinearMipmapLinearFilter, SRGBColorSpace } from '@iwsdk/core';
import { mulberry32, type UvRect } from './kit.js';

const SIZE = 2048;

export const SIGN_FONT = `'Rozha One', 'Tiro Devanagari Hindi', 'Mukta', 'Noto Sans Devanagari', 'Lohit Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif`;
const LATIN_FONT = `'Mukta', 'Noto Sans', system-ui, sans-serif`;

/** Board texts: [Devanagari, small Latin line, background, lettering]. */
export const SIGNS: Record<string, [string, string, string, string]> = {
  kachori: ['कचौड़ी भंडार', 'KACHORI BHANDAR', '#e8601a', '#fff4d6'],
  flowers: ['फूल माला', 'PHOOL MALA', '#c8273d', '#fff1c2'],
  chai: ['कड़क चाय', 'CHAI', '#f2c230', '#7a1a12'],
  mandir: ['मंदिर', '', '#f7f1e1', '#b3261e'],
  s0: ['किराना स्टोर', 'KIRANA STORE', '#1f4e9c', '#ffffff'],
  s1: ['मिठाई भंडार', 'SWEETS', '#f7f1e1', '#b3261e'],
  s2: ['भोजनालय', 'RESTAURANT', '#1d7a46', '#fff8e0'],
  s3: ['दर्ज़ी', 'TAILORS', '#262a33', '#f5c542'],
  s4: ['साड़ी केंद्र', 'SAREES', '#7a2a6e', '#fff1f7'],
  s5: ['बर्तन भंडार', 'UTENSILS', '#c8272d', '#fff4d6'],
  s6: ['चूड़ी वाला', 'BANGLES', '#e8702a', '#ffffff'],
  s7: ['मसाले', 'SPICES', '#f2c230', '#8a1a1a'],
  s8: ['मेडिकल स्टोर', 'MEDICAL STORE', '#f7f1e1', '#1d6a3a'],
  s9: ['बेकरी', 'BAKERY', '#1f4e9c', '#fff1c2'],
  s10: ['जूते चप्पल', 'FOOTWEAR', '#1d7a46', '#ffffff'],
  s11: ['पान भंडार', 'PAAN', '#c8272d', '#ffffff'],
  s12: ['इत्र', 'ATTAR', '#262a33', '#f5c542'],
  s13: ['पराँठे वाली गली', '', '#f2c230', '#7a1a12'],
  s14: ['कपड़ा मार्केट', 'CLOTH', '#e8702a', '#fff8e0'],
  s15: ['मोबाइल रिपेयर', 'MOBILE REPAIR', '#7a2a6e', '#ffffff'],
  paranthe: ['पराँठे वाले', 'PARANTHE WALE · SINCE 1872', '#7a1a12', '#ffd23f'],
  busstop: ['लाल क़िला', 'BUS STOP', '#1d7a46', '#ffffff'],
  route: ['कश्मीरी गेट', '', '#14161b', '#ffb21a'],
  ticket: ['टिकट', 'TICKETS', '#f7f1e1', '#1d6a3a'],
};
export const GENERIC_SIGNS = Object.keys(SIGNS).filter((k) => k.startsWith('s'));

/** District building palette (districts.ts puraniSadak.theme.buildings). */
export const WALLS = [0xf2e3c4, 0xf5c53a, 0xe0722f, 0x8fc9a6, 0xf28fa0, 0xfaeecd, 0xe89b62];

export type Atlas = {
  texture: CanvasTexture;
  rect(name: string): UvRect;
  /** Repaint text once fonts arrive (called automatically). */
  repaint(): void;
};

type Cell = { x: number; y: number; w: number; h: number; paint: (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void };

const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;

function shade(n: number, k: number): string {
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, start: number, maxW: number, stack: string, weight = '400'): number {
  let size = start;
  ctx.font = `${weight} ${size}px ${stack}`;
  while (size > 12 && ctx.measureText(text).width > maxW) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${stack}`;
  }
  return size;
}

function paintSign(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: [string, string, string, string]) {
  const [native, en, bg, fg] = s;
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  // A little sun-fade over the top half, and a darker lower edge: enamel boards age.
  const gr = ctx.createLinearGradient(0, y, 0, y + h);
  gr.addColorStop(0, 'rgba(255,255,255,0.10)');
  gr.addColorStop(0.55, 'rgba(255,255,255,0)');
  gr.addColorStop(1, 'rgba(60,20,0,0.18)');
  ctx.fillStyle = gr;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 6;
  ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const big = en ? 0.42 : 0.5;
  fitFont(ctx, native, Math.round(h * 0.56), w - 70, SIGN_FONT, '400');
  ctx.fillText(native, x + w / 2, y + h * big);
  if (en) {
    fitFont(ctx, en, Math.round(h * 0.17), w - 120, LATIN_FONT, '700');
    ctx.fillText(en, x + w / 2, y + h * 0.82);
  }
}

/** One storey of a facade, 8 m x 3.2 m: arched windows, frames, a balcony. */
function paintFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wall: number, variant: number) {
  const rand = mulberry32(wall + variant * 977);
  ctx.fillStyle = hex(wall);
  ctx.fillRect(x, y, w, h);
  // Floor ledge (bottom) and a thin cornice line.
  ctx.fillStyle = '#f6efe2';
  ctx.fillRect(x, y + h - 9, w, 9);
  ctx.fillStyle = shade(wall, 0.72);
  ctx.fillRect(x, y + h - 12, w, 3);
  const n = 3;
  for (let i = 0; i < n; i++) {
    const cx = x + (w * (i + 0.5)) / n;
    const ww = 34;
    const top = y + 30;
    const bot = y + h - 30;
    // White surround with a pointed (mughal) head.
    ctx.fillStyle = '#f8f3ea';
    ctx.beginPath();
    ctx.moveTo(cx - ww / 2 - 7, bot + 5);
    ctx.lineTo(cx - ww / 2 - 7, top + 10);
    ctx.quadraticCurveTo(cx - ww / 2 - 7, top - 12, cx, top - 20);
    ctx.quadraticCurveTo(cx + ww / 2 + 7, top - 12, cx + ww / 2 + 7, top + 10);
    ctx.lineTo(cx + ww / 2 + 7, bot + 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rand() > 0.3 ? '#3d5a73' : '#2a3442';
    ctx.beginPath();
    ctx.moveTo(cx - ww / 2, bot);
    ctx.lineTo(cx - ww / 2, top + 10);
    ctx.quadraticCurveTo(cx - ww / 2, top - 5, cx, top - 12);
    ctx.quadraticCurveTo(cx + ww / 2, top - 5, cx + ww / 2, top + 10);
    ctx.lineTo(cx + ww / 2, bot);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f8f3ea';
    ctx.fillRect(cx - 1.5, top - 6, 3, bot - top + 6);
    ctx.fillRect(cx - ww / 2, top + 22, ww, 3);
    // Sill.
    ctx.fillStyle = '#efe6d6';
    ctx.fillRect(cx - ww / 2 - 10, bot + 4, ww + 20, 6);
    if (rand() > 0.6) {
      // AC box under the sill.
      ctx.fillStyle = '#e4e0d6';
      ctx.fillRect(cx + 6, bot + 12, 22, 12);
      ctx.fillStyle = '#5a5f66';
      ctx.fillRect(cx + 9, bot + 15, 8, 6);
    }
  }
  if (variant % 2 === 1) {
    // Balcony rail across the middle bay, with laundry.
    const bx = x + w / 3 - 8;
    const bw = w / 3 + 16;
    ctx.fillStyle = '#2b2b30';
    ctx.fillRect(bx, y + h - 46, bw, 4);
    for (let k = 0; k <= 10; k++) ctx.fillRect(bx + (k * bw) / 10 - 1, y + h - 46, 2.5, 34);
    const cols = ['#d8342c', '#2c7bd1', '#f2b631', '#2aa36b', '#f06aa0', '#ffffff'];
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = cols[Math.floor(rand() * cols.length)];
      ctx.fillRect(bx + 8 + k * 26, y + h - 44, 18, 20 + rand() * 8);
    }
  }
}

/** Ground floor of a distant terrace: open shop bays and a signboard band. */
function paintShops(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wall: number, variant: number) {
  const rand = mulberry32(wall * 3 + variant);
  ctx.fillStyle = hex(wall);
  ctx.fillRect(x, y, w, h);
  const boards = ['#c8272d', '#1f4e9c', '#f2c230', '#1d7a46', '#e8702a', '#7a2a6e', '#f7f1e1'];
  for (let i = 0; i < 3; i++) {
    const bx = x + 8 + i * ((w - 16) / 3);
    const bw = (w - 16) / 3 - 10;
    ctx.fillStyle = boards[Math.floor(rand() * boards.length)];
    ctx.fillRect(bx, y + 8, bw, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(bx + 10, y + 16, bw - 20, 5);
    ctx.fillStyle = '#2c211c';
    ctx.fillRect(bx, y + 36, bw, h - 40);
    // Stock: little coloured blocks on shelves.
    const stock = ['#e63b2e', '#f7c52b', '#2f9e44', '#2266c4', '#f08a24', '#d6336c', '#e8c36a', '#c9ced3'];
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 6; k++) {
        ctx.fillStyle = stock[Math.floor(rand() * stock.length)];
        ctx.fillRect(bx + 4 + k * (bw / 6), y + 46 + r * 22, bw / 6 - 4, 12);
      }
    }
    // Awning stripe.
    ctx.fillStyle = ['#f0392b', '#1fbf6b', '#ff8c1a'][Math.floor(rand() * 3)];
    ctx.fillRect(bx - 3, y + 32, bw + 6, 7);
  }
}

export const STOCK_KINDS = ['grocer', 'cloth', 'steel', 'general', 'bangles', 'sweets'] as const;
export type StockKind = (typeof STOCK_KINDS)[number];

/** The back of an open shop, seen past the shutter: shelves of stock. */
function paintStock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, kind: StockKind) {
  const rand = mulberry32(kind.length * 131 + 7);
  ctx.fillStyle = '#2c211c';
  ctx.fillRect(x, y, w, h);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)];
  const PACK = ['#e63b2e', '#f7c52b', '#2f9e44', '#2266c4', '#f08a24', '#d6336c', '#f2efe6'];
  const GRAIN = ['#e8c36a', '#d9a441', '#b5651d', '#c0392b', '#f2d27a', '#8b5a2b', '#f4e6c4'];
  const CLOTH = ['#c2185b', '#f5a623', '#1f6f5c', '#3b4ba8', '#e8364f', '#7b2d8b', '#f2efe6', '#2f9e44'];
  const BANG = ['#d7263d', '#1b9e5a', '#e8b923', '#e0457b', '#2a6fdb', '#8e44ad'];
  const rows = 4;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    const sy = y + (r + 1) * rh - 8;
    let cx = x + 6;
    while (cx < x + w - 14) {
      if (kind === 'grocer') {
        const jw = 18 + rand() * 6;
        const jh = rh * (0.5 + rand() * 0.2);
        ctx.fillStyle = pick(GRAIN);
        ctx.fillRect(cx, sy - jh, jw, jh);
        ctx.fillStyle = rand() < 0.5 ? '#d62828' : '#2266c4';
        ctx.fillRect(cx - 1, sy - jh - 5, jw + 2, 6);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(cx + 3, sy - jh + 3, 3, jh - 6);
        cx += jw + 5;
      } else if (kind === 'cloth') {
        const bw = 28 + rand() * 8;
        const n = 3 + Math.floor(rand() * 3);
        for (let k = 0; k < n; k++) {
          ctx.fillStyle = pick(CLOTH);
          ctx.fillRect(cx, sy - (k + 1) * 9, bw, 8);
        }
        cx += bw + 4;
      } else if (kind === 'steel') {
        const pw = 20 + rand() * 14;
        const ph = rh * (0.3 + rand() * 0.35);
        ctx.fillStyle = '#c9ced3';
        ctx.fillRect(cx, sy - ph, pw, ph);
        ctx.fillStyle = '#eef1f3';
        ctx.fillRect(cx + 3, sy - ph + 2, 4, ph - 4);
        ctx.fillStyle = '#8e959b';
        ctx.fillRect(cx - 2, sy - ph - 3, pw + 4, 4);
        cx += pw + 5;
      } else if (kind === 'bangles') {
        for (let k = 0; k < 4; k++) {
          ctx.fillStyle = pick(BANG);
          ctx.fillRect(cx + k * 5, sy - rh * 0.7, 4, rh * 0.7);
        }
        cx += 24;
      } else if (kind === 'sweets') {
        ctx.fillStyle = '#c9ced3';
        ctx.fillRect(cx, sy - 6, 40, 6);
        ctx.fillStyle = pick(['#f5a623', '#f4efe4', '#e8702a', '#ffd23f', '#8b5a2b', '#e8364f']);
        ctx.beginPath();
        ctx.ellipse(cx + 20, sy - 8, 17, 7, 0, Math.PI, 0);
        ctx.fill();
        cx += 46;
      } else {
        const bw = 12 + rand() * 14;
        const bh = rh * (0.35 + rand() * 0.4);
        ctx.fillStyle = pick(PACK);
        ctx.fillRect(cx, sy - bh, bw, bh);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(cx + 2, sy - bh + 4, bw - 4, 3);
        cx += bw + 3;
      }
    }
    // The shelf board.
    ctx.fillStyle = '#7a5537';
    ctx.fillRect(x, sy, w, 7);
  }
  // A warm tube light glow at the top.
  const gr = ctx.createLinearGradient(0, y, 0, y + h * 0.4);
  gr.addColorStop(0, 'rgba(255,240,200,0.25)');
  gr.addColorStop(1, 'rgba(255,240,200,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(x, y, w, h * 0.4);
}

/** Red-sandstone prayer hall: marble-framed arched bays and the pishtaq. */
function paintHall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#b5563a';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#f1ece2';
  ctx.fillRect(x, y, w, 10);
  ctx.fillRect(x, y + h - 12, w, 12);
  const bays = 11;
  for (let i = 0; i < bays; i++) {
    const cx = x + (w * (i + 0.5)) / bays;
    const mid = i === (bays - 1) / 2;
    const ww = mid ? 54 : 40;
    const top = mid ? y + 30 : y + 70;
    const bot = y + h - 16;
    ctx.fillStyle = '#f1ece2';
    ctx.fillRect(cx - ww / 2 - 9, top - 22, ww + 18, bot - top + 22);
    ctx.fillStyle = '#3a2c26';
    ctx.beginPath();
    ctx.moveTo(cx - ww / 2, bot);
    ctx.lineTo(cx - ww / 2, top + 14);
    ctx.quadraticCurveTo(cx - ww / 2, top - 6, cx, top - 16);
    ctx.quadraticCurveTo(cx + ww / 2, top - 6, cx + ww / 2, top + 14);
    ctx.lineTo(cx + ww / 2, bot);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f1ece2';
    ctx.fillRect(cx + (w / bays) / 2 - 3, y + 10, 6, h - 20);
  }
}

/** A pishtaq: red sandstone, a marble frame, the tall pointed arch, roundels. */
function paintGate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#b5563a';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#f1ece2';
  ctx.fillRect(x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.92);
  ctx.fillStyle = '#b5563a';
  ctx.fillRect(x + w * 0.15, y + h * 0.12, w * 0.7, h * 0.88);
  const cx = x + w / 2;
  const top = y + h * 0.3;
  const aw = w * 0.42;
  ctx.fillStyle = '#f1ece2';
  ctx.beginPath();
  ctx.moveTo(cx - aw / 2 - 8, y + h);
  ctx.lineTo(cx - aw / 2 - 8, top + 20);
  ctx.quadraticCurveTo(cx - aw / 2 - 8, top - 22, cx, top - 40);
  ctx.quadraticCurveTo(cx + aw / 2 + 8, top - 22, cx + aw / 2 + 8, top + 20);
  ctx.lineTo(cx + aw / 2 + 8, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2c26';
  ctx.beginPath();
  ctx.moveTo(cx - aw / 2, y + h);
  ctx.lineTo(cx - aw / 2, top + 20);
  ctx.quadraticCurveTo(cx - aw / 2, top - 14, cx, top - 30);
  ctx.quadraticCurveTo(cx + aw / 2, top - 14, cx + aw / 2, top + 20);
  ctx.lineTo(cx + aw / 2, y + h);
  ctx.closePath();
  ctx.fill();
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#f1ece2';
    ctx.beginPath();
    ctx.arc(cx + s * w * 0.31, y + h * 0.22, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1f1a17';
  ctx.fillRect(cx - w * 0.2, y + h * 0.14, w * 0.4, 10);
}

function paintPaving(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, line: string, rows: number, cols: number, seed: number) {
  const rand = mulberry32(seed);
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? w / cols / 2 : 0;
    for (let c = -1; c < cols; c++) {
      const bx = x + off + (c * w) / cols;
      const v = 0.94 + rand() * 0.1;
      ctx.fillStyle = `rgba(${v > 1 ? 255 : 0},${v > 1 ? 240 : 0},${v > 1 ? 220 : 0},${Math.abs(v - 1) * 0.9})`;
      ctx.fillRect(Math.max(x, bx), y + r * rh, Math.min(w / cols, x + w - Math.max(x, bx)), rh);
    }
  }
  ctx.strokeStyle = line;
  ctx.lineWidth = 2;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(x, y + r * rh);
    ctx.lineTo(x + w, y + r * rh);
    ctx.stroke();
  }
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? w / cols / 2 : 0;
    for (let c = 0; c <= cols; c++) {
      const bx = x + off + (c * w) / cols;
      if (bx <= x || bx >= x + w) continue;
      ctx.beginPath();
      ctx.moveTo(bx, y + r * rh);
      ctx.lineTo(bx, y + (r + 1) * rh);
      ctx.stroke();
    }
  }
}

/** Cumulus mask (fx/sky.ts getCloudTexture), white on transparent. */
function paintCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) {
  const rand = mulberry32(seed);
  const base = y + h * 0.78;
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const cx = x + w * (0.1 + t * 0.8) + (rand() - 0.5) * 20;
    const hump = Math.sin(t * Math.PI);
    const r = (h / 192) * (22 + hump * 52 + rand() * 18);
    const cy = base - r * (0.35 + hump * 0.35);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.clearRect(x, base, w, y + h - base);
  ctx.fillRect(x + w * 0.12, base - 8, w * 0.76, 8);
}

export function createAtlas(): Atlas {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const cells = new Map<string, Cell>();
  const add = (name: string, x: number, y: number, w: number, h: number, paint: Cell['paint']) => cells.set(name, { x, y, w, h, paint });

  add('white', 0, 0, 64, 64, (c, x, y, w, h) => {
    c.fillStyle = '#fff';
    c.fillRect(x, y, w, h);
  });
  // Signs: 2 columns x 12 rows of 512 x 128 under the white block.
  Object.keys(SIGNS).forEach((k, i) => {
    add(`sign:${k}`, (i % 2) * 512, 64 + Math.floor(i / 2) * 128, 512, 128, (c, x, y, w, h) => paintSign(c, x, y, w, h, SIGNS[k]));
  });
  // Facade storeys and shop floors: x 1024..2048, 256 x 128 cells.
  WALLS.forEach((wall, i) => {
    for (let v = 0; v < 2; v++) {
      const cell = i * 3 + v;
      add(`floor:${i}:${v}`, 1024 + (cell % 4) * 256, Math.floor(cell / 4) * 128, 256, 128, (c, x, y, w, h) => paintFloor(c, x, y, w, h, wall, v));
    }
    const cell = i * 3 + 2;
    add(`shops:${i}`, 1024 + (cell % 4) * 256, Math.floor(cell / 4) * 128, 256, 128, (c, x, y, w, h) => paintShops(c, x, y, w, h, wall, i));
  });
  add('hall', 0, 1600, 1024, 256, paintHall);
  STOCK_KINDS.forEach((k, i) => add(`stock:${k}`, 1024 + (i % 4) * 256, 768 + Math.floor(i / 4) * 256, 256, 256, (c, x, y, w, h) => paintStock(c, x, y, w, h, k)));
  add('paving', 1024, 1536, 256, 256, (c, x, y, w, h) => paintPaving(c, x, y, w, h, '#b9543a', 'rgba(90,30,20,0.55)', 10, 5, 11));
  add('pavement', 1280, 1536, 256, 256, (c, x, y, w, h) => paintPaving(c, x, y, w, h, '#d9c9a8', 'rgba(120,100,70,0.5)', 4, 4, 12));
  add('median', 1536, 1536, 256, 256, (c, x, y, w, h) => paintPaving(c, x, y, w, h, '#cfc3ad', 'rgba(110,95,70,0.5)', 3, 2, 13));
  add('gate', 1792, 1536, 256, 256, paintGate);
  // Old Delhi lane setts and tarmac (1024..1536 x 1280..1536 was free).
  add('setts', 1024, 1280, 256, 256, (c, x, y, w, h) => paintPaving(c, x, y, w, h, '#b3a48c', 'rgba(70,60,45,0.45)', 8, 8, 14));
  add('tarmac', 1280, 1280, 256, 256, (c, x, y, w, h) => {
    const rand = mulberry32(15);
    c.fillStyle = '#5a5650';
    c.fillRect(x, y, w, h);
    for (let i = 0; i < 260; i++) {
      c.fillStyle = rand() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
      c.fillRect(x + rand() * w, y + rand() * h, 2 + rand() * 5, 2 + rand() * 5);
    }
  });
  add('shadow', 1536, 1984, 64, 64, (c, x, y, w, h) => {
    // Soft contact shadow: alpha falls off from the centre (colour is black).
    const g = c.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.85)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.clearRect(x, y, w, h);
    c.fillStyle = g;
    c.fillRect(x, y, w, h);
  });
  add('cloud0', 1024, 1792, 512, 192, (c, x, y, w, h) => paintCloud(c, x, y, w, h, 8812));
  add('cloud1', 1536, 1792, 512, 192, (c, x, y, w, h) => paintCloud(c, x, y, w, h, 4471));

  const paintAll = () => {
    ctx.clearRect(0, 0, SIZE, SIZE);
    // Everything outside a cell is mid-grey, so any bleed reads as dirt, not neon.
    ctx.fillStyle = '#8a8070';
    ctx.fillRect(0, 0, SIZE, 1790);
    for (const c of cells.values()) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(c.x, c.y, c.w, c.h);
      ctx.clip();
      c.paint(ctx, c.x, c.y, c.w, c.h);
      ctx.restore();
    }
  };
  paintAll();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.name = 'street-atlas';

  const repaint = () => {
    paintAll();
    texture.needsUpdate = true;
  };
  if (typeof document !== 'undefined' && document.fonts) {
    // Fonts the director loads later (Mukta, Rozha One...) arrive as
    // 'loadingdone'; repaint each time, it costs a few ms.
    document.fonts.addEventListener('loadingdone', repaint);
    void document.fonts.ready.then(repaint);
  }

  return {
    texture,
    repaint,
    rect(name) {
      const c = cells.get(name);
      if (!c) throw new Error(`[world/atlas] no cell ${name}`);
      // Inset by 2 px so mip bleed stays inside the cell.
      const i = 2;
      return [(c.x + i) / SIZE, 1 - (c.y + c.h - i) / SIZE, (c.x + c.w - i) / SIZE, 1 - (c.y + i) / SIZE];
    },
  };
}
