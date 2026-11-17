"""Schematic of data/palm-regions.json in the palm frame (thumb right, fingers up) -> research/palm-autolabel/regions_schematic.png"""
import json, os, matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
R = json.load(open(f'{ROOT}/data/palm-regions.json'))
fig, ax = plt.subplots(figsize=(8, 9))
X = lambda p: (-p[1], p[0])   # x = -b (thumb right), y = a
for m in R['mounts']:
    ax.add_patch(Polygon([X(p) for p in m['polygon_ab']], alpha=0.25, fc='tab:orange' if m['confidence'] == 'high' else 'lightgray', ec='k', lw=0.8))
    c = X(m['centroid_ab']); ax.text(c[0], c[1], m['id'], ha='center', va='center', fontsize=7)
cols = dict(heart='r', head='b', life='g', fate='orange', sun='darkorange', mercury_health='m', mars_line='olive')
for l in R['lines']:
    col = cols.get(l['id'], 'gray')
    ax.add_patch(Polygon([X(p) for p in l['corridor_polygon_ab']], fc='none', ec=col, lw=0.8, ls='--', alpha=0.8))
    cl = [X(p) for p in l['centerline_ab']]; ax.plot(*zip(*cl), color=col, lw=2, alpha=0.9); ax.text(*cl[len(cl)//2], l['id'], color=col, fontsize=7)
lm = R['frame']['mean_landmarks_ab']; pts = [X(p) for p in lm.values()]
ax.scatter(*zip(*pts), c='k', s=14, zorder=5)
for n, p in zip(lm, pts): ax.text(p[0] + 0.02, p[1], n.replace('-phalanx', '').replace('-finger', ''), fontsize=5)
ax.set_aspect('equal'); ax.set_xlim(-1.4, 1.0); ax.set_ylim(-0.2, 1.3); ax.grid(alpha=0.2)
ax.set_title('Hast Rekha palm-frame regions (a = toward fingers, x = -b: thumb right)\nsolid = centreline, dashed = ridge-search corridor, grey mount = low confidence', fontsize=9)
fig.savefig(f'{ROOT}/research/palm-autolabel/regions_schematic.png', dpi=130, bbox_inches='tight')
