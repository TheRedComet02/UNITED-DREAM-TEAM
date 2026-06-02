import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // React handles the UI logic, Tailwind handles the v4 styling engine
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Allows imports like '@/components/User' to work correctly
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Ensures the modulepreload polyfill in your index-DJr2uyZW.js works correctly
      modulePreload: {
        polyfill: true,
      },
      // Optimization: Minify the output (Terser or Esbuild)
      minify: 'esbuild',
      sourcemap: false,
    },
    server: {
      // HMR is disabled in certain AI environments via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      port: 3000,
      open: true,
    },
  };
});
