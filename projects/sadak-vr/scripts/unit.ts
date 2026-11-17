// Pure-logic checks: content integrity, clip ids, scoring, streaks. Run: npm test
import assert from 'node:assert/strict';
import { allUtterances, buildErrand, cardOrder, clipId, DISTRICT_REWARD, errandAt, FINALE, META, ORDER, priceIn, RIDE_AFTER } from '../src/game/content.ts';
import type { LessonTier } from '../src/game/lessons-hindi.ts';

const TIERS: LessonTier[] = ['easy', 'medium', 'hard'];
const ERRANDS = ORDER.flatMap((id) => TIERS.map((t) => buildErrand(id, t)));
import { scoreAttempt } from '../src/game/score.ts';
import { learn, markDay, recordVisit, streak, type Save } from '../src/game/save.ts';

let n = 0;
const ok = (name: string, fn: () => void) => { fn(); n++; console.log('PASS', name); };

ok("SADAK's pack: order, titles, rewards (₹1,320), rides, finale text", () => {
  assert.deepEqual(ORDER, ['auto', 'kachori', 'flowers', 'bus', 'paranthe', 'minaret']);
  assert.deepEqual(ORDER.map((id) => META[id].title), [
    'Stop the auto', 'Kachori at the stall', 'Flowers at the mandir', 'Bus to Kashmere Gate', 'Paranthe in the gali', 'Up the Jama Masjid minaret',
  ]);
  assert.equal(DISTRICT_REWARD, 1320);
  assert.equal(RIDE_AFTER.auto, 'auto');
  assert.equal(RIDE_AFTER.bus, 'bus');
  assert.equal(FINALE.title, 'PURANI SADAK SURVIVED');
});

ok('all 6 errands × 3 levels: 3/5/7 steps, every step has a line to say back', () => {
  assert.equal(ERRANDS.length, 18);
  for (const e of ERRANDS) {
    assert.equal(e.steps.length, { easy: 3, medium: 5, hard: 7 }[e.tier], `${e.id}/${e.tier}`);
    for (const s of e.steps) {
      assert.ok(s.reply.hi && s.reply.ro && s.reply.en, s.npc.hi);
      if (s.before) assert.ok(s.goal.length > 3 && s.goal.length <= 44, `goal: ${s.goal}`);
    }
  }
});

ok('every shop errand has exactly one payment, at a price the pouch can cover', () => {
  for (const e of ERRANDS) {
    const pays = e.steps.filter((s) => s.before?.kind === 'pay');
    if (e.id === 'auto') { assert.equal(pays.length, 0); continue; }
    assert.equal(pays.length, 1, `${e.id}/${e.tier}: ${pays.length} payments`);
    const amt = (pays[0].before as { amount: number }).amount;
    assert.ok([20, 40, 50, 60, 80, 120].includes(amt), `${e.id}/${e.tier} amount ${amt}`);
  }
  assert.equal(priceIn('एक सौ बीस रुपये'), 120);
  assert.equal(priceIn('बीस रुपये'), 20);
});

ok('kachori serves once; flowers asks you to pick two garlands', () => {
  for (const t of TIERS) {
    assert.equal(buildErrand('kachori', t).steps.filter((s) => s.after?.kind === 'serve').length, 1);
    assert.equal(buildErrand('flowers', t).steps.filter((s) => s.after?.kind === 'pick').length, 1);
  }
});

ok("SADAK's level ramp by pack index (levels.ts), clamped at 4", () => {
  const tiers = (c: 'easy' | 'medium' | 'hard') => ORDER.map((_, i) => errandAt(i, c).tier).join(',');
  assert.equal(tiers('easy'), 'easy,easy,medium,medium,medium,medium');
  assert.equal(tiers('medium'), 'easy,medium,medium,hard,hard,hard');
  assert.equal(tiers('hard'), 'medium,medium,hard,hard,hard,hard');
  assert.equal(errandAt(4, 'easy').id, 'paranthe');
});

ok('every line has Devanagari, romanisation and English', () => {
  for (const e of ERRANDS) for (const l of [e.recall, ...e.steps.flatMap((s) => [s.npc, s.reply])]) {
    assert.match(l.hi, /[\u0900-\u097F]/, l.hi);
    assert.ok(l.ro && l.en, l.hi);
    assert.doesNotMatch(l.ro, /[\u0900-\u097F]/, l.ro);
  }
  assert.equal(Object.keys(META).length, 6);
});

ok('clip ids are unique per (speaker, text) and stable', () => {
  const u = allUtterances();
  const ids = u.map((x) => clipId(x.speaker, x.text));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(clipId('rohan', 'क्या लेंगे?'), 'rohan-c222834a');
});

ok('card order is a permutation and not always right-first', () => {
  let firsts = 0;
  for (let s = 0; s < 50; s++) {
    const o = cardOrder(3, s);
    assert.deepEqual([...o].sort(), [0, 1, 2]);
    if (o[0] === 0) firsts++;
  }
  assert.ok(firsts < 40);
});

ok('scoring: exact = 100, swapped quantities penalised, empty = 0', () => {
  assert.equal(scoreAttempt('दो कचौड़ी दीजिए', 'दो कचौड़ी दीजिए').points, 100);
  assert.ok(scoreAttempt('दो कचौड़ी दीजिए', 'दो कचोरी दीजिये').accuracy >= 0.5);
  assert.equal(scoreAttempt('दो कचौड़ी दीजिए', '').points, 0);
  const right = scoreAttempt('दो कचौड़ी दीजिए', 'दो कचौड़ी दीजिए').accuracy;
  const wrongCard = scoreAttempt('एक कचौड़ी दीजिए', 'दो कचौड़ी दीजिए').accuracy;
  assert.ok(right > wrongCard);
});

ok('save: phrases, visits, streak', () => {
  const s: Save = { version: 1, vendors: {}, phrases: [], spoken: [], days: [], districtsDone: 0, comfort: 'medium', cash: 0, xp: 0, completed: [] };
  assert.equal(learn(s, 'नमस्ते'), true);
  assert.equal(learn(s, 'नमस्ते', true), false);
  assert.deepEqual(s.spoken, ['नमस्ते']);
  recordVisit(s, 'kachori', 1, '2026-11-17');
  recordVisit(s, 'kachori', 0, '2026-11-18');
  assert.equal(s.vendors.kachori!.visits, 2);
  markDay(s, '2026-11-16'); markDay(s, '2026-11-17'); markDay(s, '2026-11-18'); markDay(s, '2026-11-18');
  assert.equal(streak(s.days), 3);
  assert.equal(streak(['2026-11-10', '2026-11-18']), 1);
});

console.log(`\n${n} unit checks passed`);
