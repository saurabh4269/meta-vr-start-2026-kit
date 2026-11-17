"""Review shots from a natural seated head pose (not a test): place, wait for cards, look at the vendor."""
import os, sys, pathlib, time, math
os.environ.setdefault('XR_LOG_TAG', 'sadak')
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from xr_e2e_lib import *  # noqa
pin_page()
fresh_user()
enter_hands(seat=True)
wait_for(r'phase placing', 15); time.sleep(1.2); select()
m = wait_for(r'placed table=\w+ height=[\d.]+ anchor=(\[[^\]]*\])', 10)
A = json.loads(m.group(1))
# seat the head like a seated adult: eyes 1.2 m above the floor, 0.45 m behind the counter origin, pitched slightly down
pitch = math.radians(float(os.environ.get('PITCH', '-14')))
q = {'x': math.sin(pitch / 2), 'y': 0, 'z': 0, 'w': math.cos(pitch / 2)}
cli('xr', 'set-transform', payload={'device': 'headset', 'position': {'x': A[0], 'y': 1.2, 'z': A[2] + 0.45}, 'orientation': q})
time.sleep(2.5); shot('review-reveal')
wait_for(r'phase arrive errand=auto', 20); time.sleep(1.0)
cli('xr', 'set-hand-pose', payload={'device': 'hand-right', 'poseId': 'default'})
tip_to([A[0] + 0.25, 1.5, A[2] + 0.35], 0.5, 'hand-right', anchor='grasp')
wait_for(r'hailed', 8)
cli('xr', 'set-transform', payload={'device': 'hand-right', 'position': {'x': A[0] + 0.3, 'y': 0.7, 'z': A[2] + 0.4}})
wait_for(r'phase player errand=auto step=0', 40); time.sleep(1.0); shot('review-player')
key('1'); time.sleep(1.5); shot('review-result')
# look left at the Errands HUD
yaw = math.radians(35)
q2 = {'x': math.sin(pitch / 2) * math.cos(yaw / 2), 'y': math.sin(yaw / 2) * math.cos(pitch / 2), 'z': -math.sin(yaw / 2) * math.sin(pitch / 2), 'w': math.cos(yaw / 2) * math.cos(pitch / 2)}
cli('xr', 'set-transform', payload={'device': 'headset', 'position': {'x': A[0], 'y': 1.2, 'z': A[2] + 0.45}, 'orientation': q2})
time.sleep(1.0); shot('review-hud')
