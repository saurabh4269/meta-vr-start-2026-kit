/**
 * Errands for Chandni Chowk (Purani Sadak), Hindi.
 *
 * Everything the player reads or hears follows SADAK: its six Purani Sadak
 * errands in pack order (tasks.ts), their titles, briefs, rewards and
 * completion notes, the lesson steps at all three levels (lessons-hindi.ts,
 * verbatim) and the per-errand level ramp (levels.ts).
 * New for the VR port: the return-visit line (SADAK writes it live with
 * sarvam-105b), and the physical actions (pay, pick, serve, hail) that are
 * inferred from the lines themselves.
 *
 * Pure data and pure functions: no three.js, no DOM (unit-tested in node).
 */

import { LESSONS, type LessonLine, type LessonTier } from './lessons-hindi.js';
import { lessonTierFor, type ComfortLevel } from './levels.js';

export interface Line {
  hi: string;
  ro: string;
  en: string;
}

export type Action =
  | { kind: 'pay'; amount: number } // drop coins totalling `amount` on the vendor's plate
  | { kind: 'pick'; count: number } // pinch `count` goods off the counter
  | { kind: 'serve' }; // vendor hands goods over (no input)

export interface Step {
  npc: Line;
  /** The line the player says back (SADAK's `prompt`). */
  reply: Line;
  /** Physical task after the vendor's line, before the reply card(s) appear. */
  before?: Action;
  /** Runs after the right reply. */
  after?: Action;
  /** Short English instruction for a physical task (≤ 44 chars). */
  goal: string;
}

export interface ErrandMeta {
  id: SpotId;
  /** SADAK task id, the key into LESSONS */
  task: string;
  title: string;
  /** SADAK's errand kind label (map key and intro card), e.g. 'Auto' */
  kind: string;
  /** Place name for the location card on arrival */
  place: string;
  vendor: { name: string; role: string; speaker: string };
  brief: string;
  reward: number;
  colour: string;
  /** 'hail': raise a hand to stop the auto; 'bus': the bus pulls in and the conductor talks at its door. */
  arrive?: 'hail' | 'bus';
  recall: Line;
  /** SADAK's completionNote */
  done: string;
  /** Which reply makes the vendor serve, or makes you pick goods. */
  serveOn?: RegExp;
  pickOn?: RegExp;
}

export interface Errand extends ErrandMeta {
  tier: LessonTier;
  steps: Step[];
}

export type ErrandId = 'kachori' | 'flowers' | 'auto' | 'paranthe' | 'bus' | 'minaret';
type SpotId = ErrandId;

const L = (hi: string, ro: string, en: string): Line => ({ hi, ro, en });
const fromLesson = (l: LessonLine): Line => ({ hi: l.native, ro: l.roman, en: l.en });

/** Bulbul v3 voice for the player's own lines. */
export const PLAYER_SPEAKER = 'priya';

export const REACT_HUH = L('जी? फिर से बोलिए', 'Ji? Phir se boliye', 'Pardon? Say that again');
export const REACT_TOO_MUCH = L('ज़्यादा है, ये लीजिए', 'Zyaada hai, ye lijiye', "That's too much, here you go");

/** SADAK's task pack order for purani-sadak (tasks.ts). The level ramp is keyed on this index. */
export const ORDER: SpotId[] = ['auto', 'kachori', 'flowers', 'bus', 'paranthe', 'minaret'];

/** How you get from each errand to the next. Auto and bus rides are SADAK's (rides.ts); SADAK walks
 * the rest, which a seated VR player does by cycle rickshaw (smooth walking makes people sick). */
export const RIDE_AFTER: Record<SpotId, 'auto' | 'bus' | 'rickshaw' | null> = {
  auto: 'auto', kachori: 'rickshaw', flowers: 'rickshaw', bus: 'bus', paranthe: 'rickshaw', minaret: null,
};

/** SADAK's district finale (tasks.ts) and its HUD phrasebook (districts.ts phrases). */
export const FINALE = {
  title: 'PURANI SADAK SURVIVED',
  text: 'Auto negotiated, chai ordered, flowers at the mandir, bus ticket in your pocket. You did a full Delhi morning without switching to English.',
};
export const PHRASEBOOK: Line[] = [
  { hi: 'नमस्ते', ro: 'Namaste', en: 'Hello' },
  { hi: 'कितने का है?', ro: 'Kitne ka hai?', en: 'How much is it?' },
  { hi: 'बहुत महंगा है', ro: 'Bahut mehenga hai', en: 'That is too expensive' },
  { hi: 'एक कटिंग चाय देना', ro: 'Ek cutting chai dena', en: 'One cutting chai, please' },
  { hi: 'मुझे मदद चाहिए', ro: 'Mujhe madad chahiye', en: 'I need help' },
  { hi: 'माफ़ कीजिए', ro: 'Maaf kijiye', en: 'I am sorry' },
];

/**
 * SADAK's six errands (tasks.ts puraniSadak pack): titles, briefs, rewards, colours and
 * completion notes are verbatim, except that dashes and the rupee sign are spelled out in text
 * the panel fonts can't draw. The recall lines are ours (SADAK generates them live).
 */
export const META: Record<SpotId, ErrandMeta> = {
  auto: {
    id: 'auto', task: 'purani-sadak-auto', kind: 'Auto', place: 'Chandni Chowk',
    title: 'Stop the auto',
    vendor: { name: 'Raju Bhai', role: 'Auto Driver', speaker: 'aditya' },
    brief: "Hail Raju's parked auto, name the railway station, and get the fare under 150 rupees.",
    reward: 250, colour: '#f5c518',
    arrive: 'hail',
    recall: L('अरे, आप! फिर से स्टेशन?', 'Arre, aap! Phir se station?', "Oh, it's you! The station again?"),
    done: "Fare agreed: you're riding to New Delhi station.",
  },
  kachori: {
    id: 'kachori', task: 'purani-sadak-shop', kind: 'Shop', place: 'Chandni Chowk',
    title: 'Kachori at the stall',
    vendor: { name: 'Vikram', role: 'Kachori Wallah', speaker: 'rohan' },
    brief: "Buy two kachoris and a chai. Say kachori, not 'snack'.",
    reward: 180, colour: '#ff7a1a',
    recall: L('अरे, आप फिर आ गए! आज भी दो कचौड़ी?', 'Arre, aap phir aa gaye! Aaj bhi do kachaudi?', "Oh, you're back! Two kachoris again today?"),
    done: 'Two kachoris and cutting chai: breakfast sorted.',
    serveOn: /कचौड़ी दीजिए/,
  },
  flowers: {
    id: 'flowers', task: 'purani-sadak-temple', kind: 'Temple', place: 'Gauri Shankar Mandir',
    title: 'Flowers at the mandir',
    vendor: { name: 'Sunita', role: 'Flower Seller', speaker: 'ritu' },
    brief: 'Buy marigold garlands for the temple. Ask the price before you pay.',
    reward: 200, colour: '#e8364f',
    recall: L('फिर से आए! आज भी मंदिर के लिए माला?', 'Phir se aaye! Aaj bhi mandir ke liye maala?', 'Back again! Garlands for the temple again?'),
    done: 'Garlands in hand: ready for darshan.',
    pickOn: /माला/,
  },
  bus: {
    id: 'bus', task: 'purani-sadak-bus', kind: 'Bus', place: 'Lal Quila bus stop',
    title: 'Bus to Kashmere Gate',
    vendor: { name: 'Suresh', role: 'Bus Conductor', speaker: 'shubh' },
    brief: 'Buy a ticket to Kashmere Gate at the Lal Quila stop. Name the stop and ask the fare.',
    reward: 220, colour: '#2f8fff',
    arrive: 'bus',
    recall: L('अरे, आप फिर से! कश्मीरी गेट?', 'Arre, aap phir se! Kashmiri Gate?', 'Oh, you again! Kashmere Gate?'),
    done: 'Ticket punched: next stop Kashmere Gate.',
  },
  paranthe: {
    id: 'paranthe', task: 'purani-sadak-paranthe', kind: 'Shop', place: 'Paranthe Wali Gali',
    title: 'Paranthe in the gali',
    vendor: { name: 'Mohan', role: 'Paratha Wallah', speaker: 'vijay' },
    brief: 'Order stuffed paranthe in Paranthe Wali Gali. Ask for chutney and settle the bill.',
    reward: 230, colour: '#b05cff',
    recall: L('फिर से आए! आज भी आलू पराँठा?', 'Phir se aaye! Aaj bhi aaloo paraantha?', 'Back again! Aloo paratha again today?'),
    done: 'Aloo paranthe, fried in ghee, in the lane that has made them since the Mughals.',
    serveOn: /चटनी दीजिए/,
  },
  minaret: {
    id: 'minaret', task: 'purani-sadak-minaret', kind: 'Mosque', place: 'Jama Masjid',
    title: 'Up the Jama Masjid minaret',
    vendor: { name: 'Imran', role: 'Masjid Caretaker', speaker: 'shubh' },
    brief: 'Buy a ticket from the caretaker to climb the south minaret. Shoes off first.',
    reward: 240, colour: '#19c3b0',
    recall: L('फिर से आए! आज भी मीनार?', 'Phir se aaye! Aaj bhi meenaar?', 'Back again! The minaret again today?'),
    done: 'A hundred and thirty narrow steps, and all of Old Delhi under the minaret.',
  },
};

/** SADAK's district total (sum of pack rewards), shown on the finale. */
export const DISTRICT_REWARD = ORDER.reduce((a, id) => a + META[id].reward, 0);

/** Price words in the vendor's line → rupees. Longest first so "एक सौ बीस" beats "बीस". */
const PRICES: [string, number][] = [
  ['एक सौ बीस', 120], ['डेढ़ सौ', 150], ['तीन सौ', 300], ['अस्सी', 80], ['साठ', 60], ['पचास', 50], ['चालीस', 40], ['बीस', 20],
];

export function priceIn(hi: string): number | null {
  for (const [w, v] of PRICES) if (hi.includes(w)) return v;
  return null;
}

/** "Here you go" means money changes hands. */
const PAYING = /ये लीजिए/;

function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function goalFor(action?: Action): string {
  if (action?.kind === 'pay') return `Pay ₹${action.amount}: put coins on the plate`;
  return '';
}

/** Build one errand at a lesson tier: SADAK's steps plus our cards and actions. */
export function buildErrand(id: SpotId, tier: LessonTier): Errand {
  const meta = META[id];
  const lessons = LESSONS[meta.task][tier];
  let paid = false;
  let served = false;
  let picked = false;
  let lastPrice: number | null = null;
  const steps: Step[] = lessons.map((st) => {
    const npc = fromLesson(st.npc);
    const reply = fromLesson(st.prompt);
    const price = priceIn(npc.hi);
    if (price !== null && price < 150) lastPrice = price;
    let before: Action | undefined;
    if (!paid && PAYING.test(reply.hi) && (price ?? lastPrice) !== null && id !== 'auto') {
      before = { kind: 'pay', amount: (price ?? lastPrice)! };
      paid = true;
    }
    let after: Action | undefined;
    if (!served && meta.serveOn?.test(reply.hi)) {
      after = { kind: 'serve' };
      served = true;
    } else if (!picked && meta.pickOn?.test(reply.hi)) {
      after = { kind: 'pick', count: 2 };
      picked = true;
    }
    return { npc, reply, before, after, goal: goalFor(before) };
  });
  return { ...meta, tier, steps };
}

/** SADAK's ramp: the level you chose sets the tier of each errand by its place in the day. */
export function errandAt(index: number, comfort: ComfortLevel): Errand {
  const id = ORDER[index % ORDER.length];
  return buildErrand(id, lessonTierFor(comfort, index));
}

export const COMFORT_LABEL: Record<ComfortLevel, Line> = {
  easy: L('आसान', 'Aasaan', 'Easy'),
  medium: L('मध्यम', 'Madhyam', 'Medium'),
  hard: L('कठिन', 'Kathin', 'Hard'),
};

/** Every (speaker, Hindi text) pair the app can say, at every level: the TTS bake list. */
export function allUtterances(): { speaker: string; text: string }[] {
  const out = new Map<string, { speaker: string; text: string }>();
  const add = (speaker: string, l: Line | undefined) => {
    if (l) out.set(`${speaker}|${l.hi}`, { speaker, text: l.hi });
  };
  for (const id of ORDER) {
    const m = META[id];
    const v = m.vendor.speaker;
    for (const l of [m.recall, REACT_TOO_MUCH]) add(v, l);
    for (const tier of ['easy', 'medium', 'hard'] as LessonTier[]) {
      for (const s of buildErrand(id, tier).steps) {
        add(v, s.npc);
        add(v, s.reply); // SADAK's "Hear correct pronunciation" plays your line in the vendor's voice
        add(PLAYER_SPEAKER, s.reply); // said for you when you answer by hand
      }
    }
  }
  return [...out.values()];
}

/** FNV-1a of `speaker|text` → stable file name shared by the bake tool and the runtime. */
export function clipId(speaker: string, text: string): string {
  return `${speaker}-${hash(`${speaker}|${text}`).toString(16).padStart(8, '0')}`;
}

/** Fisher–Yates with a seeded RNG, so card order is stable per step but not always "right card first". */
export function cardOrder(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0 || 1;
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}
