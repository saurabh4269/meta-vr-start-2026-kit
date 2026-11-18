"""
Build one Sadak VR vendor as a skinned glTF from MakeHuman (MPFB, CC0 output).

blender -b --python tools/humans/build_human.py -- <spec.json> <out.glb>

The skeleton is our VR rig's (src/world/people.ts): bone names, hierarchy and
a rest pose with world-aligned joints, arms straight down, palms to the
thighs. MakeHuman's 163-bone weights are merged onto it, so the Vendor
animation code (talk, gestures, two-bone arm IK, gaze, blinks) drives these
bodies unchanged. Clothes are painted and shaped in SADAK's flat colours
from SADAK's attireFor (passed in the spec).
"""
import bpy, bmesh, json, math, sys
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
SPEC = json.load(open(argv[0]))
OUT = argv[1]

from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
from bl_ext.user_default.mpfb.services.locationservice import LocationService
import os

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

female = SPEC["female"]
macro = TargetService.get_default_macro_info_dict()
macro.update({
    "gender": 0.0 if female else 1.0,
    "age": SPEC.get("age", 0.5),
    "muscle": SPEC.get("muscle", 0.5),
    "weight": SPEC.get("weight", 0.5),
    "height": SPEC.get("heightMacro", 0.5),
    "proportions": 0.6,
})
# South Asian: a mix MakeHuman's three race targets can express.
macro["race"] = {"asian": 0.35, "caucasian": 0.35, "african": 0.30}
body = HumanService.create_human(mask_helpers=True, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=True, scale=0.1, macro_detail_dict=macro)
body.name = "body"
# A face of their own: a seeded handful of MakeHuman's face targets (nose, mouth, chin, cheeks, eyes, brows, head shape).
import random, glob
rng = random.Random(SPEC.get('seed', 1))
tdir = os.path.join(LocationService.get_mpfb_data(), 'targets')
for group in ['nose', 'mouth', 'chin', 'cheek', 'eyes', 'eyebrows', 'head', 'forehead', 'ears', 'neck']:
    files = sorted(glob.glob(os.path.join(tdir, group, '*.target.gz')))
    for f in rng.sample(files, min(len(files), 3 if group in ('nose', 'mouth', 'chin', 'head') else 2)):
        TargetService.load_target(body, f, weight=rng.uniform(0.15, 0.55))
rig = HumanService.add_builtin_rig(body, "default", import_weights=True)
data = LocationService.get_user_data()
def asset(kind, name):
    return os.path.join(data, kind, name, name + ".mhclo")
parts = {}
for kind, name, atype in [("eyes", "high-poly", "Eyes"), ("eyebrows", SPEC.get("eyebrows", "eyebrow001"), "Eyebrows"), ("eyelashes", "eyelashes01", "Eyelashes"), ("teeth", "teeth_base", "Teeth")]:
    try:
        parts[kind] = HumanService.add_mhclo_asset(asset(kind, name), body, asset_type=atype, subdiv_levels=0, material_type="MAKESKIN")
    except Exception as e:
        print("asset failed", kind, e)


bpy.context.view_layer.update()
meshes = [body] + [o for o in parts.values() if o is not None]

def ctx(obj):
    return bpy.context.temp_override(object=obj, active_object=obj, selected_objects=[obj], selected_editable_objects=[obj])

# ---- 1. freeze shape keys and the helper mask ----
for o in meshes:
    bpy.context.view_layer.objects.active = o
    if o.data.shape_keys:
        with ctx(o):
            bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
    for m in list(o.modifiers):
        if m.type == 'MASK':
            with ctx(o):
                bpy.ops.object.modifier_apply(modifier=m.name)
    for m in list(o.modifiers):
        if m.type not in ('ARMATURE',):
            with ctx(o):
                bpy.ops.object.modifier_apply(modifier=m.name)

# ---- 2. pose: arms straight down, palms to the thighs, fingers relaxed ----
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
def aim(pb, target_dir):
    """Rotate pose bone pb so its head->tail points along target_dir (armature space)."""
    bpy.context.view_layer.update()
    m = rig.matrix_world.inverted() @ (rig.matrix_world @ pb.matrix)
    cur = (pb.tail - pb.head).normalized()
    q = cur.rotation_difference(target_dir.normalized())
    rot = q.to_matrix().to_4x4()
    head = pb.head.copy()
    new = Matrix.Translation(head) @ rot @ Matrix.Translation(-head) @ pb.matrix
    pb.matrix = new
    bpy.context.view_layer.update()
down = Vector((0, 0, -1))
for side in ('L', 'R'):
    sx = 1 if side == 'L' else -1
    for n in ('upperarm01', 'upperarm02'):
        aim(rig.pose.bones[f'{n}.{side}'], Vector((sx * 0.13, 0.0, -1)))
    for n in ('lowerarm01', 'lowerarm02'):
        aim(rig.pose.bones[f'{n}.{side}'], Vector((sx * 0.02, -0.04, -1)))
    aim(rig.pose.bones[f'wrist.{side}'], Vector((0, -0.03, -1)))
    # Palm to the thigh: spin the hand about the arm's axis until the palm faces in.
    # MakeHuman's A-pose palms face down-back; a quarter turn brings them inward.
    pbw = rig.pose.bones[f'wrist.{side}']
    axis = (pbw.tail - pbw.head).normalized()
    head = pbw.head.copy()
    rot = Matrix.Rotation(math.radians(SPEC.get('palmTurn', 70)) * sx, 4, axis)
    pbw.matrix = Matrix.Translation(head) @ rot @ Matrix.Translation(-head) @ pbw.matrix
    bpy.context.view_layer.update()
    # Relaxed fingers: a gentle curl at every knuckle, the thumb a little less.
    for pb in rig.pose.bones:
        if pb.name.endswith('.' + side) and pb.name.startswith('finger'):
            k = 0.12 if pb.name.startswith('finger1') else 0.28
            pb.rotation_mode = 'XYZ'
            pb.rotation_euler.x += k
bpy.context.view_layer.update()

# Apply the pose to every mesh, then make it the rest pose.
bpy.ops.object.mode_set(mode='OBJECT')
for o in meshes:
    for m in list(o.modifiers):
        if m.type == 'ARMATURE':
            with ctx(o):
                bpy.ops.object.modifier_apply(modifier=m.name)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
bpy.ops.pose.armature_apply(selected=False)
bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.update()

# ---- 3. our skeleton (src/world/people.ts names), world positions from MakeHuman's joints ----
def H(n):
    return rig.matrix_world @ rig.data.bones[n].head_local
hipsP = (H('upperleg01.L') + H('upperleg01.R')) / 2
J = {
    'root': Vector((0, 0, 0)),
    'hips': hipsP,
    'hipL': H('upperleg01.L'), 'kneeL': H('lowerleg01.L'),
    'hipR': H('upperleg01.R'), 'kneeR': H('lowerleg01.R'),
    'spine': H('spine03'),
    'chest': H('spine01'),
    'neck': H('neck01'),
    'head': H('head'),
    'jaw': H('jaw'),
    'eyeL': H('eye.L'), 'eyeR': H('eye.R'),
    'lidL': H('orbicularis03.L'), 'lidR': H('orbicularis03.R'),
    'browL': H('eye.L') + Vector((0, -0.01, 0.028)), 'browR': H('eye.R') + Vector((0, -0.01, 0.028)),
    'shoulderL': H('upperarm01.L'), 'elbowL': H('lowerarm01.L'), 'wristL': H('wrist.L'),
    'shoulderR': H('upperarm01.R'), 'elbowR': H('lowerarm01.R'), 'wristR': H('wrist.R'),
}
PARENT = {
    'hips': 'root', 'hipL': 'hips', 'kneeL': 'hipL', 'hipR': 'hips', 'kneeR': 'hipR',
    'spine': 'hips', 'chest': 'spine', 'neck': 'spine', 'head': 'neck', 'jaw': 'head',
    'eyeL': 'head', 'eyeR': 'head', 'lidL': 'head', 'lidR': 'head', 'browL': 'head', 'browR': 'head',
    'shoulderL': 'spine', 'elbowL': 'shoulderL', 'wristL': 'elbowL',
    'shoulderR': 'spine', 'elbowR': 'shoulderR', 'wristR': 'elbowR',
}

def ours(mh):
    """Which of our bones a MakeHuman bone's weights go to."""
    b = rig.data.bones.get(mh)
    chain = []
    while b:
        chain.append(b.name)
        b = b.parent
    side = 'L' if mh.endswith('.L') else 'R' if mh.endswith('.R') else ''
    base = mh.split('.')[0]
    if mh.startswith('orbicularis03'):
        return 'lid' + side
    for c in chain:
        if c.startswith('eye.'):
            return 'eye' + ('L' if c.endswith('.L') else 'R')
        if c == 'jaw':
            return 'jaw'
        if c.startswith('wrist.'):
            return 'wrist' + side
    if base in ('lowerarm01', 'lowerarm02'):
        return 'elbow' + side
    if base in ('upperarm01', 'upperarm02', 'shoulder01'):
        return 'shoulder' + side
    if base in ('lowerleg01', 'lowerleg02', 'foot') or base.startswith('toe'):
        return 'knee' + side
    if base in ('upperleg01', 'upperleg02', 'pelvis'):
        return 'hip' + side
    if base in ('clavicle', 'breast', 'spine01', 'spine02'):
        return 'chest'
    if base in ('spine03', 'spine04'):
        return 'spine'
    if base in ('spine05', 'root'):
        return 'hips'
    if base.startswith('neck'):
        return 'neck'
    return 'head'

MAP = {b.name: ours(b.name) for b in rig.data.bones}

arm_data = bpy.data.armatures.new('vendor')
arm = bpy.data.objects.new('vendor', arm_data)
bpy.context.scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode='EDIT')
eb = {}
for name in ['root'] + list(PARENT.keys()):
    b = arm_data.edit_bones.new(name)
    b.head = J[name]
    b.tail = J[name] + Vector((0, 0, 0.04))
    b.roll = 0
    eb[name] = b
for name, par in PARENT.items():
    eb[name].parent = eb[par]
    eb[name].use_connect = False
bpy.ops.object.mode_set(mode='OBJECT')

# ---- 4. move every mesh onto our skeleton, merging weights ----
for o in meshes:
    names = {g.index: g.name for g in o.vertex_groups}
    acc = [dict() for _ in o.data.vertices]
    for v in o.data.vertices:
        for g in v.groups:
            mh = names[g.group]
            tgt = MAP.get(mh)
            if tgt is None or g.weight <= 0:
                continue
            acc[v.index][tgt] = acc[v.index].get(tgt, 0) + g.weight
    for g in list(o.vertex_groups):
        o.vertex_groups.remove(g)
    groups = {n: o.vertex_groups.new(name=n) for n in J.keys()}
    for i, d in enumerate(acc):
        if not d:
            d = {'head': 1.0}
        tot = sum(d.values())
        top = sorted(d.items(), key=lambda kv: -kv[1])[:4]
        tt = sum(w for _, w in top)
        for n, w in top:
            groups[n].add([i], w / tt, 'REPLACE')
    o.parent = None
    for m in list(o.modifiers):
        o.modifiers.remove(m)
    mod = o.modifiers.new('arm', 'ARMATURE')
    mod.object = arm
    o.parent = arm

bpy.data.objects.remove(rig, do_unlink=True)

# ---- 5. SADAK's clothes: painted regions + simple garments ----
def hexcol(h):
    # sRGB hex -> linear (Blender colour attributes and glTF COLOR_0 are linear).
    f = lambda c: (c / 255) ** 2.2
    return (f(h >> 16 & 255), f(h >> 8 & 255), f(h & 255), 1.0)
C = SPEC['colours']
SKIN = hexcol(C['skin']); C1 = hexcol(C['cloth1']); C2 = hexcol(C['cloth2']); HAIR = hexcol(C['hair'])
FEET = hexcol(C.get('feet', 0x3a2a1e)); LIP = hexcol(C.get('lip', 0x8a4a3e))
preset = SPEC['preset']
eyeZ = J['eyeL'].z
headC = J['head'] + Vector((0, 0.02, 0.09))

_hv = [body.matrix_world @ v.co for v in body.data.vertices if (body.matrix_world @ v.co).z > eyeZ - 0.02]
faceY = min(p.y for p in _hv)
backY = max(p.y for p in _hv)

teeth = parts.get('teeth')
mouthZ = (max((teeth.matrix_world @ v.co).z for v in teeth.data.vertices) if teeth else eyeZ - 0.07)
def front(p):
    return p.y < faceY + 0.045

def dominant(o, v):
    best, bw = 'head', -1
    for g in v.groups:
        n = o.vertex_groups[g.group].name
        if g.weight > bw:
            best, bw = n, g.weight
    return best

def paint(o):
    me = o.data
    attr = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    hipTop = J['spine'].z
    knee = J['kneeL'].z
    for v in me.vertices:
        p = o.matrix_world @ v.co
        d = dominant(o, v)
        col = SKIN
        if d in ('head', 'neck', 'jaw', 'lidL', 'lidR', 'eyeL', 'eyeR'):
            col = SKIN
            # Hair: the crown and the back of the head.
            # Hairline: high on the forehead, sweeping down over the ears to the nape.
            s_ = max(0.0, min(1.0, (p.y - (faceY + 0.02)) / (backY - faceY - 0.02)))
            line = eyeZ + 0.068 - 0.15 * s_ ** 1.4
            if abs(p.x) > 0.055 and s_ > 0.25:
                line = min(line, eyeZ + 0.01)
            if p.z > line and p.z > J['neck'].z + (0.0 if not SPEC.get('longHair') else -0.06):
                col = HAIR
            if d == 'neck' and preset in ('kurta_pyjama', 'shirt_trousers') and p.z < J['neck'].z + 0.02:
                col = C1
        if col == SKIN and d in ('head', 'jaw') and front(p):
            if SPEC.get('moustache') and abs(p.x) < 0.026 and mouthZ + 0.007 < p.z < mouthZ + 0.016:
                col = HAIR
            if SPEC.get('beard') is not None and p.z < mouthZ - 0.006 and p.y < J['neck'].y - 0.02:
                col = hexcol(SPEC['beard'])
        elif d in ('chest', 'spine'):
            col = C1
        elif d.startswith('shoulder'):
            col = C1
        elif d.startswith('elbow'):
            col = SKIN if preset == 'sari' else C1
            if preset == 'shirt_trousers' and SPEC.get('shortSleeves') and p.z > J['elbowL'].z - 0.05:
                col = C1
        elif d.startswith('wrist'):
            col = SKIN
        elif d == 'hips':
            col = C1 if preset in ('kurta_pyjama', 'salwar_kameez', 'sari') else C2
        elif d.startswith('hip') or d.startswith('knee'):
            col = C2 if preset != 'sari' else C1
            if p.z < 0.09:
                col = FEET
        attr.data[v.index].color = col
    me.color_attributes.active_color = attr

paint(body)

def add_garment(name, bm_builder, colour, bone_weights):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bm_builder(bm)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    attr = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    for i in range(len(me.vertices)):
        attr.data[i].color = colour(o.matrix_world @ me.vertices[i].co) if callable(colour) else colour
    me.color_attributes.active_color = attr
    groups = {n: o.vertex_groups.new(name=n) for n in J.keys()}
    for v in me.vertices:
        ws = bone_weights(v.co)
        tot = sum(ws.values()) or 1
        for n, w in ws.items():
            groups[n].add([v.index], w / tot, 'REPLACE')
    mod = o.modifiers.new('arm', 'ARMATURE')
    mod.object = arm
    o.parent = arm
    for poly in me.polygons:
        poly.use_smooth = True
    meshes.append(o)
    return o

# Body cross-section half-widths near a height, from the painted body itself.
bco = [body.matrix_world @ v.co for v in body.data.vertices]
def girth(z, band=0.03):
    pts = [p for p in bco if abs(p.z - z) < band and abs(p.x) < 0.3]
    if not pts:
        return 0.18, 0.12, 0.0
    xs = [abs(p.x) for p in pts]; ys = [p.y for p in pts]
    return max(xs), (max(ys) - min(ys)) / 2, (max(ys) + min(ys)) / 2

def flare(bm, z0, z1, r0x, r0y, r1x, r1y, cy, segs=28, rings=6):
    verts = []
    for i in range(rings + 1):
        t = i / rings
        z = z0 + (z1 - z0) * t
        rx = r0x + (r1x - r0x) * t; ry = r0y + (r1y - r0y) * t
        ring = []
        for k in range(segs):
            a = 2 * math.pi * k / segs
            ring.append(bm.verts.new((math.sin(a) * rx, cy + math.cos(a) * ry, z)))
        verts.append(ring)
    for i in range(rings):
        for k in range(segs):
            a, b = verts[i][k], verts[i][(k + 1) % segs]
            c, d = verts[i + 1][(k + 1) % segs], verts[i + 1][k]
            bm.faces.new((a, b, c, d))
    # Inner wall so it reads from inside too (no back-face holes).
    bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=0.006) if hasattr(bmesh.ops, 'solidify') else None

def legw(co):
    side = 'L' if co.x > 0 else 'R'
    t = max(0.0, min(1.0, (J['hips'].z - co.z) / (J['hips'].z - J['kneeL'].z)))
    return {'hips': 1 - t, 'hip' + side: t}

def leg_ring(z, sgn, band=0.025):
    pts = [p for p in bco if abs(p.z - z) < band and p.x * sgn > 0.02 and abs(p.x) < 0.25]
    if not pts:
        return None
    xs = [p.x for p in pts]; ys = [p.y for p in pts]
    return ((max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2, (max(xs) - min(xs)) / 2, (max(ys) - min(ys)) / 2)

def legs(top_z, bot_z, loose):
    for sgn, side in ((1, 'L'), (-1, 'R')):
        def tube(bm, sgn=sgn):
            rings, segs = 12, 16
            rows = []
            for i in range(rings + 1):
                z = top_z + (bot_z - top_z) * i / rings
                r = leg_ring(z, sgn)
                if not r:
                    continue
                cx_, cy_, rx, ry = r
                rx, ry = min(rx, 0.085), min(ry, 0.095)
                k = loose
                rows.append([bm.verts.new((cx_ + math.sin(2 * math.pi * j / segs) * (rx * k + 0.008), cy_ + math.cos(2 * math.pi * j / segs) * (ry * k + 0.008), z)) for j in range(segs)])
            for i in range(len(rows) - 1):
                for j in range(segs):
                    bm.faces.new((rows[i][j], rows[i][(j + 1) % segs], rows[i + 1][(j + 1) % segs], rows[i + 1][j]))
        def w(co, side=side):
            if co.z > J['kneeL'].z + 0.04:
                t = max(0.0, min(1.0, (J['hips'].z - co.z) / 0.15))
                return {'hips': 1 - t, 'hip' + side: t} if t < 1 else {'hip' + side: 1.0}
            return {'knee' + side: 1.0}
        add_garment('leg' + side, tube, C2, w)

waistZ = J['spine'].z + 0.02
gx, gy, gc = girth(J['hips'].z - 0.04)
if preset in ('kurta_pyjama', 'salwar_kameez', 'shirt_trousers'):
    legs(J['hips'].z - 0.1, 0.1, 1.14 if preset != 'shirt_trousers' else 1.08)
if preset == 'shirt_trousers':
    shirtTop = J['spine'].z + 0.06
    sx_, sy_, sc_ = girth(shirtTop, 0.02)
    add_garment('shirt-hem', lambda bm: flare(bm, shirtTop, J['hips'].z - 0.07, sx_ * 1.05 + 0.006, sy_ * 1.08 + 0.006, gx * 1.08, gy * 1.12, sc_, rings=4), C1,
                lambda co: {'spine': 1.0} if co.z > J['hips'].z + 0.04 else {'hips': 1.0})
if preset in ('kurta_pyjama', 'salwar_kameez'):
    hem = J['kneeL'].z + 0.06
    add_garment('kurta-hem', lambda bm: flare(bm, waistZ, hem, gx * 1.03, gy * 1.08, gx * 1.12, gy * 1.2, gc), C1, legw)
if preset == 'sari':
    add_garment('sari-skirt', lambda bm: flare(bm, waistZ, 0.04, gx * 1.04, gy * 1.08, gx * 1.32, gy * 1.35, gc, rings=10),
                lambda p: hexcol(C['cloth2']) if p.z < 0.11 else C1, legw)
    # The pallu: a band from the right hip, across the chest, over the left shoulder.
    def pallu(bm):
        cx, cyy, cc = girth(J['chest'].z, 0.04)
        pts = [Vector((-gx * 0.9, gc - gy * 1.12, waistZ + 0.02)), Vector((0, cc - cyy * 1.18, J['chest'].z - 0.02)),
               Vector((J['shoulderL'].x * 0.8, cc - cyy * 0.9, J['shoulderL'].z + 0.07)), Vector((J['shoulderL'].x * 0.85, cc + cyy * 1.15, J['shoulderL'].z - 0.05)),
               Vector((J['shoulderL'].x * 0.6, cc + cyy * 1.2, J['spine'].z))]
        prev = None
        for i, p in enumerate(pts):
            nxt = pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]
            side = nxt.cross(Vector((0, -1 if p.y < cc else 1, 0))).normalized() * 0.075
            a = bm.verts.new(p - side); b = bm.verts.new(p + side)
            if prev:
                bm.faces.new((prev[0], prev[1], b, a))
            prev = (a, b)
    pa = add_garment('sari-pallu', pallu, C1, lambda co: {'chest': 1.0})
    sub = pa.modifiers.new('sub', 'SUBSURF'); sub.levels = 2
    sw = pa.modifiers.new('wrap', 'SHRINKWRAP'); sw.target = body; sw.wrap_method = 'NEAREST_SURFACEPOINT'; sw.offset = 0.014
    for name in ('sub', 'wrap'):
        pa.modifiers.move(pa.modifiers.find(name), 0 if name == 'sub' else 1)
        with ctx(pa):
            bpy.ops.object.modifier_apply(modifier=name)

kit = SPEC.get('kit', [])
kitC = hexcol(C.get('kit', 0xf2efe6))
def boxg(cx, cy, cz, sx, sy, sz):
    def b(bm):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((cx, cy, cz)) @ Matrix.Diagonal((sx, sy, sz, 1)))
    return b
cx, cyy, cc = girth(J['chest'].z, 0.04)
if 'towel' in kit:
    # Over the right shoulder, front and back.
    sxp = J['shoulderR'].x * 0.75
    add_garment('towel-front', boxg(sxp, cc - cyy * 1.05, J['shoulderR'].z - 0.12, 0.11, 0.015, 0.3), kitC, lambda co: {'chest': 1.0})
    add_garment('towel-top', boxg(sxp, cc, J['shoulderR'].z + 0.065, 0.11, cyy * 2.1, 0.02), kitC, lambda co: {'chest': 1.0})
if 'apron' in kit:
    def apron(bm):
        # A front arc that follows the body's girth down to the waist, then the kurta's flare to the knee.
        top, bot = J['chest'].z - 0.03, J['kneeL'].z + 0.1
        hemTop = waistZ
        n, m = 10, 16
        rows = []
        for j in range(m + 1):
            z = top + (bot - top) * j / m
            if z > hemTop:
                rx, ry, cy0 = girth(z, 0.02)
                rx, ry = rx * 1.02 + 0.012, ry * 1.04 + 0.014
            else:
                t = (hemTop - z) / max(1e-3, hemTop - (J['kneeL'].z + 0.06))
                rx = gx * (1.03 + 0.09 * t) + 0.014; ry = gy * (1.08 + 0.12 * t) + 0.014; cy0 = gc
            row = []
            for i in range(n + 1):
                a_ = math.radians(-55 + 110 * i / n)
                row.append(bm.verts.new((math.sin(a_) * rx, cy0 - math.cos(a_) * ry, z)))
            rows.append(row)
        for j in range(m):
            for i in range(n):
                bm.faces.new((rows[j][i], rows[j + 1][i], rows[j + 1][i + 1], rows[j][i + 1]))
    add_garment('apron', apron, kitC, lambda co: {'chest': 1.0} if co.z > J['spine'].z + 0.05 else ({'hips': 1.0} if co.z > waistZ - 0.02 else legw(co)))
if 'angavastram' in kit:
    add_garment('angavastram', boxg(J['shoulderL'].x * 0.4, cc - cyy * 1.08, J['chest'].z - 0.05, 0.1, 0.012, 0.42), kitC, lambda co: {'chest': 1.0})
if SPEC.get('bag'):
    add_garment('bag', boxg(J['hipL'].x + 0.11, gc - 0.02, J['hips'].z + 0.02, 0.07, 0.2, 0.17), hexcol(0x5a3a22), lambda co: {'hips': 1.0})
hw = SPEC.get('headwear')
if hw in ('topi', 'skullcap', 'cap'):
    def cap(bm):
        bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=1.0)
        top = J['head'].z + (J['head'].z - J['jaw'].z) + 0.16
        for v in bm.verts:
            if v.co.z < 0:
                v.co.z = 0
        hx, hy, hc = girth(eyeZ + 0.06, 0.02)
        for v in bm.verts:
            v.co = Vector((v.co.x * hx * 1.06, hc + v.co.y * hy * 1.08, eyeZ + 0.045 + v.co.z * 0.09))
    add_garment('cap', cap, hexcol(SPEC.get('headColour', 0xf4f4f0)), lambda co: {'head': 1.0})
if SPEC.get('bun'):
    def bun(bm):
        bmesh.ops.create_uvsphere(bm, u_segments=14, v_segments=8, radius=0.055, matrix=Matrix.Translation((0, J['head'].y + 0.11, eyeZ + 0.0)))
    add_garment('bun', bun, HAIR, lambda co: {'head': 1.0})

# ---- 6. scale to the vendor's height, export ----
for o in meshes:
    o.data.update()
zmax = max((body.matrix_world @ v.co).z for v in body.data.vertices)
k = SPEC.get('height', 1.7) / zmax
arm.scale = (k, k, k)
bpy.ops.object.select_all(action='DESELECT')
arm.select_set(True)
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = arm
with bpy.context.temp_override(selected_objects=[arm] + meshes, active_object=arm, object=arm):
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
for o in meshes:
    print("MESH", o.name, len(o.data.polygons), [m.name for m in o.data.materials])
# Small textures (eyes, brows, lashes, teeth): 256 px is plenty at 0.7 m and keeps each vendor under 1.5 MB.
for img in bpy.data.images:
    if img.size[0] > 256:
        img.scale(256, max(1, int(256 * img.size[1] / img.size[0])))
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_skins=True, export_animations=False,
                          export_morph=False, export_vertex_color='ACTIVE', export_yup=True, export_apply=False, export_image_format='JPEG' if False else 'AUTO')
print("EXPORTED", OUT)
