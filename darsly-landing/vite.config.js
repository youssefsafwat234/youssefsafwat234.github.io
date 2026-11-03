import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Built into ../darsly so GitHub Pages serves it at /darsly/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../darsly', emptyOutDir: true, chunkSizeWarningLimit: 1600 }
});
