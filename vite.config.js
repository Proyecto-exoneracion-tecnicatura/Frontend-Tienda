import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_AUTH_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/oauth': {
        target: process.env.VITE_AUTH_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
