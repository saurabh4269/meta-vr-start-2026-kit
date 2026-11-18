"""
Build one Sadak VR character the way VR characters are usually made:
a MakeHuman body (MPFB, CC0) with textured skin, real fitted clothing and
hair meshes from MakeHuman's CC0 asset packs, the game_engine skeleton
(UE-mannequin names, full fingers) plus eye bones, and face morphs for
lip sync and blinks (Meta/Oculus visemes and ARKit-style face units).
Motion comes from retargeted motion capture (tools/humans/retarget.py).

blender -b --python tools/humans/build_character.py -- <spec.json> <out.glb>

Spec: {female, age, muscle, weight, height, seed, skin, hair, eyebrows,
       clothes: [{asset, colour?, plain?, extend_to?}], extras: {...}}
Colours are SADAK's attireFor colours (sRGB hex).
"""
import bpy, bmesh, json, math, os, sys, random, glob
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
SPEC = json.load(open(argv[0]))
OUT = argv[1]

from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
from bl_ext.user_default.mpfb.services.locationservice import LocationService

DATA = LocationService.get_user_data()
SYS = LocationService.get_mpfb_data()
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

def find(kind, name, ext):
    for root in (DATA, SYS):
        hits = glob.glob(os.path.join(root, kind, name, '*' + ext))
        if hits:
            return sorted(hits, key=len)[0]
    raise FileNotFoundError(f'{kind}/{name}/*{ext}')

def srgb(h):
    f = lambda c: (c / 255) ** 2.2
    return (f(h >> 16 & 255), f(h >> 8 & 255), f(h & 255), 1.0)

def ctx(obj):
    return bpy.context.temp_override(object=obj, active_object=obj, selected_objects=[obj], selected_editable_objects=[obj])

# ---------------- body ----------------
female = SPEC['female']
macro = TargetService.get_default_macro_info_dict()
macro.update({'gender': 0.0 if female else 1.0, 'age': SPEC.get('age', 0.5), 'muscle': SPEC.get('muscle', 0.5),
              'weight': SPEC.get('weight', 0.5), 'height': SPEC.get('heightMacro', 0.5), 'proportions': 0.65})
macro['race'] = SPEC.get('race', {'asian': 0.35, 'caucasian': 0.3, 'african': 0.35})
body = HumanService.create_human(mask_helpers=True, detailed_helpers=True, extra_vertex_groups=True, feet_on_ground=True, scale=0.1, macro_detail_dict=macro)
body.name = 'body'
rng = random.Random(SPEC.get('seed', 1))
tdir = os.path.join(SYS, 'targets')
for group in ['nose', 'mouth', 'chin', 'cheek', 'eyes', 'eyebrows', 'head', 'forehead', 'ears']:
    files = sorted(glob.glob(os.path.join(tdir, group, '*.target.gz')))
    for f in rng.sample(files, min(len(files), 3 if group in ('nose', 'mouth', 'chin', 'head') else 2)):
        TargetService.load_target(body, f, weight=rng.uniform(0.1, 0.45))

rig = HumanService.add_builtin_rig(body, 'game_engine', import_weights=True)
rig.name = 'rig'
HumanService.set_character_skin(find('skins', SPEC['skin'], '.mhmat'), body, skin_type='GAMEENGINE')

parts = []
def add(kind, name, atype, mat='GAMEENGINE'):
    o = HumanService.add_mhclo_asset(find(kind, name, '.mhclo'), body, asset_type=atype, subdiv_levels=0, material_type=mat)
    o.name = f'{kind}-{name}'
    parts.append(o)
    return o

eyes = add('eyes', 'high-poly', 'Eyes')
add('eyebrows', SPEC.get('eyebrows', 'eyebrow001'), 'Eyebrows')
add('eyelashes', 'eyelashes01', 'Eyelashes')
add('teeth', 'teeth_base', 'Teeth')
if SPEC.get('hair'):
    add('hair', SPEC['hair'], 'Hair')
cloth_objs = []
for c in SPEC['clothes']:
    o = add('clothes', c['asset'], 'Clothes')
    o['spec'] = json.dumps(c)
    cloth_objs.append(o)
bpy.context.view_layer.update()

# ---------------- freeze the shape, then add face morphs ----------------
for o in [body] + parts:
    if o.data.shape_keys:
        with ctx(o):
            bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
# Face morphs on the body (base-mesh topology, so before any vertex is deleted).
MORPHS = SPEC.get('morphs') or ['viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk', 'viseme_CH', 'viseme_SS',
                                 'viseme_nn', 'viseme_RR', 'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
                                 'eyeBlinkLeft', 'eyeBlinkRight', 'browInnerUp', 'mouthSmileLeft', 'mouthSmileRight', 'jawOpen']
body.shape_key_add(name='Basis', from_mix=False)
for m in MORPHS:
    sub = 'visemes' if m.startswith('viseme') else 'faceunits'
    path = os.path.join(DATA, 'targets', sub, m + '.target')
    if os.path.exists(path):
        TargetService.load_target(body, path, weight=0.0, name=m)
    else:
        print('missing morph', m)

# ---------------- delete hidden body under clothes, and helpers ----------------
def delete_verts(o, groups, invert_group=None):
    gi = {g.name: g.index for g in o.vertex_groups}
    want = [gi[g] for g in groups if g in gi]
    inv = gi.get(invert_group) if invert_group else None
    bm = bmesh.new()
    bm.from_mesh(o.data)
    dl = bm.verts.layers.deform.active
    kill = []
    for v in bm.verts:
        d = v[dl] if dl else {}
        if inv is not None and d.get(inv, 0.0) <= 0.0:
            kill.append(v)
        elif any(d.get(g, 0.0) > 0.5 for g in want):
            kill.append(v)
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    bm.to_mesh(o.data)
    bm.free()
    o.data.update()
    return len(kill)
delete_groups = [g.name for g in body.vertex_groups if g.name.startswith('Delete.')]
print('deleted body verts', delete_verts(body, delete_groups, invert_group='body'))
for o in [body] + parts:
    for m in list(o.modifiers):
        if m.type == 'MASK':
            o.modifiers.remove(m)
        elif m.type not in ('ARMATURE',):
            with ctx(o):
                bpy.ops.object.modifier_apply(modifier=m.name)

# ---------------- eye bones (gaze) ----------------
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='EDIT')
head_b = rig.data.edit_bones['head']
ev = [eyes.matrix_world @ v.co for v in eyes.data.vertices]
for side, sgn in (('l', 1), ('r', -1)):
    pts = [p for p in ev if p.x * sgn > 0]
    c = sum(pts, Vector()) / len(pts)
    b = rig.data.edit_bones.new(f'eye_{side}')
    b.head = rig.matrix_world.inverted() @ c
    b.tail = b.head + Vector((0, -0.03, 0))
    b.parent = head_b
bpy.ops.object.mode_set(mode='OBJECT')
for g in list(eyes.vertex_groups):
    eyes.vertex_groups.remove(g)
gl = eyes.vertex_groups.new(name='eye_l'); gr = eyes.vertex_groups.new(name='eye_r')
for v in eyes.data.vertices:
    (gl if (eyes.matrix_world @ v.co).x > 0 else gr).add([v.index], 1.0, 'REPLACE')

# ---------------- clothes: colours, kurta hem, extras ----------------
def principled(mat):
    if not mat or not mat.use_nodes:
        return None
    for n in mat.node_tree.nodes:
        if n.type == 'BSDF_PRINCIPLED':
            return n
    return None

def recolour(o, colour, plain=True):
    for mat in o.data.materials:
        p = principled(mat)
        if not p:
            continue
        bc = p.inputs['Base Color']
        if plain:
            for l in list(bc.links):
                mat.node_tree.links.remove(l)
            bc.default_value = srgb(colour)
        else:
            # Tint: multiply the texture by the colour.
            src = bc.links[0].from_socket if bc.links else None
            mix = mat.node_tree.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
            mix.inputs['Factor'].default_value = 1.0
            if src:
                mat.node_tree.links.new(src, mix.inputs['A'])
            mix.inputs['B'].default_value = srgb(colour)
            mat.node_tree.links.new(mix.outputs['Result'], bc)
        if 'Roughness' in p.inputs and not p.inputs['Roughness'].links:
            p.inputs['Roughness'].default_value = 0.85

def extend_hem(o, z_to, flare):
    """Lengthen a shirt into a kurta: extrude its lowest boundary loop down to z_to, flaring out."""
    bm = bmesh.new(); bm.from_mesh(o.data)
    bm.verts.ensure_lookup_table()
    mw = o.matrix_world
    edges = [e for e in bm.edges if e.is_boundary]
    zs = sorted((mw @ ((e.verts[0].co + e.verts[1].co) / 2)).z for e in edges)
    zmin = zs[0]
    hem = [e for e in edges if (mw @ ((e.verts[0].co + e.verts[1].co) / 2)).z < zmin + 0.06]
    hverts = list({v for e in hem for v in e.verts})
    cx = sum((v.co.x for v in hverts), 0.0) / len(hverts)
    cy = sum((v.co.y for v in hverts), 0.0) / len(hverts)
    steps = 6
    top_z = sum(v.co.z for v in hverts) / len(hverts)
    cur = hem
    for i in range(1, steps + 1):
        t = i / steps
        res = bmesh.ops.extrude_edge_only(bm, edges=cur)
        nv = [g for g in res['geom'] if isinstance(g, bmesh.types.BMVert)]
        for v in nv:
            dx, dy = v.co.x - cx, v.co.y - cy
            k = 1 + flare / steps
            v.co.x = cx + dx * k
            v.co.y = cy + dy * k
            v.co.z = top_z + (z_to - top_z) * t
        cur = [g for g in res['geom'] if isinstance(g, bmesh.types.BMEdge) and all(vv in nv for vv in g.verts)]
    bm.to_mesh(o.data); bm.free(); o.data.update()
    # The new rows hang from the pelvis.
    g = o.vertex_groups.get('pelvis') or o.vertex_groups.new(name='pelvis')
    for v in o.data.vertices:
        if (mw @ v.co).z < top_z - 0.01:
            for vg in list(v.groups):
                o.vertex_groups[vg.group].remove([v.index])
            g.add([v.index], 1.0, 'REPLACE')

def kurta_skirt(shirt, z_to, flare):
    """The kurta below the shirt's hem: a flared cloth tube in the shirt's own material, overlapping the hem."""
    mw = shirt.matrix_world
    vs = [mw @ v.co for v in shirt.data.vertices]
    allv = [o.matrix_world @ v.co for o in cloth_objs if o is not shirt for v in o.data.vertices]
    # The hem: the lowest ring of the torso (ignore sleeves: |x| small).
    torso = [p for p in vs if abs(p.x) < 0.2]
    zh = min(p.z for p in torso)
    ring = [p for p in torso if p.z < zh + 0.03]
    rx = max(abs(p.x) for p in ring); ys = [p.y for p in ring]; ry = (max(ys) - min(ys)) / 2; cy = (max(ys) + min(ys)) / 2
    me = bpy.data.meshes.new('kurta'); bm = bmesh.new()
    segs, rings = 36, 10
    top = zh + 0.04
    rows = []
    for i in range(rings + 1):
        t = i / rings
        z = top + (z_to - top) * t
        k = 1.0 + flare * t ** 1.3
        # Clear the trousers underneath at every height (harem pants balloon out).
        under = [q for q in allv if abs(q.z - z) < 0.025 and abs(q.x) < 0.32]
        ux = max([abs(q.x) for q in under] + [0]) + 0.018
        uy = (max([q.y for q in under] + [cy]) - min([q.y for q in under] + [cy])) / 2 + 0.018
        rxi = max((rx + 0.004) * k, ux); ryi = max((ry + 0.004) * k, uy)
        if rows:  # never narrower than the ring above (cloth falls, it doesn't pinch)
            prx = max(abs(v.co.x) for v in rows[-1]); pry = (max(v.co.y for v in rows[-1]) - min(v.co.y for v in rows[-1])) / 2
            rxi, ryi = max(rxi, prx), max(ryi, pry)
        rows.append([bm.verts.new((math.sin(2 * math.pi * j / segs) * rxi, cy - math.cos(2 * math.pi * j / segs) * ryi, z)) for j in range(segs)])
    for i in range(rings):
        for j in range(segs):
            bm.faces.new((rows[i][j], rows[i + 1][j], rows[i + 1][(j + 1) % segs], rows[i][(j + 1) % segs]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('kurta', me); bpy.context.scene.collection.objects.link(o)
    for m in shirt.data.materials:
        me.materials.append(m)
    for poly in me.polygons:
        poly.use_smooth = True
    sd = o.modifiers.new('solid', 'SOLIDIFY'); sd.thickness = 0.004
    with ctx(o):
        bpy.ops.object.modifier_apply(modifier='solid')
    groups = {n: o.vertex_groups.new(name=n) for n in ('pelvis', 'thigh_l', 'thigh_r')}
    for v in me.vertices:
        t = max(0.0, min(1.0, (top - v.co.z) / (top - z_to)))
        side = 'thigh_l' if v.co.x > 0 else 'thigh_r'
        groups['pelvis'].add([v.index], 1 - 0.55 * t, 'REPLACE')
        groups[side].add([v.index], 0.55 * t, 'REPLACE')
    a = o.modifiers.new('arm', 'ARMATURE'); a.object = rig
    o.parent = rig
    parts.append(o)
    return o

J = lambda n: rig.matrix_world @ rig.data.bones[n].head_local
if SPEC.get('hairTint'):
    for o in parts:
        if o.name.startswith('hair-'):
            recolour(o, SPEC['hairTint'], plain=False)
if SPEC.get('skinTint'):
    recolour(body, SPEC['skinTint'], plain=False)
for o in cloth_objs:
    c = json.loads(o['spec'])
    if 'colour' in c:
        recolour(o, c['colour'], c.get('plain', True))
    if c.get('extend_to') == 'knee':
        # Under the kurta only the pyjama below its hem shows: cut the rest first, so it never pokes
        # through and the kurta can fall straight from the shirt instead of stepping out over it.
        hem_z = J('calf_l').z + 0.14
        for other in cloth_objs:
            if other is o or not any(k in other.name for k in ('pants', 'harem', 'jeans', 'trouser')):
                continue
            bm = bmesh.new(); bm.from_mesh(other.data)
            kill = [v for v in bm.verts if (other.matrix_world @ v.co).z > hem_z]
            bmesh.ops.delete(bm, geom=kill, context='VERTS'); bm.to_mesh(other.data); bm.free(); other.data.update()
        kurta_skirt(o, J('calf_l').z + 0.06, c.get('flare', 0.18))

# Simple extras in fabric: apron, towel, pallu, cap, bag (weighted to one bone each).
def fabric(name, colour, rough=0.9):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = principled(m); p.inputs['Base Color'].default_value = srgb(colour); p.inputs['Roughness'].default_value = rough
    return m

def extra(name, build, colour, bone, wrap=None, subd=1):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); build(bm); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    me.materials.append(fabric(name, colour))
    for p in me.polygons:
        p.use_smooth = True
    if subd:
        s = o.modifiers.new('sub', 'SUBSURF'); s.levels = subd
        with ctx(o):
            bpy.ops.object.modifier_apply(modifier='sub')
    if wrap:
        w = o.modifiers.new('wrap', 'SHRINKWRAP'); w.target = wrap; w.wrap_method = 'NEAREST_SURFACEPOINT'; w.offset = 0.01
        w.wrap_mode = 'OUTSIDE_SURFACE'
        with ctx(o):
            bpy.ops.object.modifier_apply(modifier='wrap')
    g = o.vertex_groups.new(name=bone)
    g.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
    a = o.modifiers.new('arm', 'ARMATURE'); a.object = rig
    o.parent = rig
    parts.append(o)
    return o

bco = [o.matrix_world @ v.co for o in [body] + cloth_objs for v in o.data.vertices]
def girth(z, band=0.03):
    pts = [p for p in bco if abs(p.z - z) < band and abs(p.x) < 0.3]
    if not pts:
        return 0.17, 0.12, 0.0
    xs = [abs(p.x) for p in pts]; ys = [p.y for p in pts]
    return max(xs), (max(ys) - min(ys)) / 2, (max(ys) + min(ys)) / 2

X = SPEC.get('extras', {})
chestZ = J('spine_03').z
if 'apron' in X:
    def apron(bm):
        top, bot = chestZ - 0.02, J('calf_l').z + 0.12
        n, m = 10, 14
        rows = []
        for j in range(m + 1):
            z = top + (bot - top) * j / m
            rx, ry, cy = girth(min(z, J('pelvis').z + 0.05), 0.03)
            rx, ry = rx * 1.06 + 0.02, ry * 1.12 + 0.025
            rows.append([bm.verts.new((math.sin(math.radians(-58 + 116 * i / n)) * rx, cy - math.cos(math.radians(-58 + 116 * i / n)) * ry, z)) for i in range(n + 1)])
        for j in range(m):
            for i in range(n):
                bm.faces.new((rows[j][i], rows[j + 1][i], rows[j + 1][i + 1], rows[j][i + 1]))
    extra('apron', apron, X['apron'], 'pelvis', subd=1)
if 'towel' in X:
    sx = J('clavicle_r').x - 0.06
    rx, ry, cy = girth(J('spine_03').z + 0.08, 0.03)
    def towel(bm):
        bmesh.ops.create_grid(bm, x_segments=6, y_segments=18, size=0.5,
                              matrix=Matrix.Translation((sx, cy, J('neck_01').z - 0.05)) @ Matrix.Diagonal((0.12, 0.62, 1, 1)) @ Matrix.Rotation(math.pi / 2, 4, 'X'))
        for v in bm.verts:  # drape over the shoulder: front half down the chest, back half down the back
            t = v.co.z - (J('neck_01').z - 0.05)
            v.co.y = cy + (-1 if t > 0 else 1) * (ry + 0.03)
            v.co.z = J('neck_01').z - 0.02 - abs(t) * 0.9
    extra('towel', towel, X['towel'], 'spine_03', wrap=None, subd=1)
if 'pallu' in X:
    def ellipse_at(theta, z, out=0.016):
        rx, ry, cy = girth(z, 0.025)
        return Vector((math.sin(theta) * (rx * 1.02 + out), cy - math.cos(theta) * (ry * 1.04 + out), z)), Vector((math.sin(theta) / max(rx, 1e-3), -math.cos(theta) / max(ry, 1e-3), 0)).normalized()
    shZ = J('upperarm_l').z
    path = [(-0.45, J('pelvis').z + 0.02), (-0.15, J('spine_02').z), (0.2, chestZ), (0.6, chestZ + 0.1), (1.05, shZ + 0.05),
            (1.55, shZ + 0.04), (2.2, chestZ + 0.04), (2.7, J('spine_02').z), (2.95, J('pelvis').z - 0.05)]
    def pallu(bm):
        pts = [ellipse_at(math.radians(0) + t * 1.0 if False else t, z) for t, z in path]
        prev = None
        for i, (p, n) in enumerate(pts):
            a_ = pts[min(i + 1, len(pts) - 1)][0] - pts[max(i - 1, 0)][0]
            w = a_.cross(n).normalized() * 0.11
            row = (bm.verts.new(p - w), bm.verts.new(p), bm.verts.new(p + w))
            if prev:
                bm.faces.new((prev[0], prev[1], row[1], row[0]))
                bm.faces.new((prev[1], prev[2], row[2], row[1]))
            prev = row
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    po = extra('pallu', pallu, X['pallu'], 'spine_03', subd=2)
    po.data.materials[0].use_backface_culling = False
    po.vertex_groups.clear()
    gs = {n: po.vertex_groups.new(name=n) for n in ('spine_03', 'clavicle_l', 'pelvis')}
    for v in po.data.vertices:
        p_ = po.matrix_world @ v.co
        if p_.z > chestZ + 0.06:
            gs['clavicle_l'].add([v.index], 1.0, 'REPLACE')
        elif p_.z < J('spine_02').z - 0.05:
            gs['pelvis'].add([v.index], 1.0, 'REPLACE')
        else:
            gs['spine_03'].add([v.index], 1.0, 'REPLACE')
if 'cap' in X:
    # A crocheted skullcap over the hair: sized from the hair and scalp at the crown, snug, down to the upper forehead.
    crown = [o.matrix_world @ v.co for o in [body] + parts if (o is body or o.name.startswith('hair-')) for v in o.data.vertices]
    z0 = J('head').z + 0.1
    pts = [p for p in crown if p.z > z0]
    rx = max(abs(p.x) for p in pts); ys = [p.y for p in pts]; ry = (max(ys) - min(ys)) / 2; cyc = (max(ys) + min(ys)) / 2
    top = max(p.z for p in pts)
    def cap(bm):
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=14, radius=1.0)
        for v in bm.verts:
            v.co.z = max(0.0, v.co.z)
        for v in bm.verts:
            v.co = Vector((v.co.x * (rx + 0.004), cyc + v.co.y * (ry + 0.004), z0 + v.co.z * (top + 0.006 - z0)))
    co = extra('cap', cap, X['cap'], 'head', subd=1)
    for p_ in co.data.polygons:
        p_.use_smooth = True
if 'bag' in X:
    rx, ry, cy = girth(J('pelvis').z, 0.04)
    def bag(bm):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((rx + 0.06, cy, J('pelvis').z + 0.03)) @ Matrix.Diagonal((0.07, 0.2, 0.17, 1)))
    extra('bag', bag, X['bag'], 'pelvis', subd=0)

# ---------------- materials: opaque, except hair cards, brows and lashes ----------------
for o in [body] + parts:
    cut = any(k in o.name for k in ('hair-', 'eyebrows-', 'eyelashes-', 'eyes-'))
    for mat in o.data.materials:
        if not mat:
            continue
        p = principled(mat)
        if not cut:
            if hasattr(mat, 'surface_render_method'):
                mat.surface_render_method = 'DITHERED'
            mat.blend_method = 'OPAQUE' if hasattr(mat, 'blend_method') else None
            if p and 'Alpha' in p.inputs:
                for l in list(p.inputs['Alpha'].links):
                    mat.node_tree.links.remove(l)
                p.inputs['Alpha'].default_value = 1.0
        else:
            mat.blend_method = 'CLIP' if hasattr(mat, 'blend_method') else None
            if hasattr(mat, 'alpha_threshold'):
                mat.alpha_threshold = 0.5
        mat.use_backface_culling = not cut

# ---------------- textures: VR-sized ----------------
SIZES = {'skin': 1024, 'default': 512}
for img in bpy.data.images:
    if img.size[0] == 0:
        continue
    lim = SIZES['skin'] if 'skin' in img.name.lower() or SPEC['skin'].lower() in img.filepath.lower() else SIZES['default']
    if any(k in img.name.lower() for k in ('eyebrow', 'eyelash', 'teeth', 'tongue')):
        lim = 256
    if img.size[0] > lim:
        img.scale(lim, max(1, int(lim * img.size[1] / img.size[0])))

# ---------------- height and export ----------------
zmax = max((body.matrix_world @ v.co).z for v in body.data.vertices)
k = SPEC.get('height', 1.7) / zmax
rig.scale = (k, k, k)
objs = [rig, body] + parts
with bpy.context.temp_override(selected_objects=objs, selected_editable_objects=objs, active_object=rig, object=rig):
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
# ---------------- motion capture (CC0 Quaternius libraries), retargeted onto this skeleton ----------------
ANIM = SPEC.get('anim')
if ANIM:
    import importlib.util
    spec_ = importlib.util.spec_from_file_location('retarget', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'retarget.py'))
    rt = importlib.util.module_from_spec(spec_); spec_.loader.exec_module(rt)
    made = rt.retarget_into(rig, ANIM['sources'], ANIM['clips'], step=ANIM.get('step', 2))
    print('ANIMS', made)
bpy.ops.object.select_all(action='DESELECT')
for o in objs:
    o.select_set(True)
bpy.context.view_layer.objects.active = rig
for o in [body] + parts:
    print('MESH', o.name, len(o.data.vertices), [m.name for m in o.data.materials], len(o.data.shape_keys.key_blocks) if o.data.shape_keys else 0)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_skins=True, export_animations=bool(ANIM), export_animation_mode='NLA_TRACKS',
                          export_morph=True, export_morph_normal=False, export_try_sparse_sk=True, export_yup=True, export_apply=False)
print('EXPORTED', OUT, os.path.getsize(OUT))
