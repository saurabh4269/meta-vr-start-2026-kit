"""Palm frame utilities shared by the auto-label prototype.

Palm frame ("joint space"): an affine frame built from four tracked joints only.
    origin  O  = wrist
    axis    Ey = middle-finger proximal-phalanx base (MCP)  - wrist     (a axis, "distal")
    axis    Ex = pinky MCP - index MCP                                   (b axis, "ulnar")
A point q = O + a*Ey + b*Ex.  b>0 is the pinky side, b<0 the thumb side, for BOTH hands,
so one set of regions in (a, b) works for left and right palms.
The same four joints exist in OpenXR / WebXR hand tracking (wrist, middle-finger-phalanx-proximal,
index-finger-phalanx-proximal, pinky-finger-phalanx-proximal), so the identical code runs in the headset.
"""
import numpy as np

# MediaPipe index -> WebXR joint name
MP_TO_WEBXR = {
    0: "wrist",
    1: "thumb-metacarpal", 2: "thumb-phalanx-proximal", 3: "thumb-phalanx-distal", 4: "thumb-tip",
    5: "index-finger-phalanx-proximal", 6: "index-finger-phalanx-intermediate",
    7: "index-finger-phalanx-distal", 8: "index-finger-tip",
    9: "middle-finger-phalanx-proximal", 10: "middle-finger-phalanx-intermediate",
    11: "middle-finger-phalanx-distal", 12: "middle-finger-tip",
    13: "ring-finger-phalanx-proximal", 14: "ring-finger-phalanx-intermediate",
    15: "ring-finger-phalanx-distal", 16: "ring-finger-tip",
    17: "pinky-finger-phalanx-proximal", 18: "pinky-finger-phalanx-intermediate",
    19: "pinky-finger-phalanx-distal", 20: "pinky-finger-tip",
}
WEBXR_TO_MP = {v: k for k, v in MP_TO_WEBXR.items()}


def frame_from_landmarks(P):
    """P: (21,2) or (21,3) array in MediaPipe order. Returns O, Ey, Ex (same dim)."""
    P = np.asarray(P, float)
    O = P[0]
    Ey = P[9] - P[0]
    Ex = P[17] - P[5]
    return O, Ey, Ex


def to_ab(q, P):
    """Image/world point(s) -> palm-frame (a, b). 2D only (least squares for 3D)."""
    O, Ey, Ex = frame_from_landmarks(P)
    A = np.stack([Ey, Ex], axis=1)  # dim x 2
    q = np.atleast_2d(np.asarray(q, float)) - O
    sol, *_ = np.linalg.lstsq(A, q.T, rcond=None)
    return sol.T  # (n,2) -> a,b


def from_ab(ab, P):
    O, Ey, Ex = frame_from_landmarks(P)
    ab = np.atleast_2d(np.asarray(ab, float))
    return O + ab[:, :1] * Ey + ab[:, 1:2] * Ex


# Canonical rectified canvas: fingers up, wrist near bottom, THUMB ON THE RIGHT (what palm-line-reader expects).
CANVAS = dict(w=640, h=640, a_top=2.15, b_left=1.25, sy=640 / 2.45, sx=640 / 2.45)  # a in [-0.30,2.15], b in [-1.20,1.25]
# pixel x = (b_left - b)*sx  -> pinky (b>0) toward left, thumb (b<0) toward right
# pixel y = (a_top - a)*sy


def ab_to_px(ab):
    ab = np.atleast_2d(np.asarray(ab, float))
    x = (CANVAS["b_left"] - ab[:, 1]) * CANVAS["sx"]
    y = (CANVAS["a_top"] - ab[:, 0]) * CANVAS["sy"]
    return np.stack([x, y], 1)


def px_to_ab(px):
    px = np.atleast_2d(np.asarray(px, float))
    b = CANVAS["b_left"] - px[:, 0] / CANVAS["sx"]
    a = CANVAS["a_top"] - px[:, 1] / CANVAS["sy"]
    return np.stack([a, b], 1)


def rectify(img_bgr, P, cv2):
    """Warp image into the canonical palm-frame canvas (affine, 3-point exact)."""
    src = from_ab(np.array([[0, 0], [1, 0], [0, 1]], float), P).astype(np.float32)  # O, O+Ey, O+Ex
    dst = ab_to_px(np.array([[0, 0], [1, 0], [0, 1]], float)).astype(np.float32)
    M = cv2.getAffineTransform(src, dst)
    out = cv2.warpAffine(img_bgr, M, (CANVAS["w"], CANVAS["h"]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return out, M
