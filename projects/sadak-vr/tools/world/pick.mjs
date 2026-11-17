// Dev-only: which street meshes lie under a pixel of the preview (1280x800)?
// node tools/world/pick.mjs "<query>" x y      (preview server on :8096)
import { chromium } from 'playwright';

const [query, px, py] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=gl', '--use-gl=angle', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(`http://127.0.0.1:8096/world-preview.html?${query}&clean=1`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const out = await p.evaluate(([x, y]) => {
  const cam = window.__camera;
  const s = window.__street;
  const origin = cam.position.clone();
  const dir = cam.position.clone().set((x / 1280) * 2 - 1, -(y / 800) * 2 + 1, 0.5).unproject(cam).sub(origin).normalize();
  const hits = [];
  const a = origin.clone();
  const bb = origin.clone();
  const c = origin.clone();
  const e1 = origin.clone();
  const e2 = origin.clone();
  const h = origin.clone();
  const sv = origin.clone();
  const q = origin.clone();
  s.group.traverse((o) => {
    if (!o.isMesh || !o.geometry || o.isSkinnedMesh || o.isInstancedMesh) return;
    let vis = true;
    for (let k = o; k; k = k.parent) if (!k.visible) vis = false;
    if (!vis) return;
    const pos = o.geometry.attributes.position;
    const m = o.matrixWorld;
    for (let i = 0; i + 2 < pos.count; i += 3) {
      a.fromBufferAttribute(pos, i).applyMatrix4(m);
      bb.fromBufferAttribute(pos, i + 1).applyMatrix4(m);
      c.fromBufferAttribute(pos, i + 2).applyMatrix4(m);
      e1.subVectors(bb, a);
      e2.subVectors(c, a);
      h.crossVectors(dir, e2);
      const det = e1.dot(h);
      if (Math.abs(det) < 1e-12) continue;
      const f = 1 / det;
      sv.subVectors(origin, a);
      const u = f * sv.dot(h);
      if (u < 0 || u > 1) continue;
      q.crossVectors(sv, e1);
      const v = f * dir.dot(q);
      if (v < 0 || u + v > 1) continue;
      const t = f * e2.dot(q);
      const col = o.geometry.attributes.color;
      if (t > 0.001) hits.push([+t.toFixed(2), o.name, i, o.geometry.attributes.ink ? o.geometry.attributes.ink.getX(i) : -1, col ? '#' + [col.getX(i), col.getY(i), col.getZ(i)].map((n) => Math.round(n * 255).toString(16).padStart(2, '0')).join('') : '', [a.x, a.y, a.z].map((n) => +n.toFixed(2))]);
    }
  });
  hits.sort((p1, p2) => p1[0] - p2[0]);
  return JSON.stringify(hits.slice(0, 6));
}, [Number(px), Number(py)]);
console.log(out);
await b.close();
