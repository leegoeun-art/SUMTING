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
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/oauth2': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/login': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/logout': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/couples': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/heartPing': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/receiveHeartPing': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/sendHeartPing': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/approveHeartPing': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/push/test': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };
});
