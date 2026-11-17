"""Average palm-line-reader masks in the canonical palm frame over N palmar 11k-Hands images.
Gives a data-driven prior on where heart/head/life lines sit relative to the 4 anchor joints.
Usage: python plr_heatmaps.py N out.npz"""
import sys, csv, random, cv2, numpy as np
sys.path.insert(0, '.')
from palm_frame import *; from detect import detect; import plr_infer
N = int(sys.argv[1]); out = sys.argv[2]
rows = [r for r in csv.DictReader(open('/workspace/palmsrc/HandInfo.csv')) if r['aspectOfHand'].startswith('palmar')]
random.seed(7); random.shuffle(rows)
H = np.zeros((4, CANVAS['h'], CANVAS['w']), np.float32); n = 0; lm_ab = []
for r in rows[:N]:
    img = cv2.imread('/workspace/palmsrc/11k/Hands/' + r['imageName'])
    d = detect(img)
    if d is None: continue
    P, _ = d; rect, _ = rectify(img, P, cv2)
    m = plr_infer.run(rect).argmax(0)
    for c in (1, 2, 3): H[c] += (m == c)
    n += 1
np.savez_compressed(out, H=H, n=n)
print('done', n)
