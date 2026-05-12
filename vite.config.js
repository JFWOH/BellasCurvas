import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Radix UI components
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            '@radix-ui/react-popover',
          ],
          // Supabase SDK — carregado apenas quando usado
          'vendor-supabase': ['@supabase/supabase-js'],
          // React Query
          'vendor-query': ['@tanstack/react-query'],
          // Animações e UI pesado
          'vendor-motion': ['framer-motion'],
          // Recharts (gráficos)
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
})
