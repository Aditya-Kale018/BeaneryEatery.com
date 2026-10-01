import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_TARGET = process.env.API_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  build: {
    // Images are large webp data extracted from the design; keep them as real
    // files rather than inlining them back into the JS bundle.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        // The public site and the CMS are separate entries, so a visitor never
        // downloads the admin bundle.
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
        adminLegacy: fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
  server: {
    // In development the API runs as its own process; proxying keeps the
    // browser on one origin so the session cookie is sent as first-party.
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
});
