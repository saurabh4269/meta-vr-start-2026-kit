/**
 * Dev-only Vite config for the audio preview page (tools/audio/preview.html).
 * Plain Vite on its own port, without the IWSDK plugin, so it never touches
 * the managed dev server of the main checkout (port 8086):
 *   npx vite --config tools/audio/vite.config.ts
 *   open http://127.0.0.1:8097/tools/audio/preview.html
 */
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root,
  // Never the shared node_modules/.vite: the main checkout's dev server uses it.
  cacheDir: `${root}/.tmp/vite-audio`,
  server: { host: '127.0.0.1', port: 8097, strictPort: true, open: false },
  esbuild: { target: 'esnext' },
  build: { rollupOptions: { input: `${root}/tools/audio/preview.html` } },
});
