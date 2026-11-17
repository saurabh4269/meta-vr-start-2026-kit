"""Watchable demo (not a test): plays the whole morning at human pace from a seated head pose.
Run with the dev server in collaborate mode so the window is visible."""
import math, os, sys, pathlib, time, random
os.environ.setdefault('XR_LOG_TAG', 'sadak')
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from xr_e2e_lib import *  # noqa

PAUSE = float(os.environ.get('DEMO_PAUSE', '2.2'))
SEAT = {}

def seat(yaw=0.0, pitch=-10):
    p, y = math.radians(pitch), math.radians(yaw)
    # yaw then pitch
    cy, sy, cp, sp = math.cos(y / 2), math.sin(y / 2), math.cos(p / 2), math.sin(p / 2)
    q = {'x': cy * sp, 'y': sy * cp, 'z': -sy * sp, 'w': cy * cp}
    cli('xr', 'set-transform', payload={'device': 'headset', 'position': SEAT, 'orientation': q})

def park(device='hand-right'):
    x = 0.3 if device == 'hand-right' else -0.3
    cli('xr', 'set-transform', payload={'device': device, 'position': {'x': SEAT['x'] + x, 'y': 0.7, 'z': SEAT['z'] - 0.05}})

def targets():
    return field(wait_for(r'targets phase=\w+ layout=', 25).string, 'layout')

def poke(p, head):
    n = [h - q for h, q in zip(head, p)]; L = math.sqrt(sum(v * v for v in n)) or 1; n = [v / L for v in n]
    cli('xr', 'set-hand-pose', payload={'device': 'hand-right', 'poseId': 'point'})
    start = [p[i] + n[i] * 0.07 for i in range(3)]
    tip_to(start, 0.6); time.sleep(0.7)   # hover: hear the card
    tip_to([p[i] - n[i] * 0.012 for i in range(3)], 0.3); tip_to(start, 0.3); park()

def card(correct=True, t=None):
    t = t or targets(); time.sleep(PAUSE)
    c = [c for c in t['cards'] if c['ok'] == correct][0]
    poke(c['p'], t['head'])
    return t

def grab(obj, dest):
    cli('xr', 'set-hand-pose', payload={'device': 'hand-right', 'poseId': 'default'})
    grab_to(obj, dest, 'hand-right', carry=0.9); park(); time.sleep(0.6)

pin_page(); fresh_user()
enter_hands(seat=True)
wait_for(r'phase placing', 15); time.sleep(2.5); select()
m = wait_for(r'placed table=\w+ height=[\d.]+ anchor=(\[[^\]]*\])', 10)
A = json.loads(m.group(1)); SEAT.update(x=A[0], y=A[1] + 0.62, z=A[2] + 0.45)
seat(pitch=-6); park(); park('hand-left')
print('kachori stall', flush=True)
wait_for(r'phase cards errand=kachori step=0', 30)
t0 = targets(); card(False, t0); time.sleep(3.5); card(True, t0)
wait_for(r'phase cards errand=kachori step=1', 25); card(True)
wait_for(r'phase task errand=kachori step=2', 25)
t = targets(); time.sleep(PAUSE); pl = t['plate']
for c in [c for c in t['coins'] if c['v'] == 20][:2]: grab(c['p'], [pl[0], pl[1] + 0.08, pl[2]])
wait_for(r'phase cards errand=kachori step=2', 15); card(True)
print('flower stall', flush=True)
wait_for(r'phase cards errand=flowers step=0', 40); card(True)
wait_for(r'phase after errand=flowers step=0', 10)
t = targets(); time.sleep(1.5)
for it in t['items'][:2]: grab(it, [it[0] - 0.15, it[1] + 0.1, it[2] + 0.2])
for s in (1, 2):
    wait_for(rf'phase cards errand=flowers step={s}', 25); card(True)
wait_for(r'phase task errand=flowers step=3', 25)
t = targets(); time.sleep(PAUSE); pl = t['plate']
for c in [c for c in t['coins'] if c['v'] == 20][:2]: grab(c['p'], [pl[0], pl[1] + 0.08, pl[2]])
wait_for(r'phase cards errand=flowers step=3', 15); card(True)
print('auto', flush=True)
wait_for(r'phase hail errand=auto', 40); time.sleep(2.5)
tip_to([SEAT['x'] + 0.25, SEAT['y'] + 0.25, SEAT['z'] - 0.15], 0.6, 'hand-right', anchor='grasp')
wait_for(r'hailed', 8); park(); seat(yaw=-35, pitch=-8)
for s in range(4):
    wait_for(rf'phase cards errand=auto step={s}', 30); card(True)
wait_for(r'finale', 30); seat(yaw=-35, pitch=-6)
print('finale', flush=True)
