// Dev probe: is every part of SADAK's city built? Lists SADAK's world groups,
// landmark names, set pieces and mesh counts, and SADAK's own warnings.
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    const city = s.street.group.getObjectByName('sadak-city');
    const world = city?.getObjectByName('world');
    if (!world) return { error: 'no SADAK world group' };
    const groups = world.children.map((c) => {
      let meshes = 0, tris = 0;
      c.traverse((o) => {
        if (!o.isMesh || o.userData.inkHull || o.userData.cullProxy) return;
        meshes++;
        const g = o.geometry;
        tris += ((g.index ? g.index.count : g.attributes.position.count) / 3) * (o.isInstancedMesh ? o.count : 1);
      });
      return { name: c.name || c.type, children: c.children.length, meshes, tris: Math.round(tris) };
    });
    const landmarks = (world.getObjectByName('landmarks')?.children ?? []).map((c) => c.userData.landmark || c.name);
    const extras = city.children.filter((c) => c.name.startsWith('sadak-')).map((c) => c.name);
    const barber = !!world.getObjectByName('sadak-barber');
    let inkHulls = 0, proxies = 0;
    city.traverse((o) => { if (o.userData.inkHull) inkHulls++; if (o.userData.cullProxy) proxies++; });
    const m = s.street.group.userData.world.city.map;
    return {
      map: { id: m.id, half: m.half, roads: m.roads.length, buildings: m.buildings.length, plots: m.plots.length, landmarks: m.landmarks.length, areas: m.areas.length, rails: m.rails.length, boards: m.boards.length },
      groups, landmarks, extras, barber, inkHulls, proxies,
      sky: !!city.children.find((c) => c.type === 'Group' && c !== world),
    };
  };
  for (const f of page.frames()) { try { const r = await f.evaluate(fn); if (r) return r; } catch {} }
  return 'no sadak';
}
