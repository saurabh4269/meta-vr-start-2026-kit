/**
 * Progress that gives a reason to come back: vendors remember you, a phrasebook
 * fills up, and a daily streak. Versioned localStorage, every access guarded.
 */

import type { ErrandId } from './content.js';
import type { ComfortLevel } from './levels.js';

const KEY = 'sadak-vr-save';
const VERSION = 1;

export interface VendorMemory {
  visits: number;
  /** ISO date of the last completed errand with this vendor. */
  last: string;
  /** Wrong cards picked on the last visit (shown as "you mixed up …" in the phrasebook). */
  slips: number;
}

export interface Save {
  version: number;
  vendors: Partial<Record<ErrandId, VendorMemory>>;
  /** Hindi phrases the player has said (card or voice), by Devanagari text. */
  phrases: string[];
  /** Phrases spoken aloud and scored ≥ 70%. */
  spoken: string[];
  days: string[];
  districtsDone: number;
  /** SADAK's comfort level: sets each errand's lesson tier by its place in the day. */
  comfort: ComfortLevel;
  /** SADAK's progress (api/progress): cash from errand rewards, XP from line points, completed errands. */
  cash: number;
  xp: number;
  completed: ErrandId[];
}

const fresh = (): Save => ({ version: VERSION, vendors: {}, phrases: [], spoken: [], days: [], districtsDone: 0, comfort: 'medium', cash: 0, xp: 0, completed: [] });

export function loadSave(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const s = JSON.parse(raw) as Save;
    if (s.version !== VERSION) return fresh();
    return { ...fresh(), ...s };
  } catch {
    return fresh();
  }
}

export function writeSave(s: Save): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode: progress lasts this session only */
  }
}

export const today = (d = new Date()): string => d.toISOString().slice(0, 10);

/** Consecutive days played, counting back from the most recent day in the list. */
export function streak(days: string[]): number {
  if (!days.length) return 0;
  const set = new Set(days);
  let n = 0;
  const d = new Date(`${[...days].sort().pop()}T12:00:00Z`);
  while (set.has(today(d))) {
    n++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}

export function markDay(s: Save, d = today()): void {
  if (!s.days.includes(d)) s.days.push(d);
  if (s.days.length > 60) s.days = s.days.slice(-60);
}

export function learn(s: Save, hi: string, spoken = false): boolean {
  let isNew = false;
  if (!s.phrases.includes(hi)) {
    s.phrases.push(hi);
    isNew = true;
  }
  if (spoken && !s.spoken.includes(hi)) s.spoken.push(hi);
  return isNew;
}

export function recordVisit(s: Save, id: ErrandId, slips: number, d = today()): void {
  const m = s.vendors[id] ?? { visits: 0, last: d, slips: 0 };
  m.visits++;
  m.last = d;
  m.slips = slips;
  s.vendors[id] = m;
}
