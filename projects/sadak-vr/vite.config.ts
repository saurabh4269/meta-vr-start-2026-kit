/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iwsdkDev } from '@iwsdk/vite-plugin-dev';
import { defineConfig, loadEnv, type Plugin } from 'vite';

/** Dev-only POST /api/stt, the same handler as the Vercel function in api/stt.ts. */
function sttDevApi(): Plugin {
  return {
    name: 'sadak-stt-dev-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      server.middlewares.use('/api/stt', async (req, res) => {
        try {
          const { handleStt, sarvamKey } = await server.ssrLoadModule('/server/sarvam.ts');
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const request = new Request('http://localhost/api/stt', {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          });
          const out: Response = await handleStt(request, sarvamKey({ ...process.env, ...env }));
          res.statusCode = out.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(await out.text());
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [iwsdkDev(), sttDevApi()],
  server: { host: '0.0.0.0', port: 8086, open: false, watch: { ignored: ['**/.claude/worktrees/**', '**/artifacts/**', '**/.tmp/**'] } }, // one port per project (8081 hands-of-a-master, 8082 chausar)
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'esnext',
    rollupOptions: { input: './index.html' },
  },
  esbuild: { target: 'esnext' },
  // @drawcall/uikitml otherwise pulls a second three/@pmndrs/uikit graph
  // (its own three vs the app's super-three alias). Duplicate Component classes break
  // instanceof checks → "Only pmndrs/uikit components can be added as children".
  // SADAK's vendored engine (src/sadak-engine) imports '@/lib/...' and reads process.env.NODE_ENV.
  define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development') },
  resolve: {
    alias: { '@/lib': new URL('./src/sadak-engine/lib', import.meta.url).pathname },
    dedupe: [
      'three',
      '@pmndrs/uikit',
      '@pmndrs/uikit-horizon',
      '@pmndrs/uikit-lucide',
    ],
  },
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    include: [
      'three',
      '@pmndrs/uikit',
      '@pmndrs/uikit-horizon',
      '@pmndrs/uikit-lucide',
      '@drawcall/uikitml',
    ],
    esbuildOptions: { target: 'esnext' },
  },
  publicDir: 'public',
  base: './',
});
