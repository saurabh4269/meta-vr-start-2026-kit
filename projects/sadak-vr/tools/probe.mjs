// Dev probe: list skinned meshes and their materials in the running app (via window.sadak).
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    const out = [];
    s.scene.traverse((o) => {
      if (o.isSkinnedMesh || /hand/i.test(o.name)) {
        const m = o.material;
        out.push({ name: o.name, skinned: !!o.isSkinnedMesh, type: m?.type, frag: (m?.fragmentShader || '').slice(0, 60).replace(/\s+/g, ' '), vis: o.visible });
      }
    });
    return { immersive: s.immersive, punched: s.handPunched, n: out.length, out: out.slice(0, 12) };
  };
  const res = [];
  for (const f of page.frames()) {
    try { res.push({ url: f.url().slice(0, 60), r: await f.evaluate(fn) }); } catch (e) { res.push({ url: f.url().slice(0, 60), err: String(e).slice(0, 80) }); }
  }
  return res;
}
