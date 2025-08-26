import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    proxy: {
      '/api': {
        target: 'https://docs-web-backend.onrender.com',
        changeOrigin: true
      }
    }
  }
}) 