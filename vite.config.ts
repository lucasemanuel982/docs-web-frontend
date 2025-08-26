import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: import.meta.env.VITE_PORT || 3000,
    proxy: {
      '/api': {
        target: 'https://docs-web-backend.onrender.com',
        changeOrigin: true
      }
    }
  }
}) 