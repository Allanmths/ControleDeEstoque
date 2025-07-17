import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Controle1/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'papaparse', 'html2canvas', 'dompurify']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  define: {
    'process.env': {}
  }
})
