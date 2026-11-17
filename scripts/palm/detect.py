import numpy as np, cv2, mediapipe as mp
from mediapipe.tasks import python as mp_tasks
from mediapipe.tasks.python import vision as mp_vision
import os
TASK = os.environ.get("HAND_TASK", "/workspace/palmsrc/hand_landmarker.task")

_lm = None
def landmarker():
    global _lm
    if _lm is None:
        opts = mp_vision.HandLandmarkerOptions(base_options=mp_tasks.BaseOptions(model_asset_path=TASK),
                                               num_hands=1, min_hand_detection_confidence=0.3, min_hand_presence_confidence=0.3)
        _lm = mp_vision.HandLandmarker.create_from_options(opts)
    return _lm

def detect(img_bgr):
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    res = landmarker().detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
    if not res.hand_landmarks: return None
    h, w = img_bgr.shape[:2]
    P = np.array([[p.x * w, p.y * h] for p in res.hand_landmarks[0]])
    return P, res.handedness[0][0].score
