// Dev probe: triangles actually submitted (layer 0 on, visible chain), by SADAK group and heaviest meshes.
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    const by = {}; const rows = [];
    const walk = (o, top, vis) => {
      vis = vis && o.visible;
      if (!vis) return;
      if (o.isMesh && o.layers.isEnabled(0)) {
        const g = o.geometry;
        const tri = ((g.index ? g.index.count : g.attributes.position.count) / 3) * (o.isInstancedMesh ? o.count : 1);
        const key = top + (o.userData.inkHull ? ' (ink)' : '');
        by[key] = (by[key] || 0) + tri;
        rows.push({ n: (o.parent?.name || '') + '/' + (o.name || o.type), tri: Math.round(tri) });
      }
      for (const c of o.children) walk(c, top === 'street' && c.name ? c.name : top, vis);
    };
    const world = s.street.group.getObjectByName('world');
    for (const c of world.children) walk(c, c.name, true);
    rows.sort((a, b) => b.tri - a.tri);
    return { by: Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${Math.round(v)}`), top: rows.slice(0, 12) };
  };
  for (const f of page.frames()) { try { const r = await f.evaluate(fn); if (r) return r; } catch {} }
  return 'no sadak';
}
