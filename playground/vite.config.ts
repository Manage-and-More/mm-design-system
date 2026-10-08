import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mmTokens } from './plugins/vite-plugin-mm-tokens.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
/** Root of the mm-design-system repo: tokens/, assets/, examples/ are read in place, never copied. */
const ds = path.resolve(here, '..');

/** Shell routes are client-side (/brand/colors); serve index.html for them, canvas.html stays its own entry. */
const spaFallback = (): Plugin => {
  const rewrite = (req: { method?: string; url?: string }, _res: unknown, next: () => void) => {
    const url = req.url ?? '/';
    if (req.method === 'GET' && !url.startsWith('/@') && !url.includes('.') && !url.startsWith('/node_modules')) req.url = '/index.html';
    next();
  };
  return {
    name: 'mm-spa-fallback',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
};

export default defineConfig({
  plugins: [
    mmTokens({ coreFile: path.join(ds, 'tokens/tokens.json'), variantsDir: path.join(here, 'src/variants') }),
    react(),
    tailwindcss(),
    spaFallback(),
  ],
  resolve: {
    alias: { '@ds': ds, '@': path.join(here, 'src') },
  },
  server: {
    fs: { allow: [ds] },
  },
  build: {
    rollupOptions: {
      input: { index: path.join(here, 'index.html'), canvas: path.join(here, 'canvas.html') },
    },
  },
});
