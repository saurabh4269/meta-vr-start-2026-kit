"""blender -b --python tools/humans/preview.py -- <in.glb> <out.png>: full body, face and hands, vertex colours, flat toon-ish light."""
import bpy, sys, math
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=a[0])
for ob in bpy.data.objects:
    if ob.type == 'ARMATURE' and ob.animation_data:
        ob.animation_data.action = None
        for t in ob.animation_data.nla_tracks:
            t.mute = True
        for pb in ob.pose.bones:
            pb.matrix_basis.identity()
bpy.context.view_layer.update()
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
    if o.data.color_attributes:
        m = bpy.data.materials.new('vc'); m.use_nodes = True
        nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']
        at = nt.nodes.new('ShaderNodeVertexColor'); at.layer_name = o.data.color_attributes[0].name
        nt.links.new(at.outputs['Color'], bsdf.inputs['Base Color']); bsdf.inputs['Roughness'].default_value = 0.8
        o.data.materials.clear(); o.data.materials.append(m)
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 480, 640
sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.75, 0.78, 0.82, 1); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.8
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun)
sun.rotation_euler = (math.radians(50), 0, math.radians(30)); sun.data.energy = 3
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
def shot(pos, target, lens, path):
    cam.location = Vector(pos); d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
zs = [ (o.matrix_world @ v.co).z for o in meshes for v in o.data.vertices]
H = max(zs)
out = a[1]
shot((0.9, -3.0, H * 0.55), (0, 0, H * 0.5), 45, out.replace('.png', '-body.png'))
shot((3.0, -0.4, H * 0.55), (0, 0, H * 0.5), 45, out.replace('.png', '-side.png'))
shot((0.15, -0.75, H * 0.92), (0, 0, H * 0.92), 60, out.replace('.png', '-face.png'))
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
b = arm.data.bones.get('wristL')
c = (arm.matrix_world @ b.head_local) + Vector((0, 0, -0.06)) if b else Vector((0.25, 0, H * 0.45))
shot((c.x + 0.35, c.y - 0.35, c.z + 0.05), tuple(c), 50, out.replace('.png', '-hand.png'))
