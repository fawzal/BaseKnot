import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          flow: ['@xyflow/react'],
          supabase: ['@supabase/supabase-js'],
          radix: ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-slot'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
