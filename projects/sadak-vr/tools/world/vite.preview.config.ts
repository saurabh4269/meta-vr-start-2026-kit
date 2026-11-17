/**
 * Dev-only Vite config for the street preview page (world-preview.html).
 * Plain Vite on its own port, without the IWSDK plugin, so it never touches
 * the managed dev server of the main checkout (port 8086):
 *   npx vite --config tools/world/vite.preview.config.ts
 */
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root,
  // Never the shared node_modules/.vite: the main checkout's dev server uses it.
  cacheDir: `${root}/.tmp/vite-preview`,
  server: { host: '127.0.0.1', port: 8096, strictPort: true, open: false },
  resolve: { dedupe: ['three'] },
  optimizeDeps: { include: ['three'], esbuildOptions: { target: 'esnext' } },
  esbuild: { target: 'esnext' },
  build: { rollupOptions: { input: `${root}/world-preview.html` } },
});
