// Dev probe: which vendor rigs are real human bodies.
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    const out = {};
    for (const [id, sp] of Object.entries(s.street.spots)) {
      const v = sp.vendor;
      out[id] = { kind: v.o?.rig?.kind ?? 'procedural', tris: v.o?.rig?.tris, upperArm: +(v.o?.rig?.dims?.upperArm ?? 0).toFixed(3) };
    }
    return out;
  };
  for (const f of page.frames()) { try { const r = await f.evaluate(fn); if (r) return r; } catch {} }
  return 'no sadak';
}
