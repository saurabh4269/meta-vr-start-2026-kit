"""
Retarget motion capture onto the Sadak VR characters' skeleton.

blender -b --python tools/humans/retarget.py -- <character.glb> <out.glb> <source files...> [--clips Name=Source:Action ...]

- Source: Quaternius Universal Animation Library (CC0) .glb/.gltf/.fbx, or any
  humanoid with UE-mannequin, Mixamo or plain names (aliases below).
- Method (standard world-space retarget): rest poses are aligned first (each
  target bone's direction is turned onto its source bone's rest direction, so
  a T-pose source drives an A-pose target correctly); then per frame each
  mapped bone takes the source's world rotation change since rest; locals are
  solved parent-first; the pelvis also takes the source's hip translation,
  scaled by leg length.
- Output: the target armature with one action per clip, exported as glTF
  animations (three.js AnimationMixer binds them by bone name to every
  character, since they share the skeleton).
"""
import bpy, sys, os, re
from mathutils import Matrix, Quaternion, Vector

# Target bone -> source aliases (first found wins).
ALIASES = {
    'pelvis': ['pelvis', 'Hips', 'mixamorig:Hips', 'hips', 'Pelvis'],
    'spine_01': ['spine_01', 'Spine', 'mixamorig:Spine', 'spine', 'Spine1'],
    'spine_02': ['spine_03', 'spine_02', 'Spine1', 'mixamorig:Spine1', 'chest', 'Chest'],
    'spine_03': ['spine_05', 'spine_04', 'spine_03', 'Spine2', 'mixamorig:Spine2', 'upper_chest', 'UpperChest'],
    'neck_01': ['neck_01', 'Neck', 'mixamorig:Neck', 'neck'],
    'head': ['Head', 'head', 'mixamorig:Head'],
}
for s, S, M in (('l', 'Left', 'Left'), ('r', 'Right', 'Right')):
    ALIASES.update({
        f'clavicle_{s}': [f'clavicle_{s}', f'{S}Shoulder', f'mixamorig:{M}Shoulder', f'shoulder.{s.upper()}'],
        f'upperarm_{s}': [f'upperarm_{s}', f'{S}Arm', f'mixamorig:{M}Arm', f'upper_arm.{s.upper()}'],
        f'lowerarm_{s}': [f'lowerarm_{s}', f'{S}ForeArm', f'mixamorig:{M}ForeArm', f'forearm.{s.upper()}'],
        f'hand_{s}': [f'hand_{s}', f'{S}Hand', f'mixamorig:{M}Hand', f'hand.{s.upper()}'],
        f'thigh_{s}': [f'thigh_{s}', f'{S}UpLeg', f'mixamorig:{M}UpLeg', f'thigh.{s.upper()}'],
        f'calf_{s}': [f'calf_{s}', f'{S}Leg', f'mixamorig:{M}Leg', f'shin.{s.upper()}'],
        f'foot_{s}': [f'foot_{s}', f'{S}Foot', f'mixamorig:{M}Foot', f'foot.{s.upper()}'],
        f'ball_{s}': [f'ball_{s}', f'{S}ToeBase', f'mixamorig:{M}ToeBase', f'toe.{s.upper()}'],
    })
    for f, F in (('thumb', 'Thumb'), ('index', 'Index'), ('middle', 'Middle'), ('ring', 'Ring'), ('pinky', 'Pinky')):
        for k in (1, 2, 3):
            ALIASES[f'{f}_0{k}_{s}'] = [f'{f}_0{k}_{s}', f'{S}Hand{F}{k}', f'mixamorig:{M}Hand{F}{k}']




def _load(path):
    before = set(bpy.data.objects)
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.glb', '.gltf'):
        bpy.ops.import_scene.gltf(filepath=path)
    else:
        bpy.ops.import_scene.fbx(filepath=path, automatic_bone_orientation=True)
    new = [o for o in bpy.data.objects if o not in before]
    return next(o for o in new if o.type == 'ARMATURE'), new


def _child_dir(arm_obj, b, mats):
    h = mats[b.name].to_translation()
    # The bone's own axis: its main child (not leaf, eye or twist helpers), else its tail.
    kids = [c for c in b.children if not c.name.lower().endswith(('_leaf_l', '_leaf_r')) and not c.name.lower().startswith(('eye', 'jaw'))]
    t = mats[kids[0].name].to_translation() if kids else (arm_obj.matrix_world @ b.tail_local)
    d = t - h
    return d.normalized() if d.length > 1e-6 else Vector((0, 0, 1))


def retarget_into(target, sources, clips, step=1):
    """Add one action per clip to `target` (an armature). clips: {OutName: SourceActionName}."""
    tbones = target.data.bones
    TREST = {b.name: (target.matrix_world @ b.matrix_local) for b in tbones}
    made = []
    for src_path in sources:
        keep = set(bpy.data.actions)
        src, sobjs = _load(src_path)
        new_actions = [a for a in bpy.data.actions if a not in keep]
        SM = {b.name: b for b in src.data.bones}
        mapping = {}
        for t, al in ALIASES.items():
            if t in tbones:
                for a in al:
                    if a in SM:
                        mapping[t] = a
                        break
        SREST = {b.name: (src.matrix_world @ b.matrix_local) for b in src.data.bones}
        ALIGN = {t: _child_dir(target, tbones[t], TREST).rotation_difference(_child_dir(src, SM[s], SREST)) for t, s in mapping.items()}
        ratio = TREST['pelvis'].to_translation().z / max(1e-3, SREST[mapping['pelvis']].to_translation().z) if 'pelvis' in mapping else 1.0
        by_name = {a.name.split('|')[-1]: a for a in new_actions}
        for out_name, src_name in clips.items():
            act = by_name.get(src_name)
            if not act or out_name in made:
                continue
            src.animation_data_create()
            src.animation_data.action = act
            f0, f1 = int(act.frame_range[0]), int(act.frame_range[1])
            tact = bpy.data.actions.new('RT_' + out_name)
            tact['out_name'] = out_name
            target.animation_data_create()
            target.animation_data.action = tact
            order = list(tbones)
            for f in range(f0, f1 + 1, step):
                bpy.context.scene.frame_set(f)
                SP = {pb.name: (src.matrix_world @ pb.matrix) for pb in src.pose.bones}
                POSE = {}
                for b in order:
                    t = b.name
                    par = b.parent.name if b.parent else None
                    rest_w = TREST[t]
                    if t in mapping:
                        s_ = mapping[t]
                        delta = SP[s_].to_quaternion() @ SREST[s_].to_quaternion().inverted()
                        want_q = delta @ (ALIGN[t] @ rest_w.to_quaternion())
                    elif par:
                        want_q = (POSE[par] @ (TREST[par].inverted() @ rest_w)).to_quaternion()
                    else:
                        want_q = rest_w.to_quaternion()
                    head_p = (POSE[par] @ (TREST[par].inverted() @ rest_w)).to_translation() if par else rest_w.to_translation()
                    if t == 'pelvis' and 'pelvis' in mapping:
                        s_ = mapping['pelvis']
                        head_p = rest_w.to_translation() + (SP[s_].to_translation() - SREST[s_].to_translation()) * ratio
                    POSE[t] = Matrix.Translation(head_p) @ want_q.to_matrix().to_4x4()
                for b in order:
                    t = b.name
                    pb = target.pose.bones[t]
                    par = b.parent.name if b.parent else None
                    rest_local = (TREST[par].inverted() @ TREST[t]) if par else TREST[t]
                    pose_local = (POSE[par].inverted() @ POSE[t]) if par else POSE[t]
                    basis = rest_local.inverted() @ pose_local
                    pb.rotation_mode = 'QUATERNION'
                    pb.rotation_quaternion = basis.to_quaternion()
                    pb.keyframe_insert('rotation_quaternion', frame=f - f0)
                    if t == 'pelvis':
                        pb.location = basis.to_translation()
                        pb.keyframe_insert('location', frame=f - f0)
            made.append(out_name)
            print('CLIP', out_name, '<-', src_name, (f1 - f0) // step + 1, 'keys', 'mapped', len(mapping))
        for o in sobjs:
            bpy.data.objects.remove(o, do_unlink=True)
        for a in new_actions:
            bpy.data.actions.remove(a)
    # Source actions are gone: give ours their final names.
    for a in bpy.data.actions:
        if a.name.startswith('RT_') and 'out_name' in a:
            a.name = a['out_name']
    # Every action on its own NLA track so the glTF exporter writes them all.
    target.animation_data.action = None
    for act in [a for a in bpy.data.actions if a.name in made]:
        tr = target.animation_data.nla_tracks.new()
        tr.name = act.name
        tr.strips.new(act.name, 0, act)
    for pb in target.pose.bones:
        pb.rotation_quaternion = (1, 0, 0, 0)
        pb.location = (0, 0, 0)
    return made
