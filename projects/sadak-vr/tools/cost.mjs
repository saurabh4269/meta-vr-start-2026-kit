// Dev probe: the street's heaviest meshes (triangles x instances) and their extent.
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    const rows = [];
    const byTop = {};
    s.street.group.traverse((o) => {
      if (!o.isMesh || !o.visible) return;
      const g = o.geometry;
      const tri = (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1);
      if (!g.boundingSphere) g.computeBoundingSphere();
      let p = o, path = [];
      while (p && p !== s.street.group) { path.unshift(p.name || p.type); p = p.parent; }
      const top = path.slice(0, 3).join('/');
      byTop[top] = byTop[top] || { tri: 0, n: 0 };
      byTop[top].tri += tri; byTop[top].n++;
      rows.push({ name: path.slice(-2).join('/'), tri: Math.round(tri), r: Math.round(g.boundingSphere.radius), inst: o.isInstancedMesh ? o.count : 0 });
    });
    rows.sort((a, b) => b.tri - a.tri);
    const tops = Object.entries(byTop).sort((a, b) => b[1].tri - a[1].tri).slice(0, 25).map(([k, v]) => `${k} tri=${Math.round(v.tri)} n=${v.n}`);
    return { total: rows.reduce((a, r) => a + r.tri, 0), tops, heaviest: rows.slice(0, 25) };
  };
  for (const f of page.frames()) { try { const r = await f.evaluate(fn); if (r) return r; } catch {} }
  return 'no sadak';
}
