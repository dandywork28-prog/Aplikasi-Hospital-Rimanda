import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables (even those without VITE_ prefix)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Polyfill process.env.API_KEY to avoid "process is not defined" runtime crash
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill generic process.env as empty object for safety
      'process.env': {}
    }
  };
});