import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/hotels': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/bookings': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})