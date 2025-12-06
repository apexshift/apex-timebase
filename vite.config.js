// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'gsap': 'gsap',
      'lenis': 'lenis',
    }
  },
  optimizeDeps: {
    include: ['gsap', 'lenis']
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})