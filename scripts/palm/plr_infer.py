import numpy as np, cv2, onnxruntime as ort, os
MODEL = os.environ.get("PLR_ONNX", "/workspace/palmsrc/plr/models/student_fp32.onnx")
_s = None
MEAN = np.array([0.485, 0.456, 0.406], np.float32); STD = np.array([0.229, 0.224, 0.225], np.float32)
def sess():
    global _s
    if _s is None: _s = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    return _s
def run(rect_bgr):
    """rect_bgr: canonical rectified palm canvas (thumb on the right). Returns (probs[4,H,W] at canvas size)."""
    h, w = rect_bgr.shape[:2]
    rgb = cv2.cvtColor(cv2.resize(rect_bgr, (512, 512), interpolation=cv2.INTER_LINEAR), cv2.COLOR_BGR2RGB).astype(np.float32) / 255
    x = ((rgb - MEAN) / STD).transpose(2, 0, 1)[None].astype(np.float32)
    lg = sess().run(None, {sess().get_inputs()[0].name: x})[0][0]
    e = np.exp(lg - lg.max(0, keepdims=True)); p = e / e.sum(0, keepdims=True)
    return np.stack([cv2.resize(p[i], (w, h), interpolation=cv2.INTER_LINEAR) for i in range(4)])
