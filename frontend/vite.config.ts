import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'copy-to-gas-html',
      closeBundle() {
        const distFile = path.resolve(__dirname, 'dist/index.html');
        const targetFile = path.resolve(__dirname, '../react_app.html');
        if (fs.existsSync(distFile)) {
          fs.copyFileSync(distFile, targetFile);
          console.log(`[build] Successfully updated root react_app.html from dist/index.html`);
        }
      }
    }
  ],
  server: {
    port: 5173,
    cors: true
  },
  build: {
    target: 'es2018',
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
});
