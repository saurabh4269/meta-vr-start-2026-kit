// Dev probe: move the desktop camera for a review shot and report render cost.
// VIEW='{"pos":[x,y,z],"look":[x,y,z],"hideUi":true}' (anchor-local metres)
export default async function run({ page }) {
  const view = JSON.parse(process.env.VIEW || '{"pos":[0,2.2,2.5],"look":[0,0.5,-6],"hideUi":true}');
  const fn = async (v) => {
    const s = window.sadak;
    if (!s) return null;
    const w = s.world;
    if (v.spot) { s.street.setActive(v.spot); await new Promise((r) => setTimeout(r, 1500)); }
    const cam = w.camera;
    const a = s.anchor;
    a.updateWorldMatrix(true, false);
    const p = a.localToWorld(new cam.position.constructor(...v.pos));
    const l = a.localToWorld(new cam.position.constructor(...v.look));
    w.player.worldToLocal(p);
    cam.position.copy(p);
    cam.lookAt(l);
    cam.updateMatrixWorld(true);
    if (v.hideUi) {
      for (const o of w.scene.children) o.traverse?.((c) => { if (/panel|card|you|dialogue|chip|toast/i.test(c.name) && c !== a) c.visible = false; });
      if (s.dialogue) s.dialogue.mesh.visible = false;
      if (s.you) s.you.mesh.visible = false;
    }
    await new Promise((r) => setTimeout(r, 600));
    const info = w.renderer.info.render;
    let meshes = 0, inst = 0;
    s.street.group.traverse((o) => { if (o.isMesh && o.visible) { meshes++; if (o.isInstancedMesh) inst++; } });
    return { calls: info.calls, triangles: info.triangles, meshes, instanced: inst, programs: w.renderer.info.programs?.length };
  };
  for (const f of page.frames()) {
    try { const r = await f.evaluate(fn, view); if (r) return r; } catch (e) { /* other frame */ }
  }
  return 'no sadak';
}
