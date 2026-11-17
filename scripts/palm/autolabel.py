"""Auto-label prototype: MediaPipe joints -> palm frame -> corridor-constrained ridge paths -> labelled lines + mounts.
No manual annotation anywhere. Usage:
    python autolabel.py image.jpg [--out overlay.png]      (single image)
    python autolabel.py --batch N --out-dir DIR            (N palmar images of 11k Hands, writes stats.json)
"""
import sys, os, json, csv, random, argparse
import numpy as np, cv2
from skimage.filters import frangi
from skimage.graph import MCP_Geometric
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from palm_frame import *
from detect import detect
import plr_infer

REG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data/palm-regions.json')))
W, H = CANVAS['w'], CANVAS['h']
PX_PER_A = CANVAS['sy']

def poly_px(poly_ab):
    return ab_to_px(np.array(poly_ab)).astype(np.int32)

def mask_of(poly_ab):
    m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [poly_px(poly_ab)], 1); return m.astype(bool)

LINE_ORDER = ['life', 'heart', 'head', 'fate', 'sun', 'mercury_health', 'mars_line']  # priority order; the rest are not auto-detected (too thin for RGB at this res)
LINES = {l['id']: l for l in REG['lines']}
COL = dict(life=(0, 200, 0), heart=(0, 0, 255), head=(255, 80, 0), fate=(0, 200, 255), sun=(0, 140, 255), mercury_health=(200, 0, 200), mars_line=(120, 120, 0))

# palm region where creases can live (rejects finger/background edges): hull of the palm landmarks + ulnar margin
def palm_mask():
    pts = [[-0.08, -0.62], [0.30, -0.78], [0.78, -0.62], [1.12, -0.60], [1.14, 0.80], [0.6, 0.84], [0.1, 0.66], [-0.08, 0.5]]
    return mask_of(pts)
PALM = palm_mask()
BASE_SKIP = ab_to_px(np.array([[0.0, 0.0]]))[0]

def ridge_map(rect):
    lab = cv2.cvtColor(rect, cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(6, 6)).apply(L).astype(np.float32) / 255
    L = cv2.GaussianBlur(L, (0, 0), 1.0)
    r = frangi(L, sigmas=[1.5, 2.2, 3.0], black_ridges=True, beta=0.5, gamma=None)
    inside = cv2.erode(PALM.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
    r = r * inside
    hi = np.percentile(r[inside], 99.5) + 1e-9
    return np.clip(r / hi, 0, 1)

def trace(ridge, corridor, starts, end_regions, blocked=None, block_penalty=25.0):
    """Min-cost path inside `corridor` from any start pixel to the *farthest ridge-supported* end anchor.
    end_regions: list of boolean masks. Pixels already claimed by higher-priority lines cost block_penalty x (crossing allowed)."""
    cost = 1.0 / (0.02 + ridge)
    if blocked is not None: cost = np.where(blocked, cost * block_penalty, cost)
    cost[~corridor] = 1e6
    s = np.argwhere(starts & corridor)
    if len(s) == 0: return None, None
    if len(s) > 400: s = s[np.linspace(0, len(s) - 1, 400).astype(int)]
    all_e = np.zeros_like(corridor)
    for m in end_regions: all_e |= m
    e_all = np.argwhere(all_e & corridor)
    if len(e_all) == 0: return None, None
    mcp = MCP_Geometric(cost, fully_connected=True)
    cum, _ = mcp.find_costs([tuple(x) for x in s], [tuple(x) for x in e_all])
    cands = []
    for k, m in enumerate(end_regions):
        e = np.argwhere(m & corridor)
        if len(e) == 0: continue
        ec = np.array([cum[tuple(x)] for x in e]); j = int(np.argmin(ec))
        if ec[j] > 5e5: continue
        p = np.array(mcp.traceback(tuple(e[j])))
        cands.append((k, p, float(ridge[p[:, 0], p[:, 1]].mean())))
    if not cands: return None, None
    best = max(c[2] for c in cands)
    # farthest end (largest path length) whose support is within 75% of the best-supported candidate
    ok = [c for c in cands if c[2] >= 0.75 * best]
    k, p, _ = max(ok, key=lambda c: len(c[1]))
    return p, k

def path_stats(path, ridge):
    v = ridge[path[:, 0], path[:, 1]]
    L_ab = float(np.sum(np.linalg.norm(np.diff(px_to_ab(path[:, ::-1]), axis=0), axis=1)))
    return dict(mean_ridge=float(v.mean()), frac_strong=float((v > 0.15).mean()), length_ab=L_ab)

PRESENT = dict(major=dict(mean_ridge=0.08, frac_strong=0.30), minor=dict(mean_ridge=0.16, frac_strong=0.50), min_len=dict(sun=0.30, mercury_health=0.30, mars_line=0.18, fate=0.50))
def present(lid, st):
    t = PRESENT['major'] if lid in ('life', 'heart', 'head') else PRESENT['minor']
    if st['mean_ridge'] < t['mean_ridge'] or st['frac_strong'] < t['frac_strong']: return False
    return st['length_ab'] >= PRESENT['min_len'].get(lid, 0.0)

def ab_of(path): return px_to_ab(path[:, ::-1])

def classify_end(line_id, path):
    a, b = ab_of(path)[-1]
    if line_id == 'heart':
        return 'under_jupiter' if b < -0.38 else ('between_jupiter_saturn' if b < -0.20 else 'under_saturn_or_beyond')
    if line_id == 'head':
        return 'sloping_to_moon' if a < 0.46 else 'straight_to_mars'
    return None

def agreement(path, plr_mask, tol_ab=0.07):
    """symmetric agreement between traced path and palm-line-reader mask (same class)."""
    tol = tol_ab * PX_PER_A
    if plr_mask.sum() < 30: return None
    dt_p = cv2.distanceTransform((~plr_mask).astype(np.uint8), cv2.DIST_L2, 3)
    pm = np.zeros((H, W), np.uint8); pm[path[:, 0], path[:, 1]] = 1
    dt_m = cv2.distanceTransform((1 - pm).astype(np.uint8), cv2.DIST_L2, 3)
    a = float((dt_p[path[:, 0], path[:, 1]] < tol).mean())      # my path near PLR
    ys, xs = np.nonzero(plr_mask)
    b = float((dt_m[ys, xs] < tol).mean())                       # PLR near my path
    return dict(path_on_plr=a, plr_on_path=b, f=2 * a * b / (a + b + 1e-9))

def process(img):
    d = detect(img)
    if d is None: return None
    P, conf = d
    rect, M = rectify(img, P, cv2)
    ridge = ridge_map(rect)
    plr = plr_infer.run(rect); plr_cls = plr.argmax(0)
    plr_masks = {'heart': plr_cls == 1, 'head': plr_cls == 2, 'life': plr_cls == 3}
    out = dict(rect=rect, ridge=ridge, plr=plr_cls, lines={}, P=P, det_conf=conf)
    blocked = np.zeros((H, W), bool)
    for lid in LINE_ORDER:
        spec = LINES[lid]
        corr = mask_of(spec['corridor_polygon_ab'])
        starts = mask_of(spec['start_anchor']['polygon_ab'])
        end_regions = [mask_of(e['polygon_ab']) for e in spec['end_anchors']]
        path, end_k = trace(ridge, corr, starts, end_regions, blocked)
        if path is None: out['lines'][lid] = dict(found=False); continue
        st = path_stats(path, ridge); st['path'] = path
        st['end_anchor'] = spec['end_anchors'][end_k]['name']
        st['end_class'] = classify_end(lid, path)
        st['found'] = present(lid, st)
        if lid in plr_masks: st['plr'] = agreement(path, plr_masks[lid])
        out['lines'][lid] = st
        if st['found']: blocked |= cv2.dilate((np.bincount(path[:, 0] * W + path[:, 1], minlength=H * W).reshape(H, W) > 0).astype(np.uint8), np.ones((11, 11), np.uint8)).astype(bool)
    out['quality'] = quality(out)
    return out

THR = dict(major_ridge=0.08, major_len=dict(heart=0.55, head=0.35, life=0.45), plr_on_path=0.6)
def quality(o):
    """Per-image gate for the three major lines. Returns dict(passed, reasons, score)."""
    reasons = []; ok_lines = 0
    for lid in ('heart', 'head', 'life'):
        s = o['lines'].get(lid, {})
        if not s.get('found'): reasons.append(f'{lid}:not-found'); continue
        if s['mean_ridge'] < THR['major_ridge']: reasons.append(f'{lid}:weak-ridge'); continue
        if s['length_ab'] < THR['major_len'][lid]: reasons.append(f'{lid}:short'); continue
        ag = s.get('plr')
        if ag is None or ag['plr_on_path'] < THR['plr_on_path']: reasons.append(f'{lid}:plr-line-not-on-path'); continue
        ok_lines += 1
    # ordering constraint: heart distal to head
    if o['lines'].get('heart', {}).get('found') and o['lines'].get('head', {}).get('found'):
        hb = ab_of(o['lines']['heart']['path']); hd = ab_of(o['lines']['head']['path'])
        common = np.linspace(max(hb[:, 1].min(), hd[:, 1].min()) + 0.02, min(hb[:, 1].max(), hd[:, 1].max()) - 0.02, 12)
        if len(common) and common[0] < common[-1]:
            ha = np.interp(common, *(lambda x: (x[np.argsort(x[:, 1])][:, 1], x[np.argsort(x[:, 1])][:, 0]))(hb))
            da = np.interp(common, *(lambda x: (x[np.argsort(x[:, 1])][:, 1], x[np.argsort(x[:, 1])][:, 0]))(hd))
            if not (ha > da).all(): reasons.append('ordering:heart-not-above-head')
    return dict(passed=(ok_lines == 3 and not any(r.startswith('ordering') for r in reasons)), n_ok=ok_lines, reasons=reasons)

def draw(o, title=''):
    rect = o['rect']
    A = rect.copy()
    ov = A.copy()
    for m in REG['mounts']:
        cv2.fillPoly(ov, [poly_px(m['polygon_ab'])], (180, 180, 180) if m['confidence'] != 'high' else (230, 200, 120))
    A = cv2.addWeighted(ov, 0.28, A, 0.72, 0)
    for m in REG['mounts']:
        pts = poly_px(m['polygon_ab']); cv2.polylines(A, [pts], True, (90, 90, 90), 1)
        c = pts.mean(0).astype(int)
        cv2.putText(A, m['planet'].split('/')[0].split(' (')[0][:7], (c[0] - 22, c[1] + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (20, 20, 20), 1, cv2.LINE_AA)
    for lid, s in o['lines'].items():
        if not s.get('found'): continue
        pth = s['path'][:, ::-1].astype(np.float32)
        k = 9
        if len(pth) > 2 * k:  # moving-average smoothing for display (paths are 8-connected pixel chains)
            pad = np.pad(pth, ((k, k), (0, 0)), mode='edge'); ker = np.ones(2 * k + 1) / (2 * k + 1)
            pth = np.stack([np.convolve(pad[:, i], ker, mode='valid') for i in range(2)], 1)
        cv2.polylines(A, [pth.astype(np.int32).reshape(-1, 1, 2)], False, COL[lid], 3, cv2.LINE_AA)
    # right panel: plr overlay + ridge
    B = rect.copy()
    for c, col in [(1, (0, 0, 255)), (2, (255, 80, 0)), (3, (0, 200, 0))]: B[o['plr'] == c] = col
    R = cv2.cvtColor((255 - o['ridge'] * 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
    # legend / stats
    q = o['quality']
    txt = f"{title}  gate={'PASS' if q['passed'] else 'FAIL'} {','.join(q['reasons'])[:60]}"
    cv2.putText(A, txt, (6, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(B, 'palm-line-reader (pretrained, no manual labels)', (6, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(R, 'Frangi ridge map', (6, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 0, 0), 1, cv2.LINE_AA)
    x = 6
    for lid in LINE_ORDER:
        f = o['lines'].get(lid, {}).get('found')
        cv2.rectangle(A, (x, H - 18), (x + 10, H - 8), COL[lid], -1 if f else 1)
        cv2.putText(A, lid.replace('_health', ''), (x + 13, H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 0, 0), 1, cv2.LINE_AA); x += 14 + 7 * len(lid.replace('_health', ''))
    return np.hstack([A, B, R])

def summarize(o):
    d = {}
    for lid, s in o['lines'].items():
        if not s.get('found'): d[lid] = dict(found=False); continue
        d[lid] = {k: (round(v, 3) if isinstance(v, float) else v) for k, v in s.items() if k not in ('path', 'plr')}
        if s.get('plr'): d[lid]['plr_f'] = round(s['plr']['f'], 3); d[lid]['plr_on_path'] = round(s['plr']['plr_on_path'], 3)
    d['quality'] = o['quality']
    return d

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('image', nargs='?'); ap.add_argument('--out'); ap.add_argument('--batch', type=int); ap.add_argument('--out-dir')
    ap.add_argument('--seed', type=int, default=21); ap.add_argument('--save-overlays', type=int, default=8)
    a = ap.parse_args()
    if a.image:
        img = cv2.imread(a.image); o = process(img)
        if o is None: print('no hand detected'); sys.exit(1)
        cv2.imwrite(a.out or 'overlay.png', draw(o, os.path.basename(a.image))); print(json.dumps(summarize(o), indent=1))
    else:
        os.makedirs(a.out_dir, exist_ok=True)
        rows = [r for r in csv.DictReader(open('/workspace/palmsrc/HandInfo.csv')) if r['aspectOfHand'].startswith('palmar')]
        random.seed(a.seed); random.shuffle(rows)
        res = []; saved = 0
        for r in rows[:a.batch]:
            img = cv2.imread('/workspace/palmsrc/11k/Hands/' + r['imageName']); o = process(img)
            if o is None: res.append(dict(image=r['imageName'], detected=False)); continue
            s = summarize(o); s['image'] = r['imageName']; s['skin'] = r['skinColor']; s['detected'] = True; res.append(s)
            if saved < a.save_overlays:
                cv2.imwrite(os.path.join(a.out_dir, f"overlay_{r['imageName'][:-4]}.jpg"), draw(o, r['imageName'])); saved += 1
        json.dump(res, open(os.path.join(a.out_dir, 'stats.json'), 'w'), indent=1)
        det = [x for x in res if x['detected']]
        print('images', len(res), 'detected', len(det), 'gate-pass', sum(x['quality']['passed'] for x in det))
