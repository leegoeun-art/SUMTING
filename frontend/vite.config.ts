import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': { target: env.BACKEND_URL || 'http://localhost:8080', changeOrigin: true },
        '/oauth2': { target: env.BACKEND_URL || 'http://localhost:8080', changeOrigin: true },
        '/login': { target: env.BACKEND_URL || 'http://localhost:8080', changeOrigin: true },
        '/logout': { target: env.BACKEND_URL || 'http://localhost:8080', changeOrigin: true },
        '/ws': { target: (env.BACKEND_URL || 'http://localhost:8080').replace(/^http/, 'ws'), changeOrigin: true, ws: true },
      },
    },
  };
});
