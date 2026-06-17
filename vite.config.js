import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          particles: [
            '@tsparticles/react',
            '@tsparticles/slim',
            'react-tsparticles',
            'tsparticles',
          ],
          motion: ['framer-motion'],
          i18n: [
            'i18next',
            'i18next-browser-languagedetector',
            'react-i18next',
          ],
        },
      },
    },
  },
  server: {
    port: 3001,
    open: true
  }
})
