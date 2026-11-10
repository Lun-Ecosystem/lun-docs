import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

// The gallery is a local page: `npm run galerie` serves it, `npm run build` only proves it compiles.
export default defineConfig({
  root: 'galerie',
  plugins: [svelte(), ...(process.env.VITEST ? [svelteTesting()] : [])],
  // strictPort: CLAUDE.md gives this address; a taken port must say so, not move quietly to the next one.
  server: { host: '127.0.0.1', port: 5190, strictPort: true },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Two pages: the gallery of the kit, and the mock-ups drawn with it.
    rollupOptions: { input: ['galerie/index.html'] },
  },
  test: {
    root: '.',
    environment: 'jsdom',
    unstubGlobals: true,
    include: ['kit/**/*.test.ts', 'galerie/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    // Svelte libraries ship .svelte sources (Bits UI, Lucide icons one by one): compile them in tests.
    server: { deps: { inline: [/bits-ui/, /@lucide\/svelte/, /svelte-toolbelt/, /runed/] } },
  },
});
