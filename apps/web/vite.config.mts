/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@teddy-monorepo/web/core': path.resolve(__dirname, '../../libs/web/core/src/index.ts'),
      '@teddy-monorepo/web/shared': path.resolve(__dirname, '../../libs/web/shared/src/index.ts'),
      '@teddy-monorepo/web/feature-auth': path.resolve(__dirname, '../../libs/web/feature-auth/src/index.ts'),
      '@teddy-monorepo/web/feature-dashboard': path.resolve(__dirname, '../../libs/web/feature-dashboard/src/index.ts'),
      '@teddy-monorepo/web/feature-clients': path.resolve(__dirname, '../../libs/web/feature-clients/src/index.ts'),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
