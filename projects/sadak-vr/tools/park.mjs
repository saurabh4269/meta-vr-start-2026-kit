// Dev probe: park Raju's auto (as the auto errand does) and report where it is relative to the user.
export default async function run({ page }) {
  const fn = () => {
    const s = window.sadak;
    if (!s) return null;
    s.street.setActive('auto');
    s.street.auto.park();
    const a = s.street.auto.root;
    a.updateWorldMatrix(true, true);
    const p = s.anchor.worldToLocal(a.getWorldPosition(a.position.clone()));
    return { parked: s.street.auto.parked, visible: a.visible, anchorLocal: p.toArray().map((x) => +x.toFixed(2)) };
  };
  for (const f of page.frames()) { try { const r = await f.evaluate(fn); if (r) return r; } catch {} }
  return 'no sadak';
}
