import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        delay: resolve(__dirname, 'delay.html'),
        wealth: resolve(__dirname, 'wealth.html'),
        lumpsum: resolve(__dirname, 'lumpsum.html'),
        emi: resolve(__dirname, 'emi.html'),
        hv: resolve(__dirname, 'hv.html'),
      },
    },
  },
});
