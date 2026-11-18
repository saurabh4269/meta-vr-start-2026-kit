"""SADAK's Chandni Chowk day with emulated hands, through IWSDK's own interaction components.

place → reveal → auto (hail, intro card, lines said by touching them, UIKit "Continue")
→ ride → kachori (serve, pay with grabbed coins) → flowers (pick garlands, overpay → change)
→ bus (the bus pulls in) → paranthe → minaret → finale (PURANI SADAK SURVIVED)
→ "Keep exploring" → the vendor remembers you.

Usage (dev server up on 8086):  npm run test:xr
"""
import math, os, sys, pathlib, time, random
os.environ.setdefault('XR_LOG_TAG', 'sadak')
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from xr_e2e_lib import *  # noqa

JITTER = float(os.environ.get('XR_JITTER', '0.004'))
LEVEL = os.environ.get('XR_LEVEL', 'easy')   # SADAK default is medium; easy keeps the run short
stats = {'poke_buttons': 0, 'fallback_buttons': 0, 'overpaid': 0, 'returned': 0}


def targets(timeout=20):
    return field(wait_for(r'targets phase=\w+ layout=', timeout).string, 'layout')


def park(device='hand-right'):
    x = 0.3 if device == 'hand-right' else -0.3
    cli('xr', 'set-transform', payload={'device': device, 'position': {'x': x, 'y': 0.75, 'z': -0.9}})


def poke(p, head, device='hand-right', depth=0.012):
    n = [h - q for h, q in zip(head, p)]
    L = math.sqrt(sum(v * v for v in n)) or 1
    n = [v / L for v in n]
    j = lambda: random.uniform(-JITTER, JITTER)
    start = [p[i] + n[i] * 0.07 + j() for i in range(3)]
    cli('xr', 'set-hand-pose', payload={'device': device, 'poseId': 'point'})
    tip_to(start, 0.35, device)
    tip_to([p[i] - n[i] * depth + j() for i in range(3)], 0.25, device)
    tip_to(start, 0.25, device)
    park(device)


def press_button(t, name, expect):
    """Poke a UIKit button where the panel reports it; fall back to IWSDK's target press."""
    p = t['buttons'].get(name)
    if p:
        poke(p, t['head'], depth=0.015)
        try:
            wait_for(expect, 4)
            stats['poke_buttons'] += 1
            return True
        except TimeoutError:
            pass
    cli('xr', 'run-sequence', payload={'device': 'hand-right', 'steps': [{'target': name, 'press': {}}]}, timeout=60, check=False)
    park()
    try:
        wait_for(expect, 5)
        stats['fallback_buttons'] += 1
        return True
    except TimeoutError:
        return False


def grab(obj, dest, device='hand-right'):
    cli('xr', 'set-hand-pose', payload={'device': device, 'poseId': 'default'})
    grab_to(obj, dest, device, carry=0.6)
    park(device)
    time.sleep(0.5)


def pay(amount, overpay=False):
    t = targets()
    pl = t['plate']
    drop = [pl[0], pl[1] + 0.08, pl[2]]
    coins = sorted(t['coins'], key=lambda c: -c['v'])
    if overpay:
        coins = [c for c in coins if c['v'] == 10][-1:] + coins
    total, returned = 0, False
    for c in coins:
        if total == amount or (total + 10 > amount and not overpay):
            break
        grab(c['p'], drop)
        try:
            m = wait_for(r'plate total=(\d+)', 5)
        except TimeoutError:
            continue
        total = int(m.group(1))
        if total > amount:
            stats['overpaid'] += 1
            m = wait_for(r'plate total=(\d+)', 8)
            total = int(m.group(1))
            if total < amount + 1:
                stats['returned'] += 1
    if total != amount:
        key('p')
    wait_for(rf'paid amount={amount}', 12)


TOUR = os.environ.get('TOUR') == '1'
toured = set()
def tour(name):
    """TOUR=1: a screenshot at each first-of-its-kind moment, for visual review."""
    if TOUR and name not in toured:
        toured.add(name)
        time.sleep(0.6)
        shot('tour-' + name)


def play_errand(eid, overpay=False, recall=None):
    m = wait_for(rf'errand id={eid} tier=(\w+) comfort=\w+ steps=(\d+)', 60)
    tier, nsteps = m.group(1), int(m.group(2))
    said = 0
    while True:
        m = wait_for(rf'(phase (?:arrive|intro|player|task|after) errand={eid} step=\d+|errandDone id={eid} slips=\d+ cash=\d+|greet recall=\w+)', 45)
        ev = m.group(1)
        if ev.startswith('errandDone'):
            check(f'{eid} ({tier}, {nsteps} steps): all lines said, errand done', said == nsteps, ev)
            return
        if ev.startswith('greet'):
            if recall is not None:
                check(f'{eid}: ' + ('vendor remembers you' if recall else 'first meeting'), ev.endswith(str(recall).lower()), ev)
            continue
        if 'intro' in ev:
            check(f'{eid}: first-meeting card', True)
            tour(f'{eid}-intro')
        elif 'arrive' in ev and eid == 'auto':
            cli('xr', 'set-hand-pose', payload={'device': 'hand-right', 'poseId': 'default'})
            tip_to([0.25, 1.35, -1.35], 0.5, 'hand-right', anchor='grasp')
            tour('auto-arrive')
            check('raising a hand hails Raju at his parked auto', bool(wait_for(r'hailed', 8)))
            park()
        elif 'arrive' in ev and TOUR:
            time.sleep(3.2)
            tour(f'{eid}-arrive')
        elif 'player' in ev:
            t = targets()
            tour(f'{eid}-player')
            poke(t['you'], t['head'])
            mm = wait_for(r'result points=(\d+)', 8)
            r = targets()
            tour(f'{eid}-result')
            ok = press_button(r, 'btn-continue', r'continue step=')
            if not ok:
                # One retry with fresh positions; counted so a flaky press is visible, not hidden.
                stats['retries'] = stats.get('retries', 0) + 1
                time.sleep(0.8)
                ok = press_button(r, 'btn-continue', r'continue step=')
            if not ok:
                recent = [m[-110:] for _, m in logs(count=40) if 'targets' not in m][-8:]
                check(f'{eid}: Continue button', False, f"points={mm.group(1)} buttons={r['buttons']} head={r['head']} recent={recent}")
                key(' ')
            said += 1
        elif 'task' in ev:
            amount = int(wait_for(r'pay amount=(\d+)', 6).group(1))
            tour(f'{eid}-pay')
            pay(amount, overpay)
            overpay = False
        elif 'after' in ev:
            mm = wait_for(r'(targets phase=after layout=|phase (?:npc|done) )', 6)
            if mm.group(1).startswith('targets'):
                for it in field(mm.string, 'layout')['items'][:2]:
                    grab(it, [it[0] - 0.15, it[1] + 0.1, it[2] + 0.2])
                check(f'{eid}: picked two garlands by pinching', bool(wait_for(r'picked n=2', 8)))
                tour(f'{eid}-after')


# ---------------------------------------------------------------- the day
pin_page()
fresh_user()
if LEVEL != 'medium':
    for _ in range({'easy': 2, 'hard': 1}[LEVEL]):
        key('l')
    check(f'level set to {LEVEL}', bool(wait_for(rf'comfort level={LEVEL}', 6)))
enter_hands(seat=True)
wait_for(r'phase placing', 15)
time.sleep(1.5)
select()
m = wait_for(r'placed table=(\w+) height=([\d.]+)', 10)
check('placement on the emulator table', m.group(1) == 'true', f'height={m.group(2)}')
tour('placing')
wait_for(r'phase reveal', 5)
if TOUR:
    time.sleep(1.2)
    tour('reveal-mid')
shot('reveal')
play_errand('auto', recall=False)
m = wait_for(r'ride kind=(\w+) to=(\w+)', 10)
if TOUR:
    time.sleep(4.5)
    tour('ride-auto')
check("SADAK's auto ride to the next errand", m.group(1) == 'auto' and m.group(2) == 'kachori', m.group(0))
play_errand('kachori')
shot('kachori')
play_errand('flowers', overpay=True)
play_errand('bus')
play_errand('paranthe')
play_errand('minaret')
m = wait_for(r'finale title=PURANI_SADAK_SURVIVED cash=(\d+) xp=(\d+)', 30)
check('finale: PURANI SADAK SURVIVED with ₹1,320', m.group(1) == '1320', m.group(0))
shot('finale')
t = targets()
check('Keep exploring', press_button(t, 'btn-explore', r'round again'))
play_errand('auto', recall=True)
print('button presses: poke', stats['poke_buttons'], 'fallback', stats['fallback_buttons'], 'retries', stats.get('retries', 0))
if stats['overpaid']:
    check('overpaying: the vendor hands the extra coin back', stats['returned'] == stats['overpaid'], f"{stats['returned']}/{stats['overpaid']}")
else:
    print('INFO no overpayment happened this run (the palm grab took exact coins)')
finish()
