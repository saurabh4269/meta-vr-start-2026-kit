"""Builds data/palm-regions.json : mounts as polygons and lines as corridors, all in the palm frame (a, b)
defined by four tracked joints (see palm_frame.py). Hand-designed from anatomy + tuned against
data-driven priors (palm-line-reader masks averaged over 399 palmar 11k-Hands images; mean landmark positions).
Run:  python derive_regions.py <heat.npz> <out.json>"""
import sys, json, numpy as np
from shapely.geometry import LineString, Polygon
sys.path.insert(0, '.')
from palm_frame import *

# ---- mean landmark positions in (a,b) from 150 palmar images (measured earlier; wrist=(0,0), middle MCP=(1,0)) ----
LM_MEAN = {
 "wrist": (0, 0), "thumb-metacarpal": (0.09, -0.56), "thumb-phalanx-proximal": (0.36, -0.87),
 "thumb-phalanx-distal": (0.66, -0.97), "thumb-tip": (0.86, -1.11),
 "index-finger-phalanx-proximal": (0.91, -0.37), "middle-finger-phalanx-proximal": (1.0, 0.0),
 "ring-finger-phalanx-proximal": (0.99, 0.32), "pinky-finger-phalanx-proximal": (0.91, 0.63),
}

# ---- data-driven centerlines of the 3 major lines (b, a) from the heat prior; life line extended to the radial start by anatomy ----
HEART = [(-0.50, 0.95), (-0.35, 0.93), (-0.15, 0.91), (-0.05, 0.89), (0.05, 0.85), (0.15, 0.81), (0.25, 0.79), (0.35, 0.78), (0.55, 0.77), (0.75, 0.77)]
HEAD = [(-0.52, 0.77), (-0.35, 0.75), (-0.15, 0.73), (-0.05, 0.70), (0.05, 0.67), (0.15, 0.64), (0.25, 0.60), (0.35, 0.58), (0.50, 0.55), (0.62, 0.50)]
LIFE = [(0.78, -0.50), (0.70, -0.38), (0.62, -0.27), (0.52, -0.20), (0.40, -0.13), (0.28, -0.07), (0.15, -0.03), (0.04, 0.02)]  # (a,b) order here!


def ab_from_ba(pts): return [[a, b] for b, a in pts]
def line_ab(c): return np.array(c, float)

heart_cl = ab_from_ba(HEART); head_cl = ab_from_ba(HEAD); life_cl = [list(p) for p in LIFE]
hc_b = np.array([p[1] for p in heart_cl]); hc_a = np.array([p[0] for p in heart_cl])
def heart_a(b): return float(np.interp(b, hc_b, hc_a))

def mount_poly(b0, b1, top_extra=0.17, shoulders=True):
    """Finger-base mounts: lower edge = heart-line centerline, upper edge = knuckle row + top_extra (finger-web level)."""
    bs = np.linspace(b0, b1, 5)
    knuck = lambda b: float(np.interp(b, [-0.37, 0.0, 0.32, 0.63], [0.91, 1.0, 0.99, 0.91]))
    low = [[heart_a(b), b] for b in bs]
    up = [[knuck(b) + top_extra, b] for b in bs[::-1]]
    return low + up

MOUNTS = [
 dict(id="jupiter", planet="Jupiter", hi="गुरु पर्वत", roman="Guru Parvat", poly=mount_poly(-0.60, -0.18), conf="high"),
 dict(id="saturn", planet="Saturn", hi="शनि पर्वत", roman="Shani Parvat", poly=mount_poly(-0.18, 0.16), conf="high"),
 dict(id="sun_apollo", planet="Sun/Apollo", hi="सूर्य पर्वत", roman="Surya Parvat", poly=mount_poly(0.16, 0.47), conf="high"),
 dict(id="mercury", planet="Mercury", hi="बुध पर्वत", roman="Budh Parvat", poly=mount_poly(0.47, 0.82, top_extra=0.12), conf="high"),
 dict(id="mars_upper", planet="Mars (upper / resistance)", hi="मंगल पर्वत (ऊपरी)", roman="Mangal Parvat (upper)",
      poly=[[0.74, 0.45], [0.75, 0.80], [0.50, 0.77], [0.52, 0.45]], conf="medium"),
 dict(id="mars_lower", planet="Mars (lower / aggression)", hi="मंगल पर्वत (निचला)", roman="Mangal Parvat (lower)",
      poly=[[0.92, -0.60], [0.92, -0.22], [0.74, -0.22], [0.62, -0.30], [0.62, -0.60]], conf="medium"),
 dict(id="plain_of_mars", planet="Plain of Mars", hi="मंगल क्षेत्र", roman="Mangal Kshetra",
      poly=[[0.74, -0.08], [0.74, 0.45], [0.52, 0.45], [0.32, 0.22], [0.38, -0.08]], conf="medium"),
 dict(id="luna_moon", planet="Moon/Luna", hi="चंद्र पर्वत", roman="Chandra Parvat",
      poly=[[0.50, 0.45], [0.50, 0.74], [0.30, 0.72], [0.05, 0.60], [0.0, 0.30], [0.20, 0.26]], conf="medium"),
 dict(id="venus", planet="Venus", hi="शुक्र पर्वत", roman="Shukra Parvat",
      poly=[[0.62, -0.58], [0.62, -0.30]] + [[a, b] for a, b in life_cl[3:]] + [[0.0, -0.50], [0.09, -0.62], [0.36, -0.82], [0.55, -0.72]], conf="high"),
 dict(id="rahu", planet="Rahu", hi="राहु पर्वत", roman="Rahu Parvat",
      poly=[[0.13, -0.08], [0.13, 0.20], [0.30, 0.22], [0.30, -0.08]], conf="low"),
 dict(id="ketu", planet="Ketu", hi="केतु पर्वत", roman="Ketu Parvat",
      poly=[[-0.05, -0.10], [-0.05, 0.16], [0.13, 0.18], [0.13, -0.10]], conf="low"),
]

def corridor(center, hw):
    ls = LineString([(p[1], p[0]) for p in center])  # shapely (x=b, y=a)
    poly = ls.buffer(hw, cap_style=2, join_style=1)
    return [[round(y, 3), round(x, 3)] for x, y in list(poly.exterior.coords)[:-1]]

def region(poly): return [[round(a, 3), round(b, 3)] for a, b in poly]
def rect(a0, a1, b0, b1): return [[a0, b0], [a0, b1], [a1, b1], [a1, b0]]

LINES = [
 dict(id="heart", tier="major", center=heart_cl, hw=0.085, src="data-prior",
      start=dict(name="ulnar edge below the little finger", region=rect(0.70, 0.86, 0.60, 0.84)),
      end=[dict(name="under Jupiter (index) base", region=rect(0.86, 1.00, -0.62, -0.38)),
           dict(name="between Jupiter and Saturn", region=rect(0.86, 1.00, -0.38, -0.20)),
           dict(name="under Saturn (middle) base", region=rect(0.84, 0.98, -0.20, 0.05))],
      direction="ulnar -> radial", order="above head line", absent_ok=False),
 dict(id="head", tier="major", center=head_cl, hw=0.095, src="data-prior",
      start=dict(name="radial edge, between thumb and index (alone or joined to life line)", region=rect(0.64, 0.86, -0.64, -0.30)),
      end=[dict(name="straight: ulnar edge under Mars", region=rect(0.46, 0.68, 0.50, 0.80)),
           dict(name="sloping: Moon mount", region=rect(0.20, 0.46, 0.40, 0.72))],
      direction="radial -> ulnar", order="between heart and life; crosses plain of Mars", absent_ok=False),
 dict(id="life", tier="major", center=life_cl, hw=0.12, src="data-prior+anatomy",
      start=dict(name="radial edge between thumb and index, above the thumb web", region=rect(0.62, 0.86, -0.64, -0.34)),
      end=[dict(name="wrist-side base of the thenar (Venus) mount", region=rect(-0.08, 0.14, -0.20, 0.14))],
      direction="radial edge -> wrist, encloses Venus mount", order="encloses Venus", absent_ok=False),
 dict(id="fate", tier="major", center=[[0.0, 0.03], [0.25, 0.04], [0.5, 0.05], [0.75, 0.04], [0.92, 0.0]], hw=0.13, src="anatomy",
      start=dict(name="wrist centre / life line / Moon mount / mid-palm (varies)", region=rect(-0.08, 0.40, -0.12, 0.45)),
      end=[dict(name="Saturn mount base", region=rect(0.78, 0.98, -0.12, 0.12))],
      direction="wrist -> Saturn", order="crosses head and heart lines; may stop at either", absent_ok=True),
 dict(id="sun", tier="minor", center=[[0.30, 0.20], [0.55, 0.26], [0.80, 0.31], [0.92, 0.32]], hw=0.09, src="anatomy",
      start=dict(name="anywhere in lower palm / Moon / life / fate / head / heart", region=rect(0.05, 0.60, 0.05, 0.50)),
      end=[dict(name="Sun (ring) mount base", region=rect(0.78, 1.0, 0.18, 0.46))], direction="up toward ring finger", order="parallel to fate line, ulnar of it", absent_ok=True),
 dict(id="mercury_health", tier="minor", center=[[0.78, 0.64], [0.60, 0.46], [0.42, 0.28], [0.24, 0.10], [0.14, 0.0]], hw=0.09, src="anatomy",
      start=dict(name="base of Mercury (little finger) mount", region=rect(0.62, 0.86, 0.50, 0.80)),
      end=[dict(name="toward life line / wrist", region=rect(0.0, 0.30, -0.10, 0.20))], direction="diagonal across ulnar half", order="should not touch life line", absent_ok=True),
 dict(id="marriage", tier="minor", center=[[0.90, 0.62], [0.90, 0.82]], hw=0.06, src="anatomy",
      start=dict(name="ulnar edge", region=rect(0.84, 0.98, 0.76, 0.86)), end=[dict(name="short, horizontal, between heart line and Mercury finger base", region=rect(0.84, 0.98, 0.60, 0.76))],
      direction="horizontal from the edge inward", order="between heart line and little finger", absent_ok=True),
 dict(id="bracelets", tier="minor", center=[[-0.10, -0.50], [-0.10, 0.0], [-0.10, 0.52]], hw=0.07, src="anatomy",
      start=dict(name="wrist crease, radial", region=rect(-0.30, 0.0, -0.60, -0.40)), end=[dict(name="wrist crease, ulnar", region=rect(-0.30, 0.0, 0.40, 0.62))],
      direction="across the wrist, 1-3 parallel creases", order="below the palm", absent_ok=True),
 dict(id="girdle_of_venus", tier="minor", center=[[0.98, -0.25], [0.97, -0.05], [0.96, 0.20], [0.97, 0.45]], hw=0.05, src="anatomy",
      start=dict(name="between index and middle finger bases", region=rect(0.90, 1.08, -0.32, -0.18)), end=[dict(name="between ring and little finger bases", region=rect(0.88, 1.06, 0.40, 0.55))],
      direction="semicircle above the heart line", order="above heart line, under the finger bases", absent_ok=True),
 dict(id="mars_line", tier="minor", center=[[0.55, -0.30], [0.40, -0.23], [0.28, -0.17], [0.15, -0.12]], hw=0.05, src="anatomy",
      start=dict(name="lower Mars mount", region=rect(0.50, 0.70, -0.40, -0.22)), end=[dict(name="inside the life line", region=rect(0.05, 0.25, -0.20, -0.05))],
      direction="parallel just inside the life line", order="between life line and thumb", absent_ok=True),
 dict(id="intuition", tier="minor", center=[[0.62, 0.66], [0.45, 0.58], [0.28, 0.50]], hw=0.07, src="anatomy",
      start=dict(name="Mercury/Mars edge", region=rect(0.55, 0.80, 0.55, 0.82)), end=[dict(name="Moon mount", region=rect(0.15, 0.40, 0.30, 0.65))],
      direction="crescent along the ulnar edge", order="ulnar of fate/sun lines", absent_ok=True),
]

if __name__ == "__main__":
    out = sys.argv[2]
    doc = dict(
        version=1,
        description="Joint-space regions for Hast Rekha. Every polygon is in palm-frame (a,b) coordinates built from 4 tracked joints; works for left and right hands, 2D (camera) and 3D (Quest hand joints).",
        frame=dict(
            joints_webxr=dict(O="wrist", Ey_to="middle-finger-phalanx-proximal", Ex_from="index-finger-phalanx-proximal", Ex_to="pinky-finger-phalanx-proximal"),
            joints_mediapipe=dict(O=0, Ey_to=9, Ex_from=5, Ex_to=17),
            formula="q(a,b) = P[wrist] + a*(P[middle-prox] - P[wrist]) + b*(P[pinky-prox] - P[index-prox])",
            conventions="a: 0 at wrist, 1 at the middle-finger knuckle (distal = positive). b: 0 below the middle finger, + toward the little finger, - toward the thumb. Same sign convention for both hands because Ex flips with the hand. Palm must face the viewer; for the back of the hand, regions do not apply.",
            three_d_note="On Quest use the 3D joint poses: the palm plane normal is cross(Ey, Ex); a region is a planar polygon in that frame, lifted ~5 mm off the skin. Palm curvature is ignored.",
            js_snippet="const O=j.wrist, Ey=sub(j.mid,O), Ex=sub(j.pinky,j.index); const q=(a,b)=>add(O,add(mul(Ey,a),mul(Ex,b)));",
            mean_landmarks_ab=LM_MEAN,
            mean_landmarks_note="Mean over 150 palmar 11k-Hands images (2D). Sd of tip joints ~0.1-0.3 (finger spread); MCP rows sd <= 0.01 by construction.",
        ),
        mounts=[dict(id=m["id"], planet=m["planet"], name_hi=m["hi"], name_roman=m["roman"], polygon_ab=region(m["poly"]),
                     centroid_ab=[round(float(np.mean([p[0] for p in m["poly"]])), 3), round(float(np.mean([p[1] for p in m["poly"]])), 3)],
                     confidence=m["conf"]) for m in MOUNTS],
        lines=[dict(id=l["id"], tier=l["tier"], centerline_ab=region(l["center"]), halfwidth=l["hw"], corridor_polygon_ab=corridor(l["center"], l["hw"]),
                    start_anchor=dict(name=l["start"]["name"], polygon_ab=region(l["start"]["region"])),
                    end_anchors=[dict(name=e["name"], polygon_ab=region(e["region"])) for e in l["end"]],
                    direction_prior=l["direction"], ordering=l["order"], may_be_absent=l["absent_ok"], source=l["src"]) for l in LINES],
        ordering_constraints=[
            "heart line is distal (larger a) than head line at every b where both exist",
            "head line is distal to life-line end; head line may share its first 0-1.5 cm with the life line (joined start)",
            "fate line, if present, crosses the head line and ends at/below the heart line unless it reaches the Saturn mount",
            "mercury_health line must not be assigned the same pixels as life or fate lines",
            "priority when corridors overlap: life > heart > head > fate > sun > mercury_health > minor",
        ],
        calibration=dict(
            data_prior="mean/variance of palm-line-reader (MIT) predictions on 399 palmar images of 11k Hands, in this frame: heart a=0.91->0.77 for b=-0.15->0.65 (sd 0.04); head a=0.75->0.56 for b=-0.35->0.45 (sd 0.05-0.07); life b=-0.22..-0.02 over a=0.75..0.25 (sd 0.05-0.08).",
            caveat="The prior inherits palm-line-reader's bias (life line truncated near the wrist, head line often stops before the ulnar edge). Corridors are deliberately wider than the prior (2-2.5 sd) and the life corridor is extended by anatomy. Minor-line corridors and Rahu/Ketu are anatomy-only and unvalidated.",
        ),
    )
    json.dump(doc, open(out, "w"), indent=1, ensure_ascii=False)
    print("wrote", out, len(doc["mounts"]), "mounts", len(doc["lines"]), "lines")
