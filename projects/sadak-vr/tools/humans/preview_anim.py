"""blender -b --python tools/humans/preview_anim.py -- <char.glb> <out.png> Clip1 Clip2 ...: a front frame of each clip, side by side."""
import bpy, sys, math
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=a[0])
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 360, 560
sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.75, 0.78, 0.82, 1)
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun); sun.rotation_euler = (math.radians(50), 0, math.radians(30)); sun.data.energy = 3
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.location = Vector((0.6, -3.2, 1.1)); cam.rotation_euler = (Vector((0, 0, 0.95)) - cam.location).to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = 45
if arm.animation_data:
    for t in arm.animation_data.nla_tracks:
        t.mute = True
for clip in a[2:]:
    act = bpy.data.actions.get(clip) or next((x for x in bpy.data.actions if x.name.startswith(clip)), None)
    if not act:
        print('no clip', clip); continue
    arm.animation_data_create(); arm.animation_data.action = act
    sc.frame_set(int((act.frame_range[0] + act.frame_range[1]) / 2))
    sc.render.filepath = a[1].replace('.png', f'-{clip}.png')
    bpy.ops.render.render(write_still=True)
