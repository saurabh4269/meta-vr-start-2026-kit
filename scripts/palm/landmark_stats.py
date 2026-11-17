"""Population statistics of hand proportions (from MediaPipe landmarks on palmar 11k-Hands images).
Used to set data-driven thresholds for hand-shape and finger-ratio rules. Output: json."""
import sys, csv, random, json, cv2, numpy as np
sys.path.insert(0, '.')
from detect import detect
N = int(sys.argv[1]); out = sys.argv[2]
rows = [r for r in csv.DictReader(open('/workspace/palmsrc/HandInfo.csv')) if r['aspectOfHand'].startswith('palmar')]
random.seed(11); random.shuffle(rows)
D = lambda P, i, j: float(np.linalg.norm(P[i] - P[j]))
recs = []
for r in rows[:N]:
    img = cv2.imread('/workspace/palmsrc/11k/Hands/' + r['imageName'])
    d = detect(img)
    if d is None: continue
    P, _ = d
    pl = D(P, 0, 9)  # palm length (wrist -> middle MCP)
    recs.append(dict(
        palm_w_over_l=D(P, 5, 17) / pl,
        index=D(P, 5, 8) / pl, middle=D(P, 9, 12) / pl, ring=D(P, 13, 16) / pl, pinky=D(P, 17, 20) / pl,
        thumb=D(P, 1, 4) / pl,
        index_over_ring=D(P, 5, 8) / D(P, 13, 16),
        pinky_over_ring=D(P, 17, 20) / D(P, 13, 16),
        pinky_tip_vs_ring_dip=None,
    ))
keys = [k for k in recs[0] if recs[0][k] is not None]
stats = {k: {p: float(np.percentile([r[k] for r in recs], q)) for p, q in [('p10', 10), ('p25', 25), ('p50', 50), ('p75', 75), ('p90', 90)]} for k in keys}
json.dump(dict(n=len(recs), stats=stats), open(out, 'w'), indent=1)
print(len(recs)); print(json.dumps(stats, indent=0)[:1800])
